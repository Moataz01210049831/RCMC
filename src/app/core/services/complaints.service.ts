import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AddComplaintSubmission } from '../models/add-complaint.model';
import { RelatedTicket } from '../models/related-ticket.model';
import { ComplainDetailsData } from '../models/complain-details.model';

@Injectable({ providedIn: 'root' })
export class ComplaintsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createComplaint(submission: AddComplaintSubmission) {
    const formData = new FormData();
    formData.append('complainViewModel', JSON.stringify(submission.payload));
    submission.attachments.forEach((file, i) => {
      formData.append(`HttpPostedFile${i}`, file, file.name);
    });
    formData.append('FileDescription', submission.fileDescription ?? '');
    return this.http
      .post<ApiResponse<ComplainDetailsData>>(`${this.apiUrl}/Complain/AddComplains`, formData)
      .pipe(map(res => res.Data));
  }

  getRelatedTicketsByCustomer(contactId: string) {
    return this.http.get<RelatedTicket[]>(
      `${this.apiUrl}/Complain/GetRelatedTicketsByCustomer/${contactId}`,
    );
  }

  getComplainDetails(complainId: string) {
    const params = new HttpParams().set('complainId', complainId);
    return this.http
      .get<ApiResponse<ComplainDetailsData>>(`${this.apiUrl}/Complain/GetComplainDetails`, { params })
      .pipe(map(res => res.Data));
  }
}
