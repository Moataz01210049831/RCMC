import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AppConfig } from '../config/app-config';

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
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  hasAllowedRole(roles: readonly string[] | null | undefined): boolean {
    if (!roles || roles.length === 0) return false;
    const allowed = AppConfig.allowedRoles;
    if (allowed.length === 0) return true;
    return roles.some(r => allowed.includes(r));
  }
}
