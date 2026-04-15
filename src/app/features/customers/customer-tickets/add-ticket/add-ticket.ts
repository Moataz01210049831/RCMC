import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../shared/components/searchable-select/searchable-select';

export type TicketType = 'complaints' | 'requests' | 'inquiries' | 'suggestions';

const ADD_TITLE_KEYS: Record<TicketType, string> = {
  complaints:  'TICKETS.ADD_COMPLAINT',
  requests:    'TICKETS.ADD_REQUEST',
  inquiries:   'TICKETS.ADD_INQUIRY',
  suggestions: 'TICKETS.ADD_SUGGESTION',
};

export interface AddTicketForm {
  serviceProviderId: string | null;
  mainServiceId:     string | null;
  subServiceId:      string | null;
}

@Component({
  selector: 'app-add-ticket',
  imports: [TranslateModule, FormsModule, SearchableSelect],
  templateUrl: './add-ticket.html',
  styleUrl: './add-ticket.scss',
})
export class AddTicket {
  @Input({ required: true }) type!: TicketType;
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddTicketForm>();

  currentStep = signal<1 | 2 | 3>(1);

  form: AddTicketForm = {
    serviceProviderId: null,
    mainServiceId:     null,
    subServiceId:      null,
  };

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

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_SERVICE_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_CLASSIFICATION' },
    { index: 3, labelKey: 'TICKETS.STEP_EXTRA_DETAILS' },
  ];

  get titleKey(): string {
    return ADD_TITLE_KEYS[this.type];
  }

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

  onCancel() {
    this.cancel.emit();
  }
}
