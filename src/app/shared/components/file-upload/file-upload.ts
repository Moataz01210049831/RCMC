import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../core/services/toast.service';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'];

@Component({
  selector: 'app-file-upload',
  imports: [TranslateModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  @Input() files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();

  readonly acceptAttr = ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',');

  constructor(private toast: ToastService, private translate: TranslateService) {}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const accepted: File[] = [];
    for (const file of Array.from(input.files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        this.toast.error(this.translate.instant('TICKETS.INVALID_FILE_TYPE', { name: file.name }));
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        this.toast.error(this.translate.instant('TICKETS.FILE_TOO_LARGE', { name: file.name }));
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length) {
      this.filesChange.emit([...this.files, ...accepted]);
    }
    input.value = '';
  }

  removeFile(index: number) {
    this.filesChange.emit(this.files.filter((_, i) => i !== index));
  }
}
