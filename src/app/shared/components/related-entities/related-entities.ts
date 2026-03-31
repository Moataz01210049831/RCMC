import { Component, signal, computed } from '@angular/core';

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

interface Entity {
  id: number;
  name: string;
  number: string;
  serviceCards: ServiceCard[];
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
    {
      id: 1,
      name: 'فرد',
      number: '1234567891',
      serviceCards: [
        { title: 'الطلبات',     count: 5,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A1111111', status: 'جديد' }, { code: 'A1111112', status: 'جديد' }] },
        { title: 'الاستفسارات', count: 3,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A1111113', status: 'مغلق' }] },
        { title: 'الاقتراحات',  count: 1,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A1111114', status: 'قيد المعالجة' }] },
        { title: 'الشكاوي',     count: 2,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A1111115', status: 'اعادة فتح' }, { code: 'A1111116', status: 'اعادة فتح' }] },
      ],
    },
    {
      id: 2,
      name: 'العرض للتقن',
      number: '34567891234',
      serviceCards: [
        { title: 'الطلبات',     count: 12, description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A8373482', status: 'اعادة فتح' }, { code: 'A8373483', status: 'اعادة فتح' }, { code: 'A8373484', status: 'اعادة فتح' }] },
        { title: 'الاستفسارات', count: 12, description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A8373482', status: 'اعادة فتح' }, { code: 'A8373483', status: 'اعادة فتح' }, { code: 'A8373484', status: 'اعادة فتح' }] },
        { title: 'الاقتراحات',  count: 12, description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A8373482', status: 'اعادة فتح' }, { code: 'A8373483', status: 'اعادة فتح' }, { code: 'A8373484', status: 'اعادة فتح' }] },
        { title: 'الشكاوي',     count: 12, description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'A8373482', status: 'اعادة فتح' }, { code: 'A8373483', status: 'اعادة فتح' }, { code: 'A8373484', status: 'اعادة فتح' }] },
      ],
    },
    {
      id: 3,
      name: 'العرض للتقن',
      number: '34567891234',
      serviceCards: [
        { title: 'الطلبات',     count: 8,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'B1234567', status: 'قيد المعالجة' }, { code: 'B1234568', status: 'قيد المعالجة' }] },
        { title: 'الاستفسارات', count: 4,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'B1234569', status: 'مغلق' }] },
        { title: 'الاقتراحات',  count: 0,  description: 'نص إضافي لمحتوى البطاقة', items: [] },
        { title: 'الشكاوي',     count: 6,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'B1234570', status: 'اعادة فتح' }, { code: 'B1234571', status: 'جديد' }] },
      ],
    },
    {
      id: 4,
      name: 'العرض للتقن',
      number: '34567891234',
      serviceCards: [
        { title: 'الطلبات',     count: 20, description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'C9999991', status: 'جديد' }, { code: 'C9999992', status: 'اعادة فتح' }, { code: 'C9999993', status: 'مغلق' }] },
        { title: 'الاستفسارات', count: 7,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'C9999994', status: 'قيد المعالجة' }] },
        { title: 'الاقتراحات',  count: 3,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'C9999995', status: 'جديد' }] },
        { title: 'الشكاوي',     count: 9,  description: 'نص إضافي لمحتوى البطاقة', items: [{ code: 'C9999996', status: 'اعادة فتح' }, { code: 'C9999997', status: 'اعادة فتح' }] },
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
