import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Customer {
  id: number;
  fullName: string;
  idNumber: string;
  phone: string;
  idType: string;
}

// Mock data — replace with real API call
const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, fullName: 'أحمد محمد العمري',      idNumber: '1234567890', phone: '0512345678', idType: 'هوية وطنية' },
  { id: 2, fullName: 'سارة عبدالله الزهراني', idNumber: '2345678901', phone: '0523456789', idType: 'هوية وطنية' },
  { id: 3, fullName: 'خالد سعيد القحطاني',   idNumber: '3456789012', phone: '0534567890', idType: 'إقامة' },
];

@Component({
  selector: 'app-search-results',
  imports: [],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults implements OnInit {
  query = signal('');
  results = signal<Customer[]>([]);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q = params['q'] ?? '';
      const type = params['type'] ?? 'id';
      this.query.set(q);

      // TODO: replace with real API call using q + type
      const filtered = MOCK_CUSTOMERS.filter(c =>
        type === 'id'
          ? c.idNumber.includes(q)
          : c.fullName.includes(q)
      );
      this.results.set(filtered);
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  addCustomer() {
    this.router.navigate(['/customers/add']);
  }
}
