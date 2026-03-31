import { Component, signal } from '@angular/core';

interface Entity {
  id: number;
  name: string;
  number: string;
}

interface ServiceItem {
  code: string;
  status: string;
}

interface ServiceCard {
  title: string;
  count: number;
  description: string;
  items: ServiceItem[];
}

@Component({
  selector: 'app-related-entities',
  imports: [],
  templateUrl: './related-entities.html',
  styleUrl: './related-entities.scss',
})
export class RelatedEntities {
  selectedEntityId = signal(2);

  entities: Entity[] = [
    { id: 1, name: 'فرد',           number: '1234567891'  },
    { id: 2, name: 'العرض للتقن',   number: '34567891234' },
    { id: 3, name: 'العرض للتقن',   number: '34567891234' },
    { id: 4, name: 'العرض للتقن',   number: '34567891234' },
  ];

  serviceCards: ServiceCard[] = [
    {
      title: 'الطلبات',
      count: 12,
      description: 'نص إضافي لمحتوى البطاقة',
      items: [
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
      ],
    },
    {
      title: 'الاستفسارات',
      count: 12,
      description: 'نص إضافي لمحتوى البطاقة',
      items: [
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
      ],
    },
    {
      title: 'الاقتراحات',
      count: 12,
      description: 'نص إضافي لمحتوى البطاقة',
      items: [
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
      ],
    },
    {
      title: 'الشكاوي',
      count: 12,
      description: 'نص إضافي لمحتوى البطاقة',
      items: [
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
        { code: 'A8373482', status: 'اعادة فتح' },
      ],
    },
  ];

  selectEntity(id: number) {
    this.selectedEntityId.set(id);
  }
}
