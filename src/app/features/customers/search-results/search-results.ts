import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomerService } from '../../../core/services/customer.service';
import type { SearchContactsRequest } from '../../../core/models/contact.model';

interface Customer {
  id: string;
  fullName: string;
  idNumber: string;
  phone: string;
  idType: string;
}

const IDENTITY_TYPE_KEYS: Record<number, string> = {
  1: 'IDENTITY_TYPES.NATIONAL_ID',
  2: 'IDENTITY_TYPES.RESIDENCE',
  3: 'IDENTITY_TYPES.PASSPORT',
};

@Component({
  selector: 'app-search-results',
  imports: [TranslateModule],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {
  query = signal('');
  results = signal<Customer[]>([]);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] ?? '';
      const type = params['type'] ?? 'id';
      this.query.set(q);

      if (!q) {
        this.results.set([]);
        return;
      }

      const request: SearchContactsRequest = {
        pageNumber: 1,
        pageSize: 5,
      };

      if (type === 'id') {
        request.identityNumber = q;
      } else if (type === 'name') {
        request.name = q;
      } else if (type === 'phone') {
        request.mobileNumber = q;
      }

      this.loading.set(true);
      this.customerService.searchContacts(request).subscribe({
        next: (response) => {
          const customers: Customer[] = response.items.map(c => ({
            id: c.id,
            fullName: `${c.firstName} ${c.middleName} ${c.thirdName} ${c.lastName}`.trim(),
            idNumber: c.identityNumber,
            phone: c.mobileNumber1,
            idType: this.translate.instant(IDENTITY_TYPE_KEYS[c.identityType] ?? 'IDENTITY_TYPES.OTHER'),
          }));
          this.results.set(customers);
          this.loading.set(false);
        },
        error: () => {
          this.results.set([]);
          this.loading.set(false);
        },
      });
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  addCustomer() {
    this.router.navigate(['/customers/add']);
  }

  viewCustomer(id: string) {
    this.router.navigate(['/customers', id]);
  }
}
