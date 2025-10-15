import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface BookingData {
  searchParams: any;
  vehicleDetails: any;
  selectedSeats?: any[];
  bookingType: 'shared' | 'reserved';
  totalPrice?: number;
}

interface PassengerDetails {
  firstName: string;
  lastName: string;
  emailId: string;
  primaryContactNo: string;
  alternateContactNo: string;
  isBusinessTravel: boolean;
  hasDiscountCoupon: boolean;
  couponCode: string;
  primaryCountryCode: string;
  alternateCountryCode: string;
  hasTravelInsurance: boolean;
}

interface FareDetails {
  rideFare: number;
  gstAmount: number;
  travelInsuranceCost: number;
  totalFare: number;
}

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css'
})
export class ThankyouComponent implements OnInit {
  bookingData: BookingData | null = null;
  passengerDetails: PassengerDetails | null = null;
  fareDetails: FareDetails | null = null;
  bookingReference = '';
  countdown = 10;

  constructor(private router: Router) {}

  ngOnInit() {
    // Get checkout data from localStorage
    const checkoutData = localStorage.getItem('checkoutData');
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      this.bookingData = data.bookingData;
      this.passengerDetails = data.passengerDetails;
      this.fareDetails = data.fareDetails;
      
      // Generate booking reference
      this.generateBookingReference();
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      // Auto-redirect to home page after 10 seconds
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 10000);
    } else {
      // If no data, redirect to home
      this.router.navigate(['/']);
    }
  }

  generateBookingReference() {
    // Generate a random booking reference
    const prefix = this.bookingData?.bookingType === 'shared' ? 'WS' : 'WR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingReference = `${prefix}${timestamp}${random}`;
  }

}
