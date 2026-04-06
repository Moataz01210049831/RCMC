import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      switch (error.status) {
        case 0:   message = 'تعذّر الاتصال بالخادم، تحقق من الشبكة';        break;
        case 400: message = 'غير مصرح، يرجى تسجيل الدخول مجدداً';           break;
        case 422: message = error.error?.message ?? 'بيانات غير صحيحة';      break;
        case 401: message = 'غير مصرح، يرجى تسجيل الدخول مجدداً';           break;
        case 403: message = 'ليس لديك صلاحية للقيام بهذه العملية';           break;
        case 404: message = 'المورد المطلوب غير موجود';                       break;
        default:  message = error.status >= 500
                    ? 'خطأ في الخادم، يرجى المحاولة لاحقاً'
                    : 'حدث خطأ غير متوقع';
      }

      toast.error(message);
      return throwError(() => error);
    }),
  );
};
