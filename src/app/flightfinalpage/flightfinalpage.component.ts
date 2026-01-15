import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import Swal from 'sweetalert2';
import { PhoneDialerComponent } from '../shared/phone-dialer/phone-dialer.component';
@Component({
  selector: 'app-flightfinalpage',
  standalone: true,
  imports: [CommonModule, FormsModule, PhoneDialerComponent],
  templateUrl: './flightfinalpage.component.html',
  styleUrls: ['./flightfinalpage.component.css']
})
export class FlightfinalpageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactMobileInput') contactMobileInput!: ElementRef<HTMLInputElement>;

  showPhoneDialer = false;
  activePhoneField: 'primary' | 'passenger' | null = null;
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
  baggagePrices: { [key: string]: number } = {};
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
  
  // --- MISSING PROPERTIES ADDED HERE ---
  termsAccepted: boolean = false;
  servicesUnlocked: boolean = false;
  termsAgreed: boolean = false;
  
  // Trip Type
  tripType: 'oneway' | 'roundtrip' | 'multicity' = 'oneway';
  
  // Modal States
  showTripSummary: boolean = false;
  showFareSummaryModal: boolean = false;
  showAddBaggageModal: boolean = false;
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
  passengerValidationErrors: any = {};
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
    
    this.subscriptions.add(
      this.flightDataService.currentMessage.subscribe((val) => {
        if (!val) {
          this.router.navigate(['/']);
          return;
        }
        
        this.processFlightDataInput(val);
      })
    );
    
    // Only call fare quote for one-way and round-trip (not multi-city)
    if(this.traceid && this.resultIndex && this.tripType !== 'multicity') {
        this.callFareQuote();
    }
  }
  isMobileView(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return window.innerWidth <= 768;
  }
  openPhoneDialer(field: 'primary', event?: Event): void {
    if (!this.isMobileView()) return;
  
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    // Prevent native keyboard from opening
    if (this.contactMobileInput && this.contactMobileInput.nativeElement) {
      const inputElement = this.contactMobileInput.nativeElement;
      inputElement.readOnly = true;
      inputElement.setAttribute('readonly', 'readonly');
      inputElement.setAttribute('inputmode', 'none');
    }
  
    this.activePhoneField = field;
    this.showPhoneDialer = true;
  
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(this.document.body, 'hide-navbar-mobile');
    }
  
    // Wait for dialer animation to complete (300ms) + extra buffer, then scroll
    setTimeout(() => {
      this.scrollToContactInput();
    }, 600);
  }
  private scrollToContactInput(): void {
    if (!isPlatformBrowser(this.platformId) || !this.contactMobileInput) return;
  
    const el = this.contactMobileInput.nativeElement;
    
    // Find the modal popup which is the scrollable container
    const modal: HTMLElement | null = el.closest('.trip-popup') as HTMLElement;
    
    if (modal) {
      // Get dialer height (approximately 280px with reduced size)
      const dialerHeight = 280;
      const modalRect = modal.getBoundingClientRect();
      const elementRect = el.getBoundingClientRect();
      
      // Calculate the visible area of the modal (above the dialer)
      const visibleHeight = modalRect.height - dialerHeight;
      
      // Calculate element position relative to modal's scroll position
      const elementTopRelative = elementRect.top - modalRect.top + modal.scrollTop;
      
      // We want the input to be visible with padding above the dialer
      // Calculate target scroll position to show input in the visible area
      const inputHeight = elementRect.height;
      const padding = 20; // Padding above input
      const targetScrollTop = elementTopRelative - (visibleHeight - inputHeight - padding);
      
      // Only scroll if the element is not already visible
      if (targetScrollTop > modal.scrollTop || elementRect.bottom > (modalRect.top + visibleHeight)) {
        modal.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    } else {
      // Fallback: try to scroll the input into view
      el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  closePhoneDialer(): void {
    this.showPhoneDialer = false;
    this.activePhoneField = null;
  
    // Restore input behavior - remove readonly and inputmode on desktop
    if (this.contactMobileInput && this.contactMobileInput.nativeElement) {
      const inputElement = this.contactMobileInput.nativeElement;
      if (!this.isMobileView()) {
        inputElement.readOnly = false;
        inputElement.removeAttribute('readonly');
        inputElement.setAttribute('inputmode', 'numeric');
      }
    }
  
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeClass(this.document.body, 'hide-navbar-mobile');
    }
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

  getCurrentDialerValue(): string {
    if (!this.activePhoneField || !this.currentPassengerDetails) return '';
    return this.currentPassengerDetails.mobileNumber || '';
  }

  processFlightDataInput(val: any) {
    this.fullFlightData = val;
    this.ipAddress = val['ipAddress'];
    this.tboToken = val['tboToken'];
    this.traceid = val['traceid'];
    
    // Set trip type
    const tripTypeVal = val['tripType'] || '';
    if (tripTypeVal === 'round' || tripTypeVal === 'roundtrip') {
      this.tripType = 'roundtrip';
    } else if (tripTypeVal === 'multi' || tripTypeVal === 'multicity') {
      this.tripType = 'multicity';
    } else {
      this.tripType = 'oneway';
    }
    
    // Handle multi-city data
    if (this.tripType === 'multicity') {
      console.log('=== Multi-city trip detected ===');
      console.log('Has multiCitySelectedFares?', !!val['multiCitySelectedFares']);
      console.log('multiCitySelectedFares value:', val['multiCitySelectedFares']);
      console.log('multiCitySegment:', val['multiCitySegment']);
      console.log('multiCityRoutes:', val['multiCityRoutes']);
      
      if (val['multiCitySelectedFares']) {
        this.processMultiCityData(val);
      } else {
        console.error('No multiCitySelectedFares found in data!');
        console.log('Available keys in val:', Object.keys(val));
        this.loader = false;
      }
      // Initialize passengers from multi-city data
      this.totalAdults = val['adults'] || 1;
      this.totalChildren = val['children'] || 0;
      this.totalInfants = val['infants'] || 0;
      // Initialize passenger arrays
      this.travellers = Array(this.totalAdults).fill(0).map(() => this.getBlankAdult());
      this.children = Array(this.totalChildren).fill(0).map(() => this.getBlankChild());
      this.infants = Array(this.totalInfants).fill(0).map(() => this.getBlankInfant());
      // Initialize baggage counts
      this.maxAllowedBaggageCount = this.totalAdults + this.totalChildren;
      this.travelerCount = this.totalAdults + this.totalChildren + this.totalInfants;
      // Turn off loader for multi-city (data is already selected)
      this.loader = false;
      return;
    }
    
    // Handle one-way and round-trip data
    this.resultIndex = val['departureFlightData']?.['ResultIndex'] || '';
    this.resultIndexReturn = val['returnFlightData'] ? val['returnFlightData']['ResultIndex'] : '';
    this.flightDataDeparture = val['departureFlightData'];
    this.flightDataReturn = val['returnFlightData'];
    
    // Set dates
    if (val['departureDate']) {
      this.departureDate = new Date(val['departureDate']);
    }
    if (val['returnDate']) {
      this.returnDate = new Date(val['returnDate']);
    }

    if (this.flightDataDeparture) {
      this.processSegments(this.flightDataDeparture, false);
    }

    if (this.flightDataReturn) {
      this.processSegments(this.flightDataReturn, true);
    }
    
    // Initialize baggage counts
    this.maxAllowedBaggageCount = this.totalAdults + this.totalChildren;
    this.travelerCount = this.totalAdults + this.totalChildren + this.totalInfants;
    
    this.loadFareRules();
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

  processMultiCityData(val: any): void {
    const multiCitySelectedFares = val['multiCitySelectedFares'] || {};
    const multiCitySegment = val['multiCitySegment'] || [];
    const multiCityRoutes = val['multiCityRoutes'] || [];
    
    this.flightSegments = [];
    this.flightSegmentGroups = [];
    this.groupedFlightSegments = [];
    
    console.log('=== Processing multi-city data ===');
    console.log('multiCitySelectedFares:', multiCitySelectedFares);
    console.log('multiCitySelectedFares keys:', Object.keys(multiCitySelectedFares));
    console.log('multiCitySelectedFares count:', Object.keys(multiCitySelectedFares).length);
    console.log('multiCitySegment:', multiCitySegment);
    console.log('multiCitySegment length:', multiCitySegment.length);
    console.log('multiCityRoutes:', multiCityRoutes);
    console.log('multiCityRoutes length:', multiCityRoutes.length);
    
    // Log each segment in multiCitySegment to see what we have
    if (multiCitySegment && multiCitySegment.length > 0) {
      multiCitySegment.forEach((seg: any, idx: number) => {
        console.log(`multiCitySegment[${idx}]:`, {
          Origin: seg.Origin,
          Destination: seg.Destination,
          PreferredDepartureTime: seg.PreferredDepartureTime,
          PreferredArrivalTime: seg.PreferredArrivalTime
        });
      });
    }
    
    // Log each entry in multiCitySelectedFares to see what we have
    if (multiCitySelectedFares && typeof multiCitySelectedFares === 'object') {
      Object.entries(multiCitySelectedFares).forEach(([key, value]: [string, any]) => {
        console.log(`multiCitySelectedFares[${key}]:`, {
          hasGroupedFlight: !!value?.groupedFlight,
          hasSelectedFare: !!value?.selectedFare,
          groupedFlightOrigin: value?.groupedFlight?.Segments?.[0]?.[0]?.Origin?.Airport?.CityName || value?.groupedFlight?.Segments?.[0]?.[0]?.Origin?.Airport?.AirportCode,
          groupedFlightDestination: value?.groupedFlight?.Segments?.[0]?.[value?.groupedFlight?.Segments?.[0]?.length - 1]?.Destination?.Airport?.CityName || value?.groupedFlight?.Segments?.[0]?.[value?.groupedFlight?.Segments?.[0]?.length - 1]?.Destination?.Airport?.AirportCode
        });
      });
    }
    
    // Log all entries in multiCitySelectedFares with route information
    if (typeof multiCitySelectedFares === 'object' && multiCitySelectedFares !== null) {
      Object.entries(multiCitySelectedFares).forEach(([key, value]: [string, any]) => {
        const firstSeg = value?.groupedFlight?.Segments?.[0]?.[0];
        const lastSeg = value?.groupedFlight?.Segments?.[0]?.[value?.groupedFlight?.Segments?.[0]?.length - 1];
        console.log(`Entry [${key}]:`, {
          hasGroupedFlight: !!value?.groupedFlight,
          hasSelectedFare: !!value?.selectedFare,
          route: firstSeg && lastSeg 
            ? `${firstSeg.Origin?.Airport?.CityName || firstSeg.Origin?.Airport?.AirportCode} → ${lastSeg.Destination?.Airport?.CityName || lastSeg.Destination?.Airport?.AirportCode}`
            : 'Unknown',
          groupedFlightKeys: value?.groupedFlight ? Object.keys(value.groupedFlight) : [],
          selectedFareKeys: value?.selectedFare ? Object.keys(value.selectedFare) : []
        });
      });
    }
    
    // Log each segment in multiCitySegment to see what we have
    if (multiCitySegment && multiCitySegment.length > 0) {
      multiCitySegment.forEach((seg: any, idx: number) => {
        console.log(`multiCitySegment[${idx}]:`, {
          Origin: seg.Origin,
          Destination: seg.Destination,
          PreferredDepartureTime: seg.PreferredDepartureTime,
          PreferredArrivalTime: seg.PreferredArrivalTime,
          hasSelectedFare: !!multiCitySelectedFares[idx]
        });
      });
    }
    
    // Check if it's an array instead of object
    if (Array.isArray(multiCitySelectedFares)) {
      console.warn('multiCitySelectedFares is an array, not an object!', multiCitySelectedFares);
      console.log('Array length:', multiCitySelectedFares.length);
    }
    
    // Warn if segment count mismatch
    const expectedSegments = multiCitySegment.length || multiCityRoutes.length || 0;
    const selectedFaresCount = Object.keys(multiCitySelectedFares).length;
    if (expectedSegments > selectedFaresCount) {
      console.warn(`⚠️ MISMATCH: Expected ${expectedSegments} segments but only ${selectedFaresCount} selected fares found!`);
      console.warn('This means not all segments were selected before navigation.');
    }
    
    // Set dates from multi-city segments
    if (multiCitySegment.length > 0) {
      this.departureDate = new Date(multiCitySegment[0].PreferredDepartureTime || val['departureDate']);
    }
    
    // Get segment indices sorted - handle both object and array formats
    let segmentIndices: number[] = [];
    
    if (Array.isArray(multiCitySelectedFares)) {
      // If it's an array, use indices
      segmentIndices = multiCitySelectedFares.map((_, index) => index);
      console.log('multiCitySelectedFares is an ARRAY, converting to indices');
    } else if (typeof multiCitySelectedFares === 'object' && multiCitySelectedFares !== null) {
      // If it's an object, get keys
      segmentIndices = Object.keys(multiCitySelectedFares)
        .map(k => parseInt(k))
        .filter(k => !isNaN(k))
        .sort((a, b) => a - b);
    }
    
    console.log('Segment indices:', segmentIndices);
    console.log('Number of segments to process:', segmentIndices.length);
    console.log('Expected segments from multiCitySegment:', multiCitySegment.length);
    console.log('Expected segments from multiCityRoutes:', multiCityRoutes.length);
    
    // Detailed structure logging
    console.log('multiCitySelectedFares structure:', {
      type: typeof multiCitySelectedFares,
      isArray: Array.isArray(multiCitySelectedFares),
      keys: Object.keys(multiCitySelectedFares),
      keyCount: Object.keys(multiCitySelectedFares).length,
      values: Object.values(multiCitySelectedFares).map((v: any, idx: number) => ({
        index: idx,
        hasGroupedFlight: !!v?.groupedFlight,
        hasSelectedFare: !!v?.selectedFare,
        groupedFlightSegments: v?.groupedFlight?.Segments ? v.groupedFlight.Segments.length : 0
      }))
    });
    
    // Check if we're missing segments
    const expectedCount = Math.max(multiCitySegment.length, multiCityRoutes.length, 0);
    if (segmentIndices.length < expectedCount) {
      console.error(`⚠️ CRITICAL: Only ${segmentIndices.length} segment(s) in multiCitySelectedFares but ${expectedCount} expected!`);
      console.error('This means not all segments were selected before navigation.');
      console.error('Available segment indices:', segmentIndices);
      console.error('Expected segment indices:', Array.from({length: expectedCount}, (_, i) => i));
    }
    
    // Determine how many segments we should process
    // Use multiCitySegment length as the source of truth for how many segments exist
    const expectedSegmentCount = Math.max(
      multiCitySegment.length,
      multiCityRoutes.length,
      segmentIndices.length,
      1
    );
    
    console.log(`Expected segment count: ${expectedSegmentCount}`);
    console.log(`Found ${segmentIndices.length} selected fares`);
    
    if (segmentIndices.length === 0 && expectedSegmentCount === 0) {
      console.error('No segments found in multiCitySelectedFares or multiCitySegment!');
      this.loader = false;
      return;
    }
    
    // If we have fewer selected fares than expected segments, we still want to show all segments
    // We'll process what we have and show placeholders for missing ones
    let allSegments: any[] = [];
    
    // Process each segment that has a selected fare
    console.log(`\n=== Starting to process ${segmentIndices.length} segments with selected fares ===`);
    for (const segmentIndex of segmentIndices) {
      console.log(`\n--- Processing segment index: ${segmentIndex} ---`);
      const fareData = Array.isArray(multiCitySelectedFares) 
        ? multiCitySelectedFares[segmentIndex] 
        : multiCitySelectedFares[segmentIndex];
      console.log('Fare data for segment', segmentIndex, ':', fareData);
      console.log('Fare data type:', typeof fareData);
      console.log('Fare data keys:', fareData ? Object.keys(fareData) : 'null/undefined');
      
      if (!fareData) {
        console.warn(`No fare data for segment ${segmentIndex}`);
        continue;
      }
      
      if (!fareData.groupedFlight) {
        console.warn(`No groupedFlight for segment ${segmentIndex}:`, fareData);
        continue;
      }
      
      const flight = fareData.groupedFlight;
      const selectedFare = fareData.selectedFare;
      
      console.log('Flight object:', flight);
      console.log('Flight.Segments:', flight.Segments);
      
      // Get segments from the flight
      const segmentGroups = flight.Segments || [];
      const segmentGroup = segmentGroups[0] || [];
      
      console.log('Segment group length:', segmentGroup.length);
      
      // Process each segment in this group
      const groupSegments: any[] = [];
      for (let i = 0; i < segmentGroup.length; i++) {
        const seg = segmentGroup[i];
        const origin = seg.Origin?.Airport || {};
        const destination = seg.Destination?.Airport || {};
        const depDate = new Date(seg.Origin?.DepTime || seg.DepTime);
        const arrDate = new Date(seg.Destination?.ArrTime || seg.ArrTime);
        const durationMins = Math.floor((arrDate.getTime() - depDate.getTime()) / 60000);
        
        const segmentObj: any = {
          airline: seg.Airline?.AirlineName,
          logo: `assets/images/flightimages/${seg.Airline?.AirlineCode}.png`,
          code: `${seg.Airline?.AirlineCode} ${seg.Airline?.FlightNumber}`,
          aircraft: seg.Craft,
          departureTime: this.formatTime(depDate),
          arrivalTime: this.formatTime(arrDate),
          from: origin.CityName,
          fromAirport: `${origin.AirportName || ''}, Terminal ${origin.Terminal || 'N/A'}`.trim(),
          to: destination.CityName,
          toAirport: `${destination.AirportName || ''}, Terminal ${destination.Terminal || 'N/A'}`.trim(),
          duration: this.formatDuration(durationMins),
          cabinBaggage: selectedFare?.Segments?.[0]?.[0]?.CabinBaggage || seg.CabinBaggage,
          checkInBaggage: selectedFare?.Segments?.[0]?.[0]?.Baggage || seg.Baggage,
          fareTag: selectedFare?.Segments?.[0]?.[0]?.SupplierFareClass,
          layover: null,
          originCode: origin.AirportCode,
          destinationCode: destination.AirportCode,
          date: depDate,
          depDate: depDate,
          arrDate: arrDate,
        };
        
        // Add layover if not last segment in group
        if (i < segmentGroup.length - 1) {
          const nextSeg = segmentGroup[i + 1];
          const nextDep = new Date(nextSeg.Origin?.DepTime || nextSeg.DepTime);
          const layoverMins = Math.floor((nextDep.getTime() - arrDate.getTime()) / 60000);
          const layoverHours = layoverMins / 60;
          segmentObj.layover = {
            duration: this.formatDuration(layoverMins),
            location: destination.CityName,
            hours: layoverHours
          };
        }
        
        groupSegments.push(segmentObj);
        allSegments.push(segmentObj);
      }
      
      // Add layover between segment groups (if not last segment)
      if (segmentIndex < segmentIndices.length - 1) {
        const lastSegInGroup = groupSegments[groupSegments.length - 1];
        const nextFareData = multiCitySelectedFares[segmentIndices[segmentIndices.indexOf(segmentIndex) + 1]];
        if (nextFareData && nextFareData.groupedFlight) {
          const nextFlight = nextFareData.groupedFlight;
          const nextFirstSeg = nextFlight.Segments?.[0]?.[0];
          if (nextFirstSeg) {
            const nextDep = new Date(nextFirstSeg.Origin?.DepTime || nextFirstSeg.DepTime);
            const layoverMins = Math.floor((nextDep.getTime() - lastSegInGroup.arrDate.getTime()) / 60000);
            const layoverHours = layoverMins / 60;
            lastSegInGroup.layover = {
              duration: this.formatDuration(layoverMins),
              location: lastSegInGroup.to,
              hours: layoverHours
            };
          }
        }
      }
      
      // Always push, even if empty, to maintain index alignment
      // But log warning if empty
      if (groupSegments.length === 0) {
        console.warn(`⚠ No segments created for segment index ${segmentIndex} - segmentGroup was empty`);
        console.warn('Segment group details:', {
          segmentGroupLength: segmentGroup.length,
          segmentGroup: segmentGroup,
          flightSegments: flight.Segments
        });
      }
      
      this.flightSegmentGroups.push(groupSegments);
      this.groupedFlightSegments.push(groupSegments);
      
      console.log(`✓ Processed segment ${segmentIndex}:`, {
        route: groupSegments.length > 0 
          ? `${groupSegments[0]?.from} → ${groupSegments[groupSegments.length - 1]?.to}`
          : 'NO ROUTE (empty)',
        segmentsCount: groupSegments.length,
        groupSegments: groupSegments.length > 0 
          ? groupSegments.map(s => ({ from: s.from, to: s.to, code: s.code }))
          : 'EMPTY'
      });
    }
    
    // Check if we're missing segments - if expectedSegmentCount > segmentIndices.length
    // This means some segments weren't selected, but we should still show them if possible
    if (expectedSegmentCount > segmentIndices.length) {
      console.warn(`⚠️ Only ${segmentIndices.length} of ${expectedSegmentCount} segments have selected fares.`);
      const missingIndices = Array.from({length: expectedSegmentCount}, (_, i) => i)
        .filter(i => !segmentIndices.includes(i));
      console.warn('Missing segment indices:', missingIndices);
      
      // Try to create placeholder segments from multiCitySegment for missing ones
      for (const missingIndex of missingIndices) {
        if (multiCitySegment[missingIndex]) {
          const segmentInfo = multiCitySegment[missingIndex];
          console.log(`Creating placeholder for missing segment ${missingIndex}:`, segmentInfo);
          
          // Create a basic segment structure from the route info
          const placeholderGroup: any[] = [{
            from: segmentInfo.Origin || 'Unknown',
            to: segmentInfo.Destination || 'Unknown',
            originCode: segmentInfo.Origin || '',
            destinationCode: segmentInfo.Destination || '',
            airline: 'Not Selected',
            logo: 'assets/images/flightimages/default.png',
            code: 'N/A',
            departureTime: segmentInfo.PreferredDepartureTime ? this.formatTime(new Date(segmentInfo.PreferredDepartureTime)) : 'N/A',
            arrivalTime: segmentInfo.PreferredArrivalTime ? this.formatTime(new Date(segmentInfo.PreferredArrivalTime)) : 'N/A',
            date: segmentInfo.PreferredDepartureTime ? new Date(segmentInfo.PreferredDepartureTime) : new Date(),
            depDate: segmentInfo.PreferredDepartureTime ? new Date(segmentInfo.PreferredDepartureTime) : new Date(),
            arrDate: segmentInfo.PreferredArrivalTime ? new Date(segmentInfo.PreferredArrivalTime) : new Date(),
            duration: 'N/A',
            fromAirport: segmentInfo.Origin || '',
            toAirport: segmentInfo.Destination || '',
            cabinBaggage: 'N/A',
            checkInBaggage: 'N/A',
            isPlaceholder: true
          }];
          
          this.flightSegmentGroups.push(placeholderGroup);
          this.groupedFlightSegments.push(placeholderGroup);
          allSegments.push(...placeholderGroup);
          
          console.log(`✓ Created placeholder for segment ${missingIndex}`);
        }
      }
    }
    
    // Set flightSegments to all segments for compatibility
    this.flightSegments = allSegments;
    
    console.log('Multi-city processing complete:', {
      totalGroups: this.flightSegmentGroups.length,
      totalSegments: allSegments.length,
      flightSegmentGroups: this.flightSegmentGroups,
      groupedFlightSegments: this.groupedFlightSegments,
      flightSegments: this.flightSegments
    });
    
    // Store first flight data for compatibility (used for cancellation policy)
    if (segmentIndices.length > 0) {
      const firstFareData = multiCitySelectedFares[segmentIndices[0]];
      if (firstFareData && firstFareData.groupedFlight) {
        const firstFlight = firstFareData.groupedFlight;
        this.flightDataDeparture = { Segments: firstFlight.Segments || [] };
      }
    }
    
    // Process fare breakdown for multi-city
    this.processMultiCityFareBreakdown(multiCitySelectedFares);
    
    // Force change detection to ensure UI updates
    this.cdr.detectChanges();
    
    console.log('After change detection - flightSegmentGroups length:', this.flightSegmentGroups.length);
  }

  processMultiCityFareBreakdown(multiCitySelectedFares: any): void {
    let totalBaseFare = 0;
    let totalTaxes = 0;
    
    // Sum up fares from all segments
    Object.values(multiCitySelectedFares).forEach((fareData: any) => {
      if (fareData.selectedFare) {
        // Check if fare has FareBreakdown array
        if (fareData.selectedFare.FareBreakdown && Array.isArray(fareData.selectedFare.FareBreakdown)) {
          const breakdown = fareData.selectedFare.FareBreakdown;
          // Process adult fare (PassengerType === 1 for adults)
          const adultFare = breakdown.find((f: any) => f.PassengerType === 1);
          if (adultFare) {
            const basePerAdult = adultFare.PassengerCount > 0 ? adultFare.BaseFare / adultFare.PassengerCount : adultFare.BaseFare;
            const taxPerAdult = adultFare.PassengerCount > 0 ? adultFare.Tax / adultFare.PassengerCount : adultFare.Tax;
            totalBaseFare += basePerAdult * (this.totalAdults || 1);
            totalTaxes += taxPerAdult * (this.totalAdults || 1);
          }
          // Process child fare if exists (PassengerType === 2 for children)
          const childFare = breakdown.find((f: any) => f.PassengerType === 2);
          if (childFare && this.totalChildren > 0) {
            const basePerChild = childFare.PassengerCount > 0 ? childFare.BaseFare / childFare.PassengerCount : childFare.BaseFare;
            const taxPerChild = childFare.PassengerCount > 0 ? childFare.Tax / childFare.PassengerCount : childFare.Tax;
            totalBaseFare += basePerChild * this.totalChildren;
            totalTaxes += taxPerChild * this.totalChildren;
          }
          // Process infant fare if exists (PassengerType === 3 for infants)
          const infantFare = breakdown.find((f: any) => f.PassengerType === 3);
          if (infantFare && this.totalInfants > 0) {
            const basePerInfant = infantFare.PassengerCount > 0 ? infantFare.BaseFare / infantFare.PassengerCount : infantFare.BaseFare;
            const taxPerInfant = infantFare.PassengerCount > 0 ? infantFare.Tax / infantFare.PassengerCount : infantFare.Tax;
            totalBaseFare += basePerInfant * this.totalInfants;
            totalTaxes += taxPerInfant * this.totalInfants;
          }
        } else if (fareData.selectedFare.Fare) {
          // Alternative structure with Fare object
          const fare = fareData.selectedFare.Fare;
          totalBaseFare += (fare.BaseFare || 0) * (this.totalAdults || 1);
          totalTaxes += (fare.Tax || 0) * (this.totalAdults || 1);
        } else if (fareData.price) {
          // Use price directly if available (per adult price)
          totalBaseFare += fareData.price * (this.totalAdults || 1);
        }
      }
    });
    
    this.totalBaseFare = totalBaseFare;
    this.totalTaxes = totalTaxes;
    this.adultBaseFare = this.totalAdults > 0 ? totalBaseFare / this.totalAdults : 0;
    this.adultTaxes = this.totalAdults > 0 ? totalTaxes / this.totalAdults : 0;
    
    this.updateFinalFare();
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
    this.subscriptions.add(
      this.apiService.getFareQuote(this.ipAddress, this.tboToken, this.traceid, this.resultIndex)
        .subscribe((val: any) => {
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
                  this.fareQuoteReturn = returnVal;
                  this.gstMandatoryReturn = this.fareQuoteReturn?.Response?.Results?.IsGSTMandatory;
                  
                  if(this.fareQuoteReturn?.Response?.IsPriceChanged) {
                    Swal.fire({ title: 'Return Price Changed', icon: 'warning' });
                  }
                  
                  this.processPassportReqs(this.fareQuoteReturn?.Response?.Results);
                  this.processFareBreakdown(returnVal, true);
                  this.aggregateFareSummary();
                  this.fetchSSRAfterFareQuotes();
                }, err => { this.loader = false; })
            );
          } else {
            this.aggregateFareSummary();
            this.fetchSSRAfterFareQuotes();
          }
        }, err => { this.loader = false; })
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
      this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndex).subscribe((val: any) => {
          this.ssrValues = val;
          if(val?.Response?.Baggage) this.processBaggage(val.Response.Baggage, false);
      });
      
      if(this.resultIndexReturn) {
          this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndexReturn).subscribe((val: any) => {
              this.ssrValuesReturn = val;
              if(val?.Response?.Baggage) this.processBaggage(val.Response.Baggage, true);
          });
      }
  }

  // =================================================================
  // LOGIC IMPLEMENTATION FOR CRITICAL METHODS
  // =================================================================

  processBaggage(baggageArray: any, isReturn: boolean) {
    if (!baggageArray || !Array.isArray(baggageArray) || baggageArray.length === 0) {
      isReturn ? (this.baggageOptionsReturn = []) : (this.baggageOptions = []);
      return;
    }

    // Flatten TBO nested arrays if necessary
    const flatBaggage = Array.isArray(baggageArray[0]) ? baggageArray.flat() : baggageArray;

    const mapped = flatBaggage
      .filter((item: any) => item && item.Price !== undefined)
      .map((item: any) => {
        const weightKey = item.Weight || item.kgs || '0';
        const codeKey = item.Code || weightKey;
        
        // Map price to both Code and Weight to prevent look-up failures
        this.baggagePrices[codeKey] = item.Price;
        this.baggagePrices[weightKey] = item.Price;

        return {
          kgs: weightKey,
          price: item.Price,
          Code: codeKey,
          Description: item.Description || `${weightKey} kg`
        };
      });

    if (isReturn) {
      this.baggageOptionsReturn = mapped;
      this.extraBaggageAvailableReturn = true;
    } else {
      this.baggageOptions = mapped;
      this.extraBaggageAvailable = true;
    }
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
    // Ensure we use the correct counts based on the journey type
    const counts = isReturn ? this.returnBaggageCounts : this.baggageCounts;
    const options = isReturn ? this.baggageOptionsReturn : this.baggageOptions;

    options.forEach(opt => {
      const key = opt.kgs || opt.Code;
      const count = counts[key] || 0;
      // Get price from option object (opt.price or opt.Price)
      const price = opt.price || opt.Price || 0;
      total += count * price;
    });

    if (isReturn) this.baggageTotalReturn = total;
    else this.baggageTotal = total;

    this.updateFinalFare();
    this.cdr.detectChanges(); // Refresh UI to show the updated "Total Price"
  }
  processFareBreakdown(val: any, isReturn: boolean): void {
    const results = val?.Response?.Results;
    if (!results) return;

    const fareBreakdown = results.FareBreakdown || [];
    this.isLCC = results.IsLCC;

    let totalAdults = 0, totalChildren = 0, totalInfants = 0;

    fareBreakdown.forEach(( breakdown: any ) => {
      const type = breakdown.PassengerType;
      const count = breakdown.PassengerCount;
      const baseFare = breakdown.BaseFare / count;
      const tax = breakdown.Tax / count; 

      if (type === 1) { // Adult
        totalAdults = count;
        if(isReturn) { this.adultBaseFareReturn = baseFare; this.adultTaxesReturn = tax; }
        else { this.adultBaseFare = baseFare; this.adultTaxes = tax; }
      } else if (type === 2) { // Child
        totalChildren = count;
        if(isReturn) { this.childrenBaseFareReturn = baseFare; this.childrenTaxesReturn = tax; }
        else { this.childrenBaseFare = baseFare; this.childrenTaxes = tax; }
      } else if (type === 3) { // Infant
        totalInfants = count;
        if(isReturn) { this.infantBaseFareReturn = baseFare; this.infantTaxesReturn = tax; }
        else { this.infantBaseFare = baseFare; this.infantTaxes = tax; }
      }
    });

    if (!isReturn) {
      this.totalAdults = totalAdults;
      this.totalChildren = totalChildren;
      this.totalInfants = totalInfants;
      this.travellers = Array(this.totalAdults).fill(0).map(() => this.getBlankAdult());
      this.children = Array(this.totalChildren).fill(0).map(() => this.getBlankChild());
      this.infants = Array(this.totalInfants).fill(0).map(() => this.getBlankInfant());
    }
  }

  aggregateFareSummary(): void {
    this.totalBaseFare = (this.adultBaseFare * this.totalAdults) + (this.childrenBaseFare * this.totalChildren) + (this.infantBaseFare * this.totalInfants);
    this.totalTaxes = (this.adultTaxes * this.totalAdults) + (this.childrenTaxes * this.totalChildren) + (this.infantTaxes * this.totalInfants);
    
    if(this.resultIndexReturn) {
        this.totalBaseFare += (this.adultBaseFareReturn * this.totalAdults) + (this.childrenBaseFareReturn * this.totalChildren) + (this.infantBaseFareReturn * this.totalInfants);
        this.totalTaxes += (this.adultTaxesReturn * this.totalAdults) + (this.childrenTaxesReturn * this.totalChildren) + (this.infantTaxesReturn * this.totalInfants);
    }

    this.updateFinalFare();
    this.loader = false;
  }

  updateFinalFare() {
    this.finalAmount = 
      this.totalBaseFare + 
      this.totalTaxes + 
      (this.baggageTotal || 0) + 
      (this.baggageTotalReturn || 0) + 
      (this.totalMealCharges || 0) + 
      (this.totalSpecialServiceCharges || 0) +
      (this.totalSeats || 0);
  }

  proceedToAddons(): void {
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

    // Prepare mobile final page data for addons
    this.prepareMobFinalPageData();
    
    // Navigate to addons page
    this.router.navigate(['/flightaddons']);
  }

  proceedToPayment(): void {
    // This method is now called from addons page or directly if no addons needed
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
  
  trackByGroupIndex(index: number, group: any): any {
    return index;
  }
  
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
  
  closePassengerModal() { 
    this.showPassengerModal = false;
    this.passengerValidationErrors = {};
  }
  
  validatePassengerDetails(details: any): boolean {
    this.passengerValidationErrors = {};
    let isValid = true;

    // Validate First Name
    if (!details.firstName || !details.firstName.trim()) {
      this.passengerValidationErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate Last Name
    if (!details.lastName || !details.lastName.trim()) {
      this.passengerValidationErrors.lastName = 'Last name is required';
      isValid = false;
    }

    // Validate Gender
    if (!details.gender || !details.gender.trim()) {
      this.passengerValidationErrors.gender = 'Gender is required';
      isValid = false;
    }

    // Validate Date of Birth
    if (!details.dobDay || !details.dobDay.trim()) {
      this.passengerValidationErrors.dobDay = 'Date of birth is required';
      isValid = false;
    }
    if (!details.dobMonth || !details.dobMonth.trim()) {
      this.passengerValidationErrors.dobMonth = 'Date of birth is required';
      isValid = false;
    }
    if (!details.dobYear || !details.dobYear.trim()) {
      this.passengerValidationErrors.dobYear = 'Date of birth is required';
      isValid = false;
    }

    // Validate Email (for adults only)
    if (this.currentPassengerType === 'adult') {
      if (!details.email || !details.email.trim()) {
        this.passengerValidationErrors.email = 'Email is required';
        isValid = false;
      } else {
        // Email format validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(details.email.trim())) {
          this.passengerValidationErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
      }
    }

    // Validate Mobile Number (for adults only)
    if (this.currentPassengerType === 'adult') {
      if (!details.mobileNumber || !details.mobileNumber.trim()) {
        this.passengerValidationErrors.mobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (details.mobileNumber.length < 10) {
        this.passengerValidationErrors.mobileNumber = 'Mobile number must be at least 10 digits';
        isValid = false;
      }
    }

    // Validate Passport Number (if required)
    if (this.passportInfoRequired && (!details.passportNumber || !details.passportNumber.trim())) {
      this.passengerValidationErrors.passportNumber = 'Passport number is required';
      isValid = false;
    }

    // Validate PAN Number (if required)
    if (this.panInfoRequired && (!details.panNumber || !details.panNumber.trim())) {
      this.passengerValidationErrors.panNumber = 'PAN number is required';
      isValid = false;
    }

    this.cdr.detectChanges();
    return isValid;
  }

  savePassengerDetails(details: any) {
    // Validate before saving
    if (!this.validatePassengerDetails(details)) {
      return; // Don't save if validation fails
    }

    const arr = this.currentPassengerType === 'adult' ? this.travellers : this.currentPassengerType === 'child' ? this.children : this.infants;
    if (arr[this.currentPassengerIndex]) {
      Object.assign(arr[this.currentPassengerIndex], details);
      // Trigger change detection to update the proceed button state
      this.cdr.detectChanges();
    }
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
    
    this.loader = true;
    this.proceedToAddons();
  }
  
  // Baggage methods for mobile
  incrementBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    if (!this.baggageCounts[key]) {
      this.baggageCounts[key] = 0;
    }

    // Check if adding more exceeds passenger count
    const totalSelected = Object.values(this.baggageCounts).reduce((a, b) => a + b, 0);
    if (totalSelected < (this.totalAdults + this.totalChildren)) {
      this.baggageCounts[key]++;
      this.updateBaggageTotal(false);
    } else {
      Swal.fire('Limit Reached', 'You cannot add more baggage than passengers', 'warning');
    }
  }

  decrementBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    if (this.baggageCounts[key] && this.baggageCounts[key] > 0) {
      this.baggageCounts[key]--;
      this.updateBaggageTotal(false);
    }
  }
  
  incrementRoundBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    const counts = this.activeRoundBaggageTab === 'onward' ? this.onwardBaggageCounts : this.returnBaggageCounts;
    
    if (!counts[key]) counts[key] = 0;

    const totalInThisLeg = Object.values(counts).reduce((a: number, b: number) => a + b, 0);
    if (totalInThisLeg < (this.totalAdults + this.totalChildren)) {
      counts[key]++;
      this.updateRoundTripBaggageTotal();
    } else {
      Swal.fire('Limit Reached', 'You cannot add more baggage than passengers', 'warning');
    }
  }

  decrementRoundBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    const counts = this.activeRoundBaggageTab === 'onward' ? this.onwardBaggageCounts : this.returnBaggageCounts;
    
    if (counts[key] && counts[key] > 0) {
      counts[key]--;
      this.updateRoundTripBaggageTotal();
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
  parseSeatData(isReturn: boolean) {} 
  processSpecialServices(rawSSR: any[], type: 'onward' | 'return') {}

  // Prepare mobile final page data structure for addon page
  prepareMobFinalPageData(): void {
    const onwardFareSummary = this.buildFareSummaryForAddons(false);
    const returnFareSummary = this.tripType === 'roundtrip' ? this.buildFareSummaryForAddons(true) : null;

    const mobFinalPageData = {
      flightSegments: this.flightSegments,
      flightSegmentsReturn: this.flightSegmentsReturn,
      passengers: {
        adults: this.travellers,
        children: this.children,
        infants: this.infants
      },
      gstDetails: this.gstDetails,
      ssr: {
        onward: this.ssrValues,
        return: this.ssrValuesReturn
      },
      fareSummary: {
        onward: onwardFareSummary,
        return: returnFareSummary,
        finalAmount: this.finalAmount
      },
      baggage: {
        onward: this.buildBaggageArray(false),
        return: this.tripType === 'roundtrip' ? this.buildBaggageArray(true) : []
      },
      other: {
        resultIndex: this.resultIndex,
        resultIndexReturn: this.resultIndexReturn
      },
      extraMandatoryFields: {
        mealMandatoryOnward: false,
        seatMandatoryOnward: false,
        mealMandatoryReturn: false,
        seatMandatoryReturn: false
      },
      passportRequired: this.passportInfoRequired
    };

    // Prepare complete data structure
    const dataToPass = {
      ...this.fullFlightData,
      mobFinalPageData: mobFinalPageData,
      adults: this.totalAdults,
      children: this.totalChildren,
      infants: this.totalInfants,
      tripType: this.tripType,
      fromCity: this.fullFlightData.fromCity || this.flightSegments[0]?.from,
      toCity: this.fullFlightData.toCity || this.flightSegments[this.flightSegments.length - 1]?.to,
      departureDate: this.departureDate?.toISOString().split('T')[0],
      returnDate: this.returnDate?.toISOString().split('T')[0],
      tboToken: this.tboToken,
      traceid: this.traceid,
      ipAddress: this.ipAddress
    };

    console.log('📦 Navigating to addons with data:', dataToPass);
    this.flightDataService.updateMessage(dataToPass);
  }

  private buildFareSummaryForAddons(isReturn: boolean) {
    const baseFareArray = [];
    const taxesArray = [];

    if (!isReturn) {
      if (this.totalAdults > 0) {
        baseFareArray.push({ label: 'Adults', count: this.totalAdults, amount: this.adultBaseFare });
        taxesArray.push({ label: 'Adults', count: this.totalAdults, amount: this.adultTaxes });
      }
      if (this.totalChildren > 0) {
        baseFareArray.push({ label: 'Children', count: this.totalChildren, amount: this.childrenBaseFare });
        taxesArray.push({ label: 'Children', count: this.totalChildren, amount: this.childrenTaxes });
      }
      if (this.totalInfants > 0) {
        baseFareArray.push({ label: 'Infants', count: this.totalInfants, amount: this.infantBaseFare });
        taxesArray.push({ label: 'Infants', count: this.totalInfants, amount: this.infantTaxes });
      }
    } else {
      if (this.totalAdults > 0) {
        baseFareArray.push({ label: 'Adults', count: this.totalAdults, amount: this.adultBaseFareReturn });
        taxesArray.push({ label: 'Adults', count: this.totalAdults, amount: this.adultTaxesReturn });
      }
      if (this.totalChildren > 0) {
        baseFareArray.push({ label: 'Children', count: this.totalChildren, amount: this.childrenBaseFareReturn });
        taxesArray.push({ label: 'Children', count: this.totalChildren, amount: this.childrenTaxesReturn });
      }
      if (this.totalInfants > 0) {
        baseFareArray.push({ label: 'Infants', count: this.totalInfants, amount: this.infantBaseFareReturn });
        taxesArray.push({ label: 'Infants', count: this.totalInfants, amount: this.infantTaxesReturn });
      }
    }

    const summary = {
      baseFare: baseFareArray,
      taxes: taxesArray,
      baggageCharges: this.buildBaggageChargesForSummary(isReturn),
      mealCharges: 0,
      seatCharges: 0,
      specialServiceCharges: 0,
      totalAmount: isReturn ? this.getReturnTotal() : this.getOnwardTotal()
    };

    return {
      summary: summary,
      adultFareDetails: isReturn ? 
        { BaseFare: this.adultBaseFareReturn, Tax: this.adultTaxesReturn } : 
        { BaseFare: this.adultBaseFare, Tax: this.adultTaxes },
      childFareDetail: isReturn ?
        { BaseFare: this.childrenBaseFareReturn, Tax: this.childrenTaxesReturn } :
        { BaseFare: this.childrenBaseFare, Tax: this.childrenTaxes },
      infantFareDetails: isReturn ?
        { BaseFare: this.infantBaseFareReturn, Tax: this.infantTaxesReturn } :
        { BaseFare: this.infantBaseFare, Tax: this.infantTaxes },
      fareDetails: isReturn ? this.fareQuoteReturn : this.fareQuote
    };
  }

  private buildBaggageChargesForSummary(isReturn: boolean): any[] {
    // Match mobile version: use baggageCounts (keyed by weight/kgs) for oneway, or onwardBaggageCounts/returnBaggageCounts for roundtrip
    const getBaggageCharges = (baggageCounts: { [key: number]: number }) =>
      Object.entries(baggageCounts)
        .filter(([_, count]) => count > 0)
        .map(([kgs, count]) => {
          // Try both string and number keys for baggagePrices (weightKey is stored as string)
          const price = this.baggagePrices[kgs] || this.baggagePrices[+kgs] || 0;
          return {
            label: `Excess ${kgs}kg : ${count} × ₹${price.toLocaleString()}`,
            amount: price * count
          };
        });

    if (this.tripType === 'oneway') {
      return getBaggageCharges(this.baggageCounts);
    } else {
      // Round trip: use onwardBaggageCounts or returnBaggageCounts based on isReturn
      return getBaggageCharges(isReturn ? this.returnBaggageCounts : this.onwardBaggageCounts);
    }
  }

  private buildBaggageArray(isReturn: boolean): any[] {
    const baggageArray: any[] = [];
    
    // Match mobile version: use baggageCounts for oneway, or onwardBaggageCounts/returnBaggageCounts for roundtrip
    let counts: { [key: number]: number } = {};
    const options = isReturn ? this.baggageOptionsReturn : this.baggageOptions;
    
    if (this.tripType === 'oneway') {
      counts = this.baggageCounts;
    } else {
      counts = isReturn ? this.returnBaggageCounts : this.onwardBaggageCounts;
    }

    options.forEach((opt: any) => {
      // Match mobile version: use weight/kgs as key, fallback to Code
      const key = opt.kgs || opt.Code;
      const count = counts[key] || 0;
      for (let i = 0; i < count; i++) {
        baggageArray.push({
          Code: opt.Code,
          Description: opt.Description,
          Weight: opt.kgs,
          WeightKG: opt.kgs, // Add both for compatibility
          Price: opt.price,
          Origin: isReturn 
            ? (this.flightSegmentsReturn[0]?.originCode || this.flightSegments[this.flightSegments.length - 1]?.destinationCode)
            : (this.flightSegments[0]?.originCode || ''),
          Destination: isReturn
            ? (this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode || '')
            : (this.flightSegments[this.flightSegments.length - 1]?.destinationCode || ''),
          AirlineCode: opt.AirlineCode || '',
          FlightNumber: opt.FlightNumber || '',
          WayType: opt.WayType || 0,
          Currency: opt.Currency || 'INR'
        });
      }
    });

    return baggageArray;
  }
}