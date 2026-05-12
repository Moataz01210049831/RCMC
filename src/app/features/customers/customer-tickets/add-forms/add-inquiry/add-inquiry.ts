import { Component, EventEmitter, HostListener, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { FileUpload } from '../../../../../shared/components/file-upload/file-upload';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { LookupItem, LookupService } from '../../../../../core/services/lookup.service';
import { AddInquiryForm } from '../../../../../core/models/add-inquiry.model';

@Component({
  selector: 'app-add-inquiry',
  imports: [TranslateModule, FormsModule, SearchableSelect, FileUpload, ConfirmDialog],
  templateUrl: './add-inquiry.html',
  styleUrl: '../add-form.scss',
})
export class AddInquiry implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddInquiryForm>();

  currentStep = signal<1 | 2 | 3>(1);
  showDiscardConfirm = signal(false);

  form: AddInquiryForm = {
    entityId:             null,
    mainClassificationId: null,
    subClassificationId:  null,
    inquiryTypeId:        null,
    submitterTypeId:      null,
    details:              '',
    response:             '',
    notes:                '',
    attachments:          [],
  };

  entities: LookupItem[] = [];
  mainClassifications: LookupItem[] = [];
  subClassifications: LookupItem[] = [];

  // TODO: replace with API-driven lookups when the endpoints are available
  inquiryTypes: LookupItem[] = [
    { Value: 'general',   Name: 'استفسار عام' },
    { Value: 'service',   Name: 'استفسار عن خدمة' },
    { Value: 'procedure', Name: 'استفسار عن إجراء' },
    { Value: 'other',     Name: 'أخرى' },
  ];

  submitterTypes: LookupItem[] = [
    { Value: 'citizen',  Name: 'مواطن' },
    { Value: 'resident', Name: 'مقيم' },
    { Value: 'visitor',  Name: 'زائر' },
    { Value: 'employee', Name: 'موظف' },
  ];

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_INQUIRY_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_INQUIRY_DETAILS' },
    { index: 3, labelKey: 'TICKETS.STEP_ATTACHMENTS' },
  ];

  constructor(private lookupService: LookupService) {}

  ngOnInit() {
    this.lookupService.getServiceProviders().subscribe({
      next: data => (this.entities = data),
    });
    this.lookupService.getComplaintMainCategories().subscribe({
      next: data => (this.mainClassifications = data),
    });
  }

  onMainClassificationChange() {
    this.form.subClassificationId = null;
    this.subClassifications = [];
    const mainId = this.form.mainClassificationId;
    if (!mainId) return;
    this.lookupService.getFilteredLookup('complaintsubcategory', mainId).subscribe({
      next: data => (this.subClassifications = data),
    });
  }

  get step1Valid(): boolean {
    return !!this.form.entityId && !!this.form.mainClassificationId && !!this.form.subClassificationId;
  }

  get step2Valid(): boolean {
    return !!this.form.inquiryTypeId
      && !!this.form.submitterTypeId
      && this.form.details.trim() !== '';
  }

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
    this.submitted.emit(this.form);
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
    if (f.entityId || f.mainClassificationId || f.subClassificationId) return true;
    if (f.inquiryTypeId || f.submitterTypeId) return true;
    if (f.details.trim() !== '' || f.response.trim() !== '' || f.notes.trim() !== '') return true;
    if (f.attachments && f.attachments.length > 0) return true;
    return false;
  }
}
