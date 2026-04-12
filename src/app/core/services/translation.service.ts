import { Injectable, signal } from '@angular/core';
import { ar } from '../i18n/ar';
import { en } from '../i18n/en';

export type Lang = 'ar' | 'en';

const TRANSLATIONS: Record<Lang, Record<string, string>> = { ar, en };
const STORAGE_KEY = 'app_lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private currentLang = signal<Lang>(this.loadLang());

  get lang() {
    return this.currentLang;
  }

  get isRtl(): boolean {
    return this.currentLang() === 'ar';
  }

  translate(key: string): string {
    return TRANSLATIONS[this.currentLang()][key] ?? key;
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleLang() {
    this.setLang(this.currentLang() === 'ar' ? 'en' : 'ar');
  }

  private loadLang(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return stored === 'en' ? 'en' : 'ar';
  }
}
