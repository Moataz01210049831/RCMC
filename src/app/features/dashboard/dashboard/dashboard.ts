import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  searchText = '';
  searchType = 'id';
  noResults = signal(false);

  constructor(private router: Router) {}

  search() {
    if (!this.searchText.trim()) {
      this.noResults.set(true);
      return;
    }
    this.router.navigate(['/customers/search'], {
      queryParams: { q: this.searchText, type: this.searchType },
    });
  }

  addClient() {
    this.router.navigate(['/customers/add']);
  }
}
