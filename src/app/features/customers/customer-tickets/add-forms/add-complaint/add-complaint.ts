import { Component, EventEmitter, HostListener, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LookupItem, LookupService } from '../../../../../core/services/lookup.service';
import { ComplaintsService } from '../../../../../core/services/complaints.service';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { FileUpload } from '../../../../../shared/components/file-upload/file-upload';
import { MultiSelect } from '../../../../../shared/components/multi-select/multi-select';
import { DatePicker } from '../../../../../shared/components/date-picker/date-picker';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { AddComplaintForm, AddComplaintPayload, AddComplaintSubmission, RelatedContext } from '../../../../../core/models/add-complaint.model';
import { ComplaintRequirement } from '../../../../../core/models/complaint-requirement.model';

@Component({
  selector: 'app-add-complaint',
  imports: [TranslateModule, FormsModule, SearchableSelect, FileUpload, MultiSelect, DatePicker, ConfirmDialog],
  templateUrl: './add-complaint.html',
  styleUrl: '../add-form.scss',
})
export class AddComplaint implements OnInit {
  @Input() contactId = '';
  @Input() commercialRecord = '';
  @Input() relatedContext: RelatedContext | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddComplaintSubmission>();

  currentStep = signal<1 | 2 | 3>(1);
  showDiscardConfirm = signal(false);

  readonly today = new Date().toISOString().split('T')[0];

  constructor(
    private lookupService: LookupService,
    private complaintsService: ComplaintsService,
  ) {}

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
    if (this.contactId) {
      this.complaintsService.getRelatedTicketsByCustomer(this.contactId).subscribe({
        next: tickets => {
          this.relatedTicketOptions = tickets.map(t => ({
            Value: t.IncidentId,
            Name:  t.TicketNumber,
          }));
        },
      });
    }
  }

  form: AddComplaintForm = {
    serviceProviderId:    null,
    mainServiceId:        null,
    subServiceId:         null,
    mainClassificationId: null,
    subClassificationId:  null,
    complaintCategory:    null,
    complaintCategoryId:  null,
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
    this.form.complaintCategory   = null;
    this.form.complaintCategoryId = null;
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
    const selected = this.subClassifications.find(s => s.Value === subId);
    this.form.complaintCategory   = selected?.Child?.Name  ?? null;
    this.form.complaintCategoryId = selected?.Child?.Value ?? null;
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
    if (r.Type === 'file' || r.Type === 'attachment') return [];
    if (r.Type === 'multipleselect') return [];
    if (r.Type === 'radio') return 'false';
    return r.Value ?? '';
  }

  optionsAsItems(req: ComplaintRequirement): LookupItem[] {
    return (req.Options ?? []).map(o => ({ Value: o, Name: o }));
  }

  onRequirementFilesChange(req: ComplaintRequirement, files: File[]) {
    req.Value = files;
  }

  onRadioToggle(req: ComplaintRequirement, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    req.Value = checked ? 'true' : 'false';
  }

  // Step 3 options
  relatedTicketOptions: LookupItem[] = [];

  // Validation
  get step1Valid(): boolean {
    return !!this.form.serviceProviderId && !!this.form.mainServiceId && !!this.form.subServiceId;
  }

  get step2Valid(): boolean {
    if (!this.form.mainClassificationId || !this.form.subClassificationId || !this.form.regionId) return false;
    return this.form.requirements.every(r => !r.Required || this.isRequirementFilled(r));
  }

  private isRequirementFilled(r: ComplaintRequirement): boolean {
    if (r.Type === 'file' || r.Type === 'attachment') return Array.isArray(r.Value) && r.Value.length > 0;
    if (r.Type === 'multipleselect') return Array.isArray(r.Value) && r.Value.length > 0;
    return r.Value !== null && r.Value !== undefined && r.Value !== '';
  }

  blockNonDigitKeys(event: KeyboardEvent) {
    if (['e', 'E', '+', '-', '.', ','].includes(event.key)) {
      event.preventDefault();
    }
  }

  sanitizeNumberInput(req: ComplaintRequirement, event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '').slice(0, 20);
    if (input.value !== cleaned) {
      input.value = cleaned;
    }
    req.Value = cleaned;
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
      return;
    }
    this.submit();
  }

  private submit() {
    this.submitted.emit(this.buildSubmission());
  }

  private buildSubmission(): AddComplaintSubmission {
    const complainQuestions: Record<string, string | string[]> = {};
    for (const req of this.form.requirements) {
      complainQuestions[req.Id] = this.serializeRequirementValue(req);
    }

    const categoryId = this.form.complaintCategoryId ?? '';

    const payload: AddComplaintPayload = {
      serviceProviderId:           this.form.serviceProviderId  ?? '',
      mainServiceId:               this.form.mainServiceId      ?? '',
      subServiceId:                this.form.subServiceId       ?? '',
      title:                       '',
      complaintCategoryId:         '',
      complaintMainCategoryId:     this.form.mainClassificationId ?? '',
      complaintSubCategoryId:      this.form.subClassificationId  ?? '',
      complaintSubCategoryClassId: categoryId,
      regionId:                    this.form.regionId ?? '',
      entityTypeId:                '',
      commercialRecordId:          '43c4c149-ec49-f111-93f2-00505689e20d',
      customerId:                  this.contactId,
      description:                 this.form.description,
      agentQuestionnaire:          '',
      complainQuestions,
    };

    const requirementFiles = this.form.requirements
      .filter(r => r.Type === 'file' || r.Type === 'attachment')
      .flatMap(r => Array.isArray(r.Value) ? (r.Value as File[]) : []);

    return {
      payload,
      attachments:     [...(this.form.attachments ?? []), ...requirementFiles],
      fileDescription: 'description',
    };
  }

  private serializeRequirementValue(req: ComplaintRequirement): string | string[] {
    if (req.Type === 'file' || req.Type === 'attachment') return '';
    if (Array.isArray(req.Value)) return req.Value.map(v => String(v));
    return req.Value == null ? '' : String(req.Value);
  }

  prev() {
    if (this.currentStep() > 1) {
      this.currentStep.set((this.currentStep() - 1) as 1 | 2 | 3);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
    }
  }

  onCancel() {
    if (this.hasUnsavedChanges()) {
      this.showDiscardConfirm.set(true);
      return;
    }
    this.cancel.emit();
  }

  onConfirmDiscard() {
    this.showDiscardConfirm.set(false);
    this.cancel.emit();
  }

  onCancelDiscard() {
    this.showDiscardConfirm.set(false);
  }

  private hasUnsavedChanges(): boolean {
    const f = this.form;
    if (f.serviceProviderId || f.mainServiceId || f.subServiceId) return true;
    if (f.mainClassificationId || f.subClassificationId || f.regionId) return true;
    if (f.description && f.description.trim() !== '') return true;
    if (f.attachments && f.attachments.length > 0) return true;
    if (f.relatedTickets && f.relatedTickets.length > 0) return true;
    return f.requirements.some(r => {
      if (Array.isArray(r.Value)) return r.Value.length > 0;
      return r.Value !== null && r.Value !== undefined && r.Value !== '' && r.Value !== 'false';
    });
  }
}
