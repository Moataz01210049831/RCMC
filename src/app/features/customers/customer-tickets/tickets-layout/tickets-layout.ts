import { Component, EventEmitter, OnInit, Output, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerCard } from '../../../../shared/components/customer-card/customer-card';
import { Pager } from '../../../../shared/components/pager/pager';
import { CustomerService } from '../../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../../core/services/lookup.service';
import { SelectedEntityService } from '../../../../core/services/selected-entity.service';
import { ComplaintsService } from '../../../../core/services/complaints.service';
import { buildTicketDetail } from '../../../../core/utils/ticket-detail.util';
import { CustomerCardData } from '../../../../core/models/customer-card.model';
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
  imports: [TranslateModule, CustomerCard, Pager],
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
  // Server-reported total for the active complaints search (drives pagination).
  private complaintsTotal = signal(0);
  private complaintsSearchTimer: ReturnType<typeof setTimeout> | null = null;

  tickets = computed<TicketListItem[]>(() => {
    if (this.activeType() === 'complaints') {
      // Complaints come pre-filtered and pre-paged from the server.
      return this.complaintsList();
    }
    const all = MOCK_TICKETS[this.activeType()] ?? [];
    const term = this.searchTerm().trim().toLowerCase();
    return term ? all.filter(t => t.code.toLowerCase().includes(term)) : all;
  });

  // ── Pagination ────────────────────────────────────────────────────
  readonly pageSize = 200;
  currentPage = signal(1);

  totalPages = computed(() => {
    if (this.activeType() === 'complaints') {
      return Math.max(1, Math.ceil(this.complaintsTotal() / this.pageSize));
    }
    return Math.max(1, Math.ceil(this.tickets().length / this.pageSize));
  });

  pagedTickets = computed<TicketListItem[]>(() => {
    // Server-paginated tabs (complaints) — list is already one page.
    if (this.activeType() === 'complaints') return this.tickets();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * this.pageSize;
    return this.tickets().slice(start, start + this.pageSize);
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
  ) {
    // Refetch complaints from /Complain/search whenever the page,
    // search term, or active tab changes (debounced for typing).
    effect(() => {
      const term = this.searchTerm();
      const page = this.currentPage();
      const type = this.activeType();
      if (type !== 'complaints') return;
      const contactId = this.route.snapshot.paramMap.get('id') ?? '';
      if (!contactId) return;
      if (this.complaintsSearchTimer) clearTimeout(this.complaintsSearchTimer);
      this.complaintsSearchTimer = setTimeout(() => {
        this.searchComplaints(contactId, term, page);
      }, term.trim() === '' ? 0 : 300);
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    const type = (this.route.snapshot.paramMap.get('type') as TicketType) ?? 'complaints';
    const preselected = this.route.snapshot.queryParamMap.get('selected') ?? '';
    this.activeType.set(type);
    if (preselected) this.selectedCode.set(preselected);

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
        isVipCR:     (contact.commercialRecords ?? []).some(r => r.isVipCR),
        isMain:      (contact.commercialRecords ?? []).some(r => r.crData?.crInformation?.isMain),
      });
    });
    // The complaints effect handles the initial /Complain/search call too.
  }

  private searchComplaints(contactId: string, term: string, page: number) {
    this.complaintsService.searchComplaints({
      ContactId:    contactId,
      TicketNumber: term.trim(),
      Status:       '',
      FromDate:     '',
      ToDate:       '',
      PageNumber:   page,
      PageSize:     this.pageSize,
      OrderBy:      0,
    }).subscribe({
      next: result => {
        this.complaintsList.set(
          result.data.map(t => ({
            code:       t.TicketNumber,
            statusKey:  t.CaseCurrentStatus || '-',
            incidentId: t.IncidentId,
          })),
        );
        this.complaintsTotal.set(result.totalCount);
        if (this.activeType() === 'complaints') this.refreshActiveTicket();
      },
    });
  }

  refreshAndSelectComplaint(ticketNumber: string) {
    this.activeType.set('complaints');
    this.selectedCode.set(ticketNumber);
    this.searchTerm.set('');
    this.currentPage.set(1);
    // Force a refetch even if signals didn't actually change.
    const contactId = this.route.snapshot.paramMap.get('id') ?? '';
    if (contactId) this.searchComplaints(contactId, '', 1);
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
          const detail = data ? buildTicketDetail(data, match.code) : buildMockDetail(match);
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

  selectTab(type: TicketType) {
    this.activeType.set(type);
    this.selectedCode.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
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
    this.currentPage.set(1);
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
