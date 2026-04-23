import { Component, computed, effect, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommercialRegisterService } from '../../../core/services/commercial-register.service';

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
  { titleKey: 'ENTITIES.REQUESTS',    count: 0, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [] },
  { titleKey: 'ENTITIES.INQUIRIES',   count: 0, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [] },
  { titleKey: 'ENTITIES.SUGGESTIONS', count: 0, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [] },
  { titleKey: 'ENTITIES.COMPLAINTS',  count: 0, descriptionKey: 'ENTITIES.ADDITIONAL_TEXT', items: [] },
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

  entities = signal<Entity[]>([]);
  selectedEntityId = signal<string>('');

  constructor(
    private router: Router,
    private commercialRegister: CommercialRegisterService,
    private translate: TranslateService,
  ) {
    effect(() => {
      const idNo = this.identityNumber();
      if (!idNo) return;
      this.loadRelated(idNo, this.identityTypeId(), this.nationalityId());
    });
  }

  private loadRelated(identifierNo: string, identifierTypeId: number, nationalityId: number) {
    this.commercialRegister
      .getPersonRelated({
        IdentifierTypeID: identifierTypeId,
        IdentifierNo: identifierNo,
        NationalityID: nationalityId,
        Limit: 0,
        Offset: 0,
      })
      .subscribe({
        next: data => {
          if (!data) return;
          const businessEntities: Entity[] = (data.RelatedCRList ?? []).map(cr => ({
            id: cr.CrNumber,
            nameAr: cr.EntityFullNameAr,
            nameEn: cr.EntityFullNameEn,
            number: cr.CrNumber,
            isPerson: false,
            serviceCards: EMPTY_SERVICE_CARDS,
          }));
          this.entities.set(businessEntities);
          this.selectedEntityId.set(businessEntities[0]?.id ?? '');
        },
      });
  }

  entityName(entity: Entity): string {
    return this.translate.currentLang === 'en' ? entity.nameEn : entity.nameAr;
  }

  activeServiceCards = computed(() =>
    this.entities().find(e => e.id === this.selectedEntityId())?.serviceCards ?? []
  );

  selectEntity(id: string) {
    this.selectedEntityId.set(id);
  }

  openTickets(titleKey: string) {
    const type = TITLE_TO_TYPE[titleKey];
    if (type && this.customerId()) {
      this.router.navigate(['/customers', this.customerId(), 'tickets', type]);
    }
  }
}
