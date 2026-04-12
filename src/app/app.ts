import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppConfig } from './core/config/app-config';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private title = inject(Title);
  private t = inject(TranslationService);

  ngOnInit() {
    this.title.setTitle(AppConfig.browserTitle);
    // Apply saved language direction on startup
    this.t.setLang(this.t.lang());
  }
}
