import { Injectable, signal } from '@angular/core';
import { EntityCardData } from '../models/customer-card.model';
import { RelatedContext } from '../models/add-complaint.model';

const STORAGE_KEY = 'selectedEntity';

@Injectable({ providedIn: 'root' })
export class SelectedEntityService {
  readonly entity  = signal<EntityCardData | null>(this.read());
  readonly context = signal<RelatedContext | null>(null);

  set(entity: EntityCardData | null) {
    this.entity.set(entity);
    if (entity) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entity));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  setContext(context: RelatedContext | null) {
    this.context.set(context);
  }

  clear() {
    this.set(null);
    this.context.set(null);
  }

  private read(): EntityCardData | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as EntityCardData : null;
    } catch {
      return null;
    }
  }
}
