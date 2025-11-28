export interface FlightData {
  tboToken: string | null;
  ipAddress: string;
  tripType: 'oneway' | 'round' | 'multi';
  fromCity: string;
  fromAirport: string;
  fromAirportCode: string;
  toCity: string;
  toAirport: string;
  toAirportCode: string;
  departureDate: string;
  returnDate: string | null;
  fareType: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  calendarFareMap?: { [key: string]: any };
  calendarFareMapReturn?: { [key: string]: any };
  multiCityRoutes?: Array<{ from: string; to: string; date: string }>;
  traceid?: string;
  departureFlightData?: any;
  returnFlightData?: any;
}

