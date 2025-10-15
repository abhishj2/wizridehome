import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
    hasDiscountCoupon: false,
    couponCode: '',
    primaryCountryCode: '+91',
    alternateCountryCode: '+91',
    hasTravelInsurance: false
  };

  // Fare calculation
  rideFare = 0;
  gstAmount = 0;
  travelInsuranceCost = 0;
  totalFare = 0;
  readonly GST_RATE = 0.05; // 5% GST
  readonly TRAVEL_INSURANCE_RATE = 99; // ₹99 per booking

  // Country codes
  countryList = [
    { code: '+1', name: 'United States' },
    { code: '+1', name: 'Canada' },
    { code: '+7', name: 'Russia' },
    { code: '+20', name: 'Egypt' },
    { code: '+27', name: 'South Africa' },
    { code: '+30', name: 'Greece' },
    { code: '+31', name: 'Netherlands' },
    { code: '+32', name: 'Belgium' },
    { code: '+33', name: 'France' },
    { code: '+34', name: 'Spain' },
    { code: '+36', name: 'Hungary' },
    { code: '+39', name: 'Italy' },
    { code: '+40', name: 'Romania' },
    { code: '+41', name: 'Switzerland' },
    { code: '+43', name: 'Austria' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+45', name: 'Denmark' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+48', name: 'Poland' },
    { code: '+49', name: 'Germany' },
    { code: '+51', name: 'Peru' },
    { code: '+52', name: 'Mexico' },
    { code: '+53', name: 'Cuba' },
    { code: '+54', name: 'Argentina' },
    { code: '+55', name: 'Brazil' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+60', name: 'Malaysia' },
    { code: '+61', name: 'Australia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+63', name: 'Philippines' },
    { code: '+64', name: 'New Zealand' },
    { code: '+65', name: 'Singapore' },
    { code: '+66', name: 'Thailand' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+84', name: 'Vietnam' },
    { code: '+86', name: 'China' },
    { code: '+90', name: 'Turkey' },
    { code: '+91', name: 'India' },
    { code: '+92', name: 'Pakistan' },
    { code: '+93', name: 'Afghanistan' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+95', name: 'Myanmar' },
    { code: '+98', name: 'Iran' },
    { code: '+212', name: 'Morocco' },
    { code: '+213', name: 'Algeria' },
    { code: '+216', name: 'Tunisia' },
    { code: '+218', name: 'Libya' },
    { code: '+220', name: 'Gambia' },
    { code: '+221', name: 'Senegal' },
    { code: '+222', name: 'Mauritania' },
    { code: '+223', name: 'Mali' },
    { code: '+224', name: 'Guinea' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+227', name: 'Niger' },
    { code: '+228', name: 'Togo' },
    { code: '+229', name: 'Benin' },
    { code: '+230', name: 'Mauritius' },
    { code: '+231', name: 'Liberia' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    { code: '+235', name: 'Chad' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+237', name: 'Cameroon' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+239', name: 'São Tomé and Príncipe' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+241', name: 'Gabon' },
    { code: '+242', name: 'Republic of the Congo' },
    { code: '+243', name: 'Democratic Republic of the Congo' },
    { code: '+244', name: 'Angola' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+246', name: 'British Indian Ocean Territory' },
    { code: '+248', name: 'Seychelles' },
    { code: '+249', name: 'Sudan' },
    { code: '+250', name: 'Rwanda' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+252', name: 'Somalia' },
    { code: '+253', name: 'Djibouti' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+256', name: 'Uganda' },
    { code: '+257', name: 'Burundi' },
    { code: '+258', name: 'Mozambique' },
    { code: '+260', name: 'Zambia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+262', name: 'Réunion' },
    { code: '+263', name: 'Zimbabwe' },
    { code: '+264', name: 'Namibia' },
    { code: '+265', name: 'Malawi' },
    { code: '+266', name: 'Lesotho' },
    { code: '+267', name: 'Botswana' },
    { code: '+268', name: 'Eswatini' },
    { code: '+269', name: 'Comoros' },
    { code: '+290', name: 'Saint Helena' },
    { code: '+291', name: 'Eritrea' },
    { code: '+297', name: 'Aruba' },
    { code: '+298', name: 'Faroe Islands' },
    { code: '+299', name: 'Greenland' },
    { code: '+350', name: 'Gibraltar' },
    { code: '+351', name: 'Portugal' },
    { code: '+352', name: 'Luxembourg' },
    { code: '+353', name: 'Ireland' },
    { code: '+354', name: 'Iceland' },
    { code: '+355', name: 'Albania' },
    { code: '+356', name: 'Malta' },
    { code: '+357', name: 'Cyprus' },
    { code: '+358', name: 'Finland' },
    { code: '+359', name: 'Bulgaria' },
    { code: '+370', name: 'Lithuania' },
    { code: '+371', name: 'Latvia' },
    { code: '+372', name: 'Estonia' },
    { code: '+373', name: 'Moldova' },
    { code: '+374', name: 'Armenia' },
    { code: '+375', name: 'Belarus' },
    { code: '+376', name: 'Andorra' },
    { code: '+377', name: 'Monaco' },
    { code: '+378', name: 'San Marino' },
    { code: '+380', name: 'Ukraine' },
    { code: '+381', name: 'Serbia' },
    { code: '+382', name: 'Montenegro' },
    { code: '+383', name: 'Kosovo' },
    { code: '+385', name: 'Croatia' },
    { code: '+386', name: 'Slovenia' },
    { code: '+387', name: 'Bosnia and Herzegovina' },
    { code: '+389', name: 'North Macedonia' },
    { code: '+420', name: 'Czech Republic' },
    { code: '+421', name: 'Slovakia' },
    { code: '+423', name: 'Liechtenstein' },
    { code: '+995', name: 'Georgia' },
    { code: '+996', name: 'Kyrgyzstan' },
    { code: '+998', name: 'Uzbekistan' }
  ];

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

    // Calculate fare based on booking data
    this.calculateFare();

    // Pre-populate phone number if available (remove country code to avoid duplication)
    if (this.bookingData?.searchParams?.phoneNumber) {
      let phoneNumber = this.bookingData.searchParams.phoneNumber;
      // Find and remove any country code from the phone number
      for (const country of this.countryList) {
        if (phoneNumber.startsWith(country.code)) {
          phoneNumber = phoneNumber.substring(country.code.length);
          this.passengerDetails.primaryCountryCode = country.code;
          break;
        }
      }
      this.passengerDetails.primaryContactNo = phoneNumber;
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
      
      // Log complete checkout data to console
      console.log('=== CHECKOUT DATA SUBMITTED ===');
      console.log('Booking Data:', this.bookingData);
      console.log('Passenger Details:', this.passengerDetails);
      console.log('Fare Details:', {
        rideFare: this.rideFare,
        gstAmount: this.gstAmount,
        totalFare: this.totalFare
      });
      console.log('Complete Checkout Data:', checkoutData);
      console.log('================================');
      
      // Show detailed alert with submitted data
      const alertMessage = `
CHECKOUT DATA SUBMITTED:

PASSENGER DETAILS:
• Name: ${this.passengerDetails.firstName} ${this.passengerDetails.lastName}
• Email: ${this.passengerDetails.emailId}
• Primary Contact: ${this.passengerDetails.primaryCountryCode}${this.passengerDetails.primaryContactNo}
• Alternate Contact: ${this.passengerDetails.alternateContactNo ? this.passengerDetails.alternateCountryCode + this.passengerDetails.alternateContactNo : 'Not provided'}
• Business Travel: ${this.passengerDetails.isBusinessTravel ? 'Yes' : 'No'}
• Has Coupon: ${this.passengerDetails.hasDiscountCoupon ? 'Yes' : 'No'}
• Coupon Code: ${this.passengerDetails.couponCode || 'Not provided'}
• Travel Insurance: ${this.passengerDetails.hasTravelInsurance ? 'Yes' : 'No'}

BOOKING DETAILS:
• From: ${this.bookingData?.searchParams?.from || 'N/A'}
• To: ${this.bookingData?.searchParams?.to || 'N/A'}
• Pickup Location: ${this.bookingData?.searchParams?.pickupLocation || 'N/A'}
• Drop Location: ${this.bookingData?.searchParams?.dropLocation || 'N/A'}
• Date: ${this.formatDate(this.bookingData?.searchParams?.date || '')}
• Pickup Time: ${this.bookingData?.searchParams?.pickupTime || 'N/A'}
• Passengers: ${this.bookingData?.searchParams?.passengers}
• Selected Seats: ${this.getSelectedSeats()}
• Booking Type: ${this.bookingData?.bookingType}${this.bookingData?.bookingType === 'shared' ? `
• Selected Cab Timing: ${this.bookingData?.vehicleDetails?.departureTime || 'N/A'}` : ''}

FARE BREAKDOWN:
• Ride Fare: ₹${this.rideFare.toFixed(2)}
• GST (5%): ₹${this.gstAmount.toFixed(2)}${this.travelInsuranceCost > 0 ? `
• Travel Insurance: ₹${this.travelInsuranceCost.toFixed(2)}` : ''}
• Total Fare: ₹${this.totalFare.toFixed(2)}

Check console for complete data object.
      `.trim();
      
      alert(alertMessage);
      
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Navigate to payment (placeholder)
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

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(this.passengerDetails.primaryContactNo)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }

    // Alternate contact validation (if provided)
    if (this.passengerDetails.alternateContactNo && !phoneRegex.test(this.passengerDetails.alternateContactNo)) {
      alert('Please enter a valid 10-digit alternate phone number');
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

  calculateFare() {
    if (!this.bookingData) {
      return;
    }

    // Calculate ride fare based on booking type
    if (this.bookingData.bookingType === 'shared' && this.bookingData.selectedSeats?.length) {
      // For shared cabs, sum up the prices of selected seats
      this.rideFare = this.bookingData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    } else if (this.bookingData.bookingType === 'reserved') {
      // For reserved cabs, rate is per cab regardless of number of seats/passengers
      const vehiclePrice = this.bookingData.vehicleDetails?.price || 0;
      this.rideFare = vehiclePrice; // Fixed price per cab, not per passenger
    } else {
      // Fallback to totalPrice if available
      this.rideFare = this.bookingData.totalPrice || 0;
    }

    // Calculate 5% GST
    this.gstAmount = this.rideFare * this.GST_RATE;
    
    // Calculate travel insurance cost (added after GST)
    this.travelInsuranceCost = this.passengerDetails.hasTravelInsurance ? this.TRAVEL_INSURANCE_RATE : 0;
    
    // Calculate total fare (ride fare + GST + travel insurance)
    this.totalFare = this.rideFare + this.gstAmount + this.travelInsuranceCost;
  }

  getSelectedSeats(): string {
    if (this.bookingData?.selectedSeats?.length) {
      return this.bookingData.selectedSeats.map(seat => seat.number).join(', ');
    }
    return '1'; // Default for reserved cabs
  }

  onCouponSubmit() {
    if (this.passengerDetails.couponCode.trim()) {
      console.log('Coupon code submitted:', this.passengerDetails.couponCode);
      alert(`Coupon code submitted: ${this.passengerDetails.couponCode}`);
    } else {
      alert('Please enter a coupon code');
    }
  }

  onTravelInsuranceChange() {
    // Recalculate fare when travel insurance option changes
    this.calculateFare();
  }
}
