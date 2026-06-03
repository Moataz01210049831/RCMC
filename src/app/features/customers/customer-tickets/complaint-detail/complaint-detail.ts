import { Component, Input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TicketDetail } from '../tickets-layout/tickets.types';
import { DataTable, DataTableColumn } from '../../../../shared/components/data-table/data-table';

type DetailTab = 'service' | 'classification' | 'extra' | 'history';

interface TabDef {
  key:      DetailTab;
  labelKey: string;
}

@Component({
  selector: 'app-complaint-detail',
  imports: [TranslateModule, DataTable],
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

  // Columns for the change-history table. Rows will come from the API later.
  readonly historyColumns: DataTableColumn[] = [
    { key: 'currentStatus', labelKey: 'TICKETS.HISTORY_CURRENT_STATUS' },
    { key: 'stepDecision',  labelKey: 'TICKETS.HISTORY_STEP_DECISION' },
    { key: 'contactAction', labelKey: 'TICKETS.HISTORY_CONTACT_ACTION' },
    { key: 'notes',         labelKey: 'TICKETS.HISTORY_NOTES' },
    { key: 'dueAt',         labelKey: 'TICKETS.HISTORY_DUE_AT' },
    { key: 'skipDate',      labelKey: 'TICKETS.HISTORY_SKIP_DATE' },
    { key: 'decidedBy',     labelKey: 'TICKETS.HISTORY_DECIDED_BY' },
    { key: 'createdAt',     labelKey: 'TICKETS.HISTORY_CREATED_AT' },
    { key: 'dateArrival',   labelKey: 'TICKETS.DATE_ARRIVAL' },
  ];

  // Placeholder dummy rows until the change-log endpoint is wired up.
  historyRows: Record<string, unknown>[] = [
    {
      currentStatus: 'جديدة',
      stepDecision:  'موافقة',
      contactAction: 'اتصال هاتفي',
      notes:         'تم التواصل مع العميل',
      dueAt:         '2026-05-10 10:30',
      skipDate:      '2026-05-12 17:00',
      decidedBy:     'أحمد محمد',
      createdAt:     '2026-05-08 09:15',
      dateArrival:   '2026-05-08 09:00',
    },
    {
      currentStatus: 'قيد المراجعة',
      stepDecision:  'تصعيد',
      contactAction: 'بريد إلكتروني',
      notes:         'تحويل للجهة المختصة',
      dueAt:         '2026-05-14 12:00',
      skipDate:      '2026-05-16 17:00',
      decidedBy:     'سارة عبدالله',
      createdAt:     '2026-05-11 14:22',
      dateArrival:   '2026-05-11 14:00',
    },
    {
      currentStatus: 'قيد التنفيذ',
      stepDecision:  'تنفيذ',
      contactAction: 'زيارة ميدانية',
      notes:         'تم رفع تقرير الزيارة',
      dueAt:         '2026-05-18 16:00',
      skipDate:      '2026-05-20 17:00',
      decidedBy:     'خالد العتيبي',
      createdAt:     '2026-05-15 08:45',
      dateArrival:   '2026-05-15 08:30',
    },
    {
      currentStatus: 'مغلقة',
      stepDecision:  'إغلاق',
      contactAction: 'رسالة نصية',
      notes:         'تم حل الشكوى ورضا العميل',
      dueAt:         '2026-05-20 11:00',
      skipDate:      '2026-05-22 17:00',
      decidedBy:     'منى الحربي',
      createdAt:     '2026-05-20 09:48',
      dateArrival:   '2026-05-20 09:30',
    },
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
