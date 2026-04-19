import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LookupItem } from '../models/lookup.model';
import { ApiResponse } from '../models/api-response.model';
import { DUMMY_CITIES, DUMMY_COUNTRIES, DUMMY_REGIONS } from '../dummy-data/lookup.dummy';

export type { LookupItem };

@Injectable({ providedIn: 'root' })
export class LookupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCities() {
    return environment.useDummyData
      ? of(DUMMY_CITIES)
      : this.http
          .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/city`)
          .pipe(map(res => res.Data ?? []));
  }

  getCountries() {
    return environment.useDummyData
      ? of(DUMMY_COUNTRIES)
      : this.http
          .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/country`)
          .pipe(map(res => res.Data ?? []));
  }

  getRegions() {
    return environment.useDummyData
      ? of(DUMMY_REGIONS)
      : this.http
          .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/region`)
          .pipe(map(res => res.Data ?? []));
  }
}
