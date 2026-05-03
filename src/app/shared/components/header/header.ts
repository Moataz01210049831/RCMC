import { Component, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../core/config/app-config';
import { LanguageService } from '../../../core/services/language.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import type { SearchContactsRequest } from '../../../core/models/contact.model';

@Component({
  selector: 'app-header',
  imports: [TranslateModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  dropdownOpen = signal(false);
  searching = signal(false);
  searchText = '';
  searchType: 'id' | 'phone' = 'id';

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

  constructor(
    private router: Router,
    public langService: LanguageService,
    private customerService: CustomerService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  get canSearch(): boolean {
    const q = this.searchText.trim();
    if (!q) return false;
    if (this.searchType === 'id') return /^\d{10}$/.test(q);
    if (this.searchType === 'phone') return /^05\d{8}$/.test(q);
    return false;
  }

  get inputErrorKey(): string | null {
    const q = this.searchText.trim();
    if (!q) return null;
    if (this.searchType === 'id' && !/^\d{10}$/.test(q)) return 'DASHBOARD.ID_INVALID';
    if (this.searchType === 'phone' && !/^05\d{8}$/.test(q)) return 'DASHBOARD.PHONE_INVALID';
    return null;
  }

  onSearchTypeChange() {
    this.searchText = '';
  }

  onDigitsOnlyInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned !== input.value) input.value = cleaned;
    this.searchText = cleaned;
  }

  search() {
    if (this.searching()) return;
    const q = this.searchText.trim();

    if (!q) {
      this.toast.error(this.translate.instant('DASHBOARD.SEARCH_REQUIRED'));
      return;
    }
    if (this.searchType === 'id' && !/^\d{10}$/.test(q)) {
      this.toast.error(this.translate.instant('DASHBOARD.ID_INVALID'));
      return;
    }
    if (this.searchType === 'phone' && !/^05\d{8}$/.test(q)) {
      this.toast.error(this.translate.instant('DASHBOARD.PHONE_INVALID'));
      return;
    }

    this.searching.set(true);
    const request: SearchContactsRequest = { pageNumber: 1, pageSize: 1 };
    if (this.searchType === 'id') request.identityNumber = q;
    else if (this.searchType === 'phone') request.mobileNumber = q;

    this.customerService.searchContacts(request).subscribe({
      next: response => {
        this.searching.set(false);
        if (response) {
          this.router.navigate(['/customers', response.id]);
          this.searchText = '';
        } else {
          this.toast.info(this.translate.instant('DASHBOARD.NO_SEARCH_DATA'));
        }
      },
      error: () => this.searching.set(false),
    });
  }

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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
