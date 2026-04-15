import { Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AddTicket } from './add-ticket/add-ticket';
import { TicketsLayout } from './tickets-layout/tickets-layout';
import { TicketType, TicketDetail } from './tickets-layout/tickets.types';

@Component({
  selector: 'app-customer-tickets',
  imports: [TranslateModule, AddTicket, TicketsLayout],
  templateUrl: './customer-tickets.html',
  styleUrl: './customer-tickets.scss',
})
export class CustomerTickets {
  mode = signal<'view' | 'add'>('view');
  activeTicket = signal<TicketDetail | null>(null);
  activeType = signal<TicketType>('complaints');

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
    // TODO: persist form payload
    this.mode.set('view');
  }
}
