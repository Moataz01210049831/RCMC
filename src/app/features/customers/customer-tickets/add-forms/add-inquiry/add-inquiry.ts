import { Component, EventEmitter, HostListener, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SearchableSelect } from '../../../../../shared/components/searchable-select/searchable-select';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { LookupItem, LookupService } from '../../../../../core/services/lookup.service';
import { KnowledgeBaseService } from '../../../../../core/services/knowledge-base.service';
import { AddInquiryForm } from '../../../../../core/models/add-inquiry.model';
import { KbArticle } from '../../../../../core/models/kb-article.model';

@Component({
  selector: 'app-add-inquiry',
  imports: [TranslateModule, FormsModule, SearchableSelect, ConfirmDialog],
  templateUrl: './add-inquiry.html',
  styleUrl: './add-inquiry.scss',
})
export class AddInquiry implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<AddInquiryForm>();

  currentStep = signal<1 | 2 | 3>(1);
  showDiscardConfirm = signal(false);

  // Knowledge base state
  kbQuery = '';
  kbResults = signal<KbArticle[]>([]);
  kbLoading = signal(false);
  activeArticle = signal<KbArticle | null>(null);
  private kbSearchTimer: ReturnType<typeof setTimeout> | null = null;

  form: AddInquiryForm = {
    entityId:             null,
    mainClassificationId: null,
    subClassificationId:  null,
    inquiryTypeId:        null,
    submitterTypeId:      null,
    details:              '',
    isInquiryAnswered:    null,
    selectedArticles:     [],
    notes:                '',
  };

  entities: LookupItem[] = [];
  mainClassifications: LookupItem[] = [];
  subClassifications: LookupItem[] = [];

  // TODO: replace with API-driven lookups when the endpoints are available
  inquiryTypes: LookupItem[] = [
    { Value: 'general',   Name: 'استفسار عام' },
    { Value: 'service',   Name: 'استفسار عن خدمة' },
    { Value: 'procedure', Name: 'استفسار عن إجراء' },
    { Value: 'other',     Name: 'أخرى' },
  ];

  submitterTypes: LookupItem[] = [
    { Value: 'citizen',  Name: 'مواطن' },
    { Value: 'resident', Name: 'مقيم' },
    { Value: 'visitor',  Name: 'زائر' },
    { Value: 'employee', Name: 'موظف' },
  ];

  steps = [
    { index: 1, labelKey: 'TICKETS.STEP_INQUIRY_INFO' },
    { index: 2, labelKey: 'TICKETS.STEP_INQUIRY_DETAILS' },
    { index: 3, labelKey: 'TICKETS.STEP_EXTRA_DETAILS' },
  ];

  constructor(
    private lookupService: LookupService,
    private kbService: KnowledgeBaseService,
  ) {}

  ngOnInit() {
    this.lookupService.getServiceProviders().subscribe({
      next: data => (this.entities = data),
    });
    this.lookupService.getInquiryMainCategories().subscribe({
      next: data => (this.mainClassifications = data),
    });
  }

  onMainClassificationChange() {
    this.form.subClassificationId = null;
    this.subClassifications = [];
    const mainId = this.form.mainClassificationId;
    if (!mainId) return;
    this.lookupService.getInquirySubCategories(mainId).subscribe({
      next: data => (this.subClassifications = data),
    });
  }

  // ── Knowledge base ───────────────────────────────────────────────
  onAnsweredChange(answered: boolean) {
    this.form.isInquiryAnswered = answered;
    if (!answered) {
      this.form.selectedArticles = [];
      this.kbResults.set([]);
      this.kbQuery = '';
      if (this.kbSearchTimer) {
        clearTimeout(this.kbSearchTimer);
        this.kbSearchTimer = null;
      }
    }
  }

  onKbQueryInput() {
    if (this.kbSearchTimer) clearTimeout(this.kbSearchTimer);
    const q = this.kbQuery.trim();
    if (!q) {
      this.kbResults.set([]);
      this.kbLoading.set(false);
      return;
    }
    this.kbSearchTimer = setTimeout(() => this.runKbSearch(q), 400);
  }

  private runKbSearch(q: string) {
    this.kbLoading.set(true);
    this.kbService.searchArticles(q).subscribe({
      next: data => { this.kbResults.set(data); this.kbLoading.set(false); },
      error: () => this.kbLoading.set(false),
    });
  }

  openArticle(a: KbArticle) { this.activeArticle.set(a); }
  closeArticle() { this.activeArticle.set(null); }

  selectArticle(a: KbArticle) {
    if (!this.form.selectedArticles.some(x => x.Id === a.Id)) {
      this.form.selectedArticles = [...this.form.selectedArticles, a];
    }
    this.activeArticle.set(null);
  }

  removeArticle(id: string) {
    this.form.selectedArticles = this.form.selectedArticles.filter(a => a.Id !== id);
  }

  isArticleSelected(id: string): boolean {
    return this.form.selectedArticles.some(a => a.Id === id);
  }

  // ── Validation ───────────────────────────────────────────────────
  get step1Valid(): boolean {
    return !!this.form.entityId && !!this.form.mainClassificationId && !!this.form.subClassificationId;
  }

  get step2Valid(): boolean {
    if (!this.form.inquiryTypeId || !this.form.submitterTypeId) return false;
    if (this.form.details.trim() === '') return false;
    if (this.form.isInquiryAnswered === null) return false;
    if (this.form.isInquiryAnswered && this.form.selectedArticles.length === 0) return false;
    return true;
  }

  get canProceed(): boolean {
    const step = this.currentStep();
    if (step === 1) return this.step1Valid;
    if (step === 2) return this.step2Valid;
    return true;
  }

  next() {
    if (!this.canProceed) return;
    if (this.currentStep() < 3) {
      this.currentStep.set((this.currentStep() + 1) as 1 | 2 | 3);
      return;
    }
    console.log('[AddInquiry] submit payload:', JSON.parse(JSON.stringify(this.form)));
    this.submitted.emit(this.form);
  }

  prev() {
    if (this.currentStep() > 1) {
      this.currentStep.set((this.currentStep() - 1) as 1 | 2 | 3);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) event.preventDefault();
  }

  onCancel() {
    if (this.hasUnsavedChanges()) {
      this.showDiscardConfirm.set(true);
      return;
    }
    this.cancel.emit();
  }

  onConfirmDiscard() { this.showDiscardConfirm.set(false); this.cancel.emit(); }
  onCancelDiscard()  { this.showDiscardConfirm.set(false); }

  private hasUnsavedChanges(): boolean {
    const f = this.form;
    if (f.entityId || f.mainClassificationId || f.subClassificationId) return true;
    if (f.inquiryTypeId || f.submitterTypeId) return true;
    if (f.details.trim() !== '' || f.notes.trim() !== '') return true;
    if (f.isInquiryAnswered !== null) return true;
    if (f.selectedArticles.length > 0) return true;
    return false;
  }
}
