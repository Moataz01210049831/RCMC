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
  selector: 'app-multi-select',
  imports: [FormsModule, TranslateModule],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelect),
      multi: true,
    },
  ],
})
export class MultiSelect implements ControlValueAccessor {
  @Input() items: LookupItem[] = [];
  @Input() placeholder = '';
  @Input() invalid: boolean | null = false;

  @HostBinding('attr.role') hostRole = 'combobox';
  @HostBinding('attr.tabindex') hostTabIndex = '0';

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  @HostListener('keydown', ['$event'])
  onHostKeydown(event: KeyboardEvent) {
    // Closed: open on activation keys
    if (!this.isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    // Open: navigation works whether host or search input has focus
    const items = this.filtered;
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT';

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (items.length) {
          this.activeIndex = (this.activeIndex + 1) % items.length;
          this.scrollActiveIntoView();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (items.length) {
          this.activeIndex = this.activeIndex <= 0 ? items.length - 1 : this.activeIndex - 1;
          this.scrollActiveIntoView();
        }
        break;
      case 'Home':
        if (isInput) return; // let Home work inside the search text
        event.preventDefault();
        if (items.length) { this.activeIndex = 0; this.scrollActiveIntoView(); }
        break;
      case 'End':
        if (isInput) return;
        event.preventDefault();
        if (items.length) { this.activeIndex = items.length - 1; this.scrollActiveIntoView(); }
        break;
      case 'Enter':
        event.preventDefault();
        if (this.activeIndex >= 0 && this.activeIndex < items.length) {
          this.toggleByItem(items[this.activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        (this.el.nativeElement as HTMLElement).focus();
        break;
      case 'Tab':
        this.isOpen = false;
        break;
    }
  }

  onSearchInput() {
    this.activeIndex = this.filtered.length > 0 ? 0 : -1;
  }

  private scrollActiveIntoView() {
    queueMicrotask(() => {
      const list = (this.el.nativeElement as HTMLElement).querySelector('#ms-list');
      const active = list?.children?.[this.activeIndex] as HTMLElement | undefined;
      active?.scrollIntoView({ block: 'nearest' });
    });
  }

  searchText = '';
  isOpen = false;
  selectedValues: string[] = [];
  activeIndex = -1;

  private onChange = (_: string[]) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  get selectedLabels(): string {
    return this.items
      .filter(i => this.selectedValues.includes(i.Value))
      .map(i => i.Name)
      .join('، ');
  }

  get filtered(): LookupItem[] {
    const q = this.searchText.trim();
    if (!q) return this.items;
    return this.items.filter(i => i.Name.includes(q));
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  open() {
    this.isOpen = true;
    this.searchText = '';
    this.activeIndex = this.filtered.length > 0 ? 0 : -1;
    setTimeout(() => {
      this.searchInput?.nativeElement.focus();
      this.scrollActiveIntoView();
    }, 0);
  }

  toggle(item: LookupItem, event: MouseEvent) {
    event.stopPropagation();
    this.toggleByItem(item);
  }

  private toggleByItem(item: LookupItem) {
    const idx = this.selectedValues.indexOf(item.Value);
    if (idx >= 0) {
      this.selectedValues = this.selectedValues.filter(v => v !== item.Value);
    } else {
      this.selectedValues = [...this.selectedValues, item.Value];
    }
    this.onChange(this.selectedValues);
    this.onTouched();
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.selectedValues = [];
    this.onChange([]);
    this.onTouched();
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null) {
    if (!this.el.nativeElement.contains(target)) {
      this.isOpen = false;
      this.searchText = '';
    }
  }

  writeValue(value: string[]) { this.selectedValues = value ?? []; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState() {}
}
