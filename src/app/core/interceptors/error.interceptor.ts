import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    map(event => {
      if (event.type === HttpEventType.Response) {
        const body: any = (event as HttpResponse<any>).body;
        if (body && typeof body === 'object' && 'Success' in body && body.Success === false) {
          toast.error(body.Message || translate.instant('TOAST.UNEXPECTED_ERROR'));
          throw new HttpErrorResponse({
            error: body,
            status: event.status,
            statusText: body.Message || event.statusText,
            url: event.url ?? undefined,
          });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      const alreadyToasted = !!error.error && typeof error.error === 'object' && 'Success' in error.error;
      if (!alreadyToasted) {
        const message = error.error?.Message ?? error.error?.message ?? error.message ?? translate.instant('TOAST.UNEXPECTED_ERROR');
        toast.error(message);
      }
      return throwError(() => error);
    }),
  );
};
