import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CustomerCardData, EntityCardData } from '../../../core/models/customer-card.model';

export type { CustomerCardData, EntityCardData };

@Component({
  selector: 'app-customer-card',
  imports: [TranslateModule],
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  @Input() customer!: CustomerCardData;
  @Input() entity: EntityCardData | null = null;
  @Output() edit = new EventEmitter<void>();
  @Output() addEntity = new EventEmitter<void>();
  has(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    const str = String(value).trim();
    return str !== '' && str !== '-';
  }
}
