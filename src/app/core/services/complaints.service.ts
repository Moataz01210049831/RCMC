import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AddComplaintPayload } from '../models/add-complaint.model';
import { RelatedTicket } from '../models/related-ticket.model';

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

  getRelatedTicketsByCustomer(contactId: string) {
    if (environment.useDummyData) {
      return of<RelatedTicket[]>([
        { IncidentId: 'dummy-1', TicketNumber: 'CAS-0001002' },
        { IncidentId: 'dummy-2', TicketNumber: 'CAS-0001007' },
        { IncidentId: 'dummy-3', TicketNumber: 'CAS-0001018' },
      ]);
    }
    return this.http.get<RelatedTicket[]>(
      `${this.apiUrl}/Complain/GetRelatedTicketsByCustomer/${contactId}`,
    );
  }
}
