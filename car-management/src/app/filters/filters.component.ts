import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Input() initialFilters: any = {};
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    name: '',
    horsepower: null,
    year: null,
    origin: null,
  };

  ngOnInit(): void {
    if (this.initialFilters) {
      this.filters = { ...this.filters, ...this.initialFilters };
    }
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      name: '',
      horsepower: null,
      year: null,
      origin: null,
    };
    this.filtersChanged.emit(this.filters);
  }
}
