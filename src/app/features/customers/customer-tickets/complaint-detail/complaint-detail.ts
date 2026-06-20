import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TicketDetail } from '../tickets-layout/tickets.types';
import { DataTable, DataTableColumn } from '../../../../shared/components/data-table/data-table';
import { ComplaintsService } from '../../../../core/services/complaints.service';

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
export class ComplaintDetail implements OnChanges {
  @Input() ticket: TicketDetail | null = null;

  constructor(private complaintsService: ComplaintsService) {}

  activeTab = signal<DetailTab>('service');

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['ticket']) return;
    const id = this.ticket?.incidentId;
    if (id) this.loadHistory(id);
    else this.historyRows = [];
  }

  private loadHistory(complainId: string) {
    this.complaintsService.getComplainSLAItems(complainId).subscribe({
      next: items => {
        // currentStatus + dateArrival come from the complaint itself (same for
        // every row); the rest are per-SLA-item.
        const currentStatus = this.ticket?.statusKey ?? '';
        const dateArrival   = this.ticket?.createdAt ?? '';
        this.historyRows = (items ?? []).map(it => ({
          currentStatus,
          stepDecision:  it.stepDecision?.name ?? '',
          contactAction: it.communicationProcedure?.name ?? '',
          notes:         it.notes ?? '',
          endOn:         it.endOn ?? '',
          overdueDate:   it.overdueDate ?? '',
          takenBy:       it.takenBy?.name ?? '',
          modifiedOn:    it.modifiedOn ?? '',
          dateArrival,
        }));
      },
    });
  }

  readonly tabs: TabDef[] = [
    { key: 'service',        labelKey: 'TICKETS.TAB_SERVICE_INFO' },
    { key: 'classification', labelKey: 'TICKETS.TAB_CLASSIFICATION' },
    { key: 'extra',          labelKey: 'TICKETS.TAB_EXTRA_DETAILS' },
    { key: 'history',        labelKey: 'TICKETS.TAB_HISTORY' },
  ];

  // Columns map to the flattened fields produced in loadHistory().
  readonly historyColumns: DataTableColumn[] = [
    { key: 'currentStatus', labelKey: 'TICKETS.HISTORY_CURRENT_STATUS' },
    { key: 'stepDecision',  labelKey: 'TICKETS.HISTORY_STEP_DECISION' },
    { key: 'contactAction', labelKey: 'TICKETS.HISTORY_CONTACT_ACTION' },
    { key: 'notes',         labelKey: 'TICKETS.HISTORY_NOTES' },
    { key: 'endOn',         labelKey: 'TICKETS.HISTORY_DUE_AT' },
    { key: 'overdueDate',   labelKey: 'TICKETS.HISTORY_SKIP_DATE' },
    { key: 'takenBy',       labelKey: 'TICKETS.HISTORY_DECIDED_BY' },
    { key: 'modifiedOn',    labelKey: 'TICKETS.HISTORY_CREATED_AT' },
    { key: 'dateArrival',   labelKey: 'TICKETS.DATE_ARRIVAL' },
  ];

  // Populated from /Complain/GetComplainSLAItems on each ticket change.
  historyRows: Record<string, unknown>[] = [];

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
