import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LookupItem } from '../../../core/services/lookup.service';

@Component({
  selector: 'app-searchable-select',
  imports: [FormsModule],
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
  @Input() placeholder = 'اختر...';
  @Input() invalid: boolean | null = false;

  searchText = '';
  isOpen = false;
  selectedValue = '';

  private onChange = (_: string) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  get selectedLabel(): string {
    return this.items.find(i => i.value === this.selectedValue)?.name ?? '';
  }

  get filtered(): LookupItem[] {
    const q = this.searchText.trim();
    if (!q) return this.items;
    return this.items.filter(i => i.name.includes(q));
  }

  open() {
    this.isOpen = true;
    this.searchText = '';
  }

  select(item: LookupItem) {
    this.selectedValue = item.value;
    this.isOpen = false;
    this.searchText = '';
    this.onChange(item.value);
    this.onTouched();
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
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
