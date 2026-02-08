import { Component, OnInit, OnDestroy, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';
import { CustomCalendarComponent } from '../calendar/calendar.component';
import Swal from 'sweetalert2';

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
  fromlocid?: string | number; // Location code for reserved cabs
  tolocid?: string | number; // Location code for reserved cabs
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
  tid?: string; // Transaction ID for seat blocking
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
  imports: [CommonModule, FormsModule, CustomCalendarComponent],
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
  isSeatLoading = false;

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

  // Sticky header property
  isHeaderSticky = false;

  // Modify form properties
  showModifyForm = false;
  modifyFormValues: any = {
    from: '',
    to: '',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    pickupTime: '',
    passengers: 1,
    phoneNumber: ''
  };

  // Location data for modify form
  sourceCities: any[] = [];
  reservedCities: any[] = [];
  sharedPickupLocations: string[] = [];
  sharedDropoffLocations: string[] = [];
  modifyFormSuggestions: { [key: string]: any[] } = {};
  modifyFormLocationDetailsVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiserviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isHeaderSticky = scrollPosition > 50;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      // Ensure scroll to top on mobile devices with a slight delay
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 100);
    }
    console.log('BookingResultsComponent initialized');

    // Get search parameters from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.searchParams = navigation.extras.state['searchParams'];
      console.log('Received search params from navigation:', this.searchParams);
    }

    // Fallback: try to get from history state (only in browser)
    if (!this.searchParams && isPlatformBrowser(this.platformId) && (window as any).history?.state) {
      this.searchParams = (window as any).history.state['searchParams'];
      console.log('Received search params from history:', this.searchParams);
    }

    // Fallback: try to get from localStorage (only in browser)
    if (!this.searchParams && isPlatformBrowser(this.platformId)) {
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

    // Load vehicle options
    this.loadVehicleOptions();

    // Show attention alert on page load
    this.showAttentionAlert();
  }

  ngOnDestroy() {
    // Clear localStorage when component is destroyed (optional)
    // localStorage.removeItem('bookingSearchParams');
  }

  loadVehicleOptions() {
    if (!this.searchParams) return;

    this.isLoading = true;

    // Call API for shared cabs
    if (this.searchParams.type === 'shared') {
      this.loadSharedCarList();
    } else {
      // For reserved cabs, use existing dummy data for now
      this.loadReservedCarOptions();
    }
  }

  loadSharedCarList() {
    if (!this.searchParams) return;

    const userPhone = this.searchParams.phoneNumber || '';
    const source = this.searchParams.from || '';
    const destination = this.searchParams.to || '';
    const pickup = this.searchParams.pickupLocation || '';
    const drop = this.searchParams.dropLocation || '';
    const seats = this.searchParams.passengers || 1;
    const traveldate = this.searchParams.date || '';

    console.log('=== Calling getSharedCarList API ===');
    console.log('Request Parameters:');
    console.log('  User Phone:', userPhone);
    console.log('  Source:', source);
    console.log('  Destination:', destination);
    console.log('  Pickup Location:', pickup);
    console.log('  Dropoff Location:', drop);
    console.log('  Seats:', seats);
    console.log('  Travel Date:', traveldate);

    this.apiService.getSharedCarList(
      userPhone,
      source,
      destination,
      pickup,
      drop,
      seats,
      traveldate
    ).subscribe({
      next: (data: any) => {
        console.log('=== getSharedCarList API RESPONSE ===');
        console.log('Full response:', JSON.stringify(data, null, 2));
        console.log('Response type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Response length:', Array.isArray(data) ? data.length : 'N/A');

        if (Array.isArray(data) && data.length > 0) {
          console.log('Number of vehicles:', data.length);
          data.forEach((vehicle, index) => {
            console.log(`Vehicle ${index + 1}:`, vehicle);
          });

          // Map API response to vehicleOptions format
          this.mapApiResponseToVehicleOptions(data);
        } else {
          console.warn('API returned empty or invalid response');
          this.vehicleOptions = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('=== getSharedCarList API ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);

        // Fallback to dummy data on error
        this.loadDummySharedCarOptions();
        this.isLoading = false;
      }
    });
  }

  mapApiResponseToVehicleOptions(apiData: any[]) {
    if (!this.searchParams) return;

    const baseRoute = {
      from: {
        code: this.getLocationCode(this.searchParams.from),
        name: this.searchParams.from,
        location: this.searchParams.pickupLocation || ''
      },
      to: {
        code: this.getLocationCode(this.searchParams.to),
        name: this.searchParams.to,
        location: this.searchParams.dropLocation || ''
      }
    };

    // Map API response to VehicleOption format
    this.vehicleOptions = apiData.map((vehicle: any, index: number) => {
      // Format departure time from SHOWTIME (e.g., "09:00 AM" -> "09:00am")
      // Format departure time from SHOWTIME (e.g., "09:00 AM" -> "09:00 am")
      let departureTime = vehicle.SHOWTIME || vehicle.TRAVELTIME || '';
      if (departureTime) {
        const lowerTime = departureTime.toLowerCase().trim();
        // Check for "09:00am" or "09:00 am" or "09:00:00 am"
        const match12 = lowerTime.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([ap]m)/);

        if (match12) {
          // Reformat to ensure space: "09:00 am"
          departureTime = `${match12[1]}:${match12[2]} ${match12[3]}`;
        } else if (lowerTime.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
          // 24-hour format: "09:00" or "09:00:00"
          const parts = lowerTime.split(':');
          const hour24 = parseInt(parts[0], 10);
          const minutes = parts[1];
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const period = hour24 >= 12 ? 'pm' : 'am';
          departureTime = `${hour12}:${minutes} ${period}`;
        } else {
          // Fallback, just clean up spaces if possible or leave as is
          // Tries to insert space if sticking together like 9:00am
          departureTime = lowerTime.replace(/(\d)(am|pm)/, '$1 $2');
        }
      }

      // Format duration from TRAVELDURATION (e.g., "3 hrs 0 mins" -> "03hrs 00min")
      let duration = vehicle.TRAVELDURATION || '';
      if (duration) {
        // Keep the format as is or format it
        duration = duration.replace(/\s+/g, ' ').trim();
      }

      // Get price from AMOUNT
      const price = parseFloat(vehicle.AMOUNT || '0');

      // Get seats left
      const seatsLeft = parseInt(vehicle.SEATSLEFT || '0', 10);

      // Get car type/name
      const carType = vehicle.CARTYPE || 'Car';

      // Get image path
      const imagePath = vehicle.IMAGEPATH || '../../assets/images/reversed-removebg-preview.png';

      // Create unique ID from TID or RID
      const vehicleId = `vehicle-${vehicle.TID || vehicle.RID || index}`;
      const tid = vehicle.TID || vehicle.RID || '';

      return {
        id: vehicleId,
        name: carType,
        image: imagePath,
        departureTime: departureTime,
        duration: duration,
        price: price,
        seatsLeft: seatsLeft,
        amenities: ['AC', 'Luggage', 'Refreshment'], // Default amenities as shown in card
        route: baseRoute,
        pickupLocation: this.searchParams?.pickupLocation || '',
        dropLocation: this.searchParams?.dropLocation || '',
        tid: tid // Store TID for seat blocking API
      } as VehicleOption;
    });

    console.log('Mapped vehicle options:', this.vehicleOptions);
  }

  loadDummySharedCarOptions() {
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
  }

  getFormattedAmenities(vehicle: VehicleOption): string {
    if (!vehicle || !vehicle.amenities) return '';

    const formatted = vehicle.amenities.map(amenity => {
      if (amenity === 'AC') {
        // Check if vehicle name implies Non-AC
        const isNonAc = vehicle.name.toLowerCase().includes('non-ac');
        return isNonAc ? 'A/C charges NOT included' : 'A/C charges included';
      }
      return amenity;
    });

    return formatted.join(', ') + '.';
  }

  getFormattedAmenitiesList(vehicle: VehicleOption): { icon: string, text: string }[] {
    if (!vehicle || !vehicle.amenities) return [];

    return vehicle.amenities.map(amenity => {
      let icon = 'fas fa-check-circle'; // Default icon
      let text = amenity;

      // Map icons and transform text
      const lowerAmenity = amenity.toLowerCase();

      if (lowerAmenity === 'ac' || lowerAmenity === 'air conditioner') {
        icon = 'fas fa-snowflake';
        const isNonAc = vehicle.name.toLowerCase().includes('non-ac');
        text = isNonAc ? 'A/C charges NOT included.' : 'A/C charges included.';
      } else if (lowerAmenity.includes('luggage')) {
        icon = 'fas fa-suitcase';
      } else if (lowerAmenity.includes('music')) {
        icon = 'fas fa-music';
      } else if (lowerAmenity.includes('seat')) {
        icon = 'fas fa-chair';
      } else if (lowerAmenity.includes('driver')) {
        icon = 'fas fa-user-tie';
      } else if (lowerAmenity.includes('door') || lowerAmenity.includes('pick')) {
        icon = 'fas fa-map-marker-alt';
      } else if (lowerAmenity.includes('refreshment')) {
        icon = 'fas fa-coffee';
      }

      return { icon, text };
    });
  }

  // Helper method to format date to "Nov 21, 2025" format
  private formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // Helper method to format time to "01:15 P.M." format
  private formatTimeForAPI(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const minute = minutes || '00';

    let hour12 = hour24;
    let period = 'A.M.';

    if (hour24 === 0) {
      hour12 = 12;
      period = 'A.M.';
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = 'A.M.';
    } else if (hour24 === 12) {
      hour12 = 12;
      period = 'P.M.';
    } else {
      hour12 = hour24 - 12;
      period = 'P.M.';
    }

    return `${hour12.toString().padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
  }

  loadReservedCarOptions() {
    if (!this.searchParams) return;

    this.isLoading = true;

    // Get location codes from search params (stored when navigating from home component)
    const fromlocid = this.searchParams.fromlocid || '';
    const tolocid = this.searchParams.tolocid || '';
    const travelDate = this.searchParams.date || '';
    const travelTime = this.searchParams.pickupTime || '';

    if (!fromlocid || !tolocid || !travelDate || !travelTime) {
      console.error('Missing required parameters for reserved cab API call');
      this.isLoading = false;
      this.vehicleOptions = [];
      return;
    }

    // Format date and time according to API requirements
    const formattedDate = this.formatDateForAPI(travelDate);
    const formattedTime = this.formatTimeForAPI(travelTime);

    console.log('=== Calling getReservedCarList API ===');
    console.log('Request Parameters:');
    console.log('  From Location ID:', fromlocid);
    console.log('  To Location ID:', tolocid);
    console.log('  Travel Date (original):', travelDate, 'Formatted:', formattedDate);
    console.log('  Travel Time (original):', travelTime, 'Formatted:', formattedTime);

    this.apiService.getReservedCarList(
      fromlocid,
      tolocid,
      formattedDate,
      formattedTime
    ).subscribe({
      next: (data: any) => {
        console.log('=== getReservedCarList API RESPONSE ===');
        console.log('Full response:', JSON.stringify(data, null, 2));
        console.log('Response type:', typeof data);
        console.log('Is array:', Array.isArray(data));

        if (Array.isArray(data) && data.length > 0) {
          // Handle nested array structure: [[{...}]]
          let cabData: any[] = [];

          if (Array.isArray(data[0]) && data[0].length > 0) {
            // Nested array structure - extract the inner array
            cabData = data[0];
            console.log('Found nested array structure with', cabData.length, 'vehicles');
          } else if (data.length > 0 && typeof data[0] === 'object' && data[0].CTD) {
            // Flat array structure with cab objects
            cabData = data;
            console.log('Found flat array structure with', cabData.length, 'vehicles');
          }

          if (cabData.length > 0) {
            // Map API response to vehicleOptions format
            this.mapReservedApiResponseToVehicleOptions(cabData);
          } else {
            console.warn('API returned empty cab data');
            this.vehicleOptions = [];
          }
        } else {
          console.warn('API returned empty or invalid response');
          this.vehicleOptions = [];
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('=== getReservedCarList API ERROR ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error status:', error.status);

        // Fallback to empty array on error
        this.vehicleOptions = [];
        this.isLoading = false;
      }
    });
  }

  mapReservedApiResponseToVehicleOptions(apiData: any[]) {
    if (!this.searchParams) return;

    const baseRoute = {
      from: {
        code: this.getLocationCode(this.searchParams.from),
        name: this.searchParams.from,
        location: this.searchParams.pickupLocation || ''
      },
      to: {
        code: this.getLocationCode(this.searchParams.to),
        name: this.searchParams.to,
        location: this.searchParams.dropLocation || ''
      }
    };

    // Map API response to VehicleOption format
    this.vehicleOptions = apiData.map((vehicle: any, index: number) => {
      // Get car type/name from CTD
      const carType = vehicle.CTD || 'Car';

      // Get image from CARIMAGE
      const imagePath = vehicle.CARIMAGE || '../../assets/images/reversed-removebg-preview.png';

      // Get price from PRICE
      const price = parseFloat(vehicle.PRICE || '0');

      // Get capacity from CAPACITY
      const capacity = parseInt(vehicle.CAPACITY || '4', 10);

      // Get request time from REQUESTTIME
      let departureTime = vehicle.REQUESTTIME || '';
      if (departureTime) {
        const lowerTime = departureTime.toLowerCase().trim();
        // Check for "09:00am" or "09:00 am" or "09:00:00 am"
        const match12 = lowerTime.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*([ap]m)/);

        if (match12) {
          // Reformat to ensure space: "09:00 am"
          departureTime = `${match12[1]}:${match12[2]} ${match12[3]}`;
        } else if (lowerTime.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
          // 24-hour format
          const parts = lowerTime.split(':');
          const hour24 = parseInt(parts[0], 10);
          const minutes = parts[1];
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const period = hour24 >= 12 ? 'pm' : 'am';
          departureTime = `${hour12}:${minutes} ${period}`;
        } else {
          // Fallback cleanup
          departureTime = lowerTime.replace(/(\d)(am|pm)/, '$1 $2');
        }
      }

      // Get rating from RATING
      const rating = parseFloat(vehicle.RATING || '0');

      // Get travel name from TRAVELSNAME
      const travelName = vehicle.TRAVELSNAME || '';

      // Get owner TD from OWNERTD (for future use)
      const ownerTD = vehicle.OWNERTD || '';

      // Create unique ID from OWNERTD or index
      const vehicleId = `reserved-${ownerTD || index}`;

      return {
        id: vehicleId,
        name: carType,
        image: imagePath,
        departureTime: departureTime,
        duration: '', // Duration not available in API response
        price: price,
        seatsLeft: capacity,
        amenities: ['AC', 'Luggage', 'Personal Driver', 'Door Pick & Door Drop within City.'], // Default amenities
        route: baseRoute,
        pickupLocation: this.searchParams?.pickupLocation || '',
        dropLocation: this.searchParams?.dropLocation || '',
        tid: ownerTD.toString() // Store OWNERTD as tid
      } as VehicleOption;
    });

    console.log('Mapped reserved vehicle options:', this.vehicleOptions);
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
    // Toggle modify form visibility
    this.showModifyForm = !this.showModifyForm;

    if (this.showModifyForm && this.searchParams) {
      // Initialize form with current search params
      this.modifyFormValues = {
        from: this.searchParams.from || '',
        to: this.searchParams.to || '',
        pickupLocation: this.searchParams.pickupLocation || '',
        dropLocation: this.searchParams.dropLocation || '',
        date: this.searchParams.date || '',
        pickupTime: this.searchParams.pickupTime || '',
        passengers: this.searchParams.passengers || 1,
        phoneNumber: this.searchParams.phoneNumber || ''
      };

      // Load location data based on cab type
      this.loadModifyFormLocationData();
    }
  }

  loadModifyFormLocationData() {
    if (!this.searchParams) return;

    if (this.searchParams.type === 'shared') {
      // Load source cities for shared cabs
      this.apiService.getSource().subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.sourceCities = data.map((item: any) => {
              const name = typeof item === 'string' ? item : item.name;
              const id = typeof item === 'string' ? '' : item.id;
              return {
                name: name,
                code: id || name.substring(0, 3).toUpperCase(),
                state: this.getCityState(name)
              };
            });
          }
        },
        error: (error) => {
          console.error('Error fetching source cities:', error);
        }
      });

      // Load pickup/drop locations if cities are selected
      if (this.modifyFormValues.from && this.modifyFormValues.to) {
        // Load locations without clearing existing values (initial load)
        this.loadSharedPickupDropLocations(false, false);
      }
    } else if (this.searchParams.type === 'reserved') {
      // Load reserved cities
      this.apiService.getSourceDestinationFb().subscribe({
        next: (data) => {
          if (Array.isArray(data)) {
            this.reservedCities = data.map((item: any) => {
              const name = item.LOCATION || item.location || '';
              const code = item.LOCATIONCODE || item.locationcode || '';
              return {
                name: name,
                code: code || name.substring(0, 3).toUpperCase(),
                state: this.getCityState(name)
              };
            });
          }
        },
        error: (error) => {
          console.error('Error fetching reserved cities:', error);
        }
      });
    }
  }

  loadSharedPickupDropLocations(fromChanged: boolean = false, toChanged: boolean = false) {
    if (!this.modifyFormValues.from || !this.modifyFormValues.to) {
      // Clear locations if cities are not both selected
      this.sharedPickupLocations = [];
      this.sharedDropoffLocations = [];
      this.modifyFormLocationDetailsVisible = false;
      if (!this.modifyFormValues.from) {
        this.modifyFormValues.pickupLocation = '';
      }
      if (!this.modifyFormValues.to) {
        this.modifyFormValues.dropLocation = '';
      }
      return;
    }

    // Note: Location values are only cleared in onModifyCitySelect when cities change
    // Here we just reload the location lists without clearing the form values
    // This preserves existing selections when loading initially or when only one city changes

    // Reload location lists for the current city pair
    this.apiService.getPickupDrop(
      this.modifyFormValues.from,
      this.modifyFormValues.to
    ).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length >= 2) {
          // Update location lists (but don't clear form values)
          this.sharedPickupLocations = Array.isArray(data[0]) ? data[0] : [];
          this.sharedDropoffLocations = Array.isArray(data[1]) ? data[1] : [];
          this.modifyFormLocationDetailsVisible = true;
        }
      },
      error: (error) => {
        console.error('Error fetching pickup/dropoff locations:', error);
        this.sharedPickupLocations = [];
        this.sharedDropoffLocations = [];
        this.modifyFormLocationDetailsVisible = false;
      }
    });
  }

  onModifyCitySelect(cityName: string, field: 'from' | 'to') {
    // Store old values to check if they changed (before updating)
    const oldFrom = this.modifyFormValues.from || '';
    const oldTo = this.modifyFormValues.to || '';
    const newCityName = cityName || '';

    // Check if city actually changed (trim and compare)
    const fromChanged = field === 'from' && oldFrom.trim() !== newCityName.trim();
    const toChanged = field === 'to' && oldTo.trim() !== newCityName.trim();

    // Update the selected city
    this.modifyFormValues[field] = cityName;

    // Clear suggestions
    delete this.modifyFormSuggestions[`modify-${field}`];

    // For shared cabs, handle location clearing and loading
    if (this.searchParams?.type === 'shared') {
      // Clear the corresponding location immediately when city changes
      if (fromChanged) {
        // From city changed - clear only pickup location
        this.modifyFormValues.pickupLocation = '';
        this.sharedPickupLocations = [];
        // Also clear the suggestion dropdown for pickup location
        delete this.modifyFormSuggestions['modify-pickupLocation'];
      }

      if (toChanged) {
        // To city changed - clear only drop location
        this.modifyFormValues.dropLocation = '';
        this.sharedDropoffLocations = [];
        // Also clear the suggestion dropdown for drop location
        delete this.modifyFormSuggestions['modify-dropLocation'];
      }

      // Load pickup/drop locations when both cities are selected
      if (this.modifyFormValues.from && this.modifyFormValues.to) {
        // Reload locations for the new city pair
        this.loadSharedPickupDropLocations(fromChanged, toChanged);
      } else {
        // If one city is missing, clear both location lists
        this.sharedPickupLocations = [];
        this.sharedDropoffLocations = [];
        this.modifyFormLocationDetailsVisible = false;
        // Only clear the location that corresponds to the missing city
        if (!this.modifyFormValues.from) {
          this.modifyFormValues.pickupLocation = '';
        }
        if (!this.modifyFormValues.to) {
          this.modifyFormValues.dropLocation = '';
        }
      }
    }
  }

  onModifyLocationSelect(locationName: string, field: 'pickupLocation' | 'dropLocation') {
    this.modifyFormValues[field] = locationName;
    delete this.modifyFormSuggestions[`modify-${field}`];
  }

  onModifyCityInput(event: Event, field: 'from' | 'to') {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.showModifyCitySuggestions(value, field);
  }

  showModifyCitySuggestions(query: string, field: 'from' | 'to') {
    const cities = this.searchParams?.type === 'shared' ? this.sourceCities : this.reservedCities;
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      this.modifyFormSuggestions[`modify-${field}`] = cities.slice(0, 10);
      return;
    }

    const filtered = cities.filter(city =>
      city.name.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10);

    this.modifyFormSuggestions[`modify-${field}`] = filtered;
  }

  onModifyLocationInput(event: Event, field: 'pickupLocation' | 'dropLocation') {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.showModifyLocationSuggestions(value, field);
  }

  showModifyLocationSuggestions(query: string, field: 'pickupLocation' | 'dropLocation') {
    const locations = field === 'pickupLocation'
      ? this.sharedPickupLocations
      : this.sharedDropoffLocations;
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      this.modifyFormSuggestions[`modify-${field}`] = locations.slice(0, 10);
      return;
    }

    const filtered = locations.filter((loc: string) =>
      loc.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10);

    this.modifyFormSuggestions[`modify-${field}`] = filtered;
  }

  submitModifyForm() {
    if (!this.searchParams) return;

    // Validate form
    if (!this.modifyFormValues.from || !this.modifyFormValues.to) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select both pickup and drop-off cities.',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    if (!this.modifyFormValues.date) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a date.',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    if (this.searchParams.type === 'reserved' && !this.modifyFormValues.pickupTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please select a pickup time.',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    if (!this.modifyFormValues.pickupLocation || !this.modifyFormValues.dropLocation) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please enter specific pickup and drop-off locations.',
        confirmButtonColor: '#ff6b35'
      });
      return;
    }

    // For reserved cabs, get location codes
    if (this.searchParams.type === 'reserved') {
      const fromCity = this.reservedCities.find(c => c.name === this.modifyFormValues.from);
      const toCity = this.reservedCities.find(c => c.name === this.modifyFormValues.to);

      if (!fromCity || !toCity) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Selection',
          text: 'Please select valid cities.',
          confirmButtonColor: '#ff6b35'
        });
        return;
      }

      // Update search params with new values
      this.searchParams = {
        ...this.searchParams,
        from: this.modifyFormValues.from,
        to: this.modifyFormValues.to,
        pickupLocation: this.modifyFormValues.pickupLocation,
        dropLocation: this.modifyFormValues.dropLocation,
        date: this.modifyFormValues.date,
        pickupTime: this.modifyFormValues.pickupTime,
        passengers: this.modifyFormValues.passengers,
        phoneNumber: this.modifyFormValues.phoneNumber,
        fromlocid: fromCity.code,
        tolocid: toCity.code
      };
    } else {
      // For shared cabs
      this.searchParams = {
        ...this.searchParams,
        from: this.modifyFormValues.from,
        to: this.modifyFormValues.to,
        pickupLocation: this.modifyFormValues.pickupLocation,
        dropLocation: this.modifyFormValues.dropLocation,
        date: this.modifyFormValues.date,
        passengers: this.modifyFormValues.passengers,
        phoneNumber: this.modifyFormValues.phoneNumber
      };
    }

    // Store updated params
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bookingSearchParams', JSON.stringify(this.searchParams));
    }

    // Hide modify form
    this.showModifyForm = false;

    // Reload vehicle options
    this.loadVehicleOptions();
  }

  cancelModifyForm() {
    this.showModifyForm = false;
    this.modifyFormSuggestions = {};
  }

  // Swap from and to cities
  swapCities() {
    const temp = this.modifyFormValues.from;
    this.modifyFormValues.from = this.modifyFormValues.to;
    this.modifyFormValues.to = temp;

    // Also swap pickup and drop locations if they exist
    const tempLocation = this.modifyFormValues.pickupLocation;
    this.modifyFormValues.pickupLocation = this.modifyFormValues.dropLocation;
    this.modifyFormValues.dropLocation = tempLocation;
  }

  // Increment passengers count
  incrementPassengers() {
    if (this.modifyFormValues.passengers < 10) {
      this.modifyFormValues.passengers++;
    }
  }

  // Decrement passengers count
  decrementPassengers() {
    if (this.modifyFormValues.passengers > 1) {
      this.modifyFormValues.passengers--;
    }
  }

  // Get today's date in YYYY-MM-DD format for date input min attribute
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Show city suggestions on focus
  showModifyCitySuggestionsOnFocus(field: 'from' | 'to') {
    const value = field === 'from' ? this.modifyFormValues.from : this.modifyFormValues.to;
    this.showModifyCitySuggestions(value, field);
  }

  // Show location suggestions on focus
  showModifyLocationSuggestionsOnFocus(field: 'pickupLocation' | 'dropLocation') {
    const value = field === 'pickupLocation' ? this.modifyFormValues.pickupLocation : this.modifyFormValues.dropLocation;
    this.showModifyLocationSuggestions(value, field);
  }

  // Hide location suggestions
  hideLocationSuggestions(field: string) {
    setTimeout(() => {
      const key = `modify-${field}`;
      this.modifyFormSuggestions[key] = [];
    }, 200);
  }

  // Handle date selection from custom calendar
  onModifyDateSelected(date: string) {
    this.modifyFormValues.date = date;
  }

  // Calendar opened handler
  onCalendarOpened() {
    // Handle calendar opened if needed
  }

  // Calendar closed handler
  onCalendarClosed() {
    // Handle calendar closed if needed
  }

  // Handle document click
  onDocumentClick(event: Event) {
    // Close suggestions when clicking outside
  }

  private getCityState(cityName: string): string {
    // Simple state mapping - can be enhanced
    return '';
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

      // Prepare API request parameters
      const fullName = this.carAdditionFormData.fullName;
      const contactNumber = this.carAdditionFormData.contactNo;
      const emailId = this.carAdditionFormData.emailId;
      const preferredTime = this.carAdditionFormData.preferredTime;
      const travelDate = this.searchParams?.date || '';
      const source = this.searchParams?.from || '';
      const pickup = this.searchParams?.pickupLocation || '';
      const destination = this.searchParams?.to || '';
      const drop = this.searchParams?.dropLocation || '';
      const seats = this.searchParams?.passengers || 1;

      console.log('========== CALLING caraddditionrequest API ==========');
      console.log('Request Parameters:');
      console.log('  Full Name:', fullName);
      console.log('  Contact Number:', contactNumber);
      console.log('  Email ID:', emailId);
      console.log('  Preferred Time:', preferredTime);
      console.log('  Travel Date:', travelDate);
      console.log('  Source:', source);
      console.log('  Pickup:', pickup);
      console.log('  Destination:', destination);
      console.log('  Drop:', drop);
      console.log('  Seats:', seats);
      console.log('====================================================');

      // Call API to submit car addition request
      this.apiService.caraddditionrequest(
        fullName,
        contactNumber,
        emailId,
        preferredTime,
        travelDate,
        source,
        pickup,
        destination,
        drop,
        seats
      ).subscribe({
        next: (response: any) => {
          console.log('========== caraddditionrequest API RESPONSE ==========');
          console.log('Response:', response);
          console.log('Response Type:', typeof response);
          console.log('Response String:', JSON.stringify(response));
          console.log('=====================================================');

          // Close the modal
          this.closeCarAdditionModal();

          // Prepare form data for thank you page
          const thankYouData = {
            formType: 'caraddition',
            title: 'Request Submitted Successfully!',
            message: 'Your car addition request has been received.',
            subtitle: 'We will try our best to add a car for your preferred timing and contact you soon.',
            redirectUrl: '/',
            redirectText: 'Back to Home',
            additionalInfo: `Route: ${this.searchParams?.from} → ${this.searchParams?.to} | Date: ${this.searchParams?.date} | Preferred Time: ${this.formatTimeDisplay(preferredTime)}`
          };

          // Store in localStorage as fallback
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('thankyouFormData', JSON.stringify(thankYouData));
          }

          // Navigate to thank you page
          this.router.navigate(['/thankyou-form'], {
            state: { formData: thankYouData }
          });
        },
        error: (error) => {
          console.error('========== caraddditionrequest API ERROR ==========');
          console.error('Error:', error);
          console.error('===================================================');

          Swal.fire({
            title: 'Error',
            text: 'Error submitting car addition request. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#8B5CF6'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all the required fields.',
        confirmButtonColor: '#ff6b35'
      });
    }
  }

  // Method to view all car addition requests (for debugging/admin)
  // viewAllCarAdditionRequests() {
  //   if (this.carAdditionRequests.length === 0) {
  //     alert('No car addition requests found.');
  //     return;
  //   }

  //   console.log('All Car Addition Requests:', this.carAdditionRequests);

  //   let requestList = `Total Car Addition Requests: ${this.carAdditionRequests.length}\n\n`;
  //   this.carAdditionRequests.forEach((request, index) => {
  //     requestList += `Request ${index + 1}:\n`;
  //     requestList += `ID: ${request.id}\n`;
  //     requestList += `Customer: ${request.customerDetails.fullName}\n`;
  //     requestList += `Contact: ${request.customerDetails.contactNo}\n`;
  //     requestList += `Email: ${request.customerDetails.emailId}\n`;
  //     requestList += `Preferred Time: ${request.customerDetails.preferredTime}\n\n`;
  //     requestList += `Route Details:\n`;
  //     requestList += `From: ${request.searchParams?.from}\n`;
  //     requestList += `To: ${request.searchParams?.to}\n`;
  //     requestList += `Pickup Location: ${request.locationDetails?.pickupLocation || 'Not specified'}\n`;
  //     requestList += `Drop Location: ${request.locationDetails?.dropLocation || 'Not specified'}\n`;
  //     requestList += `Date: ${request.searchParams?.date}\n`;
  //     requestList += `Passengers: ${request.searchParams?.passengers}\n`;
  //     requestList += `Status: ${request.status}\n`;
  //     requestList += `Submitted: ${new Date(request.timestamp).toLocaleString()}\n\n`;
  //   });

  //   alert(requestList);
  // }

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

    return `${displayHour}:${minute.padStart(2, '0')}  ${period}`;
  }

  formatDuration(raw: string | undefined | null): string {
    if (!raw) return '';
    // Strip any leading minus sign and surrounding spaces
    return raw.replace(/^\s*-+\s*/, '').trim();
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

  toggleCardExpansion(vehicleId: string, event?: Event): void {
    if (event) {
      // Don't toggle if clicking on button or interactive elements
      const target = event.target as HTMLElement;
      if (target.closest('.btn') || target.closest('.dropdown') || target.closest('button')) {
        return;
      }
    }

    this.expandedSections[vehicleId] = !this.expandedSections[vehicleId];
    console.log(`Toggled card ${vehicleId}: ${this.expandedSections[vehicleId]}`);
  }

  // Seat selection methods
  selectSeat(vehicle: VehicleOption) {
    console.log('Opening seat selection popup for vehicle:', vehicle.name);
    this.currentSelectedVehicle = vehicle;
    this.showSeatPopup = true;
    this.isSeatLoading = true;

    // Calculate price excluding GST (for shared cabs, remove 5% GST from API price)
    const seatPrice = this.getPriceExcludingGST(vehicle.price);

    // Initialize seats with default status first
    this.initializeSeats(seatPrice);

    // Fetch actual seat availability from API
    if (vehicle.tid) {
      this.fetchSeatDetails(vehicle.tid, seatPrice);
    } else {
      this.isSeatLoading = false;
    }
    console.log('showSeatPopup set to:', this.showSeatPopup);
  }

  getSelectedSeatList(): string {
    return this.selectedSeats.map(seat => seat.number).join(', ');
  }

  fetchSeatDetails(tid: string, price: number) {
    console.log('========== CALLING getSeatDetails API ==========');
    console.log('TID:', tid);

    this.apiService.getSeatDetails(tid).subscribe({
      next: (data: any) => {
        console.log('========== getSeatDetails API RESPONSE ==========');
        console.log('Response:', data);
        console.log('Response Type:', typeof data);
        console.log('Response String:', JSON.stringify(data));
        console.log('================================================');

        // Update seat statuses based on API response
        this.updateSeatStatusFromAPI(data, price);
        this.isSeatLoading = false;
      },
      error: (error) => {
        console.error('========== getSeatDetails API ERROR ==========');
        console.error('Error:', error);
        console.error('===============================================');
        // Keep default seat statuses if API fails
        this.isSeatLoading = false;
      }
    });
  }

  updateSeatStatusFromAPI(apiData: any, price: number) {
    // Create a map of seat numbers to their booked status from API
    const seatStatusMap: { [key: number]: boolean } = {};

    if (Array.isArray(apiData)) {
      apiData.forEach((seat: any) => {
        const seatNumber = parseInt(seat.seatNumber || seat.seatnumber || seat.seat_number, 10);
        const isBooked = seat.bookedStatus === 'Y' || seat.bookedStatus === 'y' || seat.bookedstatus === 'Y' || seat.bookedstatus === 'y';
        if (seatNumber) {
          seatStatusMap[seatNumber] = isBooked;
        }
      });
    }

    console.log('Seat Status Map from API:', seatStatusMap);

    // Update front seats
    this.frontSeats = this.frontSeats.map(seat => ({
      ...seat,
      status: seatStatusMap[seat.number] ? 'booked' : 'available'
    }));

    // Update middle seats
    this.middleSeats = this.middleSeats.map(seat => ({
      ...seat,
      status: seatStatusMap[seat.number] ? 'booked' : 'available'
    }));

    // Update back seats
    this.backSeats = this.backSeats.map(seat => ({
      ...seat,
      status: seatStatusMap[seat.number] ? 'booked' : 'available'
    }));

    console.log('Updated Front Seats:', this.frontSeats);
    console.log('Updated Middle Seats:', this.middleSeats);
    console.log('Updated Back Seats:', this.backSeats);
  }

  initializeSeats(price: number) {

    this.frontSeats = [
      { id: '1', number: 1, status: 'available', price: price }
    ];

    this.middleSeats = [
      { id: '3', number: 3, status: 'available', price: price },
      { id: '4', number: 4, status: 'available', price: price }
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

  getTotalPrice(): number {
    return this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  // Calculate price excluding GST based on cab type
  // For shared cabs: Remove 5% GST (API price is GST inclusive)
  // For reserved cabs: Return price as is (API price is already without GST)
  getPriceExcludingGST(price: number): number {
    if (this.searchParams?.type === 'shared') {
      // Shared cab price includes GST, so remove 5%
      // Price with GST = Base Price × 1.05
      // Base Price = Price with GST / 1.05
      const basePrice = price / 1.05;
      // Round to 2 decimal places
      return Math.round(basePrice * 100) / 100;
    } else {
      // Reserved cab price is already without GST
      // Round to 2 decimal places
      return Math.round(price * 100) / 100;
    }
  }

  proceedToBooking() {
    if (this.selectedSeats.length > 0 && this.currentSelectedVehicle) {
      console.log('Proceeding to booking with seats:', this.selectedSeats);

      // Get TID, selected seats, and phone number
      const tid = this.currentSelectedVehicle.tid;
      const phoneNumber = this.searchParams?.phoneNumber || '';

      // Sort selected seat numbers and convert to string (as per reference image)
      const sortedSeatNumbers = this.selectedSeats
        .map(seat => seat.number)
        .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
        .toString();

      console.log('========== CALLING shareSeatBlock API ==========');
      console.log('TID:', tid);
      console.log('Selected Seats (sorted):', sortedSeatNumbers);
      console.log('Phone Number:', phoneNumber);
      console.log('================================================');

      // Call shareSeatBlock API to check if seats are blocked
      this.apiService.shareSeatBlock(tid, sortedSeatNumbers, phoneNumber).subscribe({
        next: (val: any) => {
          console.log('========== shareSeatBlock API RESPONSE ==========');
          console.log('Response:', val);
          console.log('Response Type:', typeof val);
          console.log('Response String:', JSON.stringify(val));
          console.log('================================================');

          // Check if response includes 'NO BLOCKING' (as per reference image)
          const responseString = JSON.stringify(val);
          if (responseString.includes('NO BLOCKING')) {
            console.log('✅ NO BLOCKING - Seats are available, proceeding to checkout');

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

            // Create booking data for checkout
            const bookingData = {
              searchParams: this.searchParams,
              vehicleDetails: {
                ...this.currentSelectedVehicle,
                price: this.getPriceExcludingGST(this.currentSelectedVehicle!.price) // Price excluding GST
              },
              selectedSeats: this.selectedSeats,
              bookingType: 'shared' as const,
              totalPrice: totalPrice
            };

            // Store booking data
            localStorage.setItem('bookingData', JSON.stringify(bookingData));

            // Navigate to checkout
            this.router.navigate(['/checkout'], {
              state: { bookingData: bookingData }
            });

            this.closeSeatPopup();
          } else {
            console.log('❌ SEATS ARE BLOCKED - Cannot proceed to checkout');
            Swal.fire({
              icon: 'error',
              title: 'Seats Unavailable',
              text: 'Selected seats are currently blocked. Please select different seats.',
              confirmButtonColor: '#ff6b35'
            });
          }
        },
        error: (error) => {
          console.error('========== shareSeatBlock API ERROR ==========');
          console.error('Error:', error);
          console.error('===============================================');
          Swal.fire({
            icon: 'error',
            title: 'Connection Error',
            text: 'Error checking seat availability. Please try again.',
            confirmButtonColor: '#ff6b35'
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No Seat Selected',
        text: 'Please select at least one seat to proceed.',
        confirmButtonColor: '#ff6b35'
      });
    }
  }

  bookCab(vehicle: VehicleOption) {
    console.log('Booking cab:', vehicle);

    // Get the correct departure time (user's pickup time for reserved cabs)
    const departureTime = this.searchParams && this.searchParams.type === 'reserved' && this.searchParams.pickupTime
      ? this.formatPickupTime(this.searchParams.pickupTime)
      : vehicle.departureTime;

    // Calculate price excluding GST
    const vehiclePrice = this.getPriceExcludingGST(vehicle.price);

    // Create booking details
    const bookingDetails = {
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        price: vehiclePrice,
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
      totalPrice: vehiclePrice
    };

    // Create booking data for checkout
    const bookingData = {
      searchParams: this.searchParams,
      vehicleDetails: {
        ...vehicle,
        price: vehiclePrice // Price excluding GST
      },
      bookingType: 'reserved' as const,
      totalPrice: vehiclePrice
    };

    // Store booking data
    localStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to checkout
    this.router.navigate(['/checkout'], {
      state: { bookingData: bookingData }
    });
  }

  // Helpers for time display
  getDepartureDisplay(vehicle: VehicleOption): string {
    const reservedPickup = this.searchParams && this.searchParams.type === 'reserved' && this.searchParams.pickupTime;
    return reservedPickup ? this.formatPickupTime(this.searchParams!.pickupTime!) : vehicle.departureTime;
  }

  private parseTimeToMinutes(timeString: string): number | null {
    if (!timeString) return null;
    const normalized = timeString.trim().toLowerCase();

    // 12-hour with am/pm
    const match12 = normalized.match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
    if (match12) {
      let hour = parseInt(match12[1], 10);
      const minute = parseInt(match12[2], 10);
      const period = match12[3];
      if (period === 'pm' && hour !== 12) hour += 12;
      if (period === 'am' && hour === 12) hour = 0;
      return hour * 60 + minute;
    }

    // 24-hour fallback
    const match24 = normalized.match(/(\d{1,2}):(\d{2})/);
    if (match24) {
      const hour = parseInt(match24[1], 10);
      const minute = parseInt(match24[2], 10);
      return hour * 60 + minute;
    }

    return null;
  }

  private parseDurationToMinutes(duration: string): number | null {
    if (!duration) return null;
    const hoursMatch = duration.match(/(\d+)\s*hr/i);
    const minsMatch = duration.match(/(\d+)\s*min/i);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    if (isNaN(hours) && isNaN(minutes)) return null;
    return hours * 60 + minutes;
  }

  private formatMinutesToTime(totalMinutes: number): string {
    const mins = ((totalMinutes % 1440) + 1440) % 1440; // ensure positive wrap
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  computeArrivalTime(departure: string | undefined | null, duration: string | undefined | null): string {
    if (!departure || !duration) return '';
    const depMinutes = this.parseTimeToMinutes(departure);
    const durMinutes = this.parseDurationToMinutes(duration);
    if (depMinutes === null || durMinutes === null) return '';
    return this.formatMinutesToTime(depMinutes + durMinutes);
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
    if (!isPlatformBrowser(this.platformId)) return;
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

  showAttentionAlert() {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      html: `
        <div class="swal-attention-content">
          <div class="swal-icon-circle">
            <i class="fas fa-info"></i>
          </div>
          <h2>Attention!</h2>
          <p>
            The Journey Duration shown in the car list is NOT exact and DOES NOT take
            into account delays due to traffic & landslides. Please keep at least
            2 hours buffer time while planning your journey.
          </p>
        </div>
      `,
      confirmButtonText: 'Ok',
      confirmButtonColor: '#8B5CF6',
      customClass: {
        popup: 'swal-attention-popup',
        confirmButton: 'swal-attention-btn'
      }
    });
  }
}