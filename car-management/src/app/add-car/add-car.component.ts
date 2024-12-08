import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent {
  newCar = { name: '', model: '', year: null, price: null };
  apiUrl = 'http://localhost:3000/cars';

  constructor(private http: HttpClient) {}

  addCar(): void {
    this.http.post(this.apiUrl, this.newCar).subscribe(
      (response: any) => {
        console.log('Car added successfully:', response);
        alert('Car added successfully!');
        this.newCar = { name: '', model: '', year: null, price: null };
      },
      (error: any) => console.error('Error adding car:', error)
    );
  }
}
