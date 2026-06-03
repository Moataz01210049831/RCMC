import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export interface DataTableColumn {
  /** Property name on each row used to look up the cell value. */
  key:       string;
  /** Raw header text — wins over labelKey when both are set. Use this when
   *  the header should be dynamic (no translation file involved). */
  label?:    string;
  /** Translation key — used when no `label` is provided. */
  labelKey?: string;
  /** Optional CSS width (`"120px"`, `"15%"`, …). */
  width?:    string;
  /** Optional inline alignment: `'start'`, `'center'`, `'end'`. */
  align?:    'start' | 'center' | 'end';
}

@Component({
  selector: 'app-data-table',
  imports: [TranslateModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() columns: DataTableColumn[] = [];
  @Input() rows:    Record<string, unknown>[] = [];
  /** Translation key for the empty-state message. */
  @Input() emptyKey: string = 'COMMON.NO_RESULTS';

  cell(row: Record<string, unknown>, key: string): string {
    const v = row[key];
    if (v === null || v === undefined) return '-';
    const str = String(v).trim();
    return str === '' ? '-' : str;
  }
}