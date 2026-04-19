import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
  ) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid || this.loading()) return;

    this.loading.set(true);
    this.auth.login(this.username, this.password).subscribe({
      next: data => {
        this.loading.set(false);
        localStorage.setItem('token', data.JWToken);
        localStorage.setItem('user', JSON.stringify(data));
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
