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

  searchText = '';
  isOpen = false;
  selectedValues: string[] = [];

  private onChange = (_: string[]) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) {}

  get selectedLabels(): string {
    return this.items
      .filter(i => this.selectedValues.includes(i.value))
      .map(i => i.name)
      .join('، ');
  }

  get filtered(): LookupItem[] {
    const q = this.searchText.trim();
    if (!q) return this.items;
    return this.items.filter(i => i.name.includes(q));
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  open() {
    this.isOpen = true;
    this.searchText = '';
  }

  toggle(item: LookupItem, event: MouseEvent) {
    event.stopPropagation();
    const idx = this.selectedValues.indexOf(item.value);
    if (idx >= 0) {
      this.selectedValues = this.selectedValues.filter(v => v !== item.value);
    } else {
      this.selectedValues = [...this.selectedValues, item.value];
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
