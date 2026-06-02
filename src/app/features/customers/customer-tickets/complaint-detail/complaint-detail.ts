import { Component, Input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TicketDetail } from '../tickets-layout/tickets.types';

type DetailTab = 'service' | 'classification' | 'extra' | 'history';

interface TabDef {
  key:      DetailTab;
  labelKey: string;
}

@Component({
  selector: 'app-complaint-detail',
  imports: [TranslateModule],
  templateUrl: './complaint-detail.html',
  styleUrl: './complaint-detail.scss',
})
export class ComplaintDetail {
  @Input() ticket: TicketDetail | null = null;

  activeTab = signal<DetailTab>('service');

  readonly tabs: TabDef[] = [
    { key: 'service',        labelKey: 'TICKETS.TAB_SERVICE_INFO' },
    { key: 'classification', labelKey: 'TICKETS.TAB_CLASSIFICATION' },
    { key: 'extra',          labelKey: 'TICKETS.TAB_EXTRA_DETAILS' },
    { key: 'history',        labelKey: 'TICKETS.TAB_HISTORY' },
  ];

  setTab(tab: DetailTab) {
    this.activeTab.set(tab);
  }

  // Hide fields the backend returned empty. tickets-layout maps missing values
  // to '-', so treat that as empty too.
  has(value: string | null | undefined): boolean {
    if (value == null) return false;
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== '-';
  }
}
