import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { AddInquiryForm } from './add-inquiry.model';

@Component({
  selector: 'app-add-inquiry',
  imports: [TranslateModule, FormsModule, SearchableSelect],
  templateUrl: './add-inquiry.html',
  styleUrl: '../add-form.scss',
})
export class AddInquiry {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddInquiryForm>();

  currentStep = signal<1 | 2>(1);

  form: AddInquiryForm = {
    serviceProviderId: null,
    subject:           '',
    description:       '',
  };

  serviceProviders = [
    { value: 'moc',          name: 'وزارة التجارة' },
    { value: 'municipality', name: 'الأمانة' },
  ];

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_INQUIRY_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_INQUIRY_DETAILS' },
  ];

  next() {
    if (this.currentStep() < 2) {
      this.currentStep.set(2);
    } else {
      this.submitted.emit(this.form);
    }
  }

  prev() {
    if (this.currentStep() > 1) {
      this.currentStep.set(1);
    }
  }

  onCancel() { this.cancel.emit(); }
}
