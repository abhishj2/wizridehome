import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface BookingSearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
  type: 'shared' | 'reserved';
  phoneNumber: string;
  pickupLocation?: string;
  dropLocation?: string;
  pickupTime?: string;
}

interface VehicleOption {
  id: string;
  name: string;
  image: string;
  departureTime: string;
  duration: string;
  price: number;
  seatsLeft: number;
  amenities: string[];
  route: {
    from: { code: string; name: string; location: string };
    to: { code: string; name: string; location: string };
  };
  pickupLocation?: string;
  dropLocation?: string;
}

interface Seat {
  id: string;
  number: number;
  status: 'available' | 'booked' | 'selected';
  price: number;
}

interface CarAdditionFormData {
  fullName: string;
  contactNo: string;
  emailId: string;
  preferredTime: string;
}

@Component({
  selector: 'app-booking-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-results.component.html',
  styleUrls: ['./booking-results.component.css']
})
export class BookingResultsComponent implements OnInit, OnDestroy {
  @Input() searchParams: BookingSearchParams | null = null;
  
  vehicleOptions: VehicleOption[] = [];
  isLoading = true;
  expandedSections: { [key: string]: boolean } = {};
  
  // Seat selection popup properties
  showSeatPopup = false;
  selectedSeats: Seat[] = [];
  frontSeats: Seat[] = [];
  middleSeats: Seat[] = [];
  backSeats: Seat[] = [];
  currentSelectedVehicle: VehicleOption | null = null;

  // Car addition modal properties
  showCarAdditionModal = false;
  carAdditionFormData: CarAdditionFormData = {
    fullName: '',
    contactNo: '',
    emailId: '',
    preferredTime: ''
  };
  carAdditionRequests: any[] = [];

  // Time picker properties
  timePickerVisible = false;
  selectedHour = 12;
  selectedMinute = '00';
  selectedPeriod = 'PM';
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minutes = ['00', '15', '30', '45'];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('BookingResultsComponent initialized');
    
    // Get search parameters from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.searchParams = navigation.extras.state['searchParams'];
      console.log('Received search params from navigation:', this.searchParams);
    }
    
    // Fallback: try to get from history state
    if (!this.searchParams && (window as any).history?.state) {
      this.searchParams = (window as any).history.state['searchParams'];
      console.log('Received search params from history:', this.searchParams);
    }
    
    // Fallback: try to get from localStorage
    if (!this.searchParams) {
      const storedParams = localStorage.getItem('bookingSearchParams');
      if (storedParams) {
        this.searchParams = JSON.parse(storedParams);
        console.log('Received search params from localStorage:', this.searchParams);
        // Don't clear localStorage immediately to persist across refreshes
      }
    }
    
    // If still no search params, create dummy data for testing
    if (!this.searchParams) {
      console.log('No search params found, using dummy data');
      this.searchParams = {
        from: 'Delhi',
        to: 'Mumbai',
        date: new Date().toISOString().split('T')[0],
        passengers: 2,
        type: 'reserved',
        phoneNumber: '+919876543210',
        pickupLocation: 'Airport Terminal 3',
        dropLocation: 'Bandra Kurla Complex',
        pickupTime: '14:30'
      };
    }
    
    console.log('Final search params:', this.searchParams);
    
    // Simulate loading
    setTimeout(() => {
      this.loadVehicleOptions();
      this.isLoading = false;
    }, 1000);
  }

  ngOnDestroy() {
    // Clear localStorage when component is destroyed (optional)
    // localStorage.removeItem('bookingSearchParams');
  }

  loadVehicleOptions() {
    if (!this.searchParams) return;

    const baseRoute = {
      from: { 
        code: this.getLocationCode(this.searchParams.from), 
        name: this.searchParams.from.split('(')[0].trim(),
        location: this.searchParams.from.split('(')[1]?.replace(')', '').trim() || ''
      },
      to: { 
        code: this.getLocationCode(this.searchParams.to), 
        name: this.searchParams.to.split('(')[0].trim(),
        location: this.searchParams.to.split('(')[1]?.replace(')', '').trim() || ''
      }
    };

    if (this.searchParams.type === 'shared') {
      this.vehicleOptions = [
        {
          id: 'innova-1',
          name: 'Innova Crysta',
          image: '../../assets/images/reversed-removebg-preview.png',
          departureTime: '03:30pm',
          duration: '05hrs 30min',
          price: 1331.43,
          seatsLeft: 1,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        },
        {
          id: 'innova-2',
          name: 'Innova Crysta',
          image: '../../assets/images/reversed-removebg-preview.png',
          departureTime: '04:30pm',
          duration: '05hrs 30min',
          price: 1500.43,
          seatsLeft: 2,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        },
        {
          id: 'innova-3',
          name: 'Innova Crysta',
          image: '../../assets/images/reversed-removebg-preview.png',
          departureTime: '06:30pm',
          duration: '05hrs 30min',
          price: 1331.43,
          seatsLeft: 3,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        }
      ];
    } else {
      // Reserved cabs - more vehicle options
      this.vehicleOptions = [
        {
          id: 'swift-1',
          name: 'Swift Dzire',
          image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
          departureTime: '03:00 AM',
          duration: '4 hrs 45 mins',
          price: 2100.00,
          seatsLeft: 4,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space', 'Personal Driver'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        },
        {
          id: 'innova-reserved-1',
          name: 'Innova Crysta',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
          departureTime: '04:00 AM',
          duration: '05hrs 30min',
          price: 2800.00,
          seatsLeft: 6,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space', 'Personal Driver', 'WiFi'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        },
        {
          id: 'ertiga-1',
          name: 'Ertiga',
          image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
          departureTime: '05:30 AM',
          duration: '5 hrs 30 mins',
          price: 3200.00,
          seatsLeft: 7,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space', 'Personal Driver', 'WiFi', 'Charging Points'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        },
        {
          id: 'fortuner-1',
          name: 'Fortuner',
          image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop',
          departureTime: '06:00 AM',
          duration: '5 hrs 15 mins',
          price: 4500.00,
          seatsLeft: 7,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space', 'Personal Driver', 'WiFi', 'Charging Points', 'Premium Interior'],
          route: baseRoute,
          pickupLocation: this.searchParams.pickupLocation || 'Airport Terminal 3',
          dropLocation: this.searchParams.dropLocation || 'Bandra Kurla Complex'
        }
      ];
    }
  }

  getLocationCode(location: string): string {
    const codes: { [key: string]: string } = {
      'Gangtok': 'GTK',
      'Bagdogra Airport': 'IXB',
      'Darjeeling': 'DJL',
      'Siliguri': 'SLG',
      'Kolkata': 'CCU',
      'Delhi': 'DEL',
      'Mumbai': 'BOM'
    };
    
    const locationName = location.split('(')[0].trim();
    return codes[locationName] || locationName.substring(0, 3).toUpperCase();
  }


  modifySearch() {
    // Clear localStorage when navigating back to modify search
    localStorage.removeItem('bookingSearchParams');
    this.router.navigate(['/']);
  }

  requestCarAddition() {
    this.showCarAdditionModal = true;
    // Pre-populate phone number from searchParams
    if (this.searchParams?.phoneNumber) {
      this.carAdditionFormData.contactNo = this.searchParams.phoneNumber;
    }
    // Initialize preferred time to current time or default
    if (!this.carAdditionFormData.preferredTime) {
      this.carAdditionFormData.preferredTime = '12:00';
    }
  }

  closeCarAdditionModal() {
    this.showCarAdditionModal = false;
    this.resetCarAdditionForm();
  }

  resetCarAdditionForm() {
    this.carAdditionFormData = {
      fullName: '',
      contactNo: '',
      emailId: '',
      preferredTime: ''
    };
  }

  submitCarAdditionRequest() {
    if (this.carAdditionFormData.fullName && 
        this.carAdditionFormData.contactNo && 
        this.carAdditionFormData.emailId && 
        this.carAdditionFormData.preferredTime) {
      
      // Create comprehensive car addition request data
      const carAdditionRequest = {
        id: Date.now().toString(), // Simple ID generation
        timestamp: new Date().toISOString(),
        requestType: 'car_addition',
        searchParams: this.searchParams,
        customerDetails: {
          fullName: this.carAdditionFormData.fullName,
          contactNo: this.carAdditionFormData.contactNo,
          emailId: this.carAdditionFormData.emailId,
          preferredTime: this.carAdditionFormData.preferredTime
        },
        locationDetails: {
          pickupLocation: this.searchParams?.pickupLocation || 'Not specified',
          dropLocation: this.searchParams?.dropLocation || 'Not specified',
          fromCity: this.searchParams?.from || 'Not specified',
          toCity: this.searchParams?.to || 'Not specified'
        },
        status: 'pending',
        notes: 'Customer requested additional car for the route'
      };
      
      // Store the request
      this.carAdditionRequests.push(carAdditionRequest);
      
      // Log to console for debugging
      console.log('Car addition request submitted:', carAdditionRequest);
      console.log('All car addition requests:', this.carAdditionRequests);
      
      // Show detailed success message
      alert(`Car Addition Request Submitted Successfully!\n\n` +
            `Request ID: ${carAdditionRequest.id}\n` +
            `Customer: ${this.carAdditionFormData.fullName}\n` +
            `Contact: ${this.carAdditionFormData.contactNo}\n` +
            `Email: ${this.carAdditionFormData.emailId}\n` +
            `Preferred Time: ${this.carAdditionFormData.preferredTime}\n\n` +
            `Route Details:\n` +
            `From: ${this.searchParams?.from}\n` +
            `To: ${this.searchParams?.to}\n` +
            `Pickup Location: ${this.searchParams?.pickupLocation || 'Not specified'}\n` +
            `Drop Location: ${this.searchParams?.dropLocation || 'Not specified'}\n` +
            `Date: ${this.searchParams?.date}\n` +
            `Passengers: ${this.searchParams?.passengers}\n\n` +
            `We will contact you soon regarding your request!`);
      
      this.closeCarAdditionModal();
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  // Method to view all car addition requests (for debugging/admin)
  viewAllCarAdditionRequests() {
    if (this.carAdditionRequests.length === 0) {
      alert('No car addition requests found.');
      return;
    }
    
    console.log('All Car Addition Requests:', this.carAdditionRequests);
    
    let requestList = `Total Car Addition Requests: ${this.carAdditionRequests.length}\n\n`;
    this.carAdditionRequests.forEach((request, index) => {
      requestList += `Request ${index + 1}:\n`;
      requestList += `ID: ${request.id}\n`;
      requestList += `Customer: ${request.customerDetails.fullName}\n`;
      requestList += `Contact: ${request.customerDetails.contactNo}\n`;
      requestList += `Email: ${request.customerDetails.emailId}\n`;
      requestList += `Preferred Time: ${request.customerDetails.preferredTime}\n\n`;
      requestList += `Route Details:\n`;
      requestList += `From: ${request.searchParams?.from}\n`;
      requestList += `To: ${request.searchParams?.to}\n`;
      requestList += `Pickup Location: ${request.locationDetails?.pickupLocation || 'Not specified'}\n`;
      requestList += `Drop Location: ${request.locationDetails?.dropLocation || 'Not specified'}\n`;
      requestList += `Date: ${request.searchParams?.date}\n`;
      requestList += `Passengers: ${request.searchParams?.passengers}\n`;
      requestList += `Status: ${request.status}\n`;
      requestList += `Submitted: ${new Date(request.timestamp).toLocaleString()}\n\n`;
    });
    
    alert(requestList);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  }

  formatPickupTime(timeString: string): string {
    if (!timeString) return '';
    
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    let displayHour = hourNum;
    let period = 'AM';
    
    if (hourNum === 0) {
      displayHour = 12;
      period = 'AM';
    } else if (hourNum < 12) {
      displayHour = hourNum;
      period = 'AM';
    } else if (hourNum === 12) {
      displayHour = 12;
      period = 'PM';
    } else {
      displayHour = hourNum - 12;
      period = 'PM';
    }
    
    return `${displayHour}:${minute.padStart(2, '0')} ${period}`;
  }

  toggleExpandableSection(vehicleId: string, sectionType: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    const key = `${vehicleId}-${sectionType}`;
    this.expandedSections[key] = !this.expandedSections[key];
    
    console.log(`Toggled ${key}: ${this.expandedSections[key]}`);
  }

  isSectionExpanded(vehicleId: string, sectionType: string): boolean {
    const key = `${vehicleId}-${sectionType}`;
    return this.expandedSections[key] || false;
  }

  // Seat selection methods
  selectSeat(vehicle: VehicleOption) {
    console.log('Opening seat selection popup for vehicle:', vehicle.name);
    this.currentSelectedVehicle = vehicle;
    this.initializeSeats(vehicle.price);
    this.showSeatPopup = true;
    console.log('showSeatPopup set to:', this.showSeatPopup);
  }

  initializeSeats(price: number) {
    // Initialize seats with all available (no pre-selected seats)
    this.frontSeats = [
      { id: '1', number: 1, status: 'available', price: price }
    ];

    this.middleSeats = [
      { id: '3', number: 3, status: 'available', price: price },
      { id: '4', number: 4, status: 'booked', price: price }
    ];

    this.backSeats = [
      { id: '5', number: 5, status: 'available', price: price },
      { id: '6', number: 6, status: 'available', price: price }
    ];

    // Clear selected seats array
    this.selectedSeats = [];
  }

  selectSeatFromPopup(seat: Seat) {
    if (seat.status === 'booked') {
      return; // Don't allow selection of booked seats
    }

    // Toggle seat selection
    if (seat.status === 'selected') {
      // Deselect the seat
      seat.status = 'available';
      this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
    } else {
      // Select the seat
      seat.status = 'selected';
      this.selectedSeats.push(seat);
    }
  }

  closeSeatPopup() {
    this.showSeatPopup = false;
    this.selectedSeats = [];
    this.currentSelectedVehicle = null;
  }

  proceedToBooking() {
    if (this.selectedSeats.length > 0 && this.currentSelectedVehicle) {
      console.log('Proceeding to booking with seats:', this.selectedSeats);
      
      // Calculate total price
      const totalPrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      
      // Create selection details
      const selectionDetails = {
        selectedSeats: this.selectedSeats.map(seat => ({
          seatNumber: seat.number,
          price: seat.price
        })),
        totalSeats: this.selectedSeats.length,
        totalPrice: totalPrice,
        perSeatPrice: this.selectedSeats[0]?.price || 0
      };
      
      // Display selection details with vehicle information
      console.log('Selection Details:', selectionDetails);
      alert(`Booking confirmed for ${this.selectedSeats.length} seat(s):\n\n` +
            `Vehicle: ${this.currentSelectedVehicle.name}\n` +
            `Route: ${this.currentSelectedVehicle.route.from.name} to ${this.currentSelectedVehicle.route.to.name}\n` +
            `Departure: ${this.currentSelectedVehicle.departureTime}\n` +
            `Duration: ${this.currentSelectedVehicle.duration}\n` +
            `Seats: ${this.selectedSeats.map(s => s.number).join(', ')}\n` +
            `Total Price: ₹${totalPrice.toFixed(2)}\n` +
            `Per Seat: ₹${this.selectedSeats[0]?.price.toFixed(2) || 0}\n\n` +
            `Pickup Location: ${this.currentSelectedVehicle.pickupLocation || 'Not specified'}\n` +
            `Drop Location: ${this.currentSelectedVehicle.dropLocation || 'Not specified'}`);
      
      this.closeSeatPopup();
    } else {
      alert('Please select at least one seat to proceed.');
    }
  }

  bookCab(vehicle: VehicleOption) {
    console.log('Booking cab:', vehicle);
    
    // Get the correct departure time (user's pickup time for reserved cabs)
    const departureTime = this.searchParams && this.searchParams.type === 'reserved' && this.searchParams.pickupTime 
      ? this.formatPickupTime(this.searchParams.pickupTime) 
      : vehicle.departureTime;
    
    // Create booking details
    const bookingDetails = {
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        price: vehicle.price,
        departureTime: departureTime,
        duration: vehicle.duration
      },
      route: {
        from: vehicle.route.from.name,
        to: vehicle.route.to.name,
        pickupLocation: vehicle.pickupLocation,
        dropLocation: vehicle.dropLocation
      },
      searchParams: this.searchParams,
      bookingTime: new Date().toISOString(),
      totalPrice: vehicle.price
    };
    
    // Store booking details (for now showing in alert)
    console.log('Cab booking details:', bookingDetails);
    alert(`Cab booking confirmed!\n\n` +
          `Vehicle: ${vehicle.name}\n` +
          `Route: ${vehicle.route.from.name} to ${vehicle.route.to.name}\n` +
          `Departure: ${departureTime}\n` +
          `Duration: ${vehicle.duration}\n` +
          `Price: ₹${vehicle.price.toFixed(2)}\n\n` +
          `Pickup Location: ${vehicle.pickupLocation || 'Not specified'}\n` +
          `Drop Location: ${vehicle.dropLocation || 'Not specified'}`);
  }

  // Time Picker Methods
  openTimePicker() {
    this.timePickerVisible = true;
    this.initializeTimePicker();
  }

  closeTimePicker() {
    this.timePickerVisible = false;
  }

  initializeTimePicker() {
    // Parse current time and set selected values
    const currentTime = this.carAdditionFormData.preferredTime || '12:00';
    const [hourStr, minuteStr] = currentTime.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert 24-hour to 12-hour format
    if (hour === 0) {
      this.selectedHour = 12;
      this.selectedPeriod = 'AM';
    } else if (hour < 12) {
      this.selectedHour = hour;
      this.selectedPeriod = 'AM';
    } else if (hour === 12) {
      this.selectedHour = 12;
      this.selectedPeriod = 'PM';
    } else {
      this.selectedHour = hour - 12;
      this.selectedPeriod = 'PM';
    }
    
    // Set closest minute
    const closestMinute = Math.round(minute / 15) * 15;
    this.selectedMinute = closestMinute.toString().padStart(2, '0');
    
    // Scroll to selected hour
    setTimeout(() => {
      this.scrollToSelectedHour();
    }, 100);
  }

  scrollToSelectedHour() {
    const hoursContainer = document.querySelector('.time-options') as HTMLElement;
    if (hoursContainer) {
      const selectedOption = hoursContainer.children[this.selectedHour - 1] as HTMLElement;
      if (selectedOption) {
        selectedOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
  }

  selectMinute(minute: string) {
    this.selectedMinute = minute;
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }

  confirmTimeSelection() {
    // Convert 12-hour to 24-hour format
    let hour24 = this.selectedHour;
    
    if (this.selectedPeriod === 'AM' && this.selectedHour === 12) {
      hour24 = 0;
    } else if (this.selectedPeriod === 'PM' && this.selectedHour !== 12) {
      hour24 = this.selectedHour + 12;
    }
    
    // Format time as HH:mm
    const time24 = `${hour24.toString().padStart(2, '0')}:${this.selectedMinute}`;
    
    this.carAdditionFormData.preferredTime = time24;
    this.closeTimePicker();
  }

  formatTimeDisplay(time: string): string {
    if (!time) return '12:00 PM';
    
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    let displayHour = hour;
    let period = 'AM';
    
    if (hour === 0) {
      displayHour = 12;
      period = 'AM';
    } else if (hour < 12) {
      displayHour = hour;
      period = 'AM';
    } else if (hour === 12) {
      displayHour = 12;
      period = 'PM';
    } else {
      displayHour = hour - 12;
      period = 'PM';
    }
    
    return `${displayHour}:${minuteStr} ${period}`;
  }
}