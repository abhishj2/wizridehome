import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlightData } from '../interface/flight-data';

@Injectable({
  providedIn: 'root'
})
export class FlightdataService {
  private flightDataSubject = new BehaviorSubject<FlightData | null>(null);
  public currentMessage: Observable<FlightData | null> = this.flightDataSubject.asObservable();

  constructor() {
    // Try to load from localStorage on service initialization
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('flightSearchData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          this.flightDataSubject.next(parsedData);
        } catch (error) {
          // console.error('Error parsing flight data from localStorage:', error);
        }
      }
    }
  }

  setStringValue(data: FlightData): void {
    this.flightDataSubject.next(data);
    // Also store in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('flightSearchData', JSON.stringify(data));
    }
  }

  getCurrentValue(): FlightData | null {
    return this.flightDataSubject.value;
  }

  clearData(): void {
    this.flightDataSubject.next(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('flightSearchData');
    }
  }
}

