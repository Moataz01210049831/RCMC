import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'حدث خطأ غير متوقع';

      if (error.status === 0) {
        message = 'تعذّر الاتصال بالخادم، تحقق من الشبكة';
      } else if (error.status === 401) {
        message = 'غير مصرح، يرجى تسجيل الدخول مجدداً';
      } else if (error.status === 403) {
        message = 'ليس لديك صلاحية للقيام بهذه العملية';
      } else if (error.status === 404) {
        message = 'المورد المطلوب غير موجود';
      } else if (error.status === 422 || error.status === 400) {
        message = error.error?.message ?? 'بيانات غير صحيحة';
      } else if (error.status >= 500) {
        message = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
      }

      toast.error(message);
      return throwError(() => error);
    }),
  );
};
