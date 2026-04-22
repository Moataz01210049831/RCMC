import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../config/app-config';

@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  private currentTitleKey: string | null = null;

  constructor(
    private readonly title: Title,
    private readonly translate: TranslateService,
  ) {
    super();
    this.translate.onLangChange.subscribe(() => this.applyTitle());
  }

  override updateTitle(snapshot: RouterStateSnapshot) {
    this.currentTitleKey = this.buildTitle(snapshot) ?? null;
    this.applyTitle();
  }

  private applyTitle() {
    if (!this.currentTitleKey) {
      this.title.setTitle(AppConfig.browserTitle);
      return;
    }
    const translated = this.translate.instant(this.currentTitleKey);
    const pageName = translated && translated !== this.currentTitleKey ? translated : this.currentTitleKey;
    this.title.setTitle(`${AppConfig.browserTitle} | ${pageName}`);
  }
}
