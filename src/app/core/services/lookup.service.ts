import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LookupItem } from '../models/lookup.model';
import { ApiResponse } from '../models/api-response.model';
import { ComplaintRequirement } from '../models/complaint-requirement.model';

export type EntityKind = 'Individual' | 'Business';

export type { LookupItem };

// API returns the label under different keys depending on Accept-Language:
//   AR → "nameAr"  (also "nameAR")
//   EN → "name"
// older endpoints still ship PascalCase "Name". Same story for Value/Child.
// Map everything to a single canonical LookupItem so callers stay simple.
function normalizeLookup(raw: any): LookupItem {
  if (!raw) return { Name: '', Value: '' };
  const name  = raw.Name  ?? raw.name  ?? raw.nameAr ?? raw.nameAR ?? raw.nameEn ?? '';
  const value = raw.Value ?? raw.value ?? raw.ID     ?? raw.id     ?? '';
  const child = raw.Child ?? raw.child ?? null;
  return {
    Name:  String(name ?? ''),
    Value: String(value ?? ''),
    Child: child ? normalizeLookup(child) : null,
  };
}

function normalizeList(data: unknown): LookupItem[] {
  return Array.isArray(data) ? data.map(normalizeLookup) : [];
}

@Injectable({ providedIn: 'root' })
export class LookupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCities() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/city`)
      .pipe(map(res => normalizeList(res.Data)));
  }

  getCountries() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/country`)
      .pipe(map(res => normalizeList(res.Data)));
  }

  getRegions() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/region`)
      .pipe(map(res => normalizeList(res.Data)));
  }

  getRegionsBySubCategory(subCategoryId: string) {
    const params = new HttpParams().set('subCategoryId', subCategoryId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/regions`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getServiceProviders(entityTypeId: string) {
    const params = new HttpParams().set('entityTypeId', entityTypeId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/service-providers`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  // Entity types lookup is small and constant — cache it for the session.
  private entityTypes$?: Observable<LookupItem[]>;
  getEntityTypes() {
    if (!this.entityTypes$) {
      this.entityTypes$ = this.http
        .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/entity-types`)
        .pipe(map(res => normalizeList(res.Data)), shareReplay(1));
    }
    return this.entityTypes$;
  }

  // Higher-level helper: resolve the right entity-type id by name, then load
  // its service providers. Callers (complaint / inquiry forms) just pass
  // 'Individual' when the customer picked فرد, or 'Business' for a CR.
  getServiceProvidersForKind(kind: EntityKind) {
    return this.getEntityTypes().pipe(
      switchMap(types => {
        const match = types.find(t => t.Name === kind);
        return match ? this.getServiceProviders(match.Value) : of<LookupItem[]>([]);
      }),
    );
  }

  getMainServices(serviceProviderId: string) {
    const params = new HttpParams().set('serviceProviderId', serviceProviderId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/main-services`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getSubServices(mainServiceId: string) {
    const params = new HttpParams().set('mainServiceId', mainServiceId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/sub-services`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getComplaintMainCategories(subServiceId: string) {
    const params = new HttpParams().set('subServiceId', subServiceId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/main-categories`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getComplaintSubCategories(mainCategoryId: string) {
    const params = new HttpParams().set('mainCategoryId', mainCategoryId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/sub-categories`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getInquiryMainCategories() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/complaintmaincategory`)
      .pipe(map(res => normalizeList(res.Data)));
  }

  getInquiryTypes() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/inquiry`)
      .pipe(map(res => normalizeList(res.Data)));
  }

  getInquirySubCategories(mainId: string) {
    return this.getFilteredLookup('complaintsubcategory', mainId);
  }

  getFilteredLookup(lookupId: string, filterByLookupId: string) {
    const params = new HttpParams()
      .set('lookupId', lookupId)
      .set('filterByLookupId', filterByLookupId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/filter`, { params })
      .pipe(map(res => normalizeList(res.Data)));
  }

  getComplaintRequirements(subCategoryId: string) {
    const params = new HttpParams().set('subClassificationId', subCategoryId);
    return this.http
      .get<ApiResponse<ComplaintRequirement[]>>(`${this.apiUrl}/Surveys/GetQuestionsBySubCategoryId`, { params })
      .pipe(map(res => res.Data ?? []));
  }
}
