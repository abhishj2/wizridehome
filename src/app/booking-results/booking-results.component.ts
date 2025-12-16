import { Component, OnInit, OnDestroy, Input, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../services/apiservice.service';
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

  // Sticky header property
  isHeaderSticky = false;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private apiService: ApiserviceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isHeaderSticky = scrollPosition > 50;
  }

  ngOnInit() {
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
      let departureTime = vehicle.SHOWTIME || vehicle.TRAVELTIME || '';
      if (departureTime) {
        // Convert "09:00 AM" to "09:00am" format for display
        departureTime = departureTime.toLowerCase().replace(/\s+/g, '');
        // If it's in 24-hour format like "09:00:00", convert to 12-hour format
        if (departureTime.includes(':') && !departureTime.includes('am') && !departureTime.includes('pm')) {
          const [hours, minutes] = departureTime.split(':');
          const hour24 = parseInt(hours, 10);
          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
          const period = hour24 >= 12 ? 'pm' : 'am';
          departureTime = `${hour12}:${minutes}${period}`;
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
        // Format time for display (e.g., "01:15:00 PM" -> "01:15pm")
        departureTime = departureTime.toLowerCase().replace(/\s+/g, '').replace(/:/g, ':');
        // Remove seconds if present
        if (departureTime.includes(':') && departureTime.split(':').length === 3) {
          const [hours, minutes] = departureTime.split(':');
          const period = minutes.includes('am') || minutes.includes('pm') ? 
            (minutes.includes('am') ? 'am' : 'pm') : 
            (departureTime.includes('am') ? 'am' : 'pm');
          const min = minutes.replace(/[amp]/gi, '');
          departureTime = `${hours}:${min}${period}`;
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
        amenities: ['AC', 'Luggage', 'Personal Driver'], // Default amenities
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
          
          
          
          this.closeCarAdditionModal();
        },
        error: (error) => {
          console.error('========== caraddditionrequest API ERROR ==========');
          console.error('Error:', error);
          console.error('===================================================');
          alert('Error submitting car addition request. Please try again.');
        }
      });
    } else {
      alert('Please fill in all the required fields.');
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
    
    return `${displayHour}:${minute.padStart(2, '0')} ${period}`;
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
    
    // Initialize seats with default status first
    this.initializeSeats(vehicle.price);
    
    // Fetch actual seat availability from API
    if (vehicle.tid) {
      this.fetchSeatDetails(vehicle.tid, vehicle.price);
    }
    
    this.showSeatPopup = true;
    console.log('showSeatPopup set to:', this.showSeatPopup);
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
      },
      error: (error) => {
        console.error('========== getSeatDetails API ERROR ==========');
        console.error('Error:', error);
        console.error('===============================================');
        // Keep default seat statuses if API fails
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
              vehicleDetails: this.currentSelectedVehicle,
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
            alert('Selected seats are currently blocked. Please select different seats.');
          }
        },
        error: (error) => {
          console.error('========== shareSeatBlock API ERROR ==========');
          console.error('Error:', error);
          console.error('===============================================');
          alert('Error checking seat availability. Please try again.');
        }
      });
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
    
    // Create booking data for checkout
    const bookingData = {
      searchParams: this.searchParams,
      vehicleDetails: vehicle,
      bookingType: 'reserved' as const,
      totalPrice: vehicle.price
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