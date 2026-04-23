import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PersonRelatedRequest, PersonRelatedResponse } from '../models/person-related.model';
import { CrDetailsRequest, CrDetailsResponse } from '../models/cr-details.model';

@Injectable({ providedIn: 'root' })
export class CommercialRegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPersonRelated(body: PersonRelatedRequest) {
    return this.http.post<PersonRelatedResponse>(
      `${this.apiUrl}/CommercialRegister/PersonRelated`,
      body,
    );
  }

  getDetails(body: CrDetailsRequest) {
    return this.http.post<CrDetailsResponse>(
      `${this.apiUrl}/CommercialRegister/Details`,
      body,
    );
  }
}
