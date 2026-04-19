import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
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

  searchText = '';
  isOpen = false;
  selectedValue = '';

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
    this.isOpen = true;
    this.searchText = '';
  }

  select(item: LookupItem) {
    this.selectedValue = item.Value;
    this.isOpen = false;
    this.searchText = '';
    this.onChange(item.Value);
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
