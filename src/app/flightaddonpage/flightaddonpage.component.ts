import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiserviceService } from '../services/apiservice.service';
import { FlightaddonsService } from '../services/flightaddons.service';
import { FlightbookingpayloadService } from '../services/flightbookingpayload.service';
import { FlightdataService } from '../services/flightdata.service';
import Swal from 'sweetalert2';

declare function cashfree(sessionid : any) : any;

// Standard Interfaces synchronized with working version
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
  imports: [CommonModule, FormsModule],
  templateUrl: './flightaddonpage.component.html',
  styleUrls: ['./flightaddonpage.component.css']
})
export class FlightaddonpageComponent implements OnInit, OnDestroy {
  // Journey & Flight State
  onwardFlights: Flight[] = [];
  returnFlights: Flight[] = [];
  selectedFlight: string | null = '0';
  selectedJourneyTab: 'onward' | 'return' = 'onward';
  selectedSubTabIndex: number = 0;
  selectedSegmentIndex: number = 0;
  activeMealIndex: number = 0;

  // Data Containers
  flightSegments: any[] = [];
  flightSegmentsReturn: any[] = [];
  seatMap: any[] = [];
  hasSeatsAvailable: boolean[] = [];
  selectedSeats: any[][] = [];
  services: any[] = [];
  
  // Totals & Fare Summaries
  totalPrice: number = 0;
  onwardFareSummary: FareSummaryWrapper | null = null;
  returnFareSummary: FareSummaryWrapper | null = null;
  tripType: string = '';
  totalAdults: number = 0;
  totalChildren: number = 0;
  totalInfants : number = 0;

  // System State
  public flightData: any = null;
  public passengers: { adults: any[]; children: any[]; infants: any[] } = { adults: [], children: [], infants: [] };
  loader: boolean = true;
  isUnifiedSegmentFormat: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public apiService: ApiserviceService,
    public flightDataService: FlightdataService,
    public flightDataAddOnService: FlightaddonsService,
    public bookingPayloadService: FlightbookingpayloadService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.flightDataService.currentMessage.subscribe((val: any) => {
        if (!val) {
          this.router.navigate(['/']);
          return;
        }

        this.flightData = val;
        const mobData = val.mobFinalPageData;
        if (!mobData) return;

        // Sync basic info
        this.totalAdults = val.adults || val.totalAdults;
        this.totalChildren = val.children || val.totalChildren;
        this.totalInfants = val.infants || val.totalInfants;
        this.tripType = val.tripType;

        // Unified Segment Logic (matching working addon code)
        const depOption = val?.departureFlightData?.selectedFare?.originalFareOption;
        this.isUnifiedSegmentFormat = 
          Array.isArray(depOption?.Segments) &&
          depOption?.Segments.length === 2 &&
          Array.isArray(depOption.Segments[0]) &&
          Array.isArray(depOption.Segments[1]);

        // Map Fare Summaries
        this.onwardFareSummary = {
          summary: mobData.fareSummary.onward?.summary || null,
          adultFareDetails: mobData.fareSummary.onward?.adultFareDetails || {},
          childFareDetail: mobData.fareSummary.onward?.childFareDetail || {},
          infantFareDetails: mobData.fareSummary.onward?.infantFareDetails || {},
          FareCommonDetail: mobData.fareSummary.onward?.FareCommonDetail || {},
          fareDetails: mobData.fareSummary.onward?.fareDetails || {}
        };

        if (this.tripType === 'roundtrip') {
          this.returnFareSummary = {
            summary: mobData.fareSummary.return?.summary || null,
            adultFareDetails: mobData.fareSummary.return?.adultFareDetails || {},
            childFareDetail: mobData.fareSummary.return?.childFareDetail || {},
            infantFareDetails: mobData.fareSummary.return?.infantFareDetails || {},
            FareCommonDetail: mobData.fareSummary.return?.FareCommonDetail || {},
            fareDetails: mobData.fareSummary.return?.fareDetails || {}
          };
        }

        // Initialize Service
        this.flightDataAddOnService.setPassengerCounts(this.totalAdults, this.totalChildren, this.totalInfants);
        this.flightDataAddOnService.setFlightSegments(mobData.flightSegments, false);
        if (this.tripType === 'roundtrip') {
          this.flightDataAddOnService.setFlightSegments(mobData.flightSegmentsReturn, true);
        }

        // Process SSR (Seats, Meals, Services) via service
        const ssr = mobData.ssr;
        const processedOnward = this.flightDataAddOnService.processSSRData(ssr.onward, mobData.flightSegments, false);
        this.flightSegments = processedOnward.mealSegments;
        this.services = processedOnward.services;

        this.onwardFlights = this.mapToFlightInterface(processedOnward.seatData.seatMaps.slice(0, mobData.flightSegments.length), mobData.flightSegments);

        if (this.tripType === 'roundtrip' && ssr.return) {
          const processedReturn = this.flightDataAddOnService.processSSRData(ssr.return, mobData.flightSegmentsReturn, true);
          this.flightSegmentsReturn = processedReturn.mealSegments;
          this.services = [...this.services, ...processedReturn.services];
          
          processedOnward.seatData.seatMaps.push(...processedReturn.seatData.seatMaps);
          processedOnward.seatData.hasSeatsAvailable.push(...processedReturn.seatData.hasSeatsAvailable);
          processedOnward.seatData.selectedSeats.push(...processedReturn.seatData.selectedSeats);

          this.returnFlights = this.mapToFlightInterface(processedReturn.seatData.seatMaps, mobData.flightSegmentsReturn, mobData.flightSegments.length);
        }

        this.seatMap = processedOnward.seatData.seatMaps;
        this.hasSeatsAvailable = processedOnward.seatData.hasSeatsAvailable;
        this.selectedSeats = processedOnward.seatData.selectedSeats;

        this.updateTotalPrice();
        this.prepareFareSummaryData();
        this.loader = false;
        this.cdr.detectChanges();
      })
    );
  }

  private mapToFlightInterface(seatMaps: any[], segments: any[], offset: number = 0): Flight[] {
    return seatMaps.map((_, i) => ({
      id: `${i + offset}`,
      logo: segments[i]?.logo || '',
      airlineCode: segments[i]?.Airline?.AirlineCode || '',
      route: `${segments[i]?.originCode} - ${segments[i]?.destinationCode}`,
      aircraft: segments[i]?.FlightNumber || 'Unknown',
      layout: this.flightDataAddOnService['aircraftSeatMapConfig'][segments[i]?.aircraftCode?.split('-')[0]]?.layout || '3-3',
      code: segments[i]?.code || ''
    }));
  }

  // Exact math logic from working mob version
  updateTotalPrice(): void {
    const onwardBase = this.onwardFareSummary?.summary?.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
    const onwardTaxes = this.onwardFareSummary?.summary?.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
    const onwardBaggage = this.flightData?.mobFinalPageData?.baggage?.onward?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0;
    
    const onwardMealCharges = this.flightDataAddOnService.selectedMeals.reduce(
      (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0
    );
    const onwardSeatCharges = this.seatMap.slice(0, this.flightSegments.length).reduce(
      (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, false), 0
    );
    const onwardServiceCharges = this.flightDataAddOnService.selectedServices
      .filter(s => !s.service.isReturn)
      .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0);

    let returnPart = 0;
    if (this.tripType === 'roundtrip' && this.returnFareSummary) {
      const returnBase = this.returnFareSummary.summary?.baseFare.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
      const returnTaxes = this.returnFareSummary.summary?.taxes.reduce((sum, item) => sum + item.amount * item.count, 0) || 0;
      const returnBaggage = this.flightData?.mobFinalPageData?.baggage?.return?.reduce((sum: number, item: any) => sum + (item.Price || 0), 0) || 0;
      const returnMealCharges = this.flightDataAddOnService.selectedMealsReturn.reduce(
        (sum, segment) => sum + segment.reduce((s, { meal, count }) => s + (meal.Price || 0) * count, 0), 0
      );
      const returnSeatCharges = this.seatMap.slice(this.flightSegments.length).reduce(
        (sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, true), 0
      );
      const returnServiceCharges = this.flightDataAddOnService.selectedServices
        .filter(s => s.service.isReturn)
        .reduce((sum, { service, count }) => sum + (service.Price || 0) * count * (this.totalAdults + this.totalChildren), 0);
      
      returnPart = returnBase + returnTaxes + returnBaggage + returnMealCharges + returnSeatCharges + returnServiceCharges;
    }

    this.totalPrice = onwardBase + onwardTaxes + onwardBaggage + onwardMealCharges + onwardSeatCharges + onwardServiceCharges + returnPart;
  }

  // Toggles and Actions calling the AddOnService
  toggleSeatSelection(segmentIndex: number, seat: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    this.flightDataAddOnService.toggleSeatSelection(segmentIndex, seat, isReturn);
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  incrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    if (meal.Code === 'BBML') {
      const infantCount = this.totalInfants;
      const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
      const currentBBML = (selected[segmentIndex] || []).find((m: any) => m.meal.Code === 'BBML')?.count || 0;
      if (infantCount === 0 || currentBBML >= infantCount) {
        Swal.fire('Limit Reached', 'Baby meals are restricted to infant count.', 'info');
        return;
      }
    }
    this.flightDataAddOnService.incrementMeal(segmentIndex, meal, isReturn);
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  decrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    this.flightDataAddOnService.decrementMeal(segmentIndex, meal, isReturn);
    this.updateTotalPrice();
    this.prepareFareSummaryData();
  }

  // Fare Summary exact replication
  prepareFareSummaryData(): void {
    const totalPax = this.totalAdults + this.totalChildren;
    
    const onwardFare: FareSummary = {
      baseFare: this.onwardFareSummary?.summary?.baseFare || [],
      taxes: this.onwardFareSummary?.summary?.taxes || [],
      baggageCharges: this.onwardFareSummary?.summary?.baggageCharges || [],
      mealCharges: this.flightDataAddOnService.selectedMeals.reduce((sum, seg) => sum + seg.reduce((s, m) => s + (m.meal.Price || 0) * m.count, 0), 0),
      seatCharges: this.seatMap.slice(0, this.flightSegments.length).reduce((sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, false), 0),
      specialServiceCharges: this.flightDataAddOnService.selectedServices.filter(s => !s.service.isReturn).reduce((sum, s) => sum + (s.service.Price || 0) * s.count * totalPax, 0),
      totalAmount: 0
    };

    onwardFare.totalAmount = onwardFare.baseFare.reduce((sum, i) => sum + i.amount * i.count, 0) + onwardFare.taxes.reduce((sum, i) => sum + i.amount * i.count, 0) + onwardFare.mealCharges + onwardFare.seatCharges + onwardFare.specialServiceCharges;
    
    if (this.onwardFareSummary) this.onwardFareSummary.summary = onwardFare;

    if (this.tripType === 'roundtrip' && this.returnFareSummary) {
      const returnFare: FareSummary = {
        baseFare: this.returnFareSummary.summary?.baseFare || [],
        taxes: this.returnFareSummary.summary?.taxes || [],
        baggageCharges: this.returnFareSummary.summary?.baggageCharges || [],
        mealCharges: this.flightDataAddOnService.selectedMealsReturn.reduce((sum, seg) => sum + seg.reduce((s, m) => s + (m.meal.Price || 0) * m.count, 0), 0),
        seatCharges: this.seatMap.slice(this.flightSegments.length).reduce((sum, _, i) => sum + this.flightDataAddOnService.getSegmentSeatTotalPrice(i, true), 0),
        specialServiceCharges: this.flightDataAddOnService.selectedServices.filter(s => s.service.isReturn).reduce((sum, s) => sum + (s.service.Price || 0) * s.count * totalPax, 0),
        totalAmount: 0
      };
      returnFare.totalAmount = returnFare.baseFare.reduce((sum, i) => sum + i.amount * i.count, 0) + returnFare.taxes.reduce((sum, i) => sum + i.amount * i.count, 0) + returnFare.mealCharges + returnFare.seatCharges + returnFare.specialServiceCharges;
      this.returnFareSummary.summary = returnFare;
    }
  }

  // Packaging data to go back to the final section
  onContinue(): void {
    const updatedData = {
      ...this.fullFlightData,
      addonData: {
        seats: {
          onward: this.flightDataAddOnService.getSelectedSeatsFinal(false),
          return: this.flightDataAddOnService.getSelectedSeatsFinal(true)
        },
        meals: {
          onward: this.flightDataAddOnService.getSelectedMealsFinal(false),
          return: this.flightDataAddOnService.getSelectedMealsFinal(true)
        },
        services: this.flightDataAddOnService.selectedServices,
      },
      proceedToPayment: true
    };
    
    this.flightDataService.setStringValue(updatedData);
    this.router.navigate(['/flightfinalsection']);
  }

  // Helpers for template bindings
  getMealCount(segmentIndex: number, mealCode: string): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.flightDataAddOnService.selectedMealsReturn : this.flightDataAddOnService.selectedMeals;
    return (selected[segmentIndex] || []).find(m => m.meal.Code === mealCode)?.count || 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}