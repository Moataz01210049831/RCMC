import { HttpErrorResponse, HttpEventType, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../services/toast.service';

const TOASTED = Symbol('toasted');

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  const toast = () => injector.get(ToastService);
  const translate = () => injector.get(TranslateService);
  const router = () => injector.get(Router);

  const handleUnauthorized = () => {
    if (router().url.startsWith('/login')) return;
    toast().error(translate().instant('TOAST.SESSION_EXPIRED'));
    router().navigate(['/login']);
  };

  return next(req).pipe(
    map(event => {
      if (event.type === HttpEventType.Response) {
        const body: any = (event as HttpResponse<any>).body;
        if (body && typeof body === 'object' && 'Success' in body && body.Success === false) {
          toast().error(body.Message || translate().instant('TOAST.UNEXPECTED_ERROR'));
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
      if (error.status === 401) {
        handleUnauthorized();
        return throwError(() => error);
      }
      if (!(error as any)[TOASTED]) {
        const isNetworkError = error.status === 0 || !navigator.onLine;
        if (isNetworkError) {
          toast().error(translate().instant('TOAST.NO_CONNECTION'));
        } else {
          const body: any = error.error;
          const envelopeMessage = body && typeof body === 'object' && 'Success' in body ? body.Message : null;
          const message = envelopeMessage ?? body?.message ?? error.message ?? translate().instant('TOAST.UNEXPECTED_ERROR');
          toast().error(message);
        }
      }
      return throwError(() => error);
    }),
  );
};
