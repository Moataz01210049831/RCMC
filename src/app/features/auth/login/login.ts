import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from '../../../core/config/app-config';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly config = AppConfig;
  username = '';
  password = '';
  showPassword = signal(false);
  submitted = signal(false);

  constructor(private router: Router, public t: TranslationService) {}

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
