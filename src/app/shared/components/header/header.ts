import { Component, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  dropdownOpen = signal(false);

  // Mock user — replace with AuthService later
  user = { name: 'عائدة كما', role: 'مشرف', initials: 'AG' };

  constructor(private router: Router) {}

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
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

  logout() {
    this.dropdownOpen.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
