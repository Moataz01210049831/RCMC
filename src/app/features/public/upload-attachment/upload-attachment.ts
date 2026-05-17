import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUpload } from '../../../shared/components/file-upload/file-upload';
import { PublicAttachmentsService } from '../../../core/services/public-attachments.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppConfig } from '../../../core/config/app-config';

@Component({
  selector: 'app-public-upload-attachment',
  imports: [TranslateModule, FileUpload],
  templateUrl: './upload-attachment.html',
  styleUrl: './upload-attachment.scss',
})
export class UploadAttachment implements OnInit {
  readonly config = AppConfig;

  ticketId = signal<string>('');
  files = signal<File[]>([]);
  submitting = signal(false);
  submitted = signal(false);

  constructor(
    private route: ActivatedRoute,
    private service: PublicAttachmentsService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.ticketId.set(this.route.snapshot.paramMap.get('ticketId') ?? '');
  }

  onFilesChange(files: File[]) {
    this.files.set(files);
  }

  submit() {
    const id = this.ticketId();
    const files = this.files();
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
    this.files.set([]);
    this.submitted.set(false);
  }
}
