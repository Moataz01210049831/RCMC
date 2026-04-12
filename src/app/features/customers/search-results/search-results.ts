import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import type { SearchContactsRequest } from '../../../core/models/contact.model';

interface Customer {
  id: string;
  fullName: string;
  idNumber: string;
  phone: string;
  idType: string;
}

const IDENTITY_TYPE_MAP: Record<number, string> = {
  1: 'هوية وطنية',
  2: 'إقامة',
  3: 'جواز سفر',
};

@Component({
  selector: 'app-search-results',
  imports: [],
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
            idType: IDENTITY_TYPE_MAP[c.identityType] ?? 'أخرى',
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
