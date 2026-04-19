import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { ToastService } from '../../../core/services/toast.service';
import { SearchableSelect } from '../../../shared/components/searchable-select/searchable-select';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule, TranslateModule, SearchableSelect, ConfirmDialog],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
})
export class AddCustomer implements OnInit {
  submitted = signal(false);
  loading = signal(false);
  verified = signal(false);
  isEditMode = signal(false);
  showConfirm = signal(false);
  customerId = '';

  cities: LookupItem[] = [];
  nationalities: LookupItem[] = [];
  regions: LookupItem[] = [];

  identityTypes = [
    { labelKey: 'IDENTITY_TYPES.CITIZEN', value: 1 },
    { labelKey: 'IDENTITY_TYPES.RESIDENT', value: 2 },
    { labelKey: 'IDENTITY_TYPES.VISITOR', value: 3 },
    { labelKey: 'IDENTITY_TYPES.PILGRIM', value: 4 },
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
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private lookupService: LookupService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  get maxDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

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

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.customerId = id;
      this.loadCustomerData(id);
    }
  }

  private loadCustomerData(id: string) {
    this.loading.set(true);
    this.customerService.getContact(id).subscribe({
      next: (contact) => {
        this.loading.set(false);
        if (!contact) {
          this.toast.error(this.translate.instant('CUSTOMER.LOAD_ERROR'));
          return;
        }
        this.customer = {
          identityType: contact.identityType,
          identityNumber: contact.identityNumber,
          dateOfBirth: contact.dateOfBirth ? contact.dateOfBirth.split('T')[0] : '',
          firstName: contact.firstName,
          middleName: contact.middleName,
          thirdName: contact.thirdName,
          lastName: contact.lastName,
          nationalityId: contact.nationalityId,
          gender: contact.gender,
          mobileNumber1: contact.mobileNumber1,
          mobileNumber2: contact.mobileNumber2,
          preferredLanguage: contact.preferredLanguage,
          preferredContactMethod: contact.preferredContactMethod,
          email: contact.email,
          regionId: contact.regionId,
          cityId: contact.cityId,
        };
        this.verified.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error(this.translate.instant('CUSTOMER.LOAD_ERROR'));
      },
    });
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid) return;
    this.showConfirm.set(true);
  }

  onConfirmSubmit() {
    this.showConfirm.set(false);
    this.loading.set(true);

    const contactData = {
      firstName: this.customer.firstName,
      middleName: this.customer.middleName,
      thirdName: this.customer.thirdName,
      lastName: this.customer.lastName,
      cityId: this.customer.cityId,
      dateOfBirth: this.customer.dateOfBirth,
      email: this.customer.email,
      genderId: this.customer.gender!,
      identityTypeId: this.customer.identityType!,
      identityNumber: this.customer.identityNumber,
      mobileNumber: this.customer.mobileNumber1,
      mobileNumber2: this.customer.mobileNumber2,
      nationalityId: this.customer.nationalityId,
      preferredContactMethod: this.customer.preferredContactMethod!,
      preferredLanguage: this.customer.preferredLanguage!,
      regionId: this.customer.regionId,
    };

    if (this.isEditMode()) {
      this.customerService.updateContact({ EntityId: this.customerId, ...contactData }).subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success(this.translate.instant('CUSTOMER.EDIT_SUCCESS'));
          this.router.navigate(['/customers', this.customerId]);
        },
        error: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.customerService.createContact(contactData).subscribe({
        next: (newId) => {
          this.loading.set(false);
          this.toast.success(this.translate.instant('CUSTOMER.ADD_SUCCESS'));
          if (newId) {
            this.router.navigate(['/customers', newId]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          this.loading.set(false);
        },
      });
    }
  }

  onCancelConfirm() {
    this.showConfirm.set(false);
  }

  goBack() {
    if (this.isEditMode()) {
      this.router.navigate(['/customers', this.customerId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
