import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { PublicAttachmentsService } from '../../../core/services/public-attachments.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppConfig } from '../../../core/config/app-config';
import { ComplaintRequirement } from '../../../core/models/complaint-requirement.model';

@Component({
  selector: 'app-public-upload-attachment',
  imports: [TranslateModule, FileUpload],
  templateUrl: './upload-attachment.html',
  styleUrl: './upload-attachment.scss',
})
export class UploadAttachment implements OnInit {
  readonly config = AppConfig;

  ticketId = signal<string>('');
  ticketNumber = signal<string>('');
  // Each entry is a requirement plus its own picked files — one upload field per question.
  requiredFiles = signal<ComplaintRequirement[]>([]);
  submitting = signal(false);
  submitted = signal(false);

  constructor(
    private route: ActivatedRoute,
    private service: PublicAttachmentsService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('ticketId') ?? '';
    this.ticketId.set(id);
    if (!id) return;
    this.service.getComplainDetails(id).subscribe({
      next: data => {
        this.ticketNumber.set(data?.TicketNumber ?? '');
        const subId = data?.ComplaintSubCategoryId;
        if (subId) this.loadRequirements(subId);
      },
    });
  }

  private loadRequirements(subClassificationId: string) {
    this.service.getRequirementsBySubCategory(subClassificationId).subscribe({
      next: reqs => {
        this.requiredFiles.set(
          reqs
            .filter(r => r.Type === 'file' || r.Type === 'attachment')
            .map(r => ({ ...r, Value: [] as File[] })),
        );
      },
    });
  }

  onRequirementFilesChange(req: ComplaintRequirement, files: File[]) {
    req.Value = files;
    // Trigger signal change so canSubmit / hasAnyFile recompute.
    this.requiredFiles.set([...this.requiredFiles()]);
  }

  private collectedFiles(): File[] {
    return this.requiredFiles().flatMap(r => Array.isArray(r.Value) ? (r.Value as File[]) : []);
  }

  private hasFile(req: ComplaintRequirement): boolean {
    return Array.isArray(req.Value) && (req.Value as File[]).length > 0;
  }

  // Submit is enabled only when every required requirement has at least one file.
  // Optional requirements may stay empty.
  get canSubmit(): boolean {
    const reqs = this.requiredFiles();
    if (reqs.length === 0) return this.collectedFiles().length > 0;
    return reqs.every(r => !r.Required || this.hasFile(r));
  }

  submit() {
    const id = this.ticketId();
    const files = this.collectedFiles();
    if (!id || files.length === 0 || this.submitting()) return;

    this.submitting.set(true);
    this.service.uploadAttachments(id, files).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.toast.success(this.translate.instant('PUBLIC_UPLOAD.SUCCESS'));
      },
      error: () => {
        this.submitting.set(false);
        this.toast.error(this.translate.instant('PUBLIC_UPLOAD.ERROR'));
      },
    });
  }

  uploadMore() {
    this.requiredFiles.update(reqs => reqs.map(r => ({ ...r, Value: [] })));
    this.submitted.set(false);
  }
}
