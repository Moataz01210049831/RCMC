import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LookupItem, LookupService } from '../../../../../core/services/lookup.service';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { FileUpload } from '../../../../../shared/components/file-upload/file-upload';
import { MultiSelect } from '../../../../../shared/components/multi-select/multi-select';
import { AddComplaintForm } from '../../../../../core/models/add-complaint.model';

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

  constructor(private lookupService: LookupService) {}

  ngOnInit() {
    this.lookupService.getServiceProviders().subscribe({
      next: data => (this.serviceProviders = data),
    });
  }

  form: AddComplaintForm = {
    serviceProviderId:    null,
    mainServiceId:        null,
    subServiceId:         null,
    mainClassificationId: null,
    subClassificationId:  null,
    complaintCategory:    '',
    regionId:             null,
    textContent:          '',
    date:                 '',
    keyAddress:           false,
    classificationAttachments: [],
    relatedTickets:       [],
    description:          '',
    attachments:          [],
  };

  // Step 1 options
  serviceProviders: LookupItem[] = [];

  private mainServicesByProvider: Record<string, LookupItem[]> = {
    moc: [
      { Value: 'commercial', Name: 'سجل تجاري' },
      { Value: 'license',    Name: 'ترخيص' },
    ],
    municipality: [
      { Value: 'permit',     Name: 'تصريح بناء' },
      { Value: 'inspection', Name: 'فحص المنشأة' },
    ],
  };

  private subServicesByMain: Record<string, LookupItem[]> = {
    commercial:  [
      { Value: 'print', Name: 'طباعة السجل التجاري' },
      { Value: 'renew', Name: 'تجديد السجل التجاري' },
    ],
    license: [
      { Value: 'new_license', Name: 'إصدار ترخيص جديد' },
      { Value: 'renew_license', Name: 'تجديد ترخيص' },
    ],
    permit: [
      { Value: 'new_permit', Name: 'تصريح جديد' },
      { Value: 'renew_permit', Name: 'تجديد تصريح' },
    ],
    inspection: [
      { Value: 'initial', Name: 'فحص أولي' },
      { Value: 'followup', Name: 'فحص متابعة' },
    ],
  };

  get mainServices(): LookupItem[] {
    const provider = this.form.serviceProviderId;
    return provider ? (this.mainServicesByProvider[provider] ?? []) : [];
  }

  get subServices(): LookupItem[] {
    const main = this.form.mainServiceId;
    return main ? (this.subServicesByMain[main] ?? []) : [];
  }

  onServiceProviderChange() {
    this.form.mainServiceId = null;
    this.form.subServiceId = null;
  }

  onMainServiceChange() {
    this.form.subServiceId = null;
  }

  // Step 2 options
  mainClassifications: LookupItem[] = [
    { Value: 'service',  Name: 'مشكلة في الخدمة' },
    { Value: 'employee', Name: 'سلوك موظف' },
  ];

  private subByMain: Record<string, LookupItem[]> = {
    service:  [
      { Value: 'delay',  Name: 'تأخر في الإنجاز' },
      { Value: 'error',  Name: 'خطأ في النتيجة' },
    ],
    employee: [
      { Value: 'rude',       Name: 'تعامل غير لائق' },
      { Value: 'unhelpful',  Name: 'عدم تقديم المساعدة' },
    ],
  };

  regions: LookupItem[] = [
    { Value: 'ri', Name: 'الرياض' },
    { Value: 'jd', Name: 'جدة' },
    { Value: 'dm', Name: 'الدمام' },
  ];

  get subClassifications(): LookupItem[] {
    const main = this.form.mainClassificationId;
    return main ? (this.subByMain[main] ?? []) : [];
  }

  // Return questions per sub-classification
  private returnQuestionsBySubClass: Record<string, ('textContent' | 'keyAddress' | 'attachments')[]> = {
    delay:      ['textContent', 'attachments'],
    error:      ['textContent', 'keyAddress', 'attachments'],
    rude:       ['textContent'],
    unhelpful:  ['textContent', 'keyAddress'],
  };

  get visibleReturnQuestions(): Set<string> {
    const sub = this.form.subClassificationId;
    return new Set(sub ? (this.returnQuestionsBySubClass[sub] ?? []) : []);
  }

  get showTextContent(): boolean { return this.visibleReturnQuestions.has('textContent'); }
  get showKeyAddress(): boolean { return this.visibleReturnQuestions.has('keyAddress'); }
  get showAttachments(): boolean { return this.visibleReturnQuestions.has('attachments'); }

  onMainClassificationChange() {
    this.form.subClassificationId = null;
    this.resetReturnQuestions();
  }

  onSubClassificationChange() {
    this.resetReturnQuestions();
  }

  private resetReturnQuestions() {
    this.form.textContent = '';
    this.form.keyAddress = false;
    this.form.classificationAttachments = [];
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
    return !!this.form.mainClassificationId && !!this.form.subClassificationId && !!this.form.regionId;
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
