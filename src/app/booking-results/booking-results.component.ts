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
        phoneNumber: '+919876543210'
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
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
          departureTime: '03:50 AM',
          duration: '5 hrs 10 mins',
          price: 1331.43,
          seatsLeft: 1,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute
        },
        {
          id: 'innova-2',
          name: 'Innova Crysta',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
          departureTime: '04:50 AM',
          duration: '5 hrs 10 mins',
          price: 1331.43,
          seatsLeft: 2,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute
        },
        {
          id: 'innova-3',
          name: 'Innova Crysta',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
          departureTime: '06:30 AM',
          duration: '5 hrs 10 mins',
          price: 1331.43,
          seatsLeft: 3,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space'],
          route: baseRoute
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
          route: baseRoute
        },
        {
          id: 'innova-reserved-1',
          name: 'Innova Crysta',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
          departureTime: '04:00 AM',
          duration: '5 hrs 10 mins',
          price: 2800.00,
          seatsLeft: 6,
          amenities: ['AC', 'Music System', 'Comfortable Seats', 'Luggage Space', 'Personal Driver', 'WiFi'],
          route: baseRoute
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
          route: baseRoute
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
          route: baseRoute
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

  selectSeat(vehicle: VehicleOption) {
    // Navigate to seat selection page or handle booking
    console.log('Selected vehicle:', vehicle);
    alert(`Selected ${vehicle.name} for ${vehicle.departureTime}`);
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
}