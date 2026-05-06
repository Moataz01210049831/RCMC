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
    const formData = new FormData();
    formData.append('complainViewModel', JSON.stringify(payload));
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/Complain/AddComplains`, formData)
      .pipe(map(res => res.Data));
  }
}
