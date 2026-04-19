import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactResponse, CreateContactRequest, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse } from '../models/contact.model';
import { ApiResponse } from '../models/api-response.model';
import { DUMMY_CONTACT } from '../dummy-data/contact.dummy';

export type { CreateContactRequest, ContactResponse, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse };

interface ContactApiDto {
  Id: string;
  FirstName: string;
  MiddleName: string;
  ThirdName: string;
  LastName: string;
  FullName?: string;
  Email: string;
  MobileNumber1: string;
  MobileNumber2: string;
  IdentityNumber: string;
  IdentityType: number;
  DateOfBirth: string | null;
  Gender: number;
  PreferredContactMethod: number;
  PreferredLanguage: number;
  CityId: string;
  NationalityId: string | null;
  RegionId: string;
}

function mapContact(dto: ContactApiDto): ContactResponse {
  return {
    id: dto.Id,
    firstName: dto.FirstName,
    middleName: dto.MiddleName,
    thirdName: dto.ThirdName,
    lastName: dto.LastName,
    email: dto.Email,
    mobileNumber1: dto.MobileNumber1,
    mobileNumber2: dto.MobileNumber2,
    identityNumber: dto.IdentityNumber,
    identityType: dto.IdentityType,
    dateOfBirth: dto.DateOfBirth ?? '',
    gender: dto.Gender,
    preferredContactMethod: dto.PreferredContactMethod,
    preferredLanguage: dto.PreferredLanguage,
    cityId: dto.CityId,
    nationalityId: dto.NationalityId ?? '',
    regionId: dto.RegionId,
  };
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createContact(data: CreateContactRequest) {
    return this.http.post(`${this.apiUrl}/Contacts/Create`, data);
  }

  getContact(id: string) {
    if (environment.useDummyData) {
      return of({ ...DUMMY_CONTACT, id });
    }
    return this.http.get<ContactResponse>(`${this.apiUrl}/Contacts/GetContactById?contactId=${id}`);
  }

  updateContact(data: UpdateContactRequest) {
    if (environment.useDummyData) {
      return of<UpdateContactResponse>({ success: true, message: 'Customer updated successfully', data: null, errors: null });
    }
    return this.http.put<UpdateContactResponse>(`${this.apiUrl}/customers`, data);
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
