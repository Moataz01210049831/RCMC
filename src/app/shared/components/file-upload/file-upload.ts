import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'mp4', 'mov', 'webm'];

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

  readonly errors = signal<string[]>([]);

  constructor(private translate: TranslateService) {}

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const accepted: File[] = [];
    const errors: string[] = [];
    for (const file of Array.from(input.files)) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(this.translate.instant('TICKETS.INVALID_FILE_TYPE', { name: file.name }));
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(this.translate.instant('TICKETS.FILE_TOO_LARGE', { name: file.name }));
        continue;
      }
      accepted.push(file);
    }

    this.errors.set(errors);
    if (accepted.length) {
      this.filesChange.emit([...this.files, ...accepted]);
    }
    input.value = '';
  }

  removeFile(index: number) {
    this.filesChange.emit(this.files.filter((_, i) => i !== index));
  }
}
