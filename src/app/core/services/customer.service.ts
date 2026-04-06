import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactResponse, CreateContactRequest } from '../models/contact.model';
import { DUMMY_CONTACT } from '../dummy-data/contact.dummy';

export type { CreateContactRequest, ContactResponse };

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
}
