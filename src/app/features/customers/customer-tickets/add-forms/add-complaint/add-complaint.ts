import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LookupItem } from '../../../../../core/services/lookup.service';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { FileUpload } from '../../../../../shared/components/file-upload/file-upload';
import { MultiSelect } from '../../../../../shared/components/multi-select/multi-select';
import { AddComplaintForm } from './add-complaint.model';

@Component({
  selector: 'app-add-complaint',
  imports: [TranslateModule, FormsModule, SearchableSelect, FileUpload, MultiSelect],
  templateUrl: './add-complaint.html',
  styleUrl: '../add-form.scss',
})
export class AddComplaint {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddComplaintForm>();

  currentStep = signal<1 | 2 | 3>(1);

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
    relatedTickets:       [],
    description:          '',
    attachments:          [],
  };

  // Step 1 options
  serviceProviders = [
    { value: 'moc',          name: 'وزارة التجارة' },
    { value: 'municipality', name: 'الأمانة' },
  ];
  mainServices = [
    { value: 'commercial', name: 'سجل تجاري' },
    { value: 'license',    name: 'ترخيص' },
  ];
  subServices = [
    { value: 'print', name: 'طباعة السجل التجاري' },
    { value: 'renew', name: 'تجديد السجل التجاري' },
  ];

  // Step 2 options
  mainClassifications: LookupItem[] = [
    { value: 'service',  name: 'مشكلة في الخدمة' },
    { value: 'employee', name: 'سلوك موظف' },
  ];

  // Sub options keyed by main value — "connected" dropdown
  private subByMain: Record<string, LookupItem[]> = {
    service:  [
      { value: 'delay',  name: 'تأخر في الإنجاز' },
      { value: 'error',  name: 'خطأ في النتيجة' },
    ],
    employee: [
      { value: 'rude',       name: 'تعامل غير لائق' },
      { value: 'unhelpful',  name: 'عدم تقديم المساعدة' },
    ],
  };

  regions: LookupItem[] = [
    { value: 'ri', name: 'الرياض' },
    { value: 'jd', name: 'جدة' },
    { value: 'dm', name: 'الدمام' },
  ];

  // Step 3 options
  relatedTicketOptions: LookupItem[] = [
    { value: 'T-001', name: 'T-001' },
    { value: 'T-002', name: 'T-002' },
    { value: 'T-003', name: 'T-003' },
    { value: 'T-004', name: 'T-004' },
    { value: 'T-005', name: 'T-005' },
  ];

  subClassifications = computed<LookupItem[]>(() => {
    const main = this.form.mainClassificationId;
    return main ? (this.subByMain[main] ?? []) : [];
  });

  // Reset sub when main changes
  onMainClassificationChange() {
    this.form.subClassificationId = null;
  }

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_SERVICE_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_CLASSIFICATION' },
    { index: 3, labelKey: 'TICKETS.STEP_EXTRA_DETAILS' },
  ];

  next() {
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
