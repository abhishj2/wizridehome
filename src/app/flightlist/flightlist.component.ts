import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription, take } from 'rxjs';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import { FlightData } from '../interface/flight-data';
import Swal from 'sweetalert2';

type FooterTab = 'flight' | 'fare' | 'cancellation' | 'dateChange';

@Component({
  selector: 'app-flightlist',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
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

  cities: any[] = [];
  flightAirports: any[] = [];

  travelClasses = ['Economy', 'Premium Economy', 'Business', 'First'];
  
  isHeaderSticky: boolean = false;
  showModifyForm: boolean = false;

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
  highlightedDate: any = '';
  initialScrollIndex: number = -1;

  @ViewChild('fareScrollContainer') fareScrollContainer!: ElementRef;
  showFareModal = false;
  showFareModalBoth = false;

  flightType: any = '';

  outboundFlights: any[] = [];
  returnFlights: any[] = [];
  selectedOutbound: any = null;
  selectedReturn: any = null;

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
  selectedMulticityTab = 0;
  multicityTabData: any[] = [];
  multicitySelectedFares: { [index: number]: any } = {};
  farePanelExpanded: boolean[] = [];

  groupedFlights: any[] = [];
  groupedFlightsOutbound: any[] = [];
  selectedFlight: any = null;
  originalGroupedFlights: any[] = [];
  originalGroupedFlightsOutbound: any[] = [];

  selectedFareOptions: { [key: number]: any } = {};

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
                airport: airportName || cityName
              };
            });
            // Also populate flightAirports for consistency
            this.flightAirports = [...this.cities];
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
        
        this.modifySearchForm.patchValue({
          from: this.flightInputData['fromAirportCode'] || '',
          to: this.flightInputData['toAirportCode'] || '',
          departureDate: this.flightInputData['departureDate'] || '',
          returnDate: this.flightInputData['returnDate'] || '',
          adults: this.flightInputData['adults'] || 1,
          children: this.flightInputData['children'] || 0,
          infants: this.flightInputData['infants'] || 0,
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
      this.loader = false;
      // Multi-city handling will be implemented later
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
      2
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
      2
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.isBrowser) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isHeaderSticky = scrollPosition > 50;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        if (this.scrollContainer && this.initialScrollIndex >= 0) {
          this.centerScrollToIndex(this.initialScrollIndex);
        }
      });
    }
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

  selectDateFromSlider(date: string, index: number): void {
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
        2
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

    // Filter to show 31 days from selected date (or from today if no selection)
    const referenceDate = selected ? new Date(selected + 'T00:00:00') : new Date();
    // Strip time for comparison
    const refDateOnly = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
    const endDate = new Date(refDateOnly);
    endDate.setDate(endDate.getDate() + 31); // Add 31 days
    
    console.log('Filtering dates from', refDateOnly.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);
    console.log('Total sorted entries before filter:', sortedEntries.length);
    console.log('Sample entries:', sortedEntries.slice(0, 5).map(e => ({ date: e.date, price: e.price })));
    
    // Create a map of existing fare data for quick lookup
    const fareDataMap = new Map<string, any>();
    sortedEntries.forEach(item => {
      const itemDateStr = item.date.split('T')[0];
      fareDataMap.set(itemDateStr, item);
    });
    
    // Generate all 31 dates from selected date, filling in fare data where available
    const allDates: { date: string; price: number; isLowest: boolean }[] = [];
    
    for (let i = 0; i < 31; i++) {
      const currentDate = new Date(refDateOnly);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = this.formatToISO(currentDate);
      
      // Check if we have fare data for this date
      const existingFare = fareDataMap.get(dateStr);
      if (existingFare) {
        allDates.push(existingFare);
      } else {
        // Add date with 0 price if no fare data available (will show as unavailable)
        allDates.push({
          date: dateStr,
          price: 0,
          isLowest: false
        });
      }
    }
    
    this.datePrices = allDates;
    console.log('Generated', allDates.length, 'dates for slider');
    console.log('Dates with prices:', allDates.filter(d => d.price > 0).length);
    console.log('Sample dates:', allDates.slice(0, 10).map(e => ({ date: e.date, price: e.price })));

    const selectedIndex = this.datePrices.findIndex(item => item.date === selected);
    if (selectedIndex >= 0) {
      this.highlightedDate = selected;
      this.initialScrollIndex = selectedIndex;
      this.cdr.detectChanges();
      if (this.isBrowser) {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
          this.centerScrollToIndex(selectedIndex);
        });
      }
      return;
    }

    const selectedTime = new Date(selected).getTime();
    let nearest = this.datePrices.reduce((prev, curr) => {
      const currTime = new Date(curr.date).getTime();
      const prevTime = new Date(prev.date).getTime();
      return Math.abs(currTime - selectedTime) < Math.abs(prevTime - selectedTime) ? curr : prev;
    });

    this.highlightedDate = nearest.date;
    const nearestIndex = this.datePrices.findIndex(item => item.date === nearest.date);
    this.initialScrollIndex = nearestIndex;
    this.cdr.detectChanges();
    if (this.isBrowser) {
      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        this.centerScrollToIndex(nearestIndex);
      });
    }
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
            logo: `assets/logos/${firstSegment.Airline.AirlineCode}.png`,
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
            logo: `assets/logos/${firstSegment.Airline.AirlineCode}.png`,
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

    const generate = (flights: any[]) => {
      const airlineSet = new Set<string>();
      const stopSet = new Set<number>();
      const prices: number[] = [];

      for (const flight of flights) {
        if (flight.airline) airlineSet.add(flight.airline);
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
    };

    this.roundtripDynamicFiltersOnward = generate(this.originalGroupedFlights || this.groupedFlights);
    this.roundtripDynamicFiltersReturn = generate(this.originalGroupedFlightsOutbound || this.groupedFlightsOutbound);
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

  toggleDepartureSlot(label: string): void {
    if (this.selectedDepartureSlots.has(label)) {
      this.selectedDepartureSlots.delete(label);
    } else {
      this.selectedDepartureSlots.add(label);
    }
    this.applyAllFilters();
  }

  getStopsCount(flight: any): number {
    return flight.Segments?.[0]?.length > 0 ? flight.Segments[0].length - 1 : 0;
  }

  applyAllFilters(): void {
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
      // Don't toggle if clicking on button or interactive elements
      const target = event.target as HTMLElement;
      if (target.closest('.btn') || target.closest('.dropdown') || target.closest('button')) {
        return;
      }
    }
    
    this.flightDetailsExpanded = this.flightDetailsExpanded.map((_, i) => i === index ? !this.flightDetailsExpanded[i] : false);
    this.farePanelExpanded[index] = false;
    
    if (this.flightDetailsExpanded[index] && this.groupedFlights && this.groupedFlights[index]) {
      const flight = this.groupedFlights[index];
      this.activeTabs[index] = 'flight';
      
      // Find and set the lowest fare option for this flight
      if (flight.FareOptions && flight.FareOptions.length > 0) {
        const lowestFare = flight.FareOptions.reduce((a: any, b: any) => {
          const fareA = a?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
          const fareB = b?.Fare?.PublishedFare || Number.MAX_SAFE_INTEGER;
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
    this.selectedFlight = flight;
    this.showFareModal = true;
    console.log("Selected flight for fare options:", this.selectedFlight);
    console.log("Available fare options:", this.selectedFlight?.FareOptions?.length || 0);
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

  // Both-way methods
  selectBothwayOutbound(flight: any): void {
    console.log("Selected Outbound", flight);
    this.selectedOutbound = flight;
    this.footerTabBothwayOutbound = 'flight';
  }

  selectBothwayReturn(flight: any): void {
    console.log("Selected Return", flight);
    this.selectedReturn = flight;
    this.footerTabBothwayReturn = 'flight';
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

  openFareOptionsModalBothway(): void {
    this.showFareModalBoth = true;
    this.activeFareTab = 'departure';
  }

  closeFareOptionsModalBothWay(): void {
    this.showFareModalBoth = false;
  }

  selectFareTab(tab: 'departure' | 'return'): void {
    this.activeFareTab = tab;
  }

  selectFare(type: 'departure' | 'return', index: number): void {
    this.selectedFareIndex[type] = index;
    if (type === 'departure') {
      this.selectFareTab('return');
    }
  }

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
    const form = this.modifySearchForm.value;
    const total = +form.adults + +form.children + +form.infants;
    this.totalPassengers = total;
  }

  closePassengerDropdown(): void {
    this.showPassengerDropdown = false;
  }

  // Finalize selection
  finalizeSelection(fare: any): void {
    console.log("Fare Selected", fare);
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

  // Multi-city methods (placeholder for future implementation)
  selectMulticityTab(index: number): void {
    this.selectedMulticityTab = index;
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

  selectMulticityFare(tabIndex: number, flightIndex: number, fare: any): void {
    // Implementation for multi-city fare selection
  }

  get multicityTotalFare(): number {
    return Object.values(this.multicitySelectedFares).reduce((sum, f: any) => sum + (f?.price || 0), 0);
  }

  get multicityHasSelectedFares(): boolean {
    return Object.keys(this.multicitySelectedFares).length > 0;
  }

  toggleFarePanel(index: number): void {
    this.farePanelExpanded = this.farePanelExpanded.map((_, i) => i === index ? !this.farePanelExpanded[i] : false);
    this.flightDetailsExpanded[index] = false;
  }
}

