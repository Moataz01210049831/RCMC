import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AddComplaintPayload } from '../models/add-complaint.model';

@Injectable({ providedIn: 'root' })
export class ComplaintsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createComplaint(payload: AddComplaintPayload) {
    if (environment.useDummyData) {
      void payload;
      return of('dummy-complaint-id');
    }
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/Complaints/Create`, payload)
      .pipe(map(res => res.Data));
  }
}
