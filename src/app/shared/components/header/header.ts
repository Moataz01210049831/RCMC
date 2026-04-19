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
  user = this.loadUser();

  private loadUser() {
    try {
      const raw = localStorage.getItem('user');
      const data = raw ? JSON.parse(raw) : null;
      const name: string = data?.UserName ?? '';
      const role: string = Array.isArray(data?.Roles) && data.Roles.length ? String(data.Roles[0]) : '';
      const initials = name ? name.trim().charAt(0).toUpperCase() : '';
      return { name, role, initials };
    } catch {
      return { name: '', role: '', initials: '' };
    }
  }

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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
