import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerCard } from '../../../shared/components/customer-card/customer-card';
import { RelatedEntities } from '../../../shared/components/related-entities/related-entities';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { SelectedEntityService } from '../../../core/services/selected-entity.service';
import { CustomerCardData } from '../../../core/models/customer-card.model';

const GENDER_KEYS: Record<number, string> = { 1: 'CUSTOMER.MALE', 2: 'CUSTOMER.FEMALE' };

@Component({
  selector: 'app-customer-detail',
  imports: [TranslateModule, CustomerCard, RelatedEntities],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  customer = signal<CustomerCardData | null>(null);
  identityTypeId = signal<number>(0);
  nationalityIdNum = signal<number>(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private translate: TranslateService,
    public selectedEntityService: SelectedEntityService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin({
      contact:       this.customerService.getContact(id),
      cities:        this.lookupService.getCities(),
      nationalities: this.lookupService.getCountries(),
    }).subscribe(({ contact, cities, nationalities }) => {
      if (!contact) {
        this.customer.set(null);
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
      this.identityTypeId.set(contact.identityType ?? 0);
      this.nationalityIdNum.set(Number(contact.nationalityId) || 0);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  edit() {
    this.router.navigate(['/customers/edit', this.customer()?.id]);
  }

  addEntity() {
    // TODO: navigate to add business entity
  }
}
