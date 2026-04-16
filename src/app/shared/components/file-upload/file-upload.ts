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
      this.filesChange.emit([...this.files, ...Array.from(input.files)]);
      input.value = '';
    }
  }

  removeFile(index: number) {
    this.filesChange.emit(this.files.filter((_, i) => i !== index));
  }
}
