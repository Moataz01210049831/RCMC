import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactResponse, CreateContactRequest } from '../models/contact.model';

export type { CreateContactRequest, ContactResponse };

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createContact(data: CreateContactRequest) {
    return this.http.post(`${this.apiUrl}/Contacts/Create`, data);
  }

  getContact(id: string) {
    const dummy: ContactResponse = {
      id,
      firstName:              'حسن',
      middleName:             'حمدان',
      thirdName:              'محمد',
      lastName:               'جاد',
      cityId:                 'city-05',
      dateOfBirth:            '1990-05-15T00:00:00',
      email:                  'hassan.gad@example.com',
      gender:                 1,
      identityType:           1,
      identityNumber:         '1234567890',
      mobileNumber1:          '0501234567',
      mobileNumber2:          '0507654321',
      nationalityId:          'country-01',
      preferredContactMethod: 1,
      preferredLanguage:      0,
      regionId:               'region-04',
    };
    return of(dummy);
    // TODO: return this.http.get<ContactResponse>(`${this.apiUrl}/contacts/${id}`);
  }
}
