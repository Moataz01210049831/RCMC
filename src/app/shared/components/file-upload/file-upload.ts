import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-file-upload',
  imports: [TranslateModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUpload {
  @Input() files: File[] = [];
  @Output() filesChange = new EventEmitter<File[]>();

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const updated = [...this.files, ...Array.from(input.files)];
      this.files = updated;
      this.filesChange.emit(updated);
      input.value = '';
    }
  }

  removeFile(index: number) {
    const updated = this.files.filter((_, i) => i !== index);
    this.files = updated;
    this.filesChange.emit(updated);
  }
}
