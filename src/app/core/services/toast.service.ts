import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService, private translate: TranslateService) {}

  success(message: string, title?: string) {
    this.toastr.success(message, title ?? this.translate.instant('TOAST.SUCCESS_TITLE'));
  }

  error(message: string, title?: string) {
    this.toastr.error(message, title ?? this.translate.instant('TOAST.ERROR_TITLE'));
  }

  info(message: string, title = '') {
    this.toastr.info(message, title);
  }

  warning(message: string, title = '') {
    this.toastr.warning(message, title);
  }
}
