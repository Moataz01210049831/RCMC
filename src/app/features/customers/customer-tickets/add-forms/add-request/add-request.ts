import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { AddRequestForm } from './add-request.model';

@Component({
  selector: 'app-add-request',
  imports: [TranslateModule, FormsModule, SearchableSelect],
  templateUrl: './add-request.html',
  styleUrl: '../add-form.scss',
})
export class AddRequest {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddRequestForm>();

  currentStep = signal<1 | 2 | 3>(1);

  form: AddRequestForm = {
    serviceProviderId: null,
    mainServiceId:     null,
    subject:           '',
  };

  serviceProviders = [
    { value: 'moc',          name: 'وزارة التجارة' },
    { value: 'municipality', name: 'الأمانة' },
  ];
  mainServices = [
    { value: 'commercial', name: 'سجل تجاري' },
    { value: 'license',    name: 'ترخيص' },
  ];

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_REQUEST_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_REQUEST_DETAILS' },
    { index: 3, labelKey: 'TICKETS.STEP_ATTACHMENTS' },
  ];

  next() {
    if (this.currentStep() < 3) {
      this.currentStep.set((this.currentStep() + 1) as 1 | 2 | 3);
    } else {
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
