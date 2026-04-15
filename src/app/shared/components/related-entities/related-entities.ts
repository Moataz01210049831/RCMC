import { Component, signal, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
  id: number;
  nameKey: string;
  number: string;
  serviceCards: ServiceCard[];
}

const TITLE_TO_TYPE: Record<string, string> = {
  'ENTITIES.COMPLAINTS': 'complaints',
  'ENTITIES.REQUESTS': 'requests',
  'ENTITIES.INQUIRIES': 'inquiries',
  'ENTITIES.SUGGESTIONS': 'suggestions',
};

@Component({
  selector: 'app-related-entities',
  imports: [TranslateModule],
  templateUrl: './related-entities.html',
  styleUrl: './related-entities.scss',
})
export class RelatedEntities {
  customerId = input<string>('');
  selectedEntityId = signal(1);

  constructor(private router: Router) {}

  openTickets(titleKey: string) {
    const type = TITLE_TO_TYPE[titleKey];
    if (type && this.customerId()) {
      this.router.navigate(['/customers', this.customerId(), 'tickets', type]);
    }
  }

  entities: Entity[] = [
    {
      id: 1,
      nameKey: 'ENTITIES.INDIVIDUAL',
      number: '1234567891',
      serviceCards: [
        { titleKey: 'ENTITIES.REQUESTS',     count: 5,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A1111111', statusKey: 'STATUS.NEW' }, { code: 'A1111112', statusKey: 'STATUS.NEW' }] },
        { titleKey: 'ENTITIES.INQUIRIES',    count: 3,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A1111113', statusKey: 'STATUS.CLOSED' }] },
        { titleKey: 'ENTITIES.SUGGESTIONS',  count: 1,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A1111114', statusKey: 'STATUS.IN_PROGRESS' }] },
        { titleKey: 'ENTITIES.COMPLAINTS',   count: 2,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A1111115', statusKey: 'STATUS.REOPENED' }, { code: 'A1111116', statusKey: 'STATUS.REOPENED' }] },
      ],
    },
    {
      id: 2,
      nameKey: 'ENTITIES.BUSINESS_NAME',
      number: '34567891234',
      serviceCards: [
        { titleKey: 'ENTITIES.REQUESTS',     count: 12, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A8373482', statusKey: 'STATUS.REOPENED' }, { code: 'A8373483', statusKey: 'STATUS.REOPENED' }, { code: 'A8373484', statusKey: 'STATUS.REOPENED' }] },
        { titleKey: 'ENTITIES.INQUIRIES',    count: 12, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A8373482', statusKey: 'STATUS.REOPENED' }, { code: 'A8373483', statusKey: 'STATUS.REOPENED' }, { code: 'A8373484', statusKey: 'STATUS.REOPENED' }] },
        { titleKey: 'ENTITIES.SUGGESTIONS',  count: 12, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A8373482', statusKey: 'STATUS.REOPENED' }, { code: 'A8373483', statusKey: 'STATUS.REOPENED' }, { code: 'A8373484', statusKey: 'STATUS.REOPENED' }] },
        { titleKey: 'ENTITIES.COMPLAINTS',   count: 12, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'A8373482', statusKey: 'STATUS.REOPENED' }, { code: 'A8373483', statusKey: 'STATUS.REOPENED' }, { code: 'A8373484', statusKey: 'STATUS.REOPENED' }] },
      ],
    },
    {
      id: 3,
      nameKey: 'ENTITIES.BUSINESS_NAME',
      number: '34567891234',
      serviceCards: [
        { titleKey: 'ENTITIES.REQUESTS',     count: 8,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'B1234567', statusKey: 'STATUS.IN_PROGRESS' }, { code: 'B1234568', statusKey: 'STATUS.IN_PROGRESS' }] },
        { titleKey: 'ENTITIES.INQUIRIES',    count: 4,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'B1234569', statusKey: 'STATUS.CLOSED' }] },
        { titleKey: 'ENTITIES.SUGGESTIONS',  count: 0,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [] },
        { titleKey: 'ENTITIES.COMPLAINTS',   count: 6,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'B1234570', statusKey: 'STATUS.REOPENED' }, { code: 'B1234571', statusKey: 'STATUS.NEW' }] },
      ],
    },
    {
      id: 4,
      nameKey: 'ENTITIES.BUSINESS_NAME',
      number: '34567891234',
      serviceCards: [
        { titleKey: 'ENTITIES.REQUESTS',     count: 20, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'C9999991', statusKey: 'STATUS.NEW' }, { code: 'C9999992', statusKey: 'STATUS.REOPENED' }, { code: 'C9999993', statusKey: 'STATUS.CLOSED' }] },
        { titleKey: 'ENTITIES.INQUIRIES',    count: 7,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'C9999994', statusKey: 'STATUS.IN_PROGRESS' }] },
        { titleKey: 'ENTITIES.SUGGESTIONS',  count: 3,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'C9999995', statusKey: 'STATUS.NEW' }] },
        { titleKey: 'ENTITIES.COMPLAINTS',   count: 9,  descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [{ code: 'C9999996', statusKey: 'STATUS.REOPENED' }, { code: 'C9999997', statusKey: 'STATUS.REOPENED' }] },
      ],
    },
  ];

  activeServiceCards = computed(() =>
    this.entities.find(e => e.id === this.selectedEntityId())?.serviceCards ?? []
  );

  selectEntity(id: number) {
    this.selectedEntityId.set(id);
  }
}
