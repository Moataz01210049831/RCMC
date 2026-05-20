import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ComplainDetailsData } from '../models/complain-details.model';
import { ComplaintRequirement } from '../models/complaint-requirement.model';

@Injectable({ providedIn: 'root' })
export class PublicAttachmentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComplainDetails(complainId: string) {
    const params = new HttpParams().set('complainId', complainId);
    return this.http
      .get<ApiResponse<ComplainDetailsData>>(`${this.apiUrl}/Complain/GetComplainDetails`, { params })
      .pipe(map(res => res.Data));
  }

  getRequirementsBySubCategory(subClassificationId: string) {
    const params = new HttpParams().set('subClassificationId', subClassificationId);
    return this.http
      .get<ApiResponse<ComplaintRequirement[]>>(`${this.apiUrl}/Surveys/GetQuestionsBySubCategoryId`, { params })
      .pipe(map(res => res.Data ?? []));
  }

  // Public endpoint — no auth header required. `ticketId` is the complain GUID
  // (read from the /ticket/attachments/:ticketId route).
  // Returns true on HTTP 2xx — backend response body shape is not relied upon.
  uploadAttachments(ticketId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file, i) => {
      formData.append(`HttpPostedFile${i}`, file, file.name);
    });
    return this.http
      .post(
        `${this.apiUrl}/Complain/UploadAttachment/${encodeURIComponent(ticketId)}`,
        formData,
        { responseType: 'text' },
      )
      .pipe(map(() => true));
  }
}
