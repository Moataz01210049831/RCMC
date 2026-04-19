import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerCardData } from '../../../core/models/customer-card.model';

export type { CustomerCardData };

@Component({
  selector: 'app-customer-card',
  imports: [TranslateModule],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  @Input() customer!: CustomerCardData;
  @Output() edit = new EventEmitter<void>();
  @Output() addEntity = new EventEmitter<void>();
  has(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    const str = String(value).trim();
    return str !== '' && str !== '-';
    

  }
}
