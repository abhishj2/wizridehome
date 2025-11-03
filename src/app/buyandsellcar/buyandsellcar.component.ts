import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Vehicle {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    price: string;
    km: string;
    year: string;
    fuel: string;
    img: string;
    badge?: string;
    registrationyear: string;
    insurance: string;
    seats: number;
    rto: string;
    ownership: string;
    engine_displacement: string;
    transmission: string;
    manufactureyear: string;
    is_approved?: boolean | string | number | string[] | number[];
  };
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

  featuredVehicles: Vehicle[] = [];
  isLoadingVehicles: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchFeaturedVehicles();
  }

  fetchFeaturedVehicles(): void {
    this.isLoadingVehicles = true;
    // Fetch published vehicles, then filter by is_approved
    this.http.get<Vehicle[]>('http://wizcms.test/wp-json/wp/v2/buy_sell_cars?status=publish&per_page=100')
      .subscribe({
        next: (data) => {
          // Filter to show only approved vehicles
          // ACF checkbox can return: true, "1", ["1"], or false/null/empty
          this.featuredVehicles = data.filter(vehicle => {
            if (!vehicle.acf || !vehicle.acf.is_approved) return false;
            
            const isApproved: any = vehicle.acf.is_approved;
            
            // Handle different ACF checkbox return formats
            if (Array.isArray(isApproved)) {
              return isApproved.includes('1') || isApproved.includes(1);
            }
            
            return isApproved === true || isApproved === '1' || isApproved === 1;
          });
          this.isLoadingVehicles = false;
          console.log('Featured vehicles loaded:', data);
          console.log('Approved vehicles:', this.featuredVehicles);
        },
        error: (error) => {
          console.error('Error fetching vehicles:', error);
          this.isLoadingVehicles = false;
          this.featuredVehicles = [];
        }
      });
  }

  getVehicleTitle(vehicle: Vehicle): string {
    return vehicle.title.rendered;
  }

  getVehiclePrice(vehicle: Vehicle): string {
    return vehicle.acf?.price || 'N/A';
  }

  getVehicleKm(vehicle: Vehicle): string {
    return vehicle.acf?.km || 'N/A';
  }

  getVehicleYear(vehicle: Vehicle): string {
    return vehicle.acf?.year || 'N/A';
  }

  getVehicleFuel(vehicle: Vehicle): string {
    return vehicle.acf?.fuel || 'N/A';
  }

  getVehicleImage(vehicle: Vehicle): string {
    return vehicle.acf?.img || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
  }

  getVehicleBadge(vehicle: Vehicle): string | undefined {
    return vehicle.acf?.badge;
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
