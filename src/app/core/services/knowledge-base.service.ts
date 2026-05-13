import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { KbArticle } from '../models/kb-article.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseService {
  constructor(private http: HttpClient) {}

  // KB endpoint not live yet — articles served from public/dummy-data JSON
  // and filtered client-side.
  searchArticles(query: string) {
    const q = query.trim().toLowerCase();
    return this.http
      .get<KbArticle[]>('./dummy-data/kb-articles.json')
      .pipe(map(articles => q
        ? articles.filter(a => a.Title.toLowerCase().includes(q))
        : articles));
  }
}
