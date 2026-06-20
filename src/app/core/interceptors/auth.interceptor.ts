import { HttpInterceptorFn } from '@angular/common/http';

// Storage key kept in sync with LanguageService.STORAGE_KEY. We read from
// localStorage directly (no DI) to avoid pulling LanguageService — which
// depends on TranslateService — into the interceptor and risking a cycle.
const LANG_STORAGE_KEY = 'lang';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const lang = (localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'ar');
  return next(req.clone({
    withCredentials: true,
    setHeaders: { 'Accept-Language': lang },
  }));
};
