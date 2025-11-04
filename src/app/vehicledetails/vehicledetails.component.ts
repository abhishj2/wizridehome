import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  };
}

interface KeyFeature {
  icon: string;
  title: string;
  description: string;
}

interface Spec {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-vehicledetails',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vehicledetails.component.html',
  styleUrl: './vehicledetails.component.css'
})
export class VehicledetailsComponent implements OnInit {
  
  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;
  isLoadingVehicle: boolean = true;
  vehicleNotFound: boolean = false;

  keyFeatures: KeyFeature[] = [];
  carSpecs: Spec[] = [];

  // Enquiry form
  enquiryName: string = '';
  enquiryEmail: string = '';
  enquiryPhone: string = '';
  enquiryMessage: string = '';
  isSubmittingEnquiry: boolean = false;
  
  // Captcha
  captchaQuestion: string = '';
  captchaAnswer: number = 0;
  userCaptchaAnswer: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get vehicle ID from route parameters
    this.route.params.subscribe(params => {
      this.vehicleId = +params['id']; // Convert to number
      if (this.vehicleId) {
        this.fetchVehicleDetails();
      }
    });
    
    // Generate captcha
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    this.captchaAnswer = num1 + num2;
    this.captchaQuestion = `${num1} + ${num2} = ?`;
  }

  fetchVehicleDetails(): void {
    this.isLoadingVehicle = true;
    this.http.get<Vehicle[]>(`http://wizcms.test/wp-json/wp/v2/buy_sell_cars?include=${this.vehicleId}`)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.vehicle = data[0];
            this.vehicleNotFound = false;
            this.prepareVehicleData();
          } else {
            this.vehicleNotFound = true;
          }
          this.isLoadingVehicle = false;
          console.log('Vehicle details loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle details:', error);
          this.isLoadingVehicle = false;
          this.vehicleNotFound = true;
        }
      });
  }

  prepareVehicleData(): void {
    if (!this.vehicle || !this.vehicle.acf) return;

    const acf = this.vehicle.acf;

    // Prepare Key Features - More compact and relevant
    this.keyFeatures = [
      { icon: 'fas fa-cogs', title: 'Engine', description: acf.engine_displacement },
      { icon: 'fas fa-gear', title: 'Transmission', description: acf.transmission },
      { icon: 'fas fa-gas-pump', title: 'Fuel Type', description: acf.fuel },
      { icon: 'fas fa-user', title: 'Ownership', description: acf.ownership }
    ];

    // Prepare Car Specs - Comprehensive details
    this.carSpecs = [
      { icon: 'fas fa-rupee-sign', label: 'Price', value: acf.price },
      { icon: 'fas fa-calendar-alt', label: 'Model Year', value: acf.year },
      { icon: 'fas fa-tachometer-alt', label: 'Kms Driven', value: acf.km },
      { icon: 'fas fa-calendar-check', label: 'Registration Year', value: acf.registrationyear },
      { icon: 'fas fa-shield-alt', label: 'Insurance', value: acf.insurance },
      { icon: 'fas fa-chair', label: 'Seating Capacity', value: acf.seats + ' Seats' },
      { icon: 'fas fa-building', label: 'RTO', value: acf.rto },
      { icon: 'fas fa-cogs', label: 'Engine', value: acf.engine_displacement },
      { icon: 'fas fa-gear', label: 'Transmission', value: acf.transmission },
      { icon: 'fas fa-clock', label: 'Manufacture Year', value: acf.manufactureyear }
    ];
  }

  getVehicleImage(): string {
    return this.vehicle?.acf?.img || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
  }

  getVehicleTitle(): string {
    return this.vehicle?.title.rendered || 'Vehicle Details';
  }

  getVehiclePrice(): string {
    return this.vehicle?.acf?.price || 'N/A';
  }

  getVehicleYear(): string {
    return this.vehicle?.acf?.year || 'N/A';
  }

  getVehicleKm(): string {
    return this.vehicle?.acf?.km || 'N/A';
  }

  getVehicleFuel(): string {
    return this.vehicle?.acf?.fuel || 'N/A';
  }

  scrollToEnquiry(): void {
    const enquirySection = document.getElementById('enquiryFormBlock');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/sellyourcar']);
  }

  onEnquirySubmit(): void {
    // Validate captcha first
    const userAnswer = parseInt(this.userCaptchaAnswer);
    if (isNaN(userAnswer) || userAnswer !== this.captchaAnswer) {
      alert('❌ Incorrect answer! Please solve the math problem correctly.');
      this.userCaptchaAnswer = '';
      return;
    }

    this.isSubmittingEnquiry = true;

    const enquiryData = {
      title: `Enquiry: ${this.getVehicleTitle()} - ${this.enquiryName}`,
      content: this.enquiryMessage || 'No message provided',
      status: 'publish',
      acf: {
        customer_name: this.enquiryName,
        customer_email: this.enquiryEmail,
        customer_phone: this.enquiryPhone,
        customer_message: this.enquiryMessage || '',
        vehicle_name: this.getVehicleTitle(),
        listing_id: this.vehicleId?.toString() || '',
        enquiry_date: new Date().toISOString()
      }
    };

    console.log('Submitting enquiry:', enquiryData);

    this.http.post('http://wizcms.test/wp-json/wp/v2/vehicle_enquiries', enquiryData)
      .subscribe({
        next: (response) => {
          console.log('Enquiry submitted successfully:', response);
          this.isSubmittingEnquiry = false;
          alert('✅ Enquiry submitted successfully! We will contact you soon.');
          
          // Reset form
          this.enquiryName = '';
          this.enquiryEmail = '';
          this.enquiryPhone = '';
          this.enquiryMessage = '';
          this.userCaptchaAnswer = '';
          
          // Generate new captcha
          this.generateCaptcha();
        },
        error: (error) => {
          console.error('Error submitting enquiry:', error);
          this.isSubmittingEnquiry = false;
          alert('❌ There was an error submitting your enquiry. Please try again.');
        }
      });
  }
}
