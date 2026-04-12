import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import type { SearchContactsRequest } from '../../../core/models/contact.model';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  searchText = '';
  searchType = 'id';
  noResults = signal(false);
  searching = signal(false);

  constructor(private router: Router, private customerService: CustomerService, public t: TranslationService) {}

  search() {
    const q = this.searchText.trim();
    if (!q) {
      this.noResults.set(true);
      return;
    }

    this.noResults.set(false);
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
        if (response.items.length > 0) {
          this.router.navigate(['/customers', response.items[0].id]);
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
