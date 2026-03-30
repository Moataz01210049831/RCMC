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

    // TODO: replace with real API call using idType, idNumber, birthDate
    const mockData = {
      firstName:        'أحمد',
      secondName:       'محمد',
      thirdName:        'عبدالله',
      fourthName:       'العمري',
      nationality:      'SA',
      gender:           'male',
      phone:            '0512345678',
      phoneAlt:         '0598765432',
      preferredLang:    'ar',
      preferredContact: 'email',
      email:            'ahmed.alamri@example.com',
      region:           'riyadh',
      city:             'riyadh',
    };

    Object.assign(this.customer, mockData);
    this.idSharedWarning.set(true);
    this.idVerified.set(true);
  }

  onSubmit(form: NgForm) {
    this.submitted.set(true);
    if (form.invalid) return;
    console.log('Customer Data:', this.customer);
    // TODO: call API
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
