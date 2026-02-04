import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import { FlightData } from '../interface/flight-data';
import { CustomCalendarComponent } from '../calendar/calendar.component';
import Swal from 'sweetalert2';

type FooterTab = 'flight' | 'fare' | 'cancellation' | 'dateChange';

@Component({
  selector: 'app-flightlist',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, CustomCalendarComponent],
  templateUrl: './flightlist.component.html',
  styleUrls: ['./flightlist.component.css']
})
export class FlightlistComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  type: any;
  loader: boolean = true;
  private subscriptions: Subscription = new Subscription();
  isBrowser: boolean;

  finalFlightSelection: any = null;
  flightInputData: any = [];
  traceid: any = '';
  calendarFareMap: Map<string, any> = new Map();
  calendarFareMapReturn: Map<string, any> = new Map();

  dynamicFilters = {
    airlines: [] as string[],
    min_price: 0,
    max_price: 0,
    stops: [] as number[]
  };

  priceRange: any;

  // Onward
  showRefundableOnward: boolean = true;
  showNonRefundableOnward: boolean = true;
  // Return
  showRefundableReturn: boolean = true;
  showNonRefundableReturn: boolean = true;

  modifySearchForm: FormGroup;
  tripType: 'oneway' | 'round' | 'multi' = 'oneway';
  selectedRefundability: Set<string> = new Set();
  returnDateError: string = '';

  cities: any[] = [];
  flightAirports: any[] = [];

  travelClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

  isHeaderSticky: boolean = false;
  showModifyForm: boolean = false;
  editField: 'from' | 'to' | 'departure' | 'travellers' | null = null;

  // City suggestions for dropdown
  activeSuggestions: { [key: string]: any[] } = {};

  // Toggle edit field - ensures modify form doesn't open
  toggleEditField(field: 'from' | 'to' | 'departure' | 'travellers') {
    // Close modify form if it's open (only for desktop inline editing)
    // This ensures clicking summary sections doesn't open the modify form
    this.showModifyForm = false;
    // Toggle the edit field
    const wasOpen = this.editField === field;
    this.editField = wasOpen ? null : field;

    // If opening city fields, show suggestions immediately
    if (this.editField === 'from') {
      // Show suggestions immediately
      this.showCitySuggestionsOnFocus('summary-from');
      // Also trigger after a short delay to ensure input is rendered
      setTimeout(() => {
        this.showCitySuggestionsOnFocus('summary-from');
      }, 50);
    } else if (this.editField === 'to') {
      // Show suggestions immediately
      this.showCitySuggestionsOnFocus('summary-to');
      // Also trigger after a short delay to ensure input is rendered
      setTimeout(() => {
        this.showCitySuggestionsOnFocus('summary-to');
      }, 50);
    } else if (this.editField === 'departure') {
      // Trigger calendar to open after a short delay to ensure it's rendered
      setTimeout(() => {
        this.openDepartureCalendar();
      }, 100);
    }

    // If opening travelers, also open the panel
    if (this.editField === 'travellers' && !this.isTravelersOpen) {
      this.isTravelersOpen = true;
    } else if (this.editField !== 'travellers') {
      this.isTravelersOpen = false;
    }
  }
  isTravelersOpen: boolean = false;
  selectedClass: string = 'economy';
  counts = {
    adults: 1,
    children: 0,
    infants: 0
  };

  flights: any[] = [];
  finalFinalList: any = [];
  finalFinalListOutbound: any = [];

  flightDetailsExpanded: boolean[] = [];
  activeTabs: string[] = [];

  tabs = [
    { id: 'flight', label: 'Flight Details' },
    { id: 'fare', label: 'Fare Summary' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'dateChange', label: 'Date Change' }
  ];

  tabsBoth: { id: FooterTab; label: string }[] = [
    { id: 'flight', label: 'Flight' },
    { id: 'fare', label: 'Fare Summary' },
    { id: 'cancellation', label: 'Cancellation' },
    { id: 'dateChange', label: 'Date Change' }
  ];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  datePrices: { date: string; price: number; isLowest: boolean }[] = [];
  allAvailableDates: { date: string; price: number; isLowest: boolean }[] = []; // All dates from API
  highlightedDate: any = '';
  initialScrollIndex: number = -1;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  private pendingCenterIndex: number = -1;

  // Lazy loading variables
  currentBatchSize: number = 15; // Show 15 dates initially
  loadMoreThreshold: number = 5; // Load more when 5 dates from the end
  isLoadingMore: boolean = false; // Public so template can access it

  @ViewChild('fareScrollContainer') fareScrollContainer!: ElementRef;
  showFareModal = false;
  showFareModalBoth = false;

  flightType: any = '';

  outboundFlights: any[] = [];
  returnFlights: any[] = [];
  selectedOutbound: any = null;
  selectedReturn: any = null;

  // Round trip tab management
  activeTab: 'onward' | 'return' = 'onward';
  selectedOutboundIndex: number = -1;
  selectedReturnIndex: number = -1;
  selectedOutboundFooter: any = null;
  underlineStyle: any = {};

  showFareSummary = false;
  showFareSummaryBothway = false;
  showFooterDetailsBothway = true;
  expandedFlightDetailsBothway = false;
  expandedTypeBothway: 'departure' | 'return' | null = null;
  footerTabBothwayOutbound: 'flight' | 'fare' | 'cancellation' | 'dateChange' = 'flight';
  footerTabBothwayReturn: 'flight' | 'fare' | 'cancellation' | 'dateChange' = 'flight';

  // Modal Tab State
  activeFareTab: 'departure' | 'return' = 'departure';
  selectedFareIndex = {
    departure: -1,
    return: -1
  };

  fareOptions = {
    departure: [] as any[],
    return: [] as any[]
  };

  tripDetails = {
    departure: {
      from: '',
      to: '',
      airline: '',
      date: '',
      departure: '',
      arrival: ''
    },
    return: {
      from: '',
      to: '',
      airline: '',
      date: '',
      departure: '',
      arrival: ''
    }
  };

  // MULTI CITY
  @ViewChild('multicityScrollContainer') multicityScrollContainer!: ElementRef;
  @ViewChild('flightlistDepartureCalendar') flightlistDepartureCalendar!: CustomCalendarComponent;
  selectedMulticityTab = 0;
  multicityTabData: any[] = [];
  multicitySelectedFares: { [index: number]: any } = {};
  farePanelExpanded: boolean[] = [];
  showFareModalMultiCity = false;
  selectedMultiCityFlight: any = null;
  selectedMultiCitySegmentIndex = -1;
  selectedMultiCityFlightIndex = -1;

  groupedFlights: any[] = [];
  groupedFlightsOutbound: any[] = [];
  selectedFlight: any = null;
  originalGroupedFlights: any[] = [];
  originalGroupedFlightsOutbound: any[] = [];
  originalMulticityTabData: any[] = [];

  selectedFareOptions: { [key: number]: any } = {};

  // Mobile fare popup (mobile only)
  selectedFlightForMobile: any = null;
  showMobileFarePopup: boolean = false;

  hoveredIndex = -1;
  hoveredReturnIndex = -1;

  // Roundtrip filter states
  roundtripSelectedAirlinesOnward: string[] = [];
  roundtripSelectedStopsOnward: number[] = [];
  roundtripSelectedDepartureSlotsOnward = new Set<string>();
  roundtripPriceRangeOnward: number = 0;
  roundtripSelectedAirlinesReturn: string[] = [];
  roundtripSelectedStopsReturn: number[] = [];
  roundtripSelectedDepartureSlotsReturn = new Set<string>();
  roundtripPriceRangeReturn: number = 0;
  roundtripDynamicFiltersOnward: any = {};
  roundtripDynamicFiltersReturn: any = {};

  departureTimeSlots = [
    { label: 'Before 6 AM', iconClass: 'fas fa-coffee', range: [0, 6] },
    { label: '6 AM to 12 PM', iconClass: 'fas fa-sun', range: [6, 12] },
    { label: '12 PM to 6 PM', iconClass: 'fas fa-cloud-sun', range: [12, 18] },
    { label: 'After 6 PM', iconClass: 'fas fa-cloud-moon', range: [18, 24] }
  ];

  selectedDepartureSlots = new Set<string>();
  selectedAirlines: string[] = [];
  selectedStops: number[] = [];

  // Mobile Filter Properties
  showMobileFilter = false;
  mobileFilterActiveTab: 'sort' | 'filter' = 'filter';
  selectedSort = 'Price: Low to High';
  sortOptions = ['Price: Low to High', 'Price: High to Low', 'Duration: Shortest', 'Departure: Early', 'Departure: Late'];
  showRefundableOnly = false;

  showPassengerDropdown = false;
  adults = 1;
  children = 0;
  infants = 0;
  totalPassengers = 1;

  passengerTypes = [
    { label: 'Adults (12+)', key: 'adults' },
    { label: 'Children (2–12)', key: 'children' },
    { label: 'Infants (<2)', key: 'infants' }
  ];

  showFareDetailsTooltip = false;

  toggleFareDetailsTooltip() {
    this.showFareDetailsTooltip = !this.showFareDetailsTooltip;
  }



  getTotalBaseFare(): number {
    const outboundFare = this.selectedOutbound?.selectedFareOption?.Fare?.BaseFare ||
      this.selectedOutbound?.FareOptions?.[0]?.Fare?.BaseFare ||
      this.selectedOutbound?.Fare?.BaseFare || 0;

    const returnFare = this.selectedReturn?.selectedFareOption?.Fare?.BaseFare ||
      this.selectedReturn?.FareOptions?.[0]?.Fare?.BaseFare ||
      this.selectedReturn?.Fare?.BaseFare || 0;

    return outboundFare + returnFare;
  }

  getTotalSurcharges(): number {
    let outboundTax = 0;

    // Try selectedFareOption
    if (this.selectedOutbound?.selectedFareOption?.Fare) {
      const f = this.selectedOutbound.selectedFareOption.Fare;
      outboundTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }
    // Try FareOptions[0]
    else if (this.selectedOutbound?.FareOptions?.[0]?.Fare) {
      const f = this.selectedOutbound.FareOptions[0].Fare;
      outboundTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }
    // Try direct Fare property
    else if (this.selectedOutbound?.Fare) {
      const f = this.selectedOutbound.Fare;
      outboundTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }

    let returnTax = 0;

    // Try selectedFareOption
    if (this.selectedReturn?.selectedFareOption?.Fare) {
      const f = this.selectedReturn.selectedFareOption.Fare;
      returnTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }
    // Try FareOptions[0]
    else if (this.selectedReturn?.FareOptions?.[0]?.Fare) {
      const f = this.selectedReturn.FareOptions[0].Fare;
      returnTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }
    // Try direct Fare property
    else if (this.selectedReturn?.Fare) {
      const f = this.selectedReturn.Fare;
      returnTax = (f.Tax || 0) + (f.OtherCharges || 0) + (f.ServiceFee || 0) + (f.AdditionalTxnFeeOfrd || 0) + (f.AdditionalTxnFeePub || 0);
    }

    // If tax calculation yields 0, try difference between Total and Base
    if (outboundTax === 0) {
      const total = this.selectedOutbound?.selectedFareOption?.Fare?.PublishedFare ||
        this.selectedOutbound?.FareOptions?.[0]?.Fare?.PublishedFare ||
        this.selectedOutbound?.price || 0;

      const base = this.selectedOutbound?.selectedFareOption?.Fare?.BaseFare ||
        this.selectedOutbound?.FareOptions?.[0]?.Fare?.BaseFare ||
        this.selectedOutbound?.Fare?.BaseFare || 0;

      if (total > 0) outboundTax = total - base;
    }

    if (returnTax === 0) {
      const total = this.selectedReturn?.selectedFareOption?.Fare?.PublishedFare ||
        this.selectedReturn?.FareOptions?.[0]?.Fare?.PublishedFare ||
        this.selectedReturn?.price || 0;

      const base = this.selectedReturn?.selectedFareOption?.Fare?.BaseFare ||
        this.selectedReturn?.FareOptions?.[0]?.Fare?.BaseFare ||
        this.selectedReturn?.Fare?.BaseFare || 0;

      if (total > 0) returnTax = total - base;
    }

    return outboundTax + returnTax;
  }

  getTotalAmount(): number {
    const outboundTotal = this.selectedOutbound?.selectedFareOption?.Fare?.PublishedFare || this.selectedOutbound?.price || 0;
    const returnTotal = this.selectedReturn?.selectedFareOption?.Fare?.PublishedFare || this.selectedReturn?.price || 0;
    return outboundTotal + returnTotal;
  }

  constructor(
    public apiService: ApiserviceService,
    public _Activateroute: ActivatedRoute,
    public router: Router,
    public flightDataService: FlightdataService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.flightDetailsExpanded = [];
    this.activeTabs = [];
    this.modifySearchForm = this.fb.group({
      from: [],
      to: [],
      departureDate: [],
      returnDate: [],
      adults: [1],
      children: [0],
      infants: [0],
      travelClass: []
    });
  }

  ngOnInit(): void {
    // Fetch full airport list first
    this.fetchAirportList();

    this.subscriptions.add(
      this._Activateroute.paramMap.subscribe(params => {
        this.type = params.get('type');
        if (!this.type) {
          this.router.navigate(['/']);
        }
      })
    );

    if (this.type === 'FLIGHT') {
      // Try to get data from FlightdataService first
      this.subscriptions.add(
        this.flightDataService.currentMessage.subscribe((val) => {
          if (val) {
            this.flightType = val['tripType'];
            this.flightInputData = val;
            console.log("Flight input data from service:", this.flightInputData);
            console.log("Calendar fare map in flightInputData:", {
              hasCalendarFareMap: !!this.flightInputData['calendarFareMap'],
              calendarFareMapType: typeof this.flightInputData['calendarFareMap'],
              calendarFareMapKeys: this.flightInputData['calendarFareMap'] ? Object.keys(this.flightInputData['calendarFareMap']).length : 0,
              calendarFareMapValue: this.flightInputData['calendarFareMap']
            });
            this.ensureRequiredData().then(() => {
              // Wait for airports to load before initializing form
              if (this.cities.length > 0) {
                this.initializeFromFlightData();
              } else {
                // If airports not loaded yet, wait a bit
                setTimeout(() => {
                  this.initializeFromFlightData();
                }, 500);
              }
            });
          } else {
            // Fallback to localStorage
            this.loadFromLocalStorage();
          }
        })
      );

      // Also check localStorage as fallback
      if (!this.flightInputData || Object.keys(this.flightInputData).length === 0) {
        this.loadFromLocalStorage();
      }
    }
  }

  fetchAirportList(): void {
    this.subscriptions.add(
      this.apiService.getFullAiportList().subscribe({
        next: (data) => {
          console.log('Airport list data received in flightlist:', data);
          if (Array.isArray(data)) {
            this.cities = data.map((item: any) => {
              const cityName = item.CITY || item.city || item.NAME || item.name || '';
              const airportCode = item.AIRPORTCODE || item.airportcode || item.CITYCODE || item.citycode || '';
              const country = item.COUNTRY || item.country || '';
              const airportName = item.NAME || item.name || '';

              return {
                name: cityName,
                code: airportCode,
                airport: airportName || cityName,
                country: country
              };
            });
            // Also populate flightAirports for consistency
            this.flightAirports = [...this.cities];
            console.log('Airports populated in flightlist:', this.cities.length);

            // If flight data is already loaded, populate form now
            if (this.flightInputData && Object.keys(this.flightInputData).length > 0) {
              this.initializeFromFlightData();
            }
          }
        },
        error: (error) => {
          console.error('Error fetching airport data in flightlist:', error);
          // Keep default cities as fallback
          this.cities = [
            { name: 'Hyderabad, India', code: 'HYD', airport: 'Rajiv Gandhi International Airport' },
            { name: 'Kolkata, India', code: 'CCU', airport: 'Netaji Subhash Chandra Bose International Airport' },
            { name: 'Chennai, India', code: 'MAA', airport: 'Chennai International Airport' },
            { name: 'Goa - Dabolim, India', code: 'GOI', airport: 'Goa Dabolim International Airport' },
            { name: 'Dubai, UAE', code: 'DXB', airport: 'Dubai International Airport' },
            { name: 'New Delhi, India', code: 'DEL', airport: 'Indira Gandhi International Airport' },
            { name: 'Mumbai, India', code: 'BOM', airport: 'Chhatrapati Shivaji Maharaj International Airport' }
          ];
          this.flightAirports = [...this.cities];
        }
      })
    );
  }

  async ensureRequiredData(): Promise<void> {
    if (!this.flightInputData) {
      this.flightInputData = {};
    }

    // Fetch IP address if missing (safe to fetch from anywhere)
    if (!this.flightInputData['ipAddress']) {
      await this.fetchIpAddress();
    }

    // For TBO token - if missing, redirect to home instead of fetching
    // The token should be fetched on the home page where the search is initiated
    if (!this.flightInputData['tboToken'] || this.flightInputData['tboToken'] === null) {
      console.warn('TBO Token is missing. Redirecting to home to start a new search.');
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please search for flights again from the home page.',
        confirmButtonText: 'Go to Home',
        allowOutsideClick: false
      }).then((result) => {
        this.router.navigate(['/']);
      });
      return;
    }
  }

  fetchIpAddress(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isBrowser) {
        resolve();
        return;
      }

      // Try to fetch IP address
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          this.flightInputData['ipAddress'] = data.ip;
          console.log('IP Address fetched:', data.ip);
          resolve();
        })
        .catch(error => {
          console.error('Error fetching IP address:', error);
          // Set a default or continue without it
          this.flightInputData['ipAddress'] = '';
          resolve();
        });
    });
  }

  // Removed fetchTboToken method - token should be fetched on home page only
  // This prevents "illegal page name" errors when trying to fetch token from flightlist page

  async loadFromLocalStorage(): Promise<void> {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('flightSearchData');
      if (storedData) {
        try {
          this.flightInputData = JSON.parse(storedData);
          this.flightType = this.flightInputData['tripType'];
          console.log("Flight input data from localStorage:", this.flightInputData);
          console.log("TBO Token in stored data:", this.flightInputData['tboToken']);
          console.log("IP Address in stored data:", this.flightInputData['ipAddress']);

          // Ensure required data exists before initializing
          await this.ensureRequiredData();

          // Wait for airports to load before initializing form
          if (this.cities.length > 0) {
            this.initializeFromFlightData();
          } else {
            // If airports not loaded yet, wait a bit
            setTimeout(() => {
              this.initializeFromFlightData();
            }, 500);
          }
        } catch (error) {
          console.error('Error parsing flight data from localStorage:', error);
          this.router.navigate(['/']);
        }
      } else {
        console.warn('No flight data found, redirecting to home');
        this.router.navigate(['/']);
      }
    }
  }

  initializeFromFlightData(): void {
    if (!this.flightInputData) return;

    console.log('initializeFromFlightData called, checking for calendarFareMap...');
    console.log('flightInputData keys:', Object.keys(this.flightInputData));

    // Initialize calendar fare maps - matching the working code format
    if (this.flightInputData['calendarFareMap']) {
      const calendarData = this.flightInputData['calendarFareMap'];
      console.log('Found calendarFareMap, type:', typeof calendarData, 'isObject:', typeof calendarData === 'object', 'isArray:', Array.isArray(calendarData));

      // Handle both Map and plain object formats
      if (calendarData instanceof Map) {
        this.calendarFareMap = calendarData;
        console.log('Calendar fare map is already a Map, size:', this.calendarFareMap.size);
      } else if (typeof calendarData === 'object' && calendarData !== null && !Array.isArray(calendarData)) {
        const entries = Object.entries(calendarData);
        console.log('Converting calendar fare map from object, entries count:', entries.length);
        console.log('Sample entries (first 3):', entries.slice(0, 3));
        this.calendarFareMap = new Map(entries);
        console.log('Calendar fare map initialized (departure):', this.calendarFareMap.size, 'entries');
      } else {
        console.log('Calendar fare map is in unexpected format:', calendarData);
      }

      if (this.calendarFareMap && this.calendarFareMap.size > 0) {
        this.prepareDatePricesFromCalendarMap();
      }
    } else {
      console.log('No calendarFareMap found in flightInputData. Available keys:', Object.keys(this.flightInputData));
      // If calendar fare map is missing or empty, fetch it if we have the required data
      if (this.flightInputData['fromAirportCode'] && this.flightInputData['toAirportCode'] &&
        this.flightInputData['tboToken'] && this.flightInputData['ipAddress']) {
        console.log('Fetching calendar fare map as it was not provided...');
        this.fetchFullYearCalendarFare('departure');
      }
    }

    // Also check if calendar fare map exists but is empty
    if (this.calendarFareMap && this.calendarFareMap.size === 0) {
      if (this.flightInputData['fromAirportCode'] && this.flightInputData['toAirportCode'] &&
        this.flightInputData['tboToken'] && this.flightInputData['ipAddress']) {
        console.log('Calendar fare map is empty, fetching...');
        this.fetchFullYearCalendarFare('departure');
      }
    }

    if (this.flightInputData['calendarFareMapReturn']) {
      const returnData = this.flightInputData['calendarFareMapReturn'];
      if (returnData instanceof Map) {
        this.calendarFareMapReturn = returnData;
      } else if (typeof returnData === 'object' && returnData !== null) {
        this.calendarFareMapReturn = new Map(Object.entries(returnData));
      }
      console.log('Calendar fare map initialized (return):', this.calendarFareMapReturn.size, 'entries');
    }

    // Populate modify search form with data from home page
    setTimeout(() => {
      if (this.flightInputData) {
        // Normalize travelClass to match dropdown options (capitalize first letter)
        let travelClass = this.flightInputData['travelClass'] || 'Economy';
        if (travelClass && typeof travelClass === 'string') {
          // Convert lowercase to proper case (e.g., 'economy' -> 'Economy')
          travelClass = travelClass.charAt(0).toUpperCase() + travelClass.slice(1).toLowerCase();
          // Handle special cases
          if (travelClass.toLowerCase() === 'economy') {
            travelClass = 'Economy';
          } else if (travelClass.toLowerCase() === 'premium economy') {
            travelClass = 'Premium Economy';
          } else if (travelClass.toLowerCase() === 'business') {
            travelClass = 'Business';
          } else if (travelClass.toLowerCase() === 'first class' || travelClass.toLowerCase() === 'first') {
            travelClass = 'First';
          }
        }

        console.log('Populating form with data:', {
          from: this.flightInputData['fromAirportCode'],
          to: this.flightInputData['toAirportCode'],
          travelClass: travelClass,
          departureDate: this.flightInputData['departureDate']
        });

        const adults = this.flightInputData['adults'] || 1;
        const children = this.flightInputData['children'] || 0;
        const infants = this.flightInputData['infants'] || 0;

        // Initialize counts object
        this.counts = {
          adults: adults,
          children: children,
          infants: infants
        };

        // Sync with existing variables
        this.adults = adults;
        this.children = children;
        this.infants = infants;

        // Initialize selected class
        if (travelClass) {
          this.selectedClass = travelClass.toLowerCase();
        }

        this.modifySearchForm.patchValue({
          from: this.flightInputData['fromAirportCode'] || '',
          to: this.flightInputData['toAirportCode'] || '',
          departureDate: this.flightInputData['departureDate'] || '',
          returnDate: this.flightInputData['returnDate'] || '',
          adults: adults,
          children: children,
          infants: infants,
          travelClass: travelClass
        });

        // Update total passengers
        this.updateTotalPassengers();

        console.log('Form populated. Current form values:', this.modifySearchForm.value);
      }
    }, 100);

    // Fetch flight data based on trip type
    if (this.flightType === 'oneway') {
      this.fetchOneWayFlights();
    } else if (this.flightType === 'round') {
      this.fetchRoundTripFlights();
    } else if (this.flightType === 'multi') {
      this.fetchMultiCityFlights();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  fetchOneWayFlights(): void {
    if (!this.flightInputData) {
      console.error('Flight input data is missing');
      this.loader = false;
      return;
    }

    // Validate required fields
    if (!this.flightInputData['tboToken'] || !this.flightInputData['ipAddress'] ||
      !this.flightInputData['fromAirportCode'] || !this.flightInputData['toAirportCode'] ||
      !this.flightInputData['departureDate']) {
      console.error('Missing required flight data:', {
        tboToken: !!this.flightInputData['tboToken'],
        ipAddress: !!this.flightInputData['ipAddress'],
        fromAirportCode: !!this.flightInputData['fromAirportCode'],
        toAirportCode: !!this.flightInputData['toAirportCode'],
        departureDate: !!this.flightInputData['departureDate']
      });

      // Token or data is missing - redirect to home to start fresh search
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Some required information is missing. Please search for flights again from the home page.',
        confirmButtonText: 'Go to Home',
        allowOutsideClick: false
      }).then(() => {
        this.router.navigate(['/']);
      });
      this.loader = false;
      return;
    }

    this.loader = true;
    console.log('Fetching flights with data:', {
      ipAddress: this.flightInputData['ipAddress'],
      tboToken: this.flightInputData['tboToken'] ? 'Present' : 'Missing',
      fromAirportCode: this.flightInputData['fromAirportCode'],
      toAirportCode: this.flightInputData['toAirportCode'],
      departureDate: this.flightInputData['departureDate']
    });

    this.apiService.getFlightDetailsOneWay(
      this.flightInputData['ipAddress'],
      this.flightInputData['tboToken'],
      this.flightInputData['adults'] || 1,
      this.flightInputData['children'] || 0,
      this.flightInputData['infants'] || 0,
      'oneWay',
      this.flightInputData['fromAirportCode'],
      this.flightInputData['toAirportCode'],
      this.flightInputData['travelClass'] || 'Economy',
      this.flightInputData['departureDate'],
      this.getFareTypeNumber(this.flightInputData['fareType'])
    ).subscribe({
      next: (val: any) => {
        console.log('=== ONE-WAY FLIGHT API RESPONSE ===');
        console.log('Full Response:', JSON.stringify(val, null, 2));
        console.log('Response Object:', val);
        console.log('Response.Response exists?', !!val['Response']);
        console.log('Response.Response.Results exists?', !!val['Response']?.['Results']);
        console.log('Response.Response.Results type:', typeof val['Response']?.['Results']);
        console.log('Response.Response.Results value:', val['Response']?.['Results']);

        this.traceid = val['Response']?.['TraceId'];
        console.log('Trace ID:', this.traceid);

        if (val['Response']?.['Results']?.[0]) {
          const flightResults = val['Response']['Results'][0];
          console.log('Raw flight results count:', flightResults.length);

          this.finalFinalList = flightResults.map((flight: any) => {
            const rules = flight.MiniFareRules?.[0] || [];
            return {
              ...flight,
              cancellationPolicy: rules.filter((r: any) => r.Type === 'Cancellation'),
              dateChangePolicy: rules.filter((r: any) => r.Type === 'Reissue')
            };
          });

          console.log('Processed finalFinalList count:', this.finalFinalList.length);

          this.flightDetailsExpanded = new Array(this.finalFinalList.length).fill(false);
          this.activeTabs = new Array(this.finalFinalList.length).fill('flight');

          // Group flights and generate filters
          this.groupFlights();
          this.generateDynamicFilters();

          // Initialize selectedFareOptions with lowest fare for each flight
          this.selectedFareOptions = {};
          this.groupedFlights.forEach((flight, index) => {
            if (flight.FareOptions && flight.FareOptions.length > 0) {
              const lowestFare = flight.FareOptions.reduce((a: any, b: any) => {
                const fareA = a?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
                const fareB = b?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
                return fareA < fareB ? a : b;
              });
              this.selectedFareOptions[index] = lowestFare;
            }
          });

          console.log('After grouping - groupedFlights count:', this.groupedFlights.length);
          console.log('Initialized selectedFareOptions for', Object.keys(this.selectedFareOptions).length, 'flights');

          // Ensure date prices are populated if calendar fare map exists
          // Re-check and initialize calendar fare map if needed
          if (!this.calendarFareMap || this.calendarFareMap.size === 0) {
            if (this.flightInputData['calendarFareMap']) {
              const calendarData = this.flightInputData['calendarFareMap'];
              if (calendarData instanceof Map) {
                this.calendarFareMap = calendarData;
              } else if (typeof calendarData === 'object' && calendarData !== null) {
                this.calendarFareMap = new Map(Object.entries(calendarData));
              }
              console.log('Re-initialized calendar fare map after flight fetch:', this.calendarFareMap.size, 'entries');
            }
          }

          if (this.calendarFareMap && this.calendarFareMap.size > 0) {
            this.prepareDatePricesFromCalendarMap();
          } else {
            // If still empty, fetch it
            if (this.flightInputData['fromAirportCode'] && this.flightInputData['toAirportCode'] &&
              this.flightInputData['tboToken'] && this.flightInputData['ipAddress']) {
              console.log('Calendar fare map still empty after fetch, fetching now...');
              this.fetchFullYearCalendarFare('departure');
            }
          }
        } else {
          console.warn('=== NO FLIGHT RESULTS ===');
          console.warn('Response structure check:', {
            hasResponse: !!val['Response'],
            hasResults: !!val['Response']?.['Results'],
            resultsLength: val['Response']?.['Results']?.length,
            resultsIsArray: Array.isArray(val['Response']?.['Results']),
            results: val['Response']?.['Results']
          });

          // Check for error messages in response
          if (val['Response']?.['Error']) {
            console.error('API Error:', val['Response']['Error']);
          }
          if (val['Response']?.['Errors']) {
            console.error('API Errors:', val['Response']['Errors']);
          }

          // Check alternative response structures
          console.log('Alternative check - val.Results:', val['Results']);
          console.log('Alternative check - val.response:', val['response']);
          console.log('Alternative check - val.data:', val['data']);

          this.finalFinalList = [];
          this.groupedFlights = [];
        }
        this.loader = false;
        console.log('Flight fetch complete. Loader set to false.');
        // Scroll to top on mobile after data loads
        this.scrollToTop();
      },
      error: (error) => {
        console.error('Error fetching one-way flights:', error);
        this.loader = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to fetch flights. Please try again.',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    });
  }

  fetchRoundTripFlights(): void {
    if (!this.flightInputData) {
      console.error('Flight input data is missing');
      this.loader = false;
      return;
    }

    // Validate required fields
    if (!this.flightInputData['tboToken'] || !this.flightInputData['ipAddress'] ||
      !this.flightInputData['fromAirportCode'] || !this.flightInputData['toAirportCode'] ||
      !this.flightInputData['departureDate'] || !this.flightInputData['returnDate']) {
      console.error('Missing required flight data for round trip');

      // Token or data is missing - redirect to home to start fresh search
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Some required information is missing. Please search for flights again from the home page.',
        confirmButtonText: 'Go to Home',
        allowOutsideClick: false
      }).then(() => {
        this.router.navigate(['/']);
      });
      this.loader = false;
      return;
    }

    this.loader = true;
    console.log('Fetching round-trip flights with data:', {
      ipAddress: this.flightInputData['ipAddress'],
      tboToken: this.flightInputData['tboToken'] ? 'Present' : 'Missing',
      fromAirportCode: this.flightInputData['fromAirportCode'],
      toAirportCode: this.flightInputData['toAirportCode'],
      departureDate: this.flightInputData['departureDate'],
      returnDate: this.flightInputData['returnDate']
    });

    this.apiService.getFlightDetailsBothWay(
      this.flightInputData['ipAddress'],
      this.flightInputData['tboToken'],
      this.flightInputData['adults'],
      this.flightInputData['children'],
      this.flightInputData['infants'],
      'return',
      this.flightInputData['fromAirportCode'],
      this.flightInputData['toAirportCode'],
      this.flightInputData['travelClass'],
      this.flightInputData['departureDate'],
      this.flightInputData['returnDate'],
      this.getFareTypeNumber(this.flightInputData['fareType'])
    ).subscribe({
      next: (val: any) => {
        console.log('Round-trip Flight API Response:', val);
        this.traceid = val['Response']?.['TraceId'];
        console.log('Trace ID:', this.traceid);

        if (val['Response']?.['Results']?.[0]) {
          const onwardResults = val['Response']['Results'][0];
          console.log('Raw onward flight results count:', onwardResults.length);

          this.finalFinalList = onwardResults.map((flight: any) => {
            const rules = flight.MiniFareRules?.[0] || [];
            return {
              ...flight,
              cancellationPolicy: rules.filter((r: any) => r.Type === 'Cancellation'),
              dateChangePolicy: rules.filter((r: any) => r.Type === 'Reissue')
            };
          });
          console.log('Processed finalFinalList (onward) count:', this.finalFinalList.length);
        } else {
          console.warn('No onward flight results in API response');
          this.finalFinalList = [];
        }

        if (val['Response']?.['Results']?.[1]) {
          const returnResults = val['Response']['Results'][1];
          console.log('Raw return flight results count:', returnResults.length);

          this.finalFinalListOutbound = returnResults.map((flight: any) => {
            const rules = flight.MiniFareRules?.[0] || [];
            return {
              ...flight,
              cancellationPolicy: rules.filter((r: any) => r.Type === 'Cancellation'),
              dateChangePolicy: rules.filter((r: any) => r.Type === 'Reissue')
            };
          });
          console.log('Processed finalFinalListOutbound (return) count:', this.finalFinalListOutbound.length);
        } else {
          console.warn('No return flight results in API response');
          this.finalFinalListOutbound = [];
        }

        // Group both onward and return flights
        this.groupFlights();
        this.groupFlightsOutbound();

        console.log('After grouping - Onward:', this.groupedFlights.length, 'Return:', this.groupedFlightsOutbound.length);

        // Generate filters for round trip
        this.generateRoundtripDynamicFilters();
        this.loader = false;
        console.log('Round-trip flight fetch complete. Loader set to false.');
        // Scroll to top on mobile after data loads
        this.scrollToTop();
      },
      error: (error) => {
        console.error('Error fetching round-trip flights:', error);
        this.loader = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to fetch flights. Please try again.',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    });
  }

  fetchMultiCityFlights(): void {
    if (!this.flightInputData) {
      console.error('Flight input data is missing');
      this.loader = false;
      return;
    }

    // Check for multiCityRoutes or multiCitySegment
    const multiCityRoutes = this.flightInputData['multiCityRoutes'] || this.flightInputData['multiCitySegment'] || [];

    // Convert multiCityRoutes format to API format if needed
    let formattedSegments: any[] = [];
    if (multiCityRoutes.length > 0) {
      // Check if already in API format (has Origin and Destination)
      if (multiCityRoutes[0] && multiCityRoutes[0].Origin && multiCityRoutes[0].Destination) {
        formattedSegments = multiCityRoutes;
      } else {
        // Convert from {from, to, date} format to API format
        const cabinClassMap: { [key: string]: string } = {
          'all': '1',
          'Economy': '2',
          'Premium Economy': '2',
          'premiumeconomy': '3',
          'business': '4',
          'Business': '4',
          'premiumbusiness': '5',
          'first': '6',
          'First': '6'
        };

        const travelClass = this.flightInputData['travelClass'] || 'Economy';
        const cabinCode = cabinClassMap[travelClass] || '2'; // Default to Economy

        formattedSegments = multiCityRoutes.map((route: any) => {
          // Extract airport codes from display strings (e.g., "Delhi (DEL)" -> "DEL")
          const extractCode = (str: string): string => {
            if (!str) return '';
            const codeMatch = str.match(/\(([^)]+)\)/);
            if (codeMatch) return codeMatch[1];
            // If no parentheses, assume it's already a code or try to find in cities
            const found = this.cities.find(c => c.name === str || c.code === str);
            return found?.code || str;
          };

          const originCode = extractCode(route.from || '');
          const destCode = extractCode(route.to || '');

          // Format date to ISO format
          let preferredDepartureTime = '';
          if (route.date) {
            const departureDate = new Date(route.date);
            if (!isNaN(departureDate.getTime())) {
              const year = departureDate.getFullYear();
              const month = String(departureDate.getMonth() + 1).padStart(2, '0');
              const day = String(departureDate.getDate()).padStart(2, '0');
              preferredDepartureTime = `${year}-${month}-${day}T00:00:00`;
            }
          }

          return {
            Origin: originCode,
            Destination: destCode,
            FlightCabinClass: cabinCode,
            PreferredDepartureTime: preferredDepartureTime,
            PreferredArrivalTime: preferredDepartureTime
          };
        });
      }
    }

    // Validate required fields for multi-city
    if (!this.flightInputData['tboToken'] || !this.flightInputData['ipAddress'] ||
      formattedSegments.length === 0) {
      console.error('Missing required flight data for multi-city:', {
        tboToken: !!this.flightInputData['tboToken'],
        ipAddress: !!this.flightInputData['ipAddress'],
        multiCityRoutes: !!this.flightInputData['multiCityRoutes'],
        multiCitySegment: !!this.flightInputData['multiCitySegment'],
        formattedSegmentsLength: formattedSegments.length,
        flightInputDataKeys: Object.keys(this.flightInputData)
      });

      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Some required information is missing. Please search for flights again from the home page.',
        confirmButtonText: 'Go to Home',
        allowOutsideClick: false
      }).then(() => {
        this.router.navigate(['/']);
      });
      this.loader = false;
      return;
    }

    this.loader = true;
    console.log('Fetching multi-city flights with data:', {
      ipAddress: this.flightInputData['ipAddress'],
      tboToken: this.flightInputData['tboToken'] ? 'Present' : 'Missing',
      segments: formattedSegments,
      adults: this.flightInputData['adults'],
      children: this.flightInputData['children'],
      infants: this.flightInputData['infants']
    });

    // Store formatted segments back in flightInputData for later use
    this.flightInputData['multiCitySegment'] = formattedSegments;

    this.apiService.getFlightDetailsMultiCity(
      this.flightInputData['ipAddress'],
      this.flightInputData['tboToken'],
      this.flightInputData['adults'] || 1,
      this.flightInputData['children'] || 0,
      this.flightInputData['infants'] || 0,
      formattedSegments,
      this.getFareTypeNumber(this.flightInputData['fareType'])
    ).subscribe({
      next: (val: any) => {
        console.log('Multi-city Flight API Response:', val);

        // Check if response is null or undefined
        if (!val || val === null) {
          console.error('Multi-city API returned null response');
          Swal.fire({
            title: 'Sorry!',
            html: 'No flights found for your multi-city search. Please try different dates or routes.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.loader = false;
          this.multicityTabData = [];
          return;
        }

        // Check for error response
        if (val?.Response?.Error?.ErrorCode && val.Response.Error.ErrorCode !== 0) {
          Swal.fire({
            title: 'Sorry!',
            html: val.Response.Error.ErrorMessage || 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.loader = false;
          this.multicityTabData = [];
          return;
        }

        // Check if Response exists
        if (!val.Response) {
          console.error('Multi-city API response missing Response object:', val);
          Swal.fire({
            title: 'Sorry!',
            html: 'Invalid response from server. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          this.loader = false;
          this.multicityTabData = [];
          return;
        }

        this.traceid = val['Response']?.['TraceId'];
        console.log('Trace ID:', this.traceid);

        // Multi-city API returns all flights in Results[0] (matching working code)
        // Each flight contains multiple segments within it
        const results = val?.Response?.Results?.[0] || [];

        console.log('Multi-city API Results:', {
          resultsLength: results.length,
          resultsType: Array.isArray(results) ? 'array' : typeof results,
          sampleResult: results.length > 0 ? results[0] : null
        });

        if (results.length === 0) {
          console.warn('No multi-city flight results in API response');
          Swal.fire({
            title: 'No Flights Found',
            html: 'No flights available for your selected multi-city routes. Please try different dates or routes.',
            icon: 'info',
            confirmButtonText: 'Ok'
          });
          this.multicityTabData = [];
          this.loader = false;
          return;
        }

        // Process all flights (matching working code approach)
        // Each flight in results contains all segments for that multi-city route
        const processedFlights = results.map((flight: any) => {
          const rules = flight.MiniFareRules?.[0] || [];
          return {
            ...flight,
            cancellationPolicy: rules.filter((r: any) => r.Type === 'Cancellation'),
            dateChangePolicy: rules.filter((r: any) => r.Type === 'Reissue')
          };
        });

        // Store in finalFinalList for grouping (matching working code)
        this.finalFinalList = processedFlights;

        // Group flights using multi-city grouping method (matching working code)
        this.groupFlightsMultiCity();

        // Generate filters
        this.dynamicFilters = this.generateFiltersFromFlightArray(this.groupedFlights);
        this.priceRange = this.dynamicFilters.max_price;

        // ===== CHANGED SECTION: Simplified tab data organization =====
        // Multi-city flights contain ALL segments in each flight's Segments array
        // We don't need separate data per tab - just reference the same grouped flights
        const segmentCount = this.flightInputData['multiCitySegment']?.length || 1;

        this.multicityTabData = Array.from({ length: segmentCount }, (_, segmentIndex) => ({
          segmentIndex: segmentIndex,
          flights: this.finalFinalList, // All processed flights
          groupedFlights: this.groupedFlights, // All grouped flights (same for all tabs)
          dynamicFilters: this.dynamicFilters
        }));

        // Backup original multi-city data for filtering (DEEP COPY)
        this.originalMulticityTabData = this.deepCopy(this.multicityTabData);
        // ===== END CHANGED SECTION =====

        console.log('Processed multi-city tab data:', {
          tabCount: this.multicityTabData.length,
          groupedFlightsCount: this.groupedFlights.length,
          sampleTabData: this.multicityTabData[0]
        });

        this.loader = false;
        // Scroll to top on mobile after data loads
        this.scrollToTop();
      },
      error: (error) => {
        console.error('Error fetching multi-city flights:', error);
        this.loader = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to fetch flights. Please try again.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  groupFlightsMultiCity(): void {
    const map = new Map<string, any>();
    console.log('groupFlightsMultiCity: Input finalFinalList', JSON.stringify(this.finalFinalList, null, 2));

    for (const flight of this.finalFinalList) {
      // Skip flights without valid Segments
      if (!flight.Segments || !Array.isArray(flight.Segments) || flight.Segments.length === 0) {
        console.warn('Skipping flight with no valid segments', JSON.stringify(flight, null, 2));
        continue;
      }

      // Build key across all segments (matching working code)
      const keyParts: string[] = [];
      let firstSegment: any = null;
      let lastSegment: any = null;

      // Iterate through all segment groups
      for (const segmentGroup of flight.Segments) {
        if (!segmentGroup || !Array.isArray(segmentGroup)) continue;

        for (const segment of segmentGroup) {
          if (!firstSegment) firstSegment = segment;
          lastSegment = segment;

          keyParts.push(
            `${segment.Airline.AirlineCode}-${segment.Airline.FlightNumber}-` +
            `${segment.Origin.DepTime}-${segment.Destination.ArrTime}-` +
            `${segment.Origin.Airport.CityName}-${segment.Destination.Airport.CityName}`
          );
        }
      }

      const key = keyParts.join('|');

      // Fare Calculation (per adult)
      let basePerAdult = 0;
      let taxPerAdult = 0;
      let totalPerAdult = 0;

      const adultFare = flight.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
      if (adultFare && adultFare.PassengerCount > 0) {
        basePerAdult = adultFare.BaseFare / adultFare.PassengerCount;
        taxPerAdult = adultFare.Tax / adultFare.PassengerCount;
        totalPerAdult = basePerAdult + taxPerAdult;
      }

      if (!map.has(key)) {
        map.set(key, {
          Segments: this.deepCopy(flight.Segments), // Deep copy to preserve structure
          Airline: firstSegment.Airline,
          Origin: firstSegment.Origin,
          Destination: lastSegment.Destination,
          FareOptions: [this.deepCopy(flight)], // Deep copy entire flight
          baseFarePerAdult: basePerAdult,
          taxPerAdult: taxPerAdult,
          price: totalPerAdult,
          logo: `assets/images/flightimages/${firstSegment.Airline.AirlineCode}.png`,
          isRefundable: flight.IsRefundable ?? false,
          airline: firstSegment.Airline.AirlineName,
          departure: firstSegment.Origin?.DepTime
            ? new Date(firstSegment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A',
          arrival: lastSegment.Destination?.ArrTime
            ? new Date(lastSegment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A'
        });
      } else {
        map.get(key).FareOptions.push(this.deepCopy(flight));
      }
    }

    this.groupedFlights = Array.from(map.values()).sort((a, b) => a.price - b.price);
    this.originalGroupedFlights = this.deepCopy(this.groupedFlights); // Deep copy to prevent mutations

    console.log('groupFlightsMultiCity: Grouped flights', {
      groupedFlightsCount: this.groupedFlights.length,
      groupedFlights: JSON.stringify(this.groupedFlights, null, 2)
    });
  }

  groupFlightsForSegment(flights: any[]): any[] {
    const map = new Map<string, any>();

    for (const flight of flights) {
      if (!flight.Segments || !Array.isArray(flight.Segments) || flight.Segments.length === 0) {
        console.warn('Skipping flight with no valid segments');
        continue;
      }

      // Get the first segment group (multi-city may have nested segments)
      const segmentGroup = flight.Segments[0];
      if (!segmentGroup || !Array.isArray(segmentGroup) || segmentGroup.length === 0) {
        continue;
      }

      const firstSegment = segmentGroup[0];
      const lastSegment = segmentGroup[segmentGroup.length - 1];

      let basePerAdult = 0;
      let taxPerAdult = 0;
      let totalPerAdult = 0;

      const adultFare = flight.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
      if (adultFare && adultFare.PassengerCount > 0) {
        basePerAdult = adultFare.BaseFare / adultFare.PassengerCount;
        taxPerAdult = adultFare.Tax / adultFare.PassengerCount;
        totalPerAdult = basePerAdult + taxPerAdult;
      }

      const key = `${firstSegment.Airline.AirlineCode}-${firstSegment.Airline.FlightNumber}-` +
        `${firstSegment.Origin.DepTime}-${lastSegment.Destination.ArrTime}-` +
        `${firstSegment.Origin.Airport.CityName}-${lastSegment.Destination.Airport.CityName}`;

      if (!map.has(key)) {
        map.set(key, {
          Segments: flight.Segments,
          Airline: firstSegment.Airline,
          Origin: firstSegment.Origin,
          Destination: lastSegment.Destination,
          FareOptions: [this.deepCopy(flight)],
          baseFarePerAdult: basePerAdult,
          taxPerAdult: taxPerAdult,
          price: totalPerAdult,
          logo: `assets/images/flightimages/${firstSegment.Airline.AirlineCode}.png`,
          isRefundable: flight.IsRefundable ?? false,
          airline: firstSegment.Airline.AirlineName,
          departure: firstSegment.Origin?.DepTime
            ? new Date(firstSegment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A',
          arrival: lastSegment.Destination?.ArrTime
            ? new Date(lastSegment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A'
        });
      } else {
        map.get(key).FareOptions.push(this.deepCopy(flight));
      }
    }

    return Array.from(map.values()).sort((a, b) => a.price - b.price);
  }

  // Utility function for deep copying objects and arrays
  deepCopy(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      const arrCopy: any[] = [];
      for (const item of obj) {
        arrCopy.push(this.deepCopy(item));
      }
      return arrCopy;
    }

    const objCopy: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        objCopy[key] = this.deepCopy(obj[key]);
      }
    }
    return objCopy;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.showFareDetailsTooltip) {
      this.showFareDetailsTooltip = false;
    }
    const target = event.target as HTMLElement;

    // Close passenger dropdown if clicking outside
    if (!target.closest('.passenger-dropdown-wrapper')) {
      this.showPassengerDropdown = false;
    }

    // Close city dropdowns when clicking outside
    const isClickInsideCitySelect = target.closest('.summary-section.city-select');
    const isClickInsideCitySuggestions = target.closest('.city-suggestions');

    if (!isClickInsideCitySelect && !isClickInsideCitySuggestions) {
      // Close and preserve previous value (already in flightInputData)
      if (this.editField === 'from') {
        this.editField = null;
        this.activeSuggestions['summary-from'] = [];
        // Value is already in flightInputData, so it will display correctly
      } else if (this.editField === 'to') {
        this.editField = null;
        this.activeSuggestions['summary-to'] = [];
        // Value is already in flightInputData, so it will display correctly
      }
    }

    // Close travelers panel when clicking outside
    const isClickInsideTravelersSection = target.closest('.summary-section.travelers-dropdown');
    const isClickInsideTravelersPanel = target.closest('.travelers-panel');

    if (!isClickInsideTravelersSection && !isClickInsideTravelersPanel) {
      if (this.editField === 'travellers' || this.isTravelersOpen) {
        this.isTravelersOpen = false;
        // Only reset editField if we're not in the middle of editing another field
        if (this.editField === 'travellers') {
          this.editField = null;
        }
      }
    }

    // Close calendar when clicking outside
    const isClickInsideDateSelect = target.closest('.summary-section.date-select');
    const isClickInsideCalendar = target.closest('app-custom-calendar');

    if (!isClickInsideDateSelect && !isClickInsideCalendar) {
      if (this.editField === 'departure') {
        this.editField = null;
      }
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isBrowser) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isHeaderSticky = scrollPosition > 50;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        if (this.scrollContainer && this.initialScrollIndex >= 0) {
          this.scheduleCenterDateCard(this.initialScrollIndex);
        }
        // If initial dates were computed before the view existed, center now.
        if (this.pendingCenterIndex >= 0) {
          const idx = this.pendingCenterIndex;
          this.pendingCenterIndex = -1;
          this.scheduleCenterDateCard(idx);
        }
        // Initialize round trip tab
        if (this.flightType === 'round') {
          this.activeTab = 'onward';
          this.updateUnderlineStyle();
        }
        // Scroll to top on mobile when page loads
        this.scrollToTop();
        // Initialize date slider arrows
        setTimeout(() => this.updateDateSliderArrows(), 300);
      });
    }
  }

  /**
   * Scrolls to top of the page
   */
  scrollToTop(): void {
    if (!this.isBrowser) return;

    // Use smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Also try document.documentElement and document.body for better compatibility
    setTimeout(() => {
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterContentChecked(): void {
    // Content checked
  }

  returnToHome(): void {
    this.router.navigate(['/']);
  }

  // Date slider methods
  scrollDates(direction: 'left' | 'right'): void {
    if (!this.isBrowser || !this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement as HTMLElement;
    const scrollAmount = 200;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // REQUIREMENT 5: When user clicks another date, reload page with selected date
  selectDateFromSlider(date: string, index: number): void {
    // Don't reload if clicking the already selected date
    if (date === this.highlightedDate) {
      return;
    }

    this.highlightedDate = date;
    this.flightInputData["departureDate"] = this.highlightedDate;
    this.loader = true;

    if (this.flightType === 'oneway') {
      this.apiService.getFlightDetailsOneWay(
        this.flightInputData['ipAddress'],
        this.flightInputData['tboToken'],
        this.flightInputData['adults'],
        this.flightInputData['children'],
        this.flightInputData['infants'],
        'oneWay',
        this.flightInputData['fromAirportCode'],
        this.flightInputData['toAirportCode'],
        this.flightInputData['travelClass'],
        this.highlightedDate,
        this.getFareTypeNumber(this.flightInputData['fareType'])
      ).subscribe({
        next: (val: any) => {
          console.log('Flight Data', val);
          this.traceid = val['Response']?.['TraceId'];
          if (val['Response']?.['Results']?.[0]) {
            this.finalFinalList = val['Response']['Results'][0].map((flight: any) => {
              const rules = flight.MiniFareRules?.[0] || [];
              return {
                ...flight,
                cancellationPolicy: rules.filter((r: any) => r.Type === 'Cancellation'),
                dateChangePolicy: rules.filter((r: any) => r.Type === 'Reissue')
              };
            });
            this.flightDetailsExpanded = new Array(this.finalFinalList.length).fill(false);
            this.activeTabs = new Array(this.finalFinalList.length).fill('flight');
            this.groupFlights();
            this.generateDynamicFilters();
            this.centerScrollToIndex(index);
          }
          this.loader = false;
          this.scrollToTop();
        },
        error: (error) => {
          console.error('Error fetching flights:', error);
          this.loader = false;
        }
      });
    }
  }

  prepareDatePricesFromCalendarMap(): void {
    if (this.flightType !== 'oneway' && this.flightType !== 'round') {
      this.initialScrollIndex = -1;
      return;
    }

    const selected = this.flightInputData['departureDate'];
    console.log('prepareDatePricesFromCalendarMap called', {
      calendarFareMapSize: this.calendarFareMap?.size || 0,
      flightType: this.flightType,
      selectedDate: selected,
      calendarFareMapType: this.calendarFareMap ? 'Map' : 'null',
      flightInputDataHasCalendar: !!this.flightInputData['calendarFareMap']
    });

    if (!this.calendarFareMap || this.calendarFareMap.size === 0) {
      console.log('Calendar fare map is empty or missing');
      // Try to re-initialize from flightInputData if available
      if (this.flightInputData['calendarFareMap']) {
        const calendarData = this.flightInputData['calendarFareMap'];
        console.log('Attempting to re-initialize calendar fare map from flightInputData', {
          type: typeof calendarData,
          isObject: typeof calendarData === 'object',
          keys: typeof calendarData === 'object' ? Object.keys(calendarData).length : 0
        });

        if (typeof calendarData === 'object' && calendarData !== null) {
          this.calendarFareMap = new Map(Object.entries(calendarData));
          console.log('Re-initialized calendar fare map, new size:', this.calendarFareMap.size);
        }
      }

      if (!this.calendarFareMap || this.calendarFareMap.size === 0) {
        console.log('Calendar fare map still empty after re-initialization attempt');
        return;
      }
    }

    // Convert Map entries to datePrices array format (matching working code structure)
    const sortedEntries = Array.from(this.calendarFareMap.entries())
      .map(([date, data]) => {
        // Handle both formats: {date, price, ...} or just {price, ...}
        return {
          date: data.date || date,
          price: data.price || 0,
          isLowest: data.isLowest || false,
          ...data
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('Total sorted entries:', sortedEntries.length);
    console.log('Sample entries:', sortedEntries.slice(0, 5).map(e => ({ date: e.date, price: e.price })));

    // REQUIREMENT 1 & 2: Show only dates which have prices (price > 0)
    // Store all available dates from calendar fare API
    this.allAvailableDates = sortedEntries.filter(item => item.price > 0);

    console.log('Filtered dates with prices:', this.allAvailableDates.length);
    console.log('Sample filtered dates:', this.allAvailableDates.slice(0, 10).map(e => ({ date: e.date, price: e.price })));

    if (this.allAvailableDates.length === 0) {
      console.warn('No dates with prices available');
      this.datePrices = [];
      return;
    }

    // REQUIREMENT 3: Use lazy loading - initially load only first batch of dates
    this.loadInitialDates(selected);

  }

  // REQUIREMENT 3: Lazy loading - load initial batch of dates
  loadInitialDates(selectedDate: string): void {
    if (this.allAvailableDates.length === 0) {
      this.datePrices = [];
      return;
    }

    // Find the selected date in all available dates
    let selectedIndex = this.allAvailableDates.findIndex(item => item.date === selectedDate);

    // If selected date not found, find the nearest date
    if (selectedIndex === -1) {
      const selectedTime = new Date(selectedDate).getTime();
      selectedIndex = this.allAvailableDates.findIndex((item, idx, arr) => {
        const currTime = new Date(item.date).getTime();
        const nextTime = arr[idx + 1] ? new Date(arr[idx + 1].date).getTime() : Infinity;
        return selectedTime >= currTime && selectedTime < nextTime;
      });
      // If still not found, default to first date
      if (selectedIndex === -1) {
        selectedIndex = 0;
      }
    }

    // REQUIREMENT 4: Load dates around selected date to center it
    // Calculate start and end indices for initial load
    const halfBatch = Math.floor(this.currentBatchSize / 2);
    let startIndex = Math.max(0, selectedIndex - halfBatch);
    let endIndex = Math.min(this.allAvailableDates.length, startIndex + this.currentBatchSize);

    // Adjust start if we're near the end
    if (endIndex === this.allAvailableDates.length) {
      startIndex = Math.max(0, endIndex - this.currentBatchSize);
    }

    // Load the initial batch
    this.datePrices = this.allAvailableDates.slice(startIndex, endIndex);

    // Set the highlighted date to the selected date or nearest available
    const actualSelectedDate = this.allAvailableDates[selectedIndex].date;
    this.highlightedDate = actualSelectedDate;

    // Find index in the visible datePrices array
    const visibleIndex = this.datePrices.findIndex(item => item.date === actualSelectedDate);
    this.initialScrollIndex = visibleIndex;

    console.log('Loaded initial batch:', {
      total: this.allAvailableDates.length,
      startIndex,
      endIndex,
      visibleCount: this.datePrices.length,
      selectedIndex,
      visibleIndex,
      highlightedDate: this.highlightedDate
    });

    // REQUIREMENT 4: Scroll to center selected date
    this.cdr.detectChanges();
    if (this.isBrowser && visibleIndex >= 0) {
      // IMPORTANT: on first page load Angular may already be "stable", so onStable(take(1))
      // may never fire again. Use a short retry schedule until date cards exist.
      this.scheduleCenterDateCard(visibleIndex);
    }
  }

  /**
   * Centers the given date-card index in the horizontal date slider.
   * Uses a short retry schedule so it works on initial render (desktop + mobile).
   */
  private scheduleCenterDateCard(index: number): void {
    if (!this.isBrowser || index < 0) return;

    // `loadInitialDates()` can run before ViewChild is available on initial load.
    // Store the request and it will be executed from `ngAfterViewInit()`.
    if (!this.scrollContainer) {
      this.pendingCenterIndex = index;
      return;
    }

    const attemptDelays = [0, 50, 150, 300, 600, 900];

    attemptDelays.forEach((delay, attempt) => {
      setTimeout(() => {
        if (!this.scrollContainer) return;

        const container = this.scrollContainer.nativeElement as HTMLElement;
        const cards = container?.querySelectorAll?.('.date-card');

        // Wait until the DOM for cards is ready
        if (!cards || !cards.length || !cards[index]) {
          return;
        }

        // Center and update arrows once we have a real card element
        this.centerScrollToIndex(index);
        setTimeout(() => this.updateDateSliderArrows(), 100);

        // Extra: on mobile layouts card widths can settle after images/fonts load
        if (attempt < 3) {
          setTimeout(() => this.centerScrollToIndex(index), 200);
        }
      }, delay);
    });
  }

  // REQUIREMENT 3: Load more dates when scrolling near the end
  loadMoreDates(direction: 'start' | 'end'): void {
    if (this.isLoadingMore || this.allAvailableDates.length === 0) {
      return;
    }

    this.isLoadingMore = true;

    const currentFirstDate = this.datePrices[0]?.date;
    const currentLastDate = this.datePrices[this.datePrices.length - 1]?.date;

    // Find indices in allAvailableDates
    const firstIndex = this.allAvailableDates.findIndex(d => d.date === currentFirstDate);
    const lastIndex = this.allAvailableDates.findIndex(d => d.date === currentLastDate);

    if (direction === 'start' && firstIndex > 0) {
      // Load previous dates
      const loadCount = Math.min(10, firstIndex); // Load 10 more or remaining
      const newDates = this.allAvailableDates.slice(firstIndex - loadCount, firstIndex);
      this.datePrices = [...newDates, ...this.datePrices];
      console.log('Loaded', loadCount, 'dates at start. Total now:', this.datePrices.length);

      // Adjust scroll position to maintain view
      if (this.isBrowser && this.scrollContainer) {
        setTimeout(() => {
          const container = this.scrollContainer.nativeElement as HTMLElement;
          const cards = container.querySelectorAll('.date-card');
          if (cards && cards[loadCount]) {
            const card = cards[loadCount] as HTMLElement;
            container.scrollLeft = card.offsetLeft - 100;
          }
        }, 50);
      }
    } else if (direction === 'end' && lastIndex < this.allAvailableDates.length - 1) {
      // Load next dates
      const remainingCount = this.allAvailableDates.length - lastIndex - 1;
      const loadCount = Math.min(10, remainingCount); // Load 10 more or remaining
      const newDates = this.allAvailableDates.slice(lastIndex + 1, lastIndex + 1 + loadCount);
      this.datePrices = [...this.datePrices, ...newDates];
      console.log('Loaded', loadCount, 'dates at end. Total now:', this.datePrices.length);
    }

    this.cdr.detectChanges();
    setTimeout(() => {
      this.updateDateSliderArrows();
      this.isLoadingMore = false;
    }, 100);
  }

  centerScrollToIndex(index: number, retryCount: number = 0): void {
    if (!this.isBrowser || !this.scrollContainer) {
      if (retryCount < 10) {
        setTimeout(() => this.centerScrollToIndex(index, retryCount + 1), 100);
      }
      return;
    }

    setTimeout(() => {
      const container = this.scrollContainer?.nativeElement as HTMLElement;
      if (!container) return;

      const cards = container.querySelectorAll('.date-card');
      if (!cards?.length || !cards[index]) return;

      const card = cards[index] as HTMLElement;
      const containerWidth = container.offsetWidth;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const middleOffset = containerWidth / 2 - cardWidth / 2;
      const totalCards = cards.length;

      if (index > 1 && index < totalCards - 2) {
        container.scrollTo({
          left: cardLeft - middleOffset,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          left: cardLeft - 16,
          behavior: 'smooth'
        });
      }
    }, 200);
  }

  // Date slider arrow navigation methods
  scrollDateSlider(direction: 'left' | 'right'): void {
    if (!this.isBrowser || !this.scrollContainer) return;

    const container = this.scrollContainer.nativeElement as HTMLElement;
    if (!container) return;

    const scrollAmount = 300; // Scroll by 300px per click
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (direction === 'left') {
      container.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: Math.min(maxScroll, currentScroll + scrollAmount),
        behavior: 'smooth'
      });
    }

    // Update arrow visibility after scroll
    setTimeout(() => this.updateDateSliderArrows(), 100);
  }

  onDateSliderScroll(): void {
    this.updateDateSliderArrows();

    // REQUIREMENT 3: Lazy loading - check if we need to load more dates
    if (!this.isBrowser || !this.scrollContainer || this.isLoadingMore) {
      return;
    }

    const container = this.scrollContainer.nativeElement as HTMLElement;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Calculate approximate visible date indices
    const cards = container.querySelectorAll('.date-card');
    if (!cards || cards.length === 0) return;

    const cardWidth = (cards[0] as HTMLElement).offsetWidth + 8; // Card width + gap
    const firstVisibleIndex = Math.floor(scrollLeft / cardWidth);
    const lastVisibleIndex = Math.min(
      this.datePrices.length - 1,
      Math.ceil((scrollLeft + clientWidth) / cardWidth)
    );

    // Load more if scrolling near the start (within 5 dates)
    if (firstVisibleIndex <= this.loadMoreThreshold && this.datePrices[0]) {
      const currentFirstDate = this.datePrices[0].date;
      const firstIndexInAll = this.allAvailableDates.findIndex(d => d.date === currentFirstDate);
      if (firstIndexInAll > 0) {
        this.loadMoreDates('start');
      }
    }

    // Load more if scrolling near the end (within 5 dates from end)
    if (lastVisibleIndex >= this.datePrices.length - this.loadMoreThreshold && this.datePrices[this.datePrices.length - 1]) {
      const currentLastDate = this.datePrices[this.datePrices.length - 1].date;
      const lastIndexInAll = this.allAvailableDates.findIndex(d => d.date === currentLastDate);
      if (lastIndexInAll < this.allAvailableDates.length - 1) {
        this.loadMoreDates('end');
      }
    }
  }

  updateDateSliderArrows(): void {
    if (!this.isBrowser || !this.scrollContainer) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }

    const container = this.scrollContainer.nativeElement as HTMLElement;
    if (!container) {
      this.canScrollLeft = false;
      this.canScrollRight = false;
      return;
    }

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    // Show left arrow if not at the start
    this.canScrollLeft = scrollLeft > 10; // 10px threshold for smooth UX

    // Show right arrow if not at the end
    this.canScrollRight = scrollLeft < maxScroll - 10; // 10px threshold for smooth UX

    this.cdr.detectChanges();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isBrowser) {
      setTimeout(() => this.updateDateSliderArrows(), 100);
    }
  }

  // Flight grouping and filtering methods
  groupFlights(): void {
    console.log('groupFlights called, finalFinalList length:', this.finalFinalList?.length || 0);

    if (!this.finalFinalList || this.finalFinalList.length === 0) {
      console.warn('finalFinalList is empty or undefined');
      this.groupedFlights = [];
      this.originalGroupedFlights = [];
      return;
    }

    const map = new Map<string, any>();
    for (const flight of this.finalFinalList) {
      try {
        const firstSegment = flight.Segments[0][0];
        const lastSegment = flight.Segments[0][flight.Segments[0].length - 1];

        let basePerAdult = 0;
        let taxPerAdult = 0;
        let totalPerAdult = 0;
        const adultFare = flight.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
        if (adultFare && adultFare.PassengerCount > 0) {
          basePerAdult = adultFare.BaseFare / adultFare.PassengerCount;
          taxPerAdult = adultFare.Tax / adultFare.PassengerCount;
          totalPerAdult = basePerAdult + taxPerAdult;
        }

        const key = `${firstSegment.Airline.AirlineCode}-${firstSegment.Airline.FlightNumber}-` +
          `${firstSegment.Origin.DepTime}-${lastSegment.Destination.ArrTime}-` +
          `${firstSegment.Origin.Airport.CityName}-${lastSegment.Destination.Airport.CityName}`;

        if (!map.has(key)) {
          map.set(key, {
            Segments: flight.Segments,
            Airline: firstSegment.Airline,
            Origin: firstSegment.Origin,
            Destination: lastSegment.Destination,
            FareOptions: [flight],
            baseFarePerAdult: basePerAdult,
            taxPerAdult: taxPerAdult,
            price: totalPerAdult,
            logo: `assets/images/flightimages/${firstSegment.Airline.AirlineCode}.png`,
            isRefundable: flight.IsRefundable ?? false,
            airline: firstSegment.Airline.AirlineName,
            departure: firstSegment.Origin?.DepTime
              ? new Date(firstSegment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'N/A',
            arrival: lastSegment.Destination?.ArrTime
              ? new Date(lastSegment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'N/A'
          });
        } else {
          map.get(key).FareOptions.push(flight);
        }
      } catch (error) {
        console.error('Error grouping flight:', error, flight);
      }
    }

    this.groupedFlights = Array.from(map.values());
    // Store original before any filters are applied
    this.originalGroupedFlights = [...this.groupedFlights];

    if (this.groupedFlights.length > 0) {
      this.selectedOutbound = this.groupedFlights[0];
      console.log('Grouped flights successfully:', this.groupedFlights.length, 'flights');
    } else {
      console.warn('No flights after grouping');
    }
    console.log("Group Flights Result:", this.groupedFlights);
  }

  groupFlightsOutbound(): void {
    console.log('groupFlightsOutbound called, finalFinalListOutbound length:', this.finalFinalListOutbound?.length || 0);

    if (!this.finalFinalListOutbound || this.finalFinalListOutbound.length === 0) {
      console.warn('finalFinalListOutbound is empty or undefined');
      this.groupedFlightsOutbound = [];
      this.originalGroupedFlightsOutbound = [];
      return;
    }

    const map = new Map<string, any>();
    for (const flight of this.finalFinalListOutbound) {
      try {
        const firstSegment = flight.Segments[0][0];
        const lastSegment = flight.Segments[0][flight.Segments[0].length - 1];

        let basePerAdult = 0;
        let taxPerAdult = 0;
        let totalPerAdult = 0;
        const adultFare = flight.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
        if (adultFare && adultFare.PassengerCount > 0) {
          basePerAdult = adultFare.BaseFare / adultFare.PassengerCount;
          taxPerAdult = adultFare.Tax / adultFare.PassengerCount;
          totalPerAdult = basePerAdult + taxPerAdult;
        }

        const key = `${firstSegment.Airline.AirlineCode}-${firstSegment.Airline.FlightNumber}-` +
          `${firstSegment.Origin.DepTime}-${lastSegment.Destination.ArrTime}-` +
          `${firstSegment.Origin.Airport.CityName}-${lastSegment.Destination.Airport.CityName}`;

        if (!map.has(key)) {
          map.set(key, {
            Segments: flight.Segments,
            Airline: firstSegment.Airline,
            Origin: firstSegment.Origin,
            Destination: lastSegment.Destination,
            FareOptions: [flight],
            baseFarePerAdult: basePerAdult,
            taxPerAdult: taxPerAdult,
            price: totalPerAdult,
            logo: `assets/images/flightimages/${firstSegment.Airline.AirlineCode}.png`,
            isRefundable: flight.IsRefundable ?? false,
            airline: firstSegment.Airline.AirlineName,
            departure: firstSegment.Origin?.DepTime
              ? new Date(firstSegment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'N/A',
            arrival: lastSegment.Destination?.ArrTime
              ? new Date(lastSegment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'N/A'
          });
        } else {
          map.get(key).FareOptions.push(flight);
        }
      } catch (error) {
        console.error('Error grouping outbound flight:', error, flight);
      }
    }

    this.groupedFlightsOutbound = Array.from(map.values());
    // Store original before any filters are applied
    this.originalGroupedFlightsOutbound = [...this.groupedFlightsOutbound];

    if (this.groupedFlightsOutbound.length > 0) {
      this.selectedReturn = this.groupedFlightsOutbound[0];
      console.log('Grouped outbound flights successfully:', this.groupedFlightsOutbound.length, 'flights');
    } else {
      console.warn('No outbound flights after grouping');
    }
    console.log("Group Flights Outbound Result:", this.groupedFlightsOutbound);
  }

  generateDynamicFilters(): void {
    const allFlights = [...this.groupedFlights, ...this.groupedFlightsOutbound];
    const airlineSet = new Set<string>();
    const stopSet = new Set<number>();
    let prices: number[] = [];

    for (const flight of allFlights) {
      if (flight.airline) {
        airlineSet.add(flight.airline);
      }
      if (flight.Segments?.[0]) {
        const numStops = flight.Segments[0].length - 1;
        stopSet.add(numStops);
      }
      if (flight.price) {
        prices.push(flight.price);
      }
    }

    this.dynamicFilters = {
      airlines: Array.from(airlineSet).sort(),
      stops: Array.from(stopSet).sort((a, b) => a - b),
      min_price: prices.length > 0 ? Math.min(...prices) : 0,
      max_price: prices.length > 0 ? Math.max(...prices) : 0
    };

    this.priceRange = this.dynamicFilters.max_price;
  }

  generateFiltersFromFlightArray(flights: any[]): any {
    const airlineSet = new Set<string>();
    const stopSet = new Set<number>();
    const prices: number[] = [];

    for (const flight of flights) {
      // Extract airline - check both flight.airline and Segments structure
      if (flight.airline) {
        airlineSet.add(flight.airline);
      } else if (flight.Segments?.[0]?.[0]?.Airline?.AirlineName) {
        airlineSet.add(flight.Segments[0][0].Airline.AirlineName);
      }

      if (flight.Segments?.[0]) {
        const stops = flight.Segments[0].length - 1;
        stopSet.add(stops);
      }
      if (flight.price) prices.push(flight.price);
    }

    return {
      airlines: Array.from(airlineSet).sort(),
      stops: Array.from(stopSet).sort((a, b) => a - b),
      min_price: prices.length > 0 ? Math.min(...prices) : 0,
      max_price: prices.length > 0 ? Math.max(...prices) : 0,
    };
  }

  generateRoundtripDynamicFilters(): void {
    console.log('generateRoundtripDynamicFilters called');
    console.log('groupedFlights length:', this.groupedFlights?.length || 0);
    console.log('groupedFlightsOutbound length:', this.groupedFlightsOutbound?.length || 0);

    // Ensure original arrays are backed up (but don't overwrite if already set)
    if (!this.originalGroupedFlights || this.originalGroupedFlights.length === 0) {
      if (this.groupedFlights && this.groupedFlights.length > 0) {
        this.originalGroupedFlights = [...this.groupedFlights];
        console.log('Backed up originalGroupedFlights:', this.originalGroupedFlights.length);
      }
    }
    if (!this.originalGroupedFlightsOutbound || this.originalGroupedFlightsOutbound.length === 0) {
      if (this.groupedFlightsOutbound && this.groupedFlightsOutbound.length > 0) {
        this.originalGroupedFlightsOutbound = [...this.groupedFlightsOutbound];
        console.log('Backed up originalGroupedFlightsOutbound:', this.originalGroupedFlightsOutbound.length);
      }
    }

    this.roundtripDynamicFiltersOnward = this.generateFiltersFromFlightArray(this.originalGroupedFlights || this.groupedFlights);
    this.roundtripDynamicFiltersReturn = this.generateFiltersFromFlightArray(this.originalGroupedFlightsOutbound || this.groupedFlightsOutbound);
    this.roundtripPriceRangeOnward = this.roundtripDynamicFiltersOnward.max_price;
    this.roundtripPriceRangeReturn = this.roundtripDynamicFiltersReturn.max_price;

    console.log('Onward filters:', this.roundtripDynamicFiltersOnward);
    console.log('Return filters:', this.roundtripDynamicFiltersReturn);
  }

  // Filter methods
  onPriceChange(): void {
    this.applyAllFilters();
  }

  onAirlineFilterChange(event: any): void {
    const airline = event.target.value;
    if (event.target.checked) {
      this.selectedAirlines.push(airline);
    } else {
      this.selectedAirlines = this.selectedAirlines.filter(a => a !== airline);
    }
    this.applyAllFilters();
  }

  onStopFilterChange(event: any): void {
    const stop = +event.target.value;
    if (event.target.checked) {
      this.selectedStops.push(stop);
    } else {
      this.selectedStops = this.selectedStops.filter(s => s !== stop);
    }
    this.applyAllFilters();
  }

  toggleDepartureSlot(label: string | undefined): void {
    if (!label) return;
    if (this.selectedDepartureSlots.has(label)) {
      this.selectedDepartureSlots.delete(label);
    } else {
      this.selectedDepartureSlots.add(label);
    }
    this.applyAllFilters();
  }

  toggleNonStopFilter(): void {
    if (this.selectedStops.includes(0)) {
      this.selectedStops = this.selectedStops.filter(s => s !== 0);
    } else {
      this.selectedStops.push(0);
    }
    this.applyAllFilters();
  }

  toggleRefundableFilter(): void {
    this.showRefundableOnly = !this.showRefundableOnly;
    this.applyMobileFilters();
  }

  openDatePicker(): void {
    // Open date picker modal or trigger date selection
    // This can be implemented based on your date picker component
  }

  getStopsCount(flight: any): number {
    return flight.Segments?.[0]?.length > 0 ? flight.Segments[0].length - 1 : 0;
  }

  getLayoverCity(flight: any): string {
    if (flight.Segments?.[0]?.length > 1) {
      const segments = flight.Segments[0];
      return segments
        .slice(0, segments.length - 1)
        .map((s: any) => s.Destination.Airport.CityName)
        .join(', ');
    }
    return '';
  }

  getLayoverInfos(flight: any): any[] {
    const infos = [];
    // Handle both one-way segment structure and potentially others if generic
    // Usually flight.Segments[0] is the main segment group for display in the main card
    const segments = flight.Segments?.[0];

    if (segments && segments.length > 1) {
      for (let i = 0; i < segments.length - 1; i++) {
        const seg1 = segments[i];
        const seg2 = segments[i + 1];

        // Calculate layover duration
        const arr = new Date(seg1.Destination.ArrTime);
        const dep = new Date(seg2.Origin.DepTime);
        const diffMs = dep.getTime() - arr.getTime();
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        let durationStr = '';
        if (hrs > 0) durationStr += `${hrs} hrs `;
        if (mins > 0 || hrs === 0) durationStr += `${mins} mins`;

        infos.push({
          city: seg1.Destination.Airport.CityName,
          code: seg1.Destination.Airport.AirportCode,
          duration: durationStr.trim()
        });
      }
    }
    return infos;
  }

  // Helper methods for multi-city desktop layout
  hoveredMultiCityIndex: string = '';

  getProductiveLayoverCity(segments: any[]): string {
    if (segments && segments.length > 1) {
      return segments
        .slice(0, segments.length - 1)
        .map((s: any) => s.Destination.Airport.CityName)
        .join(', ');
    }
    return '';
  }

  getLayoverInfosForGroup(segments: any[]): any[] {
    const infos = [];
    if (segments && segments.length > 1) {
      for (let i = 0; i < segments.length - 1; i++) {
        const seg1 = segments[i];
        const seg2 = segments[i + 1];

        // Calculate layover duration
        const arr = new Date(seg1.Destination.ArrTime);
        const dep = new Date(seg2.Origin.DepTime);
        const diffMs = dep.getTime() - arr.getTime();
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        let durationStr = '';
        if (hrs > 0) durationStr += `${hrs} hrs `;
        if (mins > 0 || hrs === 0) durationStr += `${mins} mins`;

        infos.push({
          city: seg1.Destination.Airport.CityName,
          code: seg1.Destination.Airport.AirportCode,
          duration: durationStr.trim()
        });
      }
    }
    return infos;
  }

  getLastSegmentArrivalTime(flight: any, tabIndex: number): Date {
    const segments = flight.Segments?.[tabIndex] || flight.Segments?.[0] || [];
    if (!Array.isArray(segments) || segments.length === 0) {
      return new Date();
    }
    const lastSegment = Array.isArray(segments[segments.length - 1])
      ? segments[segments.length - 1]
      : segments[segments.length - 1];
    return lastSegment?.Destination?.ArrTime ? new Date(lastSegment.Destination.ArrTime) : new Date();
  }

  getLastSegmentDestination(flight: any, tabIndex: number): any {
    const segments = flight.Segments?.[tabIndex] || flight.Segments?.[0] || [];
    if (!Array.isArray(segments) || segments.length === 0) {
      return { ArrTime: new Date(), Airport: { CityName: '' } };
    }
    const lastSegment = Array.isArray(segments[segments.length - 1])
      ? segments[segments.length - 1]
      : segments[segments.length - 1];
    return lastSegment?.Destination || { ArrTime: new Date(), Airport: { CityName: '' } };
  }

  // Helper method to check if value is array (for template use)
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // Helper method to normalize group to array
  normalizeGroupToArray(group: any): any[] {
    return Array.isArray(group) ? group : [group];
  }

  // Helper method to get day difference for multi-city
  getDayDiffForMultiCity(flight: any, tabIndex: number): number {
    const depTime = flight.Segments?.[tabIndex]?.[0]?.[0]?.Origin?.DepTime || flight.Segments?.[0]?.[0]?.Origin?.DepTime;
    const arrTime = this.getLastSegmentArrivalTime(flight, tabIndex);
    if (!depTime || !arrTime) return 0;
    const depTimeStr = depTime instanceof Date ? depTime.toISOString() : (typeof depTime === 'string' ? depTime : new Date(depTime).toISOString());
    const arrTimeStr = arrTime instanceof Date ? arrTime.toISOString() : (typeof arrTime === 'string' ? arrTime : new Date(arrTime).toISOString());
    return this.getDayDiff(depTimeStr, arrTimeStr);
  }

  applyAllFilters(): void {
    // Handle multi-city filtering
    if (this.flightType === 'multi' && this.multicityTabData && this.multicityTabData.length > 0) {
      // Ensure we have original data backed up - check if backup exists and has data
      if (!this.originalMulticityTabData || this.originalMulticityTabData.length === 0 ||
        !this.originalMulticityTabData[0]?.groupedFlights ||
        this.originalMulticityTabData[0].groupedFlights.length === 0) {
        if (this.multicityTabData && this.multicityTabData.length > 0 &&
          this.multicityTabData[0]?.groupedFlights &&
          this.multicityTabData[0].groupedFlights.length > 0) {
          // Create a deep copy of the original data
          this.originalMulticityTabData = this.multicityTabData.map(tab => ({
            ...tab,
            groupedFlights: [...(tab.groupedFlights || [])]
          }));
        } else {
          console.warn('No multi-city flights to filter');
          return;
        }
      }

      console.log('Applying filters to multi-city flights. Original flights count:',
        this.originalMulticityTabData[0]?.groupedFlights?.length || 0);
      console.log('Selected airlines:', this.selectedAirlines);
      console.log('Selected stops:', this.selectedStops);
      console.log('Price range:', this.dynamicFilters.min_price, '-', this.priceRange);

      // Apply filters to each segment's groupedFlights
      this.multicityTabData.forEach((tab, tabIndex) => {
        const originalFlights = this.originalMulticityTabData[tabIndex]?.groupedFlights || [];

        tab.groupedFlights = originalFlights.filter((flight: any) => {
          // Get airline from first segment of first segment group
          const airlineName = (flight.Segments?.[0]?.[0]?.Airline?.AirlineName || flight.airline || '').trim();
          const airlineMatch = this.selectedAirlines.length === 0 ||
            this.selectedAirlines.some(selected => selected.trim() === airlineName);

          // Get stops count - for multi-city, check stops in the first segment group
          const stopsCount = this.getStopsCount(flight);
          const stopsMatch = this.selectedStops.length === 0 ||
            this.selectedStops.includes(stopsCount);

          // Price match
          const priceMatch = flight.price >= this.dynamicFilters.min_price &&
            flight.price <= this.priceRange;

          // Get departure time from first segment of first segment group
          const depTime = flight.Segments?.[0]?.[0]?.Origin?.DepTime || flight.Origin?.DepTime;
          const depHour = depTime ? new Date(depTime).getHours() : -1;
          const timeSlotMatch = this.selectedDepartureSlots.size === 0 ||
            depHour === -1 ||
            this.departureTimeSlots.some(slot =>
              this.selectedDepartureSlots.has(slot.label) &&
              depHour >= slot.range[0] &&
              depHour < slot.range[1]
            );

          // Refundability match
          const refundabilityMatch =
            this.selectedRefundability.size === 0 ||
            (flight.isRefundable && this.selectedRefundability.has('refundable')) ||
            (!flight.isRefundable && this.selectedRefundability.has('non-refundable'));

          const matches = airlineMatch && stopsMatch && priceMatch && timeSlotMatch && refundabilityMatch;
          if (!matches) {
            console.log('Flight filtered out:', {
              airline: airlineName,
              airlineMatch,
              stopsCount,
              stopsMatch,
              price: flight.price,
              priceMatch,
              depHour,
              timeSlotMatch,
              isRefundable: flight.isRefundable,
              refundabilityMatch
            });
          }
          return matches;
        });
      });

      console.log('After filtering multi-city:', this.multicityTabData[0]?.groupedFlights?.length || 0, 'flights remain');
      return;
    }

    // Handle one-way and round-trip filtering
    // Ensure we have original data backed up
    if (!this.originalGroupedFlights || this.originalGroupedFlights.length === 0) {
      if (this.groupedFlights && this.groupedFlights.length > 0) {
        this.originalGroupedFlights = [...this.groupedFlights];
      } else {
        console.warn('No flights to filter');
        return;
      }
    }

    console.log('Applying filters. Original flights count:', this.originalGroupedFlights.length);

    this.groupedFlights = this.originalGroupedFlights.filter(flight => {
      const airlineMatch = this.selectedAirlines.length === 0 ||
        this.selectedAirlines.includes(flight.airline);

      const stopsMatch = this.selectedStops.length === 0 ||
        this.selectedStops.includes(this.getStopsCount(flight));

      const priceMatch = flight.price >= this.dynamicFilters.min_price &&
        flight.price <= this.priceRange;

      const depHour = new Date(flight.Origin.DepTime).getHours();
      const timeSlotMatch = this.selectedDepartureSlots.size === 0 ||
        this.departureTimeSlots.some(slot =>
          this.selectedDepartureSlots.has(slot.label) &&
          depHour >= slot.range[0] &&
          depHour < slot.range[1]
        );

      const refundabilityMatch =
        this.selectedRefundability.size === 0 ||
        (flight.isRefundable && this.selectedRefundability.has('refundable')) ||
        (!flight.isRefundable && this.selectedRefundability.has('non-refundable'));

      return airlineMatch && stopsMatch && priceMatch && timeSlotMatch && refundabilityMatch;
    });

    console.log('After filtering:', this.groupedFlights.length, 'flights remain');
  }

  // Mobile Filter Methods
  clearAllFilters(): void {
    this.selectedAirlines = [];
    this.selectedStops = [];
    this.selectedDepartureSlots.clear();
    this.showRefundableOnly = false;
    this.selectedRefundability.clear();

    // Reset price range based on flight type
    if (this.flightType === 'multi' && this.multicityTabData && this.multicityTabData.length > 0) {
      this.priceRange = this.dynamicFilters.max_price;
    } else {
      this.priceRange = this.dynamicFilters.max_price;
    }

    this.applyAllFilters();
  }

  applyMobileFilters(): void {
    // Update refundability filter based on showRefundableOnly
    this.selectedRefundability.clear();
    if (this.showRefundableOnly) {
      this.selectedRefundability.add('refundable');
    }

    this.applyAllFilters();
    this.applySort();
    this.showMobileFilter = false;
  }

  applySort(): void {
    // Handle multi-city sorting
    if (this.flightType === 'multi' && this.multicityTabData && this.multicityTabData.length > 0) {
      const flightsToSort = this.multicityTabData[0]?.groupedFlights;
      if (!flightsToSort || flightsToSort.length === 0) return;

      switch (this.selectedSort) {
        case 'Price: Low to High':
          flightsToSort.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
          break;
        case 'Price: High to Low':
          flightsToSort.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
          break;
        case 'Duration: Shortest':
          flightsToSort.sort((a: any, b: any) => {
            const durA = this.getTotalDurationMinutes(a.Segments?.[0] || []);
            const durB = this.getTotalDurationMinutes(b.Segments?.[0] || []);
            return durA - durB;
          });
          break;
        case 'Departure: Early':
          flightsToSort.sort((a: any, b: any) => {
            const timeA = a.Segments?.[0]?.[0]?.Origin?.DepTime
              ? new Date(a.Segments[0][0].Origin.DepTime).getTime()
              : 0;
            const timeB = b.Segments?.[0]?.[0]?.Origin?.DepTime
              ? new Date(b.Segments[0][0].Origin.DepTime).getTime()
              : 0;
            return timeA - timeB;
          });
          break;
        case 'Departure: Late':
          flightsToSort.sort((a: any, b: any) => {
            const timeA = a.Segments?.[0]?.[0]?.Origin?.DepTime
              ? new Date(a.Segments[0][0].Origin.DepTime).getTime()
              : 0;
            const timeB = b.Segments?.[0]?.[0]?.Origin?.DepTime
              ? new Date(b.Segments[0][0].Origin.DepTime).getTime()
              : 0;
            return timeB - timeA;
          });
          break;
      }
      return;
    }

    // Handle one-way and round-trip sorting
    if (!this.groupedFlights || this.groupedFlights.length === 0) return;

    switch (this.selectedSort) {
      case 'Price: Low to High':
        this.groupedFlights.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'Price: High to Low':
        this.groupedFlights.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'Duration: Shortest':
        this.groupedFlights.sort((a, b) => {
          const durA = this.getTotalDurationMinutes(a.Segments[0]);
          const durB = this.getTotalDurationMinutes(b.Segments[0]);
          return durA - durB;
        });
        break;
      case 'Departure: Early':
        this.groupedFlights.sort((a, b) => {
          const timeA = new Date(a.Segments[0][0].Origin.DepTime).getTime();
          const timeB = new Date(b.Segments[0][0].Origin.DepTime).getTime();
          return timeA - timeB;
        });
        break;
      case 'Departure: Late':
        this.groupedFlights.sort((a, b) => {
          const timeA = new Date(a.Segments[0][0].Origin.DepTime).getTime();
          const timeB = new Date(b.Segments[0][0].Origin.DepTime).getTime();
          return timeB - timeA;
        });
        break;
    }
  }

  /**
   * Returns count of flights for the currently visible list (used in mobile "flights found" pill).
   */
  getMobileVisibleFlightsCount(): number {
    // One-way: use groupedFlights
    if (this.flightType === 'oneway') {
      return this.groupedFlights?.length || 0;
    }

    // Round trip: respect activeTab (onward / return)
    if (this.flightType === 'round') {
      if (this.activeTab === 'return') {
        return this.groupedFlightsOutbound?.length || 0;
      }
      return this.groupedFlights?.length || 0;
    }

    // Multi-city: use current tab's grouped flights if available
    if (this.flightType === 'multi') {
      const currentTab = this.multicityTabData?.[this.selectedMulticityTab];
      return currentTab?.groupedFlights?.length || 0;
    }

    return 0;
  }

  getTotalDurationMinutes(segments: any[]): number {
    return segments.reduce((total, seg) => total + (seg.Duration || 0), 0);
  }

  // Roundtrip filter methods
  roundtripToggleDepartureSlot(label: string, type: 'onward' | 'return'): void {
    const target = type === 'onward' ? this.roundtripSelectedDepartureSlotsOnward : this.roundtripSelectedDepartureSlotsReturn;
    target.has(label) ? target.delete(label) : target.add(label);
    this.roundtripApplyAllFilters();
  }

  roundtripSelectAllDepartureSlots(type: 'onward' | 'return'): void {
    const target = type === 'onward' ? this.roundtripSelectedDepartureSlotsOnward : this.roundtripSelectedDepartureSlotsReturn;
    this.departureTimeSlots.forEach(slot => target.add(slot.label));
    this.roundtripApplyAllFilters();
  }

  roundtripResetDepartureSlots(type: 'onward' | 'return'): void {
    const target = type === 'onward' ? this.roundtripSelectedDepartureSlotsOnward : this.roundtripSelectedDepartureSlotsReturn;
    target.clear();
    this.roundtripApplyAllFilters();
  }

  roundtripOnAirlineFilterChange(event: any, type: 'onward' | 'return'): void {
    const airline = event.target.value;
    const list = type === 'onward' ? this.roundtripSelectedAirlinesOnward : this.roundtripSelectedAirlinesReturn;
    if (event.target.checked) list.push(airline);
    else list.splice(list.indexOf(airline), 1);
    this.roundtripApplyAllFilters();
  }

  roundtripSelectAllAirlines(type: 'onward' | 'return'): void {
    const all = type === 'onward' ? [...this.roundtripDynamicFiltersOnward.airlines] : [...this.roundtripDynamicFiltersReturn.airlines];
    if (type === 'onward') this.roundtripSelectedAirlinesOnward = all;
    else this.roundtripSelectedAirlinesReturn = all;
    this.roundtripApplyAllFilters();
  }

  roundtripResetAirlines(type: 'onward' | 'return'): void {
    if (type === 'onward') this.roundtripSelectedAirlinesOnward = [];
    else this.roundtripSelectedAirlinesReturn = [];
    this.roundtripApplyAllFilters();
  }

  roundtripOnStopFilterChange(event: any, type: 'onward' | 'return'): void {
    const stop = +event.target.value;
    const list = type === 'onward' ? this.roundtripSelectedStopsOnward : this.roundtripSelectedStopsReturn;
    if (event.target.checked) list.push(stop);
    else list.splice(list.indexOf(stop), 1);
    this.roundtripApplyAllFilters();
  }

  roundtripSelectAllStops(type: 'onward' | 'return'): void {
    const all = type === 'onward' ? [...this.roundtripDynamicFiltersOnward.stops] : [...this.roundtripDynamicFiltersReturn.stops];
    if (type === 'onward') this.roundtripSelectedStopsOnward = all;
    else this.roundtripSelectedStopsReturn = all;
    this.roundtripApplyAllFilters();
  }

  roundtripResetStops(type: 'onward' | 'return'): void {
    if (type === 'onward') this.roundtripSelectedStopsOnward = [];
    else this.roundtripSelectedStopsReturn = [];
    this.roundtripApplyAllFilters();
  }

  roundtripOnPriceChange(type: 'onward' | 'return'): void {
    this.roundtripApplyAllFilters();
  }

  selectAllRefundability(type: 'onward' | 'return'): void {
    if (type === 'onward') {
      this.showRefundableOnward = true;
      this.showNonRefundableOnward = true;
    } else {
      this.showRefundableReturn = true;
      this.showNonRefundableReturn = true;
    }
    this.roundtripApplyAllFilters();
  }

  resetRefundability(type: 'onward' | 'return'): void {
    if (type === 'onward') {
      this.showRefundableOnward = false;
      this.showNonRefundableOnward = false;
    } else {
      this.showRefundableReturn = false;
      this.showNonRefundableReturn = false;
    }
    this.roundtripApplyAllFilters();
  }

  roundtripApplyAllFilters(): void {
    const apply = (
      list: any[],
      airlines: string[],
      stops: number[],
      maxPrice: number,
      slots: Set<string>,
      refundFilter: { showRefundable: boolean; showNonRefundable: boolean }
    ) =>
      list.filter(f => {
        const airlineOk = !airlines.length || airlines.includes(f.airline);
        const stopsOk = !stops.length || stops.includes(this.getStopsCount(f));
        const priceOk = f.price <= maxPrice;
        const hour = new Date(f.Origin.DepTime).getHours();
        const timeOk = !slots.size || this.departureTimeSlots.some(s => slots.has(s.label) && hour >= s.range[0] && hour < s.range[1]);
        const refundOk =
          (f.isRefundable && refundFilter.showRefundable) ||
          (!f.isRefundable && refundFilter.showNonRefundable);
        return airlineOk && stopsOk && priceOk && timeOk && refundOk;
      });

    this.groupedFlights = apply(
      this.originalGroupedFlights,
      this.roundtripSelectedAirlinesOnward,
      this.roundtripSelectedStopsOnward,
      this.roundtripPriceRangeOnward,
      this.roundtripSelectedDepartureSlotsOnward,
      {
        showRefundable: this.showRefundableOnward,
        showNonRefundable: this.showNonRefundableOnward
      }
    );

    this.groupedFlightsOutbound = apply(
      this.originalGroupedFlightsOutbound,
      this.roundtripSelectedAirlinesReturn,
      this.roundtripSelectedStopsReturn,
      this.roundtripPriceRangeReturn,
      this.roundtripSelectedDepartureSlotsReturn,
      {
        showRefundable: this.showRefundableReturn,
        showNonRefundable: this.showNonRefundableReturn
      }
    );
  }

  onRefundabilityChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedRefundability.add(value);
    } else {
      this.selectedRefundability.delete(value);
    }
    this.applyAllFilters();
  }

  // Flight details methods
  toggleCardExpansion(index: number, event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;

      // ❌ Ignore OTHER buttons
      if (
        target.closest('.btn') ||
        target.closest('.dropdown')
      ) {
        return;
      }

      // ✅ Allow ONLY this button
      if (target.closest('button') && !target.closest('.expand-card-btn')) {
        return;
      }

      event.stopPropagation();
    }

    // Determine which list to use based on active tab
    let currentList = this.groupedFlights;
    if (this.flightType === 'round' && this.activeTab === 'return') {
      currentList = this.groupedFlightsOutbound;
    }

    // Close others, toggle current
    this.flightDetailsExpanded = this.flightDetailsExpanded.map(
      (_, i) => i === index ? !this.flightDetailsExpanded[i] : false
    );

    this.farePanelExpanded[index] = false;

    if (this.flightDetailsExpanded[index] && currentList?.[index]) {
      const flight = currentList[index];
      this.activeTabs[index] = 'flight';

      if (flight.FareOptions?.length) {
        const lowestFare = flight.FareOptions.reduce((a: any, b: any) => {
          const fareA = a?.Fare?.PublishedFare ?? Number.MAX_SAFE_INTEGER;
          const fareB = b?.Fare?.PublishedFare ?? Number.MAX_SAFE_INTEGER;
          return fareA < fareB ? a : b;
        });
        this.selectedFareOptions[index] = lowestFare;
      }
    }
  }

  toggleDetails(index: number): void {
    this.flightDetailsExpanded = this.flightDetailsExpanded.map((_, i) => i === index ? !this.flightDetailsExpanded[i] : false);
    this.farePanelExpanded[index] = false;
  }

  toggleDetailsoneway(index: number, flight: any): void {
    this.flightDetailsExpanded[index] = !this.flightDetailsExpanded[index];
    if (this.flightDetailsExpanded[index]) {
      this.activeTabs[index] = 'flight';

      // Find and set the lowest fare option for this flight
      if (flight.FareOptions && flight.FareOptions.length > 0) {
        const lowestFare = flight.FareOptions.reduce((a: any, b: any) => {
          const fareA = a?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
          const fareB = b?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
          return fareA < fareB ? a : b;
        });
        this.selectedFareOptions[index] = lowestFare;
        console.log('Selected lowest fare for flight', index, ':', lowestFare?.Fare?.PublishedFare);
      } else {
        console.warn('No fare options available for flight', index);
      }
    }
  }

  selectTab(index: number, tabId: string): void {
    this.activeTabs[index] = tabId;
  }

  // Fare options modal
  openFareOptionsModal(flight: any): void {
    // Check if mobile viewport
    if (this.isBrowser && window.innerWidth <= 767) {
      // Show mobile popup instead
      this.selectedFlightForMobile = flight;
      this.showMobileFarePopup = true;
    } else {
      // Desktop modal
      this.selectedFlight = flight;
      this.showFareModal = true;
    }
    console.log("Selected flight for fare options:", this.selectedFlight || this.selectedFlightForMobile);
    console.log("Available fare options:", (this.selectedFlight || this.selectedFlightForMobile)?.FareOptions?.length || 0);
  }

  // Mobile fare popup methods
  openMobileFarePopup(flight: any): void {
    this.selectedFlightForMobile = flight;
    this.showMobileFarePopup = true;
  }

  closeMobileFarePopup(): void {
    this.selectedFlightForMobile = null;
    this.showMobileFarePopup = false;
  }

  closeFareOptionsModal(): void {
    this.selectedFlight = null;
    this.showFareModal = false;
  }

  scrollFareCards(direction: 'left' | 'right'): void {
    if (!this.isBrowser || !this.fareScrollContainer) return;
    const el = this.fareScrollContainer.nativeElement;
    const scrollAmount = 300;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  // Temporary storage for flight being viewed in modal (not yet selected)
  tempFlightForModal: any = null;
  tempFlightIndex: number = -1;
  tempFlightType: 'onward' | 'return' | null = null;

  // Both-way methods - for opening modal (don't set selectedOutbound until BOOK NOW is clicked)
  openFareOptionsModalForRoundTrip(flight: any, index: number, type: 'onward' | 'return'): void {
    // Set selectedFlight for modal (like reference)
    this.selectedFlight = Object.freeze(this.deepCopy(flight));

    // Store temporarily (don't set selectedOutbound/selectedReturn yet)
    this.tempFlightForModal = this.deepCopy(flight);
    this.tempFlightIndex = index;
    this.tempFlightType = type;

    // Use same modal structure as one-way (matches reference)
    if (this.isBrowser && window.innerWidth <= 767) {
      // Mobile - use mobile popup
      this.selectedFlightForMobile = flight;
      this.showMobileFarePopup = true;
    } else {
      // Desktop - use modal
      this.showFareModal = true;
    }
  }

  // Select flight after booking from modal
  selectBothwayOutbound(flight: any, index: number): void {
    console.log("Selected Outbound", flight);
    this.selectedOutbound = this.deepCopy(flight);
    this.selectedOutboundIndex = index;
    this.selectedOutboundFooter = this.deepCopy(flight);
    this.footerTabBothwayOutbound = 'flight';

    // Switch to return tab after selecting onward flight
    setTimeout(() => {
      this.switchTab('return');
    }, 300);
  }

  selectBothwayReturn(flight: any, index: number): void {
    console.log("Selected Return", flight);
    this.selectedReturn = this.deepCopy(flight);
    this.selectedReturnIndex = index;
    this.footerTabBothwayReturn = 'flight';
  }

  // Tab switching for round trip
  switchTab(tab: 'onward' | 'return'): void {
    this.activeTab = tab;

    // Reset expansion states when switching tabs to prevent conflicts
    this.flightDetailsExpanded = [];
    this.activeTabs = [];
    this.selectedFareOptions = {};
    this.farePanelExpanded = [];

    this.updateUnderlineStyle();
  }

  updateUnderlineStyle(): void {
    // Update underline position based on active tab
    const tabIndex = this.activeTab === 'onward' ? 0 : 1;
    this.underlineStyle = {
      transform: `translateX(${tabIndex * 100}%)`
    };
  }

  getTotalDurationForFlight(flight: any): string {
    const segments = flight?.Segments?.[0];
    if (!segments || segments.length === 0) return 'N/A';

    const depTime = new Date(segments[0]?.Origin.DepTime);
    const arrTime = new Date(segments[segments.length - 1]?.Destination.ArrTime);

    if (isNaN(depTime.getTime()) || isNaN(arrTime.getTime())) {
      return 'N/A';
    }

    const diffMs = arrTime.getTime() - depTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}hr ${minutes}min`;
  }

  toggleFareSummaryBothway(): void {
    this.showFareSummaryBothway = !this.showFareSummaryBothway;
  }

  toggleFooterDetailsBothway(): void {
    this.showFooterDetailsBothway = !this.showFooterDetailsBothway;
  }

  setFooterTabBothwayOutbound(tab: 'flight' | 'fare' | 'cancellation' | 'dateChange'): void {
    this.footerTabBothwayOutbound = tab;
  }

  setFooterTabBothwayReturn(tab: 'flight' | 'fare' | 'cancellation' | 'dateChange'): void {
    this.footerTabBothwayReturn = tab;
  }

  toggleBothFlightDetails(type: 'departure' | 'return' | 'close'): void {
    this.showFareSummaryBothway = false;
    if (type === 'close') {
      this.expandedFlightDetailsBothway = false;
      this.expandedTypeBothway = null;
      return;
    }
    if (!this.expandedFlightDetailsBothway) {
      this.expandedFlightDetailsBothway = true;
      this.expandedTypeBothway = type;
    } else if (this.expandedTypeBothway !== type) {
      this.expandedTypeBothway = type;
    } else {
      this.expandedFlightDetailsBothway = false;
      this.expandedTypeBothway = null;
    }
  }

  selectFlightForRoundTrip(flight: any, index: number, type: 'onward' | 'return'): void {
    if (type === 'onward') {
      this.selectedOutbound = flight;
      this.selectedOutboundIndex = index;
      // Auto-switch to return tab after a short delay for better UX
      setTimeout(() => {
        this.switchTab('return');
        // Scroll to top of flight list
        if (this.scrollContainer && this.scrollContainer.nativeElement) {
          this.scrollContainer.nativeElement.scrollTop = 0;
        }
      }, 200);
    } else {
      this.selectedReturn = flight;
      this.selectedReturnIndex = index;
      // Scroll to bottom to show the selection strip? Or just stay.
      // The strip appears automatically.
    }
  }

  finalizeRoundTripBooking(): void {
    if (!this.selectedOutbound || !this.selectedReturn) {
      Swal.fire({
        icon: 'error',
        title: 'Selection Incomplete',
        text: 'Please select both onward and return flights.',
        timer: 3000
      });
      return;
    }

    // Open the Both-Way Fare Modal
    this.showFareModalBoth = true;
    this.activeFareTab = 'departure';
    this.selectedFlight = this.selectedOutbound; // Initialize data for the modal

    // Initialize default selections (Standard Fare) if not set
    if ((this.selectedFareIndex.departure === undefined || this.selectedFareIndex.departure < 0) && this.selectedOutbound.FareOptions?.length > 0) {
      this.selectedFareIndex.departure = 0;
      this.selectedOutbound.selectedFareOption = this.selectedOutbound.FareOptions[0];
    }

    if ((this.selectedFareIndex.return === undefined || this.selectedFareIndex.return < 0) && this.selectedReturn.FareOptions?.length > 0) {
      this.selectedFareIndex.return = 0;
      this.selectedReturn.selectedFareOption = this.selectedReturn.FareOptions[0];
    }
  }

  openFareOptionsModalBothway(): void {
    this.showFareModalBoth = true;
    this.activeFareTab = 'departure';
  }

  closeFareOptionsModalBothWay(): void {
    this.showFareModalBoth = false;
  }

  selectFareTab(tab: 'departure' | 'return'): void {
    this.activeFareTab = tab;
    this.selectedFlight = tab === 'departure' ? this.selectedOutbound : this.selectedReturn;
  }

  selectFare(type: 'departure' | 'return', index: number): void {
    this.selectedFareIndex[type] = index;

    // Temporarily store the selected fare in the flight object for display/logic
    if (type === 'departure' && this.selectedOutbound) {
      const fare = this.selectedOutbound.FareOptions[index];
      // We don't want to mutate the object permanently if we cancel, but for now this is the pattern used
      this.selectedOutbound.selectedFareOption = fare;

      // Auto-switch to return tab
      setTimeout(() => {
        this.activeFareTab = 'return';
      }, 200);
    } else if (type === 'return' && this.selectedReturn) {
      const fare = this.selectedReturn.FareOptions[index];
      this.selectedReturn.selectedFareOption = fare;
    }
  }


  // Get defaultFares for modal (matches reference)
  get defaultFares(): any[] {
    if (!this.selectedFlight || !this.selectedFlight.FareOptions) {
      return [];
    }

    const fares = this.selectedFlight.FareOptions.map((fareOption: any, index: number) => {
      const firstSegment = fareOption.Segments?.[0]?.[0] || {};

      // Extract fare breakdown for passenger type 1
      const fareBreakdownPax1 = fareOption.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
      let calculatedPrice = 0;
      if (fareBreakdownPax1 && fareBreakdownPax1.PassengerCount > 0) {
        const baseFarePerPassenger = fareBreakdownPax1.BaseFare / fareBreakdownPax1.PassengerCount;
        const taxPerPassenger = fareBreakdownPax1.Tax / fareBreakdownPax1.PassengerCount;
        calculatedPrice = baseFarePerPassenger + taxPerPassenger;
      }

      return {
        type: fareOption?.Segments?.[0]?.[0]?.SupplierFareClass || 'Standard',
        price: calculatedPrice,
        cabin: firstSegment.CabinBaggage || 'N/A',
        checkIn: firstSegment.Baggage || 'N/A',
        cancel: this.getCancellationText(fareOption),
        dateChange: this.getDateChangeText(fareOption),
        seat: 'Chargeable',
        meal: fareOption.IsFreeMealAvailable ? 'Included' : 'Chargeable',
        originalFareOption: fareOption,
        fareIndex: index
      };
    });

    return fares;
  }

  // Finalize booking for round trip - only set selectedOutbound/selectedReturn when BOOK NOW is clicked
  finalizeBookingForRoundTrip(flight: any, fare: any): void {
    console.log('finalizeBookingForRoundTrip called', {
      flightType: this.flightType,
      tempFlightForModal: this.tempFlightForModal,
      tempFlightType: this.tempFlightType,
      fare: fare,
      hasOriginalFareOption: !!fare?.originalFareOption,
      fareKeys: fare ? Object.keys(fare) : []
    });

    if (this.flightType === 'round' && this.tempFlightForModal && this.tempFlightType) {
      // Use the original flight structure, not the fare option structure
      const flightWithFare = this.deepCopy(this.tempFlightForModal);

      // Get the actual fare option - try multiple sources
      let actualFareOption = null;

      // First try from fare.originalFareOption (should be set by defaultFares getter)
      if (fare?.originalFareOption) {
        actualFareOption = fare.originalFareOption;
      }
      // Try from tempFlightForModal's FareOptions using fareIndex
      else if (fare?.fareIndex !== undefined && this.tempFlightForModal?.FareOptions?.[fare.fareIndex]) {
        actualFareOption = this.tempFlightForModal.FareOptions[fare.fareIndex];
      }
      // Try from selectedFlight's FareOptions (the flight shown in modal)
      else if (this.selectedFlight?.FareOptions) {
        const fareIndex = fare?.fareIndex;
        if (fareIndex !== undefined && fareIndex >= 0 && this.selectedFlight.FareOptions[fareIndex]) {
          actualFareOption = this.selectedFlight.FareOptions[fareIndex];
        } else if (this.selectedFlight.FareOptions.length > 0) {
          actualFareOption = this.selectedFlight.FareOptions[0];
        }
      }
      // Last resort: try from flight parameter or tempFlightForModal
      else if (flight?.FareOptions?.length > 0) {
        const fareIndex = fare?.fareIndex;
        actualFareOption = fareIndex !== undefined && fareIndex >= 0
          ? flight.FareOptions[fareIndex]
          : flight.FareOptions[0];
      } else if (this.tempFlightForModal?.FareOptions?.length > 0) {
        actualFareOption = this.tempFlightForModal.FareOptions[0];
      }

      if (actualFareOption) {
        flightWithFare.selectedFareOption = actualFareOption;
        console.log('Fare option set for flightWithFare:', actualFareOption);
      } else {
        console.error('Could not find fare option!', {
          fareHasOriginal: !!fare?.originalFareOption,
          fareIndex: fare?.fareIndex,
          hasTempFlight: !!this.tempFlightForModal,
          tempFlightHasFareOptions: !!this.tempFlightForModal?.FareOptions,
          hasSelectedFlight: !!this.selectedFlight,
          selectedFlightHasFareOptions: !!this.selectedFlight?.FareOptions,
          hasFlightParam: !!flight,
          flightHasFareOptions: !!flight?.FareOptions
        });
      }

      console.log('Setting selectedOutboundFooter with flight:', {
        flightWithFare: flightWithFare,
        hasSegments: !!flightWithFare.Segments,
        segmentsLength: flightWithFare.Segments?.[0]?.length
      });

      if (this.tempFlightType === 'onward') {
        // Set onward flight NOW (when BOOK NOW is clicked)
        this.selectedOutbound = this.deepCopy(flightWithFare);
        this.selectedOutboundIndex = this.tempFlightIndex;
        this.selectedOutboundFooter = this.deepCopy(flightWithFare);

        // Ensure selectedFareOption is set on selectedOutbound
        if (!this.selectedOutbound.selectedFareOption && flightWithFare.selectedFareOption) {
          this.selectedOutbound.selectedFareOption = flightWithFare.selectedFareOption;
        }

        console.log('selectedOutboundFooter set:', {
          selectedOutboundFooter: this.selectedOutboundFooter,
          hasSegments: !!this.selectedOutboundFooter.Segments,
          segmentsLength: this.selectedOutboundFooter.Segments?.[0]?.length,
          selectedOutboundFareOption: !!this.selectedOutbound.selectedFareOption
        });

        // Trigger change detection
        this.cdr.detectChanges();

        // Close modal and switch to return tab
        this.closeFareOptionsModal();
        setTimeout(() => {
          this.switchTab('return');
          this.cdr.detectChanges();
        }, 300);
      } else if (this.tempFlightType === 'return') {
        // Set return flight NOW (when BOOK NOW is clicked)
        this.selectedReturn = this.deepCopy(flightWithFare);
        this.selectedReturnIndex = this.tempFlightIndex;

        // Get return fare from flightWithFare (which already has selectedFareOption set)
        const returnFare = flightWithFare.selectedFareOption;

        // Get departure fare from selectedOutbound - check multiple sources
        let departureFare = this.selectedOutbound?.selectedFareOption;
        if (!departureFare) {
          // Try to get from FareOptions if selectedFareOption is not set
          if (this.selectedOutbound?.FareOptions?.length > 0) {
            departureFare = this.selectedOutbound.FareOptions[0];
          }
        }

        console.log('Return flight selected, checking for onward flight:', {
          selectedOutbound: !!this.selectedOutbound,
          selectedReturn: !!this.selectedReturn,
          departureFare: !!departureFare,
          returnFare: !!returnFare,
          flightWithFareSelectedFareOption: !!flightWithFare.selectedFareOption,
          selectedOutboundSelectedFareOption: !!this.selectedOutbound?.selectedFareOption,
          selectedOutboundFareOptionsLength: this.selectedOutbound?.FareOptions?.length
        });

        // Clear temp storage AFTER storing what we need
        this.tempFlightForModal = null;
        this.tempFlightIndex = -1;
        this.tempFlightType = null;

        // Close modal
        this.closeFareOptionsModal();

        // Both flights selected, proceed to final booking
        if (this.selectedOutbound && this.selectedReturn && departureFare && returnFare) {
          console.log('Both flights selected, proceeding to finalizeSelection', {
            selectedOutbound: this.selectedOutbound,
            selectedReturn: this.selectedReturn,
            departureFare: departureFare,
            returnFare: returnFare
          });

          // Navigate immediately (matching mobile behavior)
          /* 
          // PREVENTED AUTO NAVIGATION - User wants to click "Book Now" in bottom strip
          try {
            this.finalizeSelection({
              departureFare: departureFare,
              returnFare: returnFare
            });
          } catch (error) {
            console.error('Error in finalizeSelection:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while processing your booking. Please try again.',
              timer: 3000
            });
          }
          */
        } else {
          console.error('Cannot proceed: missing flight selections or fares', {
            selectedOutbound: !!this.selectedOutbound,
            selectedReturn: !!this.selectedReturn,
            departureFare: !!departureFare,
            returnFare: !!returnFare,
            selectedOutboundObj: this.selectedOutbound,
            selectedReturnObj: this.selectedReturn
          });

          // Show error to user
          if (!this.selectedOutbound) {
            Swal.fire({
              icon: 'error',
              title: 'Missing Selection',
              text: 'Please select an onward flight first.',
              timer: 3000
            });
          } else if (!departureFare || !returnFare) {
            Swal.fire({
              icon: 'error',
              title: 'Missing Fare Data',
              text: 'Unable to proceed. Please try selecting the flights again.',
              timer: 3000
            });
          }
        }
      }
    }
  }

  // New method for the "Book Now" button in the bottom strip


  isSelectedFare(type: 'departure' | 'return', index: number): boolean {
    return this.selectedFareIndex[type] === index;
  }

  hasFareSelected(type: 'departure' | 'return'): boolean {
    return this.selectedFareIndex[type] !== -1;
  }

  onFareContinueOrBook(): void {
    if (this.activeFareTab === 'departure') {
      if (this.selectedFareIndex.departure !== -1) {
        this.selectFareTab('return');
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Please Select',
          text: 'Please select a departure fare option first.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } else if (this.activeFareTab === 'return') {
      if (this.selectedFareIndex.departure !== -1 && this.selectedFareIndex.return !== -1) {
        const departureFare = this.selectedOutbound.FareOptions[this.selectedFareIndex.departure];
        const returnFare = this.selectedReturn.FareOptions[this.selectedFareIndex.return];
        console.log('Booking with:', { departureFare, returnFare });
        this.closeFareOptionsModalBothWay();
        this.finalizeSelection({ departureFare, returnFare });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Please Select',
          text: 'Please select both departure and return fare options before proceeding.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    }
  }

  // Utility methods
  getTotalDuration(segments: any[]): string {
    const dep = new Date(segments[0].Origin.DepTime);
    const arr = new Date(segments[segments.length - 1].Destination.ArrTime);
    const ms = arr.getTime() - dep.getTime();
    const hrs = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return `${hrs} h ${mins} m`;
  }

  getFormattedDuration(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const hrsStr = hrs > 0 ? `${hrs} hr${hrs > 1 ? 's' : ''}` : '';
    const minsStr = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''}` : '';
    return `${hrsStr}${hrsStr && minsStr ? ' ' : ''}${minsStr}`.trim();
  }

  getSegmentDuration(segments: any[]): number {
    const first = new Date(segments[0].Origin.DepTime);
    const last = new Date(segments[segments.length - 1].Destination.ArrTime);
    return Math.floor((last.getTime() - first.getTime()) / (1000 * 60));
  }

  getStopsSummary(flight: any): string {
    const count = this.getStopsCount(flight);
    if (count === 0) {
      return 'Non-stop';
    }
    const cities = this.getStopCities(flight.Segments[0]).join(', ');
    const label = count === 1 ? '1 stop' : `${count} stops`;
    return cities ? `${label} via ${cities}` : label;
  }

  getStopCities(segments: any[]): string[] {
    return segments.slice(0, -1).map(seg => seg.Destination.Airport.CityName);
  }

  getLayoverDetails(segments: any[]): any[] {
    const layovers = [];
    for (let i = 0; i < segments.length - 1; i++) {
      const stopCity = segments[i].Destination.Airport.CityName;
      const stopCode = segments[i].Destination.Airport.AirportCode;
      const arrival = new Date(segments[i].Destination.ArrTime);
      const departure = new Date(segments[i + 1].Origin.DepTime);
      const ms = departure.getTime() - arrival.getTime();
      const hrs = Math.floor(ms / 3600000);
      const mins = Math.floor((ms % 3600000) / 60000);
      layovers.push({
        city: stopCity,
        code: stopCode,
        duration: `${hrs} hrs ${mins} mins`
      });
    }
    return layovers;
  }

  getLayoverFormattedDuration(segment1: any, segment2: any): string {
    const arrTime = new Date(segment1.Destination.ArrTime);
    const depTime = new Date(segment2.Origin.DepTime);
    const diffMs = depTime.getTime() - arrTime.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const hrsStr = hrs > 0 ? `${hrs}h` : '';
    const minsStr = mins > 0 ? `${mins}m` : '';
    return `${hrsStr}${hrs && mins ? ' ' : ''}${minsStr}`.trim();
  }

  getAdultFarePerPerson(fareBreakdown: any[]): number {
    if (!fareBreakdown || !fareBreakdown.length) return 0;
    const adult = fareBreakdown.find((fb: any) => fb.PassengerType === 1);
    if (!adult) return 0;
    const basePerAdult = adult.BaseFare / adult.PassengerCount;
    const taxPerAdult = adult.Tax / adult.PassengerCount;
    return basePerAdult + taxPerAdult;
  }

  getTotalFareComponent(type: 'BaseFare' | 'Tax'): number {
    let total = 0;
    const collectFare = (fareOptions: any[]) => {
      if (!fareOptions?.length) return 0;
      const breakdown = fareOptions[0]?.FareBreakdown;
      if (!breakdown?.length) return 0;
      const adult = breakdown.find((b: any) => b.PassengerType === 1);
      return adult ? (adult[type] || 0) : 0;
    };
    total += collectFare(this.selectedOutbound?.FareOptions);
    total += collectFare(this.selectedReturn?.FareOptions);
    return total;
  }

  getCancellationRule(fare: any): string {
    return fare.FareRules?.[0]?.Details || 'Non - Refundable';
  }

  getDateChangeRule(fare: any): string {
    return fare.dateChangePolicy?.[0]?.Details || 'Not Available';
  }

  // Get cancellation text (matches reference)
  getCancellationText(fare: any): string {
    const cancelPolicies = fare.cancellationPolicy || [];
    const validPolicy = cancelPolicies.find((p: any) =>
      p?.Details &&
      p.Details.trim().toLowerCase() !== 'nil' &&
      p.Details.trim() !== ''
    );

    let result = 'Info Not Available';

    if (validPolicy) {
      const detail = validPolicy.Details.trim().toUpperCase();
      if (detail === 'REFER TO DETAILED FARE RULES') {
        result = 'Refer to Fare Rules';
      } else {
        result = `Charges starting ₹ ${validPolicy.Details.replace('INR', '').trim()}`;
      }
    }

    return result;
  }

  getCancellationRows(fare: any): any[] {
    if (!fare?.cancellationPolicy) return [];
    return fare.cancellationPolicy.map((p: any) => ({
      range: `${p.From} ${p.Unit?.toLowerCase() || ''} to ${p.To || 'departure'} ${p.Unit?.toLowerCase() || ''}`,
      price: `₹ ${p.Details}`
    }));
  }

  // Get date change text (matches reference)
  getDateChangeText(fare: any): string {
    const changePolicies = fare.dateChangePolicy || [];
    const validPolicy = changePolicies.find((p: any) =>
      p?.Details &&
      p.Details.trim().toLowerCase() !== 'nil' &&
      p.Details.trim() !== ''
    );

    let result = 'Info Not Available';

    if (validPolicy) {
      const detail = validPolicy.Details.trim().toUpperCase();
      if (detail === 'REFER TO DETAILED FARE RULES') {
        result = 'Refer to Fare Rules';
      } else {
        result = `Charges starting ₹ ${validPolicy.Details.replace('INR', '').trim()}`;
      }
    }

    return result;
  }

  getDateChangeRows(fare: any): any[] {
    if (!fare?.dateChangePolicy) return [];
    return fare.dateChangePolicy
      .filter((p: any) => !(p.From == '4' && p.Unit?.toUpperCase() === 'DAYS'))
      .map((p: any) => {
        const unit = p.Unit?.toLowerCase() || '';
        let range = `${p.From} ${unit}`;
        const toVal = p.To ? p.To.toString().trim() : '';
        if (toVal && toVal.toLowerCase() !== 'departure') {
          range += ` to ${toVal} ${unit}`;
        } else {
          range += ` to departure`;
        }

        const details = p.Details.replace('INR', '').trim();
        // Check if price starts with a number (e.g. "2999", "3,100")
        const isNumeric = /^[\d,.]+$/.test(details);

        let policyText = details;
        if (isNumeric) {
          policyText = `₹ ${details} + Fare difference`;
        }
        // If not numeric (e.g. 'Unchangeable'), use as is without '₹' or '+ Fare difference'

        return {
          range: range,
          policyText: policyText
        };
      });
  }

  // Mobile fare popup: Transform FareOptions to mobile format
  get defaultFaresForMobile(): any[] {
    if (!this.selectedFlightForMobile || !this.selectedFlightForMobile.FareOptions) {
      return [];
    }

    return this.selectedFlightForMobile.FareOptions.map((fareOption: any, index: number) => {
      const firstSegment = fareOption.Segments?.[0]?.[0] || {};

      // Calculate price per adult
      const fareBreakdownPax1 = fareOption.FareBreakdown?.find((fb: any) => fb.PassengerType === 1);
      let calculatedPrice = 0;
      if (fareBreakdownPax1 && fareBreakdownPax1.PassengerCount > 0) {
        const baseFarePerPassenger = fareBreakdownPax1.BaseFare / fareBreakdownPax1.PassengerCount;
        const taxPerPassenger = fareBreakdownPax1.Tax / fareBreakdownPax1.PassengerCount;
        calculatedPrice = baseFarePerPassenger + taxPerPassenger;
      }

      // Get cancellation text
      const cancelText = this.getCancellationTextForMobile(fareOption);
      const dateChangeText = this.getDateChangeTextForMobile(fareOption);

      return {
        type: fareOption?.Segments?.[0]?.[0]?.SupplierFareClass || 'Standard',
        price: calculatedPrice,
        cabin: firstSegment.CabinBaggage || 'N/A',
        checkIn: firstSegment.Baggage || 'N/A',
        cancel: cancelText,
        dateChange: dateChangeText,
        seat: 'Chargeable',
        meal: fareOption.IsFreeMealAvailable ? 'Included' : 'Chargeable',
        originalFareOption: fareOption,
        fareIndex: index
      };
    });
  }

  getCancellationTextForMobile(fare: any): string {
    const cancelPolicies = fare.cancellationPolicy || fare.FareRules || [];
    const validPolicy = Array.isArray(cancelPolicies)
      ? cancelPolicies.find((p: any) => p?.Details && p.Details.toLowerCase() !== 'nil' && p.Details.trim() !== '')
      : null;
    if (validPolicy) {
      const details = validPolicy.Details.replace(/INR/gi, '').trim();
      return `Charges starting ₹ ${details}`;
    }
    return 'Info Not Available';
  }

  getDateChangeTextForMobile(fare: any): string {
    const changePolicies = fare.dateChangePolicy || [];
    const validPolicy = Array.isArray(changePolicies)
      ? changePolicies.find((p: any) => p?.Details && p.Details.toLowerCase() !== 'nil' && p.Details.trim() !== '')
      : null;
    if (validPolicy) {
      const details = validPolicy.Details.replace(/INR/gi, '').trim();
      return `Charges starting ₹ ${details}`;
    }
    return 'Info Not Available';
  }

  finalizeBookingMobile(flight: any, fare: any): void {
    console.log('finalizeBookingMobile called', {
      flightType: this.flightType,
      tempFlightForModal: this.tempFlightForModal,
      tempFlightType: this.tempFlightType,
      fare: fare
    });

    if (this.flightType === 'round' && this.tempFlightForModal && this.tempFlightType) {
      // Handle round trip - only set when BOOK NOW is clicked
      const flightWithFare = this.deepCopy(this.tempFlightForModal);
      flightWithFare.selectedFareOption = fare.originalFareOption;

      console.log('Setting selectedOutboundFooter (mobile) with flight:', {
        flightWithFare: flightWithFare,
        hasSegments: !!flightWithFare.Segments,
        segmentsLength: flightWithFare.Segments?.[0]?.length
      });

      if (this.tempFlightType === 'onward') {
        // Set onward flight NOW (when BOOK NOW is clicked)
        this.selectedOutbound = this.deepCopy(flightWithFare);
        this.selectedOutboundIndex = this.tempFlightIndex;
        this.selectedOutboundFooter = this.deepCopy(flightWithFare);

        console.log('selectedOutboundFooter set (mobile):', {
          selectedOutboundFooter: this.selectedOutboundFooter,
          hasSegments: !!this.selectedOutboundFooter.Segments,
          segmentsLength: this.selectedOutboundFooter.Segments?.[0]?.length
        });

        // Trigger change detection
        this.cdr.detectChanges();

        // Close popup and switch to return tab
        this.closeMobileFarePopup();
        setTimeout(() => {
          this.switchTab('return');
          this.cdr.detectChanges();
        }, 300);
      } else {
        // Set return flight NOW (when BOOK NOW is clicked)
        this.selectedReturn = this.deepCopy(flightWithFare);
        this.selectedReturnIndex = this.tempFlightIndex;

        // Close popup and proceed to checkout
        this.closeMobileFarePopup();

        // Both flights selected, proceed to final booking
        if (this.selectedOutbound && this.selectedReturn) {
          // Navigate to checkout with both fares
          const departureFare = this.selectedOutbound.selectedFareOption || this.selectedOutbound.FareOptions?.[0];
          const returnFare = fare.originalFareOption;

          this.finalizeSelection({
            departureFare: departureFare,
            returnFare: returnFare
          });
        }
      }

      // Clear temp storage
      this.tempFlightForModal = null;
      this.tempFlightIndex = -1;
      this.tempFlightType = null;
    } else {
      // Use the original fare option for booking (one-way)
      const selectedFareOption = fare.originalFareOption || this.selectedFlightForMobile.FareOptions[fare.fareIndex];
      this.finalizeSelection(selectedFareOption);
      this.closeMobileFarePopup();
    }
  }

  // Fetch calendar fare map if missing (matching hero section implementation)
  fetchFullYearCalendarFare(direction: 'departure' | 'return' = 'departure'): void {
    const fromCode = direction === 'departure'
      ? this.flightInputData['fromAirportCode']
      : this.flightInputData['toAirportCode'];
    const toCode = direction === 'departure'
      ? this.flightInputData['toAirportCode']
      : this.flightInputData['fromAirportCode'];

    if (!fromCode || !toCode || !this.flightInputData['tboToken'] || !this.flightInputData['ipAddress']) {
      console.log('Missing required data to fetch calendar fare');
      return;
    }

    const mapToUse = direction === 'departure' ? this.calendarFareMap : this.calendarFareMapReturn;
    mapToUse.clear();

    const today = new Date();
    // Use selected date as starting point if it's in the future, otherwise use today
    const selectedDate = this.flightInputData['departureDate'] ? new Date(this.flightInputData['departureDate']) : today;
    const referenceDate = selectedDate > today ? selectedDate : today;

    const startMonth = referenceDate.getMonth();
    const startYear = referenceDate.getFullYear();
    const fetchPromises: Promise<any>[] = [];

    // Fetch 12 months starting from the selected date (or today)
    for (let i = 0; i < 12; i++) {
      const start = i === 0 ? new Date(referenceDate) : new Date(startYear, startMonth + i, 1);
      const end = this.getMonthEndDate(new Date(startYear, startMonth + i, 1));

      const startDateISO = this.formatToISO(start);
      const endDateISO = this.formatToISO(end);

      const promise = this.apiService
        .getCalendarFare(
          this.flightInputData['ipAddress'],
          this.flightInputData['tboToken'],
          'oneway',
          fromCode,
          toCode,
          'all',
          startDateISO,
          endDateISO
        )
        .toPromise()
        .then((res: any) => {
          console.log("Calendar fare response for month", i + 1, res);
          const results = res?.Response?.SearchResults || [];

          results.forEach((fareItem: any) => {
            const raw = fareItem.DepartureDate;
            const istDate = new Date(new Date(raw).getTime() + 5.5 * 60 * 60 * 1000);
            const iso = this.formatToISO(istDate);

            mapToUse.set(iso, {
              date: iso,
              price: fareItem.Fare,
              airline: fareItem.AirlineName,
              isLowest: fareItem.IsLowestFareOfMonth
            });
          });
        })
        .catch((error) => {
          console.error('Error fetching calendar fare for month', i + 1, error);
        });

      fetchPromises.push(promise);
    }

    Promise.all(fetchPromises).then(() => {
      console.log('Calendar fare map fetched, size:', mapToUse.size);
      if (direction === 'departure' && mapToUse.size > 0) {
        // Update flightInputData with the new calendar fare map
        this.flightInputData['calendarFareMap'] = Object.fromEntries(mapToUse);
        this.prepareDatePricesFromCalendarMap();
        // Scroll to the selected date after prices are populated
        this.cdr.detectChanges();
        if (this.isBrowser) {
          this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            const selectedDate = this.flightInputData['departureDate'];
            const selectedIndex = this.datePrices.findIndex(item => item.date === selectedDate);
            if (selectedIndex >= 0) {
              this.highlightedDate = selectedDate;
              this.initialScrollIndex = selectedIndex;
              this.centerScrollToIndex(selectedIndex);
            }
          });
        }
      }
    });
  }

  formatToISO(date: Date): string {
    const istOffset = 5.5 * 60; // in minutes
    const istTime = new Date(date.getTime() + istOffset * 60000);
    const year = istTime.getUTCFullYear();
    const month = (istTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = istTime.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getMonthEndDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  scrollLeft(): void {
    if (this.fareScrollContainer) {
      this.fareScrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.fareScrollContainer) {
      this.fareScrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  // Modify search
  onModifySearch(): void {
    const formValues = this.modifySearchForm.value;
    console.log('New search values:', formValues);
    this.loader = true;

    // Check if date changed - if so, refresh calendar fare map
    const dateChanged = this.flightInputData['departureDate'] !== formValues.departureDate;
    const routeChanged = this.flightInputData['fromAirportCode'] !== formValues.from ||
      this.flightInputData['toAirportCode'] !== formValues.to;

    // Update flightInputData with new values
    this.flightInputData['fromAirportCode'] = formValues.from;
    this.flightInputData['toAirportCode'] = formValues.to;
    this.flightInputData['departureDate'] = formValues.departureDate;
    this.flightInputData['returnDate'] = formValues.returnDate;
    this.flightInputData['adults'] = formValues.adults;
    this.flightInputData['children'] = formValues.children;
    this.flightInputData['infants'] = formValues.infants;
    this.flightInputData['travelClass'] = formValues.travelClass;

    // If date or route changed, refresh calendar fare map
    if (dateChanged || routeChanged) {
      console.log('Date or route changed, refreshing calendar fare map...');
      this.calendarFareMap.clear();
      this.datePrices = []; // Clear existing date prices
      this.fetchFullYearCalendarFare('departure');
    }

    if (this.flightType === 'oneway') {
      this.fetchOneWayFlights();
    } else if (this.flightType === 'round') {
      this.fetchRoundTripFlights();
    }
  }

  // Passenger dropdown
  togglePassengerDropdown(): void {
    this.showPassengerDropdown = !this.showPassengerDropdown;
  }

  increment(key: string): void {
    const control = this.modifySearchForm.get(key);
    if (control) {
      const current = control.value || 0;
      control.setValue(current + 1);
      this.updateTotalPassengers();
    }
  }

  decrement(key: string): void {
    const control = this.modifySearchForm.get(key);
    if (control) {
      const current = control.value || 0;
      const min = key === 'adults' ? 1 : 0;
      control.setValue(Math.max(min, current - 1));
      this.updateTotalPassengers();
    }
  }

  updateTotalPassengers(): void {
    // Use counts if available, otherwise use form values
    if (this.counts && this.counts.adults !== undefined) {
      const total = this.counts.adults + this.counts.children + this.counts.infants;
      this.totalPassengers = total;
      // Sync form values
      this.modifySearchForm.patchValue({
        adults: this.counts.adults,
        children: this.counts.children,
        infants: this.counts.infants
      });
    } else {
      const form = this.modifySearchForm.value;
      const total = +form.adults + +form.children + +form.infants;
      this.totalPassengers = total;
      // Sync counts
      if (!this.counts) {
        this.counts = { adults: 1, children: 0, infants: 0 };
      }
      this.counts.adults = form.adults || 1;
      this.counts.children = form.children || 0;
      this.counts.infants = form.infants || 0;
    }
  }

  closePassengerDropdown(): void {
    this.showPassengerDropdown = false;
  }

  // Date handling methods for custom calendar
  onModifyDepartureDateSelected(date: string): void {
    this.modifySearchForm.patchValue({ departureDate: date });

    // If round trip and return date is before new departure date, clear it
    if (this.flightType === 'round') {
      const returnDate = this.modifySearchForm.get('returnDate')?.value;
      if (returnDate && returnDate < date) {
        this.modifySearchForm.patchValue({ returnDate: '' });
        this.returnDateError = '';
      }
      // Clear any existing error when departure date changes
      this.returnDateError = '';
    }
  }

  onModifyReturnDateSelected(date: string): void {
    const departureDate = this.modifySearchForm.get('departureDate')?.value;

    // Validate that return date is not before departure date
    if (departureDate && date && date < departureDate) {
      this.returnDateError = 'Return date cannot be before departure date.';
      this.modifySearchForm.patchValue({ returnDate: '' });
      return;
    }

    // Clear error if validation passes
    this.returnDateError = '';
    this.modifySearchForm.patchValue({ returnDate: date });
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getReturnMinDate(): string {
    const departureDate = this.modifySearchForm.get('departureDate')?.value;
    return departureDate || this.getTodayDate();
  }

  onCalendarOpened(): void {
    // Optional: Add any logic needed when calendar opens
  }

  onCalendarClosed(): void {
    // Optional: Add any logic needed when calendar closes
  }

  openDepartureCalendar(): void {
    // Trigger calendar to open by clicking the input wrapper
    setTimeout(() => {
      const calendarInput = document.querySelector('.calendar-wrapper .calendar-input-wrapper') as HTMLElement;
      if (calendarInput) {
        calendarInput.click();
      }
    }, 100);
  }

  // Finalize selection
  finalizeSelection(fare: any): void {
    console.log("Fare Selected", fare);

    // Handle multi-city separately
    if (this.flightType === 'multi') {
      console.log('Multi-city booking handled by proceedWithMultiCityBooking');
      return;
    }

    // Existing one-way and round-trip logic...
    var departureFareData, returnFareData;

    this.closeFareOptionsModal();

    if (this.flightType === 'oneway') {
      departureFareData = fare;
    } else {
      departureFareData = fare['departureFare'];
      returnFareData = fare['returnFare'];
    }

    this.flightDataService.setStringValue({
      tboToken: this.flightInputData['tboToken'],
      ipAddress: this.flightInputData['ipAddress'],
      tripType: this.flightInputData['tripType'],
      fromCity: this.flightInputData['fromCity'],
      fromAirport: this.flightInputData['fromAirport'],
      fromAirportCode: this.flightInputData['fromAirportCode'],
      toCity: this.flightInputData['toCity'],
      toAirport: this.flightInputData['toAirport'],
      toAirportCode: this.flightInputData['toAirportCode'],
      departureDate: this.flightInputData['departureDate'],
      returnDate: this.flightInputData['returnDate'],
      fareType: this.flightInputData['fareType'],
      adults: this.flightInputData['adults'],
      children: this.flightInputData['children'],
      infants: this.flightInputData['infants'],
      travelClass: this.flightInputData['travelClass'],
      traceid: this.traceid,
      departureFlightData: departureFareData,
      returnFlightData: returnFareData
    } as FlightData);

    this.router.navigate(['flightfinalsection']);
  }

  // Multi-city methods
  selectMulticityTab(index: number): void {
    if (index >= 0 && index < this.multicityTabData.length) {
      this.selectedMulticityTab = index;
      console.log('Selected multi-city tab:', index);
    }
  }

  /**
   * Convert fareType string to API number format
   * Based on reference: 2 = Regular, 3 = Student, 4 = Armed Forces, 5 = Senior Citizen
   */
  getFareTypeNumber(fareType: string | undefined): number {
    if (!fareType || fareType === 'regular') {
      return 2; // Regular fare (default)
    }
    const fareTypeMap: { [key: string]: number } = {
      'regular': 2,
      'student': 3,
      'armed': 4,
      'senior': 5,
      'doctor': 6
    };
    return fareTypeMap[fareType] || 2; // Default to regular if unknown
  }

  scrollMulticityTabs(direction: 'left' | 'right'): void {
    if (!this.isBrowser || !this.multicityScrollContainer) return;
    const container = this.multicityScrollContainer?.nativeElement;
    if (!container) return;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

  selectMulticityFlight(tabIndex: number, flightIndex: number, flight: any): void {
    console.log('Selecting multi-city flight:', { tabIndex, flightIndex });

    if (!this.multicityTabData[tabIndex]) {
      console.error('Invalid tab index:', tabIndex);
      return;
    }

    const selectedGroupedFlight = this.multicityTabData[tabIndex].groupedFlights[flightIndex];
    if (!selectedGroupedFlight) {
      console.error('Invalid flight index:', flightIndex);
      return;
    }

    // Store the selected flight (default to first fare option)
    this.multicitySelectedFares[tabIndex] = {
      groupedFlight: this.deepCopy(selectedGroupedFlight),
      selectedFare: this.deepCopy(selectedGroupedFlight.FareOptions[0]),
      price: selectedGroupedFlight.price
    };

    console.log('Updated multi-city selected flight:', this.multicitySelectedFares);
  }

  openFareOptionsModalMultiCity(segmentIndex: number, flight: any, flightIndex: number): void {
    console.log('openFareOptionsModalMultiCity called', { segmentIndex, flight, flightIndex });

    this.selectedMultiCitySegmentIndex = segmentIndex;
    this.selectedMultiCityFlight = Object.freeze(this.deepCopy(flight)); // Deep copy and freeze
    this.selectedMultiCityFlightIndex = flightIndex;

    // PRE-SELECT this flight with lowest fare option (matching working code)
    if (flight.FareOptions && flight.FareOptions.length > 0) {
      const lowestFare = flight.FareOptions.reduce((a: any, b: any) => {
        const fareA = a?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
        const fareB = b?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
        return fareA < fareB ? a : b;
      });

      // Store the pre-selected flight
      this.multicitySelectedFares[segmentIndex] = {
        groupedFlight: this.deepCopy(flight),
        selectedFare: this.deepCopy(lowestFare),
        price: this.getAdultFarePerPerson(lowestFare.FareBreakdown)
      };

      console.log('Pre-selected flight for segment', segmentIndex, ':', this.multicitySelectedFares[segmentIndex]);
    }

    this.showFareModalMultiCity = true;
  }
  closeFareOptionsModalMultiCity(): void {
    this.showFareModalMultiCity = false;
    this.selectedMultiCityFlight = null;
    this.selectedMultiCitySegmentIndex = -1;
    this.selectedMultiCityFlightIndex = -1;
  }

  selectMulticityFare(fare: any): void {
    if (this.selectedMultiCitySegmentIndex === -1 || !this.selectedMultiCityFlight) {
      console.error('Invalid fare selection state');
      return;
    }

    const segmentIndex = this.selectedMultiCitySegmentIndex;

    // Update the selected fare for this segment
    this.multicitySelectedFares[segmentIndex] = {
      groupedFlight: this.deepCopy(this.selectedMultiCityFlight),
      selectedFare: this.deepCopy(fare),
      price: this.getAdultFarePerPerson(fare.FareBreakdown)
    };

    console.log('Selected multi-city fare:', this.multicitySelectedFares[segmentIndex]);
    this.closeFareOptionsModalMultiCity();
  }

  finalizeMultiCityBooking(flight: any, fare: any): void {
    console.log('finalizeMultiCityBooking called', {
      flight: flight,
      fare: fare,
      selectedMultiCitySegmentIndex: this.selectedMultiCitySegmentIndex,
      selectedMultiCityFlight: this.selectedMultiCityFlight,
      currentSelectedFares: this.multicitySelectedFares
    });

    if (this.selectedMultiCitySegmentIndex === -1 || !this.selectedMultiCityFlight) {
      console.error('Invalid fare selection state');
      return;
    }

    const segmentIndex = this.selectedMultiCitySegmentIndex;

    // Get the actual fare option
    let actualFareOption = null;

    if (fare?.originalFareOption) {
      actualFareOption = fare.originalFareOption;
    } else if (fare?.fareIndex !== undefined && this.selectedMultiCityFlight?.FareOptions?.[fare.fareIndex]) {
      actualFareOption = this.selectedMultiCityFlight.FareOptions[fare.fareIndex];
    } else if (this.selectedMultiCityFlight?.FareOptions?.length > 0) {
      actualFareOption = this.selectedMultiCityFlight.FareOptions[0];
    }

    if (!actualFareOption) {
      console.error('Could not find fare option!');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to process fare selection. Please try again.',
        timer: 3000
      });
      return;
    }

    // Update the stored fare with the selected one
    this.multicitySelectedFares[segmentIndex] = {
      groupedFlight: this.deepCopy(this.selectedMultiCityFlight),
      selectedFare: this.deepCopy(actualFareOption),
      price: this.getAdultFarePerPerson(actualFareOption.FareBreakdown)
    };

    console.log('Multi-city fare updated for segment', segmentIndex);
    console.log('Current multicitySelectedFares:', JSON.stringify(this.multicitySelectedFares, null, 2));

    // Close modal
    this.closeFareOptionsModalMultiCity();

    // Check total segments
    const totalSegments = this.multicityTabData?.length ||
      this.flightInputData['multiCitySegment']?.length ||
      1;
    const selectedCount = Object.keys(this.multicitySelectedFares).length;

    console.log('Multi-city booking progress:', {
      selectedCount,
      totalSegments,
      allSelected: selectedCount >= totalSegments
    });

    // Proceed to booking immediately (matching working code behavior)
    console.log('Proceeding to booking...');

    setTimeout(() => {
      this.proceedWithMultiCityBooking(true);
    }, 100);
  }

  debugMultiCityState(): void {
    console.log('=== DEBUG MULTI-CITY STATE ===');
    console.log('multicitySelectedFares:', JSON.stringify(this.multicitySelectedFares, null, 2));
    console.log('Selected fares count:', Object.keys(this.multicitySelectedFares).length);
    console.log('multicityTabData length:', this.multicityTabData?.length);
    console.log('multiCitySegment length:', this.flightInputData['multiCitySegment']?.length);
    console.log('traceid:', this.traceid);
    console.log('flightInputData:', this.flightInputData);
  }

  get multicityTotalFare(): number {
    return Object.values(this.multicitySelectedFares).reduce((sum, f: any) => sum + (f?.price || 0), 0);
  }

  get multicityHasSelectedFares(): boolean {
    // Check if all segments have selected fares
    const totalSegments = this.multicityTabData?.length || this.flightInputData['multiCitySegment']?.length || 0;
    if (totalSegments === 0) {
      return false;
    }
    const selectedCount = Object.keys(this.multicitySelectedFares).length;
    return selectedCount >= totalSegments;
  }

  getMultiCityRouteOrigin(index: number): string {
    const segment = this.flightInputData['multiCitySegment']?.[index];
    if (!segment) return '';

    if (segment.Origin) {
      // API format
      const city = this.cities.find(c => c.code === segment.Origin);
      return city ? `${city.name} (${segment.Origin})` : segment.Origin;
    } else if (segment.from) {
      // Form input format
      return segment.from;
    }

    // Fallback
    const route = this.flightInputData['multiCityRoutes']?.[index];
    return route?.from || '';
  }

  getMultiCityRouteDestination(index: number): string {
    const segment = this.flightInputData['multiCitySegment']?.[index];
    if (!segment) return '';

    if (segment.Destination) {
      // API format
      const city = this.cities.find(c => c.code === segment.Destination);
      return city ? `${city.name} (${segment.Destination})` : segment.Destination;
    } else if (segment.to) {
      // Form input format
      return segment.to;
    }

    // Fallback
    const route = this.flightInputData['multiCityRoutes']?.[index];
    return route?.to || '';
  }



  getMultiCityRouteDate(index: number): string {
    const segment = this.flightInputData['multiCitySegment']?.[index];
    if (segment?.PreferredDepartureTime) {
      return segment.PreferredDepartureTime;
    }

    // Fallback to multiCityRoutes format
    const route = this.flightInputData['multiCityRoutes']?.[index];
    return route?.date || '';
  }

  // Helper method to extract departure/arrival times for a segment from fare segments
  private extractSegmentTimes(segmentGroups: any[], routeOrigin: string, routeDest: string, enhancedSeg: any): boolean {
    if (!segmentGroups || !Array.isArray(segmentGroups)) {
      return false;
    }

    // Iterate through all segment groups to find matching origin/destination
    for (const segGroup of segmentGroups) {
      if (!Array.isArray(segGroup) || segGroup.length === 0) {
        continue;
      }

      const firstSeg = segGroup[0];
      const lastSeg = segGroup[segGroup.length - 1];

      // Get origin and destination codes from segment
      const segOrigin = firstSeg.Origin?.Airport?.AirportCode || firstSeg.Origin?.AirportCode || '';
      const segDest = lastSeg.Destination?.Airport?.AirportCode || lastSeg.Destination?.AirportCode || '';

      // Check if this segment group matches the route
      if (segOrigin === routeOrigin && segDest === routeDest) {
        // Extract departure date/time
        if (firstSeg.Origin?.DepTime) {
          enhancedSeg.departureDateTime = firstSeg.Origin.DepTime;
          enhancedSeg.departureDate = firstSeg.Origin.DepTime.split('T')[0] || '';
          enhancedSeg.departureTime = firstSeg.Origin.DepTime.split('T')[1]?.split('.')[0]?.substring(0, 5) || '';
        }

        // Extract arrival date/time
        if (lastSeg.Destination?.ArrTime) {
          enhancedSeg.arrivalDateTime = lastSeg.Destination.ArrTime;
          enhancedSeg.arrivalDate = lastSeg.Destination.ArrTime.split('T')[0] || '';
          enhancedSeg.arrivalTime = lastSeg.Destination.ArrTime.split('T')[1]?.split('.')[0]?.substring(0, 5) || '';
        }

        return true; // Found and extracted segment data
      }
    }

    return false; // Segment data not found in this fare
  }

  proceedWithMultiCityBooking(skipCheck: boolean = false): void {
    // Add debug call
    this.debugMultiCityState();

    console.log('proceedWithMultiCityBooking called', {
      skipCheck,
      multicitySelectedFaresCount: Object.keys(this.multicitySelectedFares).length
    });

    // Validate we have selections for all segments
    // Use the same logic as multicityHasSelectedFares to ensure consistency
    const totalSegments = this.multicityTabData?.length ||
      this.flightInputData['multiCitySegment']?.length ||
      this.flightInputData['multiCityRoutes']?.length ||
      0;

    if (totalSegments === 0) {
      console.error('No multi-city segments found!');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No flight segments found. Please try again.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Check if all segments (0 to totalSegments-1) have selected fares
    let missingSegments: number[] = [];
    for (let i = 0; i < totalSegments; i++) {
      if (!this.multicitySelectedFares[i] || !this.multicitySelectedFares[i].selectedFare) {
        missingSegments.push(i);
      }
    }

    if (missingSegments.length > 0 && !skipCheck) {
      console.error('Not all segments selected!', {
        selected: Object.keys(this.multicitySelectedFares).length,
        total: totalSegments,
        missingSegments: missingSegments
      });
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Selection',
        text: `Please select flights for all ${totalSegments} segments before proceeding.`,
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Get all segment indices and sort them
    const segmentIndices = Object.keys(this.multicitySelectedFares)
      .map(Number)
      .sort((a, b) => a - b);

    console.log('Segment indices selected:', segmentIndices);

    // Get multiCitySegments for building booking data
    const multiCitySegments = this.flightInputData['multiCitySegment'] || this.flightInputData['multiCityRoutes'] || [];

    // Enhance multiCitySegments with actual departure/arrival dates and times from selected fares
    const enhancedMultiCitySegments = multiCitySegments.map((seg: any, segIndex: number) => {
      const selectedFareData = this.multicitySelectedFares[segIndex];
      const enhancedSeg = this.deepCopy(seg);

      // First, set default dates from segment definition if available
      // Only extract date, not time (time should come from actual flight segments, not default)
      if (seg.PreferredDepartureTime) {
        const depDateTime = seg.PreferredDepartureTime;
        enhancedSeg.departureDateTime = depDateTime;
        enhancedSeg.departureDate = depDateTime.split('T')[0];
        // Don't set departureTime here - it should only come from actual flight segments
        // If no fare is selected, time will remain undefined/empty and show as N/A
        enhancedSeg.departureTime = '';
      } else if (seg.date) {
        const depDate = typeof seg.date === 'string' ? seg.date : seg.date.split('T')[0];
        enhancedSeg.departureDate = depDate;
        enhancedSeg.departureTime = '';
      }

      // Extract departure and arrival times from selected fare's segments
      // IMPORTANT: For multi-city, one fare option contains ALL segments
      // So we need to check ALL selected fares to find data for this segment
      const routeOrigin = seg.Origin || seg.fromAirportCode;
      const routeDest = seg.Destination || seg.toAirportCode;

      // First, try the fare selected for this specific segment index
      let foundSegmentData = false;
      if (selectedFareData?.selectedFare?.Segments) {
        foundSegmentData = this.extractSegmentTimes(selectedFareData.selectedFare.Segments, routeOrigin, routeDest, enhancedSeg);
      }

      // If not found in the specific segment's fare, check ALL selected fares
      // (because in multi-city, one fare contains all segments)
      if (!foundSegmentData) {
        for (const fareIndex in this.multicitySelectedFares) {
          const fareData = this.multicitySelectedFares[Number(fareIndex)];
          if (fareData?.selectedFare?.Segments) {
            if (this.extractSegmentTimes(fareData.selectedFare.Segments, routeOrigin, routeDest, enhancedSeg)) {
              foundSegmentData = true;
              break; // Found the segment data, no need to check further
            }
          }
        }
      }

      return enhancedSeg;
    });

    // Get airport names from codes
    const fromAirportCode = enhancedMultiCitySegments[0]?.Origin || enhancedMultiCitySegments[0]?.fromAirportCode || '';
    const toAirportCode = enhancedMultiCitySegments[totalSegments - 1]?.Destination ||
      enhancedMultiCitySegments[totalSegments - 1]?.toAirportCode || '';

    const fromAirportObj = this.cities.find(c => c.code === fromAirportCode);
    const toAirportObj = this.cities.find(c => c.code === toAirportCode);

    const fromAirport = fromAirportObj?.airport || fromAirportObj?.name || fromAirportCode;
    const toAirport = toAirportObj?.airport || toAirportObj?.name || toAirportCode;

    // Get the first selected fare (for multi-city, all segments are in one fare option)
    // This fare contains ALL segments of the multi-city journey
    const firstSelectedFareKey = Object.keys(this.multicitySelectedFares)[0];
    const firstSelectedFareData = firstSelectedFareKey ? this.multicitySelectedFares[Number(firstSelectedFareKey)] : null;
    const selectedFareOption = firstSelectedFareData?.selectedFare || null;

    if (!selectedFareOption) {
      console.error('No selected fare option found for multi-city booking');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No flight selection found. Please try again.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Prepare the complete multi-city booking data
    // Structure matches mobile final page expectations: departureFlightData.selectedFare.originalFareOption
    // The selectedFareOption contains ALL segments of the multi-city journey in its Segments array
    const multiCityBookingData: FlightData & { multiCitySegment?: any; multiCitySelectedFares?: any; totalPrice?: number } = {
      tboToken: this.flightInputData['tboToken'],
      ipAddress: this.flightInputData['ipAddress'],
      tripType: 'multicity', // Match mobile format: 'multicity' not 'multi'

      // Route info from first and last segments (overall journey endpoints)
      fromCity: this.getMultiCityRouteOrigin(0),
      fromAirport: fromAirport,
      fromAirportCode: fromAirportCode,
      toCity: this.getMultiCityRouteDestination(totalSegments - 1),
      toAirport: toAirport,
      toAirportCode: toAirportCode,

      // Flight data structure matching mobile final page expectations
      // departureFlightData.selectedFare.originalFareOption contains the complete flight with all segments
      departureFlightData: {
        selectedFare: {
          originalFareOption: this.deepCopy(selectedFareOption) // Contains Segments array with all multi-city segments
        }
      },
      returnFlightData: null,

      // Multi-city specific data (kept for backward compatibility and additional info)
      // multiCitySegment: Array of route definitions with departure/arrival dates and times
      // Each segment represents one leg of the journey (e.g., Bagdogra->Kolkata, Kolkata->Delhi)
      // Enhanced with actual departureDateTime, arrivalDateTime, departureDate, arrivalDate, departureTime, arrivalTime
      multiCitySegment: this.deepCopy(enhancedMultiCitySegments),

      // multiCitySelectedFares: Object mapping segment index to selected flight+fare
      // Each selected fare contains complete Segments array with ALL legs of the journey
      // Example: multicitySelectedFares[0] contains a flight with Segments = [Bagdogra->Kolkata, Kolkata->Delhi]
      multiCitySelectedFares: this.deepCopy(this.multicitySelectedFares),

      // Passenger info
      departureDate: enhancedMultiCitySegments[0]?.departureDate ||
        enhancedMultiCitySegments[0]?.PreferredDepartureTime?.split('T')[0] ||
        enhancedMultiCitySegments[0]?.date?.split('T')[0] ||
        this.flightInputData['departureDate'],
      returnDate: null,
      adults: this.flightInputData['adults'] || 1,
      children: this.flightInputData['children'] || 0,
      infants: this.flightInputData['infants'] || 0,
      travelClass: this.flightInputData['travelClass'] || 'Economy',
      fareType: this.flightInputData['fareType'],

      // Trace ID from API response
      traceid: this.traceid,

      // Total price across all selected segments
      totalPrice: this.multicityTotalFare
    };

    console.log('=== FINAL MULTI-CITY BOOKING DATA ===');
    console.log('Complete booking data:', JSON.stringify(multiCityBookingData, null, 2));

    // Verify structure of selected fares - each should contain all segments
    const selectedFaresInfo: any = {};
    Object.keys(this.multicitySelectedFares).forEach(key => {
      const selectedFare = this.multicitySelectedFares[Number(key)];
      const segmentsCount = selectedFare?.selectedFare?.Segments?.length || 0;
      const segmentRoutes: string[] = [];

      if (selectedFare?.selectedFare?.Segments) {
        selectedFare.selectedFare.Segments.forEach((segGroup: any, idx: number) => {
          if (Array.isArray(segGroup)) {
            segGroup.forEach((seg: any) => {
              const origin = seg.Origin?.Airport?.CityName || seg.Origin?.Airport?.AirportCode || 'Unknown';
              const dest = seg.Destination?.Airport?.CityName || seg.Destination?.Airport?.AirportCode || 'Unknown';
              segmentRoutes.push(`${origin} → ${dest}`);
            });
          }
        });
      }

      selectedFaresInfo[key] = {
        hasSelectedFare: !!selectedFare?.selectedFare,
        segmentsCount: segmentsCount,
        segmentRoutes: segmentRoutes,
        hasFareBreakdown: !!selectedFare?.selectedFare?.FareBreakdown
      };
    });

    console.log('Key properties:', {
      hasMultiCitySegment: !!multiCityBookingData.multiCitySegment,
      multiCitySegmentLength: multiCityBookingData.multiCitySegment?.length,
      multiCitySegmentRoutes: multiCityBookingData.multiCitySegment?.map((seg: any) =>
        `${seg.Origin || seg.fromAirportCode} → ${seg.Destination || seg.toAirportCode}`
      ),
      hasMultiCitySelectedFares: !!multiCityBookingData.multiCitySelectedFares,
      selectedFaresKeys: Object.keys(multiCityBookingData.multiCitySelectedFares || {}).length,
      selectedFaresInfo: selectedFaresInfo,
      hasTraceId: !!multiCityBookingData.traceid,
      hasToken: !!multiCityBookingData.tboToken,
      totalPrice: multiCityBookingData.totalPrice
    });

    // Validate critical data
    const requiredFields = ['tboToken', 'ipAddress', 'traceid', 'departureFlightData'];
    const missingFields = requiredFields.filter(field => {
      if (field === 'departureFlightData') {
        return !(multiCityBookingData as Record<string, any>)[field] ||
          !(multiCityBookingData as Record<string, any>)[field]?.selectedFare?.originalFareOption;
      }
      return !(multiCityBookingData as Record<string, any>)[field];
    });

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      Swal.fire({
        icon: 'error',
        title: 'Data Error',
        text: `Missing required information: ${missingFields.join(', ')}. Please try again.`,
        confirmButtonText: 'Ok'
      });
      return;
    }

    // DEBUG: Prepare summary for user verification (commented out, kept for future debugging)
    // const segmentsSummary = enhancedMultiCitySegments.map((seg: any, idx: number) => {
    //   const origin = seg.Origin || seg.fromAirportCode || 'Unknown';
    //   const dest = seg.Destination || seg.toAirportCode || 'Unknown';
    //   const depDate = seg.departureDate || seg.PreferredDepartureTime?.split('T')[0] || seg.date?.split('T')[0] || 'N/A';
    //   // Only show time if it's a valid time (not empty, not "00:00" which is default)
    //   const depTime = seg.departureTime && seg.departureTime !== '00:00' ? seg.departureTime : 'N/A';
    //   const arrDate = seg.arrivalDate || 'N/A';
    //   const arrTime = seg.arrivalTime && seg.arrivalTime !== '00:00' ? seg.arrivalTime : 'N/A';
    //   const selectedFare = this.multicitySelectedFares[idx];
    //   const farePrice = selectedFare?.price || 'N/A';
    //   const hasFare = !!selectedFare?.selectedFare;
    //   
    //   return `Segment ${idx + 1}: ${origin} → ${dest}\n   Departure: ${depDate} ${depTime}\n   Arrival: ${arrDate} ${arrTime}\n   Price: ₹${farePrice}, Has Fare: ${hasFare ? 'Yes' : 'No'}`;
    // }).join('\n\n');

    // DEBUG: Data preview modal (commented out for production, kept for future debugging)
    // const summaryText = `Multi-City Booking Data:\n\n` +
    //   `Total Segments: ${totalSegments}\n` +
    //   `Selected Fares: ${Object.keys(this.multicitySelectedFares).length}\n` +
    //   `Total Price: ₹${this.multicityTotalFare}\n\n` +
    //   `Routes:\n${segmentsSummary}\n\n` +
    //   `Trace ID: ${multiCityBookingData.traceid || 'N/A'}\n` +
    //   `Passengers: ${multiCityBookingData.adults}A ${multiCityBookingData.children}C ${multiCityBookingData.infants}I`;

    // // Show data preview before navigation
    // Swal.fire({
    //     title: 'Multi-City Booking Data Preview',
    //     html: `<pre style="text-align: left; font-size: 12px; max-height: 60vh; overflow-y: auto; background: #f5f5f5; padding: 10px; border-radius: 5px;">${summaryText.replace(/\n/g, '<br>')}</pre>` +
    //           `<p style="margin-top: 15px; font-size: 14px;">Full data logged to console. Click "Proceed" to continue or "View JSON" to see complete structure.</p>`,
    //     icon: 'info',
    //     width: '700px',
    //     showCancelButton: true,
    //     confirmButtonText: 'Proceed to Booking',
    //     cancelButtonText: 'Cancel',
    //     showDenyButton: true,
    //     denyButtonText: 'View JSON',
    //     customClass: {
    //         htmlContainer: 'swal-html-container'
    //     }
    // }).then((result) => {
    //     if (result.isDenied) {
    //         // Show full JSON in a modal
    //         Swal.fire({
    //             title: 'Complete Booking Data (JSON)',
    //             html: `<pre style="text-align: left; font-size: 11px; max-height: 70vh; overflow-y: auto; background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word;">${JSON.stringify(multiCityBookingData, null, 2)}</pre>`,
    //             width: '900px',
    //             confirmButtonText: 'Proceed to Booking',
    //             showCancelButton: true,
    //             cancelButtonText: 'Cancel'
    //         }).then((jsonResult) => {
    //             if (jsonResult.isConfirmed) {
    //                 this.saveAndNavigateMultiCity(multiCityBookingData);
    //             }
    //         });
    //     } else if (result.isConfirmed) {
    //         this.saveAndNavigateMultiCity(multiCityBookingData);
    //     }
    // });

    // Proceed directly to booking (skip preview modal)
    this.saveAndNavigateMultiCity(multiCityBookingData);
  }

  // Helper method to save and navigate for multi-city bookings
  private saveAndNavigateMultiCity(multiCityBookingData: any): void {
    // Save to service
    try {
      console.log('Saving to flightDataService...');
      this.flightDataService.setStringValue(multiCityBookingData as FlightData);
      console.log('✓ Flight data saved to service');

      // Backup to localStorage
      if (this.isBrowser && typeof localStorage !== 'undefined') {
        localStorage.setItem('multiCityFlightData', JSON.stringify(multiCityBookingData));
        console.log('✓ Flight data backed up to localStorage');
      }
    } catch (error) {
      console.error('✗ Error saving flight data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Save Error',
        text: 'Failed to save flight data. Please try again.',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Navigate to final section
    console.log('→ Navigating to flightfinalsection...');

    this.router.navigate(['flightfinalsection']).then(
      (success) => {
        if (success) {
          console.log('✓ Navigation successful');
        } else {
          console.error('✗ Navigation returned false');
          // Try alternate navigation
          console.log('Trying alternate navigation method...');
          this.router.navigate(['/flightfinalsection']);
        }
      },
      (error) => {
        console.error('✗ Router error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Navigation Error',
          text: 'Unable to navigate to booking page. Please try again.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  toggleFarePanel(index: number): void {
    this.farePanelExpanded = this.farePanelExpanded.map((_, i) => i === index ? !this.farePanelExpanded[i] : false);
    this.flightDetailsExpanded[index] = false;
  }

  // Mobile Flight Card Helper Methods
  formatMinutesToHrMin(minutes: number): string {
    if (!minutes) return '0h 0m';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  }

  getDayDiff(depTime: string, arrTime: string): number {
    const dep = new Date(depTime);
    const arr = new Date(arrTime);

    // Create date objects set to midnight to compare calendar days
    const depDate = new Date(dep.getFullYear(), dep.getMonth(), dep.getDate());
    const arrDate = new Date(arr.getFullYear(), arr.getMonth(), arr.getDate());

    // Calculate difference in milliseconds
    const diffMs = arrDate.getTime() - depDate.getTime();

    // Convert to days
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  getLayoverDuration(segment1: any, segment2: any): string {
    const arrTime = new Date(segment1.Destination.ArrTime);
    const depTime = new Date(segment2.Origin.DepTime);
    const diffMs = depTime.getTime() - arrTime.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h ${mins}m layover`;
  }

  getLayoverDayText(segment1: any, segment2: any): string {
    const arrTime = new Date(segment1.Destination.ArrTime);
    const depTime = new Date(segment2.Origin.DepTime);

    // Create date objects set to midnight to compare calendar days
    const arrDate = new Date(arrTime.getFullYear(), arrTime.getMonth(), arrTime.getDate());
    const depDate = new Date(depTime.getFullYear(), depTime.getMonth(), depTime.getDate());

    const diffMs = depDate.getTime() - arrDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Same day';
    } else if (diffDays === 1) {
      return 'Next day';
    } else {
      return `+${diffDays} days`;
    }
  }

  // City Suggestions Methods (like homepage)
  showCitySuggestions(query: string, target: string) {
    // If query is empty, show all airports (limited to reasonable number)
    if (!query || !query.trim()) {
      // Show all airports, excluding the one selected in the opposite field
      let allAirports = this.flightAirports.slice();

      if (target === 'summary-from' && this.flightInputData['toAirportCode']) {
        const toCode = this.flightInputData['toAirportCode'].toLowerCase();
        allAirports = allAirports.filter(city => city.code.toLowerCase() !== toCode);
      } else if (target === 'summary-to' && this.flightInputData['fromAirportCode']) {
        const fromCode = this.flightInputData['fromAirportCode'].toLowerCase();
        allAirports = allAirports.filter(city => city.code.toLowerCase() !== fromCode);
      }

      this.activeSuggestions[target] = allAirports.sort((a, b) => {
        const aIsIndia = (a.country && (a.country.toLowerCase() === 'india' || a.country.toUpperCase() === 'IN'));
        const bIsIndia = (b.country && (b.country.toLowerCase() === 'india' || b.country.toUpperCase() === 'IN'));
        if (aIsIndia && !bIsIndia) return -1;
        if (!aIsIndia && bIsIndia) return 1;
        return 0;
      });
      return;
    }

    const filtered = this.flightAirports.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.code.toLowerCase().includes(query.toLowerCase())
    );

    // Exclude the city selected in the other field
    if (target === 'summary-from' && this.flightInputData['toAirportCode']) {
      const toCode = this.flightInputData['toAirportCode'].toLowerCase();
      this.activeSuggestions[target] = filtered.filter(city =>
        city.code.toLowerCase() !== toCode
      );
    } else if (target === 'summary-to' && this.flightInputData['fromAirportCode']) {
      const fromCode = this.flightInputData['fromAirportCode'].toLowerCase();
      this.activeSuggestions[target] = filtered.filter(city =>
        city.code.toLowerCase() !== fromCode
      );
    } else {
      this.activeSuggestions[target] = filtered;
    }

    // Sort to prioritize India
    this.activeSuggestions[target].sort((a, b) => {
      const aIsIndia = (a.country && (a.country.toLowerCase() === 'india' || a.country.toUpperCase() === 'IN'));
      const bIsIndia = (b.country && (b.country.toLowerCase() === 'india' || b.country.toUpperCase() === 'IN'));
      if (aIsIndia && !bIsIndia) return -1;
      if (!aIsIndia && bIsIndia) return 1;
      return 0;
    });
  }

  showCitySuggestionsOnFocus(target: string) {
    // Show all airports on focus, excluding the one selected in the opposite field
    let allAirports = this.flightAirports.slice();

    if (target === 'summary-from' && this.flightInputData['toAirportCode']) {
      const toCode = this.flightInputData['toAirportCode'].toLowerCase();
      allAirports = allAirports.filter(city => city.code.toLowerCase() !== toCode);
    } else if (target === 'summary-to' && this.flightInputData['fromAirportCode']) {
      const fromCode = this.flightInputData['fromAirportCode'].toLowerCase();
      allAirports = allAirports.filter(city => city.code.toLowerCase() !== fromCode);
    }

    this.activeSuggestions[target] = allAirports.sort((a, b) => {
      const aIsIndia = (a.country && (a.country.toLowerCase() === 'india' || a.country.toUpperCase() === 'IN'));
      const bIsIndia = (b.country && (b.country.toLowerCase() === 'india' || b.country.toUpperCase() === 'IN'));
      if (aIsIndia && !bIsIndia) return -1;
      if (!aIsIndia && bIsIndia) return 1;
      return 0;
    });
  }

  selectCity(cityName: string, cityCode: string, target: string, event?: Event) {
    // Prevent event bubbling and default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Close suggestions immediately to prevent reopening
    this.activeSuggestions[target] = [];

    // Close edit field immediately to prevent blur from reopening
    const fieldName = target === 'summary-from' ? 'from' : 'to';
    this.editField = null;

    if (target === 'summary-from') {
      // Update form control with code (for form submission)
      this.modifySearchForm.patchValue({ from: cityCode });
      // Update display data immediately
      this.flightInputData['fromCity'] = cityName;
      this.flightInputData['fromAirportCode'] = cityCode;
      // Find airport details
      const airport = this.flightAirports.find(a => a.code === cityCode);
      if (airport) {
        // Only set airport name if it's different from city name to avoid duplication
        if (airport.airport && airport.airport.toLowerCase() !== cityName.toLowerCase()) {
          this.flightInputData['fromAirport'] = airport.airport;
        } else {
          this.flightInputData['fromAirport'] = '';
        }
        this.flightInputData['fromCountry'] = airport.country || airport.state || '';
      }
    } else if (target === 'summary-to') {
      // Update form control with code (for form submission)
      this.modifySearchForm.patchValue({ to: cityCode });
      // Update display data immediately
      this.flightInputData['toCity'] = cityName;
      this.flightInputData['toAirportCode'] = cityCode;
      // Find airport details
      const airport = this.flightAirports.find(a => a.code === cityCode);
      if (airport) {
        // Only set airport name if it's different from city name to avoid duplication
        if (airport.airport && airport.airport.toLowerCase() !== cityName.toLowerCase()) {
          this.flightInputData['toAirport'] = airport.airport;
        } else {
          this.flightInputData['toAirport'] = '';
        }
        this.flightInputData['toCountry'] = airport.country || airport.state || '';
      }
    }

    // Don't auto-search, let user click modify search button
  }

  onFromInputChange(value: string) {
    this.flightInputData['fromCity'] = value;
    // Clear airport code and related fields when user types to allow blank input
    if (!value || value.trim() === '') {
      this.flightInputData['fromAirportCode'] = '';
      this.flightInputData['fromAirport'] = '';
      this.modifySearchForm.patchValue({ from: '' });
    }
    this.showCitySuggestions(value, 'summary-from');
  }

  onToInputChange(value: string) {
    this.flightInputData['toCity'] = value;
    // Clear airport code and related fields when user types to allow blank input
    if (!value || value.trim() === '') {
      this.flightInputData['toAirportCode'] = '';
      this.flightInputData['toAirport'] = '';
      this.modifySearchForm.patchValue({ to: '' });
    }
    this.showCitySuggestions(value, 'summary-to');
  }

  onFromBlur() {
    // Only close if editField is still 'from' (not closed by selectCity)
    // Use a delay to allow selectCity to close the field first
    setTimeout(() => {
      if (this.editField === 'from') {
        // Restore previous value if user didn't select anything
        // The value is already in flightInputData, so it will display correctly
        this.closeCitySuggestions('summary-from');
        this.editField = null;
      }
    }, 150);
  }

  onToBlur() {
    // Only close if editField is still 'to' (not closed by selectCity)
    // Use a delay to allow selectCity to close the field first
    setTimeout(() => {
      if (this.editField === 'to') {
        // Restore previous value if user didn't select anything
        // The value is already in flightInputData, so it will display correctly
        this.closeCitySuggestions('summary-to');
        this.editField = null;
      }
    }, 150);
  }

  isCityArray(value: any): boolean {
    return Array.isArray(value);
  }

  closeCitySuggestions(target: string) {
    // Only close if not clicking on a suggestion
    // Use a shorter timeout to prevent conflicts
    setTimeout(() => {
      // Check if editField is still active before closing
      if (this.editField !== (target === 'summary-from' ? 'from' : 'to')) {
        this.activeSuggestions[target] = [];
      }
    }, 150);
  }

  // Travelers Panel Methods (like homepage)
  toggleTravelersPanel() {
    this.isTravelersOpen = !this.isTravelersOpen;
  }

  closeTravelersPanel() {
    this.isTravelersOpen = false;
    this.editField = null;
    this.updateTotalPassengers();
    this.onModifySearch();
  }

  canDecrease(type: 'adults' | 'children' | 'infants'): boolean {
    if (!this.counts || this.counts.adults === undefined) {
      // Fallback to form values
      const form = this.modifySearchForm.value;
      if (type === 'adults') {
        return (form.adults || 1) > 1;
      }
      return (form[type] || 0) > 0;
    }
    if (type === 'adults') {
      return this.counts.adults > 1;
    }
    return this.counts[type] > 0;
  }

  updateCount(type: 'adults' | 'children' | 'infants', delta: number) {
    if (!this.counts || this.counts.adults === undefined) {
      // Initialize counts from form
      const form = this.modifySearchForm.value;
      this.counts = {
        adults: form.adults || 1,
        children: form.children || 0,
        infants: form.infants || 0
      };
    }

    if (delta < 0 && !this.canDecrease(type)) {
      return;
    }
    this.counts[type] = Math.max(0, this.counts[type] + delta);
    if (type === 'adults' && this.counts.adults < 1) {
      this.counts.adults = 1;
    }
    // Sync with existing variables
    this.adults = this.counts.adults;
    this.children = this.counts.children;
    this.infants = this.counts.infants;
    this.updateTotalPassengers();
  }

  getTravelersText(): string {
    if (this.counts && this.counts.adults !== undefined) {
      const total = this.counts.adults + this.counts.children + this.counts.infants;
      return `${total} ${total > 1 ? 'Travellers' : 'Traveller'}`;
    }
    return `${this.totalPassengers} ${this.totalPassengers > 1 ? 'Travellers' : 'Traveller'}`;
  }

  updateClass(classType: string) {
    this.selectedClass = classType;
    this.modifySearchForm.patchValue({ travelClass: classType.charAt(0).toUpperCase() + classType.slice(1) });
  }

  getGroupDuration(segments: any[]): string {
    if (!segments || segments.length === 0) return '0h 0m';
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    const dep = new Date(firstSeg.Origin.DepTime);
    const arr = new Date(lastSeg.Destination.ArrTime);
    const diffMs = arr.getTime() - dep.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h ${mins}m`;
  }

  // Flight Details Popup Logic
  showFlightDetailsPopup = false;
  popupFlightOnward: any = null;
  popupFlightReturn: any = null;
  activePopupTab: 'onward' | 'return' = 'onward';
  popupDetailsTab: 'flight' | 'fare' | 'cancellation' | 'dateChange' = 'flight';

  openRoundTripFlightDetails(flight: any, type: 'onward' | 'return') {
    this.showFlightDetailsPopup = true;
    this.activePopupTab = type;
    if (type === 'onward') {
      this.popupFlightOnward = flight;
      this.popupFlightReturn = this.selectedReturn || null;
    } else {
      this.popupFlightReturn = flight;
      this.popupFlightOnward = this.selectedOutbound || null;
    }
    this.popupDetailsTab = 'flight';
  }

  closeFlightDetailsPopup() {
    this.showFlightDetailsPopup = false;
    this.popupFlightOnward = null;
    this.popupFlightReturn = null;
  }

  switchPopupTab(tab: 'onward' | 'return') {
    this.activePopupTab = tab;
  }

  switchPopupDetailsTab(tab: 'flight' | 'fare' | 'cancellation' | 'dateChange') {
    this.popupDetailsTab = tab;
  }
}

