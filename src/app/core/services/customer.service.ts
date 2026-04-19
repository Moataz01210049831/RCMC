import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactResponse, CreateContactRequest, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse } from '../models/contact.model';
import { ApiResponse } from '../models/api-response.model';
import { DUMMY_CONTACT } from '../dummy-data/contact.dummy';

export type { CreateContactRequest, ContactResponse, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse };

interface ContactApiDto {
  Id?: string;
  EntityId?: string;
  FirstName: string;
  MiddleName?: string | null;
  Middlename?: string | null;
  ThirdName: string;
  LastName: string;
  FullName?: string;
  Email: string;
  MobileNumber1?: string | null;
  MobileNumber?: string | null;
  MobileNumber2?: string | null;
  IdentityNumber: string;
  IdentityType?: number;
  IdentityTypeId?: number;
  DateOfBirth?: string | null;
  Birthdate?: string | null;
  Gender?: number;
  GenderId?: number;
  PreferredContactMethod: number;
  PreferredLanguage: number;
  CityId: string;
  NationalityId: string | null;
  RegionId: string;
  CreatedOn?: string | null;
  CreatedDate?: string | null;
  CreationDate?: string | null;
  Created?: string | null;
  DateCreated?: string | null;
  CreatedAt?: string | null;
}

function mapContact(dto: ContactApiDto): ContactResponse {
  const created =
    dto.CreatedOn ??
    dto.CreatedDate ??
    dto.CreationDate ??
    dto.Created ??
    dto.DateCreated ??
    dto.CreatedAt ??
    '';
  return {
    id: dto.Id ?? dto.EntityId ?? '',
    firstName: dto.FirstName,
    middleName: dto.MiddleName ?? dto.Middlename ?? '',
    thirdName: dto.ThirdName,
    lastName: dto.LastName,
    email: dto.Email,
    mobileNumber1: dto.MobileNumber1 ?? dto.MobileNumber ?? '',
    mobileNumber2: dto.MobileNumber2 ?? '',
    identityNumber: dto.IdentityNumber,
    identityType: dto.IdentityType ?? dto.IdentityTypeId ?? 0,
    dateOfBirth: dto.DateOfBirth ?? dto.Birthdate ?? '',
    gender: dto.Gender ?? dto.GenderId ?? 0,
    preferredContactMethod: dto.PreferredContactMethod,
    preferredLanguage: dto.PreferredLanguage,
    cityId: dto.CityId,
    nationalityId: dto.NationalityId ?? '',
    regionId: dto.RegionId,
    CreatedOn:dto.CreatedOn ?? dto.CreatedDate ?? dto.CreationDate ?? dto.Created ?? dto.DateCreated ?? dto.CreatedAt ?? '',
  };
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createContact(data: CreateContactRequest) {
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/Contacts/Create`, data)
      .pipe(map(res => res.Data));
  }

  getContact(id: string) {
    if (environment.useDummyData) {
      return of({ ...DUMMY_CONTACT, id });
    }
    return this.http
      .get<ApiResponse<ContactApiDto>>(`${this.apiUrl}/Contacts/GetContactById?contactId=${id}`)
      .pipe(map(res => {
        if (!res.Data) return null;
        const mapped = mapContact(res.Data);
        return { ...mapped, id: mapped.id || id };
      }));
  }

  updateContact(data: UpdateContactRequest) {
    if (environment.useDummyData) {
      return of<UpdateContactResponse>({ success: true, message: 'Customer updated successfully', data: null, errors: null });
    }
    return this.http
      .post<ApiResponse<unknown>>(`${this.apiUrl}/Contacts/Update`, data)
      .pipe(map<ApiResponse<unknown>, UpdateContactResponse>(res => ({
        success: res.Success,
        message: res.Message,
        data: res.Data,
        errors: null,
      })));
  }

  searchContacts(request: SearchContactsRequest) {
    if (environment.useDummyData) {
      const dummy = DUMMY_CONTACT;
      const match = !request.identityNumber || dummy.identityNumber.includes(request.identityNumber);
      return of<ContactResponse | null>(match ? { ...dummy, id: '1' } : null);
    }

    let params = new HttpParams();
    if (request.identityNumber) {
      params = params.set('query.identityNumber', request.identityNumber);
    }
    if (request.name) {
      params = params.set('query.Name', request.name);
    }
    if (request.mobileNumber) {
      params = params.set('query.mobileNumber', request.mobileNumber);
    }

    return this.http
      .get<ApiResponse<ContactApiDto>>(`${this.apiUrl}/Contacts/ViewCustomerProfile`, { params })
      .pipe(map(res => (res.Data ? mapContact(res.Data) : null)));
  }
}
