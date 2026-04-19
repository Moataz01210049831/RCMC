import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppConfig } from '../../../core/config/app-config';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly config = AppConfig;
  username = '';
  password = '';
  showPassword = signal(false);
  submitted = signal(false);
  loading = signal(false);

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid || this.loading()) return;

    this.loading.set(true);
    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        const token = res?.token ?? res?.accessToken ?? res?.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(this.translate.instant('TOAST.UNEXPECTED_ERROR'));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
