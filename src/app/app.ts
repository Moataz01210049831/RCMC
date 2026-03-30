import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppConfig } from './core/config/app-config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App implements OnInit {
  private title = inject(Title);

  ngOnInit() {
    this.title.setTitle(AppConfig.browserTitle);
  }
}
