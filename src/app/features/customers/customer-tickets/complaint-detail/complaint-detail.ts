import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TicketDetail } from '../tickets-layout/tickets.types';

@Component({
  selector: 'app-complaint-detail',
  imports: [TranslateModule],
  templateUrl: './complaint-detail.html',
  styleUrl: './complaint-detail.scss',
})
export class ComplaintDetail {
  @Input() ticket: TicketDetail | null = null;

  // Hide fields the backend returned empty. tickets-layout maps missing values
  // to '-', so treat that as empty too.
  has(value: string | null | undefined): boolean {
    if (value == null) return false;
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== '-';
  }
}
