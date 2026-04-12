import { Component, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfig } from '../../../core/config/app-config';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-header',
  imports: [TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  dropdownOpen = signal(false);

  readonly config = AppConfig;
  user = { name: 'عائدة كما', role: 'مشرف', initials: 'AG' };

  constructor(private router: Router, public langService: LanguageService) {}

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  toggleLang() {
    this.langService.toggleLang();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.account')) {
      this.dropdownOpen.set(false);
    }
  }

  changePassword() {
    this.dropdownOpen.set(false);
    this.router.navigate(['/change-password']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.dropdownOpen.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
