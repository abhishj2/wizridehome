import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiserviceService } from './apiservice.service';
import Swal from 'sweetalert2';

interface Seat {
  Code: string;
  Price: number;
  SeatNo: string;
  isAvailable: boolean;
  priceCategory: string;
  displaySeatNo: string;
  Origin: string;
  Destination: string;
  FlightNumber: string;
  SeatWayType?: number;
  Description?: any;
  [key: string]: any; // For additional properties
}

interface SeatData {
  Code: string;
  SeatNo: string;
  RowNo?: string;
  Price?: number | string;
  AvailablityType?: number | string;
  [key: string]: any;
}

interface RowSeat {
  Seats?: SeatData[];
  [key: string]: any;
}

interface SelectedSeatFinal {
  passengerIndex: number;
  segmentIndex: number;
  seat: Seat;
  isReturn: boolean;
  WayType: number;
  Description: any;
}

interface Meal {
  Code: string;
  Description: string;
  Price: number;
  FlightNumber: string;
  Origin: string;
  Destination: string;
  Quantity?: number;
  AirlineDescription?: string;
  AirlineCode?: string;
  WayType?: number;
  [key: string]: any;
}

interface SelectedMealFinal {
  passengerIndex: number;
  segmentIndex: number;
  meal: Meal;
  isReturn: boolean;
  WayType: number;
  Description: any;
}

interface Baggage {
  code: string;
  kgs: number;
  price: number;
  Currency: string;
  AirlineCode: string;
  FlightNumber: string;
  Origin: string;
  Destination: string;
}

interface SelectedBaggageFinal {
  passengerIndex: number;
  baggage: Baggage;
  isReturn: boolean;
  WayType: number;
  Description: string;
}

interface Service {
  Code: string;
  Description: string;
  Price: number;
  FlightNumber: string;
  Origin: string;
  Destination: string;
  AirlineCode?: string;
  WayType?: number;
  Currency?: string;
  isReturn?: boolean;
  [key: string]: any;
}

interface SelectedService {
  service: Service;
  count: number;
  passengerIndex: number;
}

interface SelectedServiceFinal {
  passengerIndex: number;
  segmentIndex : number;
  service: Service;
  isReturn: boolean;
  WayType: number;
  Description: any;
}

@Injectable({
  providedIn: 'root'
})
export class FlightaddonsService 
{
  // State for seats
  seatMap: any[] = [];
  seatMapReturn: any[] = [];
  selectedSeats: { [segmentIndex: number]: any[] } = {};
  selectedSeatsReturn: { [segmentIndex: number]: any[] } = {};
  // selectedSeatsFinal: { passengerIndex: number; segmentIndex: number; seat: any; isReturn: boolean; WayType: number; 
  //   Description: any }[] = [];
  selectedSeatsFinal: SelectedSeatFinal[] = [];
  hasSeatsAvailable: boolean[] = [];
  hasSeatsAvailableReturn: boolean[] = [];
  totalSeats: number = 0;
  priceCategories: { min: number; max: number; category: string }[] = [];

  // State for meals
  selectedMeals: any[][] = [];
  selectedMealsReturn: any[][] = [];
  // selectedMealsFinal: { passengerIndex: number; segmentIndex: number; meal: any; isReturn: boolean; WayType: number; Description: any }[] = [];
  selectedMealsFinal: SelectedMealFinal[] = [];
  totalMealCharges: number = 0;

  // State for special services
  // processedSpecialServicesOnward: any[] = [];
  // processedSpecialServicesReturn: any[] = [];
  // selectedSpecialServicesFinalOnward: any[] = [];
  // selectedSpecialServicesFinalReturn: any[] = [];

  // State for special services (journey-wide)
  // selectedServices: { service: any; count: number }[] = [];
  // selectedServicesFinal: { passengerIndex: number; service: any; isReturn: boolean; WayType: number; Description: any }[] = [];
  selectedServices: SelectedService[] = [];
  selectedServicesFinal: SelectedServiceFinal[] = [];
  totalSpecialServiceCharges: number = 0;
  
  private selectedBaggageFinal: SelectedBaggageFinal[] = [];

  // Passenger counts
  private totalAdults: number = 0;
  private totalChildren: number = 0;

  // Aircraft seat config
  private readonly aircraftSeatMapConfig: { [key: string]: { layout: string; blocks: number[][] } } = {
    '737': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '738': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '73H': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '7M8': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '320': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '321': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '319': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '223': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    '221': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    '717': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    'E75': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
    'E95': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
    '77W': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '772': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '789': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '788': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '333': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
    '332': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
    '359': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '748': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '388': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] }
  };

  private subscriptions: Subscription = new Subscription();

  constructor(private apiService: ApiserviceService) {}

  // Add property
  private totalInfants: number = 0;

  // Update setPassengerCounts
  setPassengerCounts(adults: number, children: number, infants: number): void {
    this.totalAdults = adults;
    this.totalChildren = children;
    this.totalInfants = infants;
  }

  // // Fetch SSR data for add-ons
  // fetchSSR(ipAddress: string, tboToken: string, traceId: string, resultIndex: string, isReturn: boolean = false): Observable<any> {
  //   return this.apiService.getSSR(ipAddress, tboToken, traceId, resultIndex);
  // }

  // Process SSR data
  // processSSRData(ssrData: any, flightSegments: any[], isReturn: boolean = false): void {
  //   console.log(`Processing SSR Data (${isReturn ? 'Return' : 'Outbound'}):`, ssrData);
  //   if (ssrData?.Response?.Baggage) {
  //     // Baggage processing can be added here if needed in the future
  //   }
  //   this.processMeals(ssrData, flightSegments, isReturn);
  //   this.parseSeatData(ssrData, flightSegments, isReturn);
  //   this.processSpecialServices(ssrData?.Response?.SpecialServices || [], isReturn ? 'return' : 'onward');
  // }

  processSSRData(ssrData: any, flightSegments: any[], isReturn: boolean = false): {
    mealSegments: any[];
    seatData: ReturnType<FlightaddonsService['generateSeatMapData']>;
    services: any[];
  } {
    console.log(`Processing SSR Data (${isReturn ? 'Return' : 'Outbound'}):`, ssrData);
  
    console.log(`Processing SSR Data (${isReturn ? 'Return' : 'Outbound'}):`, ssrData);

const mealSegments = this.processMeals(ssrData, flightSegments, isReturn);
const seatData = this.generateSeatMapData(ssrData);
const services = this.processServices(ssrData?.Response?.SpecialServices || [], flightSegments, isReturn);

// Map services with isReturn explicitly added
const mappedServices = services.map(service => ({
  service: { ...service, isReturn }, // Ensure this is always present!
  count: 0,
  passengerIndex: 0
}));

if (isReturn) {
  this.seatMapReturn = seatData.seatMaps;
  this.selectedSeatsReturn = seatData.selectedSeats;
  this.hasSeatsAvailableReturn = seatData.hasSeatsAvailable;
  this.selectedMealsReturn = Array(flightSegments.length).fill([]);

  this.selectedServices = [
    ...this.selectedServices.filter(s => s.service?.isReturn !== true), // remove prior return services if any
    ...mappedServices
  ];
} else {
  this.seatMap = seatData.seatMaps;
  this.selectedSeats = seatData.selectedSeats;
  this.hasSeatsAvailable = seatData.hasSeatsAvailable;
  this.selectedMeals = Array(flightSegments.length).fill([]);

  this.selectedServices = [
    ...this.selectedServices.filter(s => s.service?.isReturn !== false), // remove prior onward services if any
    ...mappedServices
  ];
}

this.priceCategories = seatData.priceCategories;
  
    this.priceCategories = seatData.priceCategories;
  
    return {
      mealSegments,
      seatData,
      services
    };
  }

  // Process meals
  // processMeals(ssr: any, segments: any[], isReturn: boolean) {
  //   const mealDynamicArray = ssr?.Response?.MealDynamic?.flat() || [];
  //   const mealArray = ssr?.Response?.Meal?.flat() || [];
  //   const combinedMealsBySegment: any[][] = Array(segments.length).fill(null).map(() => []);

  //   mealDynamicArray.forEach((meal: any, index: number) => {
  //     const segmentIndex = Math.floor(index / (mealDynamicArray.length / segments.length));
  //     if (!combinedMealsBySegment[segmentIndex]) {
  //       combinedMealsBySegment[segmentIndex] = [];
  //     }
  //     if (meal.Code !== 'NoMeal') {
  //       combinedMealsBySegment[segmentIndex].push({
  //         ...meal,
  //         Description: meal.Description
  //       });
  //     }
  //   });

  //   mealArray.forEach((meal: any, index: number) => {
  //     const segmentIndex = Math.floor(index / (mealArray.length / segments.length));
  //     if (!combinedMealsBySegment[segmentIndex]) {
  //       combinedMealsBySegment[segmentIndex] = [];
  //     }
  //     if (meal.Code !== 'NoMeal') {
  //       const segment = segments[segmentIndex];
  //       const flightNumber = segment.code.split(' ')[1];
  //       combinedMealsBySegment[segmentIndex].push({
  //         ...meal,
  //         Price: 0,
  //         FlightNumber: flightNumber,
  //         Origin: segment.originCode,
  //         Destination: segment.destinationCode
  //       });
  //     }
  //   });

  //   const updatedSegments = segments.map((segment, index) => {
  //     const flightCodeParts = segment.code.split(' ');
  //     const flightNumber = flightCodeParts[1];
  //     const matchingMeals = (combinedMealsBySegment[index] || []).filter(
  //       (meal: any) =>
  //         meal.FlightNumber === flightNumber &&
  //         meal.Origin === segment.originCode &&
  //         meal.Destination === segment.destinationCode &&
  //         meal.Code !== 'NoMeal'
  //     );

  //     return {
  //       ...segment,
  //       mealOptions: matchingMeals.map((meal: any) => ({
  //         Code: meal.Code,
  //         Description: meal.Description,
  //         Price: meal.Price || 0,
  //         FlightNumber: meal.FlightNumber,
  //         Origin: meal.Origin,
  //         Destination: meal.Destination,
  //         Quantity: meal.Quantity,
  //         AirlineDescription: meal.AirlineDescription,
  //         AirlineCode: meal.AirlineCode,
  //         WayType: meal.WayType
  //       }))
  //     };
  //   });

  //   if (isReturn) {
  //     this.selectedMealsReturn = Array(segments.length).fill([]);
  //   } else {
  //     this.selectedMeals = Array(segments.length).fill([]);
  //   }

  //   return updatedSegments;
  // }

// In FlightaddonsService

// processMeals(ssr: any, segments: any[], isReturn: boolean) {
//   const mealDynamicArray = ssr?.Response?.MealDynamic?.flat() || [];
//   const mealArray = ssr?.Response?.Meal?.flat() || [];
//   const combinedMealsBySegment: any[][] = Array(segments.length).fill(null).map(() => []);

//   // Group meals by segment based on FlightNumber, Origin, and Destination
//   segments.forEach((segment, segmentIndex) => {
//     const flightNumber = segment.code.split(' ')[1]; // e.g., "6288"
//     const origin = segment.originCode; // e.g., "MAA"
//     const destination = segment.destinationCode; // e.g., "BLR"

//     // Process MealDynamic
//     const matchingDynamicMeals = mealDynamicArray.filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === origin &&
//         meal.Destination === destination &&
//         meal.Code !== 'NoMeal'
//     );

//     matchingDynamicMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references
//       combinedMealsBySegment[segmentIndex].push({
//         ...JSON.parse(JSON.stringify(meal)),
//         Description: meal.Description
//       });
//     });

//     // Process Meal
//     const matchingMeals = mealArray.filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === origin &&
//         meal.Destination === destination &&
//         meal.Code !== 'NoMeal'
//     );

//     matchingMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references
//       combinedMealsBySegment[segmentIndex].push({
//         ...JSON.parse(JSON.stringify(meal)),
//         Price: 0,
//         FlightNumber: flightNumber,
//         Origin: origin,
//         Destination: destination
//       });
//     });
//   });

//   // Map segments with meal options
//   const updatedSegments = segments.map((segment, index) => {
//     const flightCodeParts = segment.code.split(' ');
//     const flightNumber = flightCodeParts[1];
//     const matchingMeals = (combinedMealsBySegment[index] || []).filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === segment.originCode &&
//         meal.Destination === segment.destinationCode &&
//         meal.Code !== 'NoMeal'
//     );

//     return {
//       ...segment,
//       mealOptions: matchingMeals.map((meal: any) => ({
//         Code: meal.Code,
//         Description: meal.Description,
//         Price: meal.Price || 0,
//         FlightNumber: meal.FlightNumber,
//         Origin: meal.Origin,
//         Destination: meal.Destination,
//         Quantity: meal.Quantity,
//         AirlineDescription: meal.AirlineDescription,
//         AirlineCode: meal.AirlineCode,
//         WayType: meal.WayType
//       }))
//     };
//   });

//   // Initialize selectedMeals or selectedMealsReturn
//   if (isReturn) {
//     this.selectedMealsReturn = Array(segments.length).fill([]).map(() => []);
//   } else {
//     this.selectedMeals = Array(segments.length).fill([]).map(() => []);
//   }

//   // Debug log to verify meal assignments
//   console.log(`Processed Meals (${isReturn ? 'Return' : 'Onward'}):`, updatedSegments.map(s => s.mealOptions));

//   return updatedSegments;
// }

// processMeals(ssr: any, segments: any[], isReturn: boolean) {
//   const mealDynamicArray = ssr?.Response?.MealDynamic?.flat() || [];
//   const mealArray = ssr?.Response?.Meal?.flat() || [];
//   const combinedMealsBySegment: any[][] = Array(segments.length).fill(null).map(() => []);

//   // Group meals by segment based on FlightNumber, Origin, and Destination
//   segments.forEach((segment, segmentIndex) => {
//     const flightNumber = segment.code.split(' ')[1]; // e.g., "6288"
//     const origin = segment.originCode; // e.g., "MAA"
//     const destination = segment.destinationCode; // e.g., "BLR"

//     // Process MealDynamic (segment-specific meals)
//     const matchingDynamicMeals = mealDynamicArray.filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === origin &&
//         meal.Destination === destination &&
//         meal.Code !== 'NoMeal'
//     );

//     matchingDynamicMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references
//       combinedMealsBySegment[segmentIndex].push({
//         ...JSON.parse(JSON.stringify(meal)),
//         Description: meal.Description
//       });
//     });

//     // Process Meal (general meals, apply to all segments if no FlightNumber/Origin/Destination)
//     const matchingMeals = mealArray.filter(
//       (meal: any) =>
//         meal.Code !== 'NoMeal' &&
//         // Only filter by segment-specific fields if they exist
//         (!meal.FlightNumber || meal.FlightNumber === flightNumber) &&
//         (!meal.Origin || meal.Origin === origin) &&
//         (!meal.Destination || meal.Destination === destination)
//     );

//     matchingMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references
//       combinedMealsBySegment[segmentIndex].push({
//         ...JSON.parse(JSON.stringify(meal)),
//         Price: 0,
//         FlightNumber: flightNumber,
//         Origin: origin,
//         Destination: destination
//       });
//     });
//   });

//   // Map segments with meal options
//   const updatedSegments = segments.map((segment, index) => {
//     const flightCodeParts = segment.code.split(' ');
//     const flightNumber = flightCodeParts[1];
//     const matchingMeals = (combinedMealsBySegment[index] || []).filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === segment.originCode &&
//         meal.Destination === segment.destinationCode &&
//         meal.Code !== 'NoMeal'
//     );

//     return {
//       ...segment,
//       mealOptions: matchingMeals.map((meal: any) => ({
//         Code: meal.Code,
//         Description: meal.Description,
//         Price: meal.Price || 0,
//         FlightNumber: meal.FlightNumber,
//         Origin: meal.Origin,
//         Destination: meal.Destination,
//         Quantity: meal.Quantity,
//         AirlineDescription: meal.AirlineDescription,
//         AirlineCode: meal.AirlineCode,
//         WayType: meal.WayType
//       }))
//     };
//   });

//   // Initialize selectedMeals or selectedMealsReturn
//   if (isReturn) {
//     this.selectedMealsReturn = Array(segments.length).fill([]).map(() => []);
//   } else {
//     this.selectedMeals = Array(segments.length).fill([]).map(() => []);
//   }

//   // Debug log to verify meal assignments
//   console.log(`Processed Meals (${isReturn ? 'Return' : 'Onward'}):`, updatedSegments.map(s => s.mealOptions));

//   return updatedSegments;
// }

// processMeals(ssr: any, segments: any[], isReturn: boolean) {
//   const mealDynamicArray = ssr?.Response?.MealDynamic?.flat() || [];
//   const mealArray = ssr?.Response?.Meal?.flat() || [];
//   const combinedMealsBySegment: any[][] = Array(segments.length).fill(null).map(() => []);

//   // Group meals by segment based on FlightNumber, Origin, and Destination
//   segments.forEach((segment, segmentIndex) => {
//     const flightNumber = segment.code.split(' ')[1]; // e.g., "321"
//     const origin = segment.originCode; // e.g., "MAA"
//     const destination = segment.destinationCode; // e.g., "CCU"

//     // Process MealDynamic (segment-specific meals)
//     const matchingDynamicMeals = mealDynamicArray.filter(
//       (meal: any) =>
//         meal.FlightNumber === flightNumber &&
//         meal.Origin === origin &&
//         meal.Destination === destination &&
//         meal.Code !== 'NoMeal'
//     );

//     matchingDynamicMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references, copy all fields
//       combinedMealsBySegment[segmentIndex].push(JSON.parse(JSON.stringify(meal)));
//     });

//     // Process Meal (general meals, apply to all segments)
//     const matchingMeals = mealArray.filter(
//       (meal: any) => meal.Code !== 'NoMeal'
//     );

//     matchingMeals.forEach((meal: any) => {
//       if (!combinedMealsBySegment[segmentIndex]) {
//         combinedMealsBySegment[segmentIndex] = [];
//       }
//       // Deep clone to avoid shared references, only include Code and Description
//       combinedMealsBySegment[segmentIndex].push({
//         Code: meal.Code,
//         Description: meal.Description
//       });
//     });
//   });

//   // Map segments with meal options
//   const updatedSegments = segments.map((segment, index) => {
//     const flightCodeParts = segment.code.split(' ');
//     const flightNumber = flightCodeParts[1];
//     const matchingMeals = (combinedMealsBySegment[index] || []).filter(
//       (meal: any) => meal.Code !== 'NoMeal'
//     );

//     return {
//       ...segment,
//       mealOptions: matchingMeals.map((meal: any) => {
//         // For MealDynamic, copy all fields; for Meal, only Code and Description
//         if (mealArray.some((m: any) => m.Code === meal.Code && m.Description === meal.Description)) {
//           // Meal item
//           return {
//             Code: meal.Code,
//             Description: meal.Description
//           };
//         } else {
//           // MealDynamic item
//           return {
//             Code: meal.Code,
//             Description: meal.Description,
//             Price: meal.Price,
//             FlightNumber: meal.FlightNumber,
//             Origin: meal.Origin,
//             Destination: meal.Destination,
//             Quantity: meal.Quantity,
//             AirlineDescription: meal.AirlineDescription,
//             AirlineCode: meal.AirlineCode,
//             WayType: meal.WayType,
//             Currency: meal.Currency
//           };
//         }
//       })
//     };
//   });

//   // Initialize selectedMeals or selectedMealsReturn
//   if (isReturn) {
//     this.selectedMealsReturn = Array(segments.length).fill([]).map(() => []);
//   } else {
//     this.selectedMeals = Array(segments.length).fill([]).map(() => []);
//   }

//   // Debug log to verify meal assignments
//   console.log(`Processed Meals (${isReturn ? 'Return' : 'Onward'}):`, updatedSegments.map(s => s.mealOptions));

//   return updatedSegments;
// }
processMeals(ssr: any, segments: any[], isReturn: boolean) {
  const mealDynamicArray = ssr?.Response?.MealDynamic?.flat() || [];
  const mealArray = ssr?.Response?.Meal?.flat() || [];
  const combinedMealsBySegment: any[][] = Array(segments.length).fill(null).map(() => []);

  // Group meals by segment based on FlightNumber, Origin, and Destination
  segments.forEach((segment, segmentIndex) => {
    const flightNumber = segment.code.split(' ')[1]; // e.g., "321"
    const origin = segment.originCode; // e.g., "MAA"
    const destination = segment.destinationCode; // e.g., "CCU"

    // Process MealDynamic (segment-specific meals)
    const matchingDynamicMeals = mealDynamicArray.filter(
      (meal: any) =>
        meal.FlightNumber === flightNumber &&
        meal.Origin === origin &&
        meal.Destination === destination &&
        meal.Code !== 'NoMeal'
    );

    matchingDynamicMeals.forEach((meal: any) => {
      if (!combinedMealsBySegment[segmentIndex]) {
        combinedMealsBySegment[segmentIndex] = [];
      }
      // Deep clone to avoid shared references, copy all fields
      combinedMealsBySegment[segmentIndex].push(JSON.parse(JSON.stringify(meal)));
    });

    // Process Meal (general meals, apply only to the first segment)
    if (segmentIndex === 0) {
      mealArray.filter(
        (meal: any) => meal.Code !== 'NoMeal'
      ).forEach((meal: any) => {
        if (!combinedMealsBySegment[segmentIndex]) {
          combinedMealsBySegment[segmentIndex] = [];
        }
        // Deep clone to avoid shared references, only include Code and Description
        combinedMealsBySegment[segmentIndex].push({
          Code: meal.Code,
          Description: meal.Description
        });
      });
    }
  });

  // Map segments with meal options
  const updatedSegments = segments.map((segment, index) => {
    const flightCodeParts = segment.code.split(' ');
    const flightNumber = flightCodeParts[1];
    const matchingMeals = (combinedMealsBySegment[index] || []).filter(
      (meal: any) => meal.Code !== 'NoMeal'
    );

    return {
      ...segment,
      mealOptions: matchingMeals.map((meal: any) => {
        // For MealDynamic, copy all fields; for Meal, only Code and Description
        if (mealArray.some((m: any) => m.Code === meal.Code && m.Description === meal.Description)) {
          // Meal item
          return {
            Code: meal.Code,
            Description: meal.Description
          };
        } else {
          // MealDynamic item
          return {
            Code: meal.Code,
            Description: meal.Description,
            Price: meal.Price,
            FlightNumber: meal.FlightNumber,
            Origin: meal.Origin,
            Destination: meal.Destination,
            Quantity: meal.Quantity,
            AirlineDescription: meal.AirlineDescription,
            AirlineCode: meal.AirlineCode,
            WayType: meal.WayType,
            Currency: meal.Currency
          };
        }
      })
    };
  });

  // Initialize selectedMeals or selectedMealsReturn
  if (isReturn) {
    this.selectedMealsReturn = Array(segments.length).fill([]).map(() => []);
  } else {
    this.selectedMeals = Array(segments.length).fill([]).map(() => []);
  }

  // Debug log to verify meal assignments
  console.log(`Processed Meals (${isReturn ? 'Return' : 'Onward'}):`, updatedSegments.map(s => s.mealOptions));

  return updatedSegments;
}

// processServices(rawSSR: any[], segments: any[], isReturn: boolean): any[] {
//   const finalServices = this.extractSpecialServices(rawSSR);

//   // Use the first and last segment to determine journey origin and destination
//   const origin = segments[0]?.originCode;
//   const destination = segments[segments.length - 1]?.destinationCode;

//   const services = finalServices.filter(
//     (service: any) => service.Origin === origin && service.Destination === destination
//   ).map(service => ({
//     Code: service.Code,
//     Description: service.Text || service.Description,
//     Price: service.Price || 0,
//     FlightNumber: service.FlightNumber,
//     Origin: service.Origin,
//     Destination: service.Destination,
//     AirlineCode: service.AirlineCode,
//     WayType: service.WayType || this.getWayType(origin, destination),
//     Currency: service.Currency
//   }));

//   console.log(`Processed Services (${isReturn ? 'Return' : 'Onward'}):`, services);
//   return services;
// }

// Updated processServices
// processServices(rawSSRServices: any[], segments: any[], isReturn: boolean): Service[] {
//   const finalServices = this.extractSpecialServices(rawSSRServices);
//   const origin = segments[0]?.originCode;
//   const destination = segments[segments.length - 1]?.destinationCode;

//   const services = finalServices
//     .filter(
//       (service: any) => service.Origin === origin && service.Destination === destination
//     )
//     .map(service => ({
//       Code: service.Code,
//       Description: service.Text || service.Description,
//       Price: service.Price || 0,
//       FlightNumber: service.FlightNumber,
//       Origin: service.Origin,
//       Destination: service.Destination,
//       AirlineCode: service.AirlineCode,
//       WayType: service.WayType || this.getWayType(service.Origin, service.Destination),
//       Currency: service.Currency,
//       isReturn
//     }));

//   console.log(`Processed Services (${isReturn ? 'Return' : 'Onward'}):`, services);
//   if (!this.selectedServices.length || isReturn) {
//    this.selectedServices = [
//   ...this.selectedServices,
//   ...services.map(service => ({
//     service: { ...service, isReturn }, // Move `isReturn` here
//     count: 0,
//     passengerIndex: 0
//   }))
// ];
//   }

//   return services;
// }
processServices(rawSSRServices: any[], segments: any[], isReturn: boolean): Service[] {
  const finalServices = this.extractSpecialServices(rawSSRServices);
  const origin = segments[0]?.originCode;
  const destination = segments[segments.length - 1]?.destinationCode;

  if (!origin || !destination) {
    console.warn('processServices: Origin or destination missing.');
    return [];
  }

  const services = finalServices
    .filter(
      (service: any) => service.Origin === origin && service.Destination === destination
    )
    .map(service => ({
      Code: service.Code,
      Description: service.Text || service.Description,
      Price: service.Price || 0,
      FlightNumber: service.FlightNumber,
      Origin: service.Origin,
      Destination: service.Destination,
      AirlineCode: service.AirlineCode,
      WayType: service.WayType || this.getWayType(service.Origin, service.Destination),
      Currency: service.Currency,
      isReturn
    }));

  // Preserve existing selected services
  const existingSelected = this.selectedServices.filter(s => s.service.isReturn === isReturn);

  // Only append new services that aren't already in selectedServices
  const existingServiceCodes = new Set(
    this.selectedServices
      .filter(s => s.service.isReturn === isReturn)
      .map(s => s.service.Code)
  );

  const newServices = services
    .filter(service => !existingServiceCodes.has(service.Code))
    .map(service => ({
      service: { ...service, isReturn },
      count: 0,
      passengerIndex: 0
    }));

  this.selectedServices = [
    ...this.selectedServices.filter(s => s.service.isReturn !== isReturn),
    ...existingSelected,
    ...newServices
  ];

  console.log(`Processed Services (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(services)));
  console.log('Updated selectedServices after processServices:', JSON.parse(JSON.stringify(this.selectedServices)));

  return services;
}

  // Increment meal selection
  // incrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false, activeMealIndex: number): void {
  //   if (segmentIndex !== activeMealIndex) return;

  //   const maxMealsPerSegment = this.totalAdults + this.totalChildren;
  //   const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
  //   if (!selected[segmentIndex]) {
  //     selected[segmentIndex] = [];
  //   }

  //   const totalSelected = selected[segmentIndex].reduce((sum, { meal, count }) => sum + count, 0);
  //   if (totalSelected >= maxMealsPerSegment) {
  //     console.warn(`Cannot select more than ${maxMealsPerSegment} meals in this segment.`);
  //     return;
  //   }

  //   const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
  //   if (mealIndex === -1) {
  //     selected[segmentIndex].push({ meal: { ...meal }, count: 1 });
  //     meal.count = 1;
  //   } else {
  //     selected[segmentIndex][mealIndex].count++;
  //     meal.count = selected[segmentIndex][mealIndex].count;
  //   }

  //   this.updateSelectedMealsFinal(isReturn);
  //   this.updateTotalMealCharges();
  // }

  // Decrement meal selection
  // decrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false, activeMealIndex: number): void {
  //   if (segmentIndex !== activeMealIndex) return;

  //   const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
  //   if (!selected[segmentIndex]) return;

  //   const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
  //   if (mealIndex === -1 || selected[segmentIndex][mealIndex].count <= 0) return;

  //   selected[segmentIndex][mealIndex].count--;
  //   if (selected[segmentIndex][mealIndex].count === 0) {
  //     selected[segmentIndex].splice(mealIndex, 1);
  //     meal.count = 0;
  //   } else {
  //     meal.count = selected[segmentIndex][mealIndex].count;
  //   }

  //   this.updateSelectedMealsFinal(isReturn);
  //   this.updateTotalMealCharges();
  // }

  // In FlightaddonsService

// In FlightaddonsService

// In FlightaddonsService

// incrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false): void {
//   const maxMealsPerSegment = this.totalAdults + this.totalChildren;
//   const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
//   const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const segment = flightSegments[segmentIndex];

//   // Debug log for input parameters
//   console.log(`incrementMeal called with segmentIndex: ${segmentIndex}, isReturn: ${isReturn}, meal:`, meal);

//   // Validate meal belongs to the segment
//   const flightNumber = segment.code.split(' ')[1];
//   if (
//     meal.FlightNumber !== flightNumber ||
//     meal.Origin !== segment.originCode ||
//     meal.Destination !== segment.destinationCode
//   ) {
//     console.warn(
//       `Meal ${meal.Code} does not belong to segment ${segmentIndex} (${flightNumber}, ${segment.originCode}-${segment.destinationCode}). Expected: ${meal.FlightNumber}, ${meal.Origin}-${meal.Destination}`
//     );
//     return;
//   }

//   // Initialize segment array if undefined
//   if (!selected[segmentIndex]) {
//     selected[segmentIndex] = [];
//   }

//   // Clear invalid meals for other segments
//   selected.forEach((segmentMeals, idx) => {
//     if (idx !== segmentIndex) {
//       selected[idx] = segmentMeals.filter(m => {
//         const seg = flightSegments[idx];
//         const segFlightNumber = seg.code.split(' ')[1];
//         return (
//           m.meal.FlightNumber === segFlightNumber &&
//           m.meal.Origin === seg.originCode &&
//           m.meal.Destination === seg.destinationCode
//         );
//       });
//     }
//   });

//   const totalSelected = selected[segmentIndex].reduce((sum, { meal: m, count }) => sum + count, 0);
//   if (totalSelected >= maxMealsPerSegment) {
//     console.warn(`Cannot select more than ${maxMealsPerSegment} meals in this segment.`);
//     return;
//   }

//   const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
//   if (mealIndex === -1) {
//     // Deep clone meal to avoid shared reference
//     selected[segmentIndex].push({ meal: { ...JSON.parse(JSON.stringify(meal)) }, count: 1 });
//   } else {
//     selected[segmentIndex][mealIndex].count++;
//   }

//   this.updateSelectedMealsFinal(isReturn);
//   this.updateTotalMealCharges();

//   console.log(`After increment (${isReturn ? 'Return' : 'Onward'}, Segment ${segmentIndex}):`, selected);
// }

// // In FlightaddonsService

// // In FlightaddonsService

// decrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false): void {
//   const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
//   const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const segment = flightSegments[segmentIndex];

//   // Debug log for input parameters
//   console.log(`decrementMeal called with segmentIndex: ${segmentIndex}, isReturn: ${isReturn}, meal:`, meal);

//   // Validate meal belongs to the segment
//   const flightNumber = segment.code.split(' ')[1];
//   if (
//     meal.FlightNumber !== flightNumber ||
//     meal.Origin !== segment.originCode ||
//     meal.Destination !== segment.destinationCode
//   ) {
//     console.warn(
//       `Meal ${meal.Code} does not belong to segment ${segmentIndex} (${flightNumber}, ${segment.originCode}-${segment.destinationCode}). Expected: ${meal.FlightNumber}, ${meal.Origin}-${meal.Destination}`
//     );
//     return;
//   }

//   if (!selected[segmentIndex]) return;

//   const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
//   if (mealIndex === -1 || selected[segmentIndex][mealIndex].count <= 0) return;

//   selected[segmentIndex][mealIndex].count--;
//   if (selected[segmentIndex][mealIndex].count === 0) {
//     selected[segmentIndex].splice(mealIndex, 1);
//   }

//   // Clear invalid meals for other segments
//   selected.forEach((segmentMeals, idx) => {
//     if (idx !== segmentIndex) {
//       selected[idx] = segmentMeals.filter(m => {
//         const seg = flightSegments[idx];
//         const segFlightNumber = seg.code.split(' ')[1];
//         return (
//           m.meal.FlightNumber === segFlightNumber &&
//           m.meal.Origin === seg.originCode &&
//           m.meal.Destination === seg.destinationCode
//         );
//       });
//     }
//   });

//   this.updateSelectedMealsFinal(isReturn);
//   this.updateTotalMealCharges();

//   console.log(`After decrement (${isReturn ? 'Return' : 'Onward'}, Segment ${segmentIndex}):`, selected);
// }


//   // In FlightaddonsService

// // In FlightaddonsService

// private updateSelectedMealsFinal(isReturn: boolean): void {
//   // Filter out existing meals for the given isReturn value
//   this.selectedMealsFinal = this.selectedMealsFinal.filter(m => m.isReturn !== isReturn);

//   const segments = isReturn ? this.selectedMealsReturn : this.selectedMeals;
//   const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();

//   // Iterate over each segment
//   segments.forEach((segmentMeals, segmentIndex) => {
//     const segment = flightSegments[segmentIndex];
//     const flightNumber = segment.code.split(' ')[1];
//     let passengerIndex = 0;

//     segmentMeals.forEach(({ meal, count }) => {
//       // Validate meal belongs to the segment
//       if (
//         meal.FlightNumber !== flightNumber ||
//         meal.Origin !== segment.originCode ||
//         meal.Destination !== segment.destinationCode
//       ) {
//         console.warn(`Skipping meal ${meal.Code} for segment ${segmentIndex} as it does not match segment details`);
//         return;
//       }

//       // Deep clone meal to avoid shared references
//       const mealCopy = { ...JSON.parse(JSON.stringify(meal)) };
//       for (let i = 0; i < count; i++) {
//         if (passengerIndex < (this.totalAdults + this.totalChildren)) {
//           this.selectedMealsFinal.push({
//             passengerIndex,
//             segmentIndex,
//             meal: mealCopy,
//             isReturn,
//             WayType: meal.WayType || this.getWayType(segment.originCode, segment.destinationCode),
//             Description: meal.Description || 2
//           });
//           passengerIndex++;
//         }
//       }
//     });
//   });

//   // Debug log to verify selectedMealsFinal
//   console.log('Updated selectedMealsFinal:', this.selectedMealsFinal);
// }

incrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false): void {
  const maxMealsPerSegment = this.totalAdults + this.totalChildren;
  const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
  const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
  const segment = flightSegments[segmentIndex];

  // Debug log for input parameters
  console.log(`incrementMeal called with segmentIndex: ${segmentIndex}, isReturn: ${isReturn}, meal:`, meal);

  // Validate meal belongs to the segment only if it has segment-specific fields
  const flightNumber = segment.code.split(' ')[1];
  if (
    meal.FlightNumber && meal.Origin && meal.Destination &&
    (meal.FlightNumber !== flightNumber ||
     meal.Origin !== segment.originCode ||
     meal.Destination !== segment.destinationCode)
  ) {
    console.warn(
      `Meal ${meal.Code} does not belong to segment ${segmentIndex} (${flightNumber}, ${segment.originCode}-${segment.destinationCode}). Expected: ${meal.FlightNumber}, ${meal.Origin}-${meal.Destination}`
    );
    return;
  }

  // Initialize segment array if undefined
  if (!selected[segmentIndex]) {
    selected[segmentIndex] = [];
  }

  // Clear invalid meals for other segments
  selected.forEach((segmentMeals, idx) => {
    if (idx !== segmentIndex) {
      selected[idx] = segmentMeals.filter(m => {
        const seg = flightSegments[idx];
        const segFlightNumber = seg.code.split(' ')[1];
        // Only validate segment-specific fields if they exist
        return (
          !m.meal.FlightNumber || !m.meal.Origin || !m.meal.Destination ||
          (m.meal.FlightNumber === segFlightNumber &&
           m.meal.Origin === seg.originCode &&
           m.meal.Destination === seg.destinationCode)
        );
      });
    }
  });

  const totalSelected = selected[segmentIndex].reduce((sum, { meal: m, count }) => sum + count, 0);
  if (totalSelected >= maxMealsPerSegment) {
    console.warn(`Cannot select more than ${maxMealsPerSegment} meals in this segment.`);
    return;
  }

  const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
  if (mealIndex === -1) {
    // Deep clone meal to avoid shared reference
    selected[segmentIndex].push({ meal: { ...JSON.parse(JSON.stringify(meal)) }, count: 1 });
  } else {
    selected[segmentIndex][mealIndex].count++;
  }

  this.updateSelectedMealsFinal(isReturn);
  this.updateTotalMealCharges();

  console.log(`After increment (${isReturn ? 'Return' : 'Onward'}, Segment ${segmentIndex}):`, selected);
}

decrementMeal(segmentIndex: number, meal: any, isReturn: boolean = false): void {
  const selected = isReturn ? this.selectedMealsReturn : this.selectedMeals;
  const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
  const segment = flightSegments[segmentIndex];

  // Debug log for input parameters
  console.log(`decrementMeal called with segmentIndex: ${segmentIndex}, isReturn: ${isReturn}, meal:`, meal);

  // Validate meal belongs to the segment only if it has segment-specific fields
  const flightNumber = segment.code.split(' ')[1];
  if (
    meal.FlightNumber && meal.Origin && meal.Destination &&
    (meal.FlightNumber !== flightNumber ||
     meal.Origin !== segment.originCode ||
     meal.Destination !== segment.destinationCode)
  ) {
    console.warn(
      `Meal ${meal.Code} does not belong to segment ${segmentIndex} (${flightNumber}, ${segment.originCode}-${segment.destinationCode}). Expected: ${meal.FlightNumber}, ${meal.Origin}-${meal.Destination}`
    );
    return;
  }

  if (!selected[segmentIndex]) return;

  const mealIndex = selected[segmentIndex].findIndex(m => m.meal.Code === meal.Code);
  if (mealIndex === -1 || selected[segmentIndex][mealIndex].count <= 0) return;

  selected[segmentIndex][mealIndex].count--;
  if (selected[segmentIndex][mealIndex].count === 0) {
    selected[segmentIndex].splice(mealIndex, 1);
  }

  // Clear invalid meals for other segments
  selected.forEach((segmentMeals, idx) => {
    if (idx !== segmentIndex) {
      selected[idx] = segmentMeals.filter(m => {
        const seg = flightSegments[idx];
        const segFlightNumber = seg.code.split(' ')[1];
        // Only validate segment-specific fields if they exist
        return (
          !m.meal.FlightNumber || !m.meal.Origin || !m.meal.Destination ||
          (m.meal.FlightNumber === segFlightNumber &&
           m.meal.Origin === seg.originCode &&
           m.meal.Destination === seg.destinationCode)
        );
      });
    }
  });

  this.updateSelectedMealsFinal(isReturn);
  this.updateTotalMealCharges();

  console.log(`After decrement (${isReturn ? 'Return' : 'Onward'}, Segment ${segmentIndex}):`, selected);
}

private updateSelectedMealsFinal(isReturn: boolean): void {
  // Filter out existing meals for the given isReturn value
  this.selectedMealsFinal = this.selectedMealsFinal.filter(m => m.isReturn !== isReturn);

  const segments = isReturn ? this.selectedMealsReturn : this.selectedMeals;
  const flightSegments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();

  // Iterate over each segment
  segments.forEach((segmentMeals, segmentIndex) => {
    const segment = flightSegments[segmentIndex];
    const flightNumber = segment.code.split(' ')[1];
    let passengerIndex = 0;

    segmentMeals.forEach(({ meal, count }) => {
      // Validate meal belongs to the segment only if it has segment-specific fields
      if (
        meal.FlightNumber && meal.Origin && meal.Destination &&
        (meal.FlightNumber !== flightNumber ||
         meal.Origin !== segment.originCode ||
         meal.Destination !== segment.destinationCode)
      ) {
        console.warn(`Skipping meal ${meal.Code} for segment ${segmentIndex} as it does not match segment details`);
        return;
      }

      // Deep clone meal to avoid shared references
      const mealCopy = { ...JSON.parse(JSON.stringify(meal)) };
      for (let i = 0; i < count; i++) {
        if (passengerIndex < (this.totalAdults + this.totalChildren)) {
          this.selectedMealsFinal.push({
            passengerIndex,
            segmentIndex,
            meal: mealCopy,
            isReturn,
            WayType: meal.WayType || this.getWayType(segment.originCode, segment.destinationCode),
            Description: meal.Description || 2
          });
          passengerIndex++;
        }
      }
    });
  });

  // Debug log to verify selectedMealsFinal
  console.log('Updated selectedMealsFinal:', this.selectedMealsFinal);
}


  private extractSpecialServices(rawSSR: any[]): any[] {
    const finalServices: any[] = [];
    for (const item of rawSSR) {
      const segments = item?.SegmentSpecialService || [];
      for (const segment of segments) {
        const services = segment?.SSRService || [];
        for (const ssr of services) {
          finalServices.push({
            AirlineCode: ssr.AirlineCode,
            Code: ssr.Code,
            Text: ssr.Text,
            Origin: ssr.Origin,
            Destination: ssr.Destination,
            Price: ssr.Price,
            Currency: ssr.Currency,
            FlightNumber: ssr.FlightNumber,
            DepartureTime: ssr.DepartureTime,
            added: false,
            WayType: ssr.WayType
          });
        }
      }
    }
    return finalServices;
  }

//   incrementService(service: Service, isReturn: boolean = false): void {
//   const maxServices = this.totalAdults + this.totalChildren;
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`incrementService called with isReturn: ${isReturn}, service:`, service);

//   // Validate service belongs to the journey
//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   // Calculate total selected services for the specific journey
//   const totalSelectedForJourney = this.selectedServices
//     .filter(s => s.service.isReturn === isReturn)
//     .reduce((sum, { count }) => sum + count, 0);

//   if (totalSelectedForJourney >= maxServices) {
//     Swal.fire({
//       title: 'Sorry!',
//       html: `Cannot select more than ${maxServices} services for this ${isReturn ? 'return' : 'onward'} journey.`,
//       icon: 'error',
//       confirmButtonText: 'Ok'
//     });
//     return;
//   }

//   const serviceIndex = this.selectedServices.findIndex(s => s.service.Code === service.Code && s.service.isReturn === isReturn);
//   if (serviceIndex === -1) {
//     this.selectedServices.push({ service: { ...JSON.parse(JSON.stringify(service)) }, count: 1 });
//   } else {
//     this.selectedServices[serviceIndex].count++;
//   }

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();

//   console.log(`After increment (${isReturn ? 'Return' : 'Onward'}):`, this.selectedServices);
// }

// decrementService(service: Service, isReturn: boolean = false): void {
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`decrementService called with isReturn: ${isReturn}, service:`, service);

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   const serviceIndex = this.selectedServices.findIndex(s => s.service.Code === service.Code && s.service.isReturn === isReturn);
//   if (serviceIndex === -1 || this.selectedServices[serviceIndex].count <= 0) return;

//   this.selectedServices[serviceIndex].count--;
//   if (this.selectedServices[serviceIndex].count === 0) {
//     this.selectedServices.splice(serviceIndex, 1);
//   }

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();

//   console.log(`After decrement (${isReturn ? 'Return' : 'Onward'}):`, this.selectedServices);
// }

// addService(service: Service, isReturn: boolean): void {
//   const maxServices = this.totalAdults + this.totalChildren;
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`addService called with isReturn: ${isReturn}, service:`, service);

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   const totalSelectedForJourney = this.selectedServices
//     .filter(s => s.service.isReturn === isReturn)
//     .reduce((sum, { count }) => sum + count, 0);

//   if (totalSelectedForJourney >= maxServices) {
//     Swal.fire({
//       title: 'Sorry!',
//       html: `Cannot select more than ${maxServices} services for this ${isReturn ? 'return' : 'onward'} journey.`,
//       icon: 'error',
//       confirmButtonText: 'Ok'
//     });
//     return;
//   }

//   console.log("add Service Selected Services",this.selectedServices)
//   const serviceIndex = this.selectedServices.findIndex(
//     s => s.service.Code === service.Code && 
//          s.service.isReturn === isReturn &&
//          s.service.Origin === service.Origin && 
//          s.service.Destination === service.Destination
//   );

//   if (serviceIndex === -1) {
//     const serviceWithFlag = { ...service, isReturn }; // ensure isReturn is included properly
//     this.selectedServices.push({
//       service: serviceWithFlag,
//       count: 1,
//       passengerIndex: totalSelectedForJourney % maxServices
//     });
//   } else {
//     console.warn(`Service ${service.Code} already added for this journey.`);
//     return;
//   }

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();
//   console.log(`After addService (${isReturn ? 'Return' : 'Onward'}):`, this.selectedServices);
// }

// addService(service: Service, isReturn: boolean): void {
//   const maxServices = this.totalAdults + this.totalChildren;
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`addService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('addService: Journey origin or destination missing.');
//     return;
//   }

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   const totalSelectedForJourney = this.selectedServices
//     .filter(s => s.service.isReturn === isReturn)
//     .reduce((sum, { count }) => sum + count, 0);

//   // if (totalSelectedForJourney >= maxServices) {
//   //   Swal.fire({
//   //     title: 'Sorry!',
//   //     html: `Cannot select more than ${maxServices} services for this ${isReturn ? 'return' : 'onward'} journey.`,
//   //     icon: 'error',
//   //     confirmButtonText: 'Ok'
//   //   });
//   //   return;
//   // }

//   // Relaxed duplicate check to only match Code and isReturn
//   const serviceIndex = this.selectedServices.findIndex(
//     s => s.service.Code === service.Code && s.service.isReturn === isReturn
//   );

//   if (serviceIndex !== -1) {
//     // Increment count if service exists
//     this.selectedServices[serviceIndex].count++;
//     console.log(`Incremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
//   } else {
//     // Add new service
//     const serviceWithFlag = { ...JSON.parse(JSON.stringify(service)), isReturn };
//     this.selectedServices = [
//       ...this.selectedServices,
//       {
//         service: serviceWithFlag,
//         count: 1,
//         passengerIndex: totalSelectedForJourney % maxServices
//       }
//     ];
//     console.log(`Added new service ${service.Code} to selectedServices.`);
//   }

//   console.log('addService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();
//   console.log(`After addService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
// }


// removeService(service: Service, isReturn: boolean): void {
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`removeService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('removeService: Journey origin or destination missing.');
//     return;
//   }

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   const serviceIndex = this.selectedServices.findIndex(
//     s => s.service.Code === service.Code && s.service.isReturn === isReturn
//   );

//   if (serviceIndex === -1) {
//     console.warn(`Service ${service.Code} not found for this journey.`);
//     return;
//   }

//   this.selectedServices[serviceIndex].count--;
//   if (this.selectedServices[serviceIndex].count <= 0) {
//     this.selectedServices = this.selectedServices.filter((_, i) => i !== serviceIndex);
//     console.log(`Removed service ${service.Code} from selectedServices.`);
//   } else {
//     console.log(`Decremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
//   }

//   console.log('removeService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();
//   console.log(`After removeService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
// }


// private updateSelectedServicesFinal(isReturn: boolean): void {
//   this.selectedServicesFinal = this.selectedServicesFinal.filter(s => s.isReturn !== isReturn);
//   const segments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const journeyOrigin = segments[0]?.originCode;
//   const journeyDestination = segments[segments.length - 1]?.destinationCode;

//   let passengerIndex = 0;
//   this.selectedServices.forEach(({ service, count }) => {
//     if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//       console.warn(`Skipping service ${service.Code} as it does not match journey ${journeyOrigin}-${journeyDestination}`);
//       return;
//     }

//     const serviceCopy = { ...JSON.parse(JSON.stringify(service)) };
//     for (let i = 0; i < count; i++) {
//       if (passengerIndex < (this.totalAdults + this.totalChildren)) {
//         this.selectedServicesFinal.push({
//           passengerIndex,
//           segmentIndex : 0,
//           service: serviceCopy,
//           isReturn,
//           WayType: service.WayType || this.getWayType(journeyOrigin, journeyDestination),
//           Description: service.Description || 2
//         });
//         passengerIndex++;
//       }
//     }
//   });

//   console.log('Updated selectedServicesFinal:', this.selectedServicesFinal);
// }

// updateSelectedServicesFinal
// private updateSelectedServicesFinal(isReturn: boolean): void {
//   this.selectedServicesFinal = this.selectedServicesFinal.filter(s => s.isReturn !== isReturn);
//   const segments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const journeyOrigin = segments[0]?.originCode;
//   const journeyDestination = segments[segments.length - 1]?.destinationCode;

//   this.selectedServices
//     .filter(s => s.service.isReturn === isReturn)
//     .forEach(({ service, count, passengerIndex }) => {
//       if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//         console.warn(
//           `Skipping service ${service.Code} as it does not match journey ${journeyOrigin}-${journeyDestination}`
//         );
//         return;
//       }

//       const serviceCopy = { ...JSON.parse(JSON.stringify(service)) };
//       if (passengerIndex < (this.totalAdults + this.totalChildren)) {
//         this.selectedServicesFinal.push({
//           passengerIndex,
//           segmentIndex: 0,
//           service: serviceCopy,
//           isReturn,
//           WayType: service.WayType || this.getWayType(journeyOrigin, journeyDestination),
//           Description: service.Description || '2'
//         });
//       }
//     });

//   console.log('Updated selectedServicesFinal:', this.selectedServicesFinal);
// }
// updateSelectedServicesFinal(isReturn: boolean): void {
//   // Remove previously added services for this journey direction
//   this.selectedServicesFinal = this.selectedServicesFinal.filter(s => s.isReturn !== isReturn);

//   const segments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const journeyOrigin = segments[0]?.originCode;
//   const journeyDestination = segments[segments.length - 1]?.destinationCode;

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('updateSelectedServicesFinal: Journey origin or destination missing.');
//     return;
//   }

//   let currentPassengerIndex = 0;
//   this.selectedServices
//     .filter(s => s.service && s.service.isReturn === isReturn)
//     .forEach(({ service, count }) => {
//       if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//         console.warn(
//           `Skipping service ${service.Code} as it does not match journey ${journeyOrigin}-${journeyDestination}`
//         );
//         return;
//       }

//       const serviceCopy = { ...JSON.parse(JSON.stringify(service)) };
//       const totalPax = this.totalAdults + this.totalChildren;

//       for (let i = 0; i < count && currentPassengerIndex < totalPax; i++) {
//         this.selectedServicesFinal.push({
//           passengerIndex: currentPassengerIndex,
//           segmentIndex: 0,
//           service: serviceCopy,
//           isReturn,
//           WayType: service.WayType || this.getWayType(journeyOrigin, journeyDestination),
//           Description: service.Description || '2'
//         });
//         currentPassengerIndex++;
//       }
//     });

//   console.log('Updated selectedServicesFinal:', JSON.parse(JSON.stringify(this.selectedServicesFinal)));
// }
 

// addService(service: Service, isReturn: boolean): void {
//   const maxServices = this.totalAdults + this.totalChildren + this.totalInfants;
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`addService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('addService: Journey origin or destination missing.');
//     return;
//   }

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   // Find existing service
//   const serviceIndex = this.selectedServices.findIndex(
//     s => s.service.Code === service.Code && s.service.isReturn === isReturn
//   );

//   if (serviceIndex !== -1) {
//     // Increment count if service exists
//     this.selectedServices[serviceIndex].count++;
//     console.log(`Incremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
//   } else {
//     // Add new service
//     const serviceWithFlag = { ...JSON.parse(JSON.stringify(service)), isReturn };
//     this.selectedServices.push({
//       service: serviceWithFlag,
//       count: 1,
//       passengerIndex: 0 // Will be reassigned in updateSelectedServicesFinal
//     });
//     console.log(`Added new service ${service.Code} to selectedServices.`);
//   }

//   console.log('addService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();
//   console.log(`After addService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
// }

// removeService(service: Service, isReturn: boolean): void {
//   const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
//   const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

//   console.log(`removeService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('removeService: Journey origin or destination missing.');
//     return;
//   }

//   if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//     console.warn(
//       `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
//     );
//     return;
//   }

//   const serviceIndex = this.selectedServices.findIndex(
//     s => s.service.Code === service.Code && s.service.isReturn === isReturn
//   );

//   if (serviceIndex === -1) {
//     console.warn(`Service ${service.Code} not found for this journey.`);
//     return;
//   }

//   this.selectedServices[serviceIndex].count--;
//   if (this.selectedServices[serviceIndex].count <= 0) {
//     this.selectedServices = this.selectedServices.filter((_, i) => i !== serviceIndex);
//     console.log(`Removed service ${service.Code} from selectedServices.`);
//   } else {
//     console.log(`Decremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
//   }

//   console.log('removeService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

//   this.updateSelectedServicesFinal(isReturn);
//   this.updateTotalSpecialServiceCharges();
//   console.log(`After removeService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
// }

// updateSelectedServicesFinal(isReturn: boolean): void {
//   // Remove previously added services for this journey direction
//   this.selectedServicesFinal = this.selectedServicesFinal.filter(s => s.isReturn !== isReturn);

//   const segments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
//   const journeyOrigin = segments[0]?.originCode;
//   const journeyDestination = segments[segments.length - 1]?.destinationCode;

//   if (!journeyOrigin || !journeyDestination) {
//     console.warn('updateSelectedServicesFinal: Journey origin or destination missing.');
//     return;
//   }

//   const totalPax = this.totalAdults + this.totalChildren + this.totalInfants;

//   this.selectedServices
//     .filter(s => s.service && s.service.isReturn === isReturn)
//     .forEach(({ service, count }) => {
//       if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
//         console.warn(
//           `Skipping service ${service.Code} as it does not match journey ${journeyOrigin}-${journeyDestination}`
//         );
//         return;
//       }

//       const serviceCopy = { ...JSON.parse(JSON.stringify(service)) };
//       // Assign the service to all passengers for each count
//       for (let i = 0; i < count; i++) {
//         for (let passengerIndex = 0; passengerIndex < totalPax; passengerIndex++) {
//           this.selectedServicesFinal.push({
//             passengerIndex,
//             segmentIndex: 0,
//             service: { ...serviceCopy },
//             isReturn,
//             WayType: service.WayType || this.getWayType(journeyOrigin, journeyDestination),
//             Description: service.Description || '2'
//           });
//         }
//       }
//     });

//   console.log('Updated selectedServicesFinal:', JSON.parse(JSON.stringify(this.selectedServicesFinal)));
// }


addService(service: Service, isReturn: boolean): void {
  const maxServices = this.totalAdults + this.totalChildren; // Exclude infants
  const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
  const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

  console.log(`addService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

  if (!journeyOrigin || !journeyDestination) {
    console.warn('addService: Journey origin or destination missing.');
    return;
  }

  if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
    console.warn(
      `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
    );
    return;
  }

  // Find existing service
  const serviceIndex = this.selectedServices.findIndex(
    s => s.service.Code === service.Code && s.service.isReturn === isReturn
  );

  if (serviceIndex !== -1) {
    // Increment count if service exists
    this.selectedServices[serviceIndex].count++;
    console.log(`Incremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
  } else {
    // Add new service
    const serviceWithFlag = { ...JSON.parse(JSON.stringify(service)), isReturn };
    this.selectedServices.push({
      service: serviceWithFlag,
      count: 1,
      passengerIndex: 0 // Will be reassigned in updateSelectedServicesFinal
    });
    console.log(`Added new service ${service.Code} to selectedServices.`);
  }

  console.log('addService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

  this.updateSelectedServicesFinal(isReturn);
  this.updateTotalSpecialServiceCharges();
  console.log(`After addService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
}

removeService(service: Service, isReturn: boolean): void {
  const journeyOrigin = isReturn ? this.flightSegmentsReturn[0]?.originCode : this.flightSegments[0]?.originCode;
  const journeyDestination = isReturn ? this.flightSegmentsReturn[this.flightSegmentsReturn.length - 1]?.destinationCode : this.flightSegments[this.flightSegments.length - 1]?.destinationCode;

  console.log(`removeService called with isReturn: ${isReturn}, service:`, JSON.parse(JSON.stringify(service)));

  if (!journeyOrigin || !journeyDestination) {
    console.warn('removeService: Journey origin or destination missing.');
    return;
  }

  if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
    console.warn(
      `Service ${service.Code} does not match journey (${journeyOrigin}-${journeyDestination}). Expected: ${service.Origin}-${service.Destination}`
    );
    return;
  }

  const serviceIndex = this.selectedServices.findIndex(
    s => s.service.Code === service.Code && s.service.isReturn === isReturn
  );

  if (serviceIndex === -1) {
    console.warn(`Service ${service.Code} not found for this journey.`);
    return;
  }

  this.selectedServices[serviceIndex].count--;
  if (this.selectedServices[serviceIndex].count <= 0) {
    this.selectedServices = this.selectedServices.filter((_, i) => i !== serviceIndex);
    console.log(`Removed service ${service.Code} from selectedServices.`);
  } else {
    console.log(`Decremented count for service ${service.Code}. New count: ${this.selectedServices[serviceIndex].count}`);
  }

  console.log('removeService: Updated selectedServices:', JSON.parse(JSON.stringify(this.selectedServices)));

  this.updateSelectedServicesFinal(isReturn);
  this.updateTotalSpecialServiceCharges();
  console.log(`After removeService (${isReturn ? 'Return' : 'Onward'}):`, JSON.parse(JSON.stringify(this.selectedServices)));
}

updateSelectedServicesFinal(isReturn: boolean): void {
  // Remove previously added services for this journey direction
  this.selectedServicesFinal = this.selectedServicesFinal.filter(s => s.isReturn !== isReturn);

  const segments = isReturn ? this.getFlightSegmentsReturn() : this.getFlightSegments();
  const journeyOrigin = segments[0]?.originCode;
  const journeyDestination = segments[segments.length - 1]?.destinationCode;

  if (!journeyOrigin || !journeyDestination) {
    console.warn('updateSelectedServicesFinal: Journey origin or destination missing.');
    return;
  }

  const totalPax = this.totalAdults + this.totalChildren; // Exclude infants

  this.selectedServices
    .filter(s => s.service && s.service.isReturn === isReturn)
    .forEach(({ service, count }) => {
      if (service.Origin !== journeyOrigin || service.Destination !== journeyDestination) {
        console.warn(
          `Skipping service ${service.Code} as it does not match journey ${journeyOrigin}-${journeyDestination}`
        );
        return;
      }

      const serviceCopy = { ...JSON.parse(JSON.stringify(service)) };
      // Assign the service to all eligible passengers (adults and children) for each count
      for (let i = 0; i < count; i++) {
        for (let passengerIndex = 0; passengerIndex < totalPax; passengerIndex++) {
          this.selectedServicesFinal.push({
            passengerIndex,
            segmentIndex: 0,
            service: { ...serviceCopy },
            isReturn,
            WayType: service.WayType || this.getWayType(journeyOrigin, journeyDestination),
            Description: service.Description || '2'
          });
        }
      }
    });

  console.log('Updated selectedServicesFinal:', JSON.parse(JSON.stringify(this.selectedServicesFinal)));
}

  // Parse seat data
  // parseSeatData(ssr: any, segments: any[], isReturn: boolean): void {
  //   const seatMapTarget = isReturn ? this.seatMapReturn : this.seatMap;
  //   const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  //   const hasSeatsAvailableTarget = isReturn ? this.hasSeatsAvailableReturn : this.hasSeatsAvailable;

  //   const rawSeatData = ssr?.Response?.SeatDynamic || [];
  //   hasSeatsAvailableTarget.length = 0;
  //   hasSeatsAvailableTarget.push(...new Array(segments.length).fill(false));

  //   const aircraftSeatMapConfig: { [key: string]: { layout: string; blocks: number[][] } } = {
  //     '737': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '738': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '73H': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '7M8': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '320': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '321': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '319': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
  //     '223': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
  //     '221': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
  //     '717': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
  //     'E75': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
  //     'E95': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
  //     '77W': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
  //     '772': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
  //     '789': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
  //     '788': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
  //     '333': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
  //     '332': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
  //     '359': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
  //     '748': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
  //     '388': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
  //   };

  //   segments.forEach((segment, i) => {
  //     const flightNumber = segment.code.split(' ')[1];
  //     const origin = segment.originCode;
  //     const destination = segment.destinationCode;

  //     let matchingSegmentSeat = null;
  //     let craftType = '';
  //     let hasValidSeats = false;

  //     if (rawSeatData && rawSeatData.length > 0) {
  //       for (const block of rawSeatData) {
  //         for (const seatGroup of block.SegmentSeat || []) {
  //           for (const row of seatGroup.RowSeats || []) {
  //             for (const seat of row.Seats || []) {
  //               if (
  //                 seat.FlightNumber === flightNumber &&
  //                 seat.Origin === origin &&
  //                 seat.Destination === destination
  //               ) {
  //                 matchingSegmentSeat = seatGroup;
  //                 craftType = seat.CraftType || '';
  //                 break;
  //               }
  //             }
  //             if (matchingSegmentSeat) break;
  //           }
  //           if (matchingSegmentSeat) break;
  //         }
  //         if (matchingSegmentSeat) break;
  //       }

  //       if (matchingSegmentSeat) {
  //         const rowSeats = matchingSegmentSeat.RowSeats || [];
  //         if (rowSeats.length === 1) {
  //           const seatsInRow = rowSeats[0]?.Seats || [];
  //           const allSeatsAreNoSeat = seatsInRow.length > 0 && seatsInRow.every(seat => seat.Code === 'NoSeat');
  //           if (!allSeatsAreNoSeat) {
  //             hasValidSeats = true;
  //           }
  //         } else if (rowSeats.length > 0) {
  //           hasValidSeats = rowSeats.some(row => row.Seats?.some(seat => seat.Code !== 'NoSeat'));
  //         }
  //       }
  //     }

  //     hasSeatsAvailableTarget[i] = hasValidSeats;

  //     if (!hasValidSeats) {
  //       seatMapTarget[i] = { rows: [], seatBlocks: [], priceCategories: [] };
  //       selectedSeatsTarget[i] = [];
  //       return;
  //     }

  //     const rowSeats = matchingSegmentSeat?.RowSeats || [];
  //     const allSeatLetters: string[] = Array.from(
  //       new Set(
  //         rowSeats.flatMap(row =>
  //           row.Seats?.map(seat => seat.SeatNo?.toUpperCase() || '') || []
  //         )
  //       ) as Set<string>
  //     ).filter(letter => letter !== '').sort();

  //     const prices: number[] = rowSeats
  //       .flatMap(row => row.Seats || [])
  //       .filter(seat => {
  //         const availabilityType = Number(seat?.AvailablityType ?? 0);
  //         const isAvailable = availabilityType === 1;
  //         const price = Number(seat?.Price) || 0;
  //         return seat && !isNaN(price) && price > 0 && isAvailable;
  //       })
  //       .map(seat => Number(seat.Price));

  //     let priceCategories: { min: number; max: number; category: string }[] = [];
  //     if (prices.length > 0) {
  //       const minPrice = Math.min(...prices);
  //       const maxPrice = Math.max(...prices);
  //       const range = (maxPrice - minPrice) / 3;
  //       if (range > 0) {
  //         priceCategories = [
  //           { min: minPrice, max: minPrice + range, category: 'low-price' },
  //           { min: minPrice + range, max: minPrice + 2 * range, category: 'medium-price' },
  //           { min: minPrice + 2 * range, max: maxPrice, category: 'high-price' },
  //         ].filter((cat, idx, arr) => idx === arr.length - 1 || cat.max < maxPrice);
  //       } else {
  //         priceCategories = [{ min: minPrice, max: maxPrice, category: 'low-price' }];
  //       }
  //     } else {
  //       priceCategories = [{ min: 0, max: 0, category: 'free' }];
  //     }

  //     this.priceCategories = priceCategories;

  //     let seatBlocks: string[][] = [];
  //     const totalSeats = allSeatLetters.length;
  //     const craftKey = craftType ? craftType.split('-')[0] : '';
  //     const config = craftKey ? aircraftSeatMapConfig[craftKey] : null;

  //     let useCraftConfig = false;
  //     if (config) {
  //       const configTotalSeats = config.blocks.reduce((total, block) => total + (block[1] - block[0]), 0);
  //       if (configTotalSeats === totalSeats) {
  //         useCraftConfig = true;
  //         seatBlocks = config.blocks.map(block => allSeatLetters.slice(block[0], block[1]));
  //       }
  //     }

  //     if (!useCraftConfig) {
  //       if (totalSeats === 10) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 3),
  //           allSeatLetters.slice(3, 7),
  //           allSeatLetters.slice(7, 10),
  //         ];
  //       } else if (totalSeats === 9) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 3),
  //           allSeatLetters.slice(3, 6),
  //           allSeatLetters.slice(6, 9),
  //         ];
  //       } else if (totalSeats === 8) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 2),
  //           allSeatLetters.slice(2, 6),
  //           allSeatLetters.slice(6, 8),
  //         ];
  //       } else if (totalSeats === 6) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 3),
  //           allSeatLetters.slice(3, 6),
  //         ];
  //       } else if (totalSeats === 5) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 2),
  //           allSeatLetters.slice(2, 5),
  //         ];
  //       } else if (totalSeats === 4) {
  //         seatBlocks = [
  //           allSeatLetters.slice(0, 2),
  //           allSeatLetters.slice(2, 4),
  //         ];
  //       }
  //     }

  //     const structured = rowSeats.map(row => {
  //       const rowNumber = row.Seats?.[0]?.RowNo || '';
  //       return {
  //         rowNo: rowNumber,
  //         seatBlocks: seatBlocks.map(block => {
  //           const blockSeats: any = {};
  //           block.forEach(letter => {
  //             const seat = row.Seats?.find(s => s.SeatNo?.toUpperCase() === letter) || null;
  //             if (seat && seat.Code !== 'NoSeat') {
  //               const availabilityType = Number(seat?.AvailablityType ?? 0);
  //               const isAvailable = availabilityType === 1;
  //               const price = Number(seat.Price) || 0;
  //               let priceCategory = '';
  //               if (!isAvailable) {
  //                 priceCategory = 'not-available';
  //               } else if (price === 0) {
  //                 priceCategory = 'free';
  //               } else {
  //                 const category = priceCategories.find(cat => price > cat.min && price <= cat.max);
  //                 priceCategory = category ? category.category : 'low-price';
  //               }

  //               blockSeats[letter] = {
  //                 ...seat,
  //                 isAvailable,
  //                 priceCategory,
  //                 Price: price,
  //                 displaySeatNo: `${rowNumber}${letter}`
  //               };
  //             } else {
  //               blockSeats[letter] = null;
  //             }
  //           });
  //           return blockSeats;
  //         })
  //       };
  //     }).filter(row => row.seatBlocks.some(block => Object.values(block).some(seat => seat !== null)));

  //     seatMapTarget[i] = {
  //       rows: structured,
  //       seatBlocks: seatBlocks,
  //       priceCategories: priceCategories
  //     };

  //     selectedSeatsTarget[i] = [];
  //   });
  // }

  parseSeatData(ssr: any, segments: any[], isReturn: boolean): void {
    const {
      seatMaps,
      selectedSeats,
      hasSeatsAvailable,
      priceCategories
    } = this.generateSeatMapData(ssr);

    if (isReturn) {
      this.seatMapReturn = seatMaps;
      this.selectedSeatsReturn = selectedSeats;
      this.hasSeatsAvailableReturn = hasSeatsAvailable;
    } else {
      this.seatMap = seatMaps;
      this.selectedSeats = selectedSeats;
      this.hasSeatsAvailable = hasSeatsAvailable;
    }

    this.priceCategories = priceCategories;
  }

  // generateSeatMapData(ssr: any, segments: any[]): {
  //   seatMaps: any[];
  //   selectedSeats: any[][];
  //   hasSeatsAvailable: boolean[];
  //   priceCategories: { min: number; max: number; category: string }[];
  // } {
  //   const rawSeatData = ssr?.Response?.SeatDynamic || [];
  //   const seatMaps: any[] = [];
  //   const selectedSeats: any[][] = [];
  //   const hasSeatsAvailable: boolean[] = [];
  //   let globalPriceCategories: { min: number; max: number; category: string }[] = [];

  //   for (let i = 0; i < segments.length; i++) {
  //     const segment = segments[i];
  //     const flightNumber = segment.code.split(' ')[1];
  //     const origin = segment.originCode;
  //     const destination = segment.destinationCode;

  //     let matchingSegmentSeat = null;
  //     let craftType = '';
  //     let hasValidSeats = false;

  //     for (const block of rawSeatData) {
  //       for (const seatGroup of block.SegmentSeat || []) {
  //         for (const row of seatGroup.RowSeats || []) {
  //           for (const seat of row.Seats || []) {
  //             if (
  //               seat.FlightNumber === flightNumber &&
  //               seat.Origin === origin &&
  //               seat.Destination === destination
  //             ) {
  //               matchingSegmentSeat = seatGroup;
  //               craftType = seat.CraftType || '';
  //               break;
  //             }
  //           }
  //           if (matchingSegmentSeat) break;
  //         }
  //         if (matchingSegmentSeat) break;
  //       }
  //       if (matchingSegmentSeat) break;
  //     }

  //     const rowSeats = matchingSegmentSeat?.RowSeats || [];
  //     hasValidSeats = rowSeats.some(row => row.Seats?.some(seat => seat.Code !== 'NoSeat'));

  //     hasSeatsAvailable[i] = hasValidSeats;

  //     if (!hasValidSeats) {
  //       seatMaps[i] = { rows: [], seatBlocks: [], priceCategories: [] };
  //       selectedSeats[i] = [];
  //       continue;
  //     }

  //    const allSeatLetters: string[] = Array.from(
  //     new Set<string>(
  //       rowSeats.flatMap(row =>
  //         (row.Seats ?? []).map(seat => seat.SeatNo?.toUpperCase() || '')
  //       )
  //     )
  //   ).filter(letter => !!letter).sort();

  //     const prices = rowSeats
  //       .flatMap(row => row.Seats || [])
  //       .filter(seat => Number(seat?.AvailablityType ?? 0) === 1 && Number(seat?.Price) > 0)
  //       .map(seat => Number(seat.Price));

  //     let priceCategories = [{ min: 0, max: 0, category: 'free' }];
  //     if (prices.length > 0) {
  //       const minPrice = Math.min(...prices);
  //       const maxPrice = Math.max(...prices);
  //       const range = (maxPrice - minPrice) / 3;
  //       priceCategories = range > 0
  //         ? [
  //             { min: minPrice, max: minPrice + range, category: 'low-price' },
  //             { min: minPrice + range, max: minPrice + 2 * range, category: 'medium-price' },
  //             { min: minPrice + 2 * range, max: maxPrice, category: 'high-price' },
  //           ]
  //         : [{ min: minPrice, max: maxPrice, category: 'low-price' }];
  //     }

  //     globalPriceCategories = priceCategories;

  //     const totalSeats = allSeatLetters.length;
  //     const craftKey = craftType.split('-')[0];
  //     const config = this.aircraftSeatMapConfig[craftKey];

  //     let seatBlocks: string[][] = [];
  //     if (config && config.blocks.reduce((t, b) => t + (b[1] - b[0]), 0) === totalSeats) {
  //       seatBlocks = config.blocks.map(block => allSeatLetters.slice(block[0], block[1]));
  //     } else {
  //       seatBlocks = [allSeatLetters];
  //     }

  //     const structured = rowSeats.map(row => {
  //       const rowNumber = row.Seats?.[0]?.RowNo || '';
  //       return {
  //         rowNo: rowNumber,
  //         seatBlocks: seatBlocks.map(block => {
  //           const blockSeats: any = {};
  //           block.forEach(letter => {
  //             const seat = row.Seats?.find(s => s.SeatNo?.toUpperCase() === letter) || null;
  //             if (seat && seat.Code !== 'NoSeat') {
  //               const isAvailable = Number(seat?.AvailablityType ?? 0) === 1;
  //               const price = Number(seat.Price) || 0;
  //               let priceCategory = 'free';
  //               if (!isAvailable) priceCategory = 'not-available';
  //               else if (price > 0) {
  //                 const category = priceCategories.find(cat => price > cat.min && price <= cat.max);
  //                 priceCategory = category?.category || 'low-price';
  //               }
  //               blockSeats[letter] = {
  //                 ...seat,
  //                 isAvailable,
  //                 priceCategory,
  //                 Price: price,
  //                 displaySeatNo: `${rowNumber}${letter}`
  //               };
  //             } else {
  //               blockSeats[letter] = null;
  //             }
  //           });
  //           return blockSeats;
  //         })
  //       };
  //     }).filter(row => row.seatBlocks.some(block => Object.values(block).some(seat => seat !== null)));

  //     seatMaps[i] = {
  //       rows: structured,
  //       seatBlocks,
  //       priceCategories
  //     };

  //     selectedSeats[i] = [];
  //   }

  //   return {
  //     seatMaps,
  //     selectedSeats,
  //     hasSeatsAvailable,
  //     priceCategories: globalPriceCategories
  //   };
  // }

  generateSeatMapData(ssr: any): {
  seatMaps: any[];
  selectedSeats: any[][];
  hasSeatsAvailable: boolean[];
  priceCategories: { min: number; max: number; category: string }[];
} {
  const rawSeatData = ssr?.Response?.SeatDynamic || [];
  const seatMaps: any[] = [];
  const selectedSeats: any[][] = [];
  const hasSeatsAvailable: boolean[] = [];
  let globalPriceCategories: { min: number; max: number; category: string }[] = [];

  const aircraftSeatMapConfig: { [key: string]: { layout: string; blocks: number[][] } } = {
    '737': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '738': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '73H': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '7M8': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '320': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '321': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '319': { layout: '3-3', blocks: [[0, 3], [3, 6]] },
    '223': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    '221': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    '717': { layout: '2-3', blocks: [[0, 2], [2, 5]] },
    'E75': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
    'E95': { layout: '2-2', blocks: [[0, 2], [2, 4]] },
    '77W': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '772': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '789': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '788': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '333': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
    '332': { layout: '2-4-2', blocks: [[0, 2], [2, 6], [6, 8]] },
    '359': { layout: '3-3-3', blocks: [[0, 3], [3, 6], [6, 9]] },
    '748': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
    '388': { layout: '3-4-3', blocks: [[0, 3], [3, 7], [7, 10]] },
  };

  // Extract unique Origin-Destination combinations from SeatDynamic
  const segmentCombinations: { flightNumber: string; origin: string; destination: string; seatGroup: any; craftType: string }[] = [];

  for (const block of rawSeatData) {
    for (const seatGroup of block.SegmentSeat || []) {
      for (const row of seatGroup.RowSeats || []) {
        for (const seat of row.Seats || []) {
          const { FlightNumber, Origin, Destination, CraftType } = seat;
          if (FlightNumber && Origin && Destination) {
            const existingCombo = segmentCombinations.find(
              combo =>
                combo.flightNumber === FlightNumber &&
                combo.origin === Origin &&
                combo.destination === Destination
            );
            if (!existingCombo) {
              segmentCombinations.push({
                flightNumber: FlightNumber,
                origin: Origin,
                destination: Destination,
                seatGroup,
                craftType: CraftType || '',
              });
            }
          }
        }
      }
    }
  }

  console.log('Segment combinations:', JSON.stringify(segmentCombinations, null, 2));

  // Process each unique segment combination
  segmentCombinations.forEach((segment, i) => {
    const { flightNumber, origin, destination, seatGroup, craftType } = segment;
    console.log(`Processing segment ${i}: Flight ${flightNumber}, Origin ${origin}, Destination ${destination}`);

    const rowSeats = seatGroup?.RowSeats || [];
    const hasValidSeats = rowSeats.some((row: RowSeat) =>
      (row.Seats || []).some((seat: SeatData) => seat.Code !== 'NoSeat')
    );

    hasSeatsAvailable[i] = hasValidSeats;

    if (!hasValidSeats) {
      console.log(`No valid seats for segment ${i}`);
      seatMaps[i] = { rows: [], seatBlocks: [], priceCategories: [], flightNumber, origin, destination };
      selectedSeats[i] = [];
      return;
    }

    const allSeatLetters: string[] = Array.from(
      new Set<string>(
        rowSeats.flatMap((row: RowSeat) =>
          (row.Seats ?? []).map((seat: SeatData) => seat.SeatNo?.toUpperCase() || '')
        )
      )
    ).filter(Boolean).sort();

    console.log(`Seat letters: ${allSeatLetters}`);

    // Consider both AvailablityType 1 and 3 as available for pricing
    // const prices = rowSeats
    //   .flatMap(row => row.Seats || [])
    //   .filter(seat => [1, 3].includes(Number(seat?.AvailablityType ?? 0)) && Number(seat?.Price) > 0)
    //   .map(seat => Number(seat.Price));
     const prices = rowSeats
        .flatMap((row: RowSeat) => row.Seats || [])
        .filter((seat: SeatData) => Number(seat?.AvailablityType ?? 0) === 1 && Number(seat?.Price) > 0)
        .map((seat: SeatData) => Number(seat.Price));

    let priceCategories = [{ min: 0, max: 0, category: 'free' }];
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const range = (maxPrice - minPrice) / 3;
      priceCategories = range > 0
        ? [
            { min: minPrice, max: minPrice + range, category: 'low-price' },
            { min: minPrice + range, max: minPrice + 2 * range, category: 'medium-price' },
            { min: minPrice + 2 * range, max: maxPrice, category: 'high-price' },
          ]
        : [{ min: minPrice, max: maxPrice, category: 'low-price' }];
    }

    globalPriceCategories = priceCategories;

    // Handle craft type
    const totalSeats = allSeatLetters.length;
    const craftKey = craftType.includes('737') ? '737' : craftType?.split('-')[0];
    const config = aircraftSeatMapConfig[craftKey];
    let seatBlocks: string[][] = [];

    console.log(`Craft key: ${craftKey}, Total seats: ${totalSeats}`);

    if (config && config.blocks.reduce((t, b) => t + (b[1] - b[0]), 0) === totalSeats) {
      seatBlocks = config.blocks.map(b => allSeatLetters.slice(b[0], b[1]));
    } else {
      // Fallback
      if (totalSeats === 10) {
        seatBlocks = [allSeatLetters.slice(0, 3), allSeatLetters.slice(3, 7), allSeatLetters.slice(7, 10)];
      } else if (totalSeats === 9) {
        seatBlocks = [allSeatLetters.slice(0, 3), allSeatLetters.slice(3, 6), allSeatLetters.slice(6, 9)];
      } else if (totalSeats === 8) {
        seatBlocks = [allSeatLetters.slice(0, 2), allSeatLetters.slice(2, 6), allSeatLetters.slice(6, 8)];
      } else if (totalSeats === 7) {
        seatBlocks = [allSeatLetters.slice(0, 2), allSeatLetters.slice(2, 5), allSeatLetters.slice(5, 7)];
      } else if (totalSeats === 6) {
        seatBlocks = [allSeatLetters.slice(0, 3), allSeatLetters.slice(3, 6)];
      } else if (totalSeats === 5) {
        seatBlocks = [allSeatLetters.slice(0, 2), allSeatLetters.slice(2, 5)];
      } else if (totalSeats === 4) {
        seatBlocks = [allSeatLetters.slice(0, 2), allSeatLetters.slice(2, 4)];
      } else {
        seatBlocks = [allSeatLetters];
      }
    }

    console.log(`Seat blocks: ${JSON.stringify(seatBlocks)}`);

    const structured = rowSeats.map((row: RowSeat) => {
      const rowNo = row.Seats?.[0]?.RowNo || '';
      return {
        rowNo,
        seatBlocks: seatBlocks.map((block: string[]) => {
          const blockSeats: any = {};
          block.forEach((letter: string) => {
            const seat = row.Seats?.find((s: SeatData) => s.SeatNo?.toUpperCase() === letter) || null;
            if (seat && seat.Code !== 'NoSeat') {
              // const isAvailable = [1, 3].includes(Number(seat?.AvailablityType ?? 0));
              const isAvailable = Number(seat?.AvailablityType ?? 0) === 1;
              const price = Number(seat.Price) || 0;
              let priceCategory = 'free';
              if (!isAvailable) priceCategory = 'not-available';
              else if (price > 0) {
                const category = priceCategories.find(cat => price > cat.min && price <= cat.max);
                priceCategory = category?.category || 'low-price';
              }
              blockSeats[letter] = {
                ...seat,
                isAvailable,
                priceCategory,
                Price: price,
                displaySeatNo: `${rowNo}${letter}`,
              };
            } else {
              blockSeats[letter] = null;
            }
          });
          return blockSeats;
        }),
      };
    }).filter((row: any) => row.seatBlocks.some((block: any) => Object.values(block).some((seat: any) => seat !== null)));

    console.log(`Structured rows for segment ${i}:`, JSON.stringify(structured, null, 2));

    seatMaps[i] = {
      rows: structured,
      seatBlocks,
      priceCategories,
      flightNumber,
      origin,
      destination,
    };

    selectedSeats[i] = [];
  });

  // Handle case where no segments are found
  if (segmentCombinations.length === 0) {
    console.log('No valid segments found in SSR data');
    seatMaps.push({ rows: [], seatBlocks: [], priceCategories: [] });
    selectedSeats.push([]);
    hasSeatsAvailable.push(false);
  }

  return {
    seatMaps,
    selectedSeats,
    hasSeatsAvailable,
    priceCategories: globalPriceCategories,
  };
}

  // Toggle seat selection
 
  // toggleSeatSelection(segmentIndex: number, seat: any, isReturn: boolean = false): void {
  //   const maxAllowedPerSegment = this.totalAdults + this.totalChildren;
  //   const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  //   const segmentSeats = selectedSeatsTarget[segmentIndex] || [];
  //   const totalSelectedSeats = this.selectedSeatsFinal.filter(s => s.isReturn === isReturn).length;
  //   console.log("Total Seats Selected",totalSelectedSeats)
  //   console.log("Total Seats Selected",segmentSeats.length)
  
  //   // Check if adding this seat would exceed the total allowed seats
  //   // if (totalSelectedSeats >= maxAllowedPerSegment && !segmentSeats.includes(seat.Code)) {
  //   //   console.warn(`Cannot select more than ${maxAllowedPerSegment} seats across all segments.`);
  //   //   return;
  //   // }
  
  //   // Check per-segment limit
  //   if (segmentSeats.length >= maxAllowedPerSegment && !segmentSeats.includes(seat.Code)) {
  //     console.warn(`Cannot select more than ${maxAllowedPerSegment} seats in this segment.`);
  //     Swal.fire({
  //       title: 'Sorry!',
  //       html: `Cannot select more than ${maxAllowedPerSegment} seats in this segment.`,
  //       icon: 'error',
  //       confirmButtonText: 'Ok'
  //     }) 
  //     return;
  //   }
  
  //   const seatCode = seat.Code;
  //   const index = segmentSeats.indexOf(seatCode);
  //   let passengerIndex = segmentSeats.length;
  
  //   if (index === -1) {
  //     segmentSeats.push(seatCode);
  //     this.selectedSeatsFinal.push({
  //       passengerIndex: passengerIndex < (this.totalAdults + this.totalChildren) ? passengerIndex : 0,
  //       segmentIndex,
  //       seat: { ...seat },
  //       isReturn,
  //       WayType: seat.SeatWayType ?? this.getWayType(seat.Origin, seat.Destination),
  //       Description: seat.Description ?? 2
  //     });
  //   } else {
  //     segmentSeats.splice(index, 1);
  //     this.selectedSeatsFinal = this.selectedSeatsFinal.filter(
  //       s => !(s.segmentIndex === segmentIndex && s.seat.Code === seatCode && s.isReturn === isReturn)
  //     );
  //   }
  
  //   selectedSeatsTarget[segmentIndex] = segmentSeats;
  //   this.totalSeats = this.calculateTotalSeatPrice();
  // }

  // In FlightaddonsService

toggleSeatSelection(segmentIndex: number, seat: any, isReturn: boolean = false): void {
  const maxAllowedPerSegment = this.totalAdults + this.totalChildren; // 3
  const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  
  // Initialize segment if undefined
  if (!selectedSeatsTarget[segmentIndex]) {
    selectedSeatsTarget[segmentIndex] = [];
  }
  const segmentSeats = selectedSeatsTarget[segmentIndex];

  // Count seats for this segment in selectedSeatsFinal
  const segmentSeatCount = this.selectedSeatsFinal.filter(
    s => s.segmentIndex === segmentIndex && s.isReturn === isReturn
  ).length;
  console.log(`Segment ${segmentIndex} (${isReturn ? 'Return' : 'Onward'}): ${segmentSeatCount} seats in selectedSeatsFinal, ${segmentSeats.length} in segmentSeats`);

  // Check per-segment limit
  if (segmentSeatCount >= maxAllowedPerSegment && !segmentSeats.includes(seat.Code)) {
    console.warn(`Cannot select more than ${maxAllowedPerSegment} seats in this segment.`);
    Swal.fire({
      title: 'Sorry!',
      html: `Cannot select more than ${maxAllowedPerSegment} seats in this segment.`,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
    return;
  }

  const seatCode = seat.Code;
  const index = segmentSeats.indexOf(seatCode);
  let passengerIndex = segmentSeatCount; // Use selectedSeatsFinal count for passengerIndex

  if (index === -1) {
    segmentSeats.push(seatCode);
    this.selectedSeatsFinal.push({
      passengerIndex: passengerIndex < maxAllowedPerSegment ? passengerIndex : 0,
      segmentIndex,
      seat: { ...seat },
      isReturn,
      WayType: seat.SeatWayType ?? this.getWayType(seat.Origin, seat.Destination),
      Description: seat.Description ?? 2
    });
  } else {
    segmentSeats.splice(index, 1);
    this.selectedSeatsFinal = this.selectedSeatsFinal.filter(
      s => !(s.segmentIndex === segmentIndex && s.seat.Code === seatCode && s.isReturn === isReturn)
    );
  }

  selectedSeatsTarget[segmentIndex] = segmentSeats;
  this.totalSeats = this.calculateTotalSeatPrice();
  console.log(`After toggle: selectedSeatsFinal=`, this.selectedSeatsFinal);
}

  // Check if seat is selected
  isSeatSelected(segmentIndex: number, seatCode: string, isReturn: boolean = false): boolean {
    const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    return selectedSeatsTarget[segmentIndex]?.includes(seatCode) || false;
  }

  // Get seat tooltip
  getSeatTooltip(seat: any): string {
    if (!seat.isAvailable) return 'Not Available';
    if (seat.Price === 0) return 'Free Seat';
    return `Price: ${seat.Price} ${seat.Currency || 'INR'}`;
  }

  // // Calculate total seat price
  // calculateTotalSeatPrice(): number {
  //   let total = 0;
  //   this.seatMap.forEach((_, i) => {
  //     total += this.getSegmentSeatTotalPrice(i, false);
  //   });
  //   this.seatMapReturn.forEach((_, i) => {
  //     total += this.getSegmentSeatTotalPrice(i, true);
  //   });
  //   return total;
  // }

  // // Get segment seat total price
  // getSegmentSeatTotalPrice(segmentIndex: number, isReturn: boolean = false): number {
  //   const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  //   const seatMapTarget = isReturn ? this.seatMapReturn : this.seatMap;
  //   const selectedCodes = selectedSeatsTarget[segmentIndex] || [];
  //   const seatRows = seatMapTarget[segmentIndex]?.rows || [];

  //   const allSeats = seatRows.flatMap(row =>
  //     row.seatBlocks.flatMap(block => Object.values(block))
  //   );

  //   return selectedCodes.reduce((total, code) => {
  //     const seat = allSeats.find(s => s?.Code === code);
  //     return total + (seat?.Price || 0);
  //   }, 0);
  // }

  // In FlightaddonsService

calculateTotalSeatPrice(): number {
  let total = 0;
  this.seatMap.forEach((_, i) => {
    const segmentTotal = this.getSegmentSeatTotalPrice(i, false);
    console.log(`Onward Segment ${i}: Seat Total = ${segmentTotal}`);
    total += segmentTotal;
  });
  this.seatMapReturn.forEach((_, i) => {
    const segmentTotal = this.getSegmentSeatTotalPrice(i, true);
    console.log(`Return Segment ${i}: Seat Total = ${segmentTotal}`);
    total += segmentTotal;
  });
  console.log(`Total Seat Price: ${total}`);
  return total;
}

getSegmentSeatTotalPrice(segmentIndex: number, isReturn: boolean = false): number {
  const selectedSeatsTarget = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  const seatMapTarget = isReturn ? this.seatMapReturn : this.seatMap;
  const selectedCodes = selectedSeatsTarget[segmentIndex] || [];
  const seatRows = seatMapTarget[segmentIndex]?.rows || [];

  const allSeats = seatRows.flatMap((row: any) =>
    row.seatBlocks.flatMap((block: any) => Object.values(block))
  );

  const segmentTotal = selectedCodes.reduce((total, code) => {
    const seat = allSeats.find((s: any) => s?.Code === code);
    const price = seat?.Price || 0;
    console.log(`Segment ${segmentIndex} (${isReturn ? 'Return' : 'Onward'}): Seat ${code} Price = ${price}`);
    return total + price;
  }, 0);

  return segmentTotal;
}

  // Update total meal charges
  updateTotalMealCharges(): void {
    let total = 0;
    for (const segmentIndex in this.selectedMeals) {
      total += this.selectedMeals[segmentIndex].reduce((sum, { meal, count }) => sum + (meal.Price || 0) * count, 0);
    }
    for (const segmentIndex in this.selectedMealsReturn) {
      total += this.selectedMealsReturn[segmentIndex].reduce((sum, { meal, count }) => sum + (meal.Price || 0) * count, 0);
    }
    this.totalMealCharges = total;
    console.log(`Updated totalMealCharges: ${this.totalMealCharges}`);
  }

  // In FlightaddonsService

  // updateTotalMealCharges(): void {
  //   this.totalMealCharges = this.selectedMealsFinal.reduce((sum, { meal }) => sum + (meal.Price || 0), 0);
  //   console.log(`Updated totalMealCharges: ${this.totalMealCharges}`);
  // }


  // Update total special service charges
//  updateTotalSpecialServiceCharges(): void {
//   const total = this.selectedServices.reduce((sum, { service, count }) => sum + (service.Price || 0) * count, 0);
//   this.totalSpecialServiceCharges = total;
//   console.log(`Updated totalSpecialServiceCharges: ${this.totalSpecialServiceCharges}`);
// }

updateTotalSpecialServiceCharges(): void {
  const totalPax = this.totalAdults + this.totalChildren + this.totalInfants;
  const total = this.selectedServices.reduce((sum, { service, count }) => {
    return sum + (service.Price || 0) * count * totalPax;
  }, 0);
  this.totalSpecialServiceCharges = total;
  console.log(`Updated totalSpecialServiceCharges: ${this.totalSpecialServiceCharges}`);
}

  // Get total add-on charges

  getTotalAddonCharges(): number {
    console.log('Calculating totalAddonCharges:', {
      totalSeats: this.totalSeats,
      totalMealCharges: this.totalMealCharges,
      totalSpecialServiceCharges: this.totalSpecialServiceCharges
    });
    return this.totalSeats + this.totalMealCharges + this.totalSpecialServiceCharges;
  }

  // Getters for state
  getSeatMap(isReturn: boolean = false): any[] {
  return isReturn ? this.seatMapReturn : this.seatMap;
}

  getSelectedSeats(isReturn: boolean = false): { [segmentIndex: number]: any[] } {
    return isReturn ? this.selectedSeatsReturn : this.selectedSeats;
  }

  // getSelectedSeatsFinal(): any[] {
  //   return this.selectedSeatsFinal;
  // }

  getSelectedSeatsFinal(isReturn: boolean = false): SelectedSeatFinal[] {
    const filteredSeats = this.selectedSeatsFinal.filter(seat => seat.isReturn === isReturn);
    console.log(`getSelectedSeatsFinal called with isReturn=${isReturn}, returning:`, filteredSeats);
    return filteredSeats;
  }

  // getSelectedMealsFinal(): any[] {
  //   console.log('getSelectedMealsFinal called, returning:', this.selectedMealsFinal);
  //   return this.selectedMealsFinal;
  // }

  

  getSelectedMealsFinal(isReturn: boolean = false): SelectedMealFinal[] {
    const filteredMeals = this.selectedMealsFinal.filter(meal => meal.isReturn === isReturn);
    console.log(`getSelectedMealsFinal called with isReturn=${isReturn}, returning:`, filteredMeals);
    return filteredMeals;
  }

//  getSelectedServices(isReturn: boolean = false): SelectedServiceFinal[] {
//     const filteredServices = this.selectedServicesFinal.filter(service => service.isReturn === isReturn);
//     console.log(`getSelectedServices called with isReturn=${isReturn}, returning:`, filteredServices);
//     return filteredServices;
// }

// getSelectedServices(isReturn: boolean = false): SelectedServiceFinal[] {
//   const filteredServices = this.selectedServicesFinal.filter(service => service.isReturn === isReturn).map(service => ({
//     passengerIndex: service.passengerIndex,
//     segmentIndex: 0, // Special services are journey-wide, not segment-specific
//     isReturn: service.isReturn,
//     WayType: service.WayType,
//     Description: service.Description,
//     service: {
//       AirlineCode: service.service.AirlineCode || '',
//       FlightNumber: service.service.FlightNumber || '',
//       Code: service.service.Code,
//       Currency: service.service.Currency || 'INR',
//       Price: service.service.Price || 0,
//       Origin: service.service.Origin,
//       Destination: service.service.Destination,
//       WayType: service.WayType,
//       Description: service.service.Description || '2',
//       isReturn: service.isReturn
//     }
//   }));

//   console.log(`getSelectedServices called with isReturn=${isReturn}, returning:`, filteredServices);
//   return filteredServices;
// }

getSelectedServices(isReturn: boolean = false): SelectedServiceFinal[] {
  const filteredServices = this.selectedServicesFinal.filter(service => service.isReturn === isReturn).map(service => ({
    passengerIndex: service.passengerIndex,
    segmentIndex: 0,
    isReturn: service.isReturn,
    WayType: service.WayType,
    Description: service.Description,
    service: {
      AirlineCode: service.service.AirlineCode || '',
      FlightNumber: service.service.FlightNumber || '',
      Code: service.service.Code,
      Currency: service.service.Currency || 'INR',
      Price: service.service.Price || 0,
      Origin: service.service.Origin,
      Destination: service.service.Destination,
      WayType: service.WayType,
      Description: service.service.Description || '2',
      isReturn: service.isReturn
    }
  }));

  console.log(`getSelectedServices called with isReturn=${isReturn}, returning:`, JSON.parse(JSON.stringify(filteredServices)));
  return filteredServices;
}

  

  getHasSeatsAvailable(isReturn: boolean = false): boolean[] {
    return isReturn ? this.hasSeatsAvailableReturn : this.hasSeatsAvailable;
  }

  getPriceCategories(): any[] {
    return this.priceCategories;
  }

  // Placeholder for flight segments (to be set by component)
  private flightSegments: any[] = [];
  private flightSegmentsReturn: any[] = [];

  setFlightSegments(segments: any[], isReturn: boolean = false): void {
    if (isReturn) {
      this.flightSegmentsReturn = segments;
    } else {
      this.flightSegments = segments;
    }
  }

 getFlightSegments(isReturn: boolean = false): any[] {
  return isReturn ? this.flightSegmentsReturn : this.flightSegments;
}

  getFlightSegmentsReturn(): any[] {
    return this.flightSegmentsReturn;
  }

  // Utility method for WayType
  private getWayType(origin: string, destination: string): number {
    const outboundCodes = this.flightSegments.map(s => `${s.originCode}-${s.destinationCode}`);
    const code = `${origin}-${destination}`;
    return outboundCodes.includes(code) ? 2 : 3;
  }

  getSeatTotalPrice(segmentIndex: number, isReturn: boolean = false): number {
    const selected = isReturn ? this.selectedSeatsReturn : this.selectedSeats;
    const seats = selected[segmentIndex] || [];
    return seats.reduce((total: number, seat: any) => total + (seat?.Price || 0), 0);
  }

  setBaggageSelection(baggage: Baggage, passengerIndex: number, isReturn: boolean): void {
    this.selectedBaggageFinal = this.selectedBaggageFinal.filter(
      b => !(b.passengerIndex === passengerIndex && b.isReturn === isReturn)
    );
    if (baggage.code !== 'NoBaggage') {
      this.selectedBaggageFinal.push({
        passengerIndex,
        baggage: { ...baggage },
        isReturn,
        WayType: isReturn ? 3 : 2,
        Description: '2'
      });
    }
  }

  getSelectedBaggageFinal(): SelectedBaggageFinal[] {
    return this.selectedBaggageFinal;
  }

  // Cleanup
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}