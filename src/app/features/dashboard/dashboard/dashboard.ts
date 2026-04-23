import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import type { SearchContactsRequest } from '../../../core/models/contact.model';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  searchText = '';
  searchType = 'id';
  noResults = signal(false);
  searching = signal(false);

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private toast: ToastService,
    private translate: TranslateService,
  ) {}

  onSearchTextChange() {
    if (this.noResults()) this.noResults.set(false);
  }

  get canSearch(): boolean {
    const q = this.searchText.trim();
    if (!q) return false;
    if (this.searchType === 'id') return /^\d{10}$/.test(q);
    if (this.searchType === 'phone') return /^05\d{8}$/.test(q);
    return false;
  }

  search() {
    this.noResults.set(false);
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

    if (this.searchType === 'id') {
      request.identityNumber = q;
    } else if (this.searchType === 'name') {
      request.name = q;
    } else if (this.searchType === 'phone') {
      request.mobileNumber = q;
    }

    this.customerService.searchContacts(request).subscribe({
      next: (response) => {
        this.searching.set(false);
        if (response) {
          this.router.navigate(['/customers', response.id]);
        } else {
          this.noResults.set(true);
        }
      },
      error: () => {
        this.searching.set(false);
        this.noResults.set(true);
      },
    });
  }

  addClient() {
    this.router.navigate(['/customers/add']);
  }
}
