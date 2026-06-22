import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CrDetailsRequest, CrDetailsResponse } from '../models/cr-details.model';

@Injectable({ providedIn: 'root' })
export class CommercialRegisterService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDetails(body: CrDetailsRequest) {
    return this.http.post<CrDetailsResponse>(
      `${this.apiUrl}/CommercialRegister/Details`,
      body,
    );
  }
}
