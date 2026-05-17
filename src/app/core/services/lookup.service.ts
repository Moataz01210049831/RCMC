import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LookupItem } from '../models/lookup.model';
import { ApiResponse } from '../models/api-response.model';
import { ComplaintRequirement } from '../models/complaint-requirement.model';

export type { LookupItem };

@Injectable({ providedIn: 'root' })
export class LookupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCities() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/city`)
      .pipe(map(res => res.Data ?? []));
  }

  getCountries() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/country`)
      .pipe(map(res => res.Data ?? []));
  }

  getRegions() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/region`)
      .pipe(map(res => res.Data ?? []));
  }

  getServiceProviders() {
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/service-providers`)
      .pipe(map(res => res.Data ?? []));
  }

  getMainServices(serviceProviderId: string) {
    const params = new HttpParams().set('serviceProviderId', serviceProviderId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/main-services`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  getSubServices(mainServiceId: string) {
    const params = new HttpParams().set('mainServiceId', mainServiceId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/sub-services`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  getComplaintMainCategories(subServiceId: string) {
    const params = new HttpParams().set('subServiceId', subServiceId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/main-categories`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  getComplaintSubCategories(mainCategoryId: string) {
    // API quirk: query param is named `subServiceId` but expects the main-category id.
    const params = new HttpParams().set('subServiceId', mainCategoryId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/sub-categories`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  // Inquiry endpoints not live yet — served from public/dummy-data JSON.
  getInquiryMainCategories() {
    return this.http.get<LookupItem[]>('./dummy-data/inquiry-main-categories.json');
  }

  getInquirySubCategories(mainId: string) {
    return this.http
      .get<Record<string, LookupItem[]>>('./dummy-data/inquiry-sub-categories.json')
      .pipe(map(byMain => byMain[mainId] ?? []));
  }

  getFilteredLookup(lookupId: string, filterByLookupId: string) {
    const params = new HttpParams()
      .set('lookupId', lookupId)
      .set('filterByLookupId', filterByLookupId);
    return this.http
      .get<ApiResponse<LookupItem[]>>(`${this.apiUrl}/Lookups/filter`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  getComplaintRequirements(subCategoryId: string) {
    const params = new HttpParams().set('subClassificationId', subCategoryId);
    return this.http
      .get<ApiResponse<ComplaintRequirement[]>>(`${this.apiUrl}/Surveys/GetQuestionsBySubCategoryId`, { params })
      .pipe(map(res => res.Data ?? []));
  }
}
