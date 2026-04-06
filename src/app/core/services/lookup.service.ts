import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LookupItem } from '../models/lookup.model';
import { DUMMY_CITIES, DUMMY_COUNTRIES, DUMMY_REGIONS } from '../dummy-data/lookup.dummy';

export type { LookupItem };

@Injectable({ providedIn: 'root' })
export class LookupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCities() {
    return environment.useDummyData
      ? of(DUMMY_CITIES)
      : this.http.get<LookupItem[]>(`${this.apiUrl}/Lookups/Cities`);
  }

  getCountries() {
    return environment.useDummyData
      ? of(DUMMY_COUNTRIES)
      : this.http.get<LookupItem[]>(`${this.apiUrl}/Lookups/Countries`);
  }

  getRegions() {
    return environment.useDummyData
      ? of(DUMMY_REGIONS)
      : this.http.get<LookupItem[]>(`${this.apiUrl}/Lookups/Regions`);
  }
}
