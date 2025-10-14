import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-booking-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-results.component.html',
  styleUrls: ['./booking-results.component.css']
})
export class BookingResultsComponent implements OnInit {
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
        // Clear localStorage after use
        localStorage.removeItem('bookingSearchParams');
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
        type: 'shared',
        phoneNumber: '+919876543210',
        pickupLocation: 'Airport Terminal 3',
        dropLocation: 'Bandra Kurla Complex'
      };
    }
    
    console.log('Final search params:', this.searchParams);
    
    // Simulate loading
    setTimeout(() => {
      this.loadVehicleOptions();
      this.isLoading = false;
    }, 1000);
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
    this.router.navigate(['/']);
  }

  requestCarAddition() {
    alert('Car addition request submitted! We will contact you soon.');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
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
  }

  proceedToBooking() {
    if (this.selectedSeats.length > 0) {
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
      
      // Display selection details
      console.log('Selection Details:', selectionDetails);
      alert(`Booking confirmed for ${this.selectedSeats.length} seat(s):\n\n` +
            `Seats: ${this.selectedSeats.map(s => s.number).join(', ')}\n` +
            `Total Price: ₹${totalPrice.toFixed(2)}\n` +
            `Per Seat: ₹${this.selectedSeats[0]?.price.toFixed(2) || 0}`);
      
      this.closeSeatPopup();
    } else {
      alert('Please select at least one seat to proceed.');
    }
  }
}