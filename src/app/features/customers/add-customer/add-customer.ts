import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  imports: [FormsModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
})
export class AddCustomer {
  submitted = signal(false);
  idVerified = signal(false);
  idSharedWarning = signal(false);

  customer = {
    idType: '',
    idNumber: '',
    birthDate: '',
    firstName: '',
    secondName: '',
    thirdName: '',
    fourthName: '',
    nationality: '',
    gender: '',
    phone: '',
    phoneAlt: '',
    preferredContact: '',
    preferredLang: '',
    email: '',
    region: '',
    city: '',
  };

  constructor(private router: Router) {}

  get canVerify(): boolean {
    return !!this.customer.idType && !!this.customer.idNumber && !!this.customer.birthDate;
  }

  verifyId() {
    if (!this.canVerify) return;
    // TODO: call API to verify ID
    this.idSharedWarning.set(true);
    this.idVerified.set(true);
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid) return;
    // TODO: call API
    this.router.navigate(['/customers/search']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
