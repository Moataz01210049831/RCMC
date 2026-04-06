import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private activeRequests = signal(0);

  readonly isLoading = computed(() => this.activeRequests() > 0);

  show() { this.activeRequests.update(n => n + 1); }
  hide() { this.activeRequests.update(n => Math.max(0, n - 1)); }
}
