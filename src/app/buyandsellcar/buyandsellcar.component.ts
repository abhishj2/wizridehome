import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Vehicle {
  id: number;
  title: string;
  price: string;
  km: string;
  year: number;
  fuel: string;
  img: string;
  badge?: string;
  registrationYear: string;
  insurance: string;
  seats: string;
  rto: string;
  ownership: string;
  engineDisplacement: string;
  transmission: string;
  manufactureYear: number;
}

@Component({
  selector: 'app-buyandsellcar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './buyandsellcar.component.html',
  styleUrl: './buyandsellcar.component.css'
})
export class BuyandsellcarComponent implements OnInit {
  
  selectedAction: string = '';
  showBuyFields: boolean = false;
  submitButtonText: string = 'Select Action';
  submitButtonDisabled: boolean = true;

  // Form fields for buying
  vehicleType: string = '';
  brand: string = '';
  budget: string = '';
  location: string = '';

  featuredVehicles: Vehicle[] = [
    {
      id: 1,
      title: 'Honda City ZX',
      price: '₹8,50,000',
      km: '25,000 km',
      year: 2021,
      fuel: 'Petrol',
      img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
      badge: 'Hot Deal',
      registrationYear: 'Jan 2021',
      insurance: 'Valid',
      seats: '5 Seats',
      rto: 'Mumbai',
      ownership: 'First Owner',
      engineDisplacement: '1497 cc',
      transmission: 'Manual',
      manufactureYear: 2021
    },
    {
      id: 2,
      title: 'Tata Nexon',
      price: '₹9,20,000',
      km: '15,000 km',
      year: 2022,
      fuel: 'Diesel',
      img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
      badge: 'Featured',
      registrationYear: 'Mar 2022',
      insurance: 'Valid',
      seats: '5 Seats',
      rto: 'Bangalore',
      ownership: 'First Owner',
      engineDisplacement: '1499 cc',
      transmission: 'Manual',
      manufactureYear: 2022
    },
    {
      id: 3,
      title: 'Some Car',
      price: '₹1.65 Lakh',
      km: '8,500 km',
      year: 2019,
      fuel: 'Petrol',
      img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      badge: 'Low KM',
      registrationYear: 'Nov 2019',
      insurance: 'Expired',
      seats: '5 Seats',
      rto: 'Delhi',
      ownership: 'Second Owner',
      engineDisplacement: '1197 cc',
      transmission: 'Automatic',
      manufactureYear: 2019
    },
    {
      id: 4,
      title: 'Another Car',
      price: '₹2.10 Lakh',
      km: '12,000 km',
      year: 2020,
      fuel: 'Petrol',
      img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      badge: 'Low Price',
      registrationYear: 'Feb 2020',
      insurance: 'Valid',
      seats: '5 Seats',
      rto: 'Chennai',
      ownership: 'First Owner',
      engineDisplacement: '998 cc',
      transmission: 'Manual',
      manufactureYear: 2020
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization
  }

  onActionChange(): void {
    if (this.selectedAction === 'buy') {
      this.showBuyFields = true;
      this.submitButtonDisabled = false;
      this.submitButtonText = 'Search Vehicles';
    } else if (this.selectedAction === 'sell') {
      // Redirect to registration form page
      this.router.navigate(['/vehicle-registration-form']);
    } else {
      this.showBuyFields = false;
      this.submitButtonDisabled = true;
      this.submitButtonText = 'Select Action';
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.selectedAction === 'buy') {
      console.log('Searching vehicles with filters:', {
        type: this.vehicleType,
        budget: this.budget,
        location: this.location
      });
      alert('Searching vehicles with your selected filters...');
      // You can add actual search logic here
    }
  }

  viewVehicleDetails(vehicleId: number): void {
    this.router.navigate(['/vehicle-details', vehicleId]);
  }
}
