import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FiltersComponent } from '../filters/filters.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    FiltersComponent,
    MatToolbarModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mpg', 'cylinders', 'horsepower', 'weight', 'model_year', 'origin'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  savedFilters: any = {};
  globalSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSavedFilters();
    this.fetchCars();
  }

  // Fetch data from the API
  fetchCars(): void {
    this.http.get<any[]>('https://firehawk-444003.uc.r.appspot.com/cars').subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyAllFilters();
      },
      (error) => console.error('Error fetching cars:', error)
    );
  }

  // Apply filters from the FiltersComponent
  applyFilters(filters: any): void {
    this.savedFilters = filters;
    this.saveFiltersToLocalStorage();
    this.applyAllFilters();
  }

  // Apply global search filter
  applySearch(event: Event): void {
    this.globalSearch = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyAllFilters();
  }

  // Combine all filters and apply them to the table
  applyAllFilters(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const searchMatch =
        !this.globalSearch ||
        Object.values(data)
          .join(' ')
          .toLowerCase()
          .includes(this.globalSearch);

      const filtersMatch =
        (!this.savedFilters.name || data.name?.toLowerCase().includes(this.savedFilters.name.toLowerCase())) &&
        (!this.savedFilters.horsepower || data.horsepower == this.savedFilters.horsepower)&&
        (!this.savedFilters.year || data.model_year == this.savedFilters.year) &&
        (!this.savedFilters.origin || data.origin == this.savedFilters.origin);

      return searchMatch && filtersMatch;
    };
    this.dataSource.filter = 'trigger';
  }

  // Save filters to local storage
  saveFiltersToLocalStorage(): void {
    localStorage.setItem('savedFilters', JSON.stringify(this.savedFilters));
  }

  // Load saved filters from local storage
  loadSavedFilters(): void {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      this.savedFilters = JSON.parse(saved);
    }
  }

  // Export data to CSV
  exportToCSV(): void {
    this.http.get<any[]>('https://firehawk-444003.uc.r.appspot.com/cars').subscribe(
      (data) => {
        const csvData = data.map((row) => ({
          Name: row.name,
          MPG: row.mpg,
          Cylinders: row.cylinders,
          Horsepower: row.horsepower,
          Weight: row.weight,
          Year: row.model_year,
          Origin: row.origin,
        }));
  
        if (csvData.length > 0) {
          const csvHeader = Object.keys(csvData[0]).join(',');
          const csvRows = csvData.map((row) => Object.values(row).join(','));
  
          const csvContent = [csvHeader, ...csvRows].join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute('download', 'cars_data.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('No data available to export.');
        }
      },
      (error) => {
        console.error('Error fetching data for CSV export:', error);
        alert('Failed to fetch data for export. Please try again later.');
      }
    );
  }  
}
