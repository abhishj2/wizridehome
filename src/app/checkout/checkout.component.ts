import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface BookingData {
  searchParams: any;
  vehicleDetails: any;
  selectedSeats?: any[];
  bookingType: 'shared' | 'reserved';
}

interface PassengerDetails {
  firstName: string;
  lastName: string;
  emailId: string;
  primaryContactNo: string;
  alternateContactNo: string;
  isBusinessTravel: boolean;
  hasDiscountCoupon: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  bookingData: BookingData | null = null;
  passengerDetails: PassengerDetails = {
    firstName: '',
    lastName: '',
    emailId: '',
    primaryContactNo: '',
    alternateContactNo: '',
    isBusinessTravel: false,
    hasDiscountCoupon: false
  };

  // Fare calculation
  rideFare = 1331.43;
  gstAmount = 66.57;
  totalFare = 1398.00;

  // Sticky header
  isHeaderSticky = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get booking data from navigation state or localStorage
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.bookingData = navigation.extras.state['bookingData'];
    }
    
    if (!this.bookingData) {
      const storedData = localStorage.getItem('bookingData');
      if (storedData) {
        this.bookingData = JSON.parse(storedData);
      }
    }

    // Pre-populate phone number if available
    if (this.bookingData?.searchParams?.phoneNumber) {
      this.passengerDetails.primaryContactNo = this.bookingData.searchParams.phoneNumber;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isHeaderSticky = scrollPosition > 50;
  }

  onSubmit() {
    if (this.validateForm()) {
      // Store checkout data
      const checkoutData = {
        bookingData: this.bookingData,
        passengerDetails: this.passengerDetails,
        fareDetails: {
          rideFare: this.rideFare,
          gstAmount: this.gstAmount,
          totalFare: this.totalFare
        }
      };
      
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Navigate to payment (placeholder)
      alert('Checkout data submitted! Redirecting to payment...');
      // this.router.navigate(['/payment']);
    }
  }

  validateForm(): boolean {
    const required = ['firstName', 'lastName', 'emailId', 'primaryContactNo'];
    for (const field of required) {
      if (!this.passengerDetails[field as keyof PassengerDetails]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.passengerDetails.emailId)) {
      alert('Please enter a valid email address');
      return false;
    }

    return true;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  }

  getSelectedSeats(): string {
    if (this.bookingData?.selectedSeats?.length) {
      return this.bookingData.selectedSeats.map(seat => seat.number).join(', ');
    }
    return '1'; // Default for reserved cabs
  }
}
