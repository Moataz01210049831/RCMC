import {
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LookupItem } from '../../../core/services/lookup.service';

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule, TranslateModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelect),
      multi: true,
    },
  ],
})
export class SearchableSelect implements ControlValueAccessor {
  @Input() items: LookupItem[] = [];
  @Input() placeholder = '';
  @Input() invalid: boolean | null = false;
  @Input() disabled = false;

  @HostBinding('attr.role') hostRole = 'combobox';

  @HostBinding('attr.tabindex')
  get hostTabIndex(): string { return this.disabled ? '-1' : '0'; }

  @HostBinding('attr.aria-disabled')
  get hostAriaDisabled(): string { return this.disabled ? 'true' : 'false'; }

  @HostBinding('class.disabled')
  get isDisabledClass(): boolean { return this.disabled; }

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchText = '';
  isOpen = false;
  selectedValue = '';
  activeIndex = -1;

  private onChange = (_: string) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  get selectedLabel(): string {
    return this.items.find(i => i.Value === this.selectedValue)?.Name ?? '';
  }

  get filtered(): LookupItem[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(i => i.Name.toLowerCase().includes(q));
  }

  open() {
    if (this.disabled) return;
    this.isOpen = true;
    this.searchText = '';
    const selectedIdx = this.filtered.findIndex(i => i.Value === this.selectedValue);
    this.activeIndex = selectedIdx >= 0 ? selectedIdx : (this.filtered.length > 0 ? 0 : -1);
    queueMicrotask(() => {
      this.searchInput?.nativeElement.focus();
      this.scrollActiveIntoView();
    });
  }

  @HostListener('keydown', ['$event'])
  onTriggerKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT') return;
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.open();
    } else if (event.key === 'Escape' && this.isOpen) {
      event.preventDefault();
      this.isOpen = false;
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (!this.isOpen) return;
    const items = this.filtered;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (items.length === 0) return;
      this.activeIndex = (this.activeIndex + 1) % items.length;
      this.scrollActiveIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (items.length === 0) return;
      this.activeIndex = this.activeIndex <= 0 ? items.length - 1 : this.activeIndex - 1;
      this.scrollActiveIntoView();
    } else if (event.key === 'Home') {
      event.preventDefault();
      if (items.length > 0) { this.activeIndex = 0; this.scrollActiveIntoView(); }
    } else if (event.key === 'End') {
      event.preventDefault();
      if (items.length > 0) { this.activeIndex = items.length - 1; this.scrollActiveIntoView(); }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeIndex >= 0 && this.activeIndex < items.length) {
        this.select(items[this.activeIndex]);
        (this.el.nativeElement as HTMLElement).focus();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.isOpen = false;
      (this.el.nativeElement as HTMLElement).focus();
    } else if (event.key === 'Tab') {
      this.isOpen = false;
    }
  }

  onSearchInput() {
    this.activeIndex = this.filtered.length > 0 ? 0 : -1;
  }

  private scrollActiveIntoView() {
    queueMicrotask(() => {
      const list = (this.el.nativeElement as HTMLElement).querySelector('#ss-list');
      const active = list?.children?.[this.activeIndex] as HTMLElement | undefined;
      active?.scrollIntoView({ block: 'nearest' });
    });
  }

  select(item: LookupItem) {
    if (this.disabled) return;
    this.selectedValue = item.Value;
    this.isOpen = false;
    this.searchText = '';
    this.activeIndex = -1;
    this.onChange(item.Value);
    this.onTouched();
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    if (this.disabled) return;
    this.selectedValue = '';
    this.onChange('');
    this.onTouched();
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null) {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen = false;
      this.searchText = '';
    }
  }

  writeValue(value: string) { this.selectedValue = value ?? ''; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState() {}
}
