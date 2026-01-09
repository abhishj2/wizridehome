import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FareDetails {
  baseFare: { label: string; count: number; amount: number }[];
  taxes: { label: string; count: number; amount: number }[];
  baggageCharges: { label: string; amount: number }[];
  mealCharges: number;
  seatCharges : number;
  specialServiceCharges : number;
  totalAmount: number;
}

@Component({
  selector: 'app-flightmobfaresummary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flightmobfaresummary.component.html',
  styleUrls: ['./flightmobfaresummary.component.css']
})
export class FlightmobfaresummaryComponent implements OnInit{
  // @Input() tripType: 'oneway' | 'roundtrip' = 'roundtrip';
  @Input() tripType: string = '';
  @Input() onwardFare?: FareDetails | null;
  @Input() returnFare?: FareDetails | null;
  @Input() isInternationalRound: boolean = false;
  selectedTab: 'onward' | 'return' = 'onward';



  ngOnInit(): void {
    console.log('📦 tripType:', this.tripType);
    console.log('🎯 isInternationalRound:', this.isInternationalRound);
    console.log('🧳 Onward Fare:', JSON.stringify(this.onwardFare, null, 2));
    console.log('🔁 Return Fare:', JSON.stringify(this.returnFare, null, 2));
  }
  getBaggageTotal(fare: FareDetails | null | undefined): number {
    if (!fare) return 0;
    return fare.baggageCharges.reduce((sum, item) => sum + item.amount, 0);
  }

  get currentFare(): FareDetails | null | undefined {
    return this.selectedTab === 'onward' ? this.onwardFare : this.returnFare;
  }

  switchTab(tab: 'onward' | 'return') {
    this.selectedTab = tab;
  }

  calculateSubtotal(items: { count?: number; amount: number }[]) {
    return items.reduce((sum, item) => {
      return sum + (item.count ?? 1) * item.amount;
    }, 0);
  }
  isInternationalRoundtrip(): boolean {
    return this.isInternationalRound;
    // Modify if you use specific flags or routes
    // return this.tripType === 'roundtrip' && this.onwardFare && this.returnFare;
  }

  
}

