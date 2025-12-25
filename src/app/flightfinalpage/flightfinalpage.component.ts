import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, Inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flightfinalpage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flightfinalpage.component.html',
  styleUrls: ['./flightfinalpage.component.css']
})
export class FlightfinalpageComponent implements OnInit, AfterViewInit, OnDestroy {
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
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
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
    
    if(this.traceid && this.resultIndex) {
        this.callFareQuote();
    }
  }

  processFlightDataInput(val: any) {
    this.fullFlightData = val;
    this.ipAddress = val['ipAddress'];
    this.tboToken = val['tboToken'];
    this.traceid = val['traceid'];
    this.resultIndex = val['departureFlightData']?.['ResultIndex'] || '';
    this.resultIndexReturn = val['returnFlightData'] ? val['returnFlightData']['ResultIndex'] : '';
    this.flightDataDeparture = val['departureFlightData'];
    this.flightDataReturn = val['returnFlightData'];
    
    // Set trip type
    const tripTypeVal = val['tripType'] || '';
    if (tripTypeVal === 'round' || tripTypeVal === 'roundtrip') {
      this.tripType = 'roundtrip';
    } else if (tripTypeVal === 'multi' || tripTypeVal === 'multicity') {
      this.tripType = 'multicity';
    } else {
      this.tripType = 'oneway';
    }
    
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

  processBaggage(baggageArray: any[][], isReturn: boolean) {
      // Flatten the nested array from TBO (usually structured by sector)
      // TBO returns baggage as array of arrays per sector
      const flatBaggage = baggageArray.flat();
      
      if(isReturn) {
          this.baggageOptionsReturn = flatBaggage;
          this.extraBaggageAvailableReturn = flatBaggage.length > 0;
          // Initialize counts
          flatBaggage.forEach(b => this.selectedBaggageCountsReturn[b.Code] = 0);
      } else {
          this.baggageOptions = flatBaggage;
          this.extraBaggageAvailable = flatBaggage.length > 0;
          // Initialize counts
          flatBaggage.forEach(b => this.selectedBaggageCounts[b.Code] = 0);
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
    this.finalAmount = this.totalBaseFare + this.totalTaxes + 
                       this.baggageTotal + this.baggageTotalReturn + 
                       this.totalMealCharges + this.totalSpecialServiceCharges;
  }

  proceedToPayment(): void {
    // Check agreement
    if(!this.termsAccepted) {
        Swal.fire('Terms & Conditions', 'Please accept the terms and conditions to proceed', 'warning');
        return;
    }

    this.continueClicked = true;
    
    if(!this.canProceed()) {
        Swal.fire('Incomplete Details', 'Please fill all mandatory passenger details', 'error');
        return;
    }

    this.bookingSubmitted = true;
    this.loader = true;

    // Construct Booking Payload
    const bookingPayload = {
        Passengers: [...this.travellers, ...this.children, ...this.infants],
        Contact: this.contact,
        GST: this.contact.hasGST ? this.gstInfo : null,
        Fare: {
            TotalAmount: this.finalAmount,
            BaseFare: this.totalBaseFare,
            Taxes: this.totalTaxes
        },
        Segments: {
            Outbound: this.flightSegments,
            Return: this.flightSegmentsReturn
        },
        SSR: {
            Baggage: this.selectedBaggage,
            Meals: this.selectedMeals
        }
    };

    // Save to Database or Navigate
    console.log("Proceeding to payment...", bookingPayload);
    
    // Simulating API call
    setTimeout(() => {
        this.loader = false;
        // Navigate to payment gateway
        // this.router.navigate(['/payment']); 
        Swal.fire('Success', 'Proceeding to Payment Gateway', 'success');
    }, 1500);
  }

  canProceed(): boolean {
      // 1. Validate Contact Info
      if(!this.contact.email || !this.contact.mobile || this.contact.mobile.length < 10) return false;
      
      // 2. Validate Adult Details
      for(let t of this.travellers) {
          if(!t.firstName || !t.lastName) return false;
          if(this.passportInfoRequired && (!t.passportNumber || !t.passportExpiryYear)) return false;
          // Date Validation for Adults check
          if(t.dobYear && !this.validateAdultDOB(t)) return false;
      }

      // 3. Validate Child Details
      for(let c of this.children) {
          if(!c.firstName || !c.lastName || !c.dobYear) return false;
      }

      // 4. Validate GST if applicable
      if(this.contact.hasGST && (this.gstMandatoryOnward || this.gstMandatoryReturn)) {
          if(!this.gstInfo.companyName || !this.gstInfo.registrationNo) return false;
      }

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
    
    const dob = new Date(traveller.dobYear, parseInt(traveller.dobMonth) - 1, parseInt(traveller.dobDay));
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
      Object.assign(arr[this.currentPassengerIndex], details);
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
    this.proceedToPayment();
  }
  
  // Baggage methods for mobile
  incrementBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    if (!this.baggageCounts[key]) this.baggageCounts[key] = 0;
    this.baggageCounts[key]++;
    this.updateBaggageTotal(false);
    this.updateFinalFare();
  }
  
  decrementBaggage(baggage: any) {
    const key = baggage.kgs || baggage.Code;
    if (this.baggageCounts[key] > 0) {
      this.baggageCounts[key]--;
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
  parseSeatData(isReturn: boolean) {} 
  processSpecialServices(rawSSR: any[], type: 'onward' | 'return') {}
}