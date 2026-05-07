import { Component, computed, effect, EventEmitter, input, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommercialRegisterService } from '../../../core/services/commercial-register.service';
import { SelectedEntityService } from '../../../core/services/selected-entity.service';
import { ComplaintsService } from '../../../core/services/complaints.service';
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
  imports: [TranslateModule],
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

  private rawRelatedCRs: RelatedCR[] = [];
  private complaintTickets = signal<RelatedTicket[]>([]);

  constructor(
    private router: Router,
    private commercialRegister: CommercialRegisterService,
    private translate: TranslateService,
    private selectedEntityService: SelectedEntityService,
    private complaintsService: ComplaintsService,
  ) {
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
    this.complaintsService.getRelatedTicketsByCustomer(customerId).subscribe({
      next: tickets => this.complaintTickets.set(tickets),
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
    if (!this.selectedEntityId()) return [];
    const complaintItems: ServiceItem[] = this.complaintTickets().map(t => ({
      code:      t.TicketNumber,
      statusKey: 'STATUS.UNDER_PROCEDURE',
    }));
    return [
      { titleKey: 'ENTITIES.REQUESTS',    count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.INQUIRIES',   count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.SUGGESTIONS', count: 0,                     descriptionKey: '', items: [] },
      { titleKey: 'ENTITIES.COMPLAINTS',  count: complaintItems.length, descriptionKey: '', items: complaintItems },
    ];
  });

  selectEntity(id: string) {
    this.selectedEntityId.set(id);
    // No publish here — entity card stays hidden on the customer page
    // until the user opens one of the service categories below.
  }

  openTickets(titleKey: string, selectedCode?: string) {
    const type = TITLE_TO_TYPE[titleKey];
    if (!type || !this.customerId()) return;
    const queryParams = selectedCode ? { selected: selectedCode } : undefined;
    const navigate = () =>
      this.router.navigate(['/customers', this.customerId(), 'tickets', type], { queryParams });
    const id = this.selectedEntityId();

    // Snapshot which RelatedCR (if any) the user is filing against
    const selectedCR = this.rawRelatedCRs.find(cr => cr.CrBasicInfo.CrNumber === id) ?? null;
    const ctx = this.selectedEntityService.context();
    if (ctx) {
      this.selectedEntityService.setContext({ ...ctx, selectedRelatedCR: selectedCR });
    }

    if (!id) {
      this.publishEntity(null);
      navigate();
      return;
    }
    this.loadEntityDetails(id, entity => {
      this.publishEntity(entity);
      navigate();
    });
  }

  openTicketItem(titleKey: string, code: string, event: MouseEvent) {
    event.stopPropagation();
    this.openTickets(titleKey, code);
  }
}
