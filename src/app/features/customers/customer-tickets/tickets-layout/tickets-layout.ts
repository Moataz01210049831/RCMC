import { Component, EventEmitter, OnInit, Output, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerCard } from '../../../../shared/components/customer-card/customer-card';
import { CustomerService } from '../../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../../core/services/lookup.service';
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

  tickets = computed<TicketListItem[]>(() => {
    const all = MOCK_TICKETS[this.activeType()] ?? [];
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return all;
    return all.filter(t => t.code.toLowerCase().includes(term));
  });

  activeTicket = computed<TicketDetail | null>(() => {
    const code = this.selectedCode();
    const list = this.tickets();
    const match = list.find(t => t.code === code) ?? list[0];
    return match ? buildMockDetail(match) : null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private translate: TranslateService,
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
        this.activeTicketChange.emit(this.activeTicket());
        return;
      }

      const resolveName = (items: LookupItem[], value: string) =>
        items.find(i => i.value === value)?.name ?? '-';

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
      });

      this.activeTicketChange.emit(this.activeTicket());
    });
  }

  selectTab(type: TicketType) {
    this.activeType.set(type);
    this.selectedCode.set('');
    this.searchTerm.set('');
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/customers', id, 'tickets', type], { replaceUrl: true });
    this.tabChange.emit(type);
    this.activeTicketChange.emit(this.activeTicket());
  }

  selectTicket(code: string) {
    this.selectedCode.set(code);
    this.activeTicketChange.emit(this.activeTicket());
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
