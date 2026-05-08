import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

interface DayCell {
  date: number;
  iso: string;
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-date-picker',
  imports: [TranslateModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
})
export class DatePicker implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() invalid: boolean | null = false;
  @Input() disabled = false;
  @Input() max: string | null = null;
  @Input() min: string | null = null;

  @HostBinding('class.disabled')
  get hostDisabled(): boolean { return this.disabled; }

  isOpen = false;
  value: string | null = null;
  viewYear: number;
  viewMonth: number;
  viewMode: 'days' | 'months' | 'years' = 'days';

  private onChange = (_: string | null) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef, public lang: LanguageService) {
    const now = new Date();
    this.viewYear = now.getFullYear();
    this.viewMonth = now.getMonth();
  }

  private get locale(): string {
    return this.lang.currentLang === 'ar' ? 'ar' : 'en-GB';
  }

  get displayValue(): string {
    if (!this.value) return '';
    return new Intl.DateTimeFormat(this.locale, {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(this.parseIso(this.value));
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat(this.locale, {
      month: 'long', year: 'numeric',
    }).format(new Date(this.viewYear, this.viewMonth, 1));
  }

  get monthOnlyLabel(): string {
    return new Intl.DateTimeFormat(this.locale, { month: 'long' })
      .format(new Date(this.viewYear, this.viewMonth, 1));
  }

  get yearOnlyLabel(): string {
    return new Intl.DateTimeFormat(this.locale, { year: 'numeric' })
      .format(new Date(this.viewYear, 0, 1));
  }

  get monthsList(): { idx: number; name: string; isCurrent: boolean }[] {
    const fmt = new Intl.DateTimeFormat(this.locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => ({
      idx:       i,
      name:      fmt.format(new Date(this.viewYear, i, 1)),
      isCurrent: i === this.viewMonth,
    }));
  }

  private get yearRangeStart(): number {
    return Math.floor(this.viewYear / 12) * 12;
  }

  get yearsList(): { year: number; isCurrent: boolean }[] {
    const start = this.yearRangeStart;
    return Array.from({ length: 12 }, (_, i) => ({
      year:      start + i,
      isCurrent: start + i === this.viewYear,
    }));
  }

  get yearsRangeLabel(): string {
    const start = this.yearRangeStart;
    return `${start} – ${start + 11}`;
  }

  get weekDays(): string[] {
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: 'short' });
    const sunday = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return fmt.format(d);
    });
  }

  get days(): DayCell[] {
    const first = new Date(this.viewYear, this.viewMonth, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const todayIso = this.toIso(new Date());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = this.toIso(d);
      return {
        date: d.getDate(),
        iso,
        inMonth: d.getMonth() === this.viewMonth,
        isToday: iso === todayIso,
        isSelected: iso === this.value,
        isDisabled: (this.max != null && iso > this.max) || (this.min != null && iso < this.min),
      };
    });
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseIso(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  toggle() {
    if (this.disabled) return;
    if (!this.isOpen && this.value) {
      const d = this.parseIso(this.value);
      this.viewYear = d.getFullYear();
      this.viewMonth = d.getMonth();
    }
    this.viewMode = 'days';
    this.isOpen = !this.isOpen;
  }

  prev(event: MouseEvent) {
    event.stopPropagation();
    if (this.viewMode === 'days') {
      if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
      else this.viewMonth--;
    } else if (this.viewMode === 'months') {
      this.viewYear--;
    } else {
      this.viewYear -= 12;
    }
  }

  next(event: MouseEvent) {
    event.stopPropagation();
    if (this.viewMode === 'days') {
      if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
      else this.viewMonth++;
    } else if (this.viewMode === 'months') {
      this.viewYear++;
    } else {
      this.viewYear += 12;
    }
  }

  showMonths(event: MouseEvent) {
    event.stopPropagation();
    this.viewMode = 'months';
  }

  showYears(event: MouseEvent) {
    event.stopPropagation();
    this.viewMode = 'years';
  }

  selectMonth(idx: number, event: MouseEvent) {
    event.stopPropagation();
    this.viewMonth = idx;
    this.viewMode = 'days';
  }

  selectYear(year: number, event: MouseEvent) {
    event.stopPropagation();
    this.viewYear = year;
    this.viewMode = 'months';
  }

  selectDay(cell: DayCell, event: MouseEvent) {
    event.stopPropagation();
    if (cell.isDisabled) return;
    this.value = cell.iso;
    this.onChange(cell.iso);
    this.onTouched();
    this.isOpen = false;
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.value = null;
    this.onChange(null);
    this.onTouched();
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null) {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  writeValue(value: string | null) { this.value = value ?? null; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(disabled: boolean) { this.disabled = disabled; }
}
