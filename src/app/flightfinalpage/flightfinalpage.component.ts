import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  Inject,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs'; 
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import Swal from 'sweetalert2';
import { PhoneDialerComponent } from '../shared/phone-dialer/phone-dialer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-flightfinalpage',
  standalone: true,
  imports: [CommonModule, FormsModule,PhoneDialerComponent],
  templateUrl: './flightfinalpage.component.html',
  styleUrls: ['./flightfinalpage.component.css']
})
export class FlightfinalpageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactMobileInput') contactMobileInput!: ElementRef<HTMLInputElement>;

  // [Variable Declarations]
  fareQuote: any = [];
  ssrValues: any = [];
  ssrValuesReturn: any = [];
  traceid: any = '';
  ipAddress: any = '';
  tboToken: any = '';
  resultIndex: any = '';
  resultIndexReturn: any = '';
  @ViewChildren('segmentCards') segmentCards!: QueryList<ElementRef>;
  @ViewChild('seatCarousel') seatCarousel!: ElementRef;
  
  // State Variables
  activeSeatIndex: number = 0;
  activeMealIndex: number = 0;
  totalSpecialServiceCharges: number = 0;
  extraBaggageAvailable: boolean = false;
  extraBaggageAvailableReturn: boolean = false;
  
  // Baggage & Meals
  baggageOptions: any[] = [];
  baggageOptionsReturn: any[] = [];
  selectedBaggageCounts: { [key: string]: number } = {};
  selectedBaggageCountsReturn: { [key: string]: number } = {};
  baggageTotal: number = 0;
  baggageTotalReturn: number = 0;

  // Selected SSRs
  selectedBaggage: any[] = [];
  selectedMeals: any[] = [];
  
  // Segments
  flightSegments: any[] = [];
  flightSegmentsReturn: any[] = [];
  
  // Seats
  totalMealCharges: number = 0;
  seatMap: any[] = [];
  seatMapReturn: any[] = [];
  selectedSeats: { [segmentIndex: number]: any[] } = {};
  selectedSeatsReturn: { [segmentIndex: number]: any[] } = {};

  showPhoneDialer = false;
  activePhoneField: 'primary' | null = null;
  
  private subscriptions: Subscription = new Subscription();
  
  // Passengers & Fares
  totalAdults: number = 0;
  totalChildren: number = 0;
  totalInfants: number = 0;
  
  // Fare Variables Outbound
  adultBaseFare: any = 0;
  childrenBaseFare: any = 0;
  infantBaseFare: any = 0;
  adultTaxes: any = 0;
  childrenTaxes: any = 0;
  infantTaxes: any = 0;
  
  // Totals
  totalBaseFare: any = 0;
  totalAdultBaseFare: any = 0;
  totalChildrenBaseFare: any = 0;
  totalInfantBaseFare: any = 0;
  totalAdultTaxes: any = 0;
  totalChildrenTaxes: any = 0;
  totalInfantTaxes: any = 0;
  totalTaxes: any = 0;
  totalOtherService: any = 0;
  totalFreeDateChange: any = 0;
  totalTripSecure: any = 0;
  totalSeats: any = 0;
  finalAmount: any = 0;
  
  // Data Containers
  fullFlightData: any = [];
  flightDataDeparture: any = [];
  flightDataReturn: any = [];
  
  // Policies
  cancellationPolicy: any[] = [];
  dateChangePolicy: any[] = [];
  cancellationPolicyReturn: any[] = [];
  dateChangePolicyReturn: any[] = [];
  
  totalFlightDuration: string = '';
  stopSummary: string = '';
  totalFlightDurationReturn: string = '';
  stopSummaryReturn: string = '';
  
  fareQuoteReturn: any;
  
  // Fare Return
  adultBaseFareReturn: number = 0;
  childrenBaseFareReturn: number = 0;
  infantBaseFareReturn: number = 0;
  adultTaxesReturn: number = 0;
  childrenTaxesReturn: number = 0;
  infantTaxesReturn: number = 0;
  
  loader: boolean = true;
  passportInfoRequired: boolean = false;
  
  // Form Data
  travellers: any[] = [];
  children: any[] = [];
  infants: any[] = [];
  
  // Dropdown Data
  days: string[] = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: string[] = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => (1900 + i).toString()).reverse();
  passportExpiryYears: number[] = [];
  
  contact = {
    countryCode: '91',
    mobile: '',
    email: '',
    hasGST: false
  };
  
  gstInfo = {
    companyName: '',
    registrationNo: ''
  };
  
  // Flags & UI
  isCompanyNameValid: boolean = true;
  isRegistrationValid: boolean = true;
  continueClicked = false;
  showModal: boolean = false;
  selectedTab: 'cancel' | 'change' = 'cancel';
  activeTab: 'cancel' | 'reschedule' = 'cancel';
  
  // Flag to prevent double execution of baggage done handler
  private isProcessingBaggageDone: boolean = false;
  gstMandatoryOnward: boolean = false;
  gstMandatoryReturn: boolean = false;
  selectedState: string = 'West Bengal';
  showFareRuleModal: boolean = false;
  fareRuleText: SafeHtml = '';
  fareRuleTextReturn: SafeHtml = '';
  bookingSubmitted: boolean = false;
  private ssrFetched: boolean = false;
  
  // --- MISSING PROPERTIES ADDED HERE ---
  termsAccepted: boolean = false;
  servicesUnlocked: boolean = false;
  termsAgreed: boolean = false;
  
  // Trip Type
  tripType: 'oneway' | 'roundtrip' | 'multicity' = 'oneway';
  
  // Modal States
  showTripSummary: boolean = false;
  showFareSummaryModal: boolean = false;
  private _showAddBaggageModal: boolean = false;
  showPolicyModal: boolean = false;
  showGSTModal: boolean = false;
  showPassengerModal: boolean = false;
  showFareRules: boolean = false;
  
  // Tab States
  activeBaggageTab: 'onward' | 'return' = 'onward';
  activePolicyTab: 'onward' | 'return' = 'onward';
  activeTripTab: 'onward' | 'return' = 'onward';
  activePolicyLeg: 'departure' | 'return' = 'departure';
  activePolicySubTab: 'cancel' | 'reschedule' = 'cancel';
  activeRoundBaggageTab: 'onward' | 'return' = 'onward';
  fareTab: 'onward' | 'return' = 'onward';
  
  // Passenger Arrays (aliases for mobile template compatibility)
  get adults() { return this.travellers; }
  // Note: children and infants are already defined as properties above
  
  // GST Details (alias for mobile template)
  gstDetails: any = {
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    gstNumber: ''
  };
  
  // Passenger Modal
  currentPassengerType: 'adult' | 'child' | 'infant' = 'adult';
  currentPassengerIndex: number = 0;
  currentPassengerDetails: any = null;
  get passengers() { return [...this.travellers, ...this.children, ...this.infants]; }
  
  // Baggage Counts (for mobile template)
  baggageCounts: { [key: number]: number } = {};
  onwardBaggageCounts: { [key: number]: number } = {};
  returnBaggageCounts: { [key: number]: number } = {};
  maxAllowedBaggageCount: number = 0;
  
  // Fare Summary
  onwardFareSummary: any = {};
  returnFareSummary: any = {};
  travelerCount: number = 0;
  baggagePrices: any = {};
  
  // Date properties
  departureDate: Date | null = null;
  returnDate: Date | null = null;
  
  // Additional flags
  panInfoRequired: boolean = false;
  isUnifiedSegmentFormat: boolean = false;
  
  // Multicity support
  flightSegmentGroups: any[] = [];
  groupedFlightSegments: any[] = [];
  activeTabIndex: number = 0;
  activeCancelTabIndex: number = 0;
  
  // Math reference for template
  Math = Math;
  // -------------------------------------

  states: string[] = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  // UI Toggles
  baggageModalOpenOutbound: boolean = false;
  baggageModalOpenReturn: boolean = false;
  expanded = { base: false, taxes: false, services: false };
  activeServiceTab: 'seats' | 'meals' | 'services' = 'seats';
  activeJourneyTab: 'departure' | 'return' = 'departure';

  // LCC Check
  isLCC: boolean = false;
  fareCommonDetail: any = {};
  adultFareDetail: any = {};
  childrenFareDetail: any = {};
  infantFareDetail: any = {};

  constructor(
    public apiService: ApiserviceService,
    public flightDataService: FlightdataService,
    public router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document

  ) {}
isMobileView(): boolean {
  if (!isPlatformBrowser(this.platformId)) return false;
  return window.innerWidth <= 768;
}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const w = window as any;
      if (w.testhidemenu && typeof w.testhidemenu === 'function') {
        try {
          w.testhidemenu();
        } catch (e) {
          console.warn('Error executing testhidemenu:', e);
        }
      }
    }


  }

  ngOnInit(): void {
    this.initializePassportExpiryYears();
    
    // Check if we have existing data from service first
    const existingData = this.flightDataService.getCurrentValue();
    let hasProcessedData = false;
    let lastProcessedTraceId = '';
    
    if (existingData) {
      this.processFlightDataInput(existingData);
      hasProcessedData = true;
      lastProcessedTraceId = existingData['traceid'] || '';
    }
    
    this.subscriptions.add(
      this.flightDataService.currentMessage.subscribe((val: any) => {
        if (!val) {
          // Only redirect if we haven't processed any data yet
          if (!hasProcessedData && !this.fullFlightData) {
            // Give a small delay to allow data to be set during navigation
            setTimeout(() => {
              const currentData = this.flightDataService.getCurrentValue();
              if (!currentData && !this.fullFlightData) {
                console.log('No flight data available, redirecting to home');
          this.router.navigate(['/']);
              }
            }, 1000);
          }
          return;
        }
        
        // Prevent processing the same data twice
        const currentTraceId = val['traceid'] || '';
        if (hasProcessedData && currentTraceId === lastProcessedTraceId && !val['proceedToPayment']) {
          // Same data, skip processing unless it's a payment proceed request
          return;
        }
        
        hasProcessedData = true;
        lastProcessedTraceId = currentTraceId;
        const shouldProceedToPayment = val['proceedToPayment'];
        this.processFlightDataInput(val);
        
        // Call fare quote if we need fare data (unless proceeding to payment)
        // Check if we already processed FareBreakdown from departureFlightData
        const hasProcessedFareBreakdown = val['departureFlightData']?.['FareBreakdown'] && Array.isArray(val['departureFlightData']['FareBreakdown']) && val['departureFlightData']['FareBreakdown'].length > 0;
        const isFromFlightList = val['departureFlightData'] && !val['adultBaseFare'] && !val['totalBaseFare'];
        
        console.log('Checking if fare quote should be called:', {
          traceid: this.traceid,
          resultIndex: this.resultIndex,
          shouldProceedToPayment,
          fareQuote: this.fareQuote,
          isFromFlightList,
          hasProcessedFareBreakdown,
          hasAdultBaseFare: !!val['adultBaseFare'],
          hasTotalBaseFare: !!val['totalBaseFare'],
          hasFareBreakdown: hasProcessedFareBreakdown
        });
        
        // Only call fare quote if:
        // 1. We have traceid and resultIndex
        // 2. Not proceeding to payment
        // 3. Don't already have fareQuote
        // 4. Haven't already processed FareBreakdown from the data
        // 5. Don't have fare values already
        if(this.traceid && this.resultIndex && !shouldProceedToPayment && !this.fareQuote && !hasProcessedFareBreakdown) {
          // Call if we don't have fare breakdown data
          if (isFromFlightList || (!val['adultBaseFare'] && !val['totalBaseFare'])) {
            console.log('Calling fare quote API...');
        this.callFareQuote();
          } else {
            console.log('Skipping fare quote - already have fare data');
          }
        } else {
          if (!this.traceid) console.warn('Cannot call fare quote: traceid missing');
          if (!this.resultIndex) console.warn('Cannot call fare quote: resultIndex missing');
          if (shouldProceedToPayment) console.log('Skipping fare quote: proceeding to payment');
          if (this.fareQuote) console.log('Skipping fare quote: already have fareQuote');
          if (hasProcessedFareBreakdown) console.log('Skipping fare quote: already processed FareBreakdown from data');
        }
      })
    );
  }
openPhoneDialer(field: 'primary', event?: Event): void {
  if (!this.isMobileView()) return;

  if (event) {
    event.stopPropagation();
  }

  this.activePhoneField = field;
  this.showPhoneDialer = true;

  if (isPlatformBrowser(this.platformId)) {
    this.renderer.addClass(this.document.body, 'hide-navbar-mobile');
  }

  // Wait for dialer + modal to render, then scroll
  setTimeout(() => {
    this.scrollToContactInput();
  }, 300);
}
private scrollToContactInput(): void {
  if (!isPlatformBrowser(this.platformId) || !this.contactMobileInput) return;

  const el = this.contactMobileInput.nativeElement;

  el.focus({ preventScroll: true });

  const yOffset = -120; // header offset
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
}

private scrollToInput(inputElement: HTMLInputElement): void {
  if (!inputElement || !isPlatformBrowser(this.platformId)) return;

  const rect = inputElement.getBoundingClientRect();
  const currentScrollY = window.scrollY || window.pageYOffset;
  const inputTopPosition = rect.top + currentScrollY;

  const offsetFromTop = 180; // adjust as per your header height
  const targetScrollPosition = inputTopPosition - offsetFromTop;

  window.scrollTo({
    top: Math.max(0, targetScrollPosition),
    behavior: 'smooth'
  });
}
onDialerNumberClick(number: string): void {
  if (!this.activePhoneField || !this.currentPassengerDetails) return;

  const currentValue: string = this.currentPassengerDetails.mobileNumber || '';

  if (currentValue.length < 10) {
    this.currentPassengerDetails = {
      ...this.currentPassengerDetails,
      mobileNumber: currentValue + number
    };
    this.cdr.detectChanges();
  }
}

onDialerBackspace(): void {
  if (!this.activePhoneField || !this.currentPassengerDetails) return;

  const currentValue: string = this.currentPassengerDetails.mobileNumber || '';

  if (currentValue.length > 0) {
    this.currentPassengerDetails = {
      ...this.currentPassengerDetails,
      mobileNumber: currentValue.slice(0, -1)
    };
    this.cdr.detectChanges();
  }
}

onDialerDone(): void {
  this.showPhoneDialer = false;
  this.activePhoneField = null;
}

closePhoneDialer(): void {
  this.showPhoneDialer = false;
  this.activePhoneField = null;

  if (isPlatformBrowser(this.platformId)) {
    this.renderer.removeClass(this.document.body, 'hide-navbar-mobile');
  }
}

getCurrentDialerValue(): string {
  if (!this.activePhoneField || !this.currentPassengerDetails) return '';
  return this.currentPassengerDetails.mobileNumber || '';
}
  processFlightDataInput(val: any) {
    // Merge with existing data instead of completely replacing
    this.fullFlightData = { ...this.fullFlightData, ...val };
    
    // Only update if new value is provided and not null/undefined
    if (val['ipAddress']) {
    this.ipAddress = val['ipAddress'];
    }
    if (val['tboToken']) {
    this.tboToken = val['tboToken'];
    }
    if (val['traceid']) {
    this.traceid = val['traceid'];
    }
    
    // Handle different data structures from flight list vs addon page
    // Flight list passes fare objects, addon page passes processed data
    // Only update if new data is provided
    if (val['departureFlightData']) {
    this.flightDataDeparture = val['departureFlightData'];
      console.log('Processing departureFlightData:', this.flightDataDeparture);
      
      // Extract ResultIndex from different possible structures
      // Based on console log, ResultIndex is directly on departureFlightData (at index 10 in keys array)
      let newResultIndex = val['departureFlightData']?.['ResultIndex']  // Direct property (most common from flight list)
                      || val['departureFlightData']?.['Response']?.['Results']?.['ResultIndex'] 
                      || val['departureFlightData']?.['Fare']?.['ResultIndex']
                      || val['departureFlightData']?.['selectedFare']?.['Response']?.['Results']?.['ResultIndex']
                      || val['departureFlightData']?.['selectedFare']?.['ResultIndex']
                      || val['departureFlightData']?.['selectedFare']?.['Fare']?.['ResultIndex']
                      || val['resultIndex'];
      
      console.log('Extracted ResultIndex:', newResultIndex, 'from departureFlightData');
      
      // Check if we already have FareBreakdown in departureFlightData (from flight list)
      // If so, we can process it directly without calling fare quote API
      if (val['departureFlightData']?.['FareBreakdown'] && Array.isArray(val['departureFlightData']['FareBreakdown']) && val['departureFlightData']['FareBreakdown'].length > 0) {
        console.log('Found FareBreakdown directly in departureFlightData, processing it immediately...');
        // Process fare breakdown directly from the data
        const fareData = {
          Response: {
            Results: {
              FareBreakdown: val['departureFlightData']['FareBreakdown'],
              IsLCC: val['departureFlightData']['IsLCC']
            }
          }
        };
        this.processFareBreakdown(fareData, false);
        // Aggregate fare summary immediately after processing
        this.aggregateFareSummary();
        this.loader = false;
        this.cdr.detectChanges();
      } else {
        console.log('No FareBreakdown found in departureFlightData, will call fare quote API');
      }
      
      if (newResultIndex) {
        this.resultIndex = newResultIndex;
        console.log('Set resultIndex to:', this.resultIndex);
      } else {
        console.warn('Could not extract ResultIndex from departureFlightData. Structure:', Object.keys(this.flightDataDeparture || {}));
      }
    } else if (val['resultIndex'] && !this.resultIndex) {
      this.resultIndex = val['resultIndex'];
      console.log('Set resultIndex from val.resultIndex:', this.resultIndex);
    }
    
    if (val['returnFlightData']) {
    this.flightDataReturn = val['returnFlightData'];
      // Extract ResultIndex from different possible structures
      // ResultIndex is directly on returnFlightData (same as departure)
      const newResultIndexReturn = val['returnFlightData']?.['ResultIndex']  // Direct property
                            || val['returnFlightData']?.['Response']?.['Results']?.['ResultIndex']
                            || val['returnFlightData']?.['selectedFare']?.['Response']?.['Results']?.['ResultIndex']
                            || val['resultIndexReturn'];
      if (newResultIndexReturn) {
        this.resultIndexReturn = newResultIndexReturn;
        console.log('Set resultIndexReturn to:', this.resultIndexReturn);
      }
      
      // Check if we already have FareBreakdown in returnFlightData
      if (val['returnFlightData']?.['FareBreakdown'] && Array.isArray(val['returnFlightData']['FareBreakdown']) && val['returnFlightData']['FareBreakdown'].length > 0) {
        console.log('Found FareBreakdown directly in returnFlightData, processing it immediately...');
        const fareData = {
          Response: {
            Results: {
              FareBreakdown: val['returnFlightData']['FareBreakdown'],
              IsLCC: val['returnFlightData']['IsLCC']
            }
          }
        };
        this.processFareBreakdown(fareData, true);
        // Aggregate fare summary immediately after processing
        this.aggregateFareSummary();
        this.loader = false;
        this.cdr.detectChanges();
      }
    } else if (val['resultIndexReturn'] && !this.resultIndexReturn) {
      this.resultIndexReturn = val['resultIndexReturn'];
      console.log('Set resultIndexReturn from val.resultIndexReturn:', this.resultIndexReturn);
    }
    
    // Set trip type
    const tripTypeVal = val['tripType'] || '';
    if (tripTypeVal === 'round' || tripTypeVal === 'roundtrip') {
      this.tripType = 'roundtrip';
    } else if (tripTypeVal === 'multi' || tripTypeVal === 'multicity') {
      this.tripType = 'multicity';
    } else {
      this.tripType = 'oneway';
    }
    
    // Set passenger counts from data if available
    // Handle both formats: 'adults' (from flight list) and 'totalAdults' (from addon page)
    // Priority: totalAdults > adults > existing value
    if (val['totalAdults'] !== undefined && val['totalAdults'] !== null && val['totalAdults'] > 0) {
      this.totalAdults = val['totalAdults'];
    } else if (val['adults'] !== undefined && val['adults'] !== null && val['adults'] > 0) {
      this.totalAdults = val['adults'];
    }
    // If still 0, keep existing value (don't reset to 0)
    
    if (val['totalChildren'] !== undefined && val['totalChildren'] !== null && val['totalChildren'] > 0) {
      this.totalChildren = val['totalChildren'];
    } else if (val['children'] !== undefined && val['children'] !== null && val['children'] > 0) {
      this.totalChildren = val['children'];
    }
    
    if (val['totalInfants'] !== undefined && val['totalInfants'] !== null && val['totalInfants'] > 0) {
      this.totalInfants = val['totalInfants'];
    } else if (val['infants'] !== undefined && val['infants'] !== null && val['infants'] > 0) {
      this.totalInfants = val['infants'];
    }
    
    console.log(`Passenger counts set - Adults: ${this.totalAdults}, Children: ${this.totalChildren}, Infants: ${this.totalInfants}`);
    
    // Set dates
    if (val['departureDate']) {
      this.departureDate = new Date(val['departureDate']);
    }
    if (val['returnDate']) {
      this.returnDate = new Date(val['returnDate']);
    }

    // Process segments from flight data
    // Handle different data structures: from flight list vs from addon page
    if (this.flightDataDeparture) {
      // Check different possible structures
      let segmentData = null;
      
      // Structure 1: Response.Results.Segments (from API response)
      if (this.flightDataDeparture.Response?.Results?.Segments) {
        segmentData = { Segments: [this.flightDataDeparture.Response.Results.Segments] };
      }
      // Structure 2: Direct Segments array
      else if (this.flightDataDeparture.Segments) {
        segmentData = this.flightDataDeparture;
      }
      // Structure 3: selectedFare.Response.Results.Segments
      else if (this.flightDataDeparture.selectedFare?.Response?.Results?.Segments) {
        segmentData = { Segments: [this.flightDataDeparture.selectedFare.Response.Results.Segments] };
      }
      // Structure 4: selectedFare.Segments
      else if (this.flightDataDeparture.selectedFare?.Segments) {
        segmentData = this.flightDataDeparture.selectedFare;
      }
      
      if (segmentData && segmentData.Segments && segmentData.Segments[0]) {
        this.processSegments(segmentData, false);
      }
    }

    if (this.flightDataReturn) {
      // Check different possible structures
      let segmentData = null;
      
      // Structure 1: Response.Results.Segments (from API response)
      if (this.flightDataReturn.Response?.Results?.Segments) {
        segmentData = { Segments: [this.flightDataReturn.Response.Results.Segments] };
      }
      // Structure 2: Direct Segments array
      else if (this.flightDataReturn.Segments) {
        segmentData = this.flightDataReturn;
      }
      // Structure 3: selectedFare.Response.Results.Segments
      else if (this.flightDataReturn.selectedFare?.Response?.Results?.Segments) {
        segmentData = { Segments: [this.flightDataReturn.selectedFare.Response.Results.Segments] };
      }
      // Structure 4: selectedFare.Segments
      else if (this.flightDataReturn.selectedFare?.Segments) {
        segmentData = this.flightDataReturn.selectedFare;
      }
      
      if (segmentData && segmentData.Segments && segmentData.Segments[0]) {
        this.processSegments(segmentData, true);
      }
    }
    
    // Restore passenger data if available (from addon page)
    // Always ensure passengers are initialized if we have counts
    if (val['travellers'] && Array.isArray(val['travellers']) && val['travellers'].length > 0) {
      // Restore existing passenger data
      this.travellers = val['travellers'].map((t: any) => ({ ...t })); // Create new array with new objects
      // Ensure we have the right number of passengers
      while (this.travellers.length < this.totalAdults) {
        this.travellers.push(this.getBlankAdult());
      }
      // Trim if we have too many
      if (this.travellers.length > this.totalAdults) {
        this.travellers = this.travellers.slice(0, this.totalAdults);
      }
    } else if (this.totalAdults > 0) {
      // Initialize blank passengers if we have a count
      try {
        this.travellers = Array(this.totalAdults).fill(0).map(() => this.getBlankAdult());
      } catch (e) {
        console.error('Error initializing travellers:', e);
        this.travellers = [];
      }
    } else if (!this.travellers) {
      this.travellers = [];
    }
    
    if (val['children'] && Array.isArray(val['children']) && val['children'].length > 0) {
      // Restore existing passenger data
      this.children = val['children'].map((c: any) => ({ ...c })); // Create new array with new objects
      // Ensure we have the right number of passengers
      while (this.children.length < this.totalChildren) {
        this.children.push(this.getBlankChild());
      }
      // Trim if we have too many
      if (this.children.length > this.totalChildren) {
        this.children = this.children.slice(0, this.totalChildren);
      }
    } else if (this.totalChildren > 0) {
      // Initialize blank passengers if we have a count
      try {
        this.children = Array(this.totalChildren).fill(0).map(() => this.getBlankChild());
      } catch (e) {
        console.error('Error initializing children:', e);
        this.children = [];
      }
    } else if (!this.children) {
      this.children = [];
    }
    
    if (val['infants'] && Array.isArray(val['infants']) && val['infants'].length > 0) {
      // Restore existing passenger data
      this.infants = val['infants'].map((i: any) => ({ ...i })); // Create new array with new objects
      // Ensure we have the right number of passengers
      while (this.infants.length < this.totalInfants) {
        this.infants.push(this.getBlankInfant());
      }
      // Trim if we have too many
      if (this.infants.length > this.totalInfants) {
        this.infants = this.infants.slice(0, this.totalInfants);
      }
    } else if (this.totalInfants > 0) {
      // Initialize blank passengers if we have a count
      try {
        this.infants = Array(this.totalInfants).fill(0).map(() => this.getBlankInfant());
      } catch (e) {
        console.error('Error initializing infants:', e);
        this.infants = [];
      }
    } else if (!this.infants) {
      this.infants = [];
    }
    
    // Restore contact and GST details
    if (val['contact']) {
      this.contact = { ...this.contact, ...val['contact'] };
    }
    if (val['gstDetails']) {
      this.gstDetails = { ...this.gstDetails, ...val['gstDetails'] };
    }
    if (val['termsAgreed'] !== undefined) {
      this.termsAgreed = val['termsAgreed'];
    }
    
    // Restore baggage data
    if (val['baggageOptions']) {
      this.baggageOptions = val['baggageOptions'];
    }
    if (val['baggageOptionsReturn']) {
      this.baggageOptionsReturn = val['baggageOptionsReturn'];
    }
    if (val['baggageTotal'] !== undefined) {
      this.baggageTotal = val['baggageTotal'];
    }
    if (val['baggageTotalReturn'] !== undefined) {
      this.baggageTotalReturn = val['baggageTotalReturn'];
    }
    if (val['selectedBaggageCounts']) {
      this.selectedBaggageCounts = { ...val['selectedBaggageCounts'] };
    }
    if (val['selectedBaggageCountsReturn']) {
      this.selectedBaggageCountsReturn = { ...val['selectedBaggageCountsReturn'] };
    }
    
    // Restore addon data (seats, meals, services)
    if (val['addonData']) {
      const addonData = val['addonData'];
      if (addonData.seats) {
        // Deep copy to avoid reference issues
        this.selectedSeats = JSON.parse(JSON.stringify(addonData.seats.onward || {}));
        this.selectedSeatsReturn = JSON.parse(JSON.stringify(addonData.seats.return || {}));
      }
      // Update total seats price
      if (val['totalSeats'] !== undefined) {
        this.totalSeats = val['totalSeats'];
      } else {
        // Recalculate if not provided
        this.updateSeatTotal();
      }
    }
    
    // Restore seat maps if available
    if (val['seatMap']) {
      this.seatMap = val['seatMap'];
    }
    if (val['seatMapReturn']) {
      this.seatMapReturn = val['seatMapReturn'];
    }
    
    // Restore SSR values
    if (val['ssrValues']) {
      this.ssrValues = val['ssrValues'];
    }
    if (val['ssrValuesReturn']) {
      this.ssrValuesReturn = val['ssrValuesReturn'];
    }
    
    // Restore fare totals and individual fare values
    // Only update if value is provided and not null/undefined
    if (val['adultBaseFare'] !== undefined && val['adultBaseFare'] !== null) {
      this.adultBaseFare = val['adultBaseFare'];
    }
    if (val['childrenBaseFare'] !== undefined && val['childrenBaseFare'] !== null) {
      this.childrenBaseFare = val['childrenBaseFare'];
    }
    if (val['infantBaseFare'] !== undefined && val['infantBaseFare'] !== null) {
      this.infantBaseFare = val['infantBaseFare'];
    }
    if (val['adultTaxes'] !== undefined && val['adultTaxes'] !== null) {
      this.adultTaxes = val['adultTaxes'];
    }
    if (val['childrenTaxes'] !== undefined && val['childrenTaxes'] !== null) {
      this.childrenTaxes = val['childrenTaxes'];
    }
    if (val['infantTaxes'] !== undefined && val['infantTaxes'] !== null) {
      this.infantTaxes = val['infantTaxes'];
    }
    
    // Restore return fare values if roundtrip
    if (val['adultBaseFareReturn'] !== undefined && val['adultBaseFareReturn'] !== null) {
      this.adultBaseFareReturn = val['adultBaseFareReturn'];
    }
    if (val['childrenBaseFareReturn'] !== undefined && val['childrenBaseFareReturn'] !== null) {
      this.childrenBaseFareReturn = val['childrenBaseFareReturn'];
    }
    if (val['infantBaseFareReturn'] !== undefined && val['infantBaseFareReturn'] !== null) {
      this.infantBaseFareReturn = val['infantBaseFareReturn'];
    }
    if (val['adultTaxesReturn'] !== undefined && val['adultTaxesReturn'] !== null) {
      this.adultTaxesReturn = val['adultTaxesReturn'];
    }
    if (val['childrenTaxesReturn'] !== undefined && val['childrenTaxesReturn'] !== null) {
      this.childrenTaxesReturn = val['childrenTaxesReturn'];
    }
    if (val['infantTaxesReturn'] !== undefined && val['infantTaxesReturn'] !== null) {
      this.infantTaxesReturn = val['infantTaxesReturn'];
    }
    
    // Restore fare totals - only update if value is provided and valid
    if (val['totalBaseFare'] !== undefined && val['totalBaseFare'] !== null && val['totalBaseFare'] > 0) {
      this.totalBaseFare = val['totalBaseFare'];
    } else if ((!this.totalBaseFare || this.totalBaseFare === 0) && (this.totalAdults > 0 || this.totalChildren > 0 || this.totalInfants > 0)) {
      // Recalculate if we have passenger counts but no totals
      if (this.adultBaseFare || this.childrenBaseFare || this.infantBaseFare) {
        this.aggregateFareSummary();
      }
    }
    if (val['totalTaxes'] !== undefined && val['totalTaxes'] !== null && val['totalTaxes'] > 0) {
      this.totalTaxes = val['totalTaxes'];
    } else if ((!this.totalTaxes || this.totalTaxes === 0) && (this.totalAdults > 0 || this.totalChildren > 0 || this.totalInfants > 0)) {
      // Recalculate if we have passenger counts but no totals
      if (this.adultTaxes || this.childrenTaxes || this.infantTaxes) {
        this.aggregateFareSummary();
      }
    }
    
    // Initialize baggage counts
    this.maxAllowedBaggageCount = this.totalAdults + this.totalChildren;
    this.travelerCount = this.totalAdults + this.totalChildren + this.totalInfants;
    
    // Check if seat data is available in mobFinalPageData (like in reference component)
    if (val['mobFinalPageData']?.ssr) {
      console.log('Found SSR data in mobFinalPageData:', val['mobFinalPageData'].ssr);
      this.processSSRDataFromFlightData(val['mobFinalPageData'].ssr);
    }
    
    // Update final fare with restored data
    this.updateFinalFare();
    
    // Set loader to false after processing data (unless proceeding to payment)
    if (!val['proceedToPayment']) {
      this.loader = false;
    }
    
    // Check if we should proceed directly to payment (from addon page)
    if (val['proceedToPayment']) {
      // Use setTimeout to ensure UI is updated first
      setTimeout(() => {
        this.loader = true;
        this.proceedToPayment();
      }, 100);
    }
    
    this.loadFareRules();
    this.cdr.detectChanges();
  }
  
  processSSRDataFromFlightData(ssrData: any) {
    // Process onward SSR data
    if (ssrData.onward) {
      console.log('Processing onward SSR data:', ssrData.onward);
      this.parseSeatDataFromSSR(ssrData.onward, false);
    }
    
    // Process return SSR data
    if (ssrData.return && this.tripType === 'roundtrip') {
      console.log('Processing return SSR data:', ssrData.return);
      this.parseSeatDataFromSSR(ssrData.return, true);
    }

    this.attemptSSRFetch();
  }
  
  parseSeatDataFromSSR(ssrData: any, isReturn: boolean) {
    if (!ssrData) return;
    
    // SSR data might be an array of arrays (one per segment)
    const seatMaps: any[] = [];
    
    if (Array.isArray(ssrData)) {
      ssrData.forEach((segmentSSR: any, segmentIndex: number) => {
        if (Array.isArray(segmentSSR)) {
          segmentSSR.forEach((seatItem: any) => {
            if (seatItem && (seatItem.SeatMap || seatItem.Rows)) {
              const seatMap = this.processSeatMap(seatItem.SeatMap || seatItem, seatItem);
              if (seatMap) {
                seatMaps.push(seatMap);
              }
            }
          });
        } else if (segmentSSR && (segmentSSR.SeatMap || segmentSSR.Rows)) {
          const seatMap = this.processSeatMap(segmentSSR.SeatMap || segmentSSR, segmentSSR);
          if (seatMap) {
            seatMaps.push(seatMap);
          }
        }
      });
    } else if (ssrData.SeatMap || ssrData.Rows) {
      // Single seat map
      const seatMap = this.processSeatMap(ssrData.SeatMap || ssrData, ssrData);
      if (seatMap) {
        seatMaps.push(seatMap);
      }
    }
    
    if (isReturn) {
      this.seatMapReturn = seatMaps;
      seatMaps.forEach((_, index) => {
        if (!this.selectedSeatsReturn[index]) {
          this.selectedSeatsReturn[index] = [];
        }
      });
    } else {
      this.seatMap = seatMaps;
      seatMaps.forEach((_, index) => {
        if (!this.selectedSeats[index]) {
          this.selectedSeats[index] = [];
        }
      });
    }
    
    console.log(`Processed ${seatMaps.length} seat maps for ${isReturn ? 'return' : 'onward'}`);
    this.updateSeatTotal();
    this.cdr.detectChanges();
  }

  processSegments(flightData: any, isReturn: boolean) {
    const segments = flightData.Segments?.[0] || [];
    // Clear existing
    if(isReturn) this.flightSegmentsReturn = []; else this.flightSegments = [];
    
    let firstDepTime: Date | null = null;
    let lastArrTime: Date | null = null;
    const stopCities: string[] = [];

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const origin = seg.Origin?.Airport || {};
        const destination = seg.Destination?.Airport || {};
        const depDate = new Date(seg.DepTime || seg.Origin?.DepTime);
        const arrDate = new Date(seg.ArrTime || seg.Destination?.ArrTime);
        
        if (i === 0) firstDepTime = depDate;
        if (i === segments.length - 1) lastArrTime = arrDate;
        
        const durationMins = Math.floor((arrDate.getTime() - depDate.getTime()) / 60000);
        
        const segmentObj: any = {
            airline: seg.Airline?.AirlineName,
            logo: `assets/images/flightimages/${seg.Airline?.AirlineCode}.png`,
            code: `${seg.Airline?.AirlineCode} ${seg.Airline?.FlightNumber}`,
            aircraft: seg.Craft,
            departureTime: this.formatTime(depDate),
            arrivalTime: this.formatTime(arrDate),
            from: origin.CityName,
            fromAirport: `${origin.AirportName}, Terminal ${origin.Terminal || 'N/A'}`,
            to: destination.CityName,
            toAirport: `${destination.AirportName}, Terminal ${destination.Terminal || 'N/A'}`,
            duration: this.formatDuration(durationMins),
            cabinBaggage: seg.CabinBaggage,
            checkInBaggage: seg.Baggage,
            fareTag: seg.SupplierFareClass,
            layover: null,
            originCode: origin.AirportCode,
            destinationCode: destination.AirportCode,
            date: depDate, // For mobile template
            depDate: depDate, // For mobile template
            arrDate: arrDate, // For mobile template
        };

        if (i < segments.length - 1) {
            const nextDep = new Date(segments[i + 1].DepTime || segments[i + 1].Origin?.DepTime);
            const layoverMins = Math.floor((nextDep.getTime() - arrDate.getTime()) / 60000);
            segmentObj.layover = {
                duration: this.formatDuration(layoverMins),
                location: destination.CityName
            };
            stopCities.push(destination.CityName);
        }
        
        if(isReturn) this.flightSegmentsReturn.push(segmentObj);
        else this.flightSegments.push(segmentObj);
    }

    if (firstDepTime && lastArrTime) {
        const totalDuration = this.formatDuration(Math.floor((lastArrTime.getTime() - firstDepTime.getTime()) / 60000));
        const stopTxt = segments.length === 1 ? 'Non-stop' : `${segments.length - 1} stop(s) via ${stopCities.join(', ')}`;
        
        if(isReturn) {
            this.totalFlightDurationReturn = totalDuration;
            this.stopSummaryReturn = stopTxt;
            this.cancellationPolicyReturn = flightData.cancellationPolicy || [];
        } else {
            this.totalFlightDuration = totalDuration;
            this.stopSummary = stopTxt;
            this.cancellationPolicy = flightData.cancellationPolicy || [];
        }
    }
  }

  loadFareRules() {
    this.subscriptions.add(
        this.apiService.getFareRule(this.ipAddress, this.tboToken, this.traceid, this.resultIndex)
        .subscribe((val: any) => {
            const rawHtml = val?.Response?.FareRules?.[0]?.FareRuleDetail || 'Fare rule not available.';
            this.fareRuleText = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
        })
    );
    
    if (this.resultIndexReturn) {
      this.subscriptions.add(
          this.apiService.getFareRule(this.ipAddress, this.tboToken, this.traceid, this.resultIndexReturn)
          .subscribe((val: any) => {
              const rawHtml = val?.Response?.FareRules?.[0]?.FareRuleDetail || 'Fare rule not available.';
              this.fareRuleTextReturn = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
          })
      );
    }
  }

  callFareQuote() {
    console.log('Calling fare quote with:', {
      ipAddress: this.ipAddress,
      tboToken: this.tboToken,
      traceid: this.traceid,
      resultIndex: this.resultIndex,
      totalAdults: this.totalAdults,
      totalChildren: this.totalChildren,
      totalInfants: this.totalInfants
    });
    
    if (!this.resultIndex) {
      console.error('Cannot call fare quote: resultIndex is missing');
      this.loader = false;
      return;
    }
    
    this.subscriptions.add(
      this.apiService.getFareQuote(this.ipAddress, this.tboToken, this.traceid, this.resultIndex)
        .subscribe((val: any) => {
          console.log('Fare quote response received:', val);
          this.fareQuote = val;
          this.gstMandatoryOnward = this.fareQuote?.Response?.Results?.IsGSTMandatory;
          
          if(this.fareQuote?.Response?.IsPriceChanged){
             Swal.fire({ title: 'Price Changed', text: 'The flight price has been updated by the airline.', icon: 'warning', confirmButtonText: 'Ok' });  
          }

          this.processPassportReqs(this.fareQuote?.Response?.Results);
          this.processFareBreakdown(val, false);

          if (this.resultIndexReturn) {
            this.subscriptions.add(
              this.apiService.getFareQuote(this.ipAddress, this.tboToken, this.traceid, this.resultIndexReturn)
                .subscribe((returnVal: any) => {
                  console.log('Return fare quote response received:', returnVal);
                  this.fareQuoteReturn = returnVal;
                  this.gstMandatoryReturn = this.fareQuoteReturn?.Response?.Results?.IsGSTMandatory;
                  
                  if(this.fareQuoteReturn?.Response?.IsPriceChanged) {
                    Swal.fire({ title: 'Return Price Changed', icon: 'warning' });
                  }
                  
                  this.processPassportReqs(this.fareQuoteReturn?.Response?.Results);
                  this.processFareBreakdown(returnVal, true);
                  this.aggregateFareSummary();
                  this.fetchSSRAfterFareQuotes();
                }, err => { 
                  console.error('Error fetching return fare quote:', err);
                  this.loader = false; 
                })
            );
          } else {
            this.aggregateFareSummary();
            this.fetchSSRAfterFareQuotes();
          }
        }, err => { 
          console.error('Error fetching fare quote:', err);
          this.loader = false; 
        })
    );
  }

  processPassportReqs(results: any) {
      if(!results) return;
      if (
        results.IsPassportFullDetailRequiredAtBook || 
        results.IsPassportRequiredAtBook || 
        results.IsPassportRequiredAtTicket
      ) {
          this.passportInfoRequired = true;
      }
  }

  fetchSSRAfterFareQuotes() {
      if (this.ssrFetched) { return; }
      if (!this.ipAddress || !this.tboToken || !this.traceid || !this.resultIndex) {
        console.warn('SSR prerequisites missing', { ip: !!this.ipAddress, token: !!this.tboToken, traceid: !!this.traceid, resultIndex: !!this.resultIndex });
        return;
      }
      console.log('Calling SSR for onward', { ip: this.ipAddress, token: !!this.tboToken, traceid: this.traceid, resultIndex: this.resultIndex });
      this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndex).subscribe((val: any) => {
          this.ssrValues = val;
          const response = val?.Response || {};
          const baggage = response?.Baggage || this.findDeepArray(val, 'Baggage');
          console.log('SSR onward baggage raw', baggage);
          
          // Handle unified SSR format where Baggage may contain two legs in one response
          const isSplitableArray = Array.isArray(baggage) && baggage.length === 2 && Array.isArray(baggage[0]) && Array.isArray(baggage[1]);
          console.log('SSR onward baggage splitable:', isSplitableArray);
          if (isSplitableArray) {
              this.processBaggage([baggage[0]], false);
              if (this.tripType === 'roundtrip') {
                  this.processBaggage([baggage[1]], true);
              }
          } else if (baggage) {
              this.processBaggage(baggage, false);
          } else {
              console.warn('No baggage data found in SSR response for onward journey');
          }
          this.logBaggageState('after-onward-ssr', false);
          
          // Seats
          const seatData = response?.Seat || response?.Seats || response?.SeatMap || (val as any)?.Seat;
          if(seatData) {
              this.parseSeatData(seatData, false);
          }
          this.ssrFetched = true;
      });
      
      if(this.resultIndexReturn) {
          this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndexReturn).subscribe((val: any) => {
              this.ssrValuesReturn = val;
              const baggageRet = val?.Response?.Baggage || this.findDeepArray(val, 'Baggage');
              if(baggageRet) this.processBaggage(baggageRet, true);
              this.logBaggageState('after-return-ssr', true);
              
              // Try multiple possible paths for seat data
              const seatData = val?.Response?.Seat || val?.Response?.Seats || val?.Response?.SeatMap || val?.Seat;
              console.log('SSR Response for return:', val);
              console.log('Seat data found:', seatData);
              
              if(seatData) {
                  this.parseSeatData(seatData, true);
              } else {
                  console.warn('No seat data found in SSR response for return journey');
              }
          });
      }
  }

  private attemptSSRFetch() {
    if (!this.ssrFetched && this.resultIndex && this.tboToken && this.traceid) {
      this.fetchSSRAfterFareQuotes();
    }
  }

  private findDeepArray(obj: any, key: string): any {
    if (!obj || typeof obj !== 'object') return null;
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
    for (const k of Object.keys(obj)) {
      const v = (obj as any)[k];
      const res = this.findDeepArray(v, key);
      if (res) return res;
    }
    return null;
  }

  // =================================================================
  // LOGIC IMPLEMENTATION FOR CRITICAL METHODS
  // =================================================================

  processBaggage(baggageArray: any[][], isReturn: boolean) {
      console.log('Processing baggage data:', { baggageArray, isReturn });

      if (!baggageArray) {
          if (isReturn) {
              this.baggageOptionsReturn = [];
              this.selectedBaggageCountsReturn = {};
              this.baggageTotalReturn = 0;
              this.extraBaggageAvailableReturn = false;
          } else {
              this.baggageOptions = [];
              this.selectedBaggageCounts = {};
              this.baggageTotal = 0;
              this.extraBaggageAvailable = false;
          }
          console.warn('processBaggage: no baggageArray provided', { isReturn });
          this.cdr.detectChanges();
          return;
      }

      // Flatten nested arrays (TBO returns per-sector arrays)
      const flatBaggage = Array.isArray(baggageArray) ? baggageArray.flat() : [];
      console.log('Flattened baggage:', flatBaggage);

      // Filter out NoBaggage and zero-weight items
      console.log("Pre-filter baggage length:", flatBaggage.length);
      const validOptions = flatBaggage.filter((item: any) => !!item && item.Code !== 'NoBaggage' && (item.Weight || item.Weight === 0 ? item.Weight > 0 : true));

      if (!validOptions.length) {
          if (isReturn) {
              this.baggageOptionsReturn = [];
              this.selectedBaggageCountsReturn = {};
              this.baggageTotalReturn = 0;
              this.extraBaggageAvailableReturn = false;
          } else {
              this.baggageOptions = [];
              this.selectedBaggageCounts = {};
              this.baggageTotal = 0;
              this.extraBaggageAvailable = false;
          }
          console.log('No valid baggage options found', { flatBaggage });
          this.cdr.detectChanges();
          return;
      }

      if (isReturn) {
          this.extraBaggageAvailableReturn = true;
          this.baggageOptionsReturn = validOptions.map((item: any) => {
              this.baggagePrices[item.Weight] = item.Price;
              return {
                  code: item.Code,
                  Code: item.Code,
                  kgs: item.Weight,
                  Weight: item.Weight,
                  price: item.Price,
                  Price: item.Price,
                  Description: item.Description,
                  WayType: item.WayType,
                  AirlineCode: item.AirlineCode,
                  FlightNumber: item.FlightNumber,
                  Origin: item.Origin,
                  Destination: item.Destination,
                  count: 0
              };
          });

          // init counts keyed by Code
          this.selectedBaggageCountsReturn = {};
          this.baggageOptionsReturn.forEach(opt => this.selectedBaggageCountsReturn[opt.Code] = 0);
          this.baggageTotalReturn = 0;
          console.log('Set return baggage options:', this.baggageOptionsReturn);
      } else {
          this.extraBaggageAvailable = true;
          this.baggageOptions = validOptions.map((item: any) => {
              this.baggagePrices[item.Weight] = item.Price;
              return {
                  code: item.Code,
                  Code: item.Code,
                  kgs: item.Weight,
                  Weight: item.Weight,
                  price: item.Price,
                  Price: item.Price,
                  Description: item.Description,
                  WayType: item.WayType,
                  AirlineCode: item.AirlineCode,
                  FlightNumber: item.FlightNumber,
                  Origin: item.Origin,
                  Destination: item.Destination,
                  count: 0
              };
          });

          // init counts keyed by Code
          this.selectedBaggageCounts = {};
          this.baggageOptions.forEach(opt => this.selectedBaggageCounts[opt.Code] = 0);
          this.baggageOptions.forEach(opt => {
            const w = opt.Weight || opt.kgs;
            if (w !== undefined && this.baggageCounts[w] === undefined) this.baggageCounts[w] = 0;
          });
          this.baggageTotal = 0;
          console.log('Set onward baggage options:', this.baggageOptions);
      }

      // Trigger change detection
      this.cdr.detectChanges();
      this.logBaggageState('after-process-baggage', isReturn);
  }

  addBaggage(option: any, isReturn: boolean = false): void {
    const counts = isReturn ? this.selectedBaggageCountsReturn : this.selectedBaggageCounts;
    const currentTotal = Object.values(counts).reduce((a, b) => a + b, 0);
    const totalPax = this.totalAdults + this.totalChildren; // Infants usually don't get extra baggage slots in UI logic

    if (currentTotal < totalPax) {
      counts[option.Code] = (counts[option.Code] || 0) + 1;
      this.updateBaggageTotal(isReturn);
    } else {
      Swal.fire('Limit Reached', 'Cannot add more baggage than passengers', 'warning');
    }
  }

  removeBaggage(option: any, isReturn: boolean = false): void {
    const counts = isReturn ? this.selectedBaggageCountsReturn : this.selectedBaggageCounts;
    if (counts[option.Code] > 0) {
      counts[option.Code]--;
      this.updateBaggageTotal(isReturn);
    }
  }

  updateBaggageTotal(isReturn: boolean = false) {
    let total = 0;
    const counts = isReturn ? this.selectedBaggageCountsReturn : this.selectedBaggageCounts;
    const options = isReturn ? this.baggageOptionsReturn : this.baggageOptions;

    // --- FIX 3: Explicit type definition ---
    const currentSelectedList: any[] = [];

    options.forEach(opt => {
      const count = counts[opt.Code] || 0;
      total += count * opt.Price;
      if(count > 0) {
        currentSelectedList.push({ ...opt, Count: count });
      }
    });

    // Update the array property so it is ready for payment
    if(!isReturn) { 
        this.selectedBaggage = currentSelectedList; 
    }

    if (isReturn) this.baggageTotalReturn = total;
    else this.baggageTotal = total;
    
    this.updateFinalFare();
    this.logBaggageState('after-update-baggage-total', isReturn);
  }

  private logBaggageState(tag: string, isReturn: boolean) {
    const options = isReturn ? this.baggageOptionsReturn : this.baggageOptions;
    const counts = isReturn ? this.selectedBaggageCountsReturn : this.selectedBaggageCounts;
    const total = isReturn ? this.baggageTotalReturn : this.baggageTotal;
    const modal = this.showAddBaggageModal;
    console.log('BAGGAGE DEBUG', tag, {
      isReturn,
      optionsCount: Array.isArray(options) ? options.length : 0,
      optionsSample: Array.isArray(options) && options.length ? options.slice(0, 3) : [],
      countsKeys: Object.keys(counts || {}),
      countsValues: counts,
      baggageTotal: total,
      showAddBaggageModal: modal
    });
  }

  processFareBreakdown(val: any, isReturn: boolean): void {
    console.log('processFareBreakdown called with:', { isReturn, val });
    const results = val?.Response?.Results;
    if (!results) {
      console.error('No results in fare breakdown response. Full response:', val);
      return;
    }

    const fareBreakdown = results.FareBreakdown || [];
    console.log('Fare breakdown array:', fareBreakdown);
    this.isLCC = results.IsLCC;

    let totalAdults = 0, totalChildren = 0, totalInfants = 0;

    fareBreakdown.forEach(( breakdown: any ) => {
      const type = breakdown.PassengerType;
      const count = breakdown.PassengerCount;
      
      if (!count || count === 0) {
        console.warn('Invalid passenger count in fare breakdown:', breakdown);
        return;
      }
      
      const baseFare = breakdown.BaseFare / count;
      const tax = breakdown.Tax / count; 

      if (type === 1) { // Adult
        totalAdults = count;
        if(isReturn) { 
          this.adultBaseFareReturn = baseFare; 
          this.adultTaxesReturn = tax; 
        } else { 
          this.adultBaseFare = baseFare; 
          this.adultTaxes = tax; 
        }
        console.log(`Processed Adult fare: Base=${baseFare}, Tax=${tax}, Count=${count}`);
      } else if (type === 2) { // Child
        totalChildren = count;
        if(isReturn) { 
          this.childrenBaseFareReturn = baseFare; 
          this.childrenTaxesReturn = tax; 
        } else { 
          this.childrenBaseFare = baseFare; 
          this.childrenTaxes = tax; 
        }
        console.log(`Processed Child fare: Base=${baseFare}, Tax=${tax}, Count=${count}`);
      } else if (type === 3) { // Infant
        totalInfants = count;
        if(isReturn) { 
          this.infantBaseFareReturn = baseFare; 
          this.infantTaxesReturn = tax; 
        } else { 
          this.infantBaseFare = baseFare; 
          this.infantTaxes = tax; 
        }
        console.log(`Processed Infant fare: Base=${baseFare}, Tax=${tax}, Count=${count}`);
      }
    });

    if (!isReturn) {
      // Only update passenger counts if we got valid values from fare breakdown
      // Otherwise preserve existing counts from flight list
      if (totalAdults > 0) {
      this.totalAdults = totalAdults;
        // Only initialize travellers if not already set or if count changed
        if (!this.travellers || this.travellers.length !== totalAdults) {
      this.travellers = Array(this.totalAdults).fill(0).map(() => this.getBlankAdult());
        }
      }
      if (totalChildren > 0) {
        this.totalChildren = totalChildren;
        // Only initialize children if not already set or if count changed
        if (!this.children || this.children.length !== totalChildren) {
      this.children = Array(this.totalChildren).fill(0).map(() => this.getBlankChild());
        }
      }
      if (totalInfants > 0) {
        this.totalInfants = totalInfants;
        // Only initialize infants if not already set or if count changed
        if (!this.infants || this.infants.length !== totalInfants) {
      this.infants = Array(this.totalInfants).fill(0).map(() => this.getBlankInfant());
        }
      }
      
      console.log(`Fare breakdown processed - Adults: ${this.totalAdults}, Children: ${this.totalChildren}, Infants: ${this.totalInfants}`);
      console.log(`Fare values set - Adult Base: ${this.adultBaseFare}, Adult Tax: ${this.adultTaxes}, Child Base: ${this.childrenBaseFare}, Child Tax: ${this.childrenTaxes}`);
      
      // Force update fare summary immediately
      this.aggregateFareSummary();
      this.cdr.detectChanges();
    }
  }

  aggregateFareSummary(): void {
    // Calculate base fare and taxes
    let baseFare = 0;
    let taxes = 0;
    
    // Onward journey
    if (this.adultBaseFare && this.totalAdults > 0) {
      baseFare += this.adultBaseFare * this.totalAdults;
    }
    if (this.childrenBaseFare && this.totalChildren > 0) {
      baseFare += this.childrenBaseFare * this.totalChildren;
    }
    if (this.infantBaseFare && this.totalInfants > 0) {
      baseFare += this.infantBaseFare * this.totalInfants;
    }
    
    if (this.adultTaxes && this.totalAdults > 0) {
      taxes += this.adultTaxes * this.totalAdults;
    }
    if (this.childrenTaxes && this.totalChildren > 0) {
      taxes += this.childrenTaxes * this.totalChildren;
    }
    if (this.infantTaxes && this.totalInfants > 0) {
      taxes += this.infantTaxes * this.totalInfants;
    }
    
    // Return journey (if roundtrip)
    if(this.resultIndexReturn) {
      if (this.adultBaseFareReturn && this.totalAdults > 0) {
        baseFare += this.adultBaseFareReturn * this.totalAdults;
      }
      if (this.childrenBaseFareReturn && this.totalChildren > 0) {
        baseFare += this.childrenBaseFareReturn * this.totalChildren;
      }
      if (this.infantBaseFareReturn && this.totalInfants > 0) {
        baseFare += this.infantBaseFareReturn * this.totalInfants;
      }
      
      if (this.adultTaxesReturn && this.totalAdults > 0) {
        taxes += this.adultTaxesReturn * this.totalAdults;
      }
      if (this.childrenTaxesReturn && this.totalChildren > 0) {
        taxes += this.childrenTaxesReturn * this.totalChildren;
      }
      if (this.infantTaxesReturn && this.totalInfants > 0) {
        taxes += this.infantTaxesReturn * this.totalInfants;
      }
    }
    
    this.totalBaseFare = baseFare;
    this.totalTaxes = taxes;
    
    console.log(`Aggregated fare - Base: ${this.totalBaseFare}, Taxes: ${this.totalTaxes}`);
    console.log(`Passenger counts - Adults: ${this.totalAdults}, Children: ${this.totalChildren}, Infants: ${this.totalInfants}`);

    this.updateFinalFare();
    this.loader = false;
    this.cdr.detectChanges();
  }

  updateFinalFare() {
    this.finalAmount = this.totalBaseFare + this.totalTaxes + 
                       this.baggageTotal + this.baggageTotalReturn + 
                       this.totalMealCharges + this.totalSpecialServiceCharges +
                       this.totalSeats;
  }

  proceedToPayment(): void {
    // Check agreement
    if(!this.termsAgreed) {
        Swal.fire('Terms & Conditions', 'Please accept the terms and conditions to proceed', 'warning');
        this.loader = false;
        return;
    }

    this.continueClicked = true;
    
    if(!this.canProceed()) {
        Swal.fire('Incomplete Details', 'Please fill all mandatory passenger details', 'error');
        this.loader = false;
        return;
    }

    this.bookingSubmitted = true;

    // Get passenger details
    const adults = this.travellers || [];
    const children = this.children || [];
    const infants = this.infants || [];

    // Get contact details from first adult
    const primaryAdult = adults[0];
    if (!primaryAdult || !primaryAdult.email || !primaryAdult.mobileNumber) {
      Swal.fire('Error', 'Please fill contact details (email and mobile) for the primary passenger', 'error');
      this.loader = false;
      return;
    }

    // Prepare customer details
    const appid = primaryAdult.mobileNumber;
    const orderId = 'FL' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const customerName = `${primaryAdult.firstName} ${primaryAdult.lastName}`;
    const customerEmail = primaryAdult.email;
    const customerDialCountryCode = primaryAdult.mobileDialCode || '+91';
    const customerPhone = primaryAdult.mobileNumber;

    // Get flight data
    const source = this.fullFlightData?.fromCity || '';
    const destination = this.fullFlightData?.toCity || '';
    const onwardDate = this.departureDate ? this.departureDate.toISOString().split('T')[0] : '';
    const returnDate = this.returnDate ? this.returnDate.toISOString().split('T')[0] : null;

    // Determine if LCC
    const isLCC = this.fullFlightData?.departureFlightData?.selectedFare?.originalFareOption?.IsLCC || false;
    const isLCCReturn = this.fullFlightData?.returnFlightData?.selectedFare?.originalFareOption?.IsLCC || false;

    // Build booking payload (simplified version - you may need to adjust based on your API requirements)
    const adultPassengers = adults.map((a: any) => ({
      Title: a.title || 'Mr',
      FirstName: a.firstName,
      LastName: a.lastName,
      DateOfBirth: `${a.dobYear}-${a.dobMonth}-${a.dobDay}`,
      Gender: a.gender,
      Email: a.email || '',
      MobileCode: a.mobileDialCode || '+91',
      MobileNumber: a.mobileNumber || '',
      PassportNumber: a.passportNumber || '',
      PassportExpiryDate: a.passportExpiryYear || '',
      PANNumber: a.panNumber || '',
      RequiresWheelchair: a.requiresWheelchair || false
    }));
    
    const childPassengers = children.map((c: any) => ({
      Title: c.title || 'Mstr',
      FirstName: c.firstName,
      LastName: c.lastName,
      DateOfBirth: `${c.dobYear}-${c.dobMonth}-${c.dobDay}`,
      Gender: c.gender,
      Email: '',
      MobileCode: '',
      MobileNumber: '',
      PassportNumber: c.passportNumber || '',
      PassportExpiryDate: '',
      PANNumber: c.panNumber || '',
      RequiresWheelchair: c.requiresWheelchair || false
    }));
    
    const infantPassengers = infants.map((i: any) => ({
      Title: i.title || 'Mstr',
      FirstName: i.firstName,
      LastName: i.lastName,
      DateOfBirth: `${i.dobYear}-${i.dobMonth}-${i.dobDay}`,
      Gender: i.gender,
      Email: '',
      MobileCode: '',
      MobileNumber: '',
      PassportNumber: i.passportNumber || '',
      PassportExpiryDate: '',
      PANNumber: '',
      RequiresWheelchair: false
    }));
    
    const onwardPayload: any = {
      Passengers: [...adultPassengers, ...childPassengers, ...infantPassengers],
      Contact: {
        Email: customerEmail,
        MobileCode: customerDialCountryCode,
        MobileNumber: customerPhone
      },
      GST: this.gstDetails?.companyName ? {
        CompanyName: this.gstDetails.companyName,
        RegistrationNo: this.gstDetails.gstNumber || ''
      } : null,
      Baggage: this.selectedBaggage || []
    };

    const returnPayload = this.tripType === 'roundtrip' ? onwardPayload : null;
    const onwardAmount = this.tripType === 'roundtrip' ? this.getOnwardTotal() : this.finalAmount;
    const returnAmount = this.tripType === 'roundtrip' ? this.getReturnTotal() : null;

    console.log('Calling flightSuccess API with:', {
      appid: appid,
      orderId: orderId,
      customerName: customerName,
      customerEmail: customerEmail,
      customerDialCountryCode: customerDialCountryCode,
      customerPhone: customerPhone,
      source: source,
      destination: destination,
      onwardDate: onwardDate,
      returnDate: returnDate,
      onwardPayload: onwardPayload,
      returnPayload: returnPayload,
      onwardAmount: onwardAmount,
      returnAmount: returnAmount,
      finalAmount: this.finalAmount,
      isLCC: isLCC,
      isLCCReturn: isLCCReturn
    });

    // Call payment API
    this.subscriptions.add(
      this.apiService.flightSuccess(
        appid,
        orderId,
        this.tripType,
        this.isUnifiedSegmentFormat,
        customerName,
        customerEmail,
        customerDialCountryCode,
        customerPhone,
        source,
        destination,
        onwardDate,
        returnDate,
        onwardPayload,
        returnPayload,
        onwardAmount,
        returnAmount,
        this.finalAmount,
        isLCC,
        isLCCReturn
      ).subscribe((val: any) => {
        console.log('Payment API Response:', val);
        
        if (val && val['payment_session_id']) {
          // Call cashfree payment gateway
          if (typeof (window as any).cashfree === 'function') {
            (window as any).cashfree(val['payment_session_id']);
            console.log('Cashfree payment gateway opened with session:', val['payment_session_id']);
          } else {
            console.error('Cashfree function not found. Make sure cashfree.js is loaded.');
            Swal.fire('Error', 'Payment gateway not available. Please refresh the page.', 'error');
            this.loader = false;
          }
        } else {
          // Handle error response
          const errorMessage = val?.message || 'Payment session creation failed';
          const isEmailError = errorMessage.toString().toUpperCase().trim().includes('INVALID EMAIL');
          
          Swal.fire({
            title: 'Sorry!',
            html: isEmailError ? 'Please Enter Email ID in Correct Format.' : errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.loader = false;
        }
      }, (error: any) => {
        console.error('Payment API Error:', error);
        Swal.fire({
          title: 'Error',
          html: error?.message || 'Failed to create payment session. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        this.loader = false;
      })
    );
  }

  canProceed(): boolean {
      // Get passenger arrays (support both old and new structure)
      const adults = this.travellers || [];
      const children = this.children || [];
      const infants = this.infants || [];
      
      // 1. Validate Contact Info from first adult (mobile template structure)
      const primaryAdult = adults[0];
      if (!primaryAdult) {
        console.log('canProceed: No primary adult found');
        return false;
      }
      
      // Check email and mobile from primary adult
      const hasValidEmail = primaryAdult.email && primaryAdult.email.trim().length > 0;
      const hasValidMobile = primaryAdult.mobileNumber && primaryAdult.mobileNumber.length >= 10;
      
      if (!hasValidEmail || !hasValidMobile) {
        // Fallback to old contact structure
        const hasOldEmail = this.contact.email && this.contact.email.trim().length > 0;
        const hasOldMobile = this.contact.mobile && this.contact.mobile.length >= 10;
        if (!hasOldEmail || !hasOldMobile) {
          console.log('canProceed: Missing contact info', { hasValidEmail, hasValidMobile, hasOldEmail, hasOldMobile });
          return false;
        }
      }
      
      // 2. Validate Adult Details
      for(let i = 0; i < adults.length; i++) {
          const t = adults[i];
          if(!t.firstName || !t.firstName.trim()) {
            console.log(`canProceed: Adult ${i+1} missing firstName`);
            return false;
          }
          if(!t.lastName || !t.lastName.trim()) {
            console.log(`canProceed: Adult ${i+1} missing lastName`);
            return false;
          }
          if(!t.gender || !t.gender.trim()) {
            console.log(`canProceed: Adult ${i+1} missing gender`);
            return false;
          }
          if(!t.dobYear || !t.dobMonth || !t.dobDay) {
            console.log(`canProceed: Adult ${i+1} missing DOB`, { dobYear: t.dobYear, dobMonth: t.dobMonth, dobDay: t.dobDay });
            return false;
          }
          // Passport validation - only check passportNumber if required, expiryYear is optional
          if(this.passportInfoRequired && (!t.passportNumber || !t.passportNumber.trim())) {
            console.log(`canProceed: Adult ${i+1} missing passport number`);
            return false;
          }
          if(this.panInfoRequired && (!t.panNumber || !t.panNumber.trim())) {
            console.log(`canProceed: Adult ${i+1} missing PAN number`);
            return false;
          }
          // Date Validation for Adults check
          if(t.dobYear && t.dobMonth && t.dobDay && !this.validateAdultDOB(t)) {
            console.log(`canProceed: Adult ${i+1} DOB validation failed`);
            return false;
          }
      }

      // 3. Validate Child Details
      for(let i = 0; i < children.length; i++) {
          const c = children[i];
          if(!c.firstName || !c.firstName.trim()) {
            console.log(`canProceed: Child ${i+1} missing firstName`);
            return false;
          }
          if(!c.lastName || !c.lastName.trim()) {
            console.log(`canProceed: Child ${i+1} missing lastName`);
            return false;
          }
          if(!c.gender || !c.gender.trim()) {
            console.log(`canProceed: Child ${i+1} missing gender`);
            return false;
          }
          if(!c.dobYear || !c.dobMonth || !c.dobDay) {
            console.log(`canProceed: Child ${i+1} missing DOB`);
            return false;
          }
          if(this.passportInfoRequired && (!c.passportNumber || !c.passportNumber.trim())) {
            console.log(`canProceed: Child ${i+1} missing passport number`);
            return false;
          }
          if(this.panInfoRequired && (!c.panNumber || !c.panNumber.trim())) {
            console.log(`canProceed: Child ${i+1} missing PAN number`);
            return false;
          }
      }

      // 4. Validate Infant Details
      for(let i = 0; i < infants.length; i++) {
          const inf = infants[i];
          if(!inf.firstName || !inf.firstName.trim()) {
            console.log(`canProceed: Infant ${i+1} missing firstName`);
            return false;
          }
          if(!inf.lastName || !inf.lastName.trim()) {
            console.log(`canProceed: Infant ${i+1} missing lastName`);
            return false;
          }
          if(!inf.gender || !inf.gender.trim()) {
            console.log(`canProceed: Infant ${i+1} missing gender`);
            return false;
          }
          if(!inf.dobYear || !inf.dobMonth || !inf.dobDay) {
            console.log(`canProceed: Infant ${i+1} missing DOB`);
            return false;
          }
          if(this.passportInfoRequired && (!inf.passportNumber || !inf.passportNumber.trim())) {
            console.log(`canProceed: Infant ${i+1} missing passport number`);
            return false;
          }
      }

      // 5. Validate GST if applicable
      const hasGST = this.gstDetails?.companyName || this.contact.hasGST;
      if(hasGST && (this.gstMandatoryOnward || this.gstMandatoryReturn)) {
          const gstNumber = this.gstDetails?.gstNumber || this.gstInfo?.registrationNo;
          if(!this.gstDetails?.companyName && !this.gstInfo?.companyName) {
            console.log('canProceed: GST mandatory but company name missing');
            return false;
          }
          if(!gstNumber || !gstNumber.trim()) {
            console.log('canProceed: GST mandatory but GST number missing');
            return false;
          }
      }

      console.log('canProceed: All validations passed');
      return true;
  }

  // --- FIX 4: Implemented Missing Methods for Template Errors ---

  // Opens modal for fare rules (maps to existing logic)
  openFareModal(type: string) {
    this.selectedTab = type as any;
    this.openFareRuleModal();
  }

  // Baggage Modal Handlers
  openBaggageModal(isReturn: boolean = false) {
    if(isReturn) {
        this.baggageModalOpenReturn = true;
    } else {
        this.baggageModalOpenOutbound = true;
    }
  }

  closeBaggageModal() {
    this.baggageModalOpenOutbound = false;
    this.baggageModalOpenReturn = false;
  }

  // General Close Modal (handles all)
  closeModal() {
    this.showModal = false;
    this.closeFareRuleModal();
    this.closeBaggageModal();
  }

  // Calculates total selected baggage count
  getTotalBaggageCount(isReturn: boolean = false): number {
    const counts = isReturn ? this.selectedBaggageCountsReturn : this.selectedBaggageCounts;
    return Object.values(counts).reduce((a, b) => a + b, 0);
  }

  // Closes modal after selection
  confirmBaggage() {
    this.closeBaggageModal();
  }

  // Adds a new adult traveller
  addTraveller() {
    this.travellers.push(this.getBlankAdult());
    this.totalAdults++;
    this.updateFinalFare(); // Update fare just in case logic depends on counts
  }

  // Validates if adult is >= 12 years old
  validateAdultDOB(traveller: any): boolean {
    if (!traveller.dobYear || !traveller.dobMonth || !traveller.dobDay) return true; // Skip if empty (handled by required check)
    
    // Handle month names (e.g., "January", "May") or numbers
    let monthIndex: number;
    if (typeof traveller.dobMonth === 'string' && isNaN(parseInt(traveller.dobMonth))) {
      // Month is a name, find its index
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      monthIndex = monthNames.indexOf(traveller.dobMonth);
      if (monthIndex === -1) return true; // Invalid month name, skip validation
    } else {
      // Month is a number
      monthIndex = parseInt(traveller.dobMonth) - 1;
    }
    
    const dob = new Date(parseInt(traveller.dobYear), monthIndex, parseInt(traveller.dobDay));
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 12;
  }

  // Handles the "Continue" click to unlock services
  onContinueClicked() {
      if(this.canProceed()) {
        this.continueClicked = true;
        this.servicesUnlocked = true;
        
        // Scroll to services section if needed
        setTimeout(() => {
            if(isPlatformBrowser(this.platformId)) {
                const element = document.getElementById('serviceSection');
                if(element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
      } else {
        Swal.fire('Incomplete Details', 'Please fill all mandatory passenger details correctly before continuing.', 'warning');
      }
  }

  // -----------------------------------------------------------

  // Boilerplate Helpers
  initializePassportExpiryYears() {
    const currentYear = new Date().getFullYear();
    this.passportExpiryYears = Array.from({ length: 15 }, (_, i) => currentYear + i);
  }
  
  formatTime(date: Date): string {
    return isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  }

  getBlankAdult() { return { firstName: '', lastName: '', gender: '', title: 'Mr', email: '', mobileDialCode: '+91', mobileNumber: '', requiresWheelchair: false, passportNumber: '', passportExpiryYear: '', panNumber: '', dobDay: '', dobMonth: '', dobYear: '' }; }
  getBlankChild() { return { firstName: '', lastName: '', gender: '', title: 'Mstr', requiresWheelchair: false, passportNumber: '', panNumber: '', dobDay: '', dobMonth: '', dobYear: '' }; }
  getBlankInfant() { return { firstName: '', lastName: '', gender: '', title: 'Mstr', passportNumber: '', panNumber: '', dobDay: '', dobMonth: '', dobYear: '' }; }
  
  openFareRuleModal() { this.showFareRuleModal = true; }
  closeFareRuleModal() { this.showFareRuleModal = false; }
  toggleSection(section: 'base' | 'taxes' | 'services') { this.expanded[section] = !this.expanded[section]; }
  
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any) {
    if (this.continueClicked && !this.bookingSubmitted) {
      event.returnValue = true;
    }
  }

  // Mobile Template Methods
  openTripSummary() { this.showTripSummary = true; }
  closeTripSummary() { this.showTripSummary = false; }
  openFareSummary() { this.showFareSummaryModal = true; }
  closeFareSummary() { this.showFareSummaryModal = false; }
  get showAddBaggageModal(): boolean { return this._showAddBaggageModal; }
  set showAddBaggageModal(val: boolean) {
    this._showAddBaggageModal = val;
    if (val) {
      this.attemptSSRFetch();
      if ((!this.baggageOptions || this.baggageOptions.length === 0) && (!this.baggageOptionsReturn || this.baggageOptionsReturn.length === 0)) {
        console.log('Baggage modal opened, fetching SSR baggage because options are empty');
        this.attemptSSRFetch();
      }
    }
  }
  openGSTModal() { this.gstDetails = { ...this.gstInfo, companyAddress: '', companyPhone: '', companyEmail: '', gstNumber: this.gstInfo.registrationNo || '' }; this.showGSTModal = true; }
  closeGSTModal() { this.showGSTModal = false; }
  saveGSTDetails() { this.gstInfo.companyName = this.gstDetails.companyName; this.gstInfo.registrationNo = this.gstDetails.gstNumber; this.contact.hasGST = !!this.gstDetails.companyName; this.closeGSTModal(); }
  
  openPassengerModal(type: 'adult' | 'child' | 'infant', index: number) {
    this.currentPassengerType = type;
    this.currentPassengerIndex = index;
    const arr = type === 'adult' ? this.travellers : type === 'child' ? this.children : this.infants;
    this.currentPassengerDetails = arr[index] ? { ...arr[index] } : this.getBlankPassenger(type);
    this.showPassengerModal = true;
  }
  
  getBlankPassenger(type: 'adult' | 'child' | 'infant') {
    if (type === 'adult') return this.getBlankAdult();
    if (type === 'child') return this.getBlankChild();
    return this.getBlankInfant();
  }
  
  closePassengerModal() { this.showPassengerModal = false; }
  savePassengerDetails(details: any) {
    const arr = this.currentPassengerType === 'adult' ? this.travellers : this.currentPassengerType === 'child' ? this.children : this.infants;
    if (arr[this.currentPassengerIndex]) {
      // Create a new object to ensure change detection works properly
      arr[this.currentPassengerIndex] = { ...arr[this.currentPassengerIndex], ...details };
    } else {
      // If passenger doesn't exist, add it
      arr[this.currentPassengerIndex] = { ...details };
    }
    
    // Create a new array reference to trigger change detection
    if (this.currentPassengerType === 'adult') {
      this.travellers = [...this.travellers];
    } else if (this.currentPassengerType === 'child') {
      this.children = [...this.children];
    } else {
      this.infants = [...this.infants];
    }
    
      // Trigger change detection to update the proceed button state
      this.cdr.detectChanges();
    this.closePassengerModal();
  }
  
  updateProceedButton(): boolean {
    return this.termsAgreed && this.canProceed();
  }
  
  finalProceed() {
    if (!this.updateProceedButton()) {
      Swal.fire('Incomplete', 'Please complete all required fields and accept terms', 'warning');
      return;
    }
    
    // Validate all passenger details
    if (!this.canProceed()) {
      Swal.fire('Incomplete Details', 'Please fill all mandatory passenger details', 'error');
      return;
    }
    
    // Build payload for addon page (seats/meals/others)
    const addonPageData = {
      ...this.fullFlightData,
      tripType: this.tripType,
      flightSegments: this.flightSegments,
      flightSegmentsReturn: this.flightSegmentsReturn,
      totalAdults: this.totalAdults,
      totalChildren: this.totalChildren,
      totalInfants: this.totalInfants,
      seatMap: this.seatMap,
      seatMapReturn: this.seatMapReturn,
      ssrValues: this.ssrValues,
      ssrValuesReturn: this.ssrValuesReturn,
      // Include individual fare values for proper restoration
      adultBaseFare: this.adultBaseFare,
      childrenBaseFare: this.childrenBaseFare,
      infantBaseFare: this.infantBaseFare,
      adultTaxes: this.adultTaxes,
      childrenTaxes: this.childrenTaxes,
      infantTaxes: this.infantTaxes,
      adultBaseFareReturn: this.adultBaseFareReturn,
      childrenBaseFareReturn: this.childrenBaseFareReturn,
      infantBaseFareReturn: this.infantBaseFareReturn,
      adultTaxesReturn: this.adultTaxesReturn,
      childrenTaxesReturn: this.childrenTaxesReturn,
      infantTaxesReturn: this.infantTaxesReturn,
      totalBaseFare: this.totalBaseFare,
      totalTaxes: this.totalTaxes,
      travellers: this.travellers,
      children: this.children,
      infants: this.infants,
      contact: this.contact,
      gstDetails: this.gstDetails,
      termsAgreed: this.termsAgreed, // Include terms agreement status
      tboToken: this.tboToken,
      traceid: this.traceid,
      resultIndex: this.resultIndex,
      resultIndexReturn: this.resultIndexReturn,
      baggageOptions: this.baggageOptions,
      baggageOptionsReturn: this.baggageOptionsReturn,
      baggageTotal: this.baggageTotal,
      baggageTotalReturn: this.baggageTotalReturn,
      selectedBaggageCounts: this.selectedBaggageCounts,
      selectedBaggageCountsReturn: this.selectedBaggageCountsReturn,
      totalSeats: this.totalSeats,
      totalMealCharges: this.totalMealCharges,
      totalSpecialServiceCharges: this.totalSpecialServiceCharges,
      mobFinalPageData: this.fullFlightData?.mobFinalPageData || null
    };

    // Pass data to addon page and navigate
    this.flightDataService.setStringValue(addonPageData);
    this.loader = false;
    this.router.navigate(['/flightaddons']);
  }
  
  // Baggage methods for mobile
  incrementBaggage(baggage: any) {
    const weightKey = baggage.kgs || baggage.Weight || baggage.Code;
    const codeKey = baggage.Code || baggage.code;
    if (!this.baggageCounts[weightKey]) this.baggageCounts[weightKey] = 0;
    this.baggageCounts[weightKey]++;
    if (codeKey) {
      this.selectedBaggageCounts[codeKey] = (this.selectedBaggageCounts[codeKey] || 0) + 1;
    }
    this.updateBaggageTotal(false);
    this.updateFinalFare();
  }
  
  decrementBaggage(baggage: any) {
    const weightKey = baggage.kgs || baggage.Weight || baggage.Code;
    const codeKey = baggage.Code || baggage.code;
    if (this.baggageCounts[weightKey] > 0) {
      this.baggageCounts[weightKey]--;
      if (codeKey && (this.selectedBaggageCounts[codeKey] || 0) > 0) {
        this.selectedBaggageCounts[codeKey]--;
      }
      this.updateBaggageTotal(false);
      this.updateFinalFare();
    }
  }
  
  incrementRoundBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    const counts = this.activeRoundBaggageTab === 'onward' ? this.onwardBaggageCounts : this.returnBaggageCounts;
    if (!counts[key]) counts[key] = 0;
    counts[key]++;
    this.updateRoundTripBaggageTotal();
    this.updateFinalFare();
  }
  
  decrementRoundBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    const counts = this.activeRoundBaggageTab === 'onward' ? this.onwardBaggageCounts : this.returnBaggageCounts;
    if (counts[key] > 0) {
      counts[key]--;
      this.updateRoundTripBaggageTotal();
      this.updateFinalFare();
    }
  }
  
  getTotalOneWayBaggageCount(): number {
    return Object.values(this.baggageCounts).reduce((a: number, b: number) => a + b, 0);
  }
  
  canAddMoreBaggage(): boolean {
    const counts = this.activeRoundBaggageTab === 'onward' ? this.onwardBaggageCounts : this.returnBaggageCounts;
    const total = Object.values(counts).reduce((a: number, b: number) => a + b, 0);
    return total < (this.totalAdults + this.totalChildren);
  }
  
  calculateBaggageTotal(): number {
    return this.baggageTotal;
  }
  
  calculateRoundTripBaggageTotal(): number {
    return this.baggageTotal + this.baggageTotalReturn;
  }
  
  handleOneWayBaggageDone() {
    // For one-way, just close modal
    // updateBaggageTotal and updateFinalFare are already called on increment/decrement
    this.showAddBaggageModal = false;
    this.cdr.detectChanges();
  }
  
  handleRoundTripBaggageDone() {
    // Prevent double execution
    if (this.isProcessingBaggageDone) {
      return;
    }
    
    // Update totals first
    this.updateRoundTripBaggageTotal();
    
    // Check if user is on onward tab and has added baggage
    if (this.activeRoundBaggageTab === 'onward') {
      // Calculate current onward baggage total directly from counts
      let onwardBaggageTotal = 0;
      this.baggageOptions.forEach(opt => {
        const key = opt.kgs || opt.Code;
        const price = opt.Price || opt.price || 0;
        onwardBaggageTotal += (this.onwardBaggageCounts[key] || 0) * price;
      });
      
      // Check if return baggage is already added
      const hasReturnBaggage = Object.values(this.returnBaggageCounts).some(count => count > 0);
      
      if (onwardBaggageTotal > 0 && !hasReturnBaggage) {
        // Close modal first
        this.showAddBaggageModal = false;
        this.cdr.detectChanges();
        
        // Then show alert asking if user wants to add return baggage
        setTimeout(() => {
          Swal.fire({
            title: 'Add Return Baggage?',
            text: 'Would you like to add baggage for your return journey as well?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Add Return Baggage',
            cancelButtonText: 'No, Continue',
            confirmButtonColor: '#008b8b',
            cancelButtonColor: '#6c757d',
            allowOutsideClick: false,
            allowEscapeKey: true
          }).then((result) => {
            if (result.isConfirmed) {
              // Switch to return tab and reopen modal
              this.activeRoundBaggageTab = 'return';
              this.showAddBaggageModal = true;
              this.cdr.detectChanges();
            }
            // If cancelled, modal stays closed
          });
        }, 100);
        return; // Exit early
      }
    }
    
    // If we reach here, either:
    // - On return tab
    // - No onward baggage
    // - Return baggage already added
    // Just close modal (totals already updated above)
    this.showAddBaggageModal = false;
    this.cdr.detectChanges();
  }
  
  updateRoundTripBaggageTotal() {
    let onwardTotal = 0, returnTotal = 0;
    
    // Calculate onward baggage total
    this.baggageOptions.forEach(opt => {
      const key = opt.kgs || opt.Code;
      const price = opt.Price || opt.price || 0;
      onwardTotal += (this.onwardBaggageCounts[key] || 0) * price;
    });
    
    // Calculate return baggage total
    this.baggageOptionsReturn.forEach(opt => {
      const key = opt.kgs || opt.Code;
      const price = opt.Price || opt.price || 0;
      returnTotal += (this.returnBaggageCounts[key] || 0) * price;
    });
    
    this.baggageTotal = onwardTotal;
    this.baggageTotalReturn = returnTotal;
    this.updateFinalFare();
  }
  
  getCancellationRows(flightData: any): any[] {
    if (!flightData?.cancellationPolicy) return [];
    return flightData.cancellationPolicy.map((p: any) => ({
      range: `${p.From} ${p.Unit?.toLowerCase()} to ${p.To || 'departure'} ${p.Unit?.toLowerCase()}`,
      price: `₹ ${p.Details}`
    }));
  }
  
  getDateChangeRows(flightData: any): any[] {
    if (!flightData?.dateChangePolicy) return [];
    return flightData.dateChangePolicy.map((p: any) => ({
      range: `${p.From} ${p.Unit?.toLowerCase()} to ${p.To || 'departure'} ${p.Unit?.toLowerCase()}`,
      price: `₹ ${p.Details}`
    }));
  }
  
  calculateDayChange(arrDate: Date, depDate: Date): string {
    if (!arrDate || !depDate) return '';
    const diff = Math.floor((depDate.getTime() - arrDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `+ ${diff} Day${diff > 1 ? 's' : ''}` : '';
  }
  
  calculateLayoverDuration(arrDate: Date, depDate: Date): string {
    if (!arrDate || !depDate) return '';
    const mins = Math.floor((depDate.getTime() - arrDate.getTime()) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }

  // Calculate onward fare breakdown
  getOnwardBaseFare(): number {
    return (this.adultBaseFare * this.totalAdults) + 
           (this.childrenBaseFare * this.totalChildren) + 
           (this.infantBaseFare * this.totalInfants);
  }

  getOnwardTaxes(): number {
    return (this.adultTaxes * this.totalAdults) + 
           (this.childrenTaxes * this.totalChildren) + 
           (this.infantTaxes * this.totalInfants);
  }

  getOnwardTotal(): number {
    return this.getOnwardBaseFare() + this.getOnwardTaxes();
  }

  // Calculate return fare breakdown
  getReturnBaseFare(): number {
    if (!this.resultIndexReturn) return 0;
    return (this.adultBaseFareReturn * this.totalAdults) + 
           (this.childrenBaseFareReturn * this.totalChildren) + 
           (this.infantBaseFareReturn * this.totalInfants);
  }

  getReturnTaxes(): number {
    if (!this.resultIndexReturn) return 0;
    return (this.adultTaxesReturn * this.totalAdults) + 
           (this.childrenTaxesReturn * this.totalChildren) + 
           (this.infantTaxesReturn * this.totalInfants);
  }

  getReturnTotal(): number {
    return this.getReturnBaseFare() + this.getReturnTaxes();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  // Empty placeholders to satisfy template bindings if not fully implemented
  processMeals(isReturn: boolean) {} 
  
  // Seat Selection Methods
  parseSeatData(seatData: any, isReturn: boolean) {
    console.log('parseSeatData called with:', seatData, 'isReturn:', isReturn);
    
    if (!seatData) {
      console.warn('No seat data provided');
      return;
    }

    const segments = isReturn ? this.flightSegmentsReturn : this.flightSegments;
    const seatMaps: any[] = [];

    // Handle different data structures
    let dataArray: any[] = [];
    
    if (Array.isArray(seatData)) {
      dataArray = seatData;
    } else if (seatData.SeatMap) {
      // Single seat map object
      const seatMap = this.processSeatMap(seatData.SeatMap, seatData);
      if (seatMap) {
        seatMaps.push(seatMap);
      }
    } else if (seatData.Rows) {
      // Direct seat map structure
      const seatMap = this.processSeatMap(seatData, seatData);
      if (seatMap) {
        seatMaps.push(seatMap);
      }
    } else {
      console.warn('Unknown seat data structure:', seatData);
      return;
    }

    // Process array of seat groups
    if (dataArray.length > 0) {
      dataArray.forEach((seatGroup: any, groupIndex: number) => {
        if (!seatGroup) {
          return;
        }

        // If seatGroup is an array, iterate through it
        if (Array.isArray(seatGroup)) {
          seatGroup.forEach((seat: any, seatIndex: number) => {
            if (!seat) return;
            
            // Try different possible structures
            const seatMapData = seat.SeatMap || seat;
            const seatMap = this.processSeatMap(seatMapData, seat);
            if (seatMap) {
              seatMaps.push(seatMap);
            }
          });
        } else if (seatGroup.SeatMap || seatGroup.Rows) {
          // Direct seat map in group
          const seatMapData = seatGroup.SeatMap || seatGroup;
          const seatMap = this.processSeatMap(seatMapData, seatGroup);
          if (seatMap) {
            seatMaps.push(seatMap);
          }
        }
      });
    }

    if (isReturn) {
      this.seatMapReturn = seatMaps;
      // Initialize selected seats for return
      seatMaps.forEach((_, index) => {
        if (!this.selectedSeatsReturn[index]) {
          this.selectedSeatsReturn[index] = [];
        }
      });
    } else {
      this.seatMap = seatMaps;
      // Initialize selected seats for onward
      seatMaps.forEach((_, index) => {
        if (!this.selectedSeats[index]) {
          this.selectedSeats[index] = [];
        }
      });
    }

    this.updateSeatTotal();
  }

  processSeatMap(seatMapData: any, seatInfo: any): any {
    if (!seatMapData || !seatMapData.Rows || !Array.isArray(seatMapData.Rows)) {
      return null;
    }

    const seatBlocks: string[][] = [];
    const rows: any[] = [];
    const priceCategories: any[] = [];
    const priceMap = new Map<string, number>();

    // Process seat blocks (columns)
    if (seatMapData.SeatBlocks && Array.isArray(seatMapData.SeatBlocks)) {
      seatMapData.SeatBlocks.forEach((block: any) => {
        if (block && Array.isArray(block)) {
          seatBlocks.push(block);
        }
      });
    }

    // Process rows
    seatMapData.Rows.forEach((rowData: any) => {
      if (!rowData || !rowData.RowNo) return;

      const row: any = {
        rowNo: rowData.RowNo,
        seatBlocks: []
      };

      // Process seat blocks for this row
      seatBlocks.forEach((block, blockIndex) => {
        const seatBlock: any = {};
        block.forEach((letter: string) => {
          const seatCode = `${rowData.RowNo}${letter}`;
          const seat = this.findSeatInRow(rowData, seatCode, seatInfo);
          
          if (seat) {
            seatBlock[letter] = {
              Code: seatCode,
              isAvailable: seat.IsAvailable || false,
              Price: seat.Price || 0,
              priceCategory: this.getPriceCategory(seat.Price || 0),
              SeatType: seat.SeatType || '',
              Description: seat.Description || ''
            };

            // Track price categories
            const price = seat.Price || 0;
            if (price > 0 && !priceMap.has(seatCode)) {
              priceMap.set(seatCode, price);
            }
          } else {
            seatBlock[letter] = null;
          }
        });
        row.seatBlocks.push(seatBlock);
      });

      rows.push(row);
    });

    // Create price categories
    const prices = Array.from(priceMap.values()).filter(p => p > 0).sort((a, b) => a - b);
    if (prices.length > 0) {
      const minPrice = prices[0];
      const maxPrice = prices[prices.length - 1];
      const midPrice = (minPrice + maxPrice) / 2;

      if (minPrice === maxPrice) {
        priceCategories.push({
          category: 'low-price',
          min: minPrice,
          max: maxPrice
        });
      } else {
        priceCategories.push({
          category: 'low-price',
          min: minPrice,
          max: Math.floor(midPrice)
        });
        priceCategories.push({
          category: 'medium-price',
          min: Math.ceil(midPrice),
          max: Math.floor((midPrice + maxPrice) / 2)
        });
        priceCategories.push({
          category: 'high-price',
          min: Math.ceil((midPrice + maxPrice) / 2),
          max: maxPrice
        });
      }
    }

    return {
      seatBlocks,
      rows,
      priceCategories
    };
  }

  findSeatInRow(rowData: any, seatCode: string, seatInfo: any): any {
    if (!rowData.Seats || !Array.isArray(rowData.Seats)) {
      return null;
    }

    return rowData.Seats.find((s: any) => s.SeatCode === seatCode || s.Code === seatCode);
  }

  getPriceCategory(price: number): string {
    if (price === 0) return 'free';
    if (price < 500) return 'low-price';
    if (price < 1500) return 'medium-price';
    return 'high-price';
  }

  isSeatSelected(segmentIndex: number, seatCode: string): boolean {
    if (!this.selectedSeats[segmentIndex]) {
      return false;
    }
    return this.selectedSeats[segmentIndex].some(seat => seat.Code === seatCode);
  }

  isSeatSelectedReturn(segmentIndex: number, seatCode: string): boolean {
    if (!this.selectedSeatsReturn[segmentIndex]) {
      return false;
    }
    return this.selectedSeatsReturn[segmentIndex].some(seat => seat.Code === seatCode);
  }

  toggleSeatSelection(segmentIndex: number, seat: any): void {
    if (!seat || !seat.isAvailable) return;

    if (!this.selectedSeats[segmentIndex]) {
      this.selectedSeats[segmentIndex] = [];
    }

    const seatIndex = this.selectedSeats[segmentIndex].findIndex(s => s.Code === seat.Code);
    
    if (seatIndex >= 0) {
      // Deselect seat
      this.selectedSeats[segmentIndex].splice(seatIndex, 1);
    } else {
      // Check if we can select more seats (limit to total passengers)
      const totalSelected = this.getTotalSelectedSeats(false);
      const maxSeats = this.totalAdults + this.totalChildren;
      
      if (totalSelected >= maxSeats) {
        Swal.fire('Limit Reached', `You can only select up to ${maxSeats} seat(s) for ${maxSeats} passenger(s).`, 'info');
        return;
      }

      // Select seat
      this.selectedSeats[segmentIndex].push({ ...seat });
    }

    this.updateSeatTotal();
  }

  toggleSeatSelectionReturn(segmentIndex: number, seat: any): void {
    if (!seat || !seat.isAvailable) return;

    if (!this.selectedSeatsReturn[segmentIndex]) {
      this.selectedSeatsReturn[segmentIndex] = [];
    }

    const seatIndex = this.selectedSeatsReturn[segmentIndex].findIndex(s => s.Code === seat.Code);
    
    if (seatIndex >= 0) {
      // Deselect seat
      this.selectedSeatsReturn[segmentIndex].splice(seatIndex, 1);
    } else {
      // Check if we can select more seats (limit to total passengers)
      const totalSelected = this.getTotalSelectedSeats(true);
      const maxSeats = this.totalAdults + this.totalChildren;
      
      if (totalSelected >= maxSeats) {
        Swal.fire('Limit Reached', `You can only select up to ${maxSeats} seat(s) for ${maxSeats} passenger(s).`, 'info');
        return;
      }

      // Select seat
      this.selectedSeatsReturn[segmentIndex].push({ ...seat });
    }

    this.updateSeatTotal();
  }

  getTotalSelectedSeats(isReturn: boolean): number {
    const selected = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    return Object.values(selected).reduce((total, seats) => total + (seats?.length || 0), 0);
  }

  updateSeatTotal(): void {
    let total = 0;

    // Calculate onward seat prices
    Object.keys(this.selectedSeats).forEach(index => {
      const seats = this.selectedSeats[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          total += seat.Price || 0;
        });
      }
    });

    // Calculate return seat prices
    Object.keys(this.selectedSeatsReturn).forEach(index => {
      const seats = this.selectedSeatsReturn[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          total += seat.Price || 0;
        });
      }
    });

    this.totalSeats = total;
    this.updateFinalFare();
  }

  getSeatCount(seatBlocks: string[][]): number {
    if (!seatBlocks || !Array.isArray(seatBlocks)) return 0;
    return seatBlocks.reduce((count, block) => count + (block?.length || 0), 0);
  }

  getAisleCount(seatBlocks: string[][]): number {
    if (!seatBlocks || !Array.isArray(seatBlocks)) return 0;
    return Math.max(0, seatBlocks.length - 1);
  }

  getBlockCount(seatBlocks: string[][]): number {
    if (!seatBlocks || !Array.isArray(seatBlocks)) return 0;
    return seatBlocks.length;
  }

  getSeatTooltip(seat: any): string {
    if (!seat) return '';
    let tooltip = `Seat: ${seat.Code}`;
    if (seat.Price > 0) {
      tooltip += ` - ₹${seat.Price}`;
    } else {
      tooltip += ' - Free';
    }
    if (seat.Description) {
      tooltip += ` - ${seat.Description}`;
    }
    return tooltip;
  }

  processSpecialServices(rawSSR: any[], type: 'onward' | 'return') {}
}
