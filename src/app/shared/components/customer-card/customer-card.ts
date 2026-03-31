import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface CustomerCardData {
  id: number;
  fullName: string;
  idNumber: string;
  phone: string;
  birthDate: string;
  nationality: string;
  gender: string;
  city: string;
  status: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

@Component({
  selector: 'app-customer-card',
  imports: [],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  @Input() customer!: CustomerCardData;
  @Output() edit = new EventEmitter<void>();
  @Output() addEntity = new EventEmitter<void>();
}
