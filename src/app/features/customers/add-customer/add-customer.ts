import { afterNextRender, Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../../core/services/customer.service';
import { LookupService, LookupItem } from '../../../core/services/lookup.service';
import { ToastService } from '../../../core/services/toast.service';
import { SearchableSelect } from '../../../shared/components/searchable-select/searchable-select';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { DatePicker } from '../../../shared/components/date-picker/date-picker';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule, TranslateModule, SearchableSelect, ConfirmDialog, DatePicker],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
})
export class AddCustomer implements OnInit {
  submitted = signal(false);
  loading = signal(false);
  verified = signal(false);
  isEditMode = signal(false);
  showConfirm = signal(false);
  showDiscardConfirm = signal(false);
  customerId = '';
  private initialSnapshot = '';

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
    preferredLanguage: 0,
    preferredContactMethod: 2,
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
  ) {
    // Wait until the component is fully rendered before fetching lookups,
    // so the form paints first and the network requests don't block first paint.
    afterNextRender(() => {
      this.lookupService.getCountries().subscribe({ next: data => this.nationalities = data });
      this.lookupService.getRegions().subscribe({ next: data => this.regions = data });
    });
  }

  get maxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onDigitsOnlyInput(event: Event, field: 'identityNumber' | 'mobileNumber1' | 'mobileNumber2') {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
    }
    this.customer[field] = cleaned;
  }

  get canVerify(): boolean {
    return !!this.customer.identityType && !!this.customer.identityNumber && !!this.customer.dateOfBirth;
  }

  get idPattern(): string {
    if (this.customer.identityType === 1) return '^1\\d{9}$';
    if (this.customer.identityType === 2) return '^2\\d{9}$';
    return '^\\d{10}$';
  }

  get idPatternErrorKey(): string {
    switch (this.customer.identityType) {
      case 1: return 'CUSTOMER.INVALID_ID_CITIZEN';
      case 2: return 'CUSTOMER.INVALID_ID_RESIDENT';
      case 3: return 'CUSTOMER.INVALID_ID_VISITOR';
      case 4: return 'CUSTOMER.INVALID_ID_PILGRIM';
      default: return 'CUSTOMER.INVALID_ID';
    }
  }

  onIdentityTypeChange() {
    this.customer.identityNumber = '';
    this.verified.set(false);
  }

  verifyId() {
    if (this.loading()) return;
    if (!this.isEditMode() && !this.canVerify) return;
    this.loading.set(true);

    this.customerService.getBasicInfo({
      mobile: this.customer.mobileNumber1,
      id: this.customer.identityNumber,
      date: this.customer.dateOfBirth.replace(/-/g, ''),
    }).subscribe({
      next: info => {
        this.loading.set(false);
        if (!info) {
          this.toast.error(this.translate.instant('CUSTOMER.LOAD_ERROR'));
          return;
        }
        this.customer.firstName     = info.FirstName     ?? '';
        this.customer.middleName    = info.Middlename    ?? '';
        this.customer.thirdName     = info.ThirdName     ?? '';
        this.customer.lastName      = info.LastName      ?? info.FamilyName ?? '';
        this.customer.gender        = info.GenderId      ?? null;
        this.customer.nationalityId = info.NationalityId ?? '';
        this.customer.mobileNumber1 = info.MobileNumber  ?? '';
        this.customer.mobileNumber2 = info.MobileNumber2 ?? '';
        this.customer.email         = info.Email         ?? '';
        this.customer.regionId      = info.RegionId      ?? '';
        this.customer.cityId        = info.CityId        ?? '';
        if (info.Birthdate) {
          this.customer.dateOfBirth = info.Birthdate.split('T')[0];
        }
        this.verified.set(true);
        this.snapshotForm();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.customerId = id;
      this.loadCustomerData(id);
    } else {
      this.snapshotForm();
    }
  }

  onRegionChange() {
    this.customer.cityId = '';
    this.cities = [];
    const regionId = this.customer.regionId;
    if (!regionId) return;
    this.lookupService.getFilteredLookup('city', regionId).subscribe({
      next: data => (this.cities = data),
    });
  }

  private snapshotForm() {
    this.initialSnapshot = JSON.stringify(this.customer);
  }

  private hasUnsavedChanges(): boolean {
    return JSON.stringify(this.customer) !== this.initialSnapshot;
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
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
        if (contact.regionId) {
          this.lookupService.getFilteredLookup('city', contact.regionId).subscribe({
            next: data => {
              this.cities = data;
              this.snapshotForm();
            },
            error: () => this.snapshotForm(),
          });
        } else {
          this.snapshotForm();
        }
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
    if (this.hasUnsavedChanges()) {
      this.showDiscardConfirm.set(true);
      return;
    }
    this.navigateBack();
  }

  onConfirmDiscard() {
    this.showDiscardConfirm.set(false);
    this.navigateBack();
  }

  onCancelDiscard() {
    this.showDiscardConfirm.set(false);
  }

  private navigateBack() {
    if (this.isEditMode()) {
      this.router.navigate(['/customers', this.customerId]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
