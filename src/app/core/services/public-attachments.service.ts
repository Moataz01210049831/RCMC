import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class PublicAttachmentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // TODO: replace the URL/payload shape once the backend endpoint is finalised.
  // Public endpoint — no auth header required.
  uploadAttachments(ticketId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append(`HttpPostedFile${i}`, file, file.name);
    });
    return this.http
      .post<ApiResponse<unknown>>(
        `${this.apiUrl}/Public/Tickets/${encodeURIComponent(ticketId)}/Attachments`,
        formData,
      )
      .pipe(map(res => res.Success));
  }
}
