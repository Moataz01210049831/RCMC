import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { KbArticle } from '../models/kb-article.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchArticles(query: string) {
    const q = query.trim().toLowerCase();
    const params = new HttpParams().set('query', q);
    return this.http
      .get<ApiResponse<KbArticle[]>>(`${this.apiUrl}/KnowledgeBase/Search`, { params })
      .pipe(map(res => res.Data ?? []));
  }
}
