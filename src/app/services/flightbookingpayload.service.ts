import { Injectable } from '@angular/core';
import { FlightaddonsService } from './flightaddons.service';

interface Contact {
  countryCode : string;
  mobile: string;
  email: string;
}

interface GSTInfo {
  companyName: string;
  registrationNo: string;
}

interface SSRSegment {
  originCode: string;
  destinationCode: string;
  code: string;
  aircraft: string;
}

interface BaggageItem {
  Code: string;
  [key: string]: any;
}

// Assumed SSR data structure (passed to the method or accessed via flightAddonsService)
// interface SSRData {
//   passengerIndex: number;
//   segmentIndex: number;
//   isReturn: boolean;
//   seat?: {
//     Code: string; // e.g., 'NoSeat' or actual seat code
//     AirlineCode?: string;
//     FlightNumber?: string;
//     CraftType?: string;
//     Origin?: string;
//     Destination?: string;
//     AvailablityType?: number;
//     Description?: string;
//     RowNo?: string;
//     SeatNo?: string | null;
//     SeatType?: number;
//     SeatWayType?: number;
//     Compartment?: number;
//     Deck?: number;
//     Currency?: string;
//     Price?: number;
//   };
// }

@Injectable({
  providedIn: 'root'
})
export class FlightbookingpayloadService 
// {
//   constructor(private flightAddonsService: FlightaddonsService) {}

//   generateBookingPayload(
//     isLCC: boolean,
//     flightData: {
//       adultFareDetail: any;
//       childrenFareDetail?: any;
//       infantFareDetail?: any;
//       fareCommonDetail?: any;
//       adultBaseFare: number;
//       adultTaxes: number;
//       adultBaseFareReturn?: number;
//       adultTaxesReturn?: number;
//       childrenBaseFare?: number;
//       childrenTaxes?: number;
//       childrenBaseFareReturn?: number;
//       childrenTaxesReturn?: number;
//       infantBaseFare?: number;
//       infantTaxes?: number;
//       infantBaseFareReturn?: number;
//       infantTaxesReturn?: number;
//       flightSegments: any[];
//       flightSegmentsReturn?: any[];
//       isReturn: boolean;
//       baggage: any[];
//     },
//     bookingParams: {
//       tboToken: string;
//       traceId: string;
//       resultIndex: string;
//       ipAddress: string;
//     },
//     passengers: {
//       adults: any[];
//       children: any[];
//       infants: any[];
//     },
//     contact: Contact,
//     gstInfo: GSTInfo,
//     gstMandatory: boolean,
//     passportInfoRequired: boolean
//   ): any {
//     const {
//       adultFareDetail,
//       childrenFareDetail,
//       infantFareDetail,
//       fareCommonDetail,
//       adultBaseFare,
//       adultTaxes,
//       adultBaseFareReturn,
//       adultTaxesReturn,
//       childrenBaseFare,
//       childrenTaxes,
//       childrenBaseFareReturn,
//       childrenTaxesReturn,
//       infantBaseFare,
//       infantTaxes,
//       infantBaseFareReturn,
//       infantTaxesReturn,
//       flightSegments,
//       flightSegmentsReturn,
//       isReturn
//     } = flightData;

//     const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//     const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//       let fareDetail;
//       switch (type) {
//         case 1: fareDetail = adultFareDetail; break;
//         case 2: fareDetail = childrenFareDetail; break;
//         case 3: fareDetail = infantFareDetail; break;
//         default: return {};
//       }

//       if (isLCC) {
//         return {
//           Currency: fareDetail?.Currency || 'INR',
//           // BaseFare: isReturnJourney
//           //   ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare || 0
//           //   : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0,
//           // Tax: isReturnJourney
//           //   ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes || 0
//           //   : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0,

//           BaseFare : fareDetail?.BaseFare,
//           Tax : fareDetail?.Tax,
//           YQTax: fareDetail?.YQTax || 0,
//           AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//           AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//           OtherCharges: fareDetail?.OtherCharges || 0
//         };
//       }

//       return {
//         Currency: fareCommonDetail?.Currency || 'INR',
//         BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//         Tax: fareCommonDetail?.Tax || (isReturnJourney
//           ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//           : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//         YQTax: fareCommonDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareCommonDetail?.OtherCharges || 0,
//         Discount: fareCommonDetail?.Discount || 0,
//         PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//         OfferedFare: fareCommonDetail?.OfferedFare || 0,
//         TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//         TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//         TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//         ServiceFee: fareCommonDetail?.ServiceFee || 0
//       };
//     };

//     const extractMealDynamic = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//       return {
//         AirlineCode: segment.code.split(' ')[0],
//         FlightNumber: segment.code.split(' ')[1],
//         WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
//         Code: mealSelection?.meal?.Code ?? 'NoMeal',
//         Description: mealSelection?.Description ?? '2',
//         AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
//         Quantity: mealSelection?.meal?.Quantity ?? 0,
//         Currency: mealSelection?.meal?.Currency ?? 'INR',
//         Price: mealSelection?.meal?.Price ?? 0,
//         Origin: segment.originCode,
//         Destination: segment.destinationCode
//       };
//     };

//     const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//       console.log("Extract Seat",segment)
//       console.log("Extract Seat",seatSelection)
      
//       if (!seatSelection?.seat) {
//         return {
//           AirlineCode: segment.code.split(' ')[0],
//           FlightNumber: segment.code.split(' ')[1],
//           CraftType: segment.aircraft || '737',
//           Origin: segment.originCode,
//           Destination: segment.destinationCode,
//           AvailablityType: 0,
//           Description: '2',
//           Code: 'NoSeat',
//           RowNo: '0',
//           SeatNo: null,
//           SeatType: 0,
//           SeatWayType: isReturnJourney ? 3 : 1,
//           Compartment: 0,
//           Deck: 0,
//           Currency: 'INR',
//           Price: 0
//         };
//       }

//       return {
//         AirlineCode: seatSelection.seat.AirlineCode,
//         FlightNumber: seatSelection.seat.FlightNumber,
//         CraftType: seatSelection.seat.CraftType,
//         Origin: seatSelection.seat.Origin,
//         Destination: seatSelection.seat.Destination,
//         AvailablityType: seatSelection.seat.AvailablityType,
//         Description: seatSelection.Description,
//         Code: seatSelection.seat.Code,
//         RowNo: seatSelection.seat.RowNo,
//         SeatNo: seatSelection.seat.SeatNo,
//         SeatType: seatSelection.seat.SeatType,
//         SeatWayType: seatSelection.WayType,
//         Compartment: seatSelection.seat.Compartment,
//         Deck: seatSelection.seat.Deck,
//         Currency: seatSelection.seat.Currency,
//         Price: seatSelection.seat.Price
//       };
//     };

//     const buildPassenger = (
//       person: any,
//       paxType: number,
//       localIndex: number,
//       globalIndex: number,
//       isLead: boolean,
//       isReturnJourney: boolean
//     ): any => {
//       const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//       const meals = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             AirlineCode: seg.code.split(' ')[0],
//             FlightNumber: seg.code.split(' ')[1],
//             WayType: isReturnJourney ? 3 : 1,
//             Code: 'NoMeal',
//             Description: '2',
//             AirlineDescription: '',
//             Quantity: 0,
//             Currency: 'INR',
//             Price: 0,
//             Origin: seg.originCode,
//             Destination: seg.destinationCode
//           };
//         }

//         const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//           m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//         );
//         return extractMealDynamic(seg, mealSelection, isReturnJourney);
//       }) || [];

//       const seats = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             AirlineCode: seg.code.split(' ')[0],
//             FlightNumber: seg.code.split(' ')[1],
//             CraftType: seg.aircraft || '737',
//             Origin: seg.originCode,
//             Destination: seg.destinationCode,
//             AvailablityType: 0,
//             Description: '2',
//             Code: 'NoSeat',
//             RowNo: '0',
//             SeatNo: null,
//             SeatType: 0,
//             SeatWayType: isReturnJourney ? 3 : 1,
//             Compartment: 0,
//             Deck: 0,
//             Currency: 'INR',
//             Price: 0
//           };
//         }

//         const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//           s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//         );
//         return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//       }) || [];

//       const specialServices = isLead ? // Only lead passenger gets special services
//         this.flightAddonsService.selectedServicesFinal
//           .filter(s => s.service.isReturn === isReturnJourney)
//           .map(s => this.extractSpecialServiceDynamic(
//             {
//               code: segments?.[0]?.code || '',
//               originCode: segments?.[0]?.originCode || '',
//               destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//             },
//             s,
//             isReturnJourney
//           )) : [];

//       const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 ? // Exclude infants and check for baggage
//         [{
//           AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//           WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
//           Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
//           Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//           Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//           Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//           Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//           Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//           Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//         }] : [{
//           AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
//           WayType: isReturnJourney ? 3 : 2,
//           Code: 'NoBaggage',
//           Description: '2',
//           Weight: '0',
//           Currency: 'INR',
//           Price: 0,
//           Origin: segments?.[0]?.originCode || '',
//           Destination: segments?.[segments.length - 1]?.destinationCode || ''
//         }];

//       let dob = '1987-12-06';
//       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//         const yyyy = person.dateOfBirth.getFullYear();
//         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         dob = `${yyyy}-${mm}-${dd}`;
//       }

//       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//       let passportExpiry = '';
//       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//         const yyyy = person.passportExpiryDate.getFullYear();
//         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       let passportIssueDate = '';
//       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//         const yyyy = person.passportIssueDate.getFullYear();
//         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       return {
//         Title: title,
//         FirstName: person.firstName,
//         LastName: person.lastName,
//         PaxType: paxType,
//         DateOfBirth: `${dob}T00:00:00`,
//         Gender: person.gender === 'FEMALE' ? 2 : 1,
//         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//         PassportExpiry: passportExpiry,
//         PassportIssueDate : passportIssueDate,
//         PassportIssueCountryCode : person.passportIssueCountryCode,
//         AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//         AddressLine2: '',
//         Fare: generateFare(paxType, isReturnJourney),
//         City: 'Siliguri',
//         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CountryName: 'India',
//         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CellCountryCode: '+91',
//         ContactNo: contact.mobile,
//         Email: contact.email,
//         IsLeadPax: isLead,
//         FFAirlineCode: null,
//         FFNumber: null,
//         Baggage: baggage,
//         MealDynamic: meals,
//         SeatDynamic: seats,
//         SpecialServices: specialServices,
//         ...(isLead && gstMandatory ? {
//           GSTCompanyAddress: gstInfo.companyName || '',
//           GSTCompanyContactNumber: contact.mobile || '',
//           GSTCompanyName: gstInfo.companyName || '',
//           GSTNumber: gstInfo.registrationNo || '',
//           GSTCompanyEmail: contact.email || ''
//         } : {})
//       };
//     };

//     // const buildPassengerNonLCC = (
//     //   person: any,
//     //   paxType: number,
//     //   globalIndex: number,
//     //   isLead: boolean
//     // ): any => {
//     //   const segments = flightSegments; // Use outbound segments for non-LCC
//     //   const monthMap: { [key: string]: string } = {
//     //     January: '01',
//     //     February: '02',
//     //     March: '03',
//     //     April: '04',
//     //     May: '05',
//     //     June: '06',
//     //     July: '07',
//     //     August: '08',
//     //     September: '09',
//     //     October: '10',
//     //     November: '11',
//     //     December: '12'
//     //   };

//     //   const dobMonth = typeof person.dobMonth === 'string'
//     //     ? monthMap[person.dobMonth]
//     //     : person.dobMonth?.toString().padStart(2, '0');

//     //   const dob = person.dobYear && dobMonth && person.dobDay
//     //     ? `${person.dobYear}-${dobMonth}-${person.dobDay.toString().padStart(2, '0')}`
//     //     : '1987-12-06';

//     //   const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     //   const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
//     //     m => m.passengerIndex === globalIndex && m.segmentIndex === 0 && !m.isReturn
//     //   );

//     //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//     //     s => s.passengerIndex === globalIndex && s.segmentIndex === 0 && !s.isReturn
//     //   );

//     //   // Use MealDynamic for selected meals, Meal for preferences
//     //   const mealDynamic = mealSelection?.meal && mealSelection.meal.Code !== 'NoMeal'
//     //     ? extractMealDynamic(segments?.[0], mealSelection, false)
//     //     : null;
//     //   const meal = mealSelection?.meal && mealSelection.meal.Code === 'NoMeal'
//     //     ? { Code: mealSelection.meal.Code, Description: mealSelection.meal.Description || '' }
//     //     : null;

//     //   // Use SeatDynamic for selected seats, Seat for preferences
//     //   const seatDynamic = seatSelection?.seat && seatSelection.seat.Code !== 'NoSeat'
//     //     ? extractSeatDynamic(segments?.[0], seatSelection, false)
//     //     : null;
//     //   const seat = seatSelection?.seat && seatSelection.seat.Code === 'NoSeat'
//     //     ? { Code: seatSelection.seat.Code, Description: seatSelection.Description || '' }
//     //     : null;

//     //   const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ? // Exclude infants and NoBaggage
//     //     [{
//     //       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//     //       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//     //       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || 2,
//     //       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//     //       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//     //       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//     //       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//     //       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//     //       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.code.split(' ')[0] || '',
//     //       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//     //     }] : null;

//     //   const specialServices = isLead ? // Only lead passenger gets special services
//     //     this.flightAddonsService.selectedServices
//     //       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService')
//     //       .map(s => this.extractSpecialServiceDynamic(
//     //         {
//     //           code: segments?.[0]?.code || '',
//     //           originCode: segments?.[0]?.code.split(' ')[0] || '',
//     //           destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//     //         },
//     //         s,
//     //         false
//     //       )) : null;

//     //   const expiryMonth = typeof person.passportExpiryMonth === 'string'
//     //     ? monthMap[person.passportExpiryMonth]
//     //     : person.passportExpiryMonth?.toString().padStart(2, '0');

//     //   const passportExpiry = passportInfoRequired &&
//     //     person.passportExpiryYear && expiryMonth && person.passportExpiryDay
//     //     ? `${person.passportExpiryYear}-${expiryMonth}-${person.passportExpiryDay.toString().padStart(2, '0')}T00:00:00`
//     //     : '';

//     //   return {
//     //     Title: title,
//     //     FirstName: person.firstName,
//     //     LastName: person.lastName,
//     //     PaxType: paxType,
//     //     DateOfBirth: `${dob}T00:00:00`,
//     //     Gender: person.gender === 'FEMALE' ? 2 : 1,
//     //     PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//     //     PassportExpiry: passportExpiry,
//     //     AddressLine1: '123, Test',
//     //     AddressLine2: '',
//     //     Fare: generateFare(paxType, false),
//     //     City: 'Gurgaon',
//     //     CountryCode: 'IN',
//     //     CellCountryCode: '+92581-',
//     //     ContactNo: contact.mobile,
//     //     Nationality: 'IN',
//     //     Email: contact.email,
//     //     IsLeadPax: isLead,
//     //     FFAirlineCode: null,
//     //     FFNumber: '',
//     //     GSTCompanyAddress: '',
//     //     GSTCompanyContactNumber: '',
//     //     GSTCompanyName: '',
//     //     GSTNumber: '',
//     //     GSTCompanyEmail: '',
//     //     ...(mealDynamic ? { MealDynamic: mealDynamic } : {}),
//     //     ...(meal ? { Meal: meal } : {}),
//     //     ...(seatDynamic ? { SeatDynamic: seatDynamic } : {}),
//     //     ...(seat ? { Seat: seat } : {}),
//     //     ...(baggage ? { Baggage: baggage } : {}),
//     //     ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
//     //   };
//     // };

//     // const buildPassengerNonLCC = (
//     //   person: any,
//     //   paxType: number,
//     //   globalIndex: number,
//     //   isLead: boolean,
//     //   isReturnJourney: boolean = false // Add isReturnJourney parameter
//     // ): any => {
//     //   const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments; // Use return segments if applicable
//     //   const monthMap: { [key: string]: string } = {
//     //     January: '01',
//     //     February: '02',
//     //     March: '03',
//     //     April: '04',
//     //     May: '05',
//     //     June: '06',
//     //     July: '07',
//     //     August: '08',
//     //     September: '09',
//     //     October: '10',
//     //     November: '11',
//     //     December: '12'
//     //   };

//     //   let dob = '1987-12-06';
//     //   if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//     //     const yyyy = person.dateOfBirth.getFullYear();
//     //     const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//     //     const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//     //     dob = `${yyyy}-${mm}-${dd}`;
//     //   }

//     //   const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     //   const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//     //     m => m.passengerIndex === globalIndex && m.segmentIndex === 0 && m.isReturn === isReturnJourney
//     //   );

//     //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//     //     s => s.passengerIndex === globalIndex && s.segmentIndex === 0 && s.isReturn === isReturnJourney
//     //   );

//     //   // Use MealDynamic for selected meals, Meal for preferences


//     //   const mealDynamic = mealSelection?.meal && mealSelection.meal.Code !== 'NoMeal'
//     //     ? extractMealDynamic(segments?.[0], mealSelection, isReturnJourney)
//     //     : null;
//     //   const meal = mealSelection?.meal && mealSelection.meal.Code === 'NoMeal'
//     //     ? { Code: mealSelection.meal.Code, Description: mealSelection.meal.Description || '' }
//     //     : null;

    


//     //   const seatDynamic = seatSelection?.seat && seatSelection.seat.Code !== 'NoSeat'
//     //     ? extractSeatDynamic(segments?.[0], seatSelection, isReturnJourney)
//     //     : null;
//     //   const seat = seatSelection?.seat && seatSelection.seat.Code === 'NoSeat'
//     //     ? { Code: seatSelection.seat.Code, Description: seatSelection.Description || '' }
//     //     : null;

//     //   const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ? // Exclude infants and NoBaggage
//     //     [{
//     //       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//     //       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//     //       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || 2,
//     //       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//     //       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//     //       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//     //       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//     //       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//     //       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.code.split(' ')[0] || '',
//     //       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//     //     }] : null;

//     //   const specialServices = isLead ? // Only lead passenger gets special services
//     //     this.flightAddonsService.selectedServicesFinal
//     //       .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService')
//     //       .map(s => this.extractSpecialServiceDynamic(
//     //         {
//     //           code: segments?.[0]?.code || '',
//     //           originCode: segments?.[0]?.originCode || '',
//     //           destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//     //         },
//     //         s,
//     //         isReturnJourney
//     //       )) : null;

//     //    let passportExpiry = '';
//     //     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//     //       const yyyy = person.passportExpiryDate.getFullYear();
//     //       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//     //       const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//     //       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     //     }

//     //     console.log("Passsport Required",passportInfoRequired)
//     //     console.log("Passsport Number",person.passportNumber)
//     //     console.log("Passsport Expiry",passportExpiry)
//     //     console.log("Passsport Expiry",person.passportExpiry)

//     //   return {
//     //     Title: title,
//     //     FirstName: person.firstName,
//     //     LastName: person.lastName,
//     //     PaxType: paxType,
//     //     DateOfBirth: `${dob}T00:00:00`,
//     //     Gender: person.gender === 'FEMALE' ? 2 : 1,
//     //     PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//     //     PassportExpiry: passportExpiry,
//     //     AddressLine1: '123, Test',
//     //     AddressLine2: '',
//     //     Fare: generateFare(paxType, isReturnJourney),
//     //     City: 'Gurgaon',
//     //     CountryCode: 'IN',
//     //     CellCountryCode: '+92581-',
//     //     ContactNo: contact.mobile,
//     //     Nationality: 'IN',
//     //     Email: contact.email,
//     //     IsLeadPax: isLead,
//     //     FFAirlineCode: null,
//     //     FFNumber: '',
//     //     GSTCompanyAddress: '',
//     //     GSTCompanyContactNumber: '',
//     //     GSTCompanyName: '',
//     //     GSTNumber: '',
//     //     GSTCompanyEmail: '',
//     //     ...(mealDynamic ? { MealDynamic: mealDynamic } : {}),
//     //     ...(meal ? { Meal: meal } : {}),
//     //     ...(seatDynamic ? { SeatDynamic: seatDynamic } : {}),
//     //     ...(seat ? { Seat: seat } : {}),
//     //     ...(baggage ? { Baggage: baggage } : {}),
//     //     ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
//     //   };
//     // };

// //   const buildPassengerNonLCC = (
// //   person: any,
// //   paxType: number,
// //   globalIndex: number,
// //   isLead: boolean,
// //   isReturnJourney: boolean = false
// // ): any => {
// //   const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
// //   const monthMap: { [key: string]: string } = {
// //     January: '01',
// //     February: '02',
// //     March: '03',
// //     April: '04',
// //     May: '05',
// //     June: '06',
// //     July: '07',
// //     August: '08',
// //     September: '09',
// //     October: '10',
// //     November: '11',
// //     December: '12'
// //   };

// //   let dob = '1987-12-06';
// //   if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
// //     const yyyy = person.dateOfBirth.getFullYear();
// //     const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
// //     const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
// //     dob = `${yyyy}-${mm}-${dd}`;
// //   }

// //   const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

// //   // Handle meals for all segments
// //   const meals = segments?.map((seg, segIndex) => {
// //     if (paxType === 3) {
// //       return {
// //         Code: 'NoMeal',
// //         Description: '2'
// //       };
// //     }

// //     const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
// //       m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
// //     );

// //     if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
// //       return {
// //         Code: 'NoMeal',
// //         Description: '2'
// //       };
// //     }

// //     // Check if meal is a Meal item (only Code and Description)
// //     const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
// //     if (isMeal) {
// //       return {
// //         Code: mealSelection.meal.Code,
// //         Description: mealSelection.meal.Description || '2'
// //       };
// //     }

// //     // MealDynamic item
// //     return {
// //       AirlineCode: seg.code.split(' ')[0],
// //       FlightNumber: seg.code.split(' ')[1],
// //       WayType: mealSelection.WayType,
// //       Code: mealSelection.meal.Code ?? 'NoMeal',
// //       Description: mealSelection.Description || '2',
// //       AirlineDescription: mealSelection.meal.AirlineDescription || '',
// //       Quantity: mealSelection.meal.Quantity || 0,
// //       Currency: mealSelection?.meal['Currency'] || 'INR',
// //       Price: mealSelection.meal.Price || 0,
// //       Origin: seg.originCode,
// //       Destination: seg.destinationCode
// //     };
// //   }) || [];

// //   // Handle seats for all segments
// //   const seats = segments?.map((seg, segIndex) => {
// //     if (paxType === 3) {
// //       return {
// //         Code: 'NoSeat',
// //         Description: '2'
// //       };
// //     }

// //     const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
// //       s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
// //     );

// //     if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
// //       return {
// //         Code: 'NoSeat',
// //         Description: '2'
// //       };
// //     }

// //     return {
// //       AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
// //       FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
// //       CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
// //       Origin: seatSelection.seat.Origin || seg.originCode,
// //       Destination: seatSelection.seat.Destination || seg.destinationCode,
// //       AvailablityType: seatSelection.seat['AvailablityType'] || 0,
// //       Description: seatSelection.Description || '2',
// //       Code: seatSelection.seat.Code,
// //       RowNo: seatSelection.seat['RowNo'] || '0',
// //       SeatNo: seatSelection.seat.SeatNo || null,
// //       SeatType: seatSelection.seat['SeatType'] || 0,
// //       SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
// //       Compartment: seatSelection.seat['Compartment'] || 0,
// //       Deck: seatSelection.seat['Deck'] || 0,
// //       Currency: seatSelection.seat['Currency'] || 'INR',
// //       Price: seatSelection.seat.Price || 0
// //     };
// //   }) || [];

// //   const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ?
// //     [{
// //       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
// //       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
// //       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
// //       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
// //       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
// //       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
// //       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
// //       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
// //       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
// //       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
// //     }] : null;

// //   const specialServices = isLead ?
// //     this.flightAddonsService.selectedServicesFinal
// //       .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService')
// //       .map(s => this.extractSpecialServiceDynamic(
// //         {
// //           code: segments?.[0]?.code || '',
// //           originCode: segments?.[0]?.originCode || '',
// //           destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
// //         },
// //         s,
// //         isReturnJourney
// //       )) : null;

// //   let passportExpiry = '';
// //   if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
// //     const yyyy = person.passportExpiryDate.getFullYear();
// //     const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
// //     const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
// //     passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
// //   }

// //   // Construct meal and seat objects for payload
// //   const mealPayload = meals.some(m => m.Code !== 'NoMeal') ? (
// //     meals.every(m => !m.FlightNumber && !m.Origin && !m.Destination) ?
// //       { Meal: meals } :
// //       { MealDynamic: meals.filter(m => m.FlightNumber && m.Origin && m.Destination) }
// //   ) : {};

// //   const seatPayload = seats.some(s => s.Code !== 'NoSeat') ?
// //     { SeatDynamic: seats.filter(s => s.Code !== 'NoSeat') } :
// //     {};

// //   return {
// //     Title: title,
// //     FirstName: person.firstName,
// //     LastName: person.lastName,
// //     PaxType: paxType,
// //     DateOfBirth: `${dob}T00:00:00`,
// //     Gender: person.gender === 'FEMALE' ? 2 : 1,
// //     PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
// //     PassportExpiry: passportExpiry,
// //     AddressLine1: '123, Test',
// //     AddressLine2: '',
// //     Fare: generateFare(paxType, isReturnJourney),
// //     City: 'Gurgaon',
// //     CountryCode: 'IN',
// //     CellCountryCode: '+92581-',
// //     ContactNo: contact.mobile,
// //     Nationality: 'IN',
// //     Email: contact.email,
// //     IsLeadPax: isLead,
// //     FFAirlineCode: null,
// //     FFNumber: '',
// //     GSTCompanyAddress: '',
// //     GSTCompanyContactNumber: '',
// //     GSTCompanyName: '',
// //     GSTCompanyEmail: '',
// //     ...mealPayload,
// //     ...seatPayload,
// //     ...(baggage ? { Baggage: baggage } : {}),
// //     ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
// //   };
// // }

// const buildPassengerNonLCC = (
//   person: any,
//   paxType: number,
//   globalIndex: number,
//   isLead: boolean,
//   isReturnJourney: boolean = false
// ): any => {
//   const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//   const monthMap: { [key: string]: string } = {
//     January: '01',
//     February: '02',
//     March: '03',
//     April: '04',
//     May: '05',
//     June: '06',
//     July: '07',
//     August: '08',
//     September: '09',
//     October: '10',
//     November: '11',
//     December: '12'
//   };

//   let dob = '1987-12-06';
//   if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//     const yyyy = person.dateOfBirth.getFullYear();
//     const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//     const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//     dob = `${yyyy}-${mm}-${dd}`;
//   }

//   const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//   // Handle meals for all segments
//   const meals = segments?.map((seg, segIndex) => {
//     if (paxType === 3) {
//       return {
//         Code: 'NoMeal',
//         Description: '2'
//       };
//     }

//     const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//       m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//     );

//     if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
//       return {
//         Code: 'NoMeal',
//         Description: '2'
//       };
//     }

//     // Check if meal is a Meal item (only Code and Description)
//     const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
//     if (isMeal) {
//       return {
//         Code: mealSelection.meal.Code,
//         Description: mealSelection.meal.Description || '2'
//       };
//     }

//     // MealDynamic item
//     return {
//       AirlineCode: seg.code.split(' ')[0],
//       FlightNumber: seg.code.split(' ')[1],
//       WayType: mealSelection.WayType,
//       Code: mealSelection.meal.Code ?? 'NoMeal',
//       Description: mealSelection.Description || '2',
//       AirlineDescription: mealSelection.meal.AirlineDescription || '',
//       Quantity: mealSelection.meal.Quantity || 0,
//       Currency: mealSelection?.meal['Currency'] || 'INR',
//       Price: mealSelection.meal.Price || 0,
//       Origin: seg.originCode,
//       Destination: seg.destinationCode
//     };
//   }) || [];

//   // Handle seats for all segments
//   const seats = segments?.map((seg, segIndex) => {
//     if (paxType === 3) {
//       return {
//         Code: 'NoSeat',
//         Description: '2'
//       };
//     }

//     const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//       s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//     );

//     if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
//       return {
//         Code: 'NoSeat',
//         Description: '2'
//       };
//     }

//     return {
//       AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
//       FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
//       CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
//       Origin: seatSelection.seat.Origin || seg.originCode,
//       Destination: seatSelection.seat.Destination || seg.destinationCode,
//       AvailablityType: seatSelection.seat['AvailablityType'] || 0,
//       Description: seatSelection.Description || '2',
//       Code: seatSelection.seat.Code,
//       RowNo: seatSelection.seat['RowNo'] || '0',
//       SeatNo: seatSelection.seat.SeatNo || null,
//       SeatType: seatSelection.seat['SeatType'] || 0,
//       SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
//       Compartment: seatSelection.seat['Compartment'] || 0,
//       Deck: seatSelection.seat['Deck'] || 0,
//       Currency: seatSelection.seat['Currency'] || 'INR',
//       Price: seatSelection.seat.Price || 0
//     };
//   }) || [];

//   const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ?
//     [{
//       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
//       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//     }] : null;

//   const specialServices = isLead ?
//     this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService')
//       .map(s => this.extractSpecialServiceDynamic(
//         {
//           code: segments?.[0]?.code || '',
//           originCode: segments?.[0]?.originCode || '',
//           destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//         },
//         s,
//         isReturnJourney
//       )) : null;

//   let passportExpiry = '';
//   if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//     const yyyy = person.passportExpiryDate.getFullYear();
//     const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//     const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//     passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//   }

//    let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//   // Construct meal and seat objects for payload
//   const validMeals = meals.filter(m => m.Code !== 'NoMeal');
//   const mealPayload = validMeals.length > 0 ? (
//     validMeals.every(m => !m.FlightNumber && !m.Origin && !m.Destination) && validMeals.length === 1 ?
//       { Meal: validMeals[0] } :
//       { MealDynamic: meals.filter(m => m.FlightNumber && m.Origin && m.Destination) }
//   ) : {};

//   const seatPayload = seats.some(s => s.Code !== 'NoSeat') ?
//     { SeatDynamic: seats.filter(s => s.Code !== 'NoSeat') } :
//     {};

//   return {
//     Title: title,
//     FirstName: person.firstName,
//     LastName: person.lastName,
//     PaxType: paxType,
//     DateOfBirth: `${dob}T00:00:00`,
//     Gender: person.gender === 'FEMALE' ? 2 : 1,
//     PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//     PassportExpiry: passportExpiry,
//     PassportIssueDate : passportIssueDate,
//     PassportIssueCountryCode : person.passportIssueCountryCode,
//     AddressLine1: '123, Test',
//     AddressLine2: '',
//     Fare: generateFare(paxType, isReturnJourney),
//     City: 'Gurgaon',
//     CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//     CellCountryCode: '+91',
//     ContactNo: contact.mobile,
//     Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//     Email: contact.email,
//     IsLeadPax: isLead,
//     FFAirlineCode: null,
//     FFNumber: '',
//     GSTCompanyAddress: '',
//     GSTCompanyContactNumber: '',
//     GSTCompanyName: '',
//     GSTCompanyEmail: '',
//     ...mealPayload,
//     ...seatPayload,
//     ...(baggage ? { Baggage: baggage } : {}),
//     ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
//   };
// }

   

//     const passengersList: any[] = [];
//     let globalIndex = 0;

//     if (isLCC) {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, isReturn));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassenger(child, 2, i, globalIndex, false, isReturn));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, isReturn));
//         globalIndex++;
//       });
//     } else {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, isReturn));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, isReturn));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, isReturn));
//         globalIndex++;
//       });
//     }

//     return isLCC ? {
//       PreferredCurrency: 'INR',
//       AgentReferenceNo: `REF${Date.now()}`,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//       TokenId: tboToken,
//       TraceId: traceId,
//       ResultIndex: resultIndex
//     } : {
//       ResultIndex: resultIndex,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//       TokenId: tboToken,
//       TraceId: traceId
//     };
//   }

//   public extractSpecialServiceDynamic(segment: any, serviceSelection: any, isReturn: boolean): any {
//     if (!serviceSelection?.service) {
//       return {
//         AirlineCode: segment.code.split(' ')[0] || '',
//         FlightNumber: segment.code.split(' ')[1] || '',
//         WayType: isReturn ? 3 : 2,
//         Code: 'NoService',
//         Description: '2',
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || '',
//         Destination: segment.destinationCode || ''
//       };
//     }

//     return {
//       AirlineCode: serviceSelection.service.AirlineCode || '',
//       FlightNumber: serviceSelection.service.FlightNumber || '',
//       WayType: serviceSelection.WayType,
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.Description || '2',
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0,
//       Origin: segment.originCode || '',
//       Destination: segment.destinationCode || ''
//     };
//   }
// }

// {
//   constructor(private flightAddonsService: FlightaddonsService) {}

//   generateBookingPayload(
//     isLCC: boolean,
//     flightData: {
//       adultFareDetail: any;
//       childrenFareDetail?: any;
//       infantFareDetail?: any;
//       fareCommonDetail?: any;
//       adultBaseFare: number;
//       adultTaxes: number;
//       adultBaseFareReturn?: number;
//       adultTaxesReturn?: number;
//       childrenBaseFare?: number;
//       childrenTaxes?: number;
//       childrenBaseFareReturn?: number;
//       childrenTaxesReturn?: number;
//       infantBaseFare?: number;
//       infantTaxes?: number;
//       infantBaseFareReturn?: number;
//       infantTaxesReturn?: number;
//       flightSegments: any[];
//       flightSegmentsReturn?: any[];
//       isReturn: boolean;
//       baggage: any[];
//     },
//     bookingParams: {
//       tboToken: string;
//       traceId: string;
//       resultIndex: string;
//       ipAddress: string;
//     },
//     passengers: {
//       adults: any[];
//       children: any[];
//       infants: any[];
//     },
//     contact: Contact,
//     gstInfo: GSTInfo,
//     gstMandatory: boolean,
//     passportInfoRequired: boolean
//   ): any {
//     const {
//       adultFareDetail,
//       childrenFareDetail,
//       infantFareDetail,
//       fareCommonDetail,
//       adultBaseFare,
//       adultTaxes,
//       adultBaseFareReturn,
//       adultTaxesReturn,
//       childrenBaseFare,
//       childrenTaxes,
//       childrenBaseFareReturn,
//       childrenTaxesReturn,
//       infantBaseFare,
//       infantTaxes,
//       infantBaseFareReturn,
//       infantTaxesReturn,
//       flightSegments,
//       flightSegmentsReturn,
//       isReturn
//     } = flightData;

//     const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//     const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//       let fareDetail;
//       switch (type) {
//         case 1: fareDetail = adultFareDetail; break;
//         case 2: fareDetail = childrenFareDetail; break;
//         case 3: fareDetail = infantFareDetail; break;
//         default: return {};
//       }

//       if (isLCC) {
//         return {
//           Currency: fareDetail?.Currency || 'INR',
//           BaseFare: fareDetail?.BaseFare,
//           Tax: fareDetail?.Tax,
//           YQTax: fareDetail?.YQTax || 0,
//           AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//           AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//           OtherCharges: fareDetail?.OtherCharges || 0
//         };
//       }

//       return {
//         Currency: fareCommonDetail?.Currency || 'INR',
//         BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//         Tax: fareCommonDetail?.Tax || (isReturnJourney
//           ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//           : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//         YQTax: fareCommonDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareCommonDetail?.OtherCharges || 0,
//         Discount: fareCommonDetail?.Discount || 0,
//         PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//         OfferedFare: fareCommonDetail?.OfferedFare || 0,
//         TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//         TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//         TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//         ServiceFee: fareCommonDetail?.ServiceFee || 0
//       };
//     };

//     const extractMealDynamic = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//       return {
//         AirlineCode: segment.code.split(' ')[0],
//         FlightNumber: segment.code.split(' ')[1],
//         WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
//         Code: mealSelection?.meal?.Code ?? 'NoMeal',
//         Description: mealSelection?.Description ?? '2',
//         AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
//         Quantity: mealSelection?.meal?.Quantity ?? 0,
//         Currency: mealSelection?.meal?.Currency ?? 'INR',
//         Price: mealSelection?.meal?.Price ?? 0,
//         Origin: segment.originCode,
//         Destination: segment.destinationCode
//       };
//     };

//     const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//       if (!seatSelection?.seat) {
//         return {
//           AirlineCode: segment.code.split(' ')[0],
//           FlightNumber: segment.code.split(' ')[1],
//           CraftType: segment.aircraft || '737',
//           Origin: segment.originCode,
//           Destination: segment.destinationCode,
//           AvailablityType: 0,
//           Description: '2',
//           Code: 'NoSeat',
//           RowNo: '0',
//           SeatNo: null,
//           SeatType: 0,
//           SeatWayType: isReturnJourney ? 3 : 1,
//           Compartment: 0,
//           Deck: 0,
//           Currency: 'INR',
//           Price: 0
//         };
//       }

//       return {
//         AirlineCode: seatSelection.seat.AirlineCode,
//         FlightNumber: seatSelection.seat.FlightNumber,
//         CraftType: seatSelection.seat.CraftType,
//         Origin: seatSelection.seat.Origin,
//         Destination: seatSelection.seat.Destination,
//         AvailablityType: seatSelection.seat.AvailablityType,
//         Description: seatSelection.Description,
//         Code: seatSelection.seat.Code,
//         RowNo: seatSelection.seat.RowNo,
//         SeatNo: seatSelection.seat.SeatNo,
//         SeatType: seatSelection.seat.SeatType,
//         SeatWayType: seatSelection.WayType,
//         Compartment: seatSelection.seat.Compartment,
//         Deck: seatSelection.seat.Deck,
//         Currency: seatSelection.seat.Currency,
//         Price: seatSelection.seat.Price
//       };
//     };

//     const buildPassenger = (
//       person: any,
//       paxType: number,
//       localIndex: number,
//       globalIndex: number,
//       isLead: boolean,
//       isReturnJourney: boolean
//     ): any => {
//       const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//       const meals = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             AirlineCode: seg.code.split(' ')[0],
//             FlightNumber: seg.code.split(' ')[1],
//             WayType: isReturnJourney ? 3 : 1,
//             Code: 'NoMeal',
//             Description: '2',
//             AirlineDescription: '',
//             Quantity: 0,
//             Currency: 'INR',
//             Price: 0,
//             Origin: seg.originCode,
//             Destination: seg.destinationCode
//           };
//         }

//         const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//           m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//         );
//         return extractMealDynamic(seg, mealSelection, isReturnJourney);
//       }) || [];

//       const seats = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             AirlineCode: seg.code.split(' ')[0],
//             FlightNumber: seg.code.split(' ')[1],
//             CraftType: seg.aircraft || '737',
//             Origin: seg.originCode,
//             Destination: seg.destinationCode,
//             AvailablityType: 0,
//             Description: '2',
//             Code: 'NoSeat',
//             RowNo: '0',
//             SeatNo: null,
//             SeatType: 0,
//             SeatWayType: isReturnJourney ? 3 : 1,
//             Compartment: 0,
//             Deck: 0,
//             Currency: 'INR',
//             Price: 0
//           };
//         }

//         const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//           s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//         );
//         return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//       }) || [];

//       // Deduplicate special services based on Code
//       const uniqueSpecialServices = new Map();
//       this.flightAddonsService.selectedServicesFinal
//         .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService')
//         .forEach(s => {
//           const service = this.extractSpecialServiceDynamic(
//             {
//               code: segments?.[0]?.code || '',
//               originCode: segments?.[0]?.originCode || '',
//               destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//             },
//             s,
//             isReturnJourney
//           );
//           uniqueSpecialServices.set(service.Code, service);
//         });
//       const specialServices = Array.from(uniqueSpecialServices.values());

//       const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 ? // Exclude infants and check for baggage
//         [{
//           AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//           WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
//           Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
//           Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//           Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//           Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//           Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//           Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//           Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//         }] : [{
//           AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
//           WayType: isReturnJourney ? 3 : 2,
//           Code: 'NoBaggage',
//           Description: '2',
//           Weight: '0',
//           Currency: 'INR',
//           Price: 0,
//           Origin: segments?.[0]?.originCode || '',
//           Destination: segments?.[segments.length - 1]?.destinationCode || ''
//         }];

//       let dob = '1987-12-06';
//       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//         const yyyy = person.dateOfBirth.getFullYear();
//         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         dob = `${yyyy}-${mm}-${dd}`;
//       }

//       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//       let passportExpiry = '';
//       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//         const yyyy = person.passportExpiryDate.getFullYear();
//         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       let passportIssueDate = '';
//       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//         const yyyy = person.passportIssueDate.getFullYear();
//         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       return {
//         Title: title,
//         FirstName: person.firstName,
//         LastName: person.lastName,
//         PaxType: paxType,
//         DateOfBirth: `${dob}T00:00:00`,
//         Gender: person.gender === 'FEMALE' ? 2 : 1,
//         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//         PassportExpiry: passportExpiry,
//         PassportIssueDate: passportIssueDate,
//         PassportIssueCountryCode: person.passportIssueCountryCode,
//         AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//         AddressLine2: '',
//         Fare: generateFare(paxType, isReturnJourney),
//         City: 'Siliguri',
//         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CountryName: 'India',
//         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CellCountryCode: '+91',
//         ContactNo: contact.mobile,
//         Email: contact.email,
//         IsLeadPax: isLead,
//         FFAirlineCode: null,
//         FFNumber: null,
//         Baggage: baggage,
//         MealDynamic: meals,
//         SeatDynamic: seats,
//         SpecialServices: specialServices,
//         ...(isLead && gstMandatory ? {
//           GSTCompanyAddress: gstInfo.companyName || '',
//           GSTCompanyContactNumber: contact.mobile || '',
//           GSTCompanyName: gstInfo.companyName || '',
//           GSTNumber: gstInfo.registrationNo || '',
//           GSTCompanyEmail: contact.email || ''
//         } : {})
//       };
//     };

//     const buildPassengerNonLCC = (
//       person: any,
//       paxType: number,
//       globalIndex: number,
//       isLead: boolean,
//       isReturnJourney: boolean = false
//     ): any => {
//       const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//       const monthMap: { [key: string]: string } = {
//         January: '01',
//         February: '02',
//         March: '03',
//         April: '04',
//         May: '05',
//         June: '06',
//         July: '07',
//         August: '08',
//         September: '09',
//         October: '10',
//         November: '11',
//         December: '12'
//       };

//       let dob = '1987-12-06';
//       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//         const yyyy = person.dateOfBirth.getFullYear();
//         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         dob = `${yyyy}-${mm}-${dd}`;
//       }

//       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//       // Handle meals for all segments
//       const meals = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             Code: 'NoMeal',
//             Description: '2'
//           };
//         }

//         const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//           m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//         );

//         if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
//           return {
//             Code: 'NoMeal',
//             Description: '2'
//           };
//         }

//         // Check if meal is a Meal item (only Code and Description)
//         const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
//         if (isMeal) {
//           return {
//             Code: mealSelection.meal.Code,
//             Description: mealSelection.meal.Description || '2'
//           };
//         }

//         // MealDynamic item
//         return {
//           AirlineCode: seg.code.split(' ')[0],
//           FlightNumber: seg.code.split(' ')[1],
//           WayType: mealSelection.WayType,
//           Code: mealSelection.meal.Code ?? 'NoMeal',
//           Description: mealSelection.Description || '2',
//           AirlineDescription: mealSelection.meal.AirlineDescription || '',
//           Quantity: mealSelection.meal.Quantity || 0,
//           Currency: mealSelection?.meal['Currency'] || 'INR',
//           Price: mealSelection.meal.Price || 0,
//           Origin: seg.originCode,
//           Destination: seg.destinationCode
//         };
//       }) || [];

//       // Handle seats for all segments
//       const seats = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             Code: 'NoSeat',
//             Description: '2'
//           };
//         }

//         const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//           s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//         );

//         if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
//           return {
//             Code: 'NoSeat',
//             Description: '2'
//           };
//         }

//         return {
//           AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
//           FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
//           CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
//           Origin: seatSelection.seat.Origin || seg.originCode,
//           Destination: seatSelection.seat.Destination || seg.destinationCode,
//           AvailablityType: seatSelection.seat['AvailablityType'] || 0,
//           Description: seatSelection.Description || '2',
//           Code: seatSelection.seat.Code,
//           RowNo: seatSelection.seat['RowNo'] || '0',
//           SeatNo: seatSelection.seat.SeatNo || null,
//           SeatType: seatSelection.seat['SeatType'] || 0,
//           SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
//           Compartment: seatSelection.seat['Compartment'] || 0,
//           Deck: seatSelection.seat['Deck'] || 0,
//           Currency: seatSelection.seat['Currency'] || 'INR',
//           Price: seatSelection.seat.Price || 0
//         };
//       }) || [];

//       const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ?
//         [{
//           AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//           WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
//           Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//           Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//           Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//           Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//           Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//           Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//           Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//         }] : null;

//       // Deduplicate special services based on Code
//       const uniqueSpecialServices = new Map();
//       this.flightAddonsService.selectedServicesFinal
//         .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService')
//         .forEach(s => {
//           const service = this.extractSpecialServiceDynamic(
//             {
//               code: segments?.[0]?.code || '',
//               originCode: segments?.[0]?.originCode || '',
//               destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//             },
//             s,
//             isReturnJourney
//           );
//           uniqueSpecialServices.set(service.Code, service);
//         });
//       const specialServices = Array.from(uniqueSpecialServices.values());

//       let passportExpiry = '';
//       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//         const yyyy = person.passportExpiryDate.getFullYear();
//         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       let passportIssueDate = '';
//       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//         const yyyy = person.passportIssueDate.getFullYear();
//         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       // Construct meal and seat objects for payload
//       const validMeals = meals.filter(m => m.Code !== 'NoMeal');
//       const mealPayload = validMeals.length > 0 ? (
//         validMeals.every(m => !m.FlightNumber && !m.Origin && !m.Destination) && validMeals.length === 1 ?
//           { Meal: validMeals[0] } :
//           { MealDynamic: meals.filter(m => m.FlightNumber && m.Origin && m.Destination) }
//       ) : {};

//       const seatPayload = seats.some(s => s.Code !== 'NoSeat') ?
//         { SeatDynamic: seats.filter(s => s.Code !== 'NoSeat') } :
//         {};

//       return {
//         Title: title,
//         FirstName: person.firstName,
//         LastName: person.lastName,
//         PaxType: paxType,
//         DateOfBirth: `${dob}T00:00:00`,
//         Gender: person.gender === 'FEMALE' ? 2 : 1,
//         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//         PassportExpiry: passportExpiry,
//         PassportIssueDate: passportIssueDate,
//         PassportIssueCountryCode: person.passportIssueCountryCode,
//         AddressLine1: '123, Test',
//         AddressLine2: '',
//         Fare: generateFare(paxType, isReturnJourney),
//         City: 'Gurgaon',
//         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CellCountryCode: '+91',
//         ContactNo: contact.mobile,
//         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         Email: contact.email,
//         IsLeadPax: isLead,
//         FFAirlineCode: null,
//         FFNumber: '',
//         GSTCompanyAddress: '',
//         GSTCompanyContactNumber: '',
//         GSTCompanyName: '',
//         GSTCompanyEmail: '',
//         ...mealPayload,
//         ...seatPayload,
//         ...(baggage ? { Baggage: baggage } : {}),
//         ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
//       };
//     }

//     const passengersList: any[] = [];
//     let globalIndex = 0;
//     console.log("Passengers in payload",passengers)
//     if (isLCC) {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, isReturn));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassenger(child, 2, i, globalIndex, false, isReturn));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, isReturn));
//         globalIndex++;
//       });
//     } else {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, isReturn));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, isReturn));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, isReturn));
//         globalIndex++;
//       });
//     }

//     return isLCC ? {
//       PreferredCurrency: 'INR',
//       AgentReferenceNo: `REF${Date.now()}`,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//       TokenId: tboToken,
//       TraceId: traceId,
//       ResultIndex: resultIndex
//     } : {
//       ResultIndex: resultIndex,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//       TokenId: tboToken,
//       TraceId: traceId
//     };
//   }

//   public extractSpecialServiceDynamic(segment: any, serviceSelection: any, isReturn: boolean): any {
//     if (!serviceSelection?.service) {
//       return {
//         AirlineCode: segment.code.split(' ')[0] || '',
//         FlightNumber: segment.code.split(' ')[1] || '',
//         WayType: isReturn ? 3 : 2,
//         Code: 'NoService',
//         Description: '2',
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || '',
//         Destination: segment.destinationCode || ''
//       };
//     }

//     return {
//       AirlineCode: serviceSelection.service.AirlineCode || '',
//       FlightNumber: serviceSelection.service.FlightNumber || '',
//       WayType: serviceSelection.WayType,
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.Description || '2',
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0,
//       Origin: segment.originCode || '',
//       Destination: segment.destinationCode || ''
//     };
//   }
// }


// {
//   constructor(private flightAddonsService: FlightaddonsService) {}

  
//   generateBookingPayload(
//     isLCC: boolean,
//     flightData: {
//       adultFareDetail: any;
//       childrenFareDetail?: any;
//       infantFareDetail?: any;
//       fareCommonDetail?: any;
//       adultBaseFare: number;
//       adultTaxes: number;
//       adultBaseFareReturn?: number;
//       adultTaxesReturn?: number;
//       childrenBaseFare?: number;
//       childrenTaxes?: number;
//       childrenBaseFareReturn?: number;
//       childrenTaxesReturn?: number;
//       infantBaseFare?: number;
//       infantTaxes?: number;
//       infantBaseFareReturn?: number;
//       infantTaxesReturn?: number;
//       flightSegments: any[];
//       flightSegmentsReturn?: any[];
//       isReturn: boolean;
//       baggage: any[];
//     },
//     bookingParams: {
//       tboToken: string;
//       traceId: string;
//       resultIndex: string;
//       ipAddress: string;
//     },
//     passengers: {
//       adults: any[];
//       children: any[];
//       infants: any[];
//     },
//     contact: Contact,
//     gstInfo: GSTInfo,
//     gstMandatory: boolean,
//     passportInfoRequired: boolean,
//     ssrData?: any[]
//   ): any {
//     const {
//       adultFareDetail,
//       childrenFareDetail,
//       infantFareDetail,
//       fareCommonDetail,
//       adultBaseFare,
//       adultTaxes,
//       adultBaseFareReturn,
//       adultTaxesReturn,
//       childrenBaseFare,
//       childrenTaxes,
//       childrenBaseFareReturn,
//       childrenTaxesReturn,
//       infantBaseFare,
//       infantTaxes,
//       infantBaseFareReturn,
//       infantTaxesReturn,
//       flightSegments,
//       flightSegmentsReturn,
//       isReturn
//     } = flightData;

//     const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//     const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//       let fareDetail;
//       switch (type) {
//         case 1: fareDetail = adultFareDetail; break;
//         case 2: fareDetail = childrenFareDetail; break;
//         case 3: fareDetail = infantFareDetail; break;
//         default: return {};
//       }

//       console.log("Fare Details",fareDetail)
//       console.log("Fare Details",adultFareDetail)
//       console.log("Fare Details",childrenFareDetail)
//       console.log("Fare Details",infantFareDetail)
//       console.log("Pax Type",type)


//       if (isLCC) {
//         return {
//           Currency: fareDetail?.Currency || 'INR',
//           BaseFare: fareDetail?.BaseFare,
//           Tax: fareDetail?.Tax,
//           YQTax: fareDetail?.YQTax || 0,
//           AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//           AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//           OtherCharges: fareDetail?.OtherCharges || 0
//         };
//       }

//       return {
//         Currency: fareCommonDetail?.Currency || 'INR',
//         BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//         Tax: fareCommonDetail?.Tax || (isReturnJourney
//           ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//           : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//         YQTax: fareCommonDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareCommonDetail?.OtherCharges || 0,
//         Discount: fareCommonDetail?.Discount || 0,
//         PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//         OfferedFare: fareCommonDetail?.OfferedFare || 0,
//         TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//         TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//         TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//         ServiceFee: fareCommonDetail?.ServiceFee || 0
//       };
//     };

//     const extractMealDynamic = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//       return {
//         AirlineCode: segment.code.split(' ')[0],
//         FlightNumber: segment.code.split(' ')[1],
//         WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
//         Code: mealSelection?.meal?.Code ?? 'NoMeal',
//         Description: mealSelection?.Description ?? '2',
//         AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
//         Quantity: mealSelection?.meal?.Quantity ?? 0,
//         Currency: mealSelection?.meal?.Currency ?? 'INR',
//         Price: mealSelection?.meal?.Price ?? 0,
//         Origin: segment.originCode,
//         Destination: segment.destinationCode
//       };
//     };

//     // const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//     //   if (!seatSelection?.seat) {
//     //     return {
//     //       AirlineCode: segment.code.split(' ')[0],
//     //       FlightNumber: segment.code.split(' ')[1],
//     //       CraftType: segment.aircraft || '737',
//     //       Origin: segment.originCode,
//     //       Destination: segment.destinationCode,
//     //       AvailablityType: 0,
//     //       Description: '2',
//     //       Code: 'NoSeat',
//     //       RowNo: '0',
//     //       SeatNo: null,
//     //       SeatType: 0,
//     //       SeatWayType: isReturnJourney ? 3 : 2,
//     //       Compartment: 0,
//     //       Deck: 0,
//     //       Currency: 'INR',
//     //       Price: 0
//     //     };
//     //   }

//     //   return {
//     //     AirlineCode: seatSelection.seat.AirlineCode,
//     //     FlightNumber: seatSelection.seat.FlightNumber,
//     //     CraftType: seatSelection.seat.CraftType,
//     //     Origin: seatSelection.seat.Origin,
//     //     Destination: seatSelection.seat.Destination,
//     //     AvailablityType: seatSelection.seat.AvailablityType,
//     //     Description: seatSelection.Description,
//     //     Code: seatSelection.seat.Code,
//     //     RowNo: seatSelection.seat.RowNo,
//     //     SeatNo: seatSelection.seat.SeatNo,
//     //     SeatType: seatSelection.seat.SeatType,
//     //     SeatWayType: seatSelection.WayType,
//     //     Compartment: seatSelection.seat.Compartment,
//     //     Deck: seatSelection.seat.Deck,
//     //     Currency: seatSelection.seat.Currency,
//     //     Price: seatSelection.seat.Price
//     //   };
//     // };

//     const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//     if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
//       return {
//         AirlineCode: seatSelection?.seat?.AirlineCode || segment?.code.split(' ')[0] || '',
//         FlightNumber: seatSelection?.seat?.FlightNumber || segment?.code.split(' ')[1] || '',
//         CraftType: seatSelection?.seat?.CraftType || segment?.aircraft || '737',
//         Origin: seatSelection?.seat?.Origin || segment?.originCode || '',
//         Destination: seatSelection?.seat?.Destination || segment?.destinationCode || '',
//         AvailablityType: seatSelection?.seat?.AvailablityType || 0,
//         Description: seatSelection?.seat?.Description || '2',
//         Code: 'NoSeat',
//         RowNo: '0',
//         SeatNo: null,
//         SeatType: 0,
//         SeatWayType: isReturnJourney ? 3 : 2,
//         Compartment: 0,
//         Deck: 0,
//         Currency: seatSelection?.seat?.Currency || 'INR',
//         Price: 0
//       };
//     }

//     return {
//       AirlineCode: seatSelection.seat.AirlineCode,
//       FlightNumber: seatSelection.seat.FlightNumber,
//       CraftType: seatSelection.seat.CraftType,
//       Origin: seatSelection.seat.Origin,
//       Destination: seatSelection.seat.Destination,
//       AvailablityType: seatSelection.seat.AvailablityType,
//       Description: seatSelection.seat.Description || '2',
//       Code: seatSelection.seat.Code,
//       RowNo: seatSelection.seat.RowNo,
//       SeatNo: seatSelection.seat.SeatNo,
//       SeatType: seatSelection.seat.SeatType,
//       SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
//       Compartment: seatSelection.seat.Compartment,
//       Deck: seatSelection.seat.Deck,
//       Currency: seatSelection.seat.Currency,
//       Price: seatSelection.seat.Price
//     };
//   };

//     const buildPassenger = (
//       person: any,
//       paxType: number,
//       localIndex: number,
//       globalIndex: number,
//       isLead: boolean,
//       isReturnJourney: boolean,
//       ssrData : any
//     ): any => {
//       const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//       // const meals = segments?.map((seg, segIndex) => {
//       //   if (paxType === 3) {
//       //     return {
//       //       AirlineCode: seg.code.split(' ')[0],
//       //       FlightNumber: seg.code.split(' ')[1],
//       //       WayType: isReturnJourney ? 3 : 1,
//       //       Code: 'NoMeal',
//       //       Description: '2',
//       //       AirlineDescription: '',
//       //       Quantity: 0,
//       //       Currency: 'INR',
//       //       Price: 0,
//       //       Origin: seg.originCode,
//       //       Destination: seg.destinationCode
//       //     };
//       //   }

//       //   const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//       //     m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//       //   );
//       //   return extractMealDynamic(seg, mealSelection, isReturnJourney);
//       // }) || [];

//       const meals = paxType === 3
//         ? segments?.map((seg, segIndex) => {
//             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//             );
//             if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
//               return null; // Return null for infants with no meal or 'NoMeal'
//             }
//             return extractMealDynamic(seg, mealSelection, isReturnJourney);
//           }).filter(m => m !== null) || [] // Filter out null entries
//         : segments?.map((seg, segIndex) => {
//             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//             );
//             return extractMealDynamic(seg, mealSelection, isReturnJourney);
//           }) || [];

//       // const seats = segments?.map((seg, segIndex) => {
//       //   if (paxType === 3) {
//       //     return {
//       //       AirlineCode: seg.code.split(' ')[0],
//       //       FlightNumber: seg.code.split(' ')[1],
//       //       CraftType: seg.aircraft || '737',
//       //       Origin: seg.originCode,
//       //       Destination: seg.destinationCode,
//       //       AvailablityType: 0,
//       //       Description: '2',
//       //       Code: 'NoSeat',
//       //       RowNo: '0',
//       //       SeatNo: null,
//       //       SeatType: 0,
//       //       SeatWayType: isReturnJourney ? 3 : 1,
//       //       Compartment: 0,
//       //       Deck: 0,
//       //       Currency: 'INR',
//       //       Price: 0
//       //     };
//       //   }

//       //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//       //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//       //   );
//       //   return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//       // }) || [];

//     //   const seats = segments?.map((seg, segIndex) => {
//     //   if (paxType === 3) {
//     //     // Infants have no seat assignments
//     //     return {
//     //       AirlineCode: seg.code.split(' ')[0],
//     //       FlightNumber: seg.code.split(' ')[1],
//     //       CraftType: seg.aircraft || '737',
//     //       Origin: seg.originCode,
//     //       Destination: seg.destinationCode,
//     //       AvailablityType: 0,
//     //       Description: '2',
//     //       Code: 'NoSeat',
//     //       RowNo: '0',
//     //       SeatNo: null,
//     //       SeatType: 0,
//     //       SeatWayType: isReturnJourney ? 3 : 1,
//     //       Compartment: 0,
//     //       Deck: 0,
//     //       Currency: 'INR',
//     //       Price: 0
//     //     };
//     //   }

//     //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//     //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//     //   );
//     //   return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//     // }) || [];

//     // const seats = paxType === 3 ? [] : segments?.map((seg, segIndex) => {
//     //     const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//     //       s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//     //     );
//     //     return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//     //   }) || [];
//     // const seats = paxType === 3 ? null : segments?.map((seg, segIndex) => {
//     //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//     //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//     //   );
//     //   return extractSeatDynamic(seg, seatSelection, isReturnJourney);
//     // }) || [];

//     // Get SSR seat data for this passenger
//     console.log("SSR data to use",ssrData)
   
//     // Extract SSR seat data from ssrData.Response.SeatDynamic
//     const ssrSeatSelections = (ssrData?.Response?.SeatDynamic || []).flatMap((seatDynamic: any) =>
//       seatDynamic.SegmentSeat.map((segmentSeat: any, segmentIndex: number) => ({
//         passengerIndex: globalIndex, // Assume same for all passengers or adjust if SSR specifies
//         segmentIndex,
//         isReturn: isReturnJourney,
//         seat: segmentSeat.RowSeats[0]?.Seats[0] || { // Use first seat as representative
//           AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || '',
//           FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || '',
//           Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || '',
//           Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || '',
//           CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || '737',
//           Code: 'NoSeat', // Default to NoSeat for SSR data
//           AvailablityType: 0,
//           Description: '2',
//           RowNo: '0',
//           SeatNo: null,
//           SeatType: 0,
//           SeatWayType: isReturnJourney ? 3 : 2,
//           Compartment: 0,
//           Deck: 0,
//           Currency: 'INR',
//           Price: 0
//         }
//       }))
//     );

//     // Get selected seats from flightAddonsService
//     const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
//       s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
//     );

//     // Determine unique segments from SSR data based on Origin and Destination
//     const uniqueSegments = new Map<string, { origin: string; destination: string; segmentIndex: number; ssrSeatSelection: any }>();
//     ssrSeatSelections.forEach((ssrSeat: any) => {
//       const key = `${ssrSeat.seat?.Origin || ''}-${ssrSeat.seat?.Destination || ''}`;
//       if (!uniqueSegments.has(key)) {
//         uniqueSegments.set(key, {
//           origin: ssrSeat.seat?.Origin || '',
//           destination: ssrSeat.seat?.Destination || '',
//           segmentIndex: ssrSeat.segmentIndex,
//           ssrSeatSelection: ssrSeat
//         });
//       }
//     });

//     // Generate seats based on unique SSR segments
//     const seats = paxType === 3
//       ? [] // Infants have no seats
//       : Array.from(uniqueSegments.values()).map(({ origin, destination, segmentIndex, ssrSeatSelection }) => {
//           // Check if there's a selected seat for this segment
//           const selectedSeat = selectedSeats.find(
//             s => s.segmentIndex === segmentIndex && s.isReturn === isReturnJourney
//           );
//           // Use selected seat if available, otherwise fall back to SSR data
//           const seatSelection = selectedSeat || ssrSeatSelection;
//           // Find corresponding flight segment for fallback fields
//           const matchingSegment = segments.find(
//             seg => seg.originCode === origin && seg.destinationCode === destination
//           ) || segments[segmentIndex] || segments[0] || {}; // Fallback to empty object
//           return extractSeatDynamic(matchingSegment, seatSelection, isReturnJourney);
//         }) || [];

//       // // Assign special services to all adults and children (not infants)
//       // const uniqueSpecialServices = new Map();
//       // if (paxType !== 3) { // Exclude infants
//       //   this.flightAddonsService.selectedServicesFinal
//       //     .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       //     .forEach(s => {
//       //       const service = this.extractSpecialServiceDynamic(
//       //         {
//       //           code: segments?.[0]?.code || '',
//       //           originCode: segments?.[0]?.originCode || '',
//       //           destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//       //         },
//       //         s,
//       //         isReturnJourney
//       //       );
//       //       uniqueSpecialServices.set(service.Code, service);
//       //     });
//       // }
//       // const specialServices = Array.from(uniqueSpecialServices.values());
//       const specialServices = paxType === 3 ? null : (() => {
//         const uniqueSpecialServices = new Map();
//         this.flightAddonsService.selectedServicesFinal
//           .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//           .forEach(s => {
//             const service = this.extractSpecialServiceDynamic(
//               {
//                 code: segments?.[0]?.code || '',
//                 originCode: segments?.[0]?.originCode || '',
//                 destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//               },
//               s,
//               isReturnJourney
//             );
//             uniqueSpecialServices.set(service.Code, service);
//           });
//         return Array.from(uniqueSpecialServices.values());
//       })();

//       // const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 ?
//       //   [{
//       //     AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//       //     FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//       //     WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
//       //     Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
//       //     Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//       //     Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//       //     Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//       //     Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//       //     Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//       //     Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//       //   }] : [{
//       //     AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
//       //     FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
//       //     WayType: isReturnJourney ? 3 : 2,
//       //     Code: 'NoBaggage',
//       //     Description: '2',
//       //     Weight: '0',
//       //     Currency: 'INR',
//       //     Price: 0,
//       //     Origin: segments?.[0]?.originCode || '',
//       //     Destination: segments?.[segments.length - 1]?.destinationCode || ''
//       //   }];

//       const baggage = paxType === 3 ? null : flightData.baggage && flightData.baggage.length > 0
//       ? [{
//           AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//           WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
//           Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
//           Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//           Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//           Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//           Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//           Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//           Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//         }]
//       : [{
//           AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
//           WayType: isReturnJourney ? 3 : 2,
//           Code: 'NoBaggage',
//           Description: '2',
//           Weight: '0',
//           Currency: 'INR',
//           Price: 0,
//           Origin: segments?.[0]?.originCode || '',
//           Destination: segments?.[segments.length - 1]?.destinationCode || ''
//         }];

//       let dob = '1987-12-06';
//       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//         const yyyy = person.dateOfBirth.getFullYear();
//         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         dob = `${yyyy}-${mm}-${dd}`;
//       }

//       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//       let passportExpiry = '';
//       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//         const yyyy = person.passportExpiryDate.getFullYear();
//         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       let passportIssueDate = '';
//       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//         const yyyy = person.passportIssueDate.getFullYear();
//         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       return {
//         Title: title,
//         FirstName: person.firstName,
//         LastName: person.lastName,
//         PaxType: paxType,
//         DateOfBirth: `${dob}T00:00:00`,
//         Gender: person.gender === 'FEMALE' ? 2 : 1,
//         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//         PassportExpiry: passportExpiry,
//         PassportIssueDate: passportIssueDate,
//         PassportIssueCountryCode: person.passportIssueCountryCode,
//         AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//         AddressLine2: '',
//         Fare: generateFare(paxType, isReturnJourney),
//         City: 'Siliguri',
//         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CountryName: 'India',
//         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CellCountryCode: '+91',
//         ContactNo: contact.mobile,
//         Email: contact.email,
//         IsLeadPax: isLead,
//         FFAirlineCode: null,
//         // FFNumber: null,
//         // Baggage: baggage,
//         // MealDynamic: meals,
//         // SeatDynamic: seats,
//         // SpecialServices: specialServices,
//         // ...(isLead && gstMandatory ? {
//         //   GSTCompanyAddress: gstInfo.companyName || '',
//         //   GSTCompanyContactNumber: contact.mobile || '',
//         //   GSTCompanyName: gstInfo.companyName || '',
//         //   GSTNumber: gstInfo.registrationNo || '',
//         //   GSTCompanyEmail: contact.email || ''
//         // } : {})
//         FFNumber: null,
//         ...(meals.length > 0 ? { MealDynamic: meals } : {}),
//         ...(seats ? { SeatDynamic: seats } : {}),
//         ...(specialServices ? { SpecialServices: specialServices } : {}),
//         ...(baggage ? { Baggage: baggage } : {}),
//         ...(isLead && gstMandatory ? {
//           GSTCompanyAddress: gstInfo.companyName || '',
//           GSTCompanyContactNumber: contact.mobile || '',
//           GSTCompanyName: gstInfo.companyName || '',
//           GSTNumber: gstInfo.registrationNo || '',
//           GSTCompanyEmail: contact.email || ''
//         } : {})
        
//       };
//     };

//     const buildPassengerNonLCC = (
//       person: any,
//       paxType: number,
//       globalIndex: number,
//       isLead: boolean,
//       isReturnJourney: boolean = false,
//       ssrData : any
//     ): any => {
//       const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;
//       const monthMap: { [key: string]: string } = {
//         January: '01',
//         February: '02',
//         March: '03',
//         April: '04',
//         May: '05',
//         June: '06',
//         July: '07',
//         August: '08',
//         September: '09',
//         October: '10',
//         November: '11',
//         December: '12'
//       };

//       let dob = '1987-12-06';
//       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//         const yyyy = person.dateOfBirth.getFullYear();
//         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         dob = `${yyyy}-${mm}-${dd}`;
//       }

//       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//       const meals = segments?.map((seg, segIndex) => {
//         if (paxType === 3) {
//           return {
//             Code: 'NoMeal',
//             Description: '2'
//           };
//         }

//         const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
//           m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
//         );

//         if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
//           return {
//             Code: 'NoMeal',
//             Description: '2'
//           };
//         }

//         const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
//         if (isMeal) {
//           return {
//             Code: mealSelection.meal.Code,
//             Description: mealSelection.meal.Description || '2'
//           };
//         }

//         return {
//           AirlineCode: seg.code.split(' ')[0],
//           FlightNumber: seg.code.split(' ')[1],
//           WayType: mealSelection.WayType,
//           Code: mealSelection.meal.Code ?? 'NoMeal',
//           Description: mealSelection.Description || '2',
//           AirlineDescription: mealSelection.meal.AirlineDescription || '',
//           Quantity: mealSelection.meal.Quantity || 0,
//           Currency: mealSelection?.meal['Currency'] || 'INR',
//           Price: mealSelection.meal.Price || 0,
//           Origin: seg.originCode,
//           Destination: seg.destinationCode
//         };
//       }) || [];

//       // const seats = segments?.map((seg, segIndex) => {
//       //   if (paxType === 3) {
//       //     return {
//       //       Code: 'NoSeat',
//       //       Description: '2'
//       //     };
//       //   }

//       //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//       //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//       //   );

//       //   if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
//       //     return {
//       //       Code: 'NoSeat',
//       //       Description: '2'
//       //     };
//       //   }

//       //   return {
//       //     AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
//       //     FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
//       //     CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
//       //     Origin: seatSelection.seat.Origin || seg.originCode,
//       //     Destination: seatSelection.seat.Destination || seg.destinationCode,
//       //     AvailablityType: seatSelection.seat['AvailablityType'] || 0,
//       //     Description: seatSelection.Description || '2',
//       //     Code: seatSelection.seat.Code,
//       //     RowNo: seatSelection.seat['RowNo'] || '0',
//       //     SeatNo: seatSelection.seat.SeatNo || null,
//       //     SeatType: seatSelection.seat['SeatType'] || 0,
//       //     SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
//       //     Compartment: seatSelection.seat['Compartment'] || 0,
//       //     Deck: seatSelection.seat['Deck'] || 0,
//       //     Currency: seatSelection.seat['Currency'] || 'INR',
//       //     Price: seatSelection.seat.Price || 0
//       //   };
//       // }) || [];

//       // const seats = segments?.map((seg, segIndex) => {
//       //   if (paxType === 3) {
//       //     // Infants have no seat assignments
//       //     return {
//       //       Code: 'NoSeat',
//       //       Description: '2'
//       //     };
//       //   }

//       //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//       //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//       //   );

//       //   if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
//       //     return {
//       //       Code: 'NoSeat',
//       //       Description: '2'
//       //     };
//       //   }

//       //   return {
//       //     AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
//       //     FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
//       //     CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
//       //     Origin: seatSelection.seat.Origin || seg.originCode,
//       //     Destination: seatSelection.seat.Destination || seg.destinationCode,
//       //     AvailablityType: seatSelection.seat['AvailablityType'] || 0,
//       //     Description: seatSelection.Description || '2',
//       //     Code: seatSelection.seat.Code,
//       //     RowNo: seatSelection.seat['RowNo'] || '0',
//       //     SeatNo: seatSelection.seat.SeatNo || null,
//       //     SeatType: seatSelection.seat['SeatType'] || 0,
//       //     SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
//       //     Compartment: seatSelection.seat['Compartment'] || 0,
//       //     Deck: seatSelection.seat['Deck'] || 0,
//       //     Currency: seatSelection.seat['Currency'] || 'INR',
//       //     Price: seatSelection.seat.Price || 0
//       //   };
//       // }) || [];

//       // const seats = paxType === 3 ? [] : segments?.map((seg, segIndex) => {
//       //   const seatSelection = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).find(
//       //     s => s.passengerIndex === globalIndex && s.segmentIndex === segIndex && s.isReturn === isReturnJourney
//       //   );

//       //   if (!seatSelection || seatSelection.seat.Code === 'NoSeat') {
//       //     return {
//       //       Code: 'NoSeat',
//       //       Description: '2'
//       //     };
//       //   }

//       //   return {
//       //     AirlineCode: seatSelection.seat['AirlineCode'] || seg.code.split(' ')[0],
//       //     FlightNumber: seatSelection.seat.FlightNumber || seg.code.split(' ')[1],
//       //     CraftType: seatSelection.seat['CraftType'] || seg.aircraft || '737',
//       //     Origin: seatSelection.seat.Origin || seg.originCode,
//       //     Destination: seatSelection.seat.Destination || seg.destinationCode,
//       //     AvailablityType: seatSelection.seat['AvailablityType'] || 0,
//       //     Description: seatSelection.Description || '2',
//       //     Code: seatSelection.seat.Code,
//       //     RowNo: seatSelection.seat['RowNo'] || '0',
//       //     SeatNo: seatSelection.seat.SeatNo || null,
//       //     SeatType: seatSelection.seat['SeatType'] || 0,
//       //     SeatWayType: seatSelection.WayType || (isReturnJourney ? 3 : 1),
//       //     Compartment: seatSelection.seat['Compartment'] || 0,
//       //     Deck: seatSelection.seat['Deck'] || 0,
//       //     Currency: seatSelection.seat['Currency'] || 'INR',
//       //     Price: seatSelection.seat.Price || 0
//       //   };
//       // }) || [];
//        // Extract SSR seat data from ssrData.Response.SeatDynamic
//   const ssrSeatSelections = (ssrData?.Response?.SeatDynamic || ssrData?.Response?.Seats || []).flatMap((seatDynamic: any, segmentIndex: number) => {
//         const seatData = seatDynamic.SegmentSeat ? seatDynamic.SegmentSeat : [seatDynamic];
//         return seatData.map((segmentSeat: any, segIndex: number) => {
//           const seat = segmentSeat.RowSeats ? segmentSeat.RowSeats[0]?.Seats[0] : segmentSeat;
//           return {
//             passengerIndex: globalIndex,
//             segmentIndex: segmentIndex + segIndex,
//             isReturn: isReturnJourney,
//             seat: {
//               AirlineCode: seat.AirlineCode || segments[segmentIndex]?.code.split(' ')[0] || '',
//               FlightNumber: seat.FlightNumber || segments[segmentIndex]?.code.split(' ')[1] || '',
//               CraftType: seat.CraftType || segments[segmentIndex]?.aircraft || '737',
//               Origin: seat.Origin || segments[segmentIndex]?.originCode || '',
//               Destination: seat.Destination || segments[segmentIndex]?.destinationCode || '',
//               AvailablityType: seat.AvailablityType || 0,
//               Description: seat.Description || '2',
//               Code: seat.Code || 'NoSeat',
//               RowNo: seat.RowNo || '0',
//               SeatNo: seat.SeatNo || null,
//               SeatType: seat.SeatType || 0,
//               SeatWayType: seat.SeatWayType || (isReturnJourney ? 3 : 1),
//               Compartment: seat.Compartment || 0,
//               Deck: seat.Deck || 0,
//               Currency: seat.Currency || 'INR',
//               Price: seat.Price || 0,
//               Text: seat.Text || ''
//             }
//           };
//         });
//       });

//       const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
//         s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
//       );

//       const seats = paxType === 3
//         ? []
//         : selectedSeats.length > 0
//           ? selectedSeats.map((selectedSeat, index) => {
//               const matchingSsrSeat = ssrSeatSelections.find(
//                 s => s.segmentIndex === selectedSeat.segmentIndex && s.isReturn === isReturnJourney
//               );
//               const matchingSegment = segments[selectedSeat.segmentIndex] || segments[0] || {};
//               return extractSeatDynamic(matchingSegment, matchingSsrSeat || selectedSeat, isReturnJourney);
//             }).filter(s => s.Code !== 'NoSeat')
//           : ssrSeatSelections
//               .filter(s => s.seat.Code !== 'NoSeat')
//               .map((ssrSeat, index) => {
//                 const matchingSegment = segments[ssrSeat.segmentIndex] || segments[0] || {};
//                 return extractSeatDynamic(matchingSegment, ssrSeat, isReturnJourney);
//               }) || [];

//       const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage' ?
//         [{
//           AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//           FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//           WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
//           Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//           Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//           Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//           Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//           Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//           Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//           Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//         }] : null;

//       // Assign special services to all adults and children (not infants)
//       const uniqueSpecialServices = new Map();
//       if (paxType !== 3) { // Exclude infants
//         this.flightAddonsService.selectedServicesFinal
//           .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//           .forEach(s => {
//             const service = this.extractSpecialServiceDynamic(
//               {
//                 code: segments?.[0]?.code || '',
//                 originCode: segments?.[0]?.originCode || '',
//                 destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
//               },
//               s,
//               isReturnJourney
//             );
//             uniqueSpecialServices.set(service.Code, service);
//           });
//       }
//       const specialServices = Array.from(uniqueSpecialServices.values());

//       let passportExpiry = '';
//       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//         const yyyy = person.passportExpiryDate.getFullYear();
//         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       let passportIssueDate = '';
//       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//         const yyyy = person.passportIssueDate.getFullYear();
//         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//       }

//       const validMeals = meals.filter(m => m.Code !== 'NoMeal');
//       const mealPayload = validMeals.length > 0 ? (
//         validMeals.every(m => !m.FlightNumber && !m.Origin && !m.Destination) && validMeals.length === 1 ?
//           { Meal: validMeals[0] } :
//           { MealDynamic: meals.filter(m => m.FlightNumber && m.Origin && m.Destination) }
//       ) : {};

//       // const seatPayload = seats.some(s => s.Code !== 'NoSeat') ?
//       //   { SeatDynamic: seats.filter(s => s.Code !== 'NoSeat') } :
//       //   {};

//       return {
//         Title: title,
//         FirstName: person.firstName,
//         LastName: person.lastName,
//         PaxType: paxType,
//         DateOfBirth: `${dob}T00:00:00`,
//         Gender: person.gender === 'FEMALE' ? 2 : 1,
//         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//         PassportExpiry: passportExpiry,
//         PassportIssueDate: passportIssueDate,
//         PassportIssueCountryCode: person.passportIssueCountryCode,
//         AddressLine1: '123, Test',
//         AddressLine2: '',
//         Fare: generateFare(paxType, isReturnJourney),
//         City: 'Gurgaon',
//         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         CellCountryCode: '+91',
//         ContactNo: contact.mobile,
//         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//         Email: contact.email,
//         IsLeadPax: isLead,
//         FFAirlineCode: null,
//         FFNumber: '',
//         GSTCompanyAddress: '',
//         GSTCompanyContactNumber: '',
//         GSTCompanyName: '',
//         GSTCompanyEmail: '',
//         ...mealPayload,
//         // ...seatPayload,
//         ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
//         ...(baggage ? { Baggage: baggage } : {}),
//         ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {})
//       };
//     }

//     const passengersList: any[] = [];
//     let globalIndex = 0;
//     console.log("Passengers in payload", passengers);
//     console.log("SSR in play", ssrData);
//     if (isLCC) {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, isReturn,ssrData));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassenger(child, 2, i, globalIndex, false, isReturn,ssrData));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, isReturn,ssrData));
//         globalIndex++;
//       });
//     } else {
//       passengers.adults.forEach((adult, i) => {
//         passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, isReturn,ssrData));
//         globalIndex++;
//       });

//       passengers.children.forEach((child, i) => {
//         passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, isReturn,ssrData));
//         globalIndex++;
//       });

//       passengers.infants.forEach((infant, i) => {
//         passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, isReturn,ssrData));
//         globalIndex++;
//       });
//     }

//     return isLCC ? {
//       PreferredCurrency: 'INR',
//       AgentReferenceNo: `REF${Date.now()}`,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//       TokenId: tboToken,
//       TraceId: traceId,
//       ResultIndex: resultIndex
//     } : {
//       ResultIndex: resultIndex,
//       Passengers: passengersList,
//       EndUserIp: ipAddress,
//      TokenId: tboToken,
//       TraceId: traceId
//     };
//   }

//   public extractSpecialServiceDynamic(segment: any, serviceSelection: any, isReturn: boolean): any {
//     if (!serviceSelection?.service) {
//       return {
//         AirlineCode: segment.code.split(' ')[0] || '',
//         FlightNumber: segment.code.split(' ')[1] || '',
//         WayType: isReturn ? 3 : 2,
//         Code: 'NoService',
//         Description: '2',
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || '',
//         Destination: segment.destinationCode || ''
//       };
//     }

//     return {
//       AirlineCode: serviceSelection.service.AirlineCode || '',
//       FlightNumber: serviceSelection.service.FlightNumber || '',
//       WayType: serviceSelection.WayType,
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.Description || '2',
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0,
//       Origin: segment.originCode || '',
//       Destination: segment.destinationCode || ''
//     };
//   }
// }

// LCC WORKING FINE TILL NOW


/// NEW CODE :

{
  constructor(private flightAddonsService: FlightaddonsService) {}

  generateBookingPayload(
    isLCC: boolean,
    flightData: {
      adultFareDetail: any;
      childrenFareDetail?: any;
      infantFareDetail?: any;
      fareCommonDetail?: any;
      adultBaseFare: number;
      adultTaxes: number;
      adultBaseFareReturn?: number;
      adultTaxesReturn?: number;
      childrenBaseFare?: number;
      childrenTaxes?: number;
      childrenBaseFareReturn?: number;
      childrenTaxesReturn?: number;
      infantBaseFare?: number;
      infantTaxes?: number;
      infantBaseFareReturn?: number;
      infantTaxesReturn?: number;
      flightSegments: any[];
      flightSegmentsReturn?: any[];
      isReturn: boolean;
      baggage: any[];
    },
    bookingParams: {
      tboToken: string;
      traceId: string;
      resultIndex: string;
      ipAddress: string;
    },
    passengers: {
      adults: any[];
      children: any[];
      infants: any[];
    },
    contact: Contact,
    gstInfo: GSTInfo,
    gstMandatory: boolean,
    passportInfoRequired: boolean,
    ssrData?: any
  ): any {
    const {
      adultFareDetail,
      childrenFareDetail,
      infantFareDetail,
      fareCommonDetail,
      adultBaseFare,
      adultTaxes,
      adultBaseFareReturn,
      adultTaxesReturn,
      childrenBaseFare,
      childrenTaxes,
      childrenBaseFareReturn,
      childrenTaxesReturn,
      infantBaseFare,
      infantTaxes,
      infantBaseFareReturn,
      infantTaxesReturn,
      flightSegments,
      flightSegmentsReturn,
      isReturn
    } = flightData;

    

    const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

    const generateFare = (type: number, isReturnJourney: boolean = false): any => {
      let fareDetail;
      switch (type) {
        case 1: fareDetail = adultFareDetail; break;
        case 2: fareDetail = childrenFareDetail; break;
        case 3: fareDetail = infantFareDetail; break;
        default: return {};
      }

      console.log("Fare Details", fareDetail);
      console.log("Pax Type", type);

      if (isLCC) {
        return {
          Currency: fareDetail?.Currency || 'INR',
          BaseFare: fareDetail?.BaseFare,
          Tax: fareDetail?.Tax,
          YQTax: fareDetail?.YQTax || 0,
          AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
          AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
          OtherCharges: fareDetail?.OtherCharges || 0
        };
      }

      return {
        Currency: fareCommonDetail?.Currency || 'INR',
        BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
          ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
          : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
        Tax: fareCommonDetail?.Tax || (isReturnJourney
          ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
          : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
        YQTax: fareCommonDetail?.YQTax || 0,
        AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
        AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
        OtherCharges: fareCommonDetail?.OtherCharges || 0,
        Discount: fareCommonDetail?.Discount || 0,
        PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
          ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
          : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
        OfferedFare: fareCommonDetail?.OfferedFare || 0,
        TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
        TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
        TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
        ServiceFee: fareCommonDetail?.ServiceFee || 0
      };
    };

    const extractMealDynamic = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
      return {
        AirlineCode: segment.code.split(' ')[0],
        FlightNumber: segment.code.split(' ')[1],
        WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
        Code: mealSelection?.meal?.Code ?? 'NoMeal',
        Description: mealSelection?.Description ?? '2',
        AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
        Quantity: mealSelection?.meal?.Quantity ?? 0,
        Currency: mealSelection?.meal?.Currency ?? 'INR',
        Price: mealSelection?.meal?.Price ?? 0,
        Origin: segment.originCode,
        Destination: segment.destinationCode
      };
    };

    const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
      if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
        return {
          AirlineCode: seatSelection?.seat?.AirlineCode || segment?.code.split(' ')[0] || '',
          FlightNumber: seatSelection?.seat?.FlightNumber || segment?.code.split(' ')[1] || '',
          CraftType: seatSelection?.seat?.CraftType || segment?.aircraft || '737',
          Origin: seatSelection?.seat?.Origin || segment?.originCode || '',
          Destination: seatSelection?.seat?.Destination || segment?.destinationCode || '',
          AvailablityType: seatSelection?.seat?.AvailablityType || 0,
          Description: seatSelection?.seat?.Description || '2',
          Code: 'NoSeat',
          RowNo: '0',
          SeatNo: null,
          SeatType: 0,
          SeatWayType: isReturnJourney ? 3 : 2,
          Compartment: 0,
          Deck: 0,
          Currency: seatSelection?.seat?.Currency || 'INR',
          Price: 0,
          Text: seatSelection?.seat?.Text || ''
        };
      }

      return {
        AirlineCode: seatSelection.seat.AirlineCode,
        FlightNumber: seatSelection.seat.FlightNumber,
        CraftType: seatSelection.seat.CraftType,
        Origin: seatSelection.seat.Origin,
        Destination: seatSelection.seat.Destination,
        AvailablityType: seatSelection.seat.AvailablityType,
        Description: seatSelection.seat.Description || '2',
        Code: seatSelection.seat.Code,
        RowNo: seatSelection.seat.RowNo,
        SeatNo: seatSelection.seat.SeatNo,
        SeatType: seatSelection.seat.SeatType,
        SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
        Compartment: seatSelection.seat.Compartment,
        Deck: seatSelection.seat.Deck,
        Currency: seatSelection.seat.Currency,
        Price: seatSelection.seat.Price,
        Text: seatSelection.seat.Text || ''
      };
    };

    const buildPassenger = (
      person: any,
      paxType: number,
      localIndex: number,
      globalIndex: number,
      isLead: boolean,
      isReturnJourney: boolean,
      ssrData: any
    ): any => {
      const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;

      const meals = paxType === 3
        ? segments?.map((seg, segIndex) => {
            const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
              m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
            );
            if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
              return null;
            }
            return extractMealDynamic(seg, mealSelection, isReturnJourney);
          }).filter(m => m !== null) || []
        : segments?.map((seg, segIndex) => {
            const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
              m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
            );
            return extractMealDynamic(seg, mealSelection, isReturnJourney);
          }) || [];


      // const meals = segments?.map((seg, segIndex) => {
      //   if (paxType === 3) {
      //     return {
      //       Code: 'NoMeal',
      //       Description: '2'
      //     };
      //   }

      //   const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
      //     m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
      //   );

      //   if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
      //     return {
      //       Code: 'NoMeal',
      //       Description: '2'
      //     };
      //   }

      //   const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
      //   if (isMeal) {
      //     return {
      //       Code: mealSelection.meal.Code,
      //       Description: mealSelection.meal.Description || '2'
      //     };
      //   }

      //   return {
      //     AirlineCode: seg.code.split(' ')[0],
      //     FlightNumber: seg.code.split(' ')[1],
      //     WayType: mealSelection.WayType,
      //     Code: mealSelection.meal.Code ?? 'NoMeal',
      //     Description: mealSelection.Description || '2',
      //     AirlineDescription: mealSelection.meal.AirlineDescription || '',
      //     Quantity: mealSelection.meal.Quantity || 0,
      //     Currency: mealSelection?.meal['Currency'] || 'INR',
      //     Price: mealSelection.meal.Price || 0,
      //     Origin: seg.originCode,
      //     Destination: seg.destinationCode
      //   };
      // }) || [];


      // const ssrSeatSelections = (ssrData?.Response?.SeatDynamic || ssrData?.Response?.Seats || []).flatMap((seatDynamic: any, segmentIndex: number) => {
      //   const seatData = seatDynamic.SegmentSeat ? seatDynamic.SegmentSeat : [seatDynamic];
      //   return seatData.map((segmentSeat: any, segIndex: number) => {
      //     const seat = segmentSeat.RowSeats ? segmentSeat.RowSeats[0]?.Seats[0] : segmentSeat;
      //     return {
      //       passengerIndex: globalIndex,
      //       segmentIndex: segmentIndex + segIndex,
      //       isReturn: isReturnJourney,
      //       seat: {
      //         AirlineCode: seat.AirlineCode || segments[segmentIndex]?.code.split(' ')[0] || '',
      //         FlightNumber: seat.FlightNumber || segments[segmentIndex]?.code.split(' ')[1] || '',
      //         CraftType: seat.CraftType || segments[segmentIndex]?.aircraft || '737',
      //         Origin: seat.Origin || segments[segmentIndex]?.originCode || '',
      //         Destination: seat.Destination || segments[segmentIndex]?.destinationCode || '',
      //         AvailablityType: seat.AvailablityType || 0,
      //         Description: seat.Description || '2',
      //         Code: seat.Code || 'NoSeat',
      //         RowNo: seat.RowNo || '0',
      //         SeatNo: seat.SeatNo || null,
      //         SeatType: seat.SeatType || 0,
      //         SeatWayType: seat.SeatWayType || (isReturnJourney ? 3 : 1),
      //         Compartment: seat.Compartment || 0,
      //         Deck: seat.Deck || 0,
      //         Currency: seat.Currency || 'INR',
      //         Price: seat.Price || 0,
      //         Text: seat.Text || ''
      //       }
      //     };
      //   });
      // });

      // console.log("SSR Seat Selections:", JSON.stringify(ssrSeatSelections, null, 2));

      // const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
      //   s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
      // );

      // console.log("Selected Seats:", JSON.stringify(selectedSeats, null, 2));

      // const seats = paxType === 3
      //   ? []
      //   : selectedSeats.length > 0
      //     ? selectedSeats.map((selectedSeat, index) => {
      //         const matchingSsrSeat = ssrSeatSelections.find(
      //           s => s.segmentIndex === selectedSeat.segmentIndex && s.isReturn === isReturnJourney
      //         );
      //         const matchingSegment = segments[selectedSeat.segmentIndex] || segments[0] || {};
      //         return extractSeatDynamic(matchingSegment, matchingSsrSeat || selectedSeat, isReturnJourney);
      //       }).filter(s => s.Code !== 'NoSeat')
      //     : ssrSeatSelections
      //         .filter(s => s.seat.Code !== 'NoSeat')
      //         .map((ssrSeat, index) => {
      //           const matchingSegment = segments[ssrSeat.segmentIndex] || segments[0] || {};
      //           return extractSeatDynamic(matchingSegment, ssrSeat, isReturnJourney);
      //         }) || [];

      // Extract SSR seat data from ssrData.Response.SeatDynamic
    const ssrSeatSelections = (ssrData?.Response?.SeatDynamic || []).flatMap((seatDynamic: any) =>
      seatDynamic.SegmentSeat.map((segmentSeat: any, segmentIndex: number) => ({
        passengerIndex: globalIndex, // Assume same for all passengers or adjust if SSR specifies
        segmentIndex,
        isReturn: isReturnJourney,
        seat: segmentSeat.RowSeats[0]?.Seats[0] || { // Use first seat as representative
          AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || '',
          FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || '',
          Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || '',
          Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || '',
          CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || '737',
          Code: 'NoSeat', // Default to NoSeat for SSR data
          AvailablityType: 0,
          Description: '2',
          RowNo: '0',
          SeatNo: null,
          SeatType: 0,
          SeatWayType: isReturnJourney ? 3 : 2,
          Compartment: 0,
          Deck: 0,
          Currency: 'INR',
          Price: 0
        }
      }))
    );

    // Get selected seats from flightAddonsService
    const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
      s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
    );

    // Determine unique segments from SSR data based on Origin and Destination
    const uniqueSegments = new Map<string, { origin: string; destination: string; segmentIndex: number; ssrSeatSelection: any }>();
    ssrSeatSelections.forEach((ssrSeat: any) => {
      const key = `${ssrSeat.seat?.Origin || ''}-${ssrSeat.seat?.Destination || ''}`;
      if (!uniqueSegments.has(key)) {
        uniqueSegments.set(key, {
          origin: ssrSeat.seat?.Origin || '',
          destination: ssrSeat.seat?.Destination || '',
          segmentIndex: ssrSeat.segmentIndex,
          ssrSeatSelection: ssrSeat
        });
      }
    });

    // Generate seats based on unique SSR segments
    const seats = paxType === 3
      ? [] // Infants have no seats
      : Array.from(uniqueSegments.values()).map(({ origin, destination, segmentIndex, ssrSeatSelection }) => {
          // Check if there's a selected seat for this segment
          const selectedSeat = selectedSeats.find(
            s => s.segmentIndex === segmentIndex && s.isReturn === isReturnJourney
          );
          // Use selected seat if available, otherwise fall back to SSR data
          const seatSelection = selectedSeat || ssrSeatSelection;
          // Find corresponding flight segment for fallback fields
          const matchingSegment = segments.find(
            seg => seg.originCode === origin && seg.destinationCode === destination
          ) || segments[segmentIndex] || segments[0] || {}; // Fallback to empty object
          return extractSeatDynamic(matchingSegment, seatSelection, isReturnJourney);
        }) || [];

      console.log("Final Seats Array:", JSON.stringify(seats, null, 2));

      const specialServices = paxType === 3 ? null : (() => {
        const uniqueSpecialServices = new Map();
        this.flightAddonsService.selectedServicesFinal
          .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
          .forEach(s => {
            const service = this.extractSpecialServiceDynamic(
              {
                code: segments?.[0]?.code || '',
                originCode: segments?.[0]?.originCode || '',
                destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
              },
              s,
              isReturnJourney
            );
            uniqueSpecialServices.set(service.Code, service);
          });
        return Array.from(uniqueSpecialServices.values());
      })();

      // const baggage = paxType === 3 ? null : flightData.baggage && flightData.baggage.length > 0
      //   ? [{
      //       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
      //       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
      //       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
      //       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
      //       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
      //       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
      //       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
      //       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
      //       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
      //       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
      //     }]
      //   : [{
      //       AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
      //       FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
      //       WayType: isReturnJourney ? 3 : 2,
      //       Code: 'NoBaggage',
      //       Description: '2',
      //       Weight: '0',
      //       Currency: 'INR',
      //       Price: 0,
      //       Origin: segments?.[0]?.originCode || '',
      //       Destination: segments?.[segments.length - 1]?.destinationCode || ''
      //     }];

      // Modified baggage logic
  // const baggage = paxType === 3 ? null : ssrData?.Response?.Baggage
  //   ? flightData.baggage && flightData.baggage.length > 0
  //     ? [{
  //         AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
  //         FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
  //         WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 2),
  //         Code: flightData.baggage[globalIndex % flightData.baggage.length].Code || 'NoBaggage',
  //         Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
  //         Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
  //         Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
  //         Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
  //         Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
  //         Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
  //       }]
  //     : [{
  //         AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
  //         FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
  //         WayType: isReturnJourney ? 3 : 2,
  //         Code: 'NoBaggage',
  //         Description: '2',
  //         Weight: '0',
  //         Currency: 'INR',
  //         Price: 0,
  //         Origin: segments?.[0]?.originCode || '',
  //         Destination: segments?.[segments.length - 1]?.destinationCode || ''
  //       }]
  //   : [];

        const baggage = paxType === 3 ? null : (globalIndex < flightData.baggage.length && flightData.baggage[globalIndex]?.Code !== 'NoBaggage')
  ? [{
      AirlineCode: flightData.baggage[globalIndex].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
      FlightNumber: flightData.baggage[globalIndex].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
      WayType: flightData.baggage[globalIndex].WayType || (isReturnJourney ? 3 : 2),
      Code: flightData.baggage[globalIndex].Code || 'NoBaggage',
      Description: flightData.baggage[globalIndex].Description.toString() || '2',
      Weight: flightData.baggage[globalIndex].Weight.toString() || '0',
      Currency: flightData.baggage[globalIndex].Currency || 'INR',
      Price: flightData.baggage[globalIndex].Price || 0,
      Origin: flightData.baggage[globalIndex].Origin || segments?.[0]?.originCode || '',
      Destination: flightData.baggage[globalIndex].Destination || segments?.[segments.length - 1]?.destinationCode || ''
    }]
  : [{
      AirlineCode: segments?.[0]?.code.split(' ')[0] || '',
      FlightNumber: segments?.[0]?.code.split(' ')[1] || '',
      WayType: isReturnJourney ? 3 : 2,
      Code: 'NoBaggage',
      Description: '2',
      Weight: '0',
      Currency: 'INR',
      Price: 0,
      Origin: segments?.[0]?.originCode || '',
      Destination: segments?.[segments.length - 1]?.destinationCode || ''
    }];

      let dob = '1987-12-06';
      if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
        const yyyy = person.dateOfBirth.getFullYear();
        const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
        const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
        dob = `${yyyy}-${mm}-${dd}`;
      }

      const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

      let passportExpiry = '';
      if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
        const yyyy = person.passportExpiryDate.getFullYear();
        const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
        const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
        passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
      }

      let passportIssueDate = '';
      if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
        const yyyy = person.passportIssueDate.getFullYear();
        const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
        const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
        passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
      }

      return {
        Title: title,
        FirstName: person.firstName,
        LastName: person.lastName,
        PaxType: paxType,
        DateOfBirth: `${dob}T00:00:00`,
        Gender: person.gender === 'FEMALE' ? 2 : 1,
        PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
        PassportExpiry: passportExpiry,
        PassportIssueDate: passportIssueDate,
        PassportIssueCountryCode: person.passportIssueCountryCode,
        AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
        AddressLine2: '',
        Fare: generateFare(paxType, isReturnJourney),
        City: 'Siliguri',
        CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
        CountryName: 'India',
        Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
        CellCountryCode: contact.countryCode,
        ContactNo: contact.mobile,
        Email: contact.email,
        IsLeadPax: isLead,
        FFAirlineCode: null,
        FFNumber: null,
        ...(meals.length > 0 ? { MealDynamic: meals } : {}),
        ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
        ...(specialServices ? { SpecialServices: specialServices } : {}),
        ...(baggage ? { Baggage: baggage } : {}),
        ...(isLead && gstMandatory ? {
          GSTCompanyAddress: gstInfo.companyName || '',
          GSTCompanyContactNumber: contact.mobile || '',
          GSTCompanyName: gstInfo.companyName || '',
          GSTNumber: gstInfo.registrationNo || '',
          GSTCompanyEmail: contact.email || ''
        } : {}),
        ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
      };
    };

  const buildPassengerNonLCC = (
    person: any,
    paxType: number,
    globalIndex: number,
    isLead: boolean,
    isReturnJourney: boolean = false,
    ssrData: any
  ): any => {
    const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;

    console.log("buildPassengerNonLCC - SSR Data:", JSON.stringify(ssrData, null, 2));
    console.log("buildPassengerNonLCC - PaxType:", paxType, "GlobalIndex:", globalIndex, "IsReturnJourney:", isReturnJourney);

    // Extract unique segments from ssrData.Response.SeatDynamic (only if SeatDynamic exists)
  const ssrSegments: SSRSegment[] = [];
  const segmentSet = new Set<string>();
  if (ssrData?.Response?.SeatDynamic) {
    (ssrData.Response.SeatDynamic || []).forEach((seatDynamic: any, segmentIndex: number) => {
      const seatData = seatDynamic.SegmentSeat ? seatDynamic.SegmentSeat : [seatDynamic];
      seatData.forEach((segmentSeat: any) => {
        const rowSeats = segmentSeat.RowSeats || [segmentSeat];
        const seat = rowSeats[0]?.Seats ? rowSeats[0].Seats[0] : segmentSeat;
        const segmentKey = `${seat.Origin}-${seat.Destination}-${seat.FlightNumber}`;
        if (!segmentSet.has(segmentKey)) {
          segmentSet.add(segmentKey);
          ssrSegments.push({
            originCode: seat.Origin,
            destinationCode: seat.Destination,
            code: `${seat.AirlineCode} ${seat.FlightNumber}`,
            aircraft: seat.CraftType || segments[segmentIndex]?.aircraft || '737'
          });
        }
      });
    });
  }

    // Fallback to flightSegments if ssrSegments is empty and SeatDynamic exists
  if (ssrSegments.length === 0 && ssrData?.Response?.SeatDynamic) {
    segments.forEach((seg, segmentIndex) => {
      const segmentKey = `${seg.originCode}-${seg.destinationCode}-${seg.code}`;
      if (!segmentSet.has(segmentKey)) {
        segmentSet.add(segmentKey);
        ssrSegments.push({
          originCode: seg.originCode,
          destinationCode: seg.destinationCode,
          code: seg.code,
          aircraft: seg.aircraft || '737'
        });
      }
    });
  }

    console.log("SSR Segments (Non-LCC):", JSON.stringify(ssrSegments, null, 2));

    const monthMap: { [key: string]: string } = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12'
    };

    let dob = '1987-12-06';
    if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
      const yyyy = person.dateOfBirth.getFullYear();
      const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      dob = `${yyyy}-${mm}-${dd}`;
    }

    const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

    const meals = segments?.map((seg, segIndex) => {
      if (paxType === 3) {
        return {
          Code: 'NoMeal',
          Description: '2'
        };
      }

      const mealSelection = this.flightAddonsService.getSelectedMealsFinal(isReturnJourney).find(
        m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === isReturnJourney
      );

      console.log("Meal Selection for Segment", segIndex, ":", JSON.stringify(mealSelection, null, 2));

      if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
        return {
          Code: 'NoMeal',
          Description: '2'
        };
      }

      const isMeal = !mealSelection.meal.FlightNumber && !mealSelection.meal.Origin && !mealSelection.meal.Destination;
      if (isMeal) {
        return {
          Code: mealSelection.meal.Code,
          Description: mealSelection.meal.Description || '2'
        };
      }

      return {
        AirlineCode: seg.code.split(' ')[0],
        FlightNumber: seg.code.split(' ')[1],
        WayType: mealSelection.WayType,
        Code: mealSelection.meal.Code ?? 'NoMeal',
        Description: mealSelection.Description || '2',
        AirlineDescription: mealSelection.meal.AirlineDescription || '',
        Quantity: mealSelection.meal.Quantity || 0,
        Currency: mealSelection?.meal['Currency'] || 'INR',
        Price: mealSelection.meal.Price || 0,
        Origin: seg.originCode,
        Destination: seg.destinationCode
      };
    }) || [];

    const validMeals = meals.filter(m => m.Code !== 'NoMeal');
    const mealPayload = validMeals.length > 0 ? (
      validMeals.every(m => !m.FlightNumber && !m.Origin && !m.Destination) && validMeals.length === 1 ?
        { Meal: validMeals[0] } :
        { MealDynamic: meals.filter(m => m.FlightNumber && m.Origin && m.Destination) }
    ) : {};

    console.log("Meals Payload:", JSON.stringify(mealPayload, null, 2));

    // const ssrSeatSelections = (ssrData?.Response?.SeatDynamic || ssrData?.Response?.Seats || []).flatMap((seatDynamic: any, segmentIndex: number) => {
    //   const seatData = seatDynamic.SegmentSeat ? seatDynamic.SegmentSeat : [seatDynamic];
    //   return seatData.map((segmentSeat: any, segIndex: number) => {
    //     const rowSeats = segmentSeat.RowSeats || [segmentSeat];
    //     const seat = rowSeats[0]?.Seats ? rowSeats[0].Seats[0] : segmentSeat;
    //     return {
    //       passengerIndex: globalIndex,
    //       segmentIndex: segmentIndex + segIndex,
    //       isReturn: isReturnJourney,
    //       seat: {
    //         AirlineCode: seat.AirlineCode || segments[segmentIndex]?.code.split(' ')[0] || '',
    //         FlightNumber: seat.FlightNumber || segments[segmentIndex]?.code.split(' ')[1] || '',
    //         CraftType: seat.CraftType || segments[segmentIndex]?.aircraft || '737',
    //         Origin: seat.Origin || segments[segmentIndex]?.originCode || '',
    //         Destination: seat.Destination || segments[segmentIndex]?.destinationCode || '',
    //         AvailablityType: seat.AvailablityType || 0,
    //         Description: seat.Description || '2',
    //         Code: seat.Code || 'NoSeat',
    //         RowNo: seat.RowNo || '0',
    //         SeatNo: seat.SeatNo || null,
    //         SeatType: seat.SeatType || 0,
    //         SeatWayType: seat.SeatWayType || (isReturnJourney ? 3 : 1),
    //         Compartment: seat.Compartment || 0,
    //         Deck: seat.Deck || 0,
    //         Currency: seat.Currency || 'INR',
    //         Price: seat.Price || 0,
    //         Text: seat.Text || ''
    //       }
    //     };
    //   });
    // });

    // console.log("SSR Seat Selections (Non-LCC):", JSON.stringify(ssrSeatSelections, null, 2));

    // const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
    //   s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
    // );

    // console.log("Selected Seats (Non-LCC):", JSON.stringify(selectedSeats, null, 2));

    // const seats = paxType === 3
    //   ? []
    //   : ssrSegments.map((segment, segmentIndex) => {
    //       const selectedSeat = selectedSeats.find(
    //         s => s.segmentIndex === segmentIndex && 
    //              s.isReturn === isReturnJourney && 
    //              s.seat.Origin === segment.originCode && 
    //              s.seat.Destination === segment.destinationCode
    //       );
    //       if (selectedSeat && selectedSeat.seat.Code !== 'NoSeat') {
    //         const matchingSsrSeat = ssrSeatSelections.find(
    //           s => s.segmentIndex === segmentIndex && 
    //                s.isReturn === isReturnJourney && 
    //                s.seat.Code === selectedSeat.seat.Code && 
    //                s.seat.Origin === segment.originCode && 
    //                s.seat.Destination === segment.destinationCode
    //         );
    //         return extractSeatDynamic(segment, matchingSsrSeat || selectedSeat, isReturnJourney);
    //       }
    //       // Fallback to NoSeat for this segment
    //       const ssrSeat = ssrSeatSelections.find(
    //         s => s.segmentIndex === segmentIndex && 
    //              s.isReturn === isReturnJourney && 
    //              s.seat.Origin === segment.originCode && 
    //              s.seat.Destination === segment.destinationCode
    //       ) || {
    //         seat: {
    //           AirlineCode: segment.code.split(' ')[0] || '',
    //           FlightNumber: segment.code.split(' ')[1] || '',
    //           CraftType: segment.aircraft || '737',
    //           Origin: segment.originCode || '',
    //           Destination: segment.destinationCode || '',
    //           AvailablityType: 0,
    //           Description: '2',
    //           Code: 'NoSeat',
    //           RowNo: '0',
    //           SeatNo: null,
    //           SeatType: 0,
    //           SeatWayType: isReturnJourney ? 3 : 1,
    //           Compartment: 0,
    //           Deck: 0,
    //           Currency: 'INR',
    //           Price: 0,
    //           Text: ''
    //         }
    //       };
    //       return extractSeatDynamic(segment, ssrSeat, isReturnJourney);
    //     }).filter(s => s.Code !== 'NoSeat' || selectedSeats.length === 0);

    // console.log("Final Seats Array (Non-LCC):", JSON.stringify(seats, null, 2));

    // const baggage = paxType !== 3 && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage'
    //   ? [{
    //       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
    //       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
    //       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
    //       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
    //       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
    //       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
    //       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
    //       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
    //       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
    //       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
    //     }]
    //   : null;

      // Modified baggage logic
//  const baggage = paxType !== 3 && ssrData?.Response?.Baggage && flightData.baggage && flightData.baggage.length > 0 && flightData.baggage[globalIndex % flightData.baggage.length].Code !== 'NoBaggage'
//   ? [{
//       AirlineCode: flightData.baggage[globalIndex % flightData.baggage.length].AirlineCode || segments?.[0]?.code.split(' ')[0] || '',
//       FlightNumber: flightData.baggage[globalIndex % flightData.baggage.length].FlightNumber || segments?.[0]?.code.split(' ')[1] || '',
//       WayType: flightData.baggage[globalIndex % flightData.baggage.length].WayType || (isReturnJourney ? 3 : 1),
//       Code: flightData.baggage[globalIndex % flightData.baggage.length].Code,
//       Description: flightData.baggage[globalIndex % flightData.baggage.length].Description.toString() || '2',
//       Weight: flightData.baggage[globalIndex % flightData.baggage.length].Weight.toString() || '0',
//       Currency: flightData.baggage[globalIndex % flightData.baggage.length].Currency || 'INR',
//       Price: flightData.baggage[globalIndex % flightData.baggage.length].Price || 0,
//       Origin: flightData.baggage[globalIndex % flightData.baggage.length].Origin || segments?.[0]?.originCode || '',
//       Destination: flightData.baggage[globalIndex % flightData.baggage.length].Destination || segments?.[segments.length - 1]?.destinationCode || ''
//     }]
//   : [];


// Seat logic
  // Seat logic (only generate if ssrData.Response.SeatDynamic exists)
  let seats = [];
  if (ssrData?.Response?.SeatDynamic) {
    const ssrSeatSelections = (ssrData.Response.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) => {
      const seatData = seatDynamic.SegmentSeat ? seatDynamic.SegmentSeat : [seatDynamic];
      return seatData.map((segmentSeat: any, segIndex: number) => {
        const rowSeats = segmentSeat.RowSeats || [segmentSeat];
        const seat = rowSeats[0]?.Seats ? rowSeats[0].Seats[0] : segmentSeat;
        return {
          passengerIndex: globalIndex,
          segmentIndex: segmentIndex + segIndex,
          isReturn: isReturnJourney,
          seat: {
            AirlineCode: seat.AirlineCode || segments[segmentIndex]?.code.split(' ')[0] || '',
            FlightNumber: seat.FlightNumber || segments[segmentIndex]?.code.split(' ')[1] || '',
            CraftType: seat.CraftType || segments[segmentIndex]?.aircraft || '737',
            Origin: seat.Origin || segments[segmentIndex]?.originCode || '',
            Destination: seat.Destination || segments[segmentIndex]?.destinationCode || '',
            AvailablityType: seat.AvailablityType || 0,
            Description: seat.Description || '2',
            Code: seat.Code || 'NoSeat',
            RowNo: seat.RowNo || '0',
            SeatNo: seat.SeatNo || null,
            SeatType: seat.SeatType || 0,
            SeatWayType: seat.SeatWayType || (isReturnJourney ? 3 : 1),
            Compartment: seat.Compartment || 0,
            Deck: seat.Deck || 0,
            Currency: seat.Currency || 'INR',
            Price: seat.Price || 0,
            Text: seat.Text || ''
          }
        };
      });
    });

    const selectedSeats = this.flightAddonsService.getSelectedSeatsFinal(isReturnJourney).filter(
      s => s.passengerIndex === globalIndex && s.isReturn === isReturnJourney
    );

    console.log("Selected Seats (Non-LCC):", JSON.stringify(selectedSeats, null, 2));

    seats = paxType === 3
      ? [] // Infants have no seats
      : ssrSegments.map((segment, segmentIndex) => {
          const selectedSeat = selectedSeats.find(
            s => s.segmentIndex === segmentIndex &&
                 s.isReturn === isReturnJourney &&
                 s.seat.Origin === segment.originCode &&
                 s.seat.Destination === segment.destinationCode &&
                 s.seat.Code !== 'NoSeat'
          );
          const ssrSeat = ssrSeatSelections.find(
            (s: any) => s.segmentIndex === segmentIndex &&
                 s.isReturn === isReturnJourney &&
                 s.seat.Origin === segment.originCode &&
                 s.seat.Destination === segment.destinationCode
          ) || {
            seat: {
              AirlineCode: segment.code.split(' ')[0] || '',
              FlightNumber: segment.code.split(' ')[1] || '',
              CraftType: segment.aircraft || '737',
              Origin: segment.originCode || '',
              Destination: segment.destinationCode || '',
              AvailablityType: 0,
              Description: '2',
              Code: 'NoSeat',
              RowNo: '0',
              SeatNo: null,
              SeatType: 0,
              SeatWayType: isReturnJourney ? 3 : 1,
              Compartment: 0,
              Deck: 0,
              Currency: 'INR',
              Price: 0,
              Text: ''
            }
          };
          return extractSeatDynamic(segment, selectedSeat || ssrSeat, isReturnJourney);
        });

    console.log("Final Seats Array (Non-LCC):", JSON.stringify(seats, null, 2));
  }

// Baggage logic (only generate if ssrData.Response.Baggage exists)
  let baggage = null;
  if (ssrData?.Response?.Baggage) {
    baggage = paxType === 3 ? null : [{
      AirlineCode: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].AirlineCode || segments[0]?.code.split(' ')[0] || ''
        : segments[0]?.code.split(' ')[0] || '',
      FlightNumber: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].FlightNumber || segments[0]?.code.split(' ')[1] || ''
        : segments[0]?.code.split(' ')[1] || '',
      WayType: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].WayType || (isReturnJourney ? 3 : 1)
        : isReturnJourney ? 3 : 1,
      Code: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].Code || 'NoBaggage'
        : 'NoBaggage',
      Description: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].Description?.toString() || '2'
        : '2',
      Weight: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].Weight?.toString() || '0'
        : '0',
      Currency: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].Currency || 'INR'
        : 'INR',
      Price: flightData.baggage && globalIndex < flightData.baggage.length
        ? flightData.baggage[globalIndex].Price || 0
        : 0,
      Origin: segments[0]?.originCode || '',
      Destination: segments[segments.length - 1]?.destinationCode || ''
    }];
  }

    const uniqueSpecialServices = new Map();
    if (paxType !== 3) {
      this.flightAddonsService.selectedServicesFinal
        .filter(s => s.service.isReturn === isReturnJourney && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
        .forEach(s => {
          const service = this.extractSpecialServiceDynamic(
            {
              code: segments?.[0]?.code || '',
              originCode: segments?.[0]?.originCode || '',
              destinationCode: segments?.[segments.length - 1]?.destinationCode || ''
            },
            s,
            isReturnJourney
          );
          uniqueSpecialServices.set(service.Code, service);
        });
    }
    const specialServices = Array.from(uniqueSpecialServices.values());

    console.log("Special Services (Non-LCC):", JSON.stringify(specialServices, null, 2));

    let passportExpiry = '';
    if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
      const yyyy = person.passportExpiryDate.getFullYear();
      const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
      passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    let passportIssueDate = '';
    if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
      const yyyy = person.passportIssueDate.getFullYear();
      const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
      passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    return {
      Title: title,
      FirstName: person.firstName,
      LastName: person.lastName,
      PaxType: paxType,
      DateOfBirth: `${dob}T00:00:00`,
      Gender: person.gender === 'FEMALE' ? 2 : 1,
      PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
      PassportExpiry: passportExpiry,
      PassportIssueDate: passportIssueDate,
      PassportIssueCountryCode: person.passportIssueCountryCode,
      AddressLine1: '123, Test',
      AddressLine2: '',
      Fare: generateFare(paxType, isReturnJourney),
      City: 'Gurgaon',
      CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CellCountryCode: contact.countryCode,
      ContactNo: contact.mobile,
      Email: contact.email,
      IsLeadPax: isLead,
      FFAirlineCode: null,
      FFNumber: '',
      GSTCompanyAddress: '',
      GSTCompanyContactNumber: '',
      GSTCompanyName: '',
      GSTCompanyEmail: '',
      ...mealPayload,
      ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
      ...(baggage ? { Baggage: baggage } : {}),
      ...(specialServices && specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
      ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
    };
  }

    const passengersList: any[] = [];
    let globalIndex = 0;

    console.log("Passengers in payload", JSON.stringify(passengers, null, 2));
    console.log("SSR in payload", JSON.stringify(ssrData, null, 2));
    console.log("Flight Data in payload", JSON.stringify(flightData, null, 2));
    

    if (isLCC) {
      passengers.adults.forEach((adult, i) => {
        passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, isReturn, ssrData));
        globalIndex++;
      });

      passengers.children.forEach((child, i) => {
        passengersList.push(buildPassenger(child, 2, i, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });

      passengers.infants.forEach((infant, i) => {
        passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });
    } else {
      passengers.adults.forEach((adult, i) => {
        passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, isReturn, ssrData));
        globalIndex++;
      });

      passengers.children.forEach((child, i) => {
        passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });

      passengers.infants.forEach((infant, i) => {
        passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });
    }

    return isLCC ? {
      PreferredCurrency: 'INR',
      AgentReferenceNo: `REF${Date.now()}`,
      Passengers: passengersList,
      EndUserIp: ipAddress,
      TokenId: tboToken,
      TraceId: traceId,
      ResultIndex: resultIndex
    } : {
      ResultIndex: resultIndex,
      Passengers: passengersList,
      EndUserIp: ipAddress,
      TokenId: tboToken,
      TraceId: traceId
    };
  }


  // generateBookingPayloadInternationReturn(
  //     isLCC: boolean,
  //     flightData: {
  //       adultFareDetail: any;
  //       childrenFareDetail?: any;
  //       infantFareDetail?: any;
  //       fareCommonDetail?: any;
  //       adultBaseFare: number;
  //       adultTaxes: number;
  //       adultBaseFareReturn?: number;
  //       adultTaxesReturn?: number;
  //       childrenBaseFare?: number;
  //       childrenTaxes?: number;
  //       childrenBaseFareReturn?: number;
  //       childrenTaxesReturn?: number;
  //       infantBaseFare?: number;
  //       infantTaxes?: number;
  //       infantBaseFareReturn?: number;
  //       infantTaxesReturn?: number;
  //       flightSegments: any[];
  //       flightSegmentsReturn?: any[];
  //       isReturn: boolean;
  //       baggage: any[];
  //     },
  //     bookingParams: {
  //       tboToken: string;
  //       traceId: string;
  //       resultIndex: string;
  //       ipAddress: string;
  //     },
  //     passengers: {
  //       adults: any[];
  //       children: any[];
  //       infants: any[];
  //     },
  //     contact: Contact,
  //     gstInfo: GSTInfo,
  //     gstMandatory: boolean,
  //     passportInfoRequired: boolean,
  //     ssrData?: any
  // ): any {
  //     const {
  //       adultFareDetail,
  //       childrenFareDetail,
  //       infantFareDetail,
  //       fareCommonDetail,
  //       adultBaseFare,
  //       adultTaxes,
  //       adultBaseFareReturn,
  //       adultTaxesReturn,
  //       childrenBaseFare,
  //       childrenTaxes,
  //       childrenBaseFareReturn,
  //       childrenTaxesReturn,
  //       infantBaseFare,
  //       infantTaxes,
  //       infantBaseFareReturn,
  //       infantTaxesReturn,
  //       flightSegments,
  //       flightSegmentsReturn,
  //       isReturn,
  //       baggage
  //     } = flightData;

  //     const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

  //     const generateFare = (type: number, isReturnJourney: boolean = false): any => {
  //       let fareDetail;
  //       switch (type) {
  //         case 1: fareDetail = adultFareDetail; break;
  //         case 2: fareDetail = childrenFareDetail; break;
  //         case 3: fareDetail = infantFareDetail; break;
  //         default: return {};
  //       }

  //       if (isLCC) {
  //         return {
  //           Currency: fareDetail?.Currency || 'INR',
  //           BaseFare: fareDetail?.BaseFare,
  //           Tax: fareDetail?.Tax,
  //           YQTax: fareDetail?.YQTax || 0,
  //           AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
  //           AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
  //           OtherCharges: fareDetail?.OtherCharges || 0
  //         };
  //       }

  //       return {
  //         Currency: fareCommonDetail?.Currency || 'INR',
  //         BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
  //           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
  //           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
  //         Tax: fareCommonDetail?.Tax || (isReturnJourney
  //           ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
  //           : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
  //         YQTax: fareCommonDetail?.YQTax || 0,
  //         AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
  //         AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
  //         OtherCharges: fareCommonDetail?.OtherCharges || 0,
  //         Discount: fareCommonDetail?.Discount || 0,
  //         PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
  //           ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
  //           : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
  //         OfferedFare: fareCommonDetail?.OfferedFare || 0,
  //         TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
  //         TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
  //         TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
  //         ServiceFee: fareCommonDetail?.ServiceFee || 0
  //       };
  //     };

  //     const getMealKey = (ssrData: any): string => {
  //       if (ssrData?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic) {
  //         return 'MealDynamic';
  //       }
  //       if (ssrData?.Response?.Meal || ssrData?.return?.Response?.Meal) {
  //         return 'Meal';
  //       }
  //       return 'MealDynamic'; // Default to MealDynamic if no meal data is present
  //     };

  //     const extractMeal = (segment: any, mealSelection: any, isReturnJourney: boolean, mealKey: string): any => {
  //       if (!mealSelection || mealSelection.meal.Code === 'NoMeal') {
  //         return null;
  //       }
  //       if (mealKey === 'Meal') {
  //         return {
  //           Code: mealSelection?.meal?.Code ?? 'NoMeal',
  //           Description: mealSelection?.Description ?? '2'
  //         };
  //       }
  //       return {
  //         AirlineCode: segment.code.split(' ')[0],
  //         FlightNumber: segment.code.split(' ')[1],
  //         WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
  //         Code: mealSelection?.meal?.Code ?? 'NoMeal',
  //         Description: mealSelection?.Description ?? '2',
  //         AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
  //         Quantity: mealSelection?.meal?.Quantity ?? 0,
  //         Currency: mealSelection?.meal?.Currency ?? 'INR',
  //         Price: mealSelection?.meal?.Price ?? 0,
  //         Origin: segment.originCode,
  //         Destination: segment.destinationCode
  //       };
  //     };

  //     const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
  //       if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
  //         return null;
  //       }
  //       return {
  //         AirlineCode: seatSelection.seat.AirlineCode || segment?.code.split(' ')[0] || '',
  //         FlightNumber: seatSelection.seat.FlightNumber || segment?.code.split(' ')[1] || '',
  //         CraftType: seatSelection.seat.CraftType || segment?.aircraft || '737',
  //         Origin: seatSelection.seat.Origin || segment?.originCode || '',
  //         Destination: seatSelection.seat.Destination || segment?.destinationCode || '',
  //         AvailablityType: seatSelection.seat.AvailablityType || 0,
  //         Description: seatSelection.seat.Description || '2',
  //         Code: seatSelection.seat.Code,
  //         RowNo: seatSelection.seat.RowNo || '0',
  //         SeatNo: seatSelection.seat.SeatNo || null,
  //         SeatType: seatSelection.seat.SeatType || 0,
  //         SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
  //         Compartment: seatSelection.seat.Compartment || 0,
  //         Deck: seatSelection.seat.Deck || 0,
  //         Currency: seatSelection.seat.Currency || 'INR',
  //         Price: seatSelection.seat.Price || 0,
  //         Text: seatSelection.seat.Text || ''
  //       };
  //     };

  //     const extractSpecialServiceDynamic = (segment: any, serviceSelection: any, isReturnJourney: boolean): any => {
  //       if (!serviceSelection?.service || serviceSelection.service.Code === 'NoService') {
  //         return null;
  //       }
  //       return {
  //         AirlineCode: segment.code.split(' ')[0],
  //         FlightNumber: segment.code.split(' ')[1],
  //         WayType: serviceSelection.service.WayType || (isReturnJourney ? 3 : 2),
  //         Code: serviceSelection.service.Code,
  //         Description: serviceSelection.service.Description?.toString() || '2',
  //         Origin: segment.originCode,
  //         Destination: segment.destinationCode,
  //         Currency: serviceSelection.service.Currency || 'INR',
  //         Price: serviceSelection.service.Price || 0
  //       };
  //     };

  //     const getBaggagePayload = (baggageItem: any, segment: any): any => ({
  //       AirlineCode: baggageItem?.AirlineCode || segment?.code?.split(' ')[0] || '',
  //       FlightNumber: baggageItem?.FlightNumber || segment?.code?.split(' ')[1] || '',
  //       WayType: baggageItem?.WayType || 2,
  //       Code: baggageItem?.Code || 'NoBaggage',
  //       Description: baggageItem?.Description?.toString() || '2',
  //       Weight: baggageItem?.Weight?.toString() || '0',
  //       Currency: baggageItem?.Currency || 'INR',
  //       Price: baggageItem?.Price || 0,
  //       Origin: baggageItem?.Origin || segment?.originCode || '',
  //       Destination: baggageItem?.Destination || segment?.destinationCode || ''
  //     });

  //     const buildPassenger = (
  //       person: any,
  //       paxType: number,
  //       localIndex: number,
  //       globalIndex: number,
  //       isLead: boolean,
  //       isReturnJourney: boolean,
  //       ssrData: any
  //     ): any => {
  //       const onwardSegments = flightSegments;
  //       const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
  //       const mealKey = getMealKey(ssrData);

  //       // Meals
  //       let meals: any = undefined;
  //       if (paxType !== 3) {
  //         if (mealKey === 'Meal') {
  //           // Select only the first valid meal for the onward journey
  //           const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
  //             m => m.passengerIndex === globalIndex && m.segmentIndex === 0 && m.isReturn === false
  //           );
  //           meals = mealSelection ? extractMeal(onwardSegments[0], mealSelection, false, mealKey) : undefined;
  //         } else {
  //           // For MealDynamic, collect meals for both onward and return journeys
  //           const onwardMeals = onwardSegments?.map((seg, segIndex) => {
  //             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
  //               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === false
  //             );
  //             return extractMeal(seg, mealSelection, false, mealKey);
  //           }).filter(m => m !== null) || [];

  //           const returnMeals = (isReturn && returnSegments.length > 0) ? returnSegments.map((seg, segIndex) => {
  //             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(true).find(
  //               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === true
  //             );
  //             return extractMeal(seg, mealSelection, true, mealKey);
  //           }).filter(m => m !== null) || [] : [];

  //           meals = [...onwardMeals, ...returnMeals];
  //           meals = meals.length > 0 ? meals : undefined;
  //         }
  //       }

  //       // Seats
  //       const onwardSeatSelections = (ssrData?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
  //         seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
  //           passengerIndex: globalIndex,
  //           segmentIndex: segmentIndex + segIndex,
  //           isReturn: false,
  //           seat: segmentSeat.RowSeats[0]?.Seats[0] || {
  //             AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || onwardSegments[segmentIndex]?.code.split(' ')[0] || '',
  //             FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || onwardSegments[segmentIndex]?.code.split(' ')[1] || '',
  //             Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || onwardSegments[segmentIndex]?.originCode || '',
  //             Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || onwardSegments[segmentIndex]?.destinationCode || '',
  //             CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || onwardSegments[segmentIndex]?.aircraft || '737',
  //             Code: 'NoSeat',
  //             AvailablityType: 0,
  //             Description: '2',
  //             RowNo: '0',
  //             SeatNo: null,
  //             SeatType: 0,
  //             SeatWayType: 2,
  //             Compartment: 0,
  //             Deck: 0,
  //             Currency: 'INR',
  //             Price: 0
  //           }
  //         })) || []
  //       );

  //       const returnSeatSelections = (ssrData?.return?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
  //         seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
  //           passengerIndex: globalIndex,
  //           segmentIndex: segmentIndex + segIndex,
  //           isReturn: true,
  //           seat: segmentSeat.RowSeats[0]?.Seats[0] || {
  //             AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || returnSegments[segmentIndex]?.code.split(' ')[0] || '',
  //             FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || returnSegments[segmentIndex]?.code.split(' ')[1] || '',
  //             Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || returnSegments[segmentIndex]?.originCode || '',
  //             Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || returnSegments[segmentIndex]?.destinationCode || '',
  //             CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || returnSegments[segmentIndex]?.aircraft || '737',
  //             Code: 'NoSeat',
  //             AvailablityType: 0,
  //             Description: '2',
  //             RowNo: '0',
  //             SeatNo: null,
  //             SeatType: 0,
  //             SeatWayType: 3,
  //             Compartment: 0,
  //             Deck: 0,
  //             Currency: 'INR',
  //             Price: 0
  //           }
  //         })) || []
  //       );

  //       const selectedOnwardSeats = this.flightAddonsService.getSelectedSeatsFinal(false).filter(
  //         s => s.passengerIndex === globalIndex && s.isReturn === false
  //       );

  //       const selectedReturnSeats = this.flightAddonsService.getSelectedSeatsFinal(true).filter(
  //         s => s.passengerIndex === globalIndex && s.isReturn === true
  //       );

  //       const onwardSeats = paxType === 3 ? [] : onwardSegments.map((segment, segmentIndex) => {
  //         const selectedSeat = selectedOnwardSeats.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         const ssrSeat = onwardSeatSelections.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, false);
  //       }).filter(s => s !== null);

  //       const returnSeats = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? returnSegments.map((segment, segmentIndex) => {
  //         const selectedSeat = selectedReturnSeats.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         const ssrSeat = returnSeatSelections.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, true);
  //       }).filter(s => s !== null) : [];

  //       const seats = [...onwardSeats, ...returnSeats];

  //       // Special Services
  //       const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
  //         .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
  //         .map(s => extractSpecialServiceDynamic(
  //           onwardSegments[0] || {},
  //           s,
  //           false
  //         )).filter(s => s !== null);

  //       const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
  //         .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
  //         .map(s => extractSpecialServiceDynamic(
  //           returnSegments[0] || {},
  //           s,
  //           true
  //         )).filter(s => s !== null) : [];

  //       const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

  //       // Baggage
  //       const selectedBaggage: any[] = [];
  //       if (paxType !== 3 && baggage && baggage.length > 0) {
  //         const onwardBaggage = baggage.find(b => b.Origin === flightSegments[0]?.originCode && b.Destination === flightSegments[flightSegments.length - 1]?.destinationCode);
  //         if (onwardBaggage) {
  //           selectedBaggage.push(getBaggagePayload(onwardBaggage, flightSegments[0]));
  //         }
  //         if (isReturn && flightSegmentsReturn) {
  //           const returnBaggage = baggage.find(b => b.Origin === flightSegmentsReturn[0]?.originCode && b.Destination === flightSegmentsReturn[flightSegmentsReturn.length - 1]?.destinationCode);
  //           if (returnBaggage) {
  //             selectedBaggage.push(getBaggagePayload(returnBaggage, flightSegmentsReturn[0]));
  //           }
  //         }
  //       }

  //       const baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;

  //       let dob = '1987-12-06';
  //       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
  //         const yyyy = person.dateOfBirth.getFullYear();
  //         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
  //         dob = `${yyyy}-${mm}-${dd}`;
  //       }

  //       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

  //       let passportExpiry = '';
  //       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
  //         const yyyy = person.passportExpiryDate.getFullYear();
  //         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
  //         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
  //       }

  //       let passportIssueDate = '';
  //       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
  //         const yyyy = person.passportIssueDate.getFullYear();
  //         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
  //         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
  //       }

  //       return {
  //         Title: title,
  //         FirstName: person.firstName,
  //         LastName: person.lastName,
  //         PaxType: paxType,
  //         DateOfBirth: `${dob}T00:00:00`,
  //         Gender: person.gender === 'FEMALE' ? 2 : 1,
  //         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
  //         PassportExpiry: passportExpiry,
  //         PassportIssueDate: passportIssueDate,
  //         PassportIssueCountryCode: person.passportIssueCountryCode,
  //         AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
  //         AddressLine2: '',
  //         Fare: generateFare(paxType, isReturnJourney),
  //         City: 'Siliguri',
  //         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
  //         CountryName: 'India',
  //         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
  //         CellCountryCode: '+91',
  //         ContactNo: contact.mobile,
  //         Email: contact.email,
  //         IsLeadPax: isLead,
  //         FFAirlineCode: null,
  //         FFNumber: null,
  //         ...(meals && mealKey === 'Meal' ? { Meal: meals } : {}),
  //         ...(meals && mealKey === 'MealDynamic' ? { MealDynamic: meals } : {}),
  //         ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
  //         ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
  //         ...(baggagePayload ? { Baggage: baggagePayload } : {}),
  //         ...(isLead && gstMandatory ? {
  //           GSTCompanyAddress: gstInfo.companyName || '',
  //           GSTCompanyContactNumber: contact.mobile || '',
  //           GSTCompanyName: gstInfo.companyName || '',
  //           GSTNumber: gstInfo.registrationNo || '',
  //           GSTCompanyEmail: contact.email || ''
  //         } : {}),
  //         ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
  //       };
  //     };

  //     const buildPassengerNonLCC = (
  //       person: any,
  //       paxType: number,
  //       globalIndex: number,
  //       isLead: boolean,
  //       isReturnJourney: boolean = false,
  //       ssrData: any
  //     ): any => {
  //       const onwardSegments = flightSegments;
  //       const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
  //       const mealKey = getMealKey(ssrData);

  //       // Meals
  //       let meals: any = undefined;
  //       if (paxType !== 3) {
  //         if (mealKey === 'Meal') {
  //           // Select only the first valid meal for the onward journey
  //           const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
  //             m => m.passengerIndex === globalIndex && m.segmentIndex === 0 && m.isReturn === false
  //           );
  //           meals = mealSelection ? extractMeal(onwardSegments[0], mealSelection, false, mealKey) : undefined;
  //         } else {
  //           // For MealDynamic, collect meals for both onward and return journeys
  //           const onwardMeals = onwardSegments?.map((seg, segIndex) => {
  //             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
  //               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === false
  //             );
  //             return extractMeal(seg, mealSelection, false, mealKey);
  //           }).filter(m => m !== null) || [];

  //           const returnMeals = (isReturn && returnSegments.length > 0) ? returnSegments.map((seg, segIndex) => {
  //             const mealSelection = this.flightAddonsService.getSelectedMealsFinal(true).find(
  //               m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === true
  //             );
  //             return extractMeal(seg, mealSelection, true, mealKey);
  //           }).filter(m => m !== null) || [] : [];

  //           meals = [...onwardMeals, ...returnMeals];
  //           meals = meals.length > 0 ? meals : undefined;
  //         }
  //       }

  //       // Seats
  //       const onwardSeatSelections = (ssrData?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
  //         seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
  //           passengerIndex: globalIndex,
  //           segmentIndex: segmentIndex + segIndex,
  //           isReturn: false,
  //           seat: segmentSeat.RowSeats[0]?.Seats[0] || {
  //             AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || onwardSegments[segmentIndex]?.code.split(' ')[0] || '',
  //             FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || onwardSegments[segmentIndex]?.code.split(' ')[1] || '',
  //             Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || onwardSegments[segmentIndex]?.originCode || '',
  //             Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || onwardSegments[segmentIndex]?.destinationCode || '',
  //             CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || onwardSegments[segmentIndex]?.aircraft || '737',
  //             Code: 'NoSeat',
  //             AvailablityType: 0,
  //             Description: '2',
  //             RowNo: '0',
  //             SeatNo: null,
  //             SeatType: 0,
  //             SeatWayType: 2,
  //             Compartment: 0,
  //             Deck: 0,
  //             Currency: 'INR',
  //             Price: 0
  //           }
  //         })) || []
  //       );

  //       const returnSeatSelections = (ssrData?.return?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
  //         seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
  //           passengerIndex: globalIndex,
  //           segmentIndex: segmentIndex + segIndex,
  //           isReturn: true,
  //           seat: segmentSeat.RowSeats[0]?.Seats[0] || {
  //             AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || returnSegments[segmentIndex]?.code.split(' ')[0] || '',
  //             FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || returnSegments[segmentIndex]?.code.split(' ')[1] || '',
  //             Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || returnSegments[segmentIndex]?.originCode || '',
  //             Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || returnSegments[segmentIndex]?.destinationCode || '',
  //             CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || returnSegments[segmentIndex]?.aircraft || '737',
  //             Code: 'NoSeat',
  //             AvailablityType: 0,
  //             Description: '2',
  //             RowNo: '0',
  //             SeatNo: null,
  //             SeatType: 0,
  //             SeatWayType: 3,
  //             Compartment: 0,
  //             Deck: 0,
  //             Currency: 'INR',
  //             Price: 0
  //           }
  //         })) || []
  //       );

  //       const selectedOnwardSeats = this.flightAddonsService.getSelectedSeatsFinal(false).filter(
  //         s => s.passengerIndex === globalIndex && s.isReturn === false
  //       );

  //       const selectedReturnSeats = this.flightAddonsService.getSelectedSeatsFinal(true).filter(
  //         s => s.passengerIndex === globalIndex && s.isReturn === true
  //       );

  //       const onwardSeats = paxType === 3 ? [] : onwardSegments.map((segment, segmentIndex) => {
  //         const selectedSeat = selectedOnwardSeats.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         const ssrSeat = onwardSeatSelections.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, false);
  //       }).filter(s => s !== null);

  //       const returnSeats = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? returnSegments.map((segment, segmentIndex) => {
  //         const selectedSeat = selectedReturnSeats.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         const ssrSeat = returnSeatSelections.find(
  //           s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
  //         );
  //         return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, true);
  //       }).filter(s => s !== null) : [];

  //       const seats = [...onwardSeats, ...returnSeats];

  //       // Special Services
  //       const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
  //         .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
  //         .map(s => extractSpecialServiceDynamic(
  //           onwardSegments[0] || {},
  //           s,
  //           false
  //         )).filter(s => s !== null);

  //       const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
  //         .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
  //         .map(s => extractSpecialServiceDynamic(
  //           returnSegments[0] || {},
  //           s,
  //           true
  //         )).filter(s => s !== null) : [];

  //       const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

  //       // Baggage
  //       const selectedBaggage: any[] = [];
  //       if (paxType !== 3 && baggage && baggage.length > 0) {
  //         const onwardBaggage = baggage.find(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode);
  //         if (onwardBaggage) {
  //           selectedBaggage.push(getBaggagePayload(onwardBaggage, onwardSegments[0]));
  //         }
  //         if (isReturn && returnSegments.length > 0) {
  //           const returnBaggage = baggage.find(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode);
  //           if (returnBaggage) {
  //             selectedBaggage.push(getBaggagePayload(returnBaggage, returnSegments[0]));
  //           }
  //         }
  //       }

  //       const baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;

  //       let dob = '1987-12-06';
  //       if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
  //         const yyyy = person.dateOfBirth.getFullYear();
  //         const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
  //         dob = `${yyyy}-${mm}-${dd}`;
  //       }

  //       const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

  //       let passportExpiry = '';
  //       if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
  //         const yyyy = person.passportExpiryDate.getFullYear();
  //         const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
  //         passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
  //       }

  //       let passportIssueDate = '';
  //       if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
  //         const yyyy = person.passportIssueDate.getFullYear();
  //         const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
  //         const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
  //         passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
  //       }

  //       return {
  //         Title: title,
  //         FirstName: person.firstName,
  //         LastName: person.lastName,
  //         PaxType: paxType,
  //         DateOfBirth: `${dob}T00:00:00`,
  //         Gender: person.gender === 'FEMALE' ? 2 : 1,
  //         PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
  //         PassportExpiry: passportExpiry,
  //         PassportIssueDate: passportIssueDate,
  //         PassportIssueCountryCode: person.passportIssueCountryCode,
  //         AddressLine1: '123, Test',
  //         AddressLine2: '',
  //         Fare: generateFare(paxType, isReturnJourney),
  //         City: 'Gurgaon',
  //         CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
  //         Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
  //         CellCountryCode: '+91',
  //         ContactNo: contact.mobile,
  //         Email: contact.email,
  //         IsLeadPax: isLead,
  //         FFAirlineCode: null,
  //         FFNumber: '',
  //         GSTCompanyAddress: '',
  //         GSTCompanyContactNumber: '',
  //         GSTCompanyName: '',
  //         GSTCompanyEmail: '',
  //         ...(meals && mealKey === 'Meal' ? { Meal: meals } : {}),
  //         ...(meals && mealKey === 'MealDynamic' ? { MealDynamic: meals } : {}),
  //         ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
  //         ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
  //         ...(baggagePayload ? { Baggage: baggagePayload } : {}),
  //         ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
  //       };
  //     };

  //     const passengersList: any[] = [];
  //     let globalIndex = 0;

  //     if (isLCC) {
  //       passengers.adults.forEach((adult, i) => {
  //         passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, true, ssrData));
  //         globalIndex++;
  //       });

  //       passengers.children.forEach((child, i) => {
  //         passengersList.push(buildPassenger(child, 2, i, globalIndex, false, true, ssrData));
  //         globalIndex++;
  //       });

  //       passengers.infants.forEach((infant, i) => {
  //         passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, true, ssrData));
  //         globalIndex++;
  //       });
  //     } else {
  //       passengers.adults.forEach((adult, i) => {
  //         passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, true, ssrData));
  //         globalIndex++;
  //       });

  //       passengers.children.forEach((child, i) => {
  //         passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, true, ssrData));
  //         globalIndex++;
  //       });

  //       passengers.infants.forEach((infant, i) => {
  //         passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, true, ssrData));
  //         globalIndex++;
  //       });
  //     }

  //     return isLCC ? {
  //       PreferredCurrency: 'INR',
  //       AgentReferenceNo: `REF${Date.now()}`,
  //       Passengers: passengersList,
  //       EndUserIp: ipAddress,
  //       TokenId: tboToken,
  //       TraceId: traceId,
  //       ResultIndex: resultIndex
  //     } : {
  //       ResultIndex: resultIndex,
  //       Passengers: passengersList,
  //       EndUserIp: ipAddress,
  //       TokenId: tboToken,
  //       TraceId: traceId
  //     };
  // }



// generateBookingPayloadInternationReturn(
//   isLCC: boolean,
//   flightData: {
//     adultFareDetail: any;
//     childrenFareDetail?: any;
//     infantFareDetail?: any;
//     fareCommonDetail?: any;
//     adultBaseFare: number;
//     adultTaxes: number;
//     adultBaseFareReturn?: number;
//     adultTaxesReturn?: number;
//     childrenBaseFare?: number;
//     childrenTaxes?: number;
//     childrenBaseFareReturn?: number;
//     childrenTaxesReturn?: number;
//     infantBaseFare?: number;
//     infantTaxes?: number;
//     infantBaseFareReturn?: number;
//     infantTaxesReturn?: number;
//     flightSegments: any[];
//     flightSegmentsReturn?: any[];
//     isReturn: boolean;
//     baggage: any[];
//   },
//   bookingParams: {
//     tboToken: string;
//     traceId: string;
//     resultIndex: string;
//     ipAddress: string;
//   },
//   passengers: {
//     adults: any[];
//     children: any[];
//     infants: any[];
//   },
//   contact: Contact,
//   gstInfo: GSTInfo,
//   gstMandatory: boolean,
//   passportInfoRequired: boolean,
//   ssrData?: any
// ): any {
//   const {
//     adultFareDetail,
//     childrenFareDetail,
//     infantFareDetail,
//     fareCommonDetail,
//     adultBaseFare,
//     adultTaxes,
//     adultBaseFareReturn,
//     adultTaxesReturn,
//     childrenBaseFare,
//     childrenTaxes,
//     childrenBaseFareReturn,
//     childrenTaxesReturn,
//     infantBaseFare,
//     infantTaxes,
//     infantBaseFareReturn,
//     infantTaxesReturn,
//     flightSegments,
//     flightSegmentsReturn,
//     isReturn,
//     baggage
//   } = flightData;

//   console.log("Internation Return SSR Data", ssrData);

//   const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//   const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//     let fareDetail;
//     switch (type) {
//       case 1: fareDetail = adultFareDetail; break;
//       case 2: fareDetail = childrenFareDetail; break;
//       case 3: fareDetail = infantFareDetail; break;
//       default: return {};
//     }

//     if (isLCC) {
//       return {
//         Currency: fareDetail?.Currency || 'INR',
//         BaseFare: fareDetail?.BaseFare,
//         Tax: fareDetail?.Tax,
//         YQTax: fareDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareDetail?.OtherCharges || 0
//       };
//     }

//     return {
//       Currency: fareCommonDetail?.Currency || 'INR',
//       BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//       Tax: fareCommonDetail?.Tax || (isReturnJourney
//         ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//         : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//       YQTax: fareCommonDetail?.YQTax || 0,
//       AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//       AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//       OtherCharges: fareCommonDetail?.OtherCharges || 0,
//       Discount: fareCommonDetail?.Discount || 0,
//       PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//       OfferedFare: fareCommonDetail?.OfferedFare || 0,
//       TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//       TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//       TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//       ServiceFee: fareCommonDetail?.ServiceFee || 0
//     };
//   };

//   const getMealKey = (ssrData: any): string => {
//     if (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic) {
//       return 'MealDynamic';
//     }
//     if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
//       return 'Meal';
//     }
//     return 'MealDynamic'; // Default to MealDynamic if no meal data is present
//   };

//   const extractMeal = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//     if (!mealSelection || mealSelection.meal?.Code === 'NoMeal') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         WayType: isReturnJourney ? 3 : 2,
//         Code: 'NoMeal',
//         Description: '2',
//         AirlineDescription: '',
//         Quantity: 0,
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR')
//       };
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || mealSelection.meal.AirlineCode || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || mealSelection.meal.FlightNumber || (isReturnJourney ? '1502' : '685'),
//       WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 2),
//       Code: mealSelection?.meal?.Code ?? 'NoMeal',
//       Description: mealSelection?.Description?.toString() ?? '2',
//       AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
//       Quantity: mealSelection?.meal?.Quantity ?? 0,
//       Currency: mealSelection?.meal?.Currency ?? 'INR',
//       Price: mealSelection?.meal?.Price ?? 0,
//       Origin: segment.originCode || mealSelection?.meal?.Origin || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || mealSelection?.meal?.Destination || (isReturnJourney ? 'MAA' : 'FJR')
//     };
//   };

//   const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//     if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         CraftType: segment.aircraft || 'A320-186',
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//         AvailablityType: 0,
//         Description: '2',
//         Code: 'NoSeat',
//         RowNo: '0',
//         SeatNo: null,
//         SeatType: 0,
//         SeatWayType: isReturnJourney ? 3 : 2,
//         Compartment: 0,
//         Deck: 0,
//         Currency: 'INR',
//         Price: 0,
//         Text: ''
//       };
//     }
//     return {
//       AirlineCode: seatSelection.seat.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//       FlightNumber: seatSelection.seat.FlightNumber || segment?.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       CraftType: seatSelection.seat.CraftType || segment?.aircraft || 'A320-186',
//       Origin: seatSelection.seat.Origin || segment?.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: seatSelection.seat.Destination || segment?.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       AvailablityType: seatSelection.seat.AvailablityType || 0,
//       Description: seatSelection.seat.Description?.toString() || '2',
//       Code: seatSelection.seat.Code,
//       RowNo: seatSelection.seat.RowNo || '0',
//       SeatNo: seatSelection.seat.SeatNo || null,
//       SeatType: seatSelection.seat.SeatType || 0,
//       SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
//       Compartment: seatSelection.seat.Compartment || 0,
//       Deck: seatSelection.seat.Deck || 0,
//       Currency: seatSelection.seat.Currency || 'INR',
//       Price: seatSelection.seat.Price || 0,
//       Text: seatSelection.seat.Text || ''
//     };
//   };

//   const extractSpecialServiceDynamic = (segment: any, serviceSelection: any, isReturnJourney: boolean): any => {
//     if (!serviceSelection?.service || serviceSelection.service.Code === 'NoService') {
//       return null;
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       WayType: serviceSelection.service.WayType || (isReturnJourney ? 3 : 2),
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.service.Description?.toString() || '2',
//       Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0
//     };
//   };

//   const getBaggagePayload = (baggageItem: any, segment: any): any => ({
//     AirlineCode: baggageItem?.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//     FlightNumber: baggageItem?.FlightNumber || segment?.code?.split(' ')[1] || (segment.isReturn ? '1502' : '685'),
//     WayType: baggageItem?.WayType || (segment.isReturn ? 3 : 2),
//     Code: baggageItem?.Code || 'NoBaggage',
//     Description: baggageItem?.Description?.toString() || '2',
//     Weight: baggageItem?.Weight?.toString() || '0',
//     Currency: baggageItem?.Currency || 'INR',
//     Price: baggageItem?.Price || 0,
//     Origin: baggageItem?.Origin || segment?.originCode || (segment.isReturn ? 'FJR' : 'MAA'),
//     Destination: baggageItem?.Destination || segment?.destinationCode || (segment.isReturn ? 'MAA' : 'FJR')
//   });

//   const buildPassenger = (
//     person: any,
//     paxType: number,
//     localIndex: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];

//     // Meals
//     let mealPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic)) {
//       const selectedMeals: any[] = [];

//       // Onward journey meals
//       if (ssrData?.onward?.Response?.MealDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === false &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
//         });
//       }

//       // Return journey meals (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === true &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
//         });
//       }

//       mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
//     }

//     // Seats
//     let seatPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
//       const selectedSeats: any[] = [];

//       // Onward journey seats
//       if (ssrData?.onward?.Response?.SeatDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === false &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
//         });
//       }

//       // Return journey seats (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === true &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
//         });
//       }

//       seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
//     }

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 685', originCode: 'MAA', destinationCode: 'FJR' },
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 1502', originCode: 'FJR', destinationCode: 'MAA' },
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode && b.Code !== 'NoBaggage')
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode && b.Code !== 'NoBaggage')
//         : [];

//       // Onward journey baggage (MAA-FJR)
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         const onwardBaggage = onwardBaggageItems.length > globalIndex ? onwardBaggageItems[globalIndex] : null;
//         selectedBaggage.push(getBaggagePayload(onwardBaggage, segment));
//       }

//       // Return journey baggage (FJR-MAA, only if SSR data exists)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//         const returnBaggage = returnBaggageItems.length > globalIndex ? returnBaggageItems[globalIndex] : null;
//         selectedBaggage.push(getBaggagePayload(returnBaggage, segment));
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(mealPayload ? { MealDynamic: mealPayload } : {}),
//       ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const buildPassengerNonLCC = (
//     person: any,
//     paxType: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean = false,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
//     const mealKey = getMealKey(ssrData);

//     // Meals
//     let meals: any = undefined;
//     if (paxType !== 3) {
//       if (mealKey === 'Meal') {
//         // Select only the first valid meal for the onward journey
//         const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
//           m => m.passengerIndex === globalIndex && m.segmentIndex === 0 && m.isReturn === false
//         );
//         meals = mealSelection ? extractMeal(onwardSegments[0], mealSelection, false) : undefined;
//       } else {
//         // For MealDynamic, collect meals for both onward and return journeys
//         const onwardMeals = onwardSegments?.map((seg, segIndex) => {
//           const mealSelection = this.flightAddonsService.getSelectedMealsFinal(false).find(
//             m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === false
//           );
//           return extractMeal(seg, mealSelection, false);
//         }).filter(m => m !== null) || [];

//         const returnMeals = (isReturn && returnSegments.length > 0) ? returnSegments.map((seg, segIndex) => {
//           const mealSelection = this.flightAddonsService.getSelectedMealsFinal(true).find(
//             m => m.passengerIndex === globalIndex && m.segmentIndex === segIndex && m.isReturn === true
//           );
//           return extractMeal(seg, mealSelection, true);
//         }).filter(m => m !== null) || [] : [];

//         meals = [...onwardMeals, ...returnMeals];
//         meals = meals.length > 0 ? meals : undefined;
//       }
//     }

//     // Seats
//     const onwardSeatSelections = (ssrData?.onward?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
//       seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
//         passengerIndex: globalIndex,
//         segmentIndex: segmentIndex + segIndex,
//         isReturn: false,
//         seat: segmentSeat.RowSeats[0]?.Seats[0] || {
//           AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || onwardSegments[segmentIndex]?.code.split(' ')[0] || '',
//           FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || onwardSegments[segmentIndex]?.code.split(' ')[1] || '',
//           Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || onwardSegments[segmentIndex]?.originCode || '',
//           Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || onwardSegments[segmentIndex]?.destinationCode || '',
//           CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || onwardSegments[segmentIndex]?.aircraft || '737',
//           Code: 'NoSeat',
//           AvailablityType: 0,
//           Description: '2',
//           RowNo: '0',
//           SeatNo: null,
//           SeatType: 0,
//           SeatWayType: 2,
//           Compartment: 0,
//           Deck: 0,
//           Currency: 'INR',
//           Price: 0
//         }
//       })) || []
//     );

//     const returnSeatSelections = (ssrData?.return?.Response?.SeatDynamic || []).flatMap((seatDynamic: any, segmentIndex: number) =>
//       seatDynamic.SegmentSeat?.map((segmentSeat: any, segIndex: number) => ({
//         passengerIndex: globalIndex,
//         segmentIndex: segmentIndex + segIndex,
//         isReturn: true,
//         seat: segmentSeat.RowSeats[0]?.Seats[0] || {
//           AirlineCode: segmentSeat.RowSeats[0]?.Seats[0]?.AirlineCode || returnSegments[segmentIndex]?.code.split(' ')[0] || '',
//           FlightNumber: segmentSeat.RowSeats[0]?.Seats[0]?.FlightNumber || returnSegments[segmentIndex]?.code.split(' ')[1] || '',
//           Origin: segmentSeat.RowSeats[0]?.Seats[0]?.Origin || returnSegments[segmentIndex]?.originCode || '',
//           Destination: segmentSeat.RowSeats[0]?.Seats[0]?.Destination || returnSegments[segmentIndex]?.destinationCode || '',
//           CraftType: segmentSeat.RowSeats[0]?.Seats[0]?.CraftType || returnSegments[segmentIndex]?.aircraft || '737',
//           Code: 'NoSeat',
//           AvailablityType: 0,
//           Description: '2',
//           RowNo: '0',
//           SeatNo: null,
//           SeatType: 0,
//           SeatWayType: 3,
//           Compartment: 0,
//           Deck: 0,
//           Currency: 'INR',
//           Price: 0
//         }
//       })) || []
//     );

//     const selectedOnwardSeats = this.flightAddonsService.getSelectedSeatsFinal(false).filter(
//       s => s.passengerIndex === globalIndex && s.isReturn === false
//     );

//     const selectedReturnSeats = this.flightAddonsService.getSelectedSeatsFinal(true).filter(
//       s => s.passengerIndex === globalIndex && s.isReturn === true
//     );

//     const onwardSeats = paxType === 3 ? [] : onwardSegments.map((segment, segmentIndex) => {
//       const selectedSeat = selectedOnwardSeats.find(
//         s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
//       );
//       const ssrSeat = onwardSeatSelections.find(
//         s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
//       );
//       return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, false);
//     }).filter(s => s !== null);

//     const returnSeats = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? returnSegments.map((segment, segmentIndex) => {
//       const selectedSeat = selectedReturnSeats.find(
//         s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
//       );
//       const ssrSeat = returnSeatSelections.find(
//         s => s.seat.Origin === segment.originCode && s.seat.Destination === segment.destinationCode
//       );
//       return extractSeatDynamic(segment, selectedSeat || ssrSeat || { seat: { Code: 'NoSeat' } }, true);
//     }).filter(s => s !== null) : [];

//     const seats = [...onwardSeats, ...returnSeats];

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments[0] || {},
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments[0] || {},
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode && b.Code !== 'NoBaggage')
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode && b.Code !== 'NoBaggage')
//         : [];

//       // Onward journey baggage (MAA-FJR)
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         const onwardBaggage = onwardBaggageItems.length > globalIndex ? onwardBaggageItems[globalIndex] : null;
//         selectedBaggage.push(getBaggagePayload(onwardBaggage, segment));
//       }

//       // Return journey baggage (FJR-MAA, only if SSR data exists)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(meals && mealKey === 'Meal' ? { Meal: meals } : {}),
//       ...(meals && mealKey === 'MealDynamic' ? { MealDynamic: meals } : {}),
//       ...(seats.length > 0 ? { SeatDynamic: seats } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const passengersList: any[] = [];
//   let globalIndex = 0;

//   if (isLCC) {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassenger(child, 2, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   } else {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   }

//   return isLCC ? {
//     PreferredCurrency: 'INR',
//     AgentReferenceNo: `REF${Date.now()}`,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId,
//     ResultIndex: resultIndex
//   } : {
//     ResultIndex: resultIndex,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId
//   };
// }


// generateBookingPayloadInternationReturn(
//   isLCC: boolean,
//   flightData: {
//     adultFareDetail: any;
//     childrenFareDetail?: any;
//     infantFareDetail?: any;
//     fareCommonDetail?: any;
//     adultBaseFare: number;
//     adultTaxes: number;
//     adultBaseFareReturn?: number;
//     adultTaxesReturn?: number;
//     childrenBaseFare?: number;
//     childrenTaxes?: number;
//     childrenBaseFareReturn?: number;
//     childrenTaxesReturn?: number;
//     infantBaseFare?: number;
//     infantTaxes?: number;
//     infantBaseFareReturn?: number;
//     infantTaxesReturn?: number;
//     flightSegments: any[];
//     flightSegmentsReturn?: any[];
//     isReturn: boolean;
//     baggage: any[];
//   },
//   bookingParams: {
//     tboToken: string;
//     traceId: string;
//     resultIndex: string;
//     ipAddress: string;
//   },
//   passengers: {
//     adults: any[];
//     children: any[];
//     infants: any[];
//   },
//   contact: Contact,
//   gstInfo: GSTInfo,
//   gstMandatory: boolean,
//   passportInfoRequired: boolean,
//   ssrData?: any
// ): any {
//   const {
//     adultFareDetail,
//     childrenFareDetail,
//     infantFareDetail,
//     fareCommonDetail,
//     adultBaseFare,
//     adultTaxes,
//     adultBaseFareReturn,
//     adultTaxesReturn,
//     childrenBaseFare,
//     childrenTaxes,
//     childrenBaseFareReturn,
//     childrenTaxesReturn,
//     infantBaseFare,
//     infantTaxes,
//     infantBaseFareReturn,
//     infantTaxesReturn,
//     flightSegments,
//     flightSegmentsReturn,
//     isReturn,
//     baggage
//   } = flightData;

//   console.log("Internation Return SSR Data", ssrData);

//   const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//   const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//     let fareDetail;
//     switch (type) {
//       case 1: fareDetail = adultFareDetail; break;
//       case 2: fareDetail = childrenFareDetail; break;
//       case 3: fareDetail = infantFareDetail; break;
//       default: return {};
//     }

//     if (isLCC) {
//       return {
//         Currency: fareDetail?.Currency || 'INR',
//         BaseFare: fareDetail?.BaseFare,
//         Tax: fareDetail?.Tax,
//         YQTax: fareDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareDetail?.OtherCharges || 0
//       };
//     }

//     return {
//       Currency: fareCommonDetail?.Currency || 'INR',
//       BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//       Tax: fareCommonDetail?.Tax || (isReturnJourney
//         ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//         : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//       YQTax: fareCommonDetail?.YQTax || 0,
//       AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//       AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//       OtherCharges: fareCommonDetail?.OtherCharges || 0,
//       Discount: fareCommonDetail?.Discount || 0,
//       PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//       OfferedFare: fareCommonDetail?.OfferedFare || 0,
//       TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//       TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//       TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//       ServiceFee: fareCommonDetail?.ServiceFee || 0
//     };
//   };

//   const getMealKey = (ssrData: any): string => {
//     if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
//       return 'Meal';
//     }
//     if (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic) {
//       return 'MealDynamic';
//     }
//     return 'Meal'; // Default to Meal if no meal data is present
//   };

//   const extractMeal = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//     if (!mealSelection || mealSelection.meal?.Code === 'NoMeal') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         WayType: isReturnJourney ? 3 : 2,
//         Code: 'NoMeal',
//         Description: '2',
//         AirlineDescription: '',
//         Quantity: 0,
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR')
//       };
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || mealSelection.meal.AirlineCode || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || mealSelection.meal.FlightNumber || (isReturnJourney ? '1502' : '685'),
//       WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 2),
//       Code: mealSelection?.meal?.Code ?? 'NoMeal',
//       Description: mealSelection?.Description?.toString() ?? '2',
//       AirlineDescription: mealSelection?.meal?.AirlineDescription ?? mealSelection?.meal?.Description ?? '',
//       Quantity: mealSelection?.meal?.Quantity ?? 0,
//       Currency: mealSelection?.meal?.Currency ?? 'INR',
//       Price: mealSelection?.meal?.Price ?? 0,
//       Origin: segment.originCode || mealSelection?.meal?.Origin || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || mealSelection?.meal?.Destination || (isReturnJourney ? 'MAA' : 'FJR')
//     };
//   };

//   const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//     if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         CraftType: segment.aircraft || 'A320-186',
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//         AvailablityType: 0,
//         Description: '2',
//         Code: 'NoSeat',
//         RowNo: '0',
//         SeatNo: null,
//         SeatType: 0,
//         SeatWayType: isReturnJourney ? 3 : 2,
//         Compartment: 0,
//         Deck: 0,
//         Currency: 'INR',
//         Price: 0,
//         Text: ''
//       };
//     }
//     return {
//       AirlineCode: seatSelection.seat.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//       FlightNumber: seatSelection.seat.FlightNumber || segment?.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       CraftType: seatSelection.seat.CraftType || segment?.aircraft || 'A320-186',
//       Origin: seatSelection.seat.Origin || segment?.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: seatSelection.seat.Destination || segment?.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       AvailablityType: seatSelection.seat.AvailablityType || 0,
//       Description: seatSelection.seat.Description?.toString() || '2',
//       Code: seatSelection.seat.Code,
//       RowNo: seatSelection.seat.RowNo || '0',
//       SeatNo: seatSelection.seat.SeatNo || null,
//       SeatType: seatSelection.seat.SeatType || 0,
//       SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
//       Compartment: seatSelection.seat.Compartment || 0,
//       Deck: seatSelection.seat.Deck || 0,
//       Currency: seatSelection.seat.Currency || 'INR',
//       Price: seatSelection.seat.Price || 0,
//       Text: seatSelection.seat.Text || ''
//     };
//   };

//   const extractSpecialServiceDynamic = (segment: any, serviceSelection: any, isReturnJourney: boolean): any => {
//     if (!serviceSelection?.service || serviceSelection.service.Code === 'NoService') {
//       return null;
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       WayType: serviceSelection.service.WayType || (isReturnJourney ? 3 : 2),
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.service.Description?.toString() || '2',
//       Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0
//     };
//   };

//   const getBaggagePayload = (baggageItem: any, segment: any): any => ({
//     AirlineCode: baggageItem?.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//     FlightNumber: baggageItem?.FlightNumber || segment?.code?.split(' ')[1] || (segment.isReturn ? '1502' : '685'),
//     WayType: baggageItem?.WayType || (segment.isReturn ? 3 : 2),
//     Code: baggageItem?.Code || 'NoBaggage',
//     Description: baggageItem?.Description?.toString() || '2',
//     Weight: baggageItem?.Weight?.toString() || '0',
//     Currency: baggageItem?.Currency || 'INR',
//     Price: baggageItem?.Price || 0,
//     Origin: baggageItem?.Origin || segment?.originCode || (segment.isReturn ? 'FJR' : 'MAA'),
//     Destination: baggageItem?.Destination || segment?.destinationCode || (segment.isReturn ? 'MAA' : 'FJR')
//   });

//   const buildPassenger = (
//     person: any,
//     paxType: number,
//     localIndex: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];

//     // Meals
//     let mealPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic)) {
//       const selectedMeals: any[] = [];

//       // Onward journey meals
//       if (ssrData?.onward?.Response?.MealDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === false &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
//         });
//       }

//       // Return journey meals (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === true &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
//         });
//       }

//       mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
//     }

//     // Seats
//     let seatPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
//       const selectedSeats: any[] = [];

//       // Onward journey seats
//       if (ssrData?.onward?.Response?.SeatDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === false &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
//         });
//       }

//       // Return journey seats (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === true &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
//         });
//       }

//       seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
//     }

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 685', originCode: 'MAA', destinationCode: 'FJR' },
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 1502', originCode: 'FJR', destinationCode: 'MAA' },
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
//         : [];

//       // Onward journey baggage
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
//         } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       // Return journey baggage (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//         if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
//         } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(mealPayload ? { MealDynamic: mealPayload } : {}),
//       ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const buildPassengerNonLCC = (
//     person: any,
//     paxType: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean = false,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
//     const mealKey = getMealKey(ssrData);

//     // Meals
//     let mealPayload: any = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Meal || ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.Meal || ssrData?.return?.Response?.MealDynamic)) {
//       if (mealKey === 'MealDynamic') {
//         const selectedMeals: any[] = [];

//         // Onward journey meals
//         if (ssrData?.onward?.Response?.MealDynamic) {
//           onwardSegments.forEach((segment, segIndex) => {
//             const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
//               m => m.passengerIndex === globalIndex && m.isReturn === false &&
//                    m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                    m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//             );
//             selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
//           });
//         }

//         // Return journey meals (if applicable)
//         if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
//           returnSegments.forEach((segment, segIndex) => {
//             const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
//               m => m.passengerIndex === globalIndex && m.isReturn === true &&
//                    m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                    m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//             );
//             selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
//           });
//         }

//         mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
//       } else if (mealKey === 'Meal') {
//         // Select a single meal for the entire journey (onward or return)
//         const onwardMeal = ssrData?.onward?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(false).find(
//           m => m.passengerIndex === globalIndex && m.isReturn === false
//         ) : null;
//         const returnMeal = isReturn && ssrData?.return?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(true).find(
//           m => m.passengerIndex === globalIndex && m.isReturn === true
//         ) : null;

//         // Use the onward meal if available; otherwise, use the return meal
//         const selectedMeal = onwardMeal || returnMeal;
//         if (selectedMeal && selectedMeal.meal?.Code && selectedMeal.meal.Code !== 'NoMeal') {
//           mealPayload = {
//             Code: selectedMeal.meal.Code,
//             Description: selectedMeal.meal.Description || selectedMeal.meal.AirlineDescription || ''
//           };
//         }
//       }
//     }

//     // Seats
//     let seatPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
//       const selectedSeats: any[] = [];

//       // Onward journey seats
//       if (ssrData?.onward?.Response?.SeatDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === false &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
//         });
//       }

//       // Return journey seats (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === true &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
//         });
//       }

//       seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
//     }

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 685', originCode: 'MAA', destinationCode: 'FJR' },
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 1502', originCode: 'FJR', destinationCode: 'MAA' },
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
//         : [];

//       // Onward journey baggage
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
//         } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       // Return journey baggage (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//         if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
//         } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(mealPayload && mealKey === 'MealDynamic' ? { MealDynamic: mealPayload } : {}),
//       ...(mealPayload && mealKey === 'Meal' ? { meal: mealPayload } : {}),
//       ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const passengersList: any[] = [];
//   let globalIndex = 0;

//   if (isLCC) {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassenger(child, 2, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   } else {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   }

//   return isLCC ? {
//     PreferredCurrency: 'INR',
//     AgentReferenceNo: `REF${Date.now()}`,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId,
//     ResultIndex: resultIndex
//   } : {
//     ResultIndex: resultIndex,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId
//   };
// }


// generateBookingPayloadInternationReturn(
//   isLCC: boolean,
//   flightData: {
//     adultFareDetail: any;
//     childrenFareDetail?: any;
//     infantFareDetail?: any;
//     fareCommonDetail?: any;
//     adultBaseFare: number;
//     adultTaxes: number;
//     adultBaseFareReturn?: number;
//     adultTaxesReturn?: number;
//     childrenBaseFare?: number;
//     childrenTaxes?: number;
//     childrenBaseFareReturn?: number;
//     childrenTaxesReturn?: number;
//     infantBaseFare?: number;
//     infantTaxes?: number;
//     infantBaseFareReturn?: number;
//     infantTaxesReturn?: number;
//     flightSegments: any[];
//     flightSegmentsReturn?: any[];
//     isReturn: boolean;
//     baggage: any[];
//   },
//   bookingParams: {
//     tboToken: string;
//     traceId: string;
//     resultIndex: string;
//     ipAddress: string;
//   },
//   passengers: {
//     adults: any[];
//     children: any[];
//     infants: any[];
//   },
//   contact: Contact,
//   gstInfo: GSTInfo,
//   gstMandatory: boolean,
//   passportInfoRequired: boolean,
//   ssrData?: any
// ): any {
//   const {
//     adultFareDetail,
//     childrenFareDetail,
//     infantFareDetail,
//     fareCommonDetail,
//     adultBaseFare,
//     adultTaxes,
//     adultBaseFareReturn,
//     adultTaxesReturn,
//     childrenBaseFare,
//     childrenTaxes,
//     childrenBaseFareReturn,
//     childrenTaxesReturn,
//     infantBaseFare,
//     infantTaxes,
//     infantBaseFareReturn,
//     infantTaxesReturn,
//     flightSegments,
//     flightSegmentsReturn,
//     isReturn,
//     baggage
//   } = flightData;

//   console.log("Internation Return SSR Data", ssrData);

//   const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

//   const generateFare = (type: number, isReturnJourney: boolean = false): any => {
//     let fareDetail;
//     switch (type) {
//       case 1: fareDetail = adultFareDetail; break;
//       case 2: fareDetail = childrenFareDetail; break;
//       case 3: fareDetail = infantFareDetail; break;
//       default: return {};
//     }

//     if (isLCC) {
//       return {
//         Currency: fareDetail?.Currency || 'INR',
//         BaseFare: fareDetail?.BaseFare,
//         Tax: fareDetail?.Tax,
//         YQTax: fareDetail?.YQTax || 0,
//         AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
//         AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
//         OtherCharges: fareDetail?.OtherCharges || 0
//       };
//     }

//     return {
//       Currency: fareCommonDetail?.Currency || 'INR',
//       BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
//       Tax: fareCommonDetail?.Tax || (isReturnJourney
//         ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
//         : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
//       YQTax: fareCommonDetail?.YQTax || 0,
//       AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
//       AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
//       OtherCharges: fareCommonDetail?.OtherCharges || 0,
//       Discount: fareCommonDetail?.Discount || 0,
//       PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
//         ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
//         : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
//       OfferedFare: fareCommonDetail?.OfferedFare || 0,
//       TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
//       TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
//       TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
//       ServiceFee: fareCommonDetail?.ServiceFee || 0
//     };
//   };

//   const getMealKey = (ssrData: any): string => {
//     if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
//       return 'Meal';
//     }
//     if (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic) {
//       return 'MealDynamic';
//     }
//     return 'Meal'; // Default to Meal if no meal data is present
//   };

//   const extractMeal = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
//     if (!mealSelection || mealSelection.meal?.Code === 'NoMeal') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         WayType: isReturnJourney ? 3 : 2,
//         Code: 'NoMeal',
//         Description: '2',
//         AirlineDescription: '',
//         Quantity: 0,
//         Currency: 'INR',
//         Price: 0,
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR')
//       };
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || mealSelection.meal.AirlineCode || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || mealSelection.meal.FlightNumber || (isReturnJourney ? '1502' : '685'),
//       WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 2),
//       Code: mealSelection?.meal?.Code ?? 'NoMeal',
//       Description: mealSelection?.Description?.toString() ?? '2',
//       AirlineDescription: mealSelection?.meal?.AirlineDescription ?? mealSelection?.meal?.Description ?? '',
//       Quantity: mealSelection?.meal?.Quantity ?? 0,
//       Currency: mealSelection?.meal?.Currency ?? 'INR',
//       Price: mealSelection?.meal?.Price ?? 0,
//       Origin: segment.originCode || mealSelection?.meal?.Origin || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || mealSelection?.meal?.Destination || (isReturnJourney ? 'MAA' : 'FJR')
//     };
//   };

//   const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
//     if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
//       return {
//         AirlineCode: segment.code?.split(' ')[0] || '6E',
//         FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//         CraftType: segment.aircraft || 'A320-186',
//         Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//         Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//         AvailablityType: 0,
//         Description: '2',
//         Code: 'NoSeat',
//         RowNo: '0',
//         SeatNo: null,
//         SeatType: 0,
//         SeatWayType: isReturnJourney ? 3 : 2,
//         Compartment: 0,
//         Deck: 0,
//         Currency: 'INR',
//         Price: 0,
//         Text: ''
//       };
//     }
//     return {
//       AirlineCode: seatSelection.seat.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//       FlightNumber: seatSelection.seat.FlightNumber || segment?.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       CraftType: seatSelection.seat.CraftType || segment?.aircraft || 'A320-186',
//       Origin: seatSelection.seat.Origin || segment?.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: seatSelection.seat.Destination || segment?.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       AvailablityType: seatSelection.seat.AvailablityType || 0,
//       Description: seatSelection.seat.Description?.toString() || '2',
//       Code: seatSelection.seat.Code,
//       RowNo: seatSelection.seat.RowNo || '0',
//       SeatNo: seatSelection.seat.SeatNo || null,
//       SeatType: seatSelection.seat.SeatType || 0,
//       SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
//       Compartment: seatSelection.seat.Compartment || 0,
//       Deck: seatSelection.seat.Deck || 0,
//       Currency: seatSelection.seat.Currency || 'INR',
//       Price: seatSelection.seat.Price || 0,
//       Text: seatSelection.seat.Text || ''
//     };
//   };

//   const extractSpecialServiceDynamic = (segment: any, serviceSelection: any, isReturnJourney: boolean): any => {
//     if (!serviceSelection?.service || serviceSelection.service.Code === 'NoService') {
//       return null;
//     }
//     return {
//       AirlineCode: segment.code?.split(' ')[0] || '6E',
//       FlightNumber: segment.code?.split(' ')[1] || (isReturnJourney ? '1502' : '685'),
//       WayType: serviceSelection.service.WayType || (isReturnJourney ? 3 : 2),
//       Code: serviceSelection.service.Code,
//       Description: serviceSelection.service.Description?.toString() || '2',
//       Origin: segment.originCode || (isReturnJourney ? 'FJR' : 'MAA'),
//       Destination: segment.destinationCode || (isReturnJourney ? 'MAA' : 'FJR'),
//       Currency: serviceSelection.service.Currency || 'INR',
//       Price: serviceSelection.service.Price || 0
//     };
//   };

//   const getBaggagePayload = (baggageItem: any, segment: any): any => ({
//     AirlineCode: baggageItem?.AirlineCode || segment?.code?.split(' ')[0] || '6E',
//     FlightNumber: baggageItem?.FlightNumber || segment?.code?.split(' ')[1] || (segment.isReturn ? '1502' : '685'),
//     WayType: baggageItem?.WayType || (segment.isReturn ? 3 : 2),
//     Code: baggageItem?.Code || 'NoBaggage',
//     Description: baggageItem?.Description?.toString() || '2',
//     Weight: baggageItem?.Weight?.toString() || '0',
//     Currency: baggageItem?.Currency || 'INR',
//     Price: baggageItem?.Price || 0,
//     Origin: baggageItem?.Origin || segment?.originCode || (segment.isReturn ? 'FJR' : 'MAA'),
//     Destination: baggageItem?.Destination || segment?.destinationCode || (segment.isReturn ? 'MAA' : 'FJR')
//   });

//   const buildPassenger = (
//     person: any,
//     paxType: number,
//     localIndex: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];

//     // Meals
//     let mealPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic)) {
//       const selectedMeals: any[] = [];

//       // Onward journey meals
//       if (ssrData?.onward?.Response?.MealDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === false &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
//         });
//       } else if (ssrData?.onward?.Response?.Meal) {
//         onwardSegments.forEach((segment, segIndex) => {
//           selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, false));
//         });
//       }

//       // Return journey meals (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
//             m => m.passengerIndex === globalIndex && m.isReturn === true &&
//                  m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                  m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
//         });
//       } else if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Meal) {
//         returnSegments.forEach((segment, segIndex) => {
//           selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, true));
//         });
//       }

//       mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
//     }

//     // Seats
//     let seatPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
//       const selectedSeats: any[] = [];

//       // Onward journey seats
//       if (ssrData?.onward?.Response?.SeatDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === false &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
//         });
//       }

//       // Return journey seats (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === true &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
//         });
//       }

//       seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
//     }

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 685', originCode: 'MAA', destinationCode: 'FJR' },
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 1502', originCode: 'FJR', destinationCode: 'MAA' },
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
//         : [];

//       // Onward journey baggage
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
//         } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       // Return journey baggage (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//         if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
//         } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(mealPayload ? { MealDynamic: mealPayload } : {}),
//       ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const buildPassengerNonLCC = (
//     person: any,
//     paxType: number,
//     globalIndex: number,
//     isLead: boolean,
//     isReturnJourney: boolean = false,
//     ssrData: any
//   ): any => {
//     const onwardSegments = flightSegments;
//     const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
//     const mealKey = getMealKey(ssrData);

//     // Meals
//     let mealPayload: any = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Meal || ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.Meal || ssrData?.return?.Response?.MealDynamic)) {
//       if (mealKey === 'MealDynamic') {
//         const selectedMeals: any[] = [];

//         // Onward journey meals
//         if (ssrData?.onward?.Response?.MealDynamic) {
//           onwardSegments.forEach((segment, segIndex) => {
//             const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
//               m => m.passengerIndex === globalIndex && m.isReturn === false &&
//                    m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                    m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//             );
//             selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
//           });
//         } else if (ssrData?.onward?.Response?.Meal) {
//           onwardSegments.forEach((segment, segIndex) => {
//             selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, false));
//           });
//         }

//         // Return journey meals (if applicable)
//         if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
//           returnSegments.forEach((segment, segIndex) => {
//             const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
//               m => m.passengerIndex === globalIndex && m.isReturn === true &&
//                    m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
//                    m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//             );
//             selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
//           });
//         } else if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Meal) {
//           returnSegments.forEach((segment, segIndex) => {
//             selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, true));
//           });
//         }

//         mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
//       } else if (mealKey === 'Meal') {
//         // Select a single meal for the entire journey (onward or return)
//         const onwardMeal = ssrData?.onward?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(false).find(
//           m => m.passengerIndex === globalIndex && m.isReturn === false
//         ) : null;
//         const returnMeal = isReturn && ssrData?.return?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(true).find(
//           m => m.passengerIndex === globalIndex && m.isReturn === true
//         ) : null;

//         // Use the onward meal if available; otherwise, use the return meal
//         const selectedMeal = onwardMeal || returnMeal;
//         if (selectedMeal && selectedMeal.meal?.Code && selectedMeal.meal.Code !== 'NoMeal') {
//           mealPayload = {
//             Code: selectedMeal.meal.Code,
//             Description: selectedMeal.meal.Description || selectedMeal.meal.AirlineDescription || ''
//           };
//         } else if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
//           mealPayload = {
//             Code: 'NoMeal',
//             Description: 'No Meal Selected'
//           };
//         }
//       }
//     }

//     // Seats
//     let seatPayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
//       const selectedSeats: any[] = [];

//       // Onward journey seats
//       if (ssrData?.onward?.Response?.SeatDynamic) {
//         onwardSegments.forEach((segment, segIndex) => {
//           const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === false &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '685')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
//         });
//       }

//       // Return journey seats (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
//         returnSegments.forEach((segment, segIndex) => {
//           const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
//             s => s.passengerIndex === globalIndex && s.isReturn === true &&
//                  s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
//                  s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '1502')
//           );
//           selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
//         });
//       }

//       seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
//     }

//     // Special Services
//     const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 685', originCode: 'MAA', destinationCode: 'FJR' },
//         s,
//         false
//       )).filter(s => s !== null);

//     const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
//       .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
//       .map(s => extractSpecialServiceDynamic(
//         returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
//         { code: '6E 1502', originCode: 'FJR', destinationCode: 'MAA' },
//         s,
//         true
//       )).filter(s => s !== null) : [];

//     const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

//     // Baggage
//     let baggagePayload: any[] | undefined = undefined;
//     if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
//       const selectedBaggage: any[] = [];

//       // Split baggage into onward and return based on full journey
//       const onwardBaggageItems = baggage && baggage.length > 0
//         ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
//         : [];
//       const returnBaggageItems = baggage && baggage.length > 0 && isReturn
//         ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
//         : [];

//       // Onward journey baggage
//       if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
//         const segment = {
//           code: onwardSegments[0]?.code || '6E 685',
//           originCode: onwardSegments[0]?.originCode || 'MAA',
//           destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || 'FJR'
//         };
//         if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
//         } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       // Return journey baggage (if applicable)
//       if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
//         const segment = {
//           code: returnSegments[0]?.code || '6E 1502',
//           originCode: returnSegments[0]?.originCode || 'FJR',
//           destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || 'MAA',
//           isReturn: true
//         };
//         if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
//           selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
//         } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
//           selectedBaggage.push(getBaggagePayload(null, segment));
//         }
//       }

//       baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
//     }

//     let dob = '1987-12-06';
//     if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
//       const yyyy = person.dateOfBirth.getFullYear();
//       const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       dob = `${yyyy}-${mm}-${dd}`;
//     }

//     const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

//     let passportExpiry = '';
//     if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
//       const yyyy = person.passportExpiryDate.getFullYear();
//       const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     let passportIssueDate = '';
//     if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
//       const yyyy = person.passportIssueDate.getFullYear();
//       const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
//       const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
//       passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
//     }

//     return {
//       Title: title,
//       FirstName: person.firstName,
//       LastName: person.lastName,
//       PaxType: paxType,
//       DateOfBirth: `${dob}T00:00:00`,
//       Gender: person.gender === 'FEMALE' ? 2 : 1,
//       PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
//       PassportExpiry: passportExpiry,
//       PassportIssueDate: passportIssueDate,
//       PassportIssueCountryCode: person.passportIssueCountryCode,
//       AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
//       AddressLine2: '',
//       Fare: generateFare(paxType, isReturnJourney),
//       City: 'Siliguri',
//       CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CountryName: 'India',
//       Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
//       CellCountryCode: '+91',
//       ContactNo: contact.mobile,
//       Email: contact.email,
//       IsLeadPax: isLead,
//       FFAirlineCode: null,
//       FFNumber: null,
//       ...(mealPayload && mealKey === 'MealDynamic' ? { MealDynamic: mealPayload } : {}),
//       ...(mealPayload && mealKey === 'Meal' ? { meal: mealPayload } : {}),
//       ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
//       ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
//       ...(baggagePayload ? { Baggage: baggagePayload } : {}),
//       ...(isLead && gstMandatory ? {
//         GSTCompanyAddress: gstInfo.companyName || '',
//         GSTCompanyContactNumber: contact.mobile || '',
//         GSTCompanyName: gstInfo.companyName || '',
//         GSTNumber: gstInfo.registrationNo || '',
//         GSTCompanyEmail: contact.email || ''
//       } : {}),
//       ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
//     };
//   };

//   const passengersList: any[] = [];
//   let globalIndex = 0;

//   if (isLCC) {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassenger(child, 2, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   } else {
//     passengers.adults.forEach((adult, i) => {
//       passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, true, ssrData));
//       globalIndex++;
//     });

//     passengers.children.forEach((child, i) => {
//       passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });

//     passengers.infants.forEach((infant, i) => {
//       passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, true, ssrData));
//       globalIndex++;
//     });
//   }

//   return isLCC ? {
//     PreferredCurrency: 'INR',
//     AgentReferenceNo: `REF${Date.now()}`,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId,
//     ResultIndex: resultIndex
//   } : {
//     ResultIndex: resultIndex,
//     Passengers: passengersList,
//     EndUserIp: ipAddress,
//     TokenId: tboToken,
//     TraceId: traceId
//   };
// }

generateBookingPayloadInternationReturn(
  isLCC: boolean,
  flightData: {
    adultFareDetail: any;
    childrenFareDetail?: any;
    infantFareDetail?: any;
    fareCommonDetail?: any;
    adultBaseFare: number;
    adultTaxes: number;
    adultBaseFareReturn?: number;
    adultTaxesReturn?: number;
    childrenBaseFare?: number;
    childrenTaxes?: number;
    childrenBaseFareReturn?: number;
    childrenTaxesReturn?: number;
    infantBaseFare?: number;
    infantTaxes?: number;
    infantBaseFareReturn?: number;
    infantTaxesReturn?: number;
    flightSegments: any[];
    flightSegmentsReturn?: any[];
    isReturn: boolean;
    baggage: any[];
  },
  bookingParams: {
    tboToken: string;
    traceId: string;
    resultIndex: string;
    ipAddress: string;
  },
  passengers: {
    adults: any[];
    children: any[];
    infants: any[];
  },
  contact: Contact,
  gstInfo: GSTInfo,
  gstMandatory: boolean,
  passportInfoRequired: boolean,
  ssrData?: any
): any {
  const {
    adultFareDetail,
    childrenFareDetail,
    infantFareDetail,
    fareCommonDetail,
    adultBaseFare,
    adultTaxes,
    adultBaseFareReturn,
    adultTaxesReturn,
    childrenBaseFare,
    childrenTaxes,
    childrenBaseFareReturn,
    childrenTaxesReturn,
    infantBaseFare,
    infantTaxes,
    infantBaseFareReturn,
    infantTaxesReturn,
    flightSegments,
    flightSegmentsReturn,
    isReturn,
    baggage
  } = flightData;

  console.log("Internation Return SSR Data", ssrData);

  const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

  const generateFare = (type: number, isReturnJourney: boolean = false): any => {
    let fareDetail;
    switch (type) {
      case 1: fareDetail = adultFareDetail; break;
      case 2: fareDetail = childrenFareDetail; break;
      case 3: fareDetail = infantFareDetail; break;
      default: return {};
    }

    if (isLCC) {
      return {
        Currency: fareDetail?.Currency || 'INR',
        BaseFare: fareDetail?.BaseFare,
        Tax: fareDetail?.Tax,
        YQTax: fareDetail?.YQTax || 0,
        AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
        AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
        OtherCharges: fareDetail?.OtherCharges || 0
      };
    }

    return {
      Currency: fareCommonDetail?.Currency || 'INR',
      BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
        ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
        : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
      Tax: fareCommonDetail?.Tax || (isReturnJourney
        ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
        : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
      YQTax: fareCommonDetail?.YQTax || 0,
      AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
      AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
      OtherCharges: fareCommonDetail?.OtherCharges || 0,
      Discount: fareCommonDetail?.Discount || 0,
      PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
        ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
        : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
      OfferedFare: fareCommonDetail?.OfferedFare || 0,
      TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
      TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
      TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
      ServiceFee: fareCommonDetail?.ServiceFee || 0
    };
  };

  const getMealKey = (ssrData: any): string => {
    if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
      return 'Meal';
    }
    if (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic) {
      return 'MealDynamic';
    }
    return 'Meal'; // Default to Meal if no meal data is present
  };

  const extractMeal = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
    if (!mealSelection || mealSelection.meal?.Code === 'NoMeal') {
      return {
        AirlineCode: segment?.code?.split(' ')[0] || '',
        FlightNumber: segment?.code?.split(' ')[1] || '',
        WayType: isReturnJourney ? 3 : 2,
        Code: 'NoMeal',
        Description: '2',
        AirlineDescription: '',
        Quantity: 0,
        Currency: 'INR',
        Price: 0,
        Origin: segment?.originCode || '',
        Destination: segment?.destinationCode || ''
      };
    }
    return {
      AirlineCode: mealSelection?.meal?.AirlineCode || segment?.code?.split(' ')[0] || '',
      FlightNumber: mealSelection?.meal?.FlightNumber || segment?.code?.split(' ')[1] || '',
      WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 2),
      Code: mealSelection?.meal?.Code ?? 'NoMeal',
      Description: mealSelection?.Description?.toString() ?? '2',
      AirlineDescription: mealSelection?.meal?.AirlineDescription ?? mealSelection?.meal?.Description ?? '',
      Quantity: mealSelection?.meal?.Quantity ?? 0,
      Currency: mealSelection?.meal?.Currency ?? 'INR',
      Price: mealSelection?.meal?.Price ?? 0,
      Origin: mealSelection?.meal?.Origin || segment?.originCode || '',
      Destination: mealSelection?.meal?.Destination || segment?.destinationCode || ''
    };
  };

  const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
    if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
      return {
        AirlineCode: segment?.code?.split(' ')[0] || '',
        FlightNumber: segment?.code?.split(' ')[1] || '',
        CraftType: segment?.aircraft || '',
        Origin: segment?.originCode || '',
        Destination: segment?.destinationCode || '',
        AvailablityType: 0,
        Description: '2',
        Code: 'NoSeat',
        RowNo: '0',
        SeatNo: null,
        SeatType: 0,
        SeatWayType: isReturnJourney ? 3 : 2,
        Compartment: 0,
        Deck: 0,
        Currency: 'INR',
        Price: 0,
        Text: ''
      };
    }
    return {
      AirlineCode: seatSelection.seat.AirlineCode || segment?.code?.split(' ')[0] || '',
      FlightNumber: seatSelection.seat.FlightNumber || segment?.code?.split(' ')[1] || '',
      CraftType: seatSelection.seat.CraftType || segment?.aircraft || '',
      Origin: seatSelection.seat.Origin || segment?.originCode || '',
      Destination: seatSelection.seat.Destination || segment?.destinationCode || '',
      AvailablityType: seatSelection.seat.AvailablityType || 0,
      Description: seatSelection.seat.Description?.toString() || '2',
      Code: seatSelection.seat.Code,
      RowNo: seatSelection.seat.RowNo || '0',
      SeatNo: seatSelection.seat.SeatNo || null,
      SeatType: seatSelection.seat.SeatType || 0,
      SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
      Compartment: seatSelection.seat.Compartment || 0,
      Deck: seatSelection.seat.Deck || 0,
      Currency: seatSelection.seat.Currency || 'INR',
      Price: seatSelection.seat.Price || 0,
      Text: seatSelection.seat.Text || ''
    };
  };

  const extractSpecialServiceDynamic = (segment: any, serviceSelection: any, isReturnJourney: boolean): any => {
    if (!serviceSelection?.service || serviceSelection.service.Code === 'NoService') {
      return null;
    }
    return {
      AirlineCode: serviceSelection.service.AirlineCode || segment?.code?.split(' ')[0] || '',
      FlightNumber: serviceSelection.service.FlightNumber || segment?.code?.split(' ')[1] || '',
      WayType: serviceSelection.service.WayType || (isReturnJourney ? 3 : 2),
      Code: serviceSelection.service.Code,
      Description: serviceSelection.service.Description?.toString() || '2',
      Origin: serviceSelection.service.Origin || segment?.originCode || '',
      Destination: serviceSelection.service.Destination || segment?.destinationCode || '',
      Currency: serviceSelection.service.Currency || 'INR',
      Price: serviceSelection.service.Price || 0
    };
  };

  const getBaggagePayload = (baggageItem: any, segment: any): any => ({
    AirlineCode: baggageItem?.AirlineCode || segment?.code?.split(' ')[0] || '',
    FlightNumber: baggageItem?.FlightNumber || segment?.code?.split(' ')[1] || '',
    WayType: baggageItem?.WayType || (segment.isReturn ? 3 : 2),
    Code: baggageItem?.Code || 'NoBaggage',
    Description: baggageItem?.Description?.toString() || '2',
    Weight: baggageItem?.Weight?.toString() || '0',
    Currency: baggageItem?.Currency || 'INR',
    Price: baggageItem?.Price || 0,
    Origin: baggageItem?.Origin || segment?.originCode || '',
    Destination: baggageItem?.Destination || segment?.destinationCode || ''
  });

  const buildPassenger = (
    person: any,
    paxType: number,
    localIndex: number,
    globalIndex: number,
    isLead: boolean,
    isReturnJourney: boolean,
    ssrData: any
  ): any => {
    const onwardSegments = flightSegments;
    const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];

    // Meals
    let mealPayload: any[] | undefined = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.MealDynamic)) {
      const selectedMeals: any[] = [];

      // Onward journey meals
      if (ssrData?.onward?.Response?.MealDynamic) {
        onwardSegments.forEach((segment, segIndex) => {
          const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
            m => m.passengerIndex === globalIndex && m.isReturn === false &&
                 m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
                 m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
        });
      } else if (ssrData?.onward?.Response?.Meal) {
        onwardSegments.forEach((segment, segIndex) => {
          selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, false));
        });
      }

      // Return journey meals (if applicable)
      if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
        returnSegments.forEach((segment, segIndex) => {
          const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
            m => m.passengerIndex === globalIndex && m.isReturn === true &&
                 m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
                 m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
        });
      } else if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Meal) {
        returnSegments.forEach((segment, segIndex) => {
          selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, true));
        });
      }

      mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
    }

    // Seats
    let seatPayload: any[] | undefined = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
      const selectedSeats: any[] = [];

      // Onward journey seats
      if (ssrData?.onward?.Response?.SeatDynamic) {
        onwardSegments.forEach((segment, segIndex) => {
          const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
            s => s.passengerIndex === globalIndex && s.isReturn === false &&
                 s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
                 s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
        });
      }

      // Return journey seats (if applicable)
      if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
        returnSegments.forEach((segment, segIndex) => {
          const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
            s => s.passengerIndex === globalIndex && s.isReturn === true &&
                 s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
                 s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
        });
      }

      seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
    }

    // Special Services
    const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
      .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
      .map(s => extractSpecialServiceDynamic(
        onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
        { code: '', originCode: '', destinationCode: '' },
        s,
        false
      )).filter(s => s !== null);

    const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
      .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
      .map(s => extractSpecialServiceDynamic(
        returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
        { code: '', originCode: '', destinationCode: '' },
        s,
        true
      )).filter(s => s !== null) : [];

    const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

    // Baggage
    let baggagePayload: any[] | undefined = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
      const selectedBaggage: any[] = [];

      // Split baggage into onward and return based on full journey
      const onwardBaggageItems = baggage && baggage.length > 0
        ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
        : [];
      const returnBaggageItems = baggage && baggage.length > 0 && isReturn
        ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
        : [];

      // Onward journey baggage
      if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
        const segment = {
          code: onwardSegments[0]?.code || '',
          originCode: onwardSegments[0]?.originCode || '',
          destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || ''
        };
        if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
          selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
        } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
          selectedBaggage.push(getBaggagePayload(null, segment));
        }
      }

      // Return journey baggage (if applicable)
      if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
        const segment = {
          code: returnSegments[0]?.code || '',
          originCode: returnSegments[0]?.originCode || '',
          destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || '',
          isReturn: true
        };
        if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
          selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
        } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
          selectedBaggage.push(getBaggagePayload(null, segment));
        }
      }

      baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
    }

    let dob = '1987-12-06';
    if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
      const yyyy = person.dateOfBirth.getFullYear();
      const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      dob = `${yyyy}-${mm}-${dd}`;
    }

    const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

    let passportExpiry = '';
    if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
      const yyyy = person.passportExpiryDate.getFullYear();
      const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    let passportIssueDate = '';
    if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
      const yyyy = person.passportIssueDate.getFullYear();
      const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    return {
      Title: title,
      FirstName: person.firstName,
      LastName: person.lastName,
      PaxType: paxType,
      DateOfBirth: `${dob}T00:00:00`,
      Gender: person.gender === 'FEMALE' ? 2 : 1,
      PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
      PassportExpiry: passportExpiry,
      PassportIssueDate: passportIssueDate,
      PassportIssueCountryCode: person.passportIssueCountryCode,
      AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
      AddressLine2: '',
      Fare: generateFare(paxType, isReturnJourney),
      City: 'Siliguri',
      CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CountryName: 'India',
      Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CellCountryCode: contact.countryCode,
      ContactNo: contact.mobile,
      Email: contact.email,
      IsLeadPax: isLead,
      FFAirlineCode: null,
      FFNumber: null,
      ...(mealPayload ? { MealDynamic: mealPayload } : {}),
      ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
      ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
      ...(baggagePayload ? { Baggage: baggagePayload } : {}),
      ...(isLead && gstMandatory ? {
        GSTCompanyAddress: gstInfo.companyName || '',
        GSTCompanyContactNumber: contact.mobile || '',
        GSTCompanyName: gstInfo.companyName || '',
        GSTNumber: gstInfo.registrationNo || '',
        GSTCompanyEmail: contact.email || ''
      } : {}),
      ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
    };
  };

  const buildPassengerNonLCC = (
    person: any,
    paxType: number,
    globalIndex: number,
    isLead: boolean,
    isReturnJourney: boolean = false,
    ssrData: any
  ): any => {
    const onwardSegments = flightSegments;
    const returnSegments = isReturn ? flightSegmentsReturn || flightSegments : [];
    const mealKey = getMealKey(ssrData);

    // Meals
    let mealPayload: any = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.Meal || ssrData?.onward?.Response?.MealDynamic || ssrData?.return?.Response?.Meal || ssrData?.return?.Response?.MealDynamic)) {
      if (mealKey === 'MealDynamic') {
        const selectedMeals: any[] = [];

        // Onward journey meals
        if (ssrData?.onward?.Response?.MealDynamic) {
          onwardSegments.forEach((segment, segIndex) => {
            const onwardMeal = this.flightAddonsService.getSelectedMealsFinal(false).find(
              m => m.passengerIndex === globalIndex && m.isReturn === false &&
                   m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
                   m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '')
            );
            selectedMeals.push(extractMeal(segment, onwardMeal || { meal: { Code: 'NoMeal' } }, false));
          });
        } else if (ssrData?.onward?.Response?.Meal) {
          onwardSegments.forEach((segment, segIndex) => {
            selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, false));
          });
        }

        // Return journey meals (if applicable)
        if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.MealDynamic) {
          returnSegments.forEach((segment, segIndex) => {
            const returnMeal = this.flightAddonsService.getSelectedMealsFinal(true).find(
              m => m.passengerIndex === globalIndex && m.isReturn === true &&
                   m.meal?.Origin === segment.originCode && m.meal?.Destination === segment.destinationCode &&
                   m.meal?.FlightNumber === (segment.code?.split(' ')[1] || '')
            );
            selectedMeals.push(extractMeal(segment, returnMeal || { meal: { Code: 'NoMeal' } }, true));
          });
        } else if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Meal) {
          returnSegments.forEach((segment, segIndex) => {
            selectedMeals.push(extractMeal(segment, { meal: { Code: 'NoMeal' } }, true));
          });
        }

        mealPayload = selectedMeals.length > 0 ? selectedMeals : undefined;
      } else if (mealKey === 'Meal') {
        // Select a single meal for the entire journey (onward or return)
        const onwardMeal = ssrData?.onward?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(false).find(
          m => m.passengerIndex === globalIndex && m.isReturn === false
        ) : null;
        const returnMeal = isReturn && ssrData?.return?.Response?.Meal ? this.flightAddonsService.getSelectedMealsFinal(true).find(
          m => m.passengerIndex === globalIndex && m.isReturn === true
        ) : null;

        // Use the onward meal if available; otherwise, use the return meal
        const selectedMeal = onwardMeal || returnMeal;
        if (selectedMeal && selectedMeal.meal?.Code && selectedMeal.meal.Code !== 'NoMeal') {
          mealPayload = {
            Code: selectedMeal.meal.Code,
            Description: selectedMeal.meal.Description || selectedMeal.meal.AirlineDescription || ''
          };
        } else if (ssrData?.onward?.Response?.Meal || ssrData?.return?.Response?.Meal) {
          mealPayload = {
            Code: 'NoMeal',
            Description: 'No Meal Selected'
          };
        }
      }
    }

    // Seats
    let seatPayload: any[] | undefined = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.SeatDynamic || ssrData?.return?.Response?.SeatDynamic)) {
      const selectedSeats: any[] = [];

      // Onward journey seats
      if (ssrData?.onward?.Response?.SeatDynamic) {
        onwardSegments.forEach((segment, segIndex) => {
          const onwardSeat = this.flightAddonsService.getSelectedSeatsFinal(false).find(
            s => s.passengerIndex === globalIndex && s.isReturn === false &&
                 s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
                 s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedSeats.push(extractSeatDynamic(segment, onwardSeat || { seat: { Code: 'NoSeat' } }, false));
        });
      }

      // Return journey seats (if applicable)
      if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.SeatDynamic) {
        returnSegments.forEach((segment, segIndex) => {
          const returnSeat = this.flightAddonsService.getSelectedSeatsFinal(true).find(
            s => s.passengerIndex === globalIndex && s.isReturn === true &&
                 s.seat?.Origin === segment.originCode && s.seat?.Destination === segment.destinationCode &&
                 s.seat?.FlightNumber === (segment.code?.split(' ')[1] || '')
          );
          selectedSeats.push(extractSeatDynamic(segment, returnSeat || { seat: { Code: 'NoSeat' } }, true));
        });
      }

      seatPayload = selectedSeats.length > 0 ? selectedSeats : undefined;
    }

    // Special Services
    const onwardSpecialServices = paxType === 3 ? [] : this.flightAddonsService.selectedServicesFinal
      .filter(s => s.service.isReturn === false && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
      .map(s => extractSpecialServiceDynamic(
        onwardSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
        { code: '', originCode: '', destinationCode: '' },
        s,
        false
      )).filter(s => s !== null);

    const returnSpecialServices = paxType === 3 ? [] : (isReturn && returnSegments.length > 0) ? this.flightAddonsService.selectedServicesFinal
      .filter(s => s.service.isReturn === true && s.service.Code !== 'NoService' && s.passengerIndex === globalIndex)
      .map(s => extractSpecialServiceDynamic(
        returnSegments.find(seg => seg.originCode === s.service.Origin && seg.destinationCode === s.service.Destination) ||
        { code: '', originCode: '', destinationCode: '' },
        s,
        true
      )).filter(s => s !== null) : [];

    const specialServices = [...onwardSpecialServices, ...returnSpecialServices];

    // Baggage
    let baggagePayload: any[] | undefined = undefined;
    if (paxType !== 3 && (ssrData?.onward?.Response?.Baggage || ssrData?.return?.Response?.Baggage)) {
      const selectedBaggage: any[] = [];

      // Split baggage into onward and return based on full journey
      const onwardBaggageItems = baggage && baggage.length > 0
        ? baggage.filter(b => b.Origin === onwardSegments[0]?.originCode && b.Destination === onwardSegments[onwardSegments.length - 1]?.destinationCode)
        : [];
      const returnBaggageItems = baggage && baggage.length > 0 && isReturn
        ? baggage.filter(b => b.Origin === returnSegments[0]?.originCode && b.Destination === returnSegments[returnSegments.length - 1]?.destinationCode)
        : [];

      // Onward journey baggage
      if (ssrData?.onward?.Response?.Baggage && onwardSegments.length > 0) {
        const segment = {
          code: onwardSegments[0]?.code || '',
          originCode: onwardSegments[0]?.originCode || '',
          destinationCode: onwardSegments[onwardSegments.length - 1]?.destinationCode || ''
        };
        if (onwardBaggageItems.length > globalIndex && onwardBaggageItems[globalIndex]?.Code) {
          selectedBaggage.push(getBaggagePayload(onwardBaggageItems[globalIndex], segment));
        } else if (ssrData.onward.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
          selectedBaggage.push(getBaggagePayload(null, segment));
        }
      }

      // Return journey baggage (if applicable)
      if (isReturn && returnSegments.length > 0 && ssrData?.return?.Response?.Baggage) {
        const segment = {
          code: returnSegments[0]?.code || '',
          originCode: returnSegments[0]?.originCode || '',
          destinationCode: returnSegments[returnSegments.length - 1]?.destinationCode || '',
          isReturn: true
        };
        if (returnBaggageItems.length > globalIndex && returnBaggageItems[globalIndex]?.Code) {
          selectedBaggage.push(getBaggagePayload(returnBaggageItems[globalIndex], segment));
        } else if (ssrData.return.Response.Baggage[0]?.some((b: BaggageItem) => b.Code === 'NoBaggage')) {
          selectedBaggage.push(getBaggagePayload(null, segment));
        }
      }

      baggagePayload = selectedBaggage.length > 0 ? selectedBaggage : undefined;
    }

    let dob = '1987-12-06';
    if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
      const yyyy = person.dateOfBirth.getFullYear();
      const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      dob = `${yyyy}-${mm}-${dd}`;
    }

    const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

    let passportExpiry = '';
    if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
      const yyyy = person.passportExpiryDate.getFullYear();
      const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    let passportIssueDate = '';
    if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
      const yyyy = person.passportIssueDate.getFullYear();
      const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    return {
      Title: title,
      FirstName: person.firstName,
      LastName: person.lastName,
      PaxType: paxType,
      DateOfBirth: `${dob}T00:00:00`,
      Gender: person.gender === 'FEMALE' ? 2 : 1,
      PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
      PassportExpiry: passportExpiry,
      PassportIssueDate: passportIssueDate,
      PassportIssueCountryCode: person.passportIssueCountryCode,
      AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
      AddressLine2: '',
      Fare: generateFare(paxType, isReturnJourney),
      City: 'Siliguri',
      CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CountryName: 'India',
      Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CellCountryCode: contact.countryCode,
      ContactNo: contact.mobile,
      Email: contact.email,
      IsLeadPax: isLead,
      FFAirlineCode: null,
      FFNumber: null,
      ...(mealPayload && mealKey === 'MealDynamic' ? { MealDynamic: mealPayload } : {}),
      ...(mealPayload && mealKey === 'Meal' ? { meal: mealPayload } : {}),
      ...(seatPayload ? { SeatDynamic: seatPayload } : {}),
      ...(specialServices.length > 0 ? { SpecialServices: specialServices } : {}),
      ...(baggagePayload ? { Baggage: baggagePayload } : {}),
      ...(isLead && gstMandatory ? {
        GSTCompanyAddress: gstInfo.companyName || '',
        GSTCompanyContactNumber: contact.mobile || '',
        GSTCompanyName: gstInfo.companyName || '',
        GSTNumber: gstInfo.registrationNo || '',
        GSTCompanyEmail: contact.email || ''
      } : {}),
      ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
    };
  };

  const passengersList: any[] = [];
  let globalIndex = 0;

  if (isLCC) {
    passengers.adults.forEach((adult, i) => {
      passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, true, ssrData));
      globalIndex++;
    });

    passengers.children.forEach((child, i) => {
      passengersList.push(buildPassenger(child, 2, i, globalIndex, false, true, ssrData));
      globalIndex++;
    });

    passengers.infants.forEach((infant, i) => {
      passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, true, ssrData));
      globalIndex++;
    });
  } else {
    passengers.adults.forEach((adult, i) => {
      passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, true, ssrData));
      globalIndex++;
    });

    passengers.children.forEach((child, i) => {
      passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, true, ssrData));
      globalIndex++;
    });

    passengers.infants.forEach((infant, i) => {
      passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, true, ssrData));
      globalIndex++;
    });
  }

  return isLCC ? {
    PreferredCurrency: 'INR',
    AgentReferenceNo: `REF${Date.now()}`,
    Passengers: passengersList,
    EndUserIp: ipAddress,
    TokenId: tboToken,
    TraceId: traceId,
    ResultIndex: resultIndex
  } : {
    ResultIndex: resultIndex,
    Passengers: passengersList,
    EndUserIp: ipAddress,
    TokenId: tboToken,
    TraceId: traceId
  };
}



  generateBookingPayloadMultiCity(
    isLCC: boolean,
    flightData: {
      adultFareDetail: any;
      childrenFareDetail?: any;
      infantFareDetail?: any;
      fareCommonDetail?: any;
      adultBaseFare: number;
      adultTaxes: number;
      adultBaseFareReturn?: number;
      adultTaxesReturn?: number;
      childrenBaseFare?: number;
      childrenTaxes?: number;
      childrenBaseFareReturn?: number;
      childrenTaxesReturn?: number;
      infantBaseFare?: number;
      infantTaxes?: number;
      infantBaseFareReturn?: number;
      infantTaxesReturn?: number;
      flightSegments: any[];
      flightSegmentsReturn?: any[];
      isReturn: boolean;
      baggage: any[];
    },
    bookingParams: {
      tboToken: string;
      traceId: string;
      resultIndex: string;
      ipAddress: string;
    },
    passengers: {
      adults: any[];
      children: any[];
      infants: any[];
    },
    contact: Contact,
    gstInfo: GSTInfo,
    gstMandatory: boolean,
    passportInfoRequired: boolean,
    ssrData?: any
  ): any {
    const {
      adultFareDetail,
      childrenFareDetail,
      infantFareDetail,
      fareCommonDetail,
      adultBaseFare,
      adultTaxes,
      adultBaseFareReturn,
      adultTaxesReturn,
      childrenBaseFare,
      childrenTaxes,
      childrenBaseFareReturn,
      childrenTaxesReturn,
      infantBaseFare,
      infantTaxes,
      infantBaseFareReturn,
      infantTaxesReturn,
      flightSegments,
      flightSegmentsReturn,
      isReturn
    } = flightData;

    

    const { tboToken, traceId, resultIndex, ipAddress } = bookingParams;

    const generateFare = (type: number, isReturnJourney: boolean = false): any => {
      let fareDetail;
      switch (type) {
        case 1: fareDetail = adultFareDetail; break;
        case 2: fareDetail = childrenFareDetail; break;
        case 3: fareDetail = infantFareDetail; break;
        default: return {};
      }

      console.log("Fare Details", fareDetail);
      console.log("Pax Type", type);

      if (isLCC) {
        return {
          // Currency: fareDetail?.Currency || 'INR',
          BaseFare: fareDetail?.BaseFare,
          Tax: fareDetail?.Tax,
          YQTax: fareDetail?.YQTax || 0,
          AdditionalTxnFeePub: fareDetail?.AdditionalTxnFeePub || 0,
          AdditionalTxnFeeOfrd: fareDetail?.AdditionalTxnFeeOfrd || 0,
          OtherCharges: fareDetail?.OtherCharges || 0
        };
      }

      return {
        // Currency: fareCommonDetail?.Currency || 'INR',
        BaseFare: fareCommonDetail?.BaseFare || (isReturnJourney
          ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
          : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0),
        Tax: fareCommonDetail?.Tax || (isReturnJourney
          ? (type === 1 ? adultTaxesReturn : type === 2 ? childrenTaxesReturn : infantTaxesReturn) || adultTaxes
          : (type === 1 ? adultTaxes : type === 2 ? childrenTaxes : infantTaxes) || 0),
        YQTax: fareCommonDetail?.YQTax || 0,
        AdditionalTxnFeePub: fareCommonDetail?.AdditionalTxnFeePub || 0,
        AdditionalTxnFeeOfrd: fareCommonDetail?.AdditionalTxnFeeOfrd || 0,
        OtherCharges: fareCommonDetail?.OtherCharges || 0,
        Discount: fareCommonDetail?.Discount || 0,
        PublishedFare: fareCommonDetail?.PublishedFare || (isReturnJourney
          ? (type === 1 ? adultBaseFareReturn : type === 2 ? childrenBaseFareReturn : infantBaseFareReturn) || adultBaseFare
          : (type === 1 ? adultBaseFare : type === 2 ? childrenBaseFare : infantBaseFare) || 0) + (fareCommonDetail?.Tax || 0),
        OfferedFare: fareCommonDetail?.OfferedFare || 0,
        TdsOnCommission: fareCommonDetail?.TdsOnCommission || 0,
        TdsOnPLB: fareCommonDetail?.TdsOnPLB || 0,
        TdsOnIncentive: fareCommonDetail?.TdsOnIncentive || 0,
        ServiceFee: fareCommonDetail?.ServiceFee || 0
      };
    };

    // const extractMealDynamic = (segment: any, mealSelection: any, isReturnJourney: boolean): any => {
    //   return {
    //     AirlineCode: segment.code.split(' ')[0],
    //     FlightNumber: segment.code.split(' ')[1],
    //     WayType: mealSelection?.WayType ?? (isReturnJourney ? 3 : 1),
    //     Code: mealSelection?.meal?.Code ?? 'NoMeal',
    //     Description: mealSelection?.Description ?? '2',
    //     AirlineDescription: mealSelection?.meal?.AirlineDescription ?? '',
    //     Quantity: mealSelection?.meal?.Quantity ?? 0,
    //     Currency: mealSelection?.meal?.Currency ?? 'INR',
    //     Price: mealSelection?.meal?.Price ?? 0,
    //     Origin: segment.originCode,
    //     Destination: segment.destinationCode
    //   };
    // };

    // const extractSeatDynamic = (segment: any, seatSelection: any, isReturnJourney: boolean): any => {
    //   if (!seatSelection?.seat || seatSelection.seat.Code === 'NoSeat') {
    //     return {
    //       AirlineCode: seatSelection?.seat?.AirlineCode || segment?.code.split(' ')[0] || '',
    //       FlightNumber: seatSelection?.seat?.FlightNumber || segment?.code.split(' ')[1] || '',
    //       CraftType: seatSelection?.seat?.CraftType || segment?.aircraft || '737',
    //       Origin: seatSelection?.seat?.Origin || segment?.originCode || '',
    //       Destination: seatSelection?.seat?.Destination || segment?.destinationCode || '',
    //       AvailablityType: seatSelection?.seat?.AvailablityType || 0,
    //       Description: seatSelection?.seat?.Description || '2',
    //       Code: 'NoSeat',
    //       RowNo: '0',
    //       SeatNo: null,
    //       SeatType: 0,
    //       SeatWayType: isReturnJourney ? 3 : 2,
    //       Compartment: 0,
    //       Deck: 0,
    //       Currency: seatSelection?.seat?.Currency || 'INR',
    //       Price: 0,
    //       Text: seatSelection?.seat?.Text || ''
    //     };
    //   }

    //   return {
    //     AirlineCode: seatSelection.seat.AirlineCode,
    //     FlightNumber: seatSelection.seat.FlightNumber,
    //     CraftType: seatSelection.seat.CraftType,
    //     Origin: seatSelection.seat.Origin,
    //     Destination: seatSelection.seat.Destination,
    //     AvailablityType: seatSelection.seat.AvailablityType,
    //     Description: seatSelection.seat.Description || '2',
    //     Code: seatSelection.seat.Code,
    //     RowNo: seatSelection.seat.RowNo,
    //     SeatNo: seatSelection.seat.SeatNo,
    //     SeatType: seatSelection.seat.SeatType,
    //     SeatWayType: seatSelection.seat.SeatWayType || (isReturnJourney ? 3 : 2),
    //     Compartment: seatSelection.seat.Compartment,
    //     Deck: seatSelection.seat.Deck,
    //     Currency: seatSelection.seat.Currency,
    //     Price: seatSelection.seat.Price,
    //     Text: seatSelection.seat.Text || ''
    //   };
    // };

    const buildPassenger = (
      person: any,
      paxType: number,
      localIndex: number,
      globalIndex: number,
      isLead: boolean,
      isReturnJourney: boolean,
      ssrData: any
    ): any => {
      const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;

      

      let dob = '1987-12-06';
      if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
        const yyyy = person.dateOfBirth.getFullYear();
        const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
        const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
        dob = `${yyyy}-${mm}-${dd}`;
      }

      const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

      let passportExpiry = '';
      if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
        const yyyy = person.passportExpiryDate.getFullYear();
        const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
        const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
        passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
      }

      let passportIssueDate = '';
      if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
        const yyyy = person.passportIssueDate.getFullYear();
        const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
        const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
        passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
      }

      return {
        Title: title,
        FirstName: person.firstName,
        LastName: person.lastName,
        PaxType: paxType,
        DateOfBirth: `${dob}T00:00:00`,
        Gender: person.gender === 'FEMALE' ? 2 : 1,
        PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
        PassportExpiry: passportExpiry,
        PassportIssueDate: passportIssueDate,
        PassportIssueCountryCode: person.passportIssueCountryCode,
        AddressLine1: '#F0112, WIZZRIDE TECHNOLOGIES PVT LTD, CITY CENTRE',
        AddressLine2: '',
        Fare: generateFare(paxType, isReturnJourney),
        City: 'Siliguri',
        CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
        CountryName: 'India',
        Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
        CellCountryCode: contact.countryCode,
        ContactNo: contact.mobile,
        Email: contact.email,
        IsLeadPax: isLead,
        FFAirlineCode: null,
        FFNumber: null,           
        ...(isLead && gstMandatory ? {
          GSTCompanyAddress: gstInfo.companyName || '',
          GSTCompanyContactNumber: contact.mobile || '',
          GSTCompanyName: gstInfo.companyName || '',
          GSTNumber: gstInfo.registrationNo || '',
          GSTCompanyEmail: contact.email || ''
        } : {}),
        ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
      };
    };

  const buildPassengerNonLCC = (
    person: any,
    paxType: number,
    globalIndex: number,
    isLead: boolean,
    isReturnJourney: boolean = false,
    ssrData: any
  ): any => {
    const segments = isReturnJourney ? flightSegmentsReturn || flightSegments : flightSegments;

    console.log("buildPassengerNonLCC - SSR Data:", JSON.stringify(ssrData, null, 2));
    console.log("buildPassengerNonLCC - PaxType:", paxType, "GlobalIndex:", globalIndex, "IsReturnJourney:", isReturnJourney);

    

    

    const monthMap: { [key: string]: string } = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12'
    };

    let dob = '1987-12-06';
    if (person.dateOfBirth instanceof Date && !isNaN(person.dateOfBirth.getTime())) {
      const yyyy = person.dateOfBirth.getFullYear();
      const mm = String(person.dateOfBirth.getMonth() + 1).padStart(2, '0');
      const dd = String(person.dateOfBirth.getDate()).padStart(2, '0');
      dob = `${yyyy}-${mm}-${dd}`;
    }

    const title = paxType === 3 ? (person.gender === 'FEMALE' ? 'Ms' : 'Mstr') : (person.gender === 'FEMALE' ? 'Mrs' : 'Mr');

    

    let passportExpiry = '';
    if (passportInfoRequired && person.passportExpiryDate instanceof Date && !isNaN(person.passportExpiryDate.getTime())) {
      const yyyy = person.passportExpiryDate.getFullYear();
      const mm = String(person.passportExpiryDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.passportExpiryDate.getDate()).padStart(2, '0');
      passportExpiry = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    let passportIssueDate = '';
    if (passportInfoRequired && person.passportIssueDate instanceof Date && !isNaN(person.passportIssueDate.getTime())) {
      const yyyy = person.passportIssueDate.getFullYear();
      const mm = String(person.passportIssueDate.getMonth() + 1).padStart(2, '0');
      const dd = String(person.passportIssueDate.getDate()).padStart(2, '0');
      passportIssueDate = `${yyyy}-${mm}-${dd}T00:00:00`;
    }

    return {
      Title: title,
      FirstName: person.firstName,
      LastName: person.lastName,
      PaxType: paxType,
      DateOfBirth: `${dob}T00:00:00`,
      Gender: person.gender === 'FEMALE' ? 2 : 1,
      PassportNo: passportInfoRequired ? (person.passportNumber || '') : '',
      PassportExpiry: passportExpiry,
      PassportIssueDate: passportIssueDate,
      PassportIssueCountryCode: person.passportIssueCountryCode,
      AddressLine1: '123, Test',
      AddressLine2: '',
      Fare: generateFare(paxType, isReturnJourney),
      City: 'Gurgaon',
      CountryCode: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      Nationality: person.passportIssueCountryCode ? person.passportIssueCountryCode : 'IN',
      CellCountryCode: contact.countryCode,
      ContactNo: contact.mobile,
      Email: contact.email,
      IsLeadPax: isLead,
      FFAirlineCode: null,      
      FFNumber: '',
      ...(isLead && gstMandatory ? {
          GSTCompanyAddress: gstInfo.companyName || '',
          GSTCompanyContactNumber: contact.mobile || '',
          GSTCompanyName: gstInfo.companyName || '',
          GSTNumber: gstInfo.registrationNo || '',
          GSTCompanyEmail: contact.email || ''
        } : {}),
      ...(person.DocumentDetails?.length ? { DocumentDetails: person.DocumentDetails } : {})
            
      
    };
  }

    const passengersList: any[] = [];
    let globalIndex = 0;

    console.log("Passengers in payload", JSON.stringify(passengers, null, 2));
    console.log("SSR in payload", JSON.stringify(ssrData, null, 2));
    console.log("Flight Data in payload", JSON.stringify(flightData, null, 2));
    

    if (isLCC) {
      passengers.adults.forEach((adult, i) => {
        passengersList.push(buildPassenger(adult, 1, i, globalIndex, i === 0, isReturn, ssrData));
        globalIndex++;
      });

      passengers.children.forEach((child, i) => {
        passengersList.push(buildPassenger(child, 2, i, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });

      passengers.infants.forEach((infant, i) => {
        passengersList.push(buildPassenger(infant, 3, i, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });
    } else {
      passengers.adults.forEach((adult, i) => {
        passengersList.push(buildPassengerNonLCC(adult, 1, globalIndex, i === 0, isReturn, ssrData));
        globalIndex++;
      });

      passengers.children.forEach((child, i) => {
        passengersList.push(buildPassengerNonLCC(child, 2, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });

      passengers.infants.forEach((infant, i) => {
        passengersList.push(buildPassengerNonLCC(infant, 3, globalIndex, false, isReturn, ssrData));
        globalIndex++;
      });
    }

    return isLCC ? {
      PreferredCurrency: 'INR',
      AgentReferenceNo: `REF${Date.now()}`,
      Passengers: passengersList,
      EndUserIp: ipAddress,
      TokenId: tboToken,
      TraceId: traceId,
      ResultIndex: resultIndex
    } : {
      ResultIndex: resultIndex,
      Passengers: passengersList,
      EndUserIp: ipAddress,
      TokenId: tboToken,
      TraceId: traceId
    };
  }

  public extractSpecialServiceDynamic(segment: any, serviceSelection: any, isReturn: boolean): any {
    if (!serviceSelection?.service) {
      return {
        AirlineCode: segment.code.split(' ')[0] || '',
        FlightNumber: segment.code.split(' ')[1] || '',
        WayType: isReturn ? 3 : 2,
        Code: 'NoService',
        Description: '2',
        Currency: 'INR',
        Price: 0,
        Origin: segment.originCode || '',
        Destination: segment.destinationCode || ''
      };
    }

    return {
      AirlineCode: serviceSelection.service.AirlineCode || '',
      FlightNumber: serviceSelection.service.FlightNumber || '',
      WayType: serviceSelection.WayType,
      Code: serviceSelection.service.Code,
      Description: serviceSelection.Description || '2',
      Currency: serviceSelection.service.Currency || 'INR',
      Price: serviceSelection.service.Price || 0,
      Origin: segment.originCode || '',
      Destination: segment.destinationCode || ''
    };
  }
}