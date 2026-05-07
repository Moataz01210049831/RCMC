import { Component, EventEmitter, OnInit, Output, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerCard } from '../../../../shared/components/customer-card/customer-card';
import { CustomerService } from '../../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../../core/services/lookup.service';
import { SelectedEntityService } from '../../../../core/services/selected-entity.service';
import { ComplaintsService } from '../../../../core/services/complaints.service';
import { CustomerCardData } from '../../../../core/models/customer-card.model';
import { ComplainDetailsData } from '../../../../core/models/complain-details.model';
import {
  TABS,
  MOCK_TICKETS,
  buildMockDetail,
  TicketType,
  TicketListItem,
  TicketDetail,
} from './tickets.types';

const GENDER_KEYS: Record<number, string> = { 1: 'CUSTOMER.MALE', 2: 'CUSTOMER.FEMALE' };

@Component({
  selector: 'app-tickets-layout',
  imports: [TranslateModule, CustomerCard],
  templateUrl: './tickets-layout.html',
  styleUrl: './tickets-layout.scss',
})
export class TicketsLayout implements OnInit {
  @Output() activeTicketChange = new EventEmitter<TicketDetail | null>();
  @Output() addClick = new EventEmitter<TicketType>();
  @Output() tabChange = new EventEmitter<TicketType>();

  customer = signal<CustomerCardData | null>(null);
  activeType = signal<TicketType>('complaints');
  selectedCode = signal<string>('');
  searchTerm = signal<string>('');

  tabs = TABS;

  activeTabLabel = computed(() =>
    this.tabs.find(t => t.type === this.activeType())?.labelKey ?? ''
  );

  addLabel = computed(() =>
    this.tabs.find(t => t.type === this.activeType())?.addLabelKey ?? ''
  );

  private complaintsList = signal<TicketListItem[]>([]);

  tickets = computed<TicketListItem[]>(() => {
    const all = this.activeType() === 'complaints'
      ? this.complaintsList()
      : (MOCK_TICKETS[this.activeType()] ?? []);
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return all;
    return all.filter(t => t.code.toLowerCase().includes(term));
  });

  activeTicket = signal<TicketDetail | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private complaintsService: ComplaintsService,
    private translate: TranslateService,
    public selectedEntityService: SelectedEntityService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const type = (this.route.snapshot.paramMap.get('type') as TicketType) ?? 'complaints';
    this.activeType.set(type);

    forkJoin({
      contact:       this.customerService.getContact(id),
      cities:        this.lookupService.getCities(),
      nationalities: this.lookupService.getCountries(),
    }).subscribe(({ contact, cities, nationalities }) => {
      if (!contact) {
        this.customer.set(null);
        this.activeTicketChange.emit(null);
        return;
      }

      const resolveName = (items: LookupItem[], value: string) =>
        items.find(i => i.Value === value)?.Name ?? '-';

      this.customer.set({
        id:          contact.id,
        fullName:    [contact.firstName, contact.middleName, contact.thirdName, contact.lastName]
                       .filter(Boolean).join(' '),
        idNumber:    contact.identityNumber,
        phone:       contact.mobileNumber1,
        birthDate:   contact.dateOfBirth ? contact.dateOfBirth.split('T')[0] : '',
        nationality: resolveName(nationalities, contact.nationalityId),
        gender:      this.translate.instant(GENDER_KEYS[contact.gender] ?? '-'),
        city:        resolveName(cities, contact.cityId),
        CreatedOn:   contact.CreatedOn ? contact.CreatedOn.split('T')[0] : '',
      });
    });

    this.loadComplaints(id);
  }

  private loadComplaints(contactId: string) {
    if (!contactId) return;
    this.complaintsService.getRelatedTicketsByCustomer(contactId).subscribe({
      next: tickets => {
        this.complaintsList.set(
          tickets.map(t => ({
            code: t.TicketNumber,
            statusKey: 'STATUS.UNDER_PROCEDURE',
            incidentId: t.IncidentId,
          })),
        );
        if (this.activeType() === 'complaints') this.refreshActiveTicket();
      },
    });
  }

  private refreshActiveTicket() {
    const code = this.selectedCode();
    const list = this.tickets();
    const match = list.find(t => t.code === code) ?? list[0];
    if (!match) {
      this.activeTicket.set(null);
      this.activeTicketChange.emit(null);
      return;
    }
    if (this.activeType() === 'complaints' && match.incidentId) {
      this.complaintsService.getComplainDetails(match.incidentId).subscribe({
        next: data => {
          const detail = data ? this.toTicketDetail(match, data) : buildMockDetail(match);
          this.activeTicket.set(detail);
          this.activeTicketChange.emit(detail);
        },
      });
      return;
    }
    const detail = buildMockDetail(match);
    this.activeTicket.set(detail);
    this.activeTicketChange.emit(detail);
  }

  private toTicketDetail(item: TicketListItem, d: ComplainDetailsData): TicketDetail {
    const fmtDate = (s: string | null | undefined) => {
      if (!s || s.startsWith('0001-')) return '-';
      return s.replace('T', ' ').slice(0, 19);
    };
    const relatedNumbers = (d.RelatedTickets ?? []).map(t => t.TicketNumber);
    return {
      code:               item.code,
      statusKey:          d.Status ?? item.statusKey,
      commercialEntity:   d.CommercialRecordName ?? '-',
      entityType:         d.EntityTypeName ?? '-',
      entityId:           relatedNumbers.length ? relatedNumbers.join('، ') : '-',
      serviceProvider:    d.ServiceProviderName ?? '-',
      mainService:        d.MainServiceName ?? '-',
      subService:         d.SubServiceName ?? '-',
      mainClassification: d.ComplaintMainCategoryName ?? '-',
      subClassification:  d.ComplaintSubCategoryName ?? '-',
      complaintCategory:  d.ComplaintCategoryName ?? '-',
      requirements:       '-',
      branch:             d.RegionName ?? '-',
      channel:            d.Origin ?? '-',
      createdAt:          fmtDate(d.CreatedOn),
      createdBy:          d.CreatedByContact ?? '-',
      updatedAt:          '-',
      updatedBy:          '-',
      slaDue:             '-',
      description:        d.Description ?? '-',
    };
  }

  selectTab(type: TicketType) {
    this.activeType.set(type);
    this.selectedCode.set('');
    this.searchTerm.set('');
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/customers', id, 'tickets', type], { replaceUrl: true });
    this.tabChange.emit(type);
    this.refreshActiveTicket();
  }

  selectTicket(code: string) {
    this.selectedCode.set(code);
    this.refreshActiveTicket();
  }

  onSearchInput(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onAdd() {
    this.addClick.emit(this.activeType());
  }

  editCustomer() {
    this.router.navigate(['/customers/edit', this.customer()?.id]);
  }

  addEntity() {
    // TODO: navigate to add business entity
  }

  goBack() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/customers', id]);
  }
}
