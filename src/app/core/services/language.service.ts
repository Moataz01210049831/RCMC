import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'lang';

  constructor(private translate: TranslateService) {}

  init() {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');
    const saved = this.getSavedLang();
    this.setLang(saved);
  }

  get currentLang(): Language {
    return this.translate.currentLang as Language || 'ar';
  }

  setLang(lang: Language) {
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleLang() {
    const next: Language = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLang(next);
  }

  private getSavedLang(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ar';
  }
}
