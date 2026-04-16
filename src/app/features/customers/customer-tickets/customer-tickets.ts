import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TicketsLayout } from './tickets-layout/tickets-layout';
import { TicketType, TicketDetail } from './tickets-layout/tickets.types';
import { AddComplaint }  from './add-forms/add-complaint/add-complaint';
import { AddRequest }    from './add-forms/add-request/add-request';
import { AddInquiry }    from './add-forms/add-inquiry/add-inquiry';
import { AddSuggestion } from './add-forms/add-suggestion/add-suggestion';
import { ConfirmDialog }  from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-customer-tickets',
  imports: [TranslateModule, TicketsLayout, AddComplaint, AddRequest, AddInquiry, AddSuggestion, ConfirmDialog],
  templateUrl: './customer-tickets.html',
  styleUrl: './customer-tickets.scss',
})
export class CustomerTickets {
  mode = signal<'view' | 'add'>('view');
  activeTicket = signal<TicketDetail | null>(null);
  activeType = signal<TicketType>('complaints');
  showConfirm = signal(false);

  onActiveTicketChange(ticket: TicketDetail | null) {
    this.activeTicket.set(ticket);
    if (this.mode() === 'add') this.mode.set('view');
  }

  onAddClick(type: TicketType) {
    this.activeType.set(type);
    this.mode.set('add');
  }

  onTabChange(type: TicketType) {
    this.activeType.set(type);
  }

  cancelAdd() {
    this.mode.set('view');
  }

  onAddSubmitted() {
    this.showConfirm.set(true);
  }

  onConfirmSave() {
    // TODO: persist form payload
    this.showConfirm.set(false);
    this.mode.set('view');
  }

  onCancelConfirm() {
    this.showConfirm.set(false);
  }
}
