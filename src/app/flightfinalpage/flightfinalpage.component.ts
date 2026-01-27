import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import { FlightbookingpayloadService } from '../services/flightbookingpayload.service';
import { FlightaddonsService } from '../services/flightaddons.service';
import Swal from 'sweetalert2';
import { PhoneDialerComponent } from '../shared/phone-dialer/phone-dialer.component';
import { CustomCalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-flightfinalpage',
  standalone: true,
  imports: [CommonModule, FormsModule, PhoneDialerComponent, CustomCalendarComponent],
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
  
  // Addon Services State
  isSeatsExpanded: boolean = false;
  isCabsExpanded: boolean = false;
  isAddonsExpanded: boolean = false;
  activeSeatsTab: 'seats' | 'meals' = 'seats';
  
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
  
  // Special Services
  services: any[] = [];
  
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
  showFareSummaryModal: boolean = false;
  showAddBaggageModal: boolean = false;
  showPolicyModal: boolean = false;
  showGSTModal: boolean = false;
  isGSTExpanded: boolean = false;
  showMobileFareBreakdown: boolean = false;
  
  // Fare Summary Accordion States
  isBaseFareExpanded: boolean = false;
  isTaxesExpanded: boolean = false;
  isOtherServicesExpanded: boolean = false;
  isBaggageExpanded: boolean = false;
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
  
  // Desktop inline form expansion
  expandedPassengerKey: string | null = null; // Format: "adult-0", "child-1", etc.
  
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
    public flightAddonsService: FlightaddonsService,
    public router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    public bookingPayloadService: FlightbookingpayloadService
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
    
    // Extract resultIndex and flightDataDeparture (matches mobile version - set before checking trip type)
    const departureFlightData = val['departureFlightData'];
    const returnFlightData = val['returnFlightData'];
    
    // Extract resultIndex - check both possible locations
    if (departureFlightData?.selectedFare?.originalFareOption?.ResultIndex) {
      this.resultIndex = departureFlightData.selectedFare.originalFareOption.ResultIndex;
      // Use originalFareOption for segments processing, but preserve policies from parent if available
      this.flightDataDeparture = {
        ...departureFlightData.selectedFare.originalFareOption,
        cancellationPolicy: departureFlightData.selectedFare.originalFareOption.cancellationPolicy || departureFlightData.cancellationPolicy || [],
        dateChangePolicy: departureFlightData.selectedFare.originalFareOption.dateChangePolicy || departureFlightData.dateChangePolicy || []
      };
    } else if (departureFlightData?.ResultIndex) {
      this.resultIndex = departureFlightData.ResultIndex;
      this.flightDataDeparture = departureFlightData;
    } else {
      this.resultIndex = '';
      this.flightDataDeparture = departureFlightData;
    }
    
    if (returnFlightData) {
      if (returnFlightData?.selectedFare?.originalFareOption?.ResultIndex) {
        this.resultIndexReturn = returnFlightData.selectedFare.originalFareOption.ResultIndex;
        // Use originalFareOption for segments processing, but preserve policies from parent if available
        this.flightDataReturn = {
          ...returnFlightData.selectedFare.originalFareOption,
          cancellationPolicy: returnFlightData.selectedFare.originalFareOption.cancellationPolicy || returnFlightData.cancellationPolicy || [],
          dateChangePolicy: returnFlightData.selectedFare.originalFareOption.dateChangePolicy || returnFlightData.dateChangePolicy || []
        };
      } else if (returnFlightData?.ResultIndex) {
        this.resultIndexReturn = returnFlightData.ResultIndex;
        this.flightDataReturn = returnFlightData;
      } else {
        this.resultIndexReturn = '';
        this.flightDataReturn = returnFlightData;
      }
    } else {
      this.resultIndexReturn = '';
      this.flightDataReturn = null;
    }
    
    // Handle multi-city (matches mobile version - simple check after extracting flightDataDeparture)
    if (this.tripType === 'multicity') {
      if (this.flightDataDeparture && this.flightDataDeparture.Segments) {
        this.processMultiCitySegments();
      } else {
        console.error('Multi-city flight data not found!');
        this.loader = false;
        return;
      }
      
      // Initialize passenger counts from input data
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
      
      // Load fare rules
      this.loadFareRules();
      
      // Call fare quote to get fare breakdown and SSR data
      if (this.traceid && this.resultIndex) {
        this.callFareQuote();
      } else {
        this.loader = false;
      }
      return;
    }
    
    // Handle one-way and round-trip (below)
    // Set dates
    if (val['departureDate']) {
      this.departureDate = new Date(val['departureDate']);
    }
    if (val['returnDate']) {
      this.returnDate = new Date(val['returnDate']);
    }

    // Initialize passenger counts from input data
    this.totalAdults = val['adults'] || 1;
    this.totalChildren = val['children'] || 0;
    this.totalInfants = val['infants'] || 0;
    
    // Initialize passenger arrays
    this.travellers = Array(this.totalAdults).fill(0).map(() => this.getBlankAdult());
    this.children = Array(this.totalChildren).fill(0).map(() => this.getBlankChild());
    this.infants = Array(this.totalInfants).fill(0).map(() => this.getBlankInfant());

    if (this.flightDataDeparture) {
      this.processSegments(this.flightDataDeparture, false);
    }

    if (this.flightDataReturn) {
      this.processSegments(this.flightDataReturn, true);
    }
    
    // Initialize baggage counts
    this.maxAllowedBaggageCount = this.totalAdults + this.totalChildren;
    this.travelerCount = this.totalAdults + this.totalChildren + this.totalInfants;
    
    // Load fare rules
    this.loadFareRules();
    
    // Call fare quote to get fare breakdown and SSR data
    if (this.traceid && this.resultIndex) {
      this.callFareQuote();
    } else {
      this.loader = false;
    }
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
            cabin: seg.CabinBaggage, // For desktop template
            checkIn: seg.Baggage, // For desktop template
            fareTag: seg.SupplierFareClass,
            fareClass: seg.SupplierFareClass, // For desktop template
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

  processMultiCitySegments(): void {
    // Simplified to match mobile version - directly use flightDataDeparture.Segments
    if (this.flightDataDeparture && this.flightDataDeparture.Segments) {
      const allSegmentsNested = this.flightDataDeparture.Segments || [];
      this.flightSegments = [];
      this.flightSegmentGroups = [];

      const stopCities: string[] = [];
      let overallFirstDepTime: Date | null = null;
      let overallLastArrTime: Date | null = null;
      let firstLegDepTime: Date | null = null;
      let lastLegArrTime: Date | null = null;

      for (const segmentGroup of allSegmentsNested) {
        const group: any[] = [];

        for (let i = 0; i < segmentGroup.length; i++) {
          const seg = segmentGroup[i];
          const origin = seg.Origin?.Airport || {};
          const destination = seg.Destination?.Airport || {};

          const depDate = new Date(seg.DepTime || seg.Origin?.DepTime);
          const arrDate = new Date(seg.ArrTime || seg.Destination?.ArrTime);

          if (!firstLegDepTime) firstLegDepTime = depDate;
          lastLegArrTime = arrDate;

          if (!overallFirstDepTime || depDate < overallFirstDepTime) overallFirstDepTime = depDate;
          if (!overallLastArrTime || arrDate > overallLastArrTime) overallLastArrTime = arrDate;

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
            cabin: seg.CabinBaggage, // For desktop template
            checkIn: seg.Baggage, // For desktop template
            fareTag: seg.SupplierFareClass,
            fareClass: seg.SupplierFareClass, // For desktop template
            layover: null,
            originCode: origin.AirportCode,
            destinationCode: destination.AirportCode,
            date: depDate,
            depDate: depDate,
            arrDate: arrDate
          };

          if (i < segmentGroup.length - 1) {
            const nextSeg = segmentGroup[i + 1];
            const nextDep = new Date(nextSeg.DepTime || nextSeg.Origin?.DepTime);
            const layoverMins = Math.floor((nextDep.getTime() - arrDate.getTime()) / 60000);
            const layoverHrs = layoverMins / 60;

            segmentObj.layover = {
              duration: this.formatDuration(layoverMins),
              location: destination.CityName,
              hours: +layoverHrs.toFixed(2)
            };

            stopCities.push(destination.CityName);
          }

          this.flightSegments.push(segmentObj);
          group.push(segmentObj);
        }

        this.flightSegmentGroups.push(group);
      }
      
      // Total duration across all legs
      if (overallFirstDepTime && overallLastArrTime) {
        const totalDurationMins = Math.floor((overallLastArrTime.getTime() - overallFirstDepTime.getTime()) / 60000);
        this.totalFlightDuration = this.formatDuration(totalDurationMins);
      }

      // Stop summary
      const totalStops = this.flightSegments.filter(seg => seg.layover).length;
      if (totalStops === 0) {
        this.stopSummary = 'Non-stop';
      } else {
        this.stopSummary = `${totalStops} stop${totalStops > 1 ? 's' : ''} via ${stopCities.join(', ')}`;
      }

      // Cancellation & Date change policies
      this.cancellationPolicy = this.flightDataDeparture.cancellationPolicy || [];
      this.dateChangePolicy = this.flightDataDeparture.dateChangePolicy || [];
      
      // Set groupedFlightSegments for mobile template compatibility
      this.groupedFlightSegments = this.flightSegmentGroups;
    } else {
      Swal.fire({
        title: 'Sorry!',
        html: 'Flight Data could not be loaded properly, kindly start again!',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      this.router.navigate(['/']);
    }
  }

  createPlaceholderForSegment(missingIndex: number, multiCitySegment: any[], allSegments: any[]): void {
    if (multiCitySegment[missingIndex]) {
      const segmentInfo = multiCitySegment[missingIndex];
      console.log(`Creating placeholder for missing segment ${missingIndex}:`, segmentInfo);
      
      // Extract origin and destination - handle both airport code and full airport object
      const originCode = segmentInfo.Origin?.Airport?.AirportCode || segmentInfo.Origin?.AirportCode || segmentInfo.Origin || '';
      const destCode = segmentInfo.Destination?.Airport?.AirportCode || segmentInfo.Destination?.AirportCode || segmentInfo.Destination || '';
      const originCity = segmentInfo.Origin?.Airport?.CityName || segmentInfo.Origin?.CityName || originCode;
      const destCity = segmentInfo.Destination?.Airport?.CityName || segmentInfo.Destination?.CityName || destCode;
      
      // Create a basic segment structure from the route info
      // Ensure we always have a valid date for the template
      const depDate = segmentInfo.PreferredDepartureTime ? new Date(segmentInfo.PreferredDepartureTime) : new Date();
      const arrDate = segmentInfo.PreferredArrivalTime ? new Date(segmentInfo.PreferredArrivalTime) : depDate;
      
      const placeholderGroup: any[] = [{
        from: originCity,
        to: destCity,
        originCode: originCode,
        destinationCode: destCode,
        airline: 'Not Selected',
        logo: 'assets/images/flightimages/default.png',
        code: 'N/A',
        departureTime: segmentInfo.PreferredDepartureTime ? this.formatTime(depDate) : 'N/A',
        arrivalTime: segmentInfo.PreferredArrivalTime ? this.formatTime(arrDate) : 'N/A',
        date: depDate,
        depDate: depDate,
        arrDate: arrDate,
        duration: 'N/A',
        fromAirport: originCity,
        toAirport: destCity,
        cabinBaggage: 'N/A',
        checkInBaggage: 'N/A',
        isPlaceholder: true
      }];
      
      this.flightSegmentGroups.push(placeholderGroup);
      this.groupedFlightSegments.push(placeholderGroup);
      allSegments.push(...placeholderGroup);
      
      console.log(`✓ Created placeholder for segment ${missingIndex}:`, {
        from: originCity,
        to: destCity,
        originCode: originCode,
        destCode: destCode
      });
    }
  }

  getAdultFarePerPerson(fareBreakdown: any[]): number {
    if (!fareBreakdown || !Array.isArray(fareBreakdown)) return 0;
    const adultFare = fareBreakdown.find((f: any) => f.PassengerType === 1);
    if (!adultFare) return 0;
    return adultFare.PassengerCount > 0 
      ? (adultFare.BaseFare + adultFare.Tax) / adultFare.PassengerCount 
      : (adultFare.BaseFare + adultFare.Tax);
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
          if (!val) {
            Swal.fire({
              title: 'Sorry!',
              html: 'Latest Fare could not be loaded!',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.router.navigate(['/']);
            return;
          }

          if (val?.Response?.ResponseStatus === 2) {
            const errorMessage = val?.Response?.Error?.ErrorMessage || 'Fare Quote failed from the Supplier end. Please try again.';
            Swal.fire({
              title: 'Sorry!',
              html: errorMessage,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.router.navigate(['/']);
            return;
          }

          if (!val?.Response?.Results || val?.Response?.Results === 2) {
            const errorMessage = val?.Response?.Error?.ErrorMessage || 'Fare Quote failed from the Supplier end. Please try again.';
            Swal.fire({
              title: 'Sorry!',
              html: errorMessage,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.router.navigate(['/']);
            return;
          }

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
                  if (!returnVal) {
                    Swal.fire({
                      title: 'Sorry!',
                      html: 'Latest Return Fare could not be loaded!',
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    });
                    this.router.navigate(['/']);
                    return;
                  }

                  if (returnVal?.Response?.ResponseStatus === 2) {
                    const errorMessage = returnVal?.Response?.Error?.ErrorMessage || 'Fare Quote failed from the Supplier end. Please try again.';
                    Swal.fire({
                      title: 'Sorry!',
                      html: errorMessage,
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    });
                    this.router.navigate(['/']);
                    return;
                  }
                  
                  this.fareQuoteReturn = returnVal;
                  this.gstMandatoryReturn = this.fareQuoteReturn?.Response?.Results?.IsGSTMandatory;
                  
                  if(this.fareQuoteReturn?.Response?.IsPriceChanged) {
                    Swal.fire({ title: 'Return Price Changed', icon: 'warning' });
                  }
                  
                  this.processPassportReqs(this.fareQuoteReturn?.Response?.Results);
                  this.processFareBreakdown(returnVal, true);
                  this.aggregateFareSummary();
                  this.fetchSSRAfterFareQuotes();
                }, (error) => {
                  console.error("Error fetching return fare quote:", error);
                  this.loader = false;
                  this.fetchSSRAfterFareQuotes();
                })
            );
          } else {
            // For one-way and multi-city, aggregate immediately and proceed with SSR
            this.aggregateFareSummary();
            this.fetchSSRAfterFareQuotes();
          }
        }, (error) => {
          console.error("Error fetching outbound fare quote:", error);
          this.loader = false;
          this.fetchSSRAfterFareQuotes();
        })
    );
  }

  processPassportReqs(results: any) {
      if(!results) return;
      
      // Process passport requirements
      const passportChecks = {
        IsPassportFullDetailRequiredAtBook: results.IsPassportFullDetailRequiredAtBook,
        IsPassportRequiredAtBook: results.IsPassportRequiredAtBook,
        IsPassportRequiredAtTicket: results.IsPassportRequiredAtTicket
      };
      
      this.passportInfoRequired = this.passportInfoRequired || !!(
        passportChecks.IsPassportFullDetailRequiredAtBook ||
        passportChecks.IsPassportRequiredAtBook ||
        passportChecks.IsPassportRequiredAtTicket
      );
      
      // Process PAN requirements (similar to mobile version)
      const panChecks = {
        IsPanRequiredAtTicket: results.IsPanRequiredAtTicket,
        IsPanRequiredAtBook: results.IsPanRequiredAtBook
      };
      
      this.panInfoRequired = this.panInfoRequired || !!(
        panChecks.IsPanRequiredAtTicket ||
        panChecks.IsPanRequiredAtBook
      );
  }

  fetchSSRAfterFareQuotes() {
      console.log('🔍 Fetching SSR with params:', {
        ipAddress: this.ipAddress,
        tboToken: this.tboToken,
        traceid: this.traceid,
        resultIndex: this.resultIndex
      });
      
      this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndex).subscribe(
        (val: any) => {
          console.log('✅ SSR Response (Onward):', val);
          this.ssrValues = val;
          
          if (val?.Response?.Baggage) {
            console.log('✅ Baggage data found (Onward):', val.Response.Baggage);
            this.processBaggage(val.Response.Baggage, false);
          } else {
            console.warn('⚠️ No baggage data in SSR response (Onward):', val);
            this.extraBaggageAvailable = false;
          }
        },
        (error) => {
          console.error('❌ Error fetching SSR (Onward):', error);
          this.extraBaggageAvailable = false;
        }
      );
      
      if(this.resultIndexReturn) {
          console.log('🔍 Fetching SSR for return with params:', {
            resultIndexReturn: this.resultIndexReturn
          });
          
          this.apiService.getSSR(this.ipAddress, this.tboToken, this.traceid, this.resultIndexReturn).subscribe(
            (val: any) => {
              console.log('✅ SSR Response (Return):', val);
              this.ssrValuesReturn = val;
              
              if (val?.Response?.Baggage) {
                console.log('✅ Baggage data found (Return):', val.Response.Baggage);
                this.processBaggage(val.Response.Baggage, true);
              } else {
                console.warn('⚠️ No baggage data in SSR response (Return):', val);
                this.extraBaggageAvailableReturn = false;
              }
            },
            (error) => {
              console.error('❌ Error fetching SSR (Return):', error);
              this.extraBaggageAvailableReturn = false;
            }
          );
      }
  }

  // =================================================================
  // LOGIC IMPLEMENTATION FOR CRITICAL METHODS
  // =================================================================

  processBaggage(baggageArray: any, isReturn: boolean) {
    console.log(`🧳 processBaggage called (isReturn: ${isReturn})`, {
      baggageArray,
      isArray: Array.isArray(baggageArray),
      length: baggageArray?.length
    });
    
    if (!baggageArray || !Array.isArray(baggageArray) || baggageArray.length === 0) {
      console.warn(`⚠️ No baggage array or empty (isReturn: ${isReturn})`);
      isReturn ? (this.baggageOptionsReturn = []) : (this.baggageOptions = []);
      isReturn ? (this.extraBaggageAvailableReturn = false) : (this.extraBaggageAvailable = false);
      return;
    }

    // Flatten TBO nested arrays if necessary
    const flatBaggage = Array.isArray(baggageArray[0]) ? baggageArray.flat() : baggageArray;
    console.log(`🧳 Flattened baggage (isReturn: ${isReturn}):`, flatBaggage);

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

    console.log(`🧳 Mapped baggage options (isReturn: ${isReturn}):`, mapped);
    console.log(`🧳 Baggage prices map:`, this.baggagePrices);

    if (isReturn) {
      this.baggageOptionsReturn = mapped;
      this.extraBaggageAvailableReturn = mapped.length > 0;
      console.log(`✅ extraBaggageAvailableReturn set to: ${this.extraBaggageAvailableReturn}`);
    } else {
      this.baggageOptions = mapped;
      this.extraBaggageAvailable = mapped.length > 0;
      console.log(`✅ extraBaggageAvailable set to: ${this.extraBaggageAvailable}`);
    }
    
    this.cdr.detectChanges();
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
    if (!results) {
      console.warn('⚠️ processFareBreakdown: No results in response', val);
      return;
    }

    const fareBreakdown = results.FareBreakdown || [];
    this.isLCC = results.IsLCC;

    // Debug logging for multicity
    if (this.tripType === 'multicity' && !isReturn) {
      console.log('🔍 Multicity processFareBreakdown:', {
        hasResults: !!results,
        fareBreakdownLength: fareBreakdown.length,
        fareBreakdown: fareBreakdown
      });
    }

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

    // Debug logging for multicity after processing
    if (this.tripType === 'multicity' && !isReturn) {
      console.log('✅ Multicity processFareBreakdown completed:', {
        totalAdults,
        totalChildren,
        totalInfants,
        adultBaseFare: this.adultBaseFare,
        adultTaxes: this.adultTaxes,
        childrenBaseFare: this.childrenBaseFare,
        childrenTaxes: this.childrenTaxes
      });
    }

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

  getValidationErrors(): string[] {
    const errors: string[] = [];
    const adults = this.travellers || [];
    const children = this.children || [];
    const infants = this.infants || [];
    
    // Check primary adult contact info
    const primaryAdult = adults[0];
    if (!primaryAdult) {
      errors.push('Add at least one adult passenger');
      return errors;
    }
    
    const hasValidEmail = primaryAdult.email && primaryAdult.email.trim().length > 0;
    const hasValidMobile = primaryAdult.mobileNumber && primaryAdult.mobileNumber.length >= 10;
    
    if (!hasValidEmail) {
      const hasOldEmail = this.contact.email && this.contact.email.trim().length > 0;
      if (!hasOldEmail) {
        errors.push('Enter primary passenger email address');
      }
    }
    
    if (!hasValidMobile) {
      const hasOldMobile = this.contact.mobile && this.contact.mobile.length >= 10;
      if (!hasOldMobile) {
        errors.push('Enter primary passenger mobile number');
      }
    }
    
    // Check each adult
    for (let i = 0; i < adults.length; i++) {
      const t = adults[i];
      const label = `Adult ${i + 1}`;
      
      if (!t.firstName || !t.firstName.trim()) {
        errors.push(`${label}: Enter first name`);
      }
      if (!t.lastName || !t.lastName.trim()) {
        errors.push(`${label}: Enter last name`);
      }
      if (!t.gender || !t.gender.trim()) {
        errors.push(`${label}: Select gender`);
      }
      if (!t.dobYear || !t.dobMonth || !t.dobDay) {
        errors.push(`${label}: Enter date of birth`);
      } else if (!this.validateAdultDOB(t)) {
        errors.push(`${label}: Invalid date of birth (must be 12+ years old)`);
      }
      if (this.passportInfoRequired && (!t.passportNumber || !t.passportNumber.trim())) {
        errors.push(`${label}: Enter passport number`);
      }
      if (this.panInfoRequired && (!t.panNumber || !t.panNumber.trim())) {
        errors.push(`${label}: Enter PAN number`);
      }
    }
    
    // Check each child
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const label = `Child ${i + 1}`;
      
      if (!c.firstName || !c.firstName.trim()) {
        errors.push(`${label}: Enter first name`);
      }
      if (!c.lastName || !c.lastName.trim()) {
        errors.push(`${label}: Enter last name`);
      }
      if (!c.gender || !c.gender.trim()) {
        errors.push(`${label}: Select gender`);
      }
      if (!c.dobYear || !c.dobMonth || !c.dobDay) {
        errors.push(`${label}: Enter date of birth`);
      }
      if (this.passportInfoRequired && (!c.passportNumber || !c.passportNumber.trim())) {
        errors.push(`${label}: Enter passport number`);
      }
      if (this.panInfoRequired && (!c.panNumber || !c.panNumber.trim())) {
        errors.push(`${label}: Enter PAN number`);
      }
    }
    
    // Check each infant
    for (let i = 0; i < infants.length; i++) {
      const inf = infants[i];
      const label = `Infant ${i + 1}`;
      
      if (!inf.firstName || !inf.firstName.trim()) {
        errors.push(`${label}: Enter first name`);
      }
      if (!inf.lastName || !inf.lastName.trim()) {
        errors.push(`${label}: Enter last name`);
      }
      if (!inf.gender || !inf.gender.trim()) {
        errors.push(`${label}: Select gender`);
      }
      if (!inf.dobYear || !inf.dobMonth || !inf.dobDay) {
        errors.push(`${label}: Enter date of birth`);
      }
      if (this.passportInfoRequired && (!inf.passportNumber || !inf.passportNumber.trim())) {
        errors.push(`${label}: Enter passport number`);
      }
    }
    
    // Check GST if mandatory
    const hasGST = this.gstDetails?.companyName || this.contact.hasGST;
    if (hasGST && (this.gstMandatoryOnward || this.gstMandatoryReturn)) {
      const gstNumber = this.gstDetails?.gstNumber || this.gstInfo?.registrationNo;
      if (!this.gstDetails?.companyName && !this.gstInfo?.companyName) {
        errors.push('GST: Enter company name');
      }
      if (!gstNumber || !gstNumber.trim()) {
        errors.push('GST: Enter GST number');
      }
    }
    
    return errors;
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
    const counts = isReturn ? this.returnBaggageCounts : this.baggageCounts;
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

  // Helper method to get DOB as date string for calendar component
  getDOBAsDateString(passenger: any): string {
    if (!passenger.dobYear || !passenger.dobMonth || !passenger.dobDay) return '';
    
    // Handle month names or numbers
    let monthNum: string;
    if (typeof passenger.dobMonth === 'string' && isNaN(parseInt(passenger.dobMonth))) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = monthNames.indexOf(passenger.dobMonth);
      monthNum = String(monthIndex + 1).padStart(2, '0');
    } else {
      monthNum = String(passenger.dobMonth).padStart(2, '0');
    }
    
    const day = String(passenger.dobDay).padStart(2, '0');
    return `${passenger.dobYear}-${monthNum}-${day}`;
  }

  // Helper method to set DOB from calendar selection
  onDOBSelected(passenger: any, dateString: string): void {
    if (!dateString) return;
    
    const date = new Date(dateString);
    passenger.dobDay = String(date.getDate()).padStart(2, '0');
    passenger.dobMonth = String(date.getMonth() + 1).padStart(2, '0');
    passenger.dobYear = String(date.getFullYear());
  }

  // Get max date for adult DOB (must be at least 12 years old)
  getAdultMaxDOB(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 12);
    return this.formatDateForCalendar(date);
  }

  // Get today's date for calendar display (current year)
  getTodayDate(): string {
    return this.formatDateForCalendar(new Date());
  }

  // Get min date for adult DOB (reasonable max age, e.g., 100 years)
  getAdultMinDOB(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100);
    return this.formatDateForCalendar(date);
  }

  // Get max date for child DOB (2-12 years old, so max is 2 years ago)
  getChildMaxDOB(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    return this.formatDateForCalendar(date);
  }

  // Get min date for child DOB (must be less than 12 years old)
  getChildMinDOB(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 12);
    date.setDate(date.getDate() + 1); // One day after 12 years
    return this.formatDateForCalendar(date);
  }

  // Get max date for infant DOB (under 2 years old, so max is today)
  getInfantMaxDOB(): string {
    return this.formatDateForCalendar(new Date());
  }

  // Get min date for infant DOB (must be less than 2 years old)
  getInfantMinDOB(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 2);
    date.setDate(date.getDate() + 1); // One day after 2 years
    return this.formatDateForCalendar(date);
  }

  // Format date for calendar component (YYYY-MM-DD)
  formatDateForCalendar(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get min/max dates based on current passenger type
  getCurrentPassengerMinDOB(): string {
    if (this.currentPassengerType === 'adult') {
      return this.getAdultMinDOB();
    } else if (this.currentPassengerType === 'child') {
      return this.getChildMinDOB();
    } else if (this.currentPassengerType === 'infant') {
      return this.getInfantMinDOB();
    }
    return this.getAdultMinDOB();
  }

  getCurrentPassengerMaxDOB(): string {
    if (this.currentPassengerType === 'adult') {
      return this.getAdultMaxDOB();
    } else if (this.currentPassengerType === 'child') {
      return this.getChildMaxDOB();
    } else if (this.currentPassengerType === 'infant') {
      return this.getInfantMaxDOB();
    }
    return this.getAdultMaxDOB();
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
  
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any) {
    if (this.continueClicked && !this.bookingSubmitted) {
      event.returnValue = true;
    }
  }

  // Mobile Template Methods
  openFareSummary() { this.showFareSummaryModal = true; }
  closeFareSummary() { this.showFareSummaryModal = false; }
  openGSTModal() { this.gstDetails = { ...this.gstInfo, companyAddress: '', companyPhone: '', companyEmail: '', gstNumber: this.gstInfo.registrationNo || '' }; this.showGSTModal = true; }
  closeGSTModal() { this.showGSTModal = false; }
  handleGSTClick() {
    if (this.isMobileView()) {
      this.openGSTModal();
    } else {
      this.toggleGSTForm();
    }
  }
  toggleGSTForm() { 
    if (!this.isGSTExpanded) {
      this.gstDetails = { ...this.gstInfo, companyAddress: '', companyPhone: '', companyEmail: '', gstNumber: this.gstInfo.registrationNo || '' };
    }
    this.isGSTExpanded = !this.isGSTExpanded;
  }
  saveGSTDetails() { 
    this.gstInfo.companyName = this.gstDetails.companyName; 
    this.gstInfo.registrationNo = this.gstDetails.gstNumber; 
    this.contact.hasGST = !!this.gstDetails.companyName; 
    this.closeGSTModal(); 
    this.isGSTExpanded = false;
  }
  
  // Fare Summary Accordion Toggle Methods
  toggleBaseFare() { this.isBaseFareExpanded = !this.isBaseFareExpanded; }
  toggleTaxes() { this.isTaxesExpanded = !this.isTaxesExpanded; }
  toggleOtherServices() { this.isOtherServicesExpanded = !this.isOtherServicesExpanded; }
  toggleBaggage() { this.isBaggageExpanded = !this.isBaggageExpanded; }

  // Mobile Fare Breakdown Modal
  openMobileFareBreakdown() { this.showMobileFareBreakdown = true; }
  closeMobileFareBreakdown() { this.showMobileFareBreakdown = false; }
  
  
  openPassengerModal(type: 'adult' | 'child' | 'infant', index: number) {
    this.currentPassengerType = type;
    this.currentPassengerIndex = index;
    const arr = type === 'adult' ? this.travellers : type === 'child' ? this.children : this.infants;
    this.currentPassengerDetails = arr[index] ? { ...arr[index] } : this.getBlankPassenger(type);
    
    // Desktop: expand inline form, Mobile: show modal
    if (this.isMobileView()) {
      this.showPassengerModal = true;
    } else {
      const key = `${type}-${index}`;
      // Toggle: if already expanded, collapse it; otherwise expand
      this.expandedPassengerKey = this.expandedPassengerKey === key ? null : key;
    }
  }
  
  isPassengerExpanded(type: 'adult' | 'child' | 'infant', index: number): boolean {
    if (this.isMobileView()) return false;
    return this.expandedPassengerKey === `${type}-${index}`;
  }
  
  getPassengerKey(type: 'adult' | 'child' | 'infant', index: number): string {
    return `${type}-${index}`;
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
  
  collapsePassengerForm() {
    this.expandedPassengerKey = null;
    this.passengerValidationErrors = {};
  }
  
  getPassengerDetailsForForm(type: 'adult' | 'child' | 'infant', index: number): any {
    const arr = type === 'adult' ? this.travellers : type === 'child' ? this.children : this.infants;
    return arr[index] ? { ...arr[index] } : this.getBlankPassenger(type);
  }
  
  setPassengerDetailsForForm(type: 'adult' | 'child' | 'infant', index: number, details: any) {
    const arr = type === 'adult' ? this.travellers : type === 'child' ? this.children : this.infants;
    if (arr[index]) {
      Object.assign(arr[index], details);
    }
  }
  
  savePassengerDetailsInline(type: 'adult' | 'child' | 'infant', index: number, details: any) {
    // Set current passenger context for validation
    this.currentPassengerType = type;
    this.currentPassengerIndex = index;
    this.currentPassengerDetails = { ...details }; // Create a copy for validation
    
    // Clear previous errors
    this.passengerValidationErrors = {};
    
    // Validate before saving
    if (!this.validatePassengerDetails(this.currentPassengerDetails)) {
      // Keep the form expanded if validation fails
      this.cdr.detectChanges();
      return; // Don't save if validation fails
    }

    // Save the details
    this.setPassengerDetailsForForm(type, index, this.currentPassengerDetails);
    
    // Collapse the form after successful save
    this.expandedPassengerKey = null;
    this.passengerValidationErrors = {};
    this.cdr.detectChanges();
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
    
    // Close modal on mobile, collapse form on desktop
    if (this.isMobileView()) {
      this.closePassengerModal();
    } else {
      // Collapse the expanded form after saving
      this.expandedPassengerKey = null;
      this.passengerValidationErrors = {};
    }
  }
  
  updateProceedButton(): boolean {
    return this.termsAgreed && this.canProceed();
  }
  
  finalProceed() {
    // Check terms and conditions first
    if (!this.termsAgreed) {
      Swal.fire({
        title: 'Terms & Conditions Required',
        html: 'Please accept the <b>Terms & Conditions</b> to proceed with your booking.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    // Detailed validation check
    const validationErrors = this.getValidationErrors();
    if (validationErrors.length > 0) {
      const errorList = validationErrors.map(error => `• ${error}`).join('<br>');
      Swal.fire({
        title: 'Incomplete Details',
        html: `<div style="text-align: left;">Please complete the following:<br><br>${errorList}</div>`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
        width: '500px'
      });
      return;
    }
    
    this.loader = true;
    
    // For multi-city, proceed directly to payment (skip addons page)
    if (this.tripType === 'multicity') {
      this.handleMultiCityBooking();
    } else {
      this.proceedToAddons();
    }
  }
  
  handleMultiCityBooking(): void {
    console.log("Make Final Payload and book the ticket for multi-city");
    
    const isLCC = this.fullFlightData.departureFlightData?.selectedFare?.originalFareOption?.IsLCC || false;
    
    // Prepare fare summary
    const onwardFareSummary = this.buildFareSummaryForAddons(false);
    
    const onwardFlightData = {
      adultFareDetail: onwardFareSummary?.adultFareDetails || {},
      childrenFareDetail: onwardFareSummary?.childFareDetail || {},
      infantFareDetail: onwardFareSummary?.infantFareDetails || {},
      fareCommonDetail: onwardFareSummary?.fareDetails || {},
      adultBaseFare: onwardFareSummary?.summary?.baseFare?.find((f: any) => f.label.includes('Adults'))?.amount || this.adultBaseFare || 0,
      adultTaxes: onwardFareSummary?.summary?.taxes?.find((t: any) => t.label.includes('Adults'))?.amount || this.adultTaxes || 0,
      childrenBaseFare: onwardFareSummary?.summary?.baseFare?.find((f: any) => f.label.includes('Children'))?.amount || this.childrenBaseFare || 0,
      childrenTaxes: onwardFareSummary?.summary?.taxes?.find((t: any) => t.label.includes('Children'))?.amount || this.childrenTaxes || 0,
      infantBaseFare: onwardFareSummary?.summary?.baseFare?.find((f: any) => f.label.includes('Infants'))?.amount || this.infantBaseFare || 0,
      infantTaxes: onwardFareSummary?.summary?.taxes?.find((t: any) => t.label.includes('Infants'))?.amount || this.infantTaxes || 0,
      flightSegments: this.flightSegments,
      flightSegmentsReturn: this.flightSegmentsReturn,
      isReturn: false,
      baggage: this.buildBaggageArray(false)
    };
    
    const bookingParams = {
      tboToken: this.tboToken,
      traceId: this.traceid,
      resultIndex: this.resultIndex,
      ipAddress: this.ipAddress
    };
    
    const passengersFinal = {
      adults: this.travellers || [],
      children: this.children || [],
      infants: this.infants || []
    };
    
    const primaryAdult = passengersFinal.adults[0];
    if (!primaryAdult) {
      Swal.fire('Error', 'Primary passenger details not found', 'error');
      this.loader = false;
      return;
    }
    
    const contact = {
      countryCode: primaryAdult.mobileDialCode || '+91',
      mobile: primaryAdult.mobileNumber || '',
      email: primaryAdult.email || ''
    };
    
    const gstInfo = {
      companyName: this.gstDetails?.companyName || '',
      registrationNo: this.gstDetails?.gstNumber || ''
    };
    
    const gstMandatory = this.fullFlightData.departureFlightData?.selectedFare?.originalFareOption?.IsGSTMandatory || false;
    const passportInfoRequired = this.passportInfoRequired || false;
    
    console.log('Multi-city booking params:', {
      isLCC,
      onwardFlightData,
      bookingParams,
      passengersFinal,
      contact,
      gstInfo,
      gstMandatory,
      passportInfoRequired
    });
    
    const onwardPayload = this.bookingPayloadService.generateBookingPayloadMultiCity(
      isLCC,
      onwardFlightData,
      bookingParams,
      passengersFinal,
      contact,
      gstInfo,
      gstMandatory,
      passportInfoRequired,
      null
    );
    
    const appid = contact.mobile;
    const orderId = 'FL' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const customerName = `${primaryAdult.firstName} ${primaryAdult.lastName}`;
    const customerEmail = contact.email;
    const customerDialCountryCode = contact.countryCode;
    const customerPhone = contact.mobile;
    
    console.log('Calling flightSuccess for multi-city:', {
      appid,
      orderId,
      customerName,
      customerEmail,
      customerDialCountryCode,
      customerPhone,
      onwardPayload
    });
    
    this.subscriptions.add(
      this.apiService.flightSuccess(
        appid,
        orderId,
        this.tripType,
        false, // isUnifiedSegmentFormat - false for multicity
        customerName,
        customerEmail,
        customerDialCountryCode,
        customerPhone,
        this.fullFlightData.fromCity || '',
        this.fullFlightData.toCity || '',
        this.fullFlightData.departureDate || '',
        this.fullFlightData.returnDate || null,
        onwardPayload,
        null, // returnPayload - null for multicity
        this.finalAmount, // onwardAmount
        null, // returnAmount - null for multicity
        this.finalAmount, // finalAmount
        isLCC,
        null // isLCCReturn - null for multicity
      ).subscribe((val: any) => {
        console.log('Payment API Response:', val);
        
        if (val && val['payment_session_id']) {
          // Call cashfree payment gateway with session ID and order ID
          if (typeof (window as any).cashfree === 'function') {
            (window as any).cashfree(val['payment_session_id'], orderId);
            console.log('Cashfree payment gateway opened with session:', val['payment_session_id'], 'Order ID:', orderId);
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

  getTotalRoundTripBaggageCount(): number {
    const onwardTotal = Object.values(this.onwardBaggageCounts).reduce((a: number, b: number) => a + b, 0);
    const returnTotal = Object.values(this.returnBaggageCounts).reduce((a: number, b: number) => a + b, 0);
    return onwardTotal + returnTotal;
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

  // Calculate age from date of birth
  calculateAge(dobDay: string, dobMonth: string, dobYear: string): number | null {
    if (!dobDay || !dobMonth || !dobYear) return null;
    
    try {
      // Handle month as string (e.g., "May") or number
      let monthIndex: number;
      if (typeof dobMonth === 'string' && isNaN(parseInt(dobMonth))) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthIndex = monthNames.findIndex(m => m.toLowerCase() === dobMonth.toLowerCase());
        if (monthIndex === -1) monthIndex = parseInt(dobMonth) - 1;
      } else {
        monthIndex = parseInt(dobMonth) - 1;
      }
      
      const dob = new Date(parseInt(dobYear), monthIndex, parseInt(dobDay));
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      return age >= 0 ? age : null;
    } catch (error) {
      return null;
    }
  }

  // Get gender abbreviation
  getGenderAbbreviation(gender: string): string {
    if (!gender) return '';
    return gender.toLowerCase().startsWith('m') ? 'M' : gender.toLowerCase().startsWith('f') ? 'F' : '';
  }

  // Format passenger display name with gender and age
  getPassengerDisplayName(passenger: any): string {
    if (!passenger.firstName && !passenger.lastName) {
      return '';
    }
    
    const name = `${passenger.firstName || ''} ${passenger.lastName || ''}`.trim();
    if (!name) return '';
    
    const genderAbbr = this.getGenderAbbreviation(passenger.gender);
    const age = this.calculateAge(passenger.dobDay, passenger.dobMonth, passenger.dobYear);
    
    let suffix = '';
    if (genderAbbr) {
      suffix = genderAbbr;
      if (age !== null && age >= 0) {
        suffix += ` ${age} years`;
      }
    } else if (age !== null && age >= 0) {
      suffix = `${age} years`;
    }
    
    return suffix ? `${name}, ${suffix}` : name;
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

  // Addon Services Methods
  toggleSeatsSection(): void {
    this.isSeatsExpanded = !this.isSeatsExpanded;
    if (this.isSeatsExpanded) {
      this.isCabsExpanded = false;
      this.isAddonsExpanded = false;
      // Initialize seat map if not already done from SSR data
      if (!this.seatMap || this.seatMap.length === 0) {
        this.initializeSeatMapFromSSR();
      }
    }
  }

  toggleCabsSection(): void {
    this.isCabsExpanded = !this.isCabsExpanded;
    if (this.isCabsExpanded) {
      this.isSeatsExpanded = false;
      this.isAddonsExpanded = false;
    }
  }

  toggleAddonsSection(): void {
    this.isAddonsExpanded = !this.isAddonsExpanded;
    if (this.isAddonsExpanded) {
      this.isSeatsExpanded = false;
      this.isCabsExpanded = false;
    }
  }

  openCabSelection(event: Event): void {
    event.stopPropagation();
    // TODO: Navigate to cab booking page
    console.log('Opening cab selection...');
  }

  openAddonsSelection(event: Event): void {
    event.stopPropagation();
    // TODO: Navigate to addons page (insurance, baggage courier)
    console.log('Opening addons selection...');
  }

  scrollToPassengers(): void {
    const passengerSection = document.querySelector('.section-title');
    if (passengerSection) {
      passengerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Seat Selection Methods
  getTotalPassengers(): number {
    return this.adults.length + this.children.length + this.infants.length;
  }

  getSelectedSeatsCount(segmentIndex: number): number {
    const isReturn = false;
    const selectedSeats = isReturn ? this.flightAddonsService.selectedSeatsReturn : this.flightAddonsService.selectedSeats;
    return selectedSeats[segmentIndex]?.length || 0;
  }

  toggleSeatSelectionAPI(segmentIndex: number, seat: any): void {
    if (!seat || !seat.isAvailable) {
      return;
    }

    const isReturn = false; // For now, only handling onward journey on this page
    
    // Use the addon service's method to toggle selection
    this.flightAddonsService.toggleSeatSelection(segmentIndex, seat, isReturn);

    console.log(`Seat ${seat.displaySeatNo} selection toggled for segment ${segmentIndex}`);
  }

  isSeatSelected(segmentIndex: number, seatCode: string): boolean {
    const isReturn = false;
    return this.flightAddonsService.isSeatSelected(segmentIndex, seatCode, isReturn);
  }

  getSeatTooltip(seat: any): string {
    return this.flightAddonsService.getSeatTooltip(seat);
  }

  // Meal Methods
  incrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = false;
    this.flightAddonsService.incrementMeal(segmentIndex, meal, isReturn);
  }

  decrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = false;
    this.flightAddonsService.decrementMeal(segmentIndex, meal, isReturn);
  }

  getMealCountForMeal(segmentIndex: number, mealCode: string): number {
    const isReturn = false;
    const selected = isReturn ? this.flightAddonsService.selectedMealsReturn : this.flightAddonsService.selectedMeals;
    const segmentMeals = selected[segmentIndex] || [];
    const mealEntry = segmentMeals.find((m: any) => m.meal.Code === mealCode);
    return mealEntry ? mealEntry.count : 0;
  }

  getMealCount(segmentIndex: number): number {
    const isReturn = false;
    const selected = isReturn ? this.flightAddonsService.selectedMealsReturn : this.flightAddonsService.selectedMeals;
    return selected[segmentIndex]?.reduce((sum: number, item: any) => sum + item.count, 0) || 0;
  }

  getTotalSelectedMeals(segmentIndex: number): number {
    const isReturn = false;
    const selected = isReturn ? this.flightAddonsService.selectedMealsReturn : this.flightAddonsService.selectedMeals;
    return selected[segmentIndex]?.reduce((sum: number, { count }: any) => sum + count, 0) || 0;
  }

  // Special Services Methods
  getFilteredServices(): any[] {
    if (!this.services || this.services.length === 0) {
      return [];
    }

    // Filter services for the current onward journey
    const originCode = this.flightSegments[0]?.originCode;
    const destinationCode = this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

    return this.services.filter((service: any) => 
      service.Origin === originCode && service.Destination === destinationCode
    );
  }

  addService(service: any): void {
    const isReturn = false;
    this.flightAddonsService.addService(service, isReturn);
    console.log('Service added:', service.Description);
  }

  removeService(service: any): void {
    const isReturn = false;
    this.flightAddonsService.removeService(service, isReturn);
    console.log('Service removed:', service.Description);
  }

  getServiceCount(serviceCode: string, service: any): number {
    const isReturn = false;
    const selectedServices = this.flightAddonsService.selectedServices;
    
    // Find the service in selectedServices by checking service.Code and isReturn flag
    const serviceEntry = selectedServices.find((s: any) => 
      s.service.Code === serviceCode && s.service.isReturn === isReturn
    );
    return serviceEntry ? 1 : 0; // Services can only be added once
  }

  initializeSeatMapFromSSR(): void {
    // Use actual SSR data from ssrValues
    const ssrOnward = this.ssrValues;
    
    if (!ssrOnward || !ssrOnward.Response) {
      console.warn('No SSR data available for seat selection');
      return;
    }

    // Set passenger counts in the service
    this.flightAddonsService.setPassengerCounts(
      this.adults.length,
      this.children.length,
      this.infants.length
    );

    // Set flight segments
    this.flightAddonsService.setFlightSegments(this.flightSegments, false);

    // Process SSR data to get seat maps, meal data, and services
    const { seatData, mealSegments, services } = this.flightAddonsService.processSSRData(
      ssrOnward,
      this.flightSegments,
      false
    );

    // Use the seat map directly from the service - no transformation needed
    this.seatMap = seatData.seatMaps;
    this.selectedSeats = seatData.selectedSeats;
    
    // Update flight segments with meal data
    if (mealSegments && mealSegments.length > 0) {
      this.flightSegments = mealSegments;
    }

    // Store services data
    if (services && services.length > 0) {
      this.services = services;
    }

    console.log('Initialized seat map from SSR data:', this.seatMap);
    console.log('Flight segments with meals:', this.flightSegments);
    console.log('Special services:', this.services);
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
      // Debug logging for multicity
      if (this.tripType === 'multicity') {
        console.log('🔍 Multicity buildFareSummaryForAddons (onward):', {
          totalAdults: this.totalAdults,
          totalChildren: this.totalChildren,
          totalInfants: this.totalInfants,
          adultBaseFare: this.adultBaseFare,
          adultTaxes: this.adultTaxes,
          childrenBaseFare: this.childrenBaseFare,
          childrenTaxes: this.childrenTaxes,
          infantBaseFare: this.infantBaseFare,
          infantTaxes: this.infantTaxes
        });
      }
      
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

  getCompletedCount(passengers: any[]): number {
    if (!passengers || passengers.length === 0) return 0;
    return passengers.filter(p => p.firstName && p.firstName.trim() !== '').length;
  }
}