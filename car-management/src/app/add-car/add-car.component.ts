import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent {
  newCar = {
    name: '',
    mpg: '',
    cylinders: '',
    displacement: '',
    horsepower: '',
    weight: '',
    acceleration: '',
    model_year: '',
    origin: '',
  };
  apiUrl = 'http://localhost:3000/cars';

  constructor(private http: HttpClient, private router: Router) {}

  addCar(): void {
    this.http.post<{ message: string; id: string }>(this.apiUrl, this.newCar).subscribe(
      (response) => {
        console.log(response.message);
        alert('Car added successfully!');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error adding car:', error);
        const errorMessage = error.error?.error || 'Failed to add car. Please try again.';
        alert(errorMessage);
      }
    );
  }  
}
