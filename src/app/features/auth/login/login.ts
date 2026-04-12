import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfig } from '../../../core/config/app-config';

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

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid) return;

    // TODO: replace with real AuthService call
    localStorage.setItem('token', 'mock-token');
    this.router.navigate(['/dashboard']);
  }
}
