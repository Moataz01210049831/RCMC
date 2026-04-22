import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LookupItem, LookupService } from '../../../../../core/services/lookup.service';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { FileUpload } from '../../../../../shared/components/file-upload/file-upload';
import { MultiSelect } from '../../../../../shared/components/multi-select/multi-select';
import { AddComplaintForm } from '../../../../../core/models/add-complaint.model';
import { ComplaintRequirement } from '../../../../../core/models/complaint-requirement.model';

@Component({
  selector: 'app-add-complaint',
  imports: [TranslateModule, FormsModule, SearchableSelect, FileUpload, MultiSelect],
  templateUrl: './add-complaint.html',
  styleUrl: '../add-form.scss',
})
export class AddComplaint implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddComplaintForm>();

  currentStep = signal<1 | 2 | 3>(1);

  readonly today = new Date().toISOString().split('T')[0];

  constructor(private lookupService: LookupService) {}

  ngOnInit() {
    this.lookupService.getServiceProviders().subscribe({
      next: data => (this.serviceProviders = data),
    });
    this.lookupService.getRegions().subscribe({
      next: data => (this.regions = data),
    });
    this.lookupService.getComplaintMainCategories().subscribe({
      next: data => (this.mainClassifications = data),
    });
    this.lookupService.getSubCategoryClass().subscribe({
      next: data => (this.form.complaintCategory = data[0]?.Name ?? null),
    });
  }

  form: AddComplaintForm = {
    serviceProviderId:    null,
    mainServiceId:        null,
    subServiceId:         null,
    mainClassificationId: null,
    subClassificationId:  null,
    complaintCategory:    null,
    regionId:             null,
    requirements:         [],
    relatedTickets:       [],
    description:          '',
    attachments:          [],
  };

  // Step 1 options
  serviceProviders: LookupItem[] = [];
  mainServices: LookupItem[] = [];
  subServices: LookupItem[] = [];

  onServiceProviderChange() {
    this.form.mainServiceId = null;
    this.form.subServiceId = null;
    this.mainServices = [];
    this.subServices = [];
    const providerId = this.form.serviceProviderId;
    if (!providerId) return;
    this.lookupService.getFilteredLookup('mainservice', providerId).subscribe({
      next: data => (this.mainServices = data),
    });
  }

  onMainServiceChange() {
    this.form.subServiceId = null;
    this.subServices = [];
    const mainId = this.form.mainServiceId;
    if (!mainId) return;
    this.lookupService.getFilteredLookup('subservice', mainId).subscribe({
      next: data => (this.subServices = data),
    });
  }

  // Step 2 options
  mainClassifications: LookupItem[] = [];
  subClassifications: LookupItem[] = [];
  regions: LookupItem[] = [];

  onMainClassificationChange() {
    this.form.subClassificationId = null;
    this.subClassifications = [];
    this.form.requirements = [];
    const mainId = this.form.mainClassificationId;
    if (!mainId) return;
    this.lookupService.getFilteredLookup('complaintsubcategory', mainId).subscribe({
      next: data => (this.subClassifications = data),
    });
  }

  onSubClassificationChange() {
    this.form.requirements = [];
    const subId = this.form.subClassificationId;
    if (!subId) return;
    this.lookupService.getComplaintRequirements(subId).subscribe({
      next: data => {
        this.form.requirements = data.map(r => ({
          ...r,
          Value: this.initialRequirementValue(r),
        }));
      },
    });
  }

  private initialRequirementValue(r: ComplaintRequirement): any {
    if (r.Type === 'file') return [];
    if (r.Type === 'radio') return r.Options[1] ?? '';
    return r.Value ?? '';
  }

  onRequirementFilesChange(req: ComplaintRequirement, files: File[]) {
    req.Value = files;
  }

  onRadioToggle(req: ComplaintRequirement, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    req.Value = checked ? req.Options[0] : req.Options[1];
  }

  // Step 3 options
  relatedTicketOptions: LookupItem[] = [
    { Value: 'T-001', Name: 'T-001' },
    { Value: 'T-002', Name: 'T-002' },
    { Value: 'T-003', Name: 'T-003' },
    { Value: 'T-004', Name: 'T-004' },
    { Value: 'T-005', Name: 'T-005' },
  ];

  // Validation
  get step1Valid(): boolean {
    return !!this.form.serviceProviderId && !!this.form.mainServiceId && !!this.form.subServiceId;
  }

  get step2Valid(): boolean {
    if (!this.form.mainClassificationId || !this.form.subClassificationId || !this.form.regionId) return false;
    return this.form.requirements.every(r => !r.Required || this.isRequirementFilled(r));
  }

  private isRequirementFilled(r: ComplaintRequirement): boolean {
    if (r.Type === 'file') return Array.isArray(r.Value) && r.Value.length > 0;
    if (r.Type === 'date') return !!r.Value && r.Value <= this.today;
    return r.Value !== null && r.Value !== undefined && r.Value !== '';
  }

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_SERVICE_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_CLASSIFICATION' },
    { index: 3, labelKey: 'TICKETS.STEP_EXTRA_DETAILS' },
  ];

  get canProceed(): boolean {
    const step = this.currentStep();
    if (step === 1) return this.step1Valid;
    if (step === 2) return this.step2Valid;
    return true;
  }

  next() {
    if (!this.canProceed) return;
    if (this.currentStep() < 3) {
      this.currentStep.set((this.currentStep() + 1) as 1 | 2 | 3);
    } else {
      console.log('Add Complaint Form Data:', this.form);
      this.submitted.emit(this.form);
    }
  }

  prev() {
    if (this.currentStep() > 1) {
      this.currentStep.set((this.currentStep() - 1) as 1 | 2 | 3);
    }
  }

  onCancel() { this.cancel.emit(); }
}
