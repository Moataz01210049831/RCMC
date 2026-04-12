import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomerCardData } from '../../../core/models/customer-card.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

export type { CustomerCardData };

@Component({
  selector: 'app-customer-card',
  imports: [TranslatePipe],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  @Input() customer!: CustomerCardData;
  @Output() edit = new EventEmitter<void>();
  @Output() addEntity = new EventEmitter<void>();
}
