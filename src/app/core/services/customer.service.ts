import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CreateContactRequest {
  firstName: string;
  middleName: string;
  thirdName: string;
  lastName: string;
  cityId: string;
  dateOfBirth: string;
  email: string;
  gender: number;
  identityType: number;
  identityNumber: string;
  mobileNumber1: string;
  mobileNumber2: string;
  nationalityId: string;
  preferredContactMethod: number;
  preferredLanguage: number;
  regionId: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createContact(data: CreateContactRequest) {
    return this.http.post(`${this.apiUrl}/Contacts/Create`, data);
  }
}
