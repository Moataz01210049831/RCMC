import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

export interface LoginResponseData {
  Id: string;
  UserName: string;
  Email: string;
  IsTrainee: boolean;
  Roles: string[];
  FullName: string | null;
  IsVerified: boolean;
  Connection: string;
  JWToken: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<ApiResponse<LoginResponseData>>(`${this.apiUrl}/Accounts/login`, { username, password })
      .pipe(map(res => res.Data));
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
