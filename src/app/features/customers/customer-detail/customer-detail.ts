import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerCard } from '../../../shared/components/customer-card/customer-card';
import { RelatedEntities } from '../../../shared/components/related-entities/related-entities';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { CustomerCardData } from '../../../core/models/customer-card.model';

const GENDER_LABELS: Record<number, string> = { 1: 'ذكر', 2: 'أنثى' };

@Component({
  selector: 'app-customer-detail',
  imports: [CustomerCard, RelatedEntities],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  customer = signal<CustomerCardData | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';

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
        gender:      GENDER_LABELS[contact.gender] ?? '-',
        city:        resolveName(cities, contact.cityId),
      });
    });
  }

  goBack() {
    this.router.navigate(['/customers/search']);
  }

  edit() {
    this.router.navigate(['/customers/edit', this.customer()?.id]);
  }

  addEntity() {
    // TODO: navigate to add business entity
  }
}
