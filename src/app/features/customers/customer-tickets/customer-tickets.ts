import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerCard } from '../../../shared/components/customer-card/customer-card';
import { AddTicket } from './add-ticket/add-ticket';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { CustomerCardData } from '../../../core/models/customer-card.model';

const GENDER_KEYS: Record<number, string> = { 1: 'CUSTOMER.MALE', 2: 'CUSTOMER.FEMALE' };

type TicketType = 'complaints' | 'requests' | 'inquiries' | 'suggestions';

interface TicketListItem {
  code: string;
  statusKey: string;
}

interface TicketDetail {
  code: string;
  statusKey: string;
  entityType: string;
  entityId: string;
  mainClassification: string;
  subClassification: string;
  channel: string;
  requirements: string;
  branch: string;
  mainService: string;
  subService: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  slaDue: string;
  description: string;
}

interface TabDef {
  type: TicketType;
  labelKey: string;
  addLabelKey: string;
}

const TABS: TabDef[] = [
  { type: 'complaints',  labelKey: 'TICKETS.COMPLAINTS',  addLabelKey: 'TICKETS.ADD_COMPLAINT'  },
  { type: 'inquiries',   labelKey: 'TICKETS.INQUIRIES',   addLabelKey: 'TICKETS.ADD_INQUIRY'    },
  { type: 'suggestions', labelKey: 'TICKETS.SUGGESTIONS', addLabelKey: 'TICKETS.ADD_SUGGESTION' },
  { type: 'requests',    labelKey: 'TICKETS.REQUESTS',    addLabelKey: 'TICKETS.ADD_REQUEST'    },
];

const MOCK_TICKETS: Record<TicketType, TicketListItem[]> = {
  complaints: [
    { code: 'A8373482', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'B1234567', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'C7654321', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'D9876543', statusKey: 'STATUS.UNDER_PROCEDURE' },
    { code: 'E5432107', statusKey: 'STATUS.UNDER_PROCEDURE' },
  ],
  requests: [
    { code: 'R1000001', statusKey: 'STATUS.NEW' },
    { code: 'R1000002', statusKey: 'STATUS.IN_PROGRESS' },
    { code: 'R1000003', statusKey: 'STATUS.CLOSED' },
  ],
  inquiries: [
    { code: 'I2000001', statusKey: 'STATUS.NEW' },
    { code: 'I2000002', statusKey: 'STATUS.CLOSED' },
  ],
  suggestions: [
    { code: 'S3000001', statusKey: 'STATUS.IN_PROGRESS' },
  ],
};

const ADD_TITLE_KEYS: Record<TicketType, string> = {
  complaints:  'TICKETS.ADD_COMPLAINT',
  requests:    'TICKETS.ADD_REQUEST',
  inquiries:   'TICKETS.ADD_INQUIRY',
  suggestions: 'TICKETS.ADD_SUGGESTION',
};

@Component({
  selector: 'app-customer-tickets',
  imports: [TranslateModule, CustomerCard, AddTicket],
  templateUrl: './customer-tickets.html',
  styleUrl: './customer-tickets.scss',
})
export class CustomerTickets implements OnInit {
  customer = signal<CustomerCardData | null>(null);
  activeType = signal<TicketType>('complaints');
  selectedTicketCode = signal<string>('');
  searchTerm = signal<string>('');
  mode = signal<'view' | 'add'>('view');

  tabs = TABS;

  addTitleKey = computed(() => ADD_TITLE_KEYS[this.activeType()]);

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
    const code = this.selectedTicketCode();
    const list = this.tickets();
    const match = list.find(t => t.code === code) ?? list[0];
    if (!match) return null;
    return this.buildDetail(match);
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
      const resolveName = (items: LookupItem[], value: string) =>
        items.find(i => i.value === value)?.name ?? '-';

      this.customer.set({
        id:          contact.id,
        fullName:    [contact.firstName, contact.middleName, contact.thirdName, contact.lastName]
                       .filter(Boolean).join(' '),
        idNumber:    contact.identityNumber,
        phone:       contact.mobileNumber1,
        birthDate:   contact.dateOfBirth.split('T')[0],
        nationality: resolveName(nationalities, contact.nationalityId),
        gender:      this.translate.instant(GENDER_KEYS[contact.gender] ?? '-'),
        city:        resolveName(cities, contact.cityId),
      });
    });
  }

  selectTab(type: TicketType) {
    this.activeType.set(type);
    this.selectedTicketCode.set('');
    this.searchTerm.set('');
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.router.navigate(['/customers', id, 'tickets', type], { replaceUrl: true });
  }

  selectTicket(code: string) {
    this.selectedTicketCode.set(code);
  }

  onSearchInput(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onAdd() {
    this.mode.set('add');
  }

  cancelAdd() {
    this.mode.set('view');
  }

  onAddSubmitted() {
    // TODO: persist form payload
    this.mode.set('view');
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

  private buildDetail(item: TicketListItem): TicketDetail {
    return {
      code: item.code,
      statusKey: item.statusKey,
      entityType: 'العرض للتقن',
      entityId: 'A8373465',
      mainClassification: 'مشكلة دخول الحساب',
      subClassification: 'رمز التحقق فعمل',
      channel: 'مركز الاتصال',
      requirements: 'نسخ للضم كريم',
      branch: 'الوزارة',
      mainService: 'سجل تجاري',
      subService: 'طباعة السجل التجاري',
      createdAt: '12/2/2025 12:23pm',
      createdBy: 'عزت مجد',
      updatedAt: '12/2/2025 12:23pm',
      updatedBy: 'عزت مجد',
      slaDue: '2 ساعة',
      description:
        'هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيليه القارئ عن التركيز على الشكل الخارجي للنص أو شكل توضع الفقرات في الصفحة التي يقرأها.',
    };
  }
}
