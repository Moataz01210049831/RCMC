import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../services/toast.service';

const TOASTED = Symbol('toasted');

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    map(event => {
      if (event.type === HttpEventType.Response) {
        const body: any = (event as HttpResponse<any>).body;
        if (body && typeof body === 'object' && 'Success' in body && body.Success === false) {
          toast.error(body.Message || translate.instant('TOAST.UNEXPECTED_ERROR'));
          const err = new HttpErrorResponse({
            error: body,
            status: event.status,
            statusText: body.Message || event.statusText,
            url: event.url ?? undefined,
          });
          (err as any)[TOASTED] = true;
          throw err;
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      if (!(error as any)[TOASTED]) {
        const body: any = error.error;
        const envelopeMessage = body && typeof body === 'object' && 'Success' in body ? body.Message : null;
        const message = envelopeMessage ?? body?.message ?? error.message ?? translate.instant('TOAST.UNEXPECTED_ERROR');
        toast.error(message);
      }
      return throwError(() => error);
    }),
  );
};
