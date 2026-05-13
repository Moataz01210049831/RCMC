import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { KbArticle } from '../models/kb-article.model';

const DUMMY_ARTICLES: KbArticle[] = [
  { Id: '23e15b14-1b95-eb11-b816-00155d6e0f3c', Title: 'ماذا بعد أخذ اللقاحات؟',
    Content: 'مراقبة ظهور الأعراض الجانبية جيدا وتسجيلها فور ظهورها لمدة 7 أيام فور تلقي اللقاح. مراقبة المريض لنفسه حول حدوث توعك أو أي حالة صحية أخرى لمدة 3 أسابيع بعد تلقي اللقاح.' },
  { Id: 'kb-2',  Title: 'لماذا يجب اخذ اللقاح؟', Content: 'للحماية من الفيروس وتقليل المضاعفات.' },
  { Id: 'kb-3',  Title: 'ماهي اهمية اللقاح؟',     Content: 'يحفز جهاز المناعة على مكافحة المرض.' },
  { Id: 'kb-4',  Title: 'الحالة الصحية بتطبيق توكلنا', Content: 'توضح حالة المستخدم الصحية ضمن التطبيق.' },
  { Id: 'kb-5',  Title: 'ماهي المراكز لقاحات المخصصة للزائرين والبدون؟', Content: 'يمكن الاستعلام عن المراكز عبر تطبيق صحتي.' },
  { Id: 'kb-6',  Title: 'ماهي الفئات العمرية المصرح لهم أخذ لقاحات الحج؟', Content: 'الفئات المعتمدة من وزارة الصحة.' },
  { Id: 'kb-7',  Title: 'ماهي مدة استمرار اعراض كورونا طويلة المدى؟', Content: 'تختلف من شخص لآخر وقد تستمر لأشهر.' },
];

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // TODO: point at the real KB endpoint when available. For now: dummy data or
  // an API call that returns ApiResponse<KbArticle[]>.
  searchArticles(query: string) {
    const q = query.trim().toLowerCase();
    if (environment.useDummyData || !this.apiUrl) {
      if (!q) return of<KbArticle[]>(DUMMY_ARTICLES);
      return of<KbArticle[]>(DUMMY_ARTICLES.filter(a => a.Title.toLowerCase().includes(q)));
    }
    const params = new HttpParams().set('query', q);
    return this.http
      .get<ApiResponse<KbArticle[]>>(`${this.apiUrl}/KnowledgeBase/Search`, { params })
      .pipe(map(res => res.Data ?? []));
  }
}
