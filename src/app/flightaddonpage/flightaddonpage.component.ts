import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlightdataService } from '../services/flightdata.service';
import { ApiserviceService } from '../services/apiservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-flightaddonpage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flightaddonpage.component.html',
  styleUrls: ['./flightaddonpage.component.css']
})
export class FlightaddonpageComponent implements OnInit, OnDestroy {
  // Journey Tabs
  selectedJourneyTab: 'onward' | 'return' = 'onward';
  selectedSubTabIndex: number = 0; // 0: Seats, 1: Meals, 2: Cabs, 3: Others
  selectedSegmentIndex: number = 0;
  activeMealIndex: number = 0;
  
  // Flight Data
  tripType: 'oneway' | 'roundtrip' | 'multicity' = 'oneway';
  flightSegments: any[] = [];
  flightSegmentsReturn: any[] = [];
  onwardFlights: any[] = [];
  returnFlights: any[] = [];
  
  // Seats
  seatMap: any[] = [];
  seatMapReturn: any[] = [];
  selectedSeats: { [segmentIndex: number]: any[] } = {};
  selectedSeatsReturn: { [segmentIndex: number]: any[] } = {};
  
  // Meals
  mealOptions: any[] = [];
  mealOptionsReturn: any[] = [];
  selectedMeals: { [segmentIndex: number]: { meal: any; count: number }[] } = {};
  selectedMealsReturn: { [segmentIndex: number]: { meal: any; count: number }[] } = {};
  
  // Services
  services: any[] = [];
  selectedServices: { service: any; count: number; isReturn: boolean }[] = [];
  
  // Passengers
  totalAdults: number = 0;
  totalChildren: number = 0;
  totalInfants: number = 0;
  
  // Fare Summary
  onwardFareSummary: any = {};
  returnFareSummary: any = {};
  totalPrice: number = 0;
  showFareSummaryModal: boolean = false;
  
  // Full Flight Data
  fullFlightData: any = null;
  ssrValues: any = [];
  ssrValuesReturn: any = [];
  
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private flightDataService: FlightdataService,
    private apiService: ApiserviceService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.subscriptions.add(
      this.flightDataService.currentMessage.subscribe((val: any) => {
        if (!val) {
          this.router.navigate(['/']);
          return;
        }
        
        this.fullFlightData = val;
        this.tripType = val.tripType || 'oneway';
        this.flightSegments = val.flightSegments || [];
        this.flightSegmentsReturn = val.flightSegmentsReturn || [];
        this.totalAdults = val.totalAdults || 0;
        this.totalChildren = val.totalChildren || 0;
        this.totalInfants = val.totalInfants || 0;
        
        // Load SSR values
        this.ssrValues = val.ssrValues || [];
        this.ssrValuesReturn = val.ssrValuesReturn || [];
        
        // Initialize onward flights
        this.onwardFlights = this.flightSegments.map((segment: any, i: number) => ({
          id: `${i}`,
          logo: segment.logo,
          code: segment.code,
          route: `${segment.originCode} - ${segment.destinationCode}`,
          airlineCode: segment.code?.split(' ')[0] || ''
        }));
        
        // Initialize return flights
        if (this.tripType === 'roundtrip') {
          this.returnFlights = this.flightSegmentsReturn.map((segment: any, i: number) => ({
            id: `${i + this.flightSegments.length}`,
            logo: segment.logo,
            code: segment.code,
            route: `${segment.originCode} - ${segment.destinationCode}`,
            airlineCode: segment.code?.split(' ')[0] || ''
          }));
        }
        
        // Load seat data
        this.seatMap = val.seatMap || [];
        this.seatMapReturn = val.seatMapReturn || [];
        
        // Restore previously selected seats if available
        if (val.addonData?.seats) {
          this.selectedSeats = val.addonData.seats.onward || {};
          this.selectedSeatsReturn = val.addonData.seats.return || {};
        }
        
        // Initialize selected seats arrays for segments that don't have selections yet
        this.seatMap.forEach((_, index) => {
          if (!this.selectedSeats[index]) {
            this.selectedSeats[index] = [];
          }
        });
        this.seatMapReturn.forEach((_, index) => {
          if (!this.selectedSeatsReturn[index]) {
            this.selectedSeatsReturn[index] = [];
          }
        });
        
        // Restore previously selected meals if available
        if (val.addonData?.meals) {
          this.selectedMeals = val.addonData.meals.onward || {};
          this.selectedMealsReturn = val.addonData.meals.return || {};
        }
        
        // Restore previously selected services if available
        if (val.addonData?.services) {
          this.selectedServices = val.addonData.services || [];
        }
        
        // Load SSR data for meals and services
        this.loadSSRData();
        
        // Calculate initial total
        this.updateTotalPrice();
        this.cdr.detectChanges();
      })
    );
  }
  
  loadSSRData(): void {
    // Process meals from SSR
    if (this.ssrValues?.Response?.Meal) {
      this.processMeals(this.ssrValues.Response.Meal, false);
    }
    if (this.ssrValuesReturn?.Response?.Meal) {
      this.processMeals(this.ssrValuesReturn.Response.Meal, true);
    }
    
    // Process services from SSR
    if (this.ssrValues?.Response?.SpecialService) {
      this.processServices(this.ssrValues.Response.SpecialService, false);
    }
    if (this.ssrValuesReturn?.Response?.SpecialService) {
      this.processServices(this.ssrValuesReturn.Response.SpecialService, true);
    }
  }
  
  processMeals(mealData: any, isReturn: boolean): void {
    // Process meal data and assign to segments
    // This is a simplified version - adjust based on your SSR structure
    if (Array.isArray(mealData)) {
      mealData.forEach((mealGroup: any, index: number) => {
        if (Array.isArray(mealGroup)) {
          const segmentMeals = mealGroup.map((m: any) => ({
            Code: m.Code,
            Description: m.Description || m.AirlineDescription,
            Price: m.Price || 0,
            AirlineDescription: m.AirlineDescription
          }));
          
          if (isReturn) {
            if (!this.mealOptionsReturn[index]) {
              this.mealOptionsReturn[index] = [];
            }
            this.mealOptionsReturn[index] = segmentMeals;
          } else {
            if (!this.mealOptions[index]) {
              this.mealOptions[index] = [];
            }
            this.mealOptions[index] = segmentMeals;
          }
        }
      });
    }
  }
  
  processServices(serviceData: any, isReturn: boolean): void {
    if (Array.isArray(serviceData)) {
      const flatServices = serviceData.flat();
      flatServices.forEach((service: any) => {
        if (service && !this.services.find(s => s.Code === service.Code)) {
          this.services.push({
            ...service,
            isReturn: isReturn
          });
        }
      });
    }
  }
  
  selectFlight(flightId: string): void {
    const flightIndex = parseInt(flightId, 10);
    const isReturn = this.selectedJourneyTab === 'return';
    const segmentIndex = isReturn ? flightIndex - this.onwardFlights.length : flightIndex;
    this.selectedSegmentIndex = segmentIndex;
  }
  
  // Seat Selection Methods
  isSeatSelected(segmentIndex: number, seatCode: string): boolean {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    if (!selected[segmentIndex]) return false;
    return selected[segmentIndex].some(seat => seat.Code === seatCode);
  }
  
  toggleSeatSelection(segmentIndex: number, seat: any): void {
    if (!seat || !seat.isAvailable) return;
    
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    
    if (!selected[segmentIndex]) {
      selected[segmentIndex] = [];
    }
    
    const seatIndex = selected[segmentIndex].findIndex(s => s.Code === seat.Code);
    
    if (seatIndex >= 0) {
      selected[segmentIndex].splice(seatIndex, 1);
    } else {
      const totalSelected = this.getTotalSelectedSeats(isReturn);
      const maxSeats = this.totalAdults + this.totalChildren;
      
      if (totalSelected >= maxSeats) {
        Swal.fire('Limit Reached', `You can only select up to ${maxSeats} seat(s) for ${maxSeats} passenger(s).`, 'info');
        return;
      }
      
      selected[segmentIndex].push({ ...seat });
    }
    
    this.updateTotalPrice();
    this.cdr.detectChanges();
  }
  
  getTotalSelectedSeats(isReturn: boolean): number {
    const selected = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    return Object.values(selected).reduce((total, seats) => total + (seats?.length || 0), 0);
  }
  
  // Meal Selection Methods
  incrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
    
    if (!selected[segmentIndex]) {
      selected[segmentIndex] = [];
    }
    
    const mealEntry = selected[segmentIndex].find(m => m.meal.Code === meal.Code);
    const totalSelected = this.totalSelectedMeals(segmentIndex);
    const maxMeals = this.totalAdults + this.totalChildren;
    
    if (totalSelected >= maxMeals) {
      Swal.fire('Limit Reached', `You can only select up to ${maxMeals} meal(s) for ${maxMeals} passenger(s).`, 'info');
      return;
    }
    
    if (mealEntry) {
      mealEntry.count++;
    } else {
      selected[segmentIndex].push({ meal, count: 1 });
    }
    
    this.updateTotalPrice();
  }
  
  decrementMeal(segmentIndex: number, meal: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
    
    if (!selected[segmentIndex]) return;
    
    const mealEntry = selected[segmentIndex].find(m => m.meal.Code === meal.Code);
    if (mealEntry) {
      mealEntry.count--;
      if (mealEntry.count <= 0) {
        const index = selected[segmentIndex].indexOf(mealEntry);
        selected[segmentIndex].splice(index, 1);
      }
    }
    
    this.updateTotalPrice();
  }
  
  getMealCount(segmentIndex: number, mealCode: string): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
    const segmentMeals = selected[segmentIndex] || [];
    const mealEntry = segmentMeals.find(m => m.meal.Code === mealCode);
    return mealEntry ? mealEntry.count : 0;
  }
  
  totalSelectedMeals(segmentIndex: number): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
    return selected[segmentIndex]?.reduce((sum, { count }) => sum + count, 0) || 0;
  }
  
  getSegmentMealTotalPrice(segmentIndex: number): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
    return selected[segmentIndex]?.reduce((sum, { meal, count }) => sum + (meal.Price || 0) * count, 0) || 0;
  }
  
  // Service Selection Methods
  addService(service: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    const serviceEntry = this.selectedServices.find(s => s.service.Code === service.Code && s.service.isReturn === isReturn);
    
    const totalSelected = this.totalSelectedServices();
    const maxServices = this.totalAdults + this.totalChildren;
    
    if (totalSelected >= maxServices) {
      Swal.fire('Limit Reached', `You can only select up to ${maxServices} service(s) for ${maxServices} passenger(s).`, 'info');
      return;
    }
    
    if (serviceEntry) {
      serviceEntry.count++;
    } else {
      this.selectedServices.push({ service, count: 1, isReturn });
    }
    
    this.updateTotalPrice();
  }
  
  removeService(service: any): void {
    const isReturn = this.selectedJourneyTab === 'return';
    const serviceEntry = this.selectedServices.find(s => s.service.Code === service.Code && s.service.isReturn === isReturn);
    
    if (serviceEntry) {
      serviceEntry.count--;
      if (serviceEntry.count <= 0) {
        const index = this.selectedServices.indexOf(serviceEntry);
        this.selectedServices.splice(index, 1);
      }
    }
    
    this.updateTotalPrice();
  }
  
  getServiceCount(serviceCode: string, service: any): number {
    const isReturn = this.selectedJourneyTab === 'return';
    const serviceEntry = this.selectedServices.find(
      s => s.service.Code === serviceCode && s.service.isReturn === isReturn
    );
    return serviceEntry ? serviceEntry.count : 0;
  }
  
  totalSelectedServices(): number {
    const isReturn = this.selectedJourneyTab === 'return';
    return this.selectedServices
      .filter(s => s.service.isReturn === isReturn)
      .reduce((sum, { count }) => sum + count, 0);
  }
  
  getServiceTotalPrice(): number {
    const isReturn = this.selectedJourneyTab === 'return';
    return this.selectedServices
      .filter(s => s.service.isReturn === isReturn)
      .reduce((sum, { service, count }) => sum + (service.Price || 0) * count, 0);
  }
  
  // Helper Methods
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
  
  updateTotalPrice(): void {
    let total = 0;
    
    // Calculate seat prices
    Object.keys(this.selectedSeats).forEach(index => {
      const seats = this.selectedSeats[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          total += seat.Price || 0;
        });
      }
    });
    
    Object.keys(this.selectedSeatsReturn).forEach(index => {
      const seats = this.selectedSeatsReturn[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          total += seat.Price || 0;
        });
      }
    });
    
    // Calculate meal prices
    Object.keys(this.selectedMeals).forEach(index => {
      const meals = this.selectedMeals[parseInt(index)];
      if (meals && Array.isArray(meals)) {
        meals.forEach(({ meal, count }) => {
          total += (meal.Price || 0) * count;
        });
      }
    });
    
    Object.keys(this.selectedMealsReturn).forEach(index => {
      const meals = this.selectedMealsReturn[parseInt(index)];
      if (meals && Array.isArray(meals)) {
        meals.forEach(({ meal, count }) => {
          total += (meal.Price || 0) * count;
        });
      }
    });
    
    // Calculate service prices
    this.selectedServices.forEach(({ service, count }) => {
      total += (service.Price || 0) * count;
    });
    
    // Add base fare and taxes from flight data
    if (this.fullFlightData) {
      total += (this.fullFlightData.totalBaseFare || 0) + (this.fullFlightData.totalTaxes || 0);
    }
    
    this.totalPrice = total;
  }
  
  openFareSummary(): void {
    this.showFareSummaryModal = true;
  }
  
  closeFareSummary(): void {
    this.showFareSummaryModal = false;
  }
  
  onContinue(): void {
    // Save addon selections to flight data service
    const addonData = {
      seats: {
        onward: this.selectedSeats,
        return: this.selectedSeatsReturn
      },
      meals: {
        onward: this.selectedMeals,
        return: this.selectedMealsReturn
      },
      services: this.selectedServices,
      totalAddonPrice: this.totalPrice - ((this.fullFlightData?.totalBaseFare || 0) + (this.fullFlightData?.totalTaxes || 0))
    };
    
    // Calculate total seat price from addon selections
    let totalSeatPrice = 0;
    Object.keys(this.selectedSeats).forEach(index => {
      const seats = this.selectedSeats[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          totalSeatPrice += seat.Price || 0;
        });
      }
    });
    Object.keys(this.selectedSeatsReturn).forEach(index => {
      const seats = this.selectedSeatsReturn[parseInt(index)];
      if (seats && Array.isArray(seats)) {
        seats.forEach(seat => {
          totalSeatPrice += seat.Price || 0;
        });
      }
    });
    
    // Update flight data with addon selections and preserve ALL existing data
    if (this.fullFlightData) {
      // Preserve all existing data including all fields from final page
      const updatedData = {
        ...this.fullFlightData,
        // Add addon selections
        addonData: addonData,
        totalSeats: totalSeatPrice,
        // Ensure passenger data is preserved
        travellers: this.fullFlightData.travellers || [],
        children: this.fullFlightData.children || [],
        infants: this.fullFlightData.infants || [],
        // Preserve contact and GST details
        contact: this.fullFlightData.contact || {},
        gstDetails: this.fullFlightData.gstDetails || {},
        termsAgreed: this.fullFlightData.termsAgreed || false,
        // Preserve all flight data (in case they're not in fullFlightData)
        tripType: this.fullFlightData.tripType || this.tripType,
        flightSegments: this.fullFlightData.flightSegments || this.flightSegments,
        flightSegmentsReturn: this.fullFlightData.flightSegmentsReturn || this.flightSegmentsReturn,
        totalAdults: this.fullFlightData.totalAdults || this.totalAdults,
        totalChildren: this.fullFlightData.totalChildren || this.totalChildren,
        totalInfants: this.fullFlightData.totalInfants || this.totalInfants,
        seatMap: this.fullFlightData.seatMap || this.seatMap,
        seatMapReturn: this.fullFlightData.seatMapReturn || this.seatMapReturn,
        ssrValues: this.fullFlightData.ssrValues || this.ssrValues,
        ssrValuesReturn: this.fullFlightData.ssrValuesReturn || this.ssrValuesReturn,
        baggageOptions: this.fullFlightData.baggageOptions,
        baggageOptionsReturn: this.fullFlightData.baggageOptionsReturn,
        baggageTotal: this.fullFlightData.baggageTotal,
        baggageTotalReturn: this.fullFlightData.baggageTotalReturn,
        selectedBaggageCounts: this.fullFlightData.selectedBaggageCounts,
        selectedBaggageCountsReturn: this.fullFlightData.selectedBaggageCountsReturn,
        // Preserve individual fare values
        adultBaseFare: this.fullFlightData.adultBaseFare,
        childrenBaseFare: this.fullFlightData.childrenBaseFare,
        infantBaseFare: this.fullFlightData.infantBaseFare,
        adultTaxes: this.fullFlightData.adultTaxes,
        childrenTaxes: this.fullFlightData.childrenTaxes,
        infantTaxes: this.fullFlightData.infantTaxes,
        adultBaseFareReturn: this.fullFlightData.adultBaseFareReturn,
        childrenBaseFareReturn: this.fullFlightData.childrenBaseFareReturn,
        infantBaseFareReturn: this.fullFlightData.infantBaseFareReturn,
        adultTaxesReturn: this.fullFlightData.adultTaxesReturn,
        childrenTaxesReturn: this.fullFlightData.childrenTaxesReturn,
        infantTaxesReturn: this.fullFlightData.infantTaxesReturn,
        tboToken: this.fullFlightData.tboToken,
        traceid: this.fullFlightData.traceid,
        resultIndex: this.fullFlightData.resultIndex,
        resultIndexReturn: this.fullFlightData.resultIndexReturn,
        ipAddress: this.fullFlightData.ipAddress,
        departureFlightData: this.fullFlightData.departureFlightData,
        returnFlightData: this.fullFlightData.returnFlightData,
        mobFinalPageData: this.fullFlightData.mobFinalPageData,
        // Flag to proceed to payment
        proceedToPayment: true
      };
      
      this.flightDataService.setStringValue(updatedData as any);
    }
    
    // Navigate back to final page - it will check for proceedToPayment flag
    this.router.navigate(['/flightfinalsection']);
  }
  
  onSkipToPayment(): void {
    // Skip addons but preserve ALL existing data from final page
    if (this.fullFlightData) {
      const updatedData = {
        ...this.fullFlightData,
        // Preserve all passenger data
        travellers: this.fullFlightData.travellers || [],
        children: this.fullFlightData.children || [],
        infants: this.fullFlightData.infants || [],
        // Preserve contact and GST details
        contact: this.fullFlightData.contact || {},
        gstDetails: this.fullFlightData.gstDetails || {},
        termsAgreed: this.fullFlightData.termsAgreed || false,
        // Preserve all flight data
        tripType: this.fullFlightData.tripType || this.tripType,
        flightSegments: this.fullFlightData.flightSegments || this.flightSegments,
        flightSegmentsReturn: this.fullFlightData.flightSegmentsReturn || this.flightSegmentsReturn,
        totalAdults: this.fullFlightData.totalAdults || this.totalAdults,
        totalChildren: this.fullFlightData.totalChildren || this.totalChildren,
        totalInfants: this.fullFlightData.totalInfants || this.totalInfants,
        // Preserve seat maps and SSR data
        seatMap: this.fullFlightData.seatMap || this.seatMap,
        seatMapReturn: this.fullFlightData.seatMapReturn || this.seatMapReturn,
        ssrValues: this.fullFlightData.ssrValues || this.ssrValues,
        ssrValuesReturn: this.fullFlightData.ssrValuesReturn || this.ssrValuesReturn,
        // Preserve fare data
        totalBaseFare: this.fullFlightData.totalBaseFare,
        totalTaxes: this.fullFlightData.totalTaxes,
        // Preserve baggage data
        baggageOptions: this.fullFlightData.baggageOptions,
        baggageOptionsReturn: this.fullFlightData.baggageOptionsReturn,
        baggageTotal: this.fullFlightData.baggageTotal,
        baggageTotalReturn: this.fullFlightData.baggageTotalReturn,
        selectedBaggageCounts: this.fullFlightData.selectedBaggageCounts,
        selectedBaggageCountsReturn: this.fullFlightData.selectedBaggageCountsReturn,
        // Preserve other totals
        totalSeats: this.fullFlightData.totalSeats || 0,
        totalMealCharges: this.fullFlightData.totalMealCharges || 0,
        totalSpecialServiceCharges: this.fullFlightData.totalSpecialServiceCharges || 0,
        // Preserve individual fare values
        adultBaseFare: this.fullFlightData.adultBaseFare,
        childrenBaseFare: this.fullFlightData.childrenBaseFare,
        infantBaseFare: this.fullFlightData.infantBaseFare,
        adultTaxes: this.fullFlightData.adultTaxes,
        childrenTaxes: this.fullFlightData.childrenTaxes,
        infantTaxes: this.fullFlightData.infantTaxes,
        adultBaseFareReturn: this.fullFlightData.adultBaseFareReturn,
        childrenBaseFareReturn: this.fullFlightData.childrenBaseFareReturn,
        infantBaseFareReturn: this.fullFlightData.infantBaseFareReturn,
        adultTaxesReturn: this.fullFlightData.adultTaxesReturn,
        childrenTaxesReturn: this.fullFlightData.childrenTaxesReturn,
        infantTaxesReturn: this.fullFlightData.infantTaxesReturn,
        // Preserve booking identifiers
        tboToken: this.fullFlightData.tboToken,
        traceid: this.fullFlightData.traceid,
        resultIndex: this.fullFlightData.resultIndex,
        resultIndexReturn: this.fullFlightData.resultIndexReturn,
        ipAddress: this.fullFlightData.ipAddress,
        // Preserve flight data objects
        departureFlightData: this.fullFlightData.departureFlightData,
        returnFlightData: this.fullFlightData.returnFlightData,
        mobFinalPageData: this.fullFlightData.mobFinalPageData,
        // No addon data, but flag to proceed to payment
        proceedToPayment: true,
        addonData: null
      };
      
      this.flightDataService.setStringValue(updatedData as any);
    }
    
    // Navigate back to final page - it will check for proceedToPayment flag
    this.router.navigate(['/flightfinalsection']);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

