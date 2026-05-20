import { Injectable, signal } from '@angular/core';
import { EntityCardData } from '../models/customer-card.model';
import { RelatedContext } from '../models/add-complaint.model';

const STORAGE_KEY = 'selectedEntity';
const CONTEXT_KEY = 'selectedEntityContext';

@Injectable({ providedIn: 'root' })
export class SelectedEntityService {
  readonly entity  = signal<EntityCardData | null>(this.readEntity());
  readonly context = signal<RelatedContext | null>(this.readContext());

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
    if (context) {
      sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
    } else {
      sessionStorage.removeItem(CONTEXT_KEY);
    }
  }

  clear() {
    this.set(null);
    this.setContext(null);
  }

  private readEntity(): EntityCardData | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as EntityCardData : null;
    } catch {
      return null;
    }
  }

  private readContext(): RelatedContext | null {
    try {
      const raw = sessionStorage.getItem(CONTEXT_KEY);
      return raw ? JSON.parse(raw) as RelatedContext : null;
    } catch {
      return null;
    }
  }
}
