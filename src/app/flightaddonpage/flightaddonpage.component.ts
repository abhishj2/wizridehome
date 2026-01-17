import { Component, OnDestroy, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightaddonsService } from '../services/flightaddons.service';
import { FlightbookingpayloadService } from '../services/flightbookingpayload.service';
import { FlightdataService } from '../services/flightdata.service';
import Swal from 'sweetalert2';
import { FlightmobfaresummaryComponent } from '../flightmobfaresummary/flightmobfaresummary.component';
import { isPlatformBrowser } from '@angular/common';

declare function cashfree(sessionid : any) : any;

interface Seat {
  status: string;
  price?: number;
  Code: string;
}

interface Row {
  row: number;
  seats: Seat[];
}

interface Flight {
  id: string;
  code: string;
  route: string;
  aircraft: string;
  layout: string;
  logo: string;
  airlineCode: string;
}

interface FareSummary {
  baseFare: { label: string; count: number; amount: number }[];
  taxes: { label: string; count: number; amount: number }[];
  baggageCharges: { label: string; amount: number }[];
  mealCharges: number;
  seatCharges: number;
  specialServiceCharges: number;
  totalAmount: number;
}

interface FareSummaryWrapper {
  summary: FareSummary | null;
  adultFareDetails?: any;
  childFareDetail?: any;
  infantFareDetails?: any;
  FareCommonDetail?: any;
  fareDetails?: any;
}

@Component({
  selector: 'app-flightaddonpage',
  standalone: true,
  imports: [CommonModule, FormsModule, FlightmobfaresummaryComponent],
  templateUrl: './flightaddonpage.component.html',
  styleUrls: ['./flightaddonpage.component.css']
})
export class FlightaddonpageComponent implements OnInit, OnDestroy {
  onwardFlights: Flight[] = [];
  returnFlights: Flight[] = [];
  selectedFlight: string | null = '0';
  aircraft: string = '';
  seatColumns: string[] = [];
  seatLayout: Row[] = [];
  totalPrice: number = 0;
  seatMap: any[] = [];
  hasSeatsAvailable: boolean[] = [];
  selectedSeats: any[][] = [];
  flightSegments: any[] = [];
  flightSegmentsReturn: any[] = [];
  totalAdults: number = 0;
  totalChildren: number = 0;
  totalInfants : number = 0;
  activeMealIndex: number = 0;
  selectedJourneyTab: 'onward' | 'return' = 'onward';
  selectedSubTabIndex: number = 0;
  selectedSegmentIndex: number = 0;
  services: any[] = [];
  onwardFareSummary: FareSummaryWrapper | null = null;
  returnFareSummary: FareSummaryWrapper | null = null;
  tripType: string = '';
  showFareSummaryModal: boolean = false;
  orderId : any = '';
  private subscriptions: Subscription = new Subscription();

  public flightData: any = null;
  public passengers: { adults: any[]; children: any[]; infants: any[] } = { adults: [], children: [], infants: [] };
  private contact: {
    countryCode : string, 
    mobile: string; 
    email: string 
  } = { 
    countryCode : '',
    mobile: '', 
    email: '' 
  };
  private gstInfo: { companyName: string; registrationNo: string } = { companyName: '', registrationNo: '' };
  private tboToken: string = '';
  private traceId: string = '';
  private resultIndex: string = '';
  private resultIndexReturn: string = '';
  private ipAddress: string = '';
  private passportInfoRequired: boolean = false;
  private gstMandatory: boolean = false;
  private onwardPNR: string = '';
  private returnPNR: string = '';
  private onwardBookingDone = false;
  private returnBookingDone = false;

  loader : boolean = true;
  isUnifiedSegmentFormat: boolean = false;
  flightDataDeparture: any = [];

  constructor(
    public apiService: ApiserviceService,
    public flightDataService: FlightdataService,
    public flightDataAddOnService: FlightaddonsService,
    public bookingPayloadService : FlightbookingpayloadService,
    public router : Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2, // Added for clean DOM manipulation
    @Inject(PLATFORM_ID) private platformId: Object // Added to check for browser
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
    this.subscriptions.add(      
      this.flightDataService.currentMessage.subscribe((val: any) => {
        if (!val){
            this.router.navigate(['/home']);
            
        }
        console.log('value of input', val);


      this.flightDataDeparture = val?.departureFlightData?.selectedFare?.originalFareOption;

        // STEP 2: Check unified segment format
      this.isUnifiedSegmentFormat = 
        Array.isArray(this.flightDataDeparture?.Segments) &&
        this.flightDataDeparture?.Segments.length === 2 &&
        Array.isArray(this.flightDataDeparture.Segments[0]) &&
        Array.isArray(this.flightDataDeparture.Segments[1]);

      console.log("✅ isUnifiedSegmentFormat:", this.isUnifiedSegmentFormat);




      console.log("Segments value before checking isUnifiedSegmentFormat:", this.flightDataDeparture?.Segments);
      console.log("Segments[0]:", this.flightDataDeparture?.Segments?.[0]);
      console.log("Segments[1]:", this.flightDataDeparture?.Segments?.[1]);


    

      // STEP 2: Log both to compare
      console.log("🔍 Value of Total:", JSON.stringify(val, null, 2));
        
        this.flightData = val;
        
        // Safely destructure mobFinalPageData with fallbacks
        if (!val.mobFinalPageData) {
          console.error('❌ mobFinalPageData is missing!', val);
          this.loader = false;
          Swal.fire({
            title: 'Error',
            html: 'Flight data is incomplete. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/home']);
          });
          return;
        }
        
        const { 
          flightSegments = [],
          flightSegmentsReturn = [],
          ssr = { onward: null, return: null },
          fareSummary = { onward: null, return: null, finalAmount: 0 }
        } = val.mobFinalPageData || {};

        this.totalAdults = val.adults || 0;
        this.totalChildren = val.children || 0;
        this.totalInfants = val.infants || 0;

        // Use baggageCharges from fareSummary (comes from flightfinalpage) - match mobile version exactly
        if (!fareSummary || !fareSummary.onward) {
          console.error('❌ fareSummary.onward is missing!', fareSummary);
        }
        
        this.onwardFareSummary = {
          summary: fareSummary?.onward?.summary || null,
          adultFareDetails: fareSummary?.onward?.adultFareDetails || {},
          childFareDetail: fareSummary?.onward?.childFareDetail || {},
          infantFareDetails: fareSummary?.onward?.infantFareDetails || {},
          FareCommonDetail: fareSummary?.onward?.FareCommonDetail || {},
          fareDetails: fareSummary?.onward?.fareDetails || {}
        };

        this.returnFareSummary = fareSummary?.return ? {
          summary: fareSummary.return?.summary || null,
          adultFareDetails: fareSummary.return?.adultFareDetails || {},
          childFareDetail: fareSummary.return?.childFareDetail || {},
          infantFareDetails: fareSummary.return?.infantFareDetails || {},
          FareCommonDetail: fareSummary.return?.FareCommonDetail || {},
          fareDetails: fareSummary.return?.fareDetails || {}
        } : null;
        this.tripType = val.tripType || 'oneway';
        this.totalPrice = fareSummary?.finalAmount || 0;
        
        // For multicity, ensure onwardFareSummary is properly initialized
        if (this.tripType === 'multicity' && !this.onwardFareSummary?.summary) {
          console.warn('⚠️ Multicity: onwardFareSummary.summary is missing, initializing with empty summary');
          if (!this.onwardFareSummary) {
            this.onwardFareSummary = {
              summary: {
                baseFare: [],
                taxes: [],
                baggageCharges: [],
                mealCharges: 0,
                seatCharges: 0,
                specialServiceCharges: 0,
                totalAmount: 0
              },
              adultFareDetails: {},
              childFareDetail: {},
              infantFareDetails: {},
              FareCommonDetail: {},
              fareDetails: {}
            };
          } else if (!this.onwardFareSummary.summary) {
            this.onwardFareSummary.summary = {
              baseFare: [],
              taxes: [],
              baggageCharges: [],
              mealCharges: 0,
              seatCharges: 0,
              specialServiceCharges: 0,
              totalAmount: 0
            };
          }
        }
        
        console.log('✅ Trip type detected:', this.tripType);
        console.log('✅ Initialized fare summaries:', {
          onwardFareSummary: this.onwardFareSummary,
          returnFareSummary: this.returnFareSummary,
          totalPrice: this.totalPrice,
          tripType: this.tripType
        });
        
        // Debug multicity fare summary
        if (this.tripType === 'multicity') {
          console.log('🔍 Multicity Fare Summary Debug:', {
            hasOnwardFareSummary: !!this.onwardFareSummary,
            hasSummary: !!this.onwardFareSummary?.summary,
            baseFare: this.onwardFareSummary?.summary?.baseFare,
            taxes: this.onwardFareSummary?.summary?.taxes,
            baseFareLength: this.onwardFareSummary?.summary?.baseFare?.length || 0,
            taxesLength: this.onwardFareSummary?.summary?.taxes?.length || 0,
            finalAmount: fareSummary?.finalAmount
          });
        }

         this.passengers = {
          adults: val.mobFinalPageData?.passengers?.adults || [],
          children: val.mobFinalPageData?.passengers?.children || [],
          infants: val.mobFinalPageData?.passengers?.infants || []
        };
        this.contact = {
          countryCode: val.mobFinalPageData?.passengers?.adults?.[0]?.mobileDialCode || '',
          mobile: val.mobFinalPageData?.passengers?.adults?.[0]?.mobileNumber || '',
          email: val.mobFinalPageData?.passengers?.adults?.[0]?.email || ''
        };
        this.gstInfo = {
          companyName: val.mobFinalPageData?.gstDetails?.companyName || '',
          registrationNo: val.mobFinalPageData?.gstDetails?.gstNumber || ''
        };
        this.tboToken = val.tboToken || '';
        this.traceId = val.traceid || '';
        this.resultIndex = val.mobFinalPageData?.other?.resultIndex || '';
        this.resultIndexReturn = val.mobFinalPageData?.other?.resultIndexReturn || '';
        this.ipAddress = val.ipAddress || '';
        this.flightSegments = flightSegments || [];
        this.flightSegmentsReturn = flightSegmentsReturn || [];
        
        console.log('✅ Initialized basic data:', {
          flightSegments: this.flightSegments.length,
          flightSegmentsReturn: this.flightSegmentsReturn.length,
          passengers: this.passengers,
          ssr: !!ssr
        });

        
        this.flightDataAddOnService.setPassengerCounts(this.totalAdults, this.totalChildren, this.totalInfants);
        this.flightDataAddOnService.setFlightSegments(flightSegments, false);
        if (this.tripType === 'roundtrip') {
          this.flightDataAddOnService.setFlightSegments(flightSegmentsReturn, true);
        } else if (this.tripType === 'multicity') {
          // For multicity, all segments are in flightSegments, process them together
          // The service already has them set, just ensure they're available
          console.log('Multicity trip detected - processing all segments together');
        }

        // Process SSR data for onward journey (or all segments for multicity)
        if (!ssr || !ssr.onward) {
          console.warn('⚠️ SSR onward data is missing!', ssr);
        } else {
          console.log('✅ SSR onward data found for', this.tripType, ':', {
            hasSeatMaps: !!ssr.onward?.SeatMaps,
            seatMapCount: ssr.onward?.SeatMaps?.length || 0,
            hasMeals: !!ssr.onward?.Meals,
            hasServices: !!ssr.onward?.SpecialServices,
            segmentCount: flightSegments?.length || 0
          });
        }
        const { seatData, mealSegments, services } = this.flightDataAddOnService.processSSRData(ssr?.onward || null, flightSegments || [], false);
        this.flightSegments = mealSegments || flightSegments || [];
        this.services = services || [];

        // Initialize onward flights (or all flights for multicity) - safely handle missing data
        const seatMaps = seatData?.seatMaps || [];
        // For multicity, ensure we initialize flights for all segments even if seat maps are missing
        const segmentsLength = flightSegments?.length || 0;
        const maxLength = Math.max(segmentsLength, seatMaps.length);
        
        // Initialize flights for all segments (important for multicity)
        this.onwardFlights = Array.from({ length: maxLength }, (_, i: number) => {
          const flightSeg = flightSegments?.[i] || {};
          return {
            id: `${i}`,
            logo: flightSeg.logo || '',
            airlineCode: flightSeg.Airline?.AirlineCode || flightSeg.airlineCode || '',
            route: flightSeg.originCode && flightSeg.destinationCode 
              ? `${flightSeg.originCode} - ${flightSeg.destinationCode}`
              : flightSeg.route || '',
            aircraft: flightSeg.FlightNumber || flightSeg.aircraft || 'Unknown',
            layout: this.flightDataAddOnService['aircraftSeatMapConfig']?.[flightSeg.aircraftCode?.split('-')[0]]?.layout || '',
            code: flightSeg.code || ''
          };
        });
        
        console.log(`✅ Initialized ${this.onwardFlights.length} onward flights for ${this.tripType} trip`);

        let returnSeatData: any = { seatMaps: [], hasSeatsAvailable: [], selectedSeats: [] };
        // For multicity, we don't have separate return segments - all are in flightSegments
        if (this.tripType === 'roundtrip' && ssr?.return) {
          const { seatData: returnData, mealSegments: returnMealSegments, services: returnServices } = this.flightDataAddOnService.processSSRData(ssr.return, flightSegmentsReturn || [], true);
          returnSeatData = returnData;
          this.flightSegmentsReturn = returnMealSegments || flightSegmentsReturn || [];
          this.services = [...this.services, ...(returnServices || [])];
          if (returnData?.seatMaps) seatData.seatMaps.push(...returnData.seatMaps);
          if (returnData?.hasSeatsAvailable) seatData.hasSeatsAvailable.push(...returnData.hasSeatsAvailable);
          if (returnData?.selectedSeats) seatData.selectedSeats.push(...returnData.selectedSeats);

          // Initialize return flights - safely handle missing data
          const returnSeatMaps = returnData?.seatMaps || [];
          this.returnFlights = returnSeatMaps.map((segment: any, i: number) => {
            const flightSeg = flightSegmentsReturn?.[i] || {};
            return {
              id: `${i + (flightSegments?.length || 0)}`,
              logo: flightSeg.logo || '',
              airlineCode: flightSeg.Airline?.AirlineCode || flightSeg.airlineCode || '',
              route: flightSeg.originCode && flightSeg.destinationCode
                ? `${flightSeg.originCode} - ${flightSeg.destinationCode}`
                : flightSeg.route || '',
              aircraft: flightSeg.FlightNumber || flightSeg.aircraft || 'Unknown',
              layout: this.flightDataAddOnService['aircraftSeatMapConfig']?.[flightSeg.aircraftCode?.split('-')[0]]?.layout || '',
              code: flightSeg.code || ''
            };
          });
        }

        console.log("Processed Seats", seatData);
        this.seatMap = seatData?.seatMaps || [];
        this.hasSeatsAvailable = seatData?.hasSeatsAvailable || [];
        this.selectedSeats = seatData?.selectedSeats || [];
        
        // For multicity, ensure seatMap arrays match the number of segments
        if (this.tripType === 'multicity' && this.seatMap.length < segmentsLength) {
          console.log(`⚠️ Multicity: seatMap length (${this.seatMap.length}) < segments length (${segmentsLength}), padding arrays`);
          // Pad arrays to match segment count with proper structure (empty objects with rows array)
          while (this.seatMap.length < segmentsLength) {
            this.seatMap.push({
              rows: [],
              seatBlocks: [],
              hasSeatsAvailable: false
            });
          }
          while (this.hasSeatsAvailable.length < segmentsLength) {
            this.hasSeatsAvailable.push(false);
          }
          while (this.selectedSeats.length < segmentsLength) {
            this.selectedSeats.push([]);
          }
          console.log(`✅ Multicity: Padded seatMap to ${this.seatMap.length} entries`);
        }

        // Initialize selected flight only if we have flights
        if (this.onwardFlights.length > 0 || this.returnFlights.length > 0) {
          this.selectFlight('0');
        }

        this.updateTotalPrice();
        this.prepareFareSummaryData();
        
        console.log('✅ Addon page initialization complete:', {
          onwardFlights: this.onwardFlights.length,
          returnFlights: this.returnFlights.length,
          seatMap: this.seatMap.length,
          totalPrice: this.totalPrice
        });
        
        this.loader = false;
      })
    );
  }


updateTotalPrice(): void {
  const onwardBase = this.onwardFareSummary?.summary?.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
  const onwardTaxes = this.onwardFareSummary?.summary?.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
  // For multicity and oneway, get baggage from mobFinalPageData, or from summary if available
  let onwardBaggage = 0;
  if (this.onwardFareSummary?.summary?.baggageCharges && this.onwardFareSummary.summary.baggageCharges.length > 0) {
    onwardBaggage = this.onwardFareSummary.summary.baggageCharges.reduce((sum, item) => sum + item.amount, 0);
  } else {
    onwardBaggage = this.flightData?.mobFinalPageData?.baggage?.onward?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0;
  }
  const onwardMealCharges = this.flightDataAddOnService.selectedMeals.reduce(
    (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0
  );
  const onwardSeatCharges = this.seatMap.slice(0, this.flightSegments.length).reduce(
    (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, false), 0
  );
  const onwardServiceCharges = this.flightDataAddOnService.selectedServices
    .filter(s => !s.service.isReturn)
    .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0); // Changed to exclude infants

  let returnBase = 0, returnTaxes = 0, returnBaggage = 0, returnMealCharges = 0, returnSeatCharges = 0, returnServiceCharges = 0;
  if (this.tripType === 'roundtrip' && this.returnFareSummary) {
    returnBase = this.returnFareSummary.summary?.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
    returnTaxes = this.returnFareSummary.summary?.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
    returnBaggage = this.flightData?.mobFinalPageData?.baggage?.return?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0;
    returnMealCharges = this.flightDataAddOnService.selectedMealsReturn.reduce(
      (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0
    );
    returnSeatCharges = this.seatMap.slice(this.flightSegments.length).reduce(
      (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, true), 0
    );
    returnServiceCharges = this.flightDataAddOnService.selectedServices
      .filter(s => s.service.isReturn)
      .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0); // Changed to exclude infants
  }

  this.totalPrice = onwardBase + onwardTaxes + onwardBaggage + onwardMealCharges + onwardSeatCharges + onwardServiceCharges +
                   returnBase + returnTaxes + returnBaggage + returnMealCharges + returnSeatCharges + returnServiceCharges;
  
  console.log(`💰 Updated totalPrice for ${this.tripType}:`, {
    totalPrice: this.totalPrice,
    breakdown: {
      onwardBase,
      onwardTaxes,
      onwardBaggage,
      onwardMealCharges,
      onwardSeatCharges,
      onwardServiceCharges,
      returnBase,
      returnTaxes,
      returnBaggage,
      returnMealCharges,
      returnSeatCharges,
      returnServiceCharges
    },
    segmentCount: this.flightSegments?.length || 0,
    seatMapLength: this.seatMap?.length || 0
  });
}

  selectFlight(flightId: string): void {
    this.selectedFlight = flightId;
    const flightIndex = parseInt(flightId, 10);
    const isReturn = this.selectedJourneyTab === 'return';
    const seatMap = this.flightDataAddOnService.getSeatMap(isReturn);
    const selectedSeatMap = seatMap[flightIndex % (isReturn ? this.returnFlights.length : this.onwardFlights.length)];

    this.aircraft = (isReturn ? this.returnFlights : this.onwardFlights)[flightIndex % (isReturn ? this.returnFlights.length : this.onwardFlights.length)]?.aircraft || 'Unknown';
    this.seatLayout = selectedSeatMap?.rows || [];
    this.seatColumns = selectedSeatMap?.seatBlocks.flat() || [];
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  isSeatSelected(segmentIndex: number, seatCode: string): boolean {
    const isReturn = this.selectedJourneyTab === 'return';
    return this.flightDataAddOnService.isSeatSelected(segmentIndex, seatCode, isReturn);
  }

  toggleSeatSelection(segmentIndex: number, seat: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    this.flightDataAddOnService.toggleSeatSelection(segmentIndex, seat, isReturn);

    if (!this.selectedSeats[segmentIndex]) {
      this.selectedSeats[segmentIndex] = [];
    }
    const seatIndex = this.selectedSeats[segmentIndex].findIndex(s => s.Code === seat.Code);
    if (seatIndex >= 0 && !this.flightDataAddOnService.isSeatSelected(segmentIndex, seat.Code, isReturn)) {
      this.selectedSeats[segmentIndex].splice(seatIndex, 1);
    } else if (seatIndex < 0 && this.flightDataAddOnService.isSeatSelected(segmentIndex, seat.Code, isReturn)) {
      this.selectedSeats[segmentIndex].push({ ...seat });
    }

    this.updateTotalPrice();
    this.prepareFareSummaryData();
    console.log(`Component selectedSeats[${segmentIndex}]:`, this.selectedSeats[segmentIndex]);
  }

  getSegmentSeatTotalPrice(segmentIndex: number): number {
    const isReturn = this.selectedJourneyTab === 'return';
    return this.flightDataAddOnService.getSegmentSeatTotalPrice(segmentIndex, isReturn);
  }

  incrementMeal(segmentIndex: number, meal: any): void {
    console.log(`incrementMeal in component: segmentIndex=${segmentIndex}, meal=`, meal);
    const isReturn = this.selectedJourneyTab === 'return';
    // this.flightDataAddOnService.incrementMeal(segmentIndex, meal, isReturn);
    // this.updateTotalPrice();
    // this.prepareFareSummaryData();
    // Restrict BBML (Baby Meal) to infants only
    if (meal.Code === 'BBML') {
      const infantCount = this.passengers.infants?.length || 0;
      const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
      const segmentMeals = selected[segmentIndex] || [];
      const bbmlEntry = segmentMeals.find((m: any) => m.meal.Code === 'BBML');
      const currentBBMLCount = bbmlEntry ? bbmlEntry.count : 0;

      if (infantCount === 0) {
        Swal.fire('Invalid Meal Selection', 'Baby Meal can only be selected for infants.', 'error');
        return;
      }

      if (currentBBMLCount >= infantCount) {
        Swal.fire('Limit Reached', `You can only select up to ${infantCount} baby meal(s) for the infant(s).`, 'info');
        return;
      }
    }

    this.flightDataAddOnService.incrementMeal(segmentIndex, meal, isReturn);
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  decrementMeal(segmentIndex: number, meal: any): void {
    console.log(`decrementMeal in component: segmentIndex=${segmentIndex}, meal=`, meal);
    const isReturn = this.selectedJourneyTab === 'return';
    this.flightDataAddOnService.decrementMeal(segmentIndex, meal, isReturn);
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  getMealCount(segmentIndex: number, mealCode: string): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
    const segmentMeals = selected[segmentIndex] || [];
    const mealEntry = segmentMeals.find(m => m.meal.Code === mealCode);
    return mealEntry ? mealEntry.count : 0;
  }

  totalSelectedMeals(segmentIndex: number): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
    return selected[segmentIndex]?.reduce((sum, { count }) => sum + count, 0) || 0;
  }

  getSegmentMealTotalPrice(segmentIndex: number): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
    return selected[segmentIndex]?.reduce((sum, { meal, count }) => sum + (meal.Price || 0) * count, 0) || 0;
  }


 addService(service: any): void {
  console.log(`addService in component: service=`, JSON.parse(JSON.stringify(service)));
  const isReturn = this.selectedJourneyTab === 'return' && 
                   service.Origin === this.flightSegmentsReturn[0]?.originCode && 
                   service.Destination === this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode;
  this.flightDataAddOnService.addService(service, isReturn);
  this.updateTotalPrice();
  this.prepareFareSummaryData();
}

removeService(service: any): void {
  console.log(`removeService in component: service=`, service);
  const isReturn = this.selectedJourneyTab === 'return' && 
                  service.Origin === this.flightSegmentsReturn[0]?.originCode && 
                  service.Destination === this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode;
  this.flightDataAddOnService.removeService(service, isReturn);
  this.updateTotalPrice();
  this.prepareFareSummaryData();
}



 // Update getServiceCount to ensure proper service filtering
getServiceCount(serviceCode: string, service: any): number {
  const isReturn = service.Origin === this.flightSegmentsReturn[0]?.originCode && 
                   service.Destination === this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode;
  const serviceEntry = this.flightDataAddOnService.selectedServices.find(
    s => s.service.Code === serviceCode && s.service.isReturn === isReturn
  );
  return serviceEntry ? serviceEntry.count : 0;
}

 // Update totalSelectedServices to count services correctly
totalSelectedServices(): number {
  const isReturn = this.selectedJourneyTab === 'return';
  return this.flightDataAddOnService.selectedServices
    .filter(s => s.service.isReturn === isReturn)
    .reduce((sum, { count }) => sum + count, 0);
}


getServiceTotalPrice(): number {
  const isReturn = this.selectedJourneyTab === 'return';
  return this.flightDataAddOnService.selectedServices
    .filter(s => s.service.isReturn === isReturn)
    .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0); // Changed to exclude infants
}



prepareFareSummaryData(): void {
  const totalPax = this.totalAdults + this.totalChildren; // Changed to exclude infants
  
  // For multicity, ensure we include baggage charges from mobFinalPageData if summary baggageCharges is empty
  let baggageCharges = this.onwardFareSummary?.summary?.baggageCharges || [];
  if ((this.tripType === 'multicity' || this.tripType === 'oneway') && baggageCharges.length === 0 && this.flightData?.mobFinalPageData?.baggage?.onward) {
    // Build baggage charges array from mobFinalPageData for multicity/oneway
    baggageCharges = this.flightData.mobFinalPageData.baggage.onward.map((item: any) => ({
      label: `Excess ${item.Weight || item.Kgs || ''}kg`,
      amount: item.Price || 0
    }));
  }
  
  const onwardFare: FareSummary = {
    baseFare: this.onwardFareSummary?.summary?.baseFare || [],
    taxes: this.onwardFareSummary?.summary?.taxes || [],
    baggageCharges: baggageCharges,
    mealCharges: this.flightDataAddOnService.selectedMeals.reduce(
      (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0),
      0
    ),
    seatCharges: this.seatMap.slice(0, this.flightSegments.length).reduce(
      (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, false),
      0
    ),
    specialServiceCharges: this.flightDataAddOnService.selectedServices
      .filter(s => !s.service.isReturn)
      .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * totalPax, 0), // Changed to use totalPax (adults + children)
    totalAmount: 0
  };

  onwardFare.totalAmount =
    onwardFare.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) +
    onwardFare.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) +
    onwardFare.baggageCharges.reduce((sum, item) => sum + item.amount, 0) +
    onwardFare.mealCharges +
    onwardFare.seatCharges +
    onwardFare.specialServiceCharges;

  if (this.onwardFareSummary) {
    this.onwardFareSummary.summary = onwardFare;
  }

  if (this.tripType === 'roundtrip' && this.returnFareSummary) {
    const returnFare: FareSummary = {
      baseFare: this.returnFareSummary.summary?.baseFare || [],
      taxes: this.returnFareSummary.summary?.taxes || [],
      baggageCharges: this.returnFareSummary.summary?.baggageCharges || [],
      mealCharges: this.flightDataAddOnService.selectedMealsReturn.reduce(
        (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0),
        0
      ),
      seatCharges: this.seatMap.slice(this.flightSegments.length).reduce(
        (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, true),
        0
      ),
      specialServiceCharges: this.flightDataAddOnService.selectedServices
        .filter(s => s.service.isReturn)
        .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * totalPax, 0), // Changed to use totalPax (adults + children)
      totalAmount: 0
    };

    returnFare.totalAmount =
      returnFare.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) +
      returnFare.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) +
      returnFare.baggageCharges.reduce((sum, item) => sum + item.amount, 0) +
      returnFare.mealCharges +
      returnFare.seatCharges +
      returnFare.specialServiceCharges;

    this.returnFareSummary.summary = returnFare;
  }
}


  openFareSummary(): void {
    this.prepareFareSummaryData();
    this.showFareSummaryModal = true;
  }

  closeFareSummary(): void {
    this.showFareSummaryModal = false;
  }

  // Getter methods to ensure fare summary always has a value (matching mobile version behavior)
  get onwardFareForSummary(): any {
    return this.onwardFareSummary?.summary || {
      baseFare: [],
      taxes: [],
      baggageCharges: [],
      mealCharges: 0,
      seatCharges: 0,
      specialServiceCharges: 0,
      totalAmount: 0
    };
  }

  get returnFareForSummary(): any {
    return this.returnFareSummary?.summary || {
      baseFare: [],
      taxes: [],
      baggageCharges: [],
      mealCharges: 0,
      seatCharges: 0,
      specialServiceCharges: 0,
      totalAmount: 0
    };
  }

  getSeatTooltip(seat: any): string {
    return this.flightDataAddOnService.getSeatTooltip(seat);
  }
 

  private calculateJourneyTotalCharges(isReturn: boolean): number {
  const fareSummary = isReturn ? this.returnFareSummary : this.onwardFareSummary;
  const flightSegments = isReturn ? this.flightSegmentsReturn : this.flightSegments;
  const baggageData = isReturn
    ? this.flightData?.mobFinalPageData?.baggage?.return || []
    : this.flightData?.mobFinalPageData?.baggage?.onward || [];

  // Passenger fares (base fare + taxes)
  let passengerAmount = 0;
  if (fareSummary?.summary) {
    // Adult fares
    const adultBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Adults'))?.amount || 0;
    const adultTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Adults'))?.amount || 0;
    const adultCount = this.totalAdults;
    passengerAmount += (adultBaseFare + adultTaxes) * adultCount;

    // Child fares
    const childBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Children'))?.amount || 0;
    const childTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Children'))?.amount || 0;
    const childCount = this.totalChildren;
    passengerAmount += (childBaseFare + childTaxes) * childCount;

    // Infant fares
    const infantBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Infants'))?.amount || 0;
    const infantTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Infants'))?.amount || 0;
    const infantCount = this.passengers.infants?.length || 0;
    passengerAmount += (infantBaseFare + infantTaxes) * infantCount;
  }

  // Baggage charges
  const baggageCharges = baggageData.reduce((sum: number, item: any) => sum + (item.Price || 0), 0);

  // Seat charges
  const seatCharges = this.seatMap
    .slice(isReturn ? this.flightSegments.length : 0, isReturn ? undefined : this.flightSegments.length)
    .reduce((sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, isReturn), 0);

  // Meal charges
  const mealCharges = (isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals)
    .reduce((sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0);

  // Special service charges
  const serviceCharges = this.flightDataAddOnService.selectedServices
    .filter(s => s.service.isReturn === isReturn)
    .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0); // Changed to exclude infants

  // Total
  const total = passengerAmount + baggageCharges + seatCharges + mealCharges + serviceCharges;
  console.log(`${isReturn ? 'Return' : 'Onward'} Amount:`, {
    passengerAmount,
    baggageCharges,
    seatCharges,
    mealCharges,
    serviceCharges,
    total
  });

  return total;
}
  
 onContinue(): void {
  this.loader = true;
  const onwardPayloadthisPage = {
    seats: this.flightDataAddOnService.getSelectedSeatsFinal(false),
    meals: this.flightDataAddOnService.getSelectedMealsFinal(false),
    services: this.flightDataAddOnService.getSelectedServices(false),
    baggage: this.flightData?.mobFinalPageData?.baggage?.onward || [],
    totalCharges: this.calculateJourneyTotalCharges(false)
  };

  let returnPayloadthisPage = null;
  if (this.tripType === 'roundtrip' && !this.isUnifiedSegmentFormat) {
    returnPayloadthisPage = {
      seats: this.flightDataAddOnService.getSelectedSeatsFinal(true),
      meals: this.flightDataAddOnService.getSelectedMealsFinal(true),
      services: this.flightDataAddOnService.getSelectedServices(true),
      baggage: this.flightData?.mobFinalPageData?.baggage?.return || [],
      totalCharges: this.calculateJourneyTotalCharges(true)
    };
  }



  // Combine add-ons for unified segment format
  let payload;
  if (this.isUnifiedSegmentFormat) {
    const combinedSeats = [
      ...this.flightDataAddOnService.getSelectedSeatsFinal(false),
      ...this.flightDataAddOnService.getSelectedSeatsFinal(true)
    ];
    const combinedMeals = [
      ...this.flightDataAddOnService.getSelectedMealsFinal(false),
      ...this.flightDataAddOnService.getSelectedMealsFinal(true)
    ];
    const combinedServices = [
      ...this.flightDataAddOnService.getSelectedServices(false),
      ...this.flightDataAddOnService.getSelectedServices(true)
    ];
    const combinedBaggage = [
      ...(this.flightData?.mobFinalPageData?.baggage?.onward || []),
      ...(this.flightData?.mobFinalPageData?.baggage?.return || [])
    ];

    payload = {
      onward: {
        seats: combinedSeats,
        meals: combinedMeals,
        services: combinedServices,
        baggage: combinedBaggage,
        totalCharges: this.calculateJourneyTotalCharges(false) + (this.tripType === 'roundtrip' ? this.calculateJourneyTotalCharges(true) : 0)
      },
      return: null
    };
  } else {
    payload = {
      onward: onwardPayloadthisPage,
      return: returnPayloadthisPage,
      totalCharges: this.flightDataAddOnService.getTotalAddonCharges() +
        (this.flightData?.mobFinalPageData?.baggage?.onward?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0) +
        (this.tripType === 'roundtrip' && !this.isUnifiedSegmentFormat ? (this.flightData?.mobFinalPageData?.baggage?.return?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0) : 0)
    };
  }

  console.log('Selected Add-on Payload:', JSON.stringify(payload, null, 2));
  if (!this.passengers.adults.every(p => p.firstName?.trim() && p.lastName?.trim())) {
        Swal.fire('Error', 'Please complete all passenger details.', 'error');
        return;
  }



 // Validate mandatory meal and seat selections
  const totalPassengers = this.totalAdults + this.totalChildren;
  const extraMandatoryFields = this.flightData?.mobFinalPageData?.extraMandatoryFields || {};


  if (this.tripType === 'oneway' || (this.tripType === 'roundtrip' && !this.isUnifiedSegmentFormat)) {
      if (extraMandatoryFields.mealMandatoryOnward) {
        const selectedMealsOnward = this.flightDataAddOnService.getSelectedMealsFinal(false);
        console.log('selectedMealsOnward:', selectedMealsOnward);
        const totalMealsOnward = Array.isArray(selectedMealsOnward)
          ? selectedMealsOnward.reduce((sum: number, meal: any) => sum + (meal.meal.Quantity || 0), 0)
          : 0;
        if (totalMealsOnward < totalPassengers * this.flightSegments.length) {
          Swal.fire('Error', `Please select meals for all ${totalPassengers} passenger(s) for each onward segment.`, 'error');
          this.loader = false;
          return;
        }
      }

      if (extraMandatoryFields.seatMandatoryOnward) {
        const selectedSeatsOnward = this.flightDataAddOnService.getSelectedSeatsFinal(false);
        console.log('selectedSeatsOnward:', selectedSeatsOnward);
        const totalSeatsOnward = Array.isArray(selectedSeatsOnward)
          ? selectedSeatsOnward.length
          : 0;
        if (totalSeatsOnward < totalPassengers * this.flightSegments.length) {
          Swal.fire('Error', `Please select seats for all ${totalPassengers} passenger(s) for each onward segment.`, 'error');
          this.loader = false;
          return;
        }
      }

      if (this.tripType === 'roundtrip' && returnPayloadthisPage) {
        if (extraMandatoryFields.mealMandatoryReturn) {
          const selectedMealsReturn = this.flightDataAddOnService.getSelectedMealsFinal(true);
          console.log('selectedMealsReturn:', selectedMealsReturn);
          const totalMealsReturn = Array.isArray(selectedMealsReturn)
            ? selectedMealsReturn.reduce((sum: number, meal: any) => sum + (meal.meal.Quantity || 0), 0)
            : 0;
          if (totalMealsReturn < totalPassengers * this.flightSegmentsReturn.length) {
            Swal.fire('Error', `Please select meals for all ${totalPassengers} passenger(s) for each return segment.`, 'error');
            this.loader = false;
            return;
          }
        }

        if (extraMandatoryFields.seatMandatoryReturn) {
          const selectedSeatsReturn = this.flightDataAddOnService.getSelectedSeatsFinal(true);
          console.log('selectedSeatsReturn:', selectedSeatsReturn);
          const totalSeatsReturn = Array.isArray(selectedSeatsReturn)
            ? selectedSeatsReturn.length
            : 0;
          if (totalSeatsReturn < totalPassengers * this.flightSegmentsReturn.length) {
            Swal.fire('Error', `Please select seats for all ${totalPassengers} passenger(s) for each return segment.`, 'error');
            this.loader = false;
            return;
          }
        }
      }
    } else if (this.isUnifiedSegmentFormat) {
      // Unified segment validation for both onward and return
      const totalSegments = this.flightSegments.length + (this.flightSegmentsReturn.length || 0);
      if (extraMandatoryFields.mealMandatoryOnward || extraMandatoryFields.mealMandatoryReturn) {
        const selectedMeals = [
          ...this.flightDataAddOnService.getSelectedMealsFinal(false),
          ...this.flightDataAddOnService.getSelectedMealsFinal(true)
        ];
        const totalMeals = Array.isArray(selectedMeals)
          ? selectedMeals.reduce((sum: number, meal: any) => sum + (meal.meal.Quantity || 0), 0)
          : 0;
        if (totalMeals < totalPassengers * totalSegments) {
          Swal.fire('Error', `Please select meals for all ${totalPassengers} passenger(s) for each segment (onward and return).`, 'error');
          this.loader = false;
          return;
        }
      }

      if (extraMandatoryFields.seatMandatoryOnward || extraMandatoryFields.seatMandatoryReturn) {
        const selectedSeats = [
          ...this.flightDataAddOnService.getSelectedSeatsFinal(false),
          ...this.flightDataAddOnService.getSelectedSeatsFinal(true)
        ];
        const totalSeats = Array.isArray(selectedSeats)
          ? selectedSeats.length
          : 0;
        if (totalSeats < totalPassengers * totalSegments) {
          Swal.fire('Error', `Please select seats for all ${totalPassengers} passenger(s) for each segment (onward and return).`, 'error');
          this.loader = false;
          return;
        }
      }
    }


    const isLCC = this.flightData.departureFlightData?.selectedFare?.originalFareOption?.IsLCC || false;
    const isLCCReturn = this.flightData.returnFlightData?.selectedFare?.originalFareOption?.IsLCC || false;

    this.passportInfoRequired = !!(
            this.flightData.mobFinalPageData?.passportRequired
    );

    this.gstMandatory = this.flightData.departureFlightData?.selectedFare?.originalFareOption?.IsGSTMandatory

    
    const onwardFlightData = {
      adultFareDetail: this.flightData.mobFinalPageData.fareSummary?.onward?.adultFareDetails || {},
      childrenFareDetail: this.flightData.mobFinalPageData.fareSummary?.onward?.childFareDetail || {},
      infantFareDetail: this.flightData.mobFinalPageData.fareSummary?.onward?.infantFareDetails || {},
      fareCommonDetail: this.flightData.mobFinalPageData.fareSummary?.onward?.fareDetails || {},
      adultBaseFare: this.onwardFareSummary?.summary?.baseFare.find(f => f.label.includes('Adults'))?.amount || 0,
      adultTaxes: this.onwardFareSummary?.summary?.taxes.find(t => t.label.includes('Adults'))?.amount || 0,
      childrenBaseFare: this.onwardFareSummary?.summary?.baseFare.find(f => f.label.includes('Children'))?.amount || 0,
      childrenTaxes: this.onwardFareSummary?.summary?.taxes.find(t => t.label.includes('Children'))?.amount || 0,
      infantBaseFare: this.onwardFareSummary?.summary?.baseFare.find(f => f.label.includes('Infants'))?.amount || 0,
      infantTaxes: this.onwardFareSummary?.summary?.taxes.find(t => t.label.includes('Infants'))?.amount || 0,
      flightSegments: this.flightSegments,
      flightSegmentsReturn: this.flightSegmentsReturn,
      isReturn: this.isUnifiedSegmentFormat ? true : false,
      baggage: this.isUnifiedSegmentFormat
        ? [...(this.flightData?.mobFinalPageData?.baggage?.onward || []), ...(this.flightData?.mobFinalPageData?.baggage?.return || [])]
        : this.flightData?.mobFinalPageData?.baggage?.onward || []
      // baggage: this.flightData?.mobFinalPageData?.baggage?.onward || [],
      // ssrDataOnward : this.flightData.mobFinalPageData.ssr.onward,
      // ssrDataReturn : this.flightData.mobFinalPageData.ssr.return
    };

    const bookingParams = {
      tboToken: this.tboToken,
      traceId: this.traceId,
      resultIndex: this.resultIndex,
      ipAddress: this.ipAddress
    };


    console.log('isLCC:', isLCC);
    console.log('onwardFlightData:', onwardFlightData);
    console.log('bookingParams:', bookingParams);
    console.log('passengers:', this.passengers);
    console.log('contact:', this.contact);
    console.log('gstInfo:', this.gstInfo);
    console.log('gstMandatory:', this.gstMandatory);
    console.log('passportInfoRequired:', this.passportInfoRequired);

    let onwardPayload: any = null;
    if (!this.isUnifiedSegmentFormat && this.resultIndex) {
      onwardPayload = this.bookingPayloadService.generateBookingPayload(
        isLCC,
        onwardFlightData,
        bookingParams,
        this.passengers,
        this.contact,
        this.gstInfo,
        this.gstMandatory,
        this.passportInfoRequired,      
        // this.isUnifiedSegmentFormat
        //   ? { onward: this.flightData.mobFinalPageData.ssr.onward, return: this.flightData.mobFinalPageData.ssr.return }
        //   : this.flightData.mobFinalPageData.ssr.onward,
        this.flightData.mobFinalPageData.ssr.onward, 
        // this.isUnifiedSegmentFormat
      );
    }

    let internationalReturnPayload: any = null;
    if(this.isUnifiedSegmentFormat){
      internationalReturnPayload = this.bookingPayloadService.generateBookingPayloadInternationReturn(
        isLCC,
        onwardFlightData,
        bookingParams,
        this.passengers,
        this.contact,
        this.gstInfo,
        this.gstMandatory,
        this.passportInfoRequired,      
        { onward: this.flightData.mobFinalPageData.ssr.onward, return: this.flightData.mobFinalPageData.ssr.return }                
      );
    }

    let returnPayload: any = null;
    if (this.tripType === 'roundtrip' && !this.isUnifiedSegmentFormat && this.resultIndexReturn) {
      const returnFlightData = {
        ...onwardFlightData,
        adultFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.adultFareDetails || {},
        childrenFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.childFareDetail || {},
        infantFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.infantFareDetails || {},
        // adultFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.adultFareDetail || {},
        // childrenFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.childrenFareDetail || {},
        // infantFareDetail: this.flightData.mobFinalPageData.fareSummary?.return?.infantFareDetail || {},
        fareCommonDetail: this.flightData.mobFinalPageData.fareSummary?.return?.fareCommonDetail || {},
        adultBaseFare: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Adults'))?.amount || 0,
        adultTaxes: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Adults'))?.amount || 0,
        adultBaseFareReturn: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Adults'))?.amount || 0,
        adultTaxesReturn: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Adults'))?.amount || 0,
        childrenBaseFare: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Children'))?.amount || 0,
        childrenTaxes: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Children'))?.amount || 0,
        childrenBaseFareReturn: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Children'))?.amount || 0,
        childrenTaxesReturn: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Children'))?.amount || 0,
        infantBaseFare: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Infants'))?.amount || 0,
        infantTaxes: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Infants'))?.amount || 0,
        infantBaseFareReturn: this.returnFareSummary?.summary?.baseFare.find(f => f.label.includes('Infants'))?.amount || 0,
        infantTaxesReturn: this.returnFareSummary?.summary?.taxes.find(t => t.label.includes('Infants'))?.amount || 0,
        isReturn: true,
        baggage: this.flightData?.mobFinalPageData?.baggage?.return || [],
        // ssrDataOnward : this.flightData.mobFinalPageData.ssr.onward,
        // ssrDataReturn : this.flightData.mobFinalPageData.ssr.return
      };

      const returnBookingParams = { ...bookingParams, resultIndex: this.resultIndexReturn };
        returnPayload = this.bookingPayloadService.generateBookingPayload(
          isLCCReturn,
          returnFlightData,
          returnBookingParams,
          this.passengers,
          this.contact,
          this.gstInfo,
          this.gstMandatory,
          this.passportInfoRequired,  
          this.flightData.mobFinalPageData.ssr.return,
          // this.isUnifiedSegmentFormat
      );
    }

    console.log("Payload",onwardPayload)
    console.log("Payload",returnPayload)
    console.log("Internation Return Payload",internationalReturnPayload)


    // return ;

    // SEND TO PG 

    // Calculate amounts

    
    
    const onwardAmount = this.calculateJourneyAmount(false);
    const returnAmount = this.tripType === 'roundtrip' ? this.calculateJourneyAmount(true) : 0;
    const totalAmount = onwardAmount + returnAmount;

    console.log('onwardAmount:', onwardAmount);
    console.log('returnAmount:', returnAmount);
    console.log('totalAmount:', totalAmount);

    // SEND TO PG

    const appid = this.passengers.adults[0].mobileNumber;
    this.orderId = 'FL'+Math.random().toString(36).substr(2, 6).toUpperCase();
    const customerName = this.passengers.adults[0].firstName + ' ' + this.passengers.adults[0].lastName; // Fixed typo: lastName instead of firstName
    const customerEmail = this.passengers.adults[0].email;
    const customerDialCountryCode = this.passengers.adults[0].mobileDialCode;
    const customerPhone = this.passengers.adults[0].mobileNumber;

    console.log('appid:', appid);
    console.log('orderId:', this.orderId);
    console.log('customerName:', customerName);
    console.log('customerDialCountryCode:', customerDialCountryCode);
    console.log('customerEmail:', customerEmail);

    console.log('customerPhone:', customerPhone);

    // return;
    let finalOnwardPayload = null;
    if(this.isUnifiedSegmentFormat){
      finalOnwardPayload = internationalReturnPayload
    }else{
      finalOnwardPayload = onwardPayload
    }

    this.subscriptions.add(
      this.apiService.flightSuccess(
        appid, this.orderId, 
        this.tripType,
        this.isUnifiedSegmentFormat,
        customerName, customerEmail, customerDialCountryCode, customerPhone,
        this.flightData.fromCity,
        this.flightData.toCity,
        this.flightData.departureDate,
        this.flightData.returnDate,
        finalOnwardPayload, returnPayload, onwardAmount, returnAmount,
        totalAmount, isLCC,isLCCReturn
      ).subscribe({
        next: (val: any) => {
          console.log('Payment API Response (full):', JSON.stringify(val, null, 2));
          console.log('Payment API Response type:', typeof val, 'Is Array:', Array.isArray(val));
          
          // Handle response - could be array or object (match mobile version logic)
          let response = val;
          if (Array.isArray(val) && val.length > 0) {
            response = val[0];
            console.log('Response is array, using first element:', response);
          }
          
          // Match mobile version exactly - check val['payment_session_id'] first
          let sessionId = val?.['payment_session_id'];
          
          // If not found in val, check response object
          if (!sessionId) {
            sessionId = response?.['payment_session_id'] || 
                       response?.['paymentSessionId'] || 
                       response?.['session_id'];
          }
          
          // Clean and validate session ID
          if (sessionId) {
            sessionId = String(sessionId).trim();
            
            // Remove any duplicate "payment" suffixes that might have been accidentally appended by backend
            // Session IDs should start with "session_" and not end with "payment"
            if (sessionId.endsWith('paymentpayment')) {
              sessionId = sessionId.replace(/paymentpayment$/, '');
              console.warn('⚠️ Removed duplicate "paymentpayment" suffix from session ID');
            } else if (sessionId.endsWith('payment') && sessionId.startsWith('session_')) {
              // Only remove "payment" suffix if the remaining string still starts with "session_"
              const testId = sessionId.replace(/payment$/, '');
              if (testId.startsWith('session_') && testId.length > 20) {
                sessionId = testId;
                console.warn('⚠️ Removed duplicate "payment" suffix from session ID');
              }
            }
            
            console.log('Payment session ID received (cleaned):', sessionId);
            console.log('Payment session ID length:', sessionId.length);
            
            // Validate session ID format (should start with 'session_')
            if (!sessionId.startsWith('session_')) {
              console.warn('⚠️ Session ID does not start with "session_", but proceeding anyway');
            }
            
            // Ensure cashfree function is available in browser (match mobile version approach)
            if (isPlatformBrowser(this.platformId)) {
              // Check if cashfree function exists (match mobile version)
              if (typeof cashfree === 'function') {
                try {
                  console.log('Calling cashfree with session ID:', sessionId);
                  // Use the cashfree function directly (matches mobile version)
                  cashfree(sessionId);
                  console.log('✅ Cashfree payment gateway opened with session:', sessionId);
                  // Don't set loader to false here - let the payment gateway handle it
                } catch (error) {
                  console.error('❌ Error calling cashfree:', error);
                  Swal.fire({
                    title: 'Error',
                    html: 'Failed to open payment gateway. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
                  this.loader = false;
                }
              } else {
                console.error('❌ Cashfree function not found. Make sure cashfree.js is loaded.');
                Swal.fire({
                  title: 'Error',
                  html: 'Payment gateway not available. Please refresh the page.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
                this.loader = false;
              }
            }
          } else {
            // Handle error response - check multiple possible error locations
            const errorMessage = response?.message || 
                                val?.message || 
                                response?.error?.message ||
                                val?.error?.message ||
                                'Payment session creation failed';
            const isEmailError = errorMessage.toString().toUpperCase().trim().includes('INVALID EMAIL');
            
            console.error('❌ Payment session creation failed. Response:', response, 'Error:', errorMessage);
            Swal.fire({
              title: 'Sorry!',
              html: isEmailError ? 'Please Enter Email ID in Correct Format.' : errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this.loader = false;
          }
        },
        error: (error: any) => {
          console.error('Payment API Error:', error);
          const errorMessage = error?.error?.message || error?.message || 'Failed to create payment session. Please try again.';
          Swal.fire({
            title: 'Error',
            html: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.loader = false;
        }
      })  
    )



    return;
   
    const bookFlight = (payload: any, index: string, isLccBook: boolean, isReturn: boolean) => {
      const leg = isReturn ? 'RETURN' : 'ONWARD';

      const handleResult = (pnr: string | null) => {
        console.log(`✔️ ${leg} booking result handled. PNR:`, pnr);

        // this.maybeNavigateToSuccessPage();
        if (this.isUnifiedSegmentFormat) {
          // For unified segment, only store one PNR
          this.onwardPNR = pnr || '';
          this.onwardBookingDone = true;
          this.returnBookingDone = true; // Treat return as done to satisfy navigation logic
        } else {
          if (isReturn) {
            this.returnPNR = pnr || '';
            this.returnBookingDone = true;
          } else {
            this.onwardPNR = pnr || '';
            this.onwardBookingDone = true;
          }
        }

        this.maybeNavigateToSuccessPage();
      };

      const handleBookingResponse = (res: any, isLcc: boolean) => {
        const status = res.Response?.ResponseStatus;
        const errorCode = res.Response?.Error?.ErrorCode;
        const errorMsg = res.Response?.Error?.ErrorMessage;
        const pnr = res.Response?.Response?.PNR || null;

        console.log(`📥 ${leg} booking API response:`, res);

        if (status === 1 && errorCode === 0) {
          console.log(`✅ ${leg} booking confirmed. PNR:`, pnr);
          Swal.fire('Success', `${leg} booking confirmed!`, 'success');
          handleResult(pnr);
        } else if (this.isBookingUnderProcess(res)) {
          console.warn(`⏳ ${leg} booking is under process. Will retry in 4s.`);
          Swal.fire('Info', `${leg} booking is under process. Retrying shortly...`, 'info');
          setTimeout(() => {
            bookFlight(payload, index, isLcc, isReturn);
          }, 4000);
        } else {
          console.error(`❌ ${leg} booking failed. Status: ${status}, Code: ${errorCode}, Message: ${errorMsg}`);
          Swal.fire('Error', errorMsg || 'Booking failed.', 'error');
          handleResult(null);
        }

        this.loader = false;
      };

      console.log(`🚀 Initiating ${isLccBook ? 'LCC' : 'NON-LCC'} booking for ${leg}...`);
      console.log(`📤 Payload:`, payload);
      console.log(`📌 Index:`, index);

      const bookingObs = isLccBook
        ? this.apiService.bookTicketLCC(this.ipAddress, this.tboToken, this.traceId, index, payload)
        : this.apiService.bookTicketNonLCC(this.ipAddress, this.tboToken, this.traceId, index, payload);

      this.subscriptions.add(
        bookingObs.subscribe({
          next: (res: any) => {
            if (!isLccBook && res.Response?.ResponseStatus === 1 && res.Response?.Error?.ErrorCode === 0) {
              const PNR = res.Response.Response.PNR;
              const bookingId = res.Response.Response.BookingId;

              console.log(`📄 NON-LCC booking successful for ${leg}. Proceeding to final ticketing. PNR: ${PNR}, Booking ID: ${bookingId}`);

              this.apiService.finalTicketNonLCC(this.ipAddress, this.tboToken, this.traceId, PNR, bookingId, null).subscribe({
                next: (ticketRes: any) => {
                  console.log(`🎫 Final ticketing response for ${leg}:`, ticketRes);

                  if (ticketRes.Response?.ResponseStatus === 1 && ticketRes.Response?.Error?.ErrorCode === 0) {
                    console.log(`✅ ${leg} final ticketing successful.`);
                    Swal.fire('Success', `${leg} Final ticketing confirmed!`, 'success');
                    handleResult(PNR);
                  } else if (this.isBookingUnderProcess(ticketRes)) {
                    console.warn(`⏳ ${leg} final ticketing under process. Retrying in 4s.`);
                    Swal.fire('Info', `${leg} ticketing is under process. Retrying shortly...`, 'info');
                    setTimeout(() => {
                      bookFlight(payload, index, isLccBook, isReturn);
                    }, 4000);
                  } else {
                    // console.error(`❌ ${leg} final ticketing failed.`, ticketRes.Response?.Error?.ErrorMessage);
                    // Swal.fire('Error', ticketRes.Response?.Error?.ErrorMessage || 'Final ticketing failed.', 'error');
                    // handleResult(null);

                      console.error(`❌ ${leg} final ticketing failed.`, ticketRes.Response?.Error?.ErrorMessage);
                      Swal.fire('Error', ticketRes.Response?.Error?.ErrorMessage || 'Final ticketing failed.', 'error');

                      // Prepare payload for logging
                      const failurePayload = {
                        enduserip: this.ipAddress,
                        tokenid: this.tboToken,
                        traceid: this.traceId,
                        PNR: PNR,
                        bookingid: bookingId,
                        errormessage: ticketRes.Response || ticketRes,  // If full response is needed
                        wizzpnr : this.orderId
                      };

                      // Call backend to log non-LCC failure
                      this.apiService.insertNonLCCBookingDetails(failurePayload).subscribe({
                        next: (res: any) => {
                          console.log('📝 Logged non-LCC ticket failure:', res);
                        },
                        error: (e) => {
                          console.error('⚠️ Failed to log non-LCC failure to backend', e);
                        }
                      });

                      handleResult(null);
                  }

                  this.loader = false;
                },
                error: (err) => {
                  console.error(`🚨 Error during final ticketing for ${leg}:`, err);
                  Swal.fire('Error', 'Final ticketing service unavailable.', 'error');
                  handleResult(null);
                  this.loader = false;
                }
              });
            } else {
              handleBookingResponse(res, isLccBook);
            }
          },
          error: (err) => {
            console.error(`🚨 Error during booking API call for ${leg}:`, err);
            Swal.fire('Error', 'Booking service unavailable.', 'error');
            handleResult(null);
            this.loader = false;
          }
        })
      );
    };

    

      console.log('Initiating ONWARD booking...');

      if (!this.isUnifiedSegmentFormat && onwardPayload && this.resultIndex) {
        // ONEWAY or ROUNDTRIP onward
        bookFlight(onwardPayload, this.resultIndex, isLCC, false);
      } else if (this.isUnifiedSegmentFormat) {
        // Unified format (usually multicity or international return)
        bookFlight(internationalReturnPayload, this.resultIndex, isLCC, false);
      }

      if (this.tripType === 'roundtrip' && !this.isUnifiedSegmentFormat && returnPayload && this.resultIndexReturn) {
        console.log('Initiating RETURN booking...');
        bookFlight(returnPayload, this.resultIndexReturn, isLCCReturn, true);
      }
    }

  


  private isBookingUnderProcess(res: any): boolean {
    return (
      res?.Response?.ResponseStatus === 2 &&
      res?.Response?.Error?.ErrorCode === 28 &&
      (res?.Response?.Error?.ErrorMessage || '').toLowerCase().includes('under process')
    );
  }

  private maybeNavigateToSuccessPage(): void {
  const isRoundTrip = this.tripType === 'roundtrip';

  if (this.onwardBookingDone && (!isRoundTrip || this.isUnifiedSegmentFormat || this.returnBookingDone)) {
    if (this.onwardPNR || this.returnPNR) {
      this.router.navigate(['/flightsuccesspage'], {
        queryParams: {
          orderId: this.orderId,
          pnrOnward: this.onwardPNR,
          pnrReturn: this.isUnifiedSegmentFormat ? '' : this.returnPNR,
          firstNameOnward: this.passengers.adults[0]?.firstName,
          firstNameReturn: this.passengers.adults[0]?.firstName,
          tripType: this.tripType
        }
      });
    } else {
      Swal.fire('Error', 'Booking failed for both legs.', 'error');
    }
  }
}
  getSeatCount(seatBlocks: string[][]): number {
    return seatBlocks.reduce((count, block) => count + block.length, 0);
  }

  getAisleCount(seatBlocks: string[][]): number {
    return seatBlocks.length - 1;
  }

  getBlockCount(seatBlocks: string[][]): number {
    return seatBlocks.length;
  }


  private calculateJourneyAmount(isReturn: boolean): number {
  const fareSummary = isReturn ? this.returnFareSummary : this.onwardFareSummary;
  const flightSegments = isReturn ? this.flightSegmentsReturn : this.flightSegments;
  const baggageData = isReturn
    ? this.flightData?.mobFinalPageData?.baggage?.return || []
    : this.flightData?.mobFinalPageData?.baggage?.onward || [];

  // Passenger fares (base fare + taxes)
  let passengerAmount = 0;
  if (fareSummary?.summary) {
    // Adult fares
    const adultBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Adults'))?.amount || 0;
    const adultTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Adults'))?.amount || 0;
    const adultCount = this.totalAdults;
    passengerAmount += (adultBaseFare + adultTaxes) * adultCount;

    // Child fares
    const childBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Children'))?.amount || 0;
    const childTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Children'))?.amount || 0;
    const childCount = this.totalChildren;
    passengerAmount += (childBaseFare + childTaxes) * childCount;

    // Infant fares
    const infantBaseFare = fareSummary.summary.baseFare?.find(f => f.label.includes('Infants'))?.amount || 0;
    const infantTaxes = fareSummary.summary.taxes?.find(t => t.label.includes('Infants'))?.amount || 0;
    const infantCount = this.passengers.infants?.length || 0;
    passengerAmount += (infantBaseFare + infantTaxes) * infantCount;
  }

  // Baggage charges
  const baggageCharges = baggageData.reduce((sum: number, item: any) => sum + (item.Price || 0), 0);

  // Seat charges
  const seatCharges = this.seatMap
    .slice(isReturn ? this.flightSegments.length : 0, isReturn ? undefined : this.flightSegments.length)
    .reduce((sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, isReturn), 0);

  // Meal charges
  const mealCharges = (isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals)
    .reduce((sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0);

  // Special service charges
  const serviceCharges = this.flightDataAddOnService.selectedServices
    .filter(s => s.service.isReturn === isReturn)
    .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren + this.totalInfants), 0);

  // Total
  const total = passengerAmount + baggageCharges + seatCharges + mealCharges + serviceCharges;
  console.log(`${isReturn ? 'Return' : 'Onward'} Amount:`, {
    passengerAmount,
    baggageCharges,
    seatCharges,
    mealCharges,
    serviceCharges,
    total
  });

  return total;
}

getFlightLogo(index: number, isReturn: boolean): string {
  const flights = isReturn ? this.returnFlights : this.onwardFlights;
  return flights[index]?.logo || '';
}

getFlightAirlineCode(index: number, isReturn: boolean): string {
  const flights = isReturn ? this.returnFlights : this.onwardFlights;
  return flights[index]?.airlineCode || '';
}

getFlightCode(index: number, isReturn: boolean): string {
  const flights = isReturn ? this.returnFlights : this.onwardFlights;
  return flights[index]?.code || '';
}
  ngOnDestroy(): void {
    document.body.style.overflow = ''; // disable scroll
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
    this.subscriptions.unsubscribe();
  }
}
