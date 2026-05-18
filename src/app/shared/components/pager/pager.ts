import { Component, computed, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pager',
  imports: [TranslateModule],
  templateUrl: './pager.html',
  styleUrl: './pager.scss',
})
export class Pager {
  currentPage = input.required<number>();
  totalPages  = input.required<number>();
  size        = input<'sm' | 'md'>('md');

  pageChange = output<number>();

  protected readonly atFirst = computed(() => this.currentPage() <= 1);
  protected readonly atLast  = computed(() => this.currentPage() >= this.totalPages());

  protected prev(event: MouseEvent) {
    event.stopPropagation();
    if (!this.atFirst()) this.pageChange.emit(this.currentPage() - 1);
  }

  protected next(event: MouseEvent) {
    event.stopPropagation();
    if (!this.atLast()) this.pageChange.emit(this.currentPage() + 1);
  }
}
