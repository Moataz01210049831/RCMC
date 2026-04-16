import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { AddSuggestionForm } from '../../../../../core/models/add-suggestion.model';

@Component({
  selector: 'app-add-suggestion',
  imports: [TranslateModule, FormsModule, SearchableSelect],
  templateUrl: './add-suggestion.html',
  styleUrl: '../add-form.scss',
})
export class AddSuggestion {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddSuggestionForm>();

  currentStep = signal<1 | 2>(1);

  form: AddSuggestionForm = {
    mainServiceId: null,
    subject:       '',
    description:   '',
  };

  mainServices = [
    { value: 'commercial', name: 'سجل تجاري' },
    { value: 'license',    name: 'ترخيص' },
  ];

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_SUGGESTION_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_SUGGESTION_DETAILS' },
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
