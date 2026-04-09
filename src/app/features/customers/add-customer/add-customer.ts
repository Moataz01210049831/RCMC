import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { ToastService } from '../../../core/services/toast.service';
import { SearchableSelect } from '../../../shared/components/searchable-select/searchable-select';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule, SearchableSelect],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
})
export class AddCustomer implements OnInit {
  submitted = signal(false);
  loading = signal(false);
  verified = signal(false);

  cities: LookupItem[] = [];
  nationalities: LookupItem[] = [];
  regions: LookupItem[] = [];

  identityTypes = [
    { label: 'مواطن', value: 1 },
    { label: 'مقيم', value: 2 },
    { label: 'زائر', value: 3 },
    { label: 'حاج', value: 4 },
  ];

  customer: {
    identityType: number | null;
    identityNumber: string;
    dateOfBirth: string;
    firstName: string;
    middleName: string;
    thirdName: string;
    lastName: string;
    nationalityId: string;
    gender: number | null;
    mobileNumber1: string;
    mobileNumber2: string;
    preferredLanguage: number | null;
    preferredContactMethod: number | null;
    email: string;
    regionId: string;
    cityId: string;
  } = {
    identityType: null,
    identityNumber: '',
    dateOfBirth: '',
    firstName: '',
    middleName: '',
    thirdName: '',
    lastName: '',
    nationalityId: '',
    gender: null,
    mobileNumber1: '',
    mobileNumber2: '',
    preferredLanguage: null,
    preferredContactMethod: null,
    email: '',
    regionId: '',
    cityId: '',
  };

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private toast: ToastService,
  ) {}

  get canVerify(): boolean {
    return !!this.customer.identityType && !!this.customer.identityNumber && !!this.customer.dateOfBirth;
  }

  verifyId() {
    if (!this.canVerify) return;
    // TODO: call verify API
    this.verified.set(true);
  }

  ngOnInit() {
    this.lookupService.getCities().subscribe({ next: data => this.cities = data });
    this.lookupService.getCountries().subscribe({ next: data => this.nationalities = data });
    this.lookupService.getRegions().subscribe({ next: data => this.regions = data });
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid) return;

    this.loading.set(true);
    this.customerService.createContact({
      firstName: this.customer.firstName,
      middleName: this.customer.middleName,
      thirdName: this.customer.thirdName,
      lastName: this.customer.lastName,
      cityId: this.customer.cityId,
      dateOfBirth: this.customer.dateOfBirth,
      email: this.customer.email,
      gender: this.customer.gender!,
      identityType: this.customer.identityType!,
      identityNumber: this.customer.identityNumber,
      mobileNumber1: this.customer.mobileNumber1,
      mobileNumber2: this.customer.mobileNumber2,
      nationalityId: this.customer.nationalityId,
      preferredContactMethod: this.customer.preferredContactMethod!,
      preferredLanguage: this.customer.preferredLanguage!,
      regionId: this.customer.regionId,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('تم إضافة العميل بنجاح');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
