import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerCard, CustomerCardData } from '../../../shared/components/customer-card/customer-card';
import { RelatedEntities } from '../../../shared/components/related-entities/related-entities';

// Mock — replace with real API call using customer id
const MOCK_DETAIL: CustomerCardData = {
  id: 1,
  fullName: 'أحمد محمد العمري',
  idNumber: '1234567891',
  phone: '01127165682',
  birthDate: '20/09/2025',
  nationality: 'سعودي',
  gender: 'ذكر',
  city: 'الدمام',
  status: 'نشط',
  createdAt: '12/2/2025',
  createdBy: 'عزت م.ك',
  updatedAt: '12/2/2025 12:23pm',
};

@Component({
  selector: 'app-customer-detail',
  imports: [CustomerCard, RelatedEntities],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  customer = signal<CustomerCardData | null>(null);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // TODO: replace with this.http.get(`${environment.apiUrl}/customers/${id}`)
    this.customer.set({ ...MOCK_DETAIL, id });
  }

  goBack() {
    this.router.navigate(['/customers/search']);
  }

  edit() {
    this.router.navigate(['/customers/edit', this.customer()?.id]);
  }

  addEntity() {
    // TODO: navigate to add business entity
  }
}
