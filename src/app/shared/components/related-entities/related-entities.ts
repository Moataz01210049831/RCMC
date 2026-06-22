import { Component, computed, effect, EventEmitter, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Pager } from '../pager/pager';
import { CommercialRegisterService } from '../../../core/services/commercial-register.service';
import { SelectedEntityService } from '../../../core/services/selected-entity.service';
import { ComplaintsService } from '../../../core/services/complaints.service';
import { LookupService } from '../../../core/services/lookup.service';
import { EntityCardData } from '../../../core/models/customer-card.model';
import { RelatedCR } from '../../../core/models/person-related.model';
import { RelatedTicket } from '../../../core/models/related-ticket.model';

interface ServiceItem {
  code: string;
  statusKey: string;
}

interface ServiceCard {
  titleKey: string;
  count: number;
  descriptionKey: string;
  items: ServiceItem[];
}

interface Entity {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  isPerson: boolean;
  serviceCards: ServiceCard[];
}

const TITLE_TO_TYPE: Record<string, string> = {
  'ENTITIES.COMPLAINTS': 'complaints',
  'ENTITIES.REQUESTS': 'requests',
  'ENTITIES.INQUIRIES': 'inquiries',
  'ENTITIES.SUGGESTIONS': 'suggestions',
};

const EMPTY_SERVICE_CARDS: ServiceCard[] = [
  { titleKey: 'ENTITIES.REQUESTS',    count: 0, descriptionKey: '', items: [] },
  { titleKey: 'ENTITIES.INQUIRIES',   count: 0, descriptionKey: '', items: [] },
  { titleKey: 'ENTITIES.SUGGESTIONS', count: 0, descriptionKey: '', items: [] },
  { titleKey: 'ENTITIES.COMPLAINTS',  count: 0, descriptionKey: '', items: [] },
];

@Component({
  selector: 'app-related-entities',
  imports: [TranslateModule, FormsModule, Pager],
  templateUrl: './related-entities.html',
  styleUrl: './related-entities.scss',
})
export class RelatedEntities {
  customerId       = input<string>('');
  identityNumber   = input<string>('');
  identityTypeId   = input<number>(0);
  nationalityId    = input<number>(0);

  @Output() entitySelected = new EventEmitter<EntityCardData | null>();

  entities = signal<Entity[]>([]);
  selectedEntityId = signal<string>('');

  // Pagination — 5 items per service card, page tracked per card title.
  readonly pageSize = 5;
  private pages = signal<Record<string, number>>({});

  pageFor(titleKey: string): number {
    return this.pages()[titleKey] ?? 1;
  }

  totalPagesFor(titleKey: string): number {
    const card = this.activeServiceCards().find(c => c.titleKey === titleKey);
    return Math.max(1, Math.ceil((card?.items.length ?? 0) / this.pageSize));
  }

  pagedItemsFor(titleKey: string): ServiceItem[] {
    const card = this.activeServiceCards().find(c => c.titleKey === titleKey);
    if (!card) return [];
    const page = Math.min(this.pageFor(titleKey), this.totalPagesFor(titleKey));
    const start = (page - 1) * this.pageSize;
    return card.items.slice(start, start + this.pageSize);
  }

  setPage(titleKey: string, page: number) {
    this.pages.update(p => ({ ...p, [titleKey]: page }));
  }

  private rawRelatedCRs: RelatedCR[] = [];
  private complaintTickets = signal<RelatedTicket[]>([]);

  // Cached GUIDs from /Lookups/entity-types — Individual for فرد, Business for a CR.
  private individualEntityTypeId = '';
  private businessEntityTypeId = '';

  // ── CR search dialog (kept here so it sits inside the entities panel) ─
  searchQuery = '';
  // Translation key for the header-search inline error, or '' when valid.
  headerSearchError = signal<string>('');
  showSearchDialog = signal(false);
  dialogCrInput = '';
  searchSelectedCr = signal<string>('');
  searchEntityName = signal<string>('');
  searchNotFound = signal(false);

  constructor(
    private router: Router,
    private commercialRegister: CommercialRegisterService,
    private translate: TranslateService,
    private selectedEntityService: SelectedEntityService,
    private complaintsService: ComplaintsService,
    private lookupService: LookupService,
  ) {
    this.lookupService.getEntityTypes().subscribe({
      next: types => {
        this.individualEntityTypeId = types.find(t => t.Name === 'Individual')?.Value ?? '';
        this.businessEntityTypeId   = types.find(t => t.Name === 'Business')?.Value   ?? '';
      },
    });
    effect(() => {
      const idNo = this.identityNumber();
      if (idNo) this.loadRelated(idNo, this.identityTypeId());
    });
    effect(() => {
      const id = this.customerId();
      if (id) this.loadComplaintTickets(id);
      else this.complaintTickets.set([]);
    });
  }

  private loadComplaintTickets(customerId: string) {
    // Card paginates client-side, so pull a large page in one shot.
    this.complaintsService.searchComplaints({
      ContactId:    customerId,
      TicketNumber: '',
      Status:       '',
      FromDate:     '',
      ToDate:       '',
      PageNumber:   1,
      PageSize:     200,
      OrderBy:      0,
    }).subscribe({
      next: result => this.complaintTickets.set(result.data),
    });
  }

  private buildPersonEntity(identifierNo: string): Entity {
    return {
      id: `person-${identifierNo}`,
      nameAr: this.translate.instant('ENTITIES.INDIVIDUAL'),
      nameEn: this.translate.instant('ENTITIES.INDIVIDUAL'),
      number: identifierNo,
      isPerson: true,
      serviceCards: EMPTY_SERVICE_CARDS,
    };
  }

  private loadRelated(identifierNo: string, identifierTypeId: number) {
    const personEntity = this.buildPersonEntity(identifierNo);
    this.entities.set([personEntity]);
    this.selectedEntityId.set(personEntity.id);

    this.commercialRegister
      .getPersonRelated({
        IdentifierTypeID: identifierTypeId,
        IdentifierNo: identifierNo,
      })
      .subscribe({
        next: data => {
          if (!data) return;
          this.rawRelatedCRs = data.RelatedCRList ?? [];
          this.crListByNumber.clear();
          this.rawRelatedCRs.forEach(cr =>
            this.crListByNumber.set(cr.CrBasicInfo.CrNumber, {
              CrNationalNumber: cr.CrBasicInfo.CrNationalNumber,
              CrNumber:         cr.CrBasicInfo.CrNumber,
            }),
          );
          const businessEntities: Entity[] = this.rawRelatedCRs.map(cr => ({
            id:       cr.CrBasicInfo.CrNumber,
            nameAr:   cr.CrBasicInfo.EntityFullNameAr,
            nameEn:   cr.CrBasicInfo.EntityFullNameEn,
            number:   cr.CrBasicInfo.CrNumber,
            isPerson: false,
            serviceCards: EMPTY_SERVICE_CARDS,
          }));
          this.entities.set([personEntity, ...businessEntities]);
          this.selectedEntityService.setContext({
            parityNameAr:      data.ParityNameAr ?? '',
            parityNameEn:      data.ParityNameEn ?? '',
            identifierNo:      data.IdentifierNo ?? identifierNo,
            identifierType:    data.IdentifierType ?? null,
            selectedRelatedCR: null,
            entityTypeId:      this.individualEntityTypeId,
          });
          // Keep "فرد" selected by default — don't reset selection here.
          this.publishEntity(null);
        },
      });
  }

  private crListByNumber = new Map<string, { CrNationalNumber: string; CrNumber: string }>();

  private loadEntityDetails(crNumber: string, onLoaded?: (entity: EntityCardData | null) => void) {
    const cr = this.crListByNumber.get(crNumber);
    if (!cr) {
      onLoaded?.(null);
      return;
    }
    this.commercialRegister
      .getDetails({ CRNationalNumber: cr.CrNationalNumber, CRNumber: cr.CrNumber })
      .subscribe({
        next: data => {
          if (!data) {
            onLoaded?.(null);
            return;
          }
          const isEn = this.translate.currentLang === 'en';
          onLoaded?.({
            companyName:   isEn ? data.CrInformation.EntityFullNameEn : data.CrInformation.EntityFullNameAr,
            entityType:    isEn ? data.CrInformation.CrStatus.CrStatusDescEn : data.CrInformation.CrStatus.CrStatusDescAr,
            crNumber:      data.CrInformation.CrNumber,
            unifiedNumber: data.CrInformation.CrNationalNumber,
            phone:         data.ContactInformation?.PhoneNo ?? '',
          });
        },
        error: () => onLoaded?.(null),
      });
  }

  private publishEntity(entity: EntityCardData | null) {
    this.selectedEntityService.set(entity);
    this.entitySelected.emit(entity);
  }

  entityName(entity: Entity): string {
    return this.translate.currentLang === 'en' ? entity.nameEn : entity.nameAr;
  }

  activeServiceCards = computed<ServiceCard[]>(() => {
    const id = this.selectedEntityId();
    if (!id) return [];
    // فرد uses the customer-level endpoint; company tabs stay empty until
    // the per-CR tickets API is wired in.
    const isPerson = id.startsWith('person-');
    const complaintItems: ServiceItem[] = isPerson
      ? this.complaintTickets().map(t => ({
          code:      t.TicketNumber,
          statusKey: t.CaseCurrentStatus || '-',
        }))
      : [];
    return [
      { titleKey: 'ENTITIES.REQUESTS',    count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.INQUIRIES',   count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.SUGGESTIONS', count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.COMPLAINTS',  count: complaintItems.length, descriptionKey: '', items: complaintItems },
    ];
  });

  selectEntity(id: string) {
    this.selectedEntityId.set(id);
    this.pages.set({});
    this.syncEntityContext(id);
    // Refresh the customer card to reflect the chosen entity: company info
    // for a CR tab, cleared for فرد.
    if (id.startsWith('person-')) {
      this.publishEntity(null);
      return;
    }
    // Publish whatever we already know from /PersonRelated immediately so the
    // customer card doesn't sit blank, then enrich with /GetDetails (phone, etc).
    const cached = this.entityFromRelatedCR(id);
    if (cached) this.publishEntity(cached);
    this.loadEntityDetails(id, entity => {
      if (entity) this.publishEntity(entity);
    });
  }

  private entityFromRelatedCR(crNumber: string): EntityCardData | null {
    const cr = this.rawRelatedCRs.find(c => c.CrBasicInfo.CrNumber === crNumber);
    if (!cr) return null;
    const isEn = this.translate.currentLang === 'en';
    return {
      companyName:   isEn ? cr.CrBasicInfo.EntityFullNameEn : cr.CrBasicInfo.EntityFullNameAr,
      entityType:    isEn ? cr.CrBasicInfo.CrStatus.CrStatusDescEn : cr.CrBasicInfo.CrStatus.CrStatusDescAr,
      crNumber:      cr.CrBasicInfo.CrNumber,
      unifiedNumber: cr.CrBasicInfo.CrNationalNumber,
      phone:         '',
    };
  }

  // Mirror the active tab into SelectedEntityService context so any create
  // form opened next (complaint, inquiry, ...) picks up the right entityTypeId
  // and selectedRelatedCR — even before a service card is clicked.
  private syncEntityContext(id: string) {
    const ctx = this.selectedEntityService.context();
    if (!ctx) return;
    const selectedCR = this.rawRelatedCRs.find(cr => cr.CrBasicInfo.CrNumber === id) ?? null;
    this.selectedEntityService.setContext({
      ...ctx,
      selectedRelatedCR: selectedCR,
      entityTypeId:      selectedCR ? this.businessEntityTypeId : this.individualEntityTypeId,
    });
  }

  // True when a company tab is the active selection. Ticket creation against
  // company entities is intentionally disabled until the per-CR APIs are wired.
  isCompanySelected = computed(() => {
    const id = this.selectedEntityId();
    return !!id && !id.startsWith('person-');
  });

  openTickets(titleKey: string, selectedCode?: string) {
    const type = TITLE_TO_TYPE[titleKey];
    if (!type || !this.customerId()) return;
    // Block navigation for company tabs — creation flow stays customer-only for now.
    if (this.isCompanySelected()) return;
    const queryParams = selectedCode ? { selected: selectedCode } : undefined;
    const id = this.selectedEntityId();

    this.syncEntityContext(id);
    this.router.navigate(['/customers', this.customerId(), 'tickets', type], { queryParams });
  }

  openTicketItem(titleKey: string, code: string, event: MouseEvent) {
    event.stopPropagation();
    this.openTickets(titleKey, code);
  }

  // ── CR search dialog ─────────────────────────────────────────────
  // Strip non-digits from the header search input on every keystroke.
  onHeaderSearchInput(event: Event) {
    const cleaned = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 10);
    this.searchQuery = cleaned;
    (event.target as HTMLInputElement).value = cleaned;
    if (this.headerSearchError()) this.headerSearchError.set('');
  }

  openSearchDialog() {
    const q = this.searchQuery.trim();
    // Required.
    if (!q) {
      this.headerSearchError.set('ENTITIES.SEARCH_CR_REQUIRED');
      return;
    }
    // CR numbers are 10 digits (e.g. "1010123456").
    if (!/^[0-9]{10}$/.test(q)) {
      this.headerSearchError.set('ENTITIES.SEARCH_CR_INVALID');
      return;
    }
    this.headerSearchError.set('');
    // Seed the dialog from the header search box and run the lookup so the
    // user sees results immediately. They can still refine inside the dialog.
    this.dialogCrInput = q;
    this.searchSelectedCr.set('');
    this.searchEntityName.set('');
    this.searchNotFound.set(false);
    this.showSearchDialog.set(true);
    this.runCrLookup();
  }

  closeSearchDialog() {
    this.showSearchDialog.set(false);
  }

  // Look up the typed CR number. Currently scans the customer's related CRs;
  // swap for the real "search CR" endpoint when it's available.
  runCrLookup() {
    const q = this.dialogCrInput.trim();
    if (!q) {
      this.searchSelectedCr.set('');
      this.searchEntityName.set('');
      this.searchNotFound.set(false);
      return;
    }
    const cr = this.rawRelatedCRs.find(c => c.CrBasicInfo.CrNumber === q);
    if (!cr) {
      this.searchSelectedCr.set('');
      this.searchEntityName.set('');
      this.searchNotFound.set(true);
      return;
    }
    const isEn = this.translate.currentLang === 'en';
    this.searchSelectedCr.set(cr.CrBasicInfo.CrNumber);
    this.searchEntityName.set(isEn ? cr.CrBasicInfo.EntityFullNameEn : cr.CrBasicInfo.EntityFullNameAr);
    this.searchNotFound.set(false);
  }

  // Stub: hook the real "link entity to customer" endpoint here when ready.
  linkSelectedEntity() {
    const id = this.searchSelectedCr();
    if (!id) return;
    this.selectEntity(id);
    this.closeSearchDialog();
  }
}
