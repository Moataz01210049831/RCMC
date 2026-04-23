import { Injectable, signal } from '@angular/core';
import { EntityCardData } from '../models/customer-card.model';

@Injectable({ providedIn: 'root' })
export class SelectedEntityService {
  readonly entity = signal<EntityCardData | null>(null);

  set(entity: EntityCardData | null) {
    this.entity.set(entity);
  }

  clear() {
    this.entity.set(null);
  }
}
