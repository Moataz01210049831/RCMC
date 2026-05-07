import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TicketsLayout } from './tickets-layout/tickets-layout';
import { TicketType, TicketDetail } from './tickets-layout/tickets.types';
import { AddComplaint }  from './add-forms/add-complaint/add-complaint';
import { AddRequest }    from './add-forms/add-request/add-request';
import { AddInquiry }    from './add-forms/add-inquiry/add-inquiry';
import { AddSuggestion } from './add-forms/add-suggestion/add-suggestion';
import { ComplaintDetail } from './complaint-detail/complaint-detail';
import { ConfirmDialog }  from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ComplaintsService } from '../../../core/services/complaints.service';
import { SelectedEntityService } from '../../../core/services/selected-entity.service';
import { ToastService } from '../../../core/services/toast.service';
import { AddComplaintSubmission } from '../../../core/models/add-complaint.model';

@Component({
  selector: 'app-customer-tickets',
  imports: [TranslateModule, TicketsLayout, AddComplaint, AddRequest, AddInquiry, AddSuggestion, ConfirmDialog, ComplaintDetail],
  templateUrl: './customer-tickets.html',
  styleUrl: './customer-tickets.scss',
})
export class CustomerTickets {
  mode = signal<'view' | 'add'>('view');
  activeTicket = signal<TicketDetail | null>(null);
  activeType = signal<TicketType>('complaints');
  showConfirm = signal(false);

  contactId = '';
  commercialRecord = computed(() => this.selectedEntityService.entity()?.crNumber ?? '');
  relatedContext = computed(() => this.selectedEntityService.context());

  private pendingComplaintSubmission: AddComplaintSubmission | null = null;

  constructor(
    private route: ActivatedRoute,
    private complaintsService: ComplaintsService,
    private selectedEntityService: SelectedEntityService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {
    this.contactId = this.route.snapshot.paramMap.get('id') ?? '';
  }

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

  onComplaintSubmitted(submission: AddComplaintSubmission) {
    this.pendingComplaintSubmission = submission;
    this.showConfirm.set(true);
  }

  onAddSubmitted() {
    this.showConfirm.set(true);
  }

  onConfirmSave() {
    this.showConfirm.set(false);
    if (this.pendingComplaintSubmission && this.activeType() === 'complaints') {
      this.complaintsService.createComplaint(this.pendingComplaintSubmission).subscribe({
        next: () => {
          this.toast.success(this.translate.instant('TOAST.SUCCESS_TITLE'));
          this.pendingComplaintSubmission = null;
          this.mode.set('view');
        },
      });
      return;
    }
    this.mode.set('view');
  }

  onCancelConfirm() {
    this.showConfirm.set(false);
    this.pendingComplaintSubmission = null;
  }
}
