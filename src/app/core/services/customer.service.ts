import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactResponse, CreateContactRequest, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse } from '../models/contact.model';
import { DUMMY_CONTACT } from '../dummy-data/contact.dummy';

export type { CreateContactRequest, ContactResponse, UpdateContactRequest, UpdateContactResponse, SearchContactsRequest, SearchContactsResponse };

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
    return this.http.get<ContactResponse>(`${this.apiUrl}/contacts/${id}`);
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
      return of<SearchContactsResponse>({
        items: match ? [{ ...dummy, id: '1' }] : [],
        totalCount: match ? 1 : 0,
        pageNumber: request.pageNumber,
        pageSize: request.pageSize,
      });
    }

    let params = new HttpParams()
      // .set('pageNumber', request.pageNumber)
      // .set('pageSize', request.pageSize);

    if (request.identityNumber) {
      params = params.set('query.identityNumber', request.identityNumber);
    }
    if (request.name) {
      params = params.set('query.Name', request.name);
    }
    if (request.mobileNumber) {
      params = params.set('query.mobileNumber', request.mobileNumber);
    }

    return this.http.get<SearchContactsResponse>(`${this.apiUrl}/Contacts/ViewCustomerProfile`, { params });
  }
}
