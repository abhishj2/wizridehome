# Flight Addon Page Integration Guide

## Overview
This document explains how the `flightfinalpage` component connects to the `flightaddonpage` component, similar to the implementation in the flight module reference.

## Architecture Flow

```
flightfinalpage (passenger details) 
    ↓
    User clicks "Continue"
    ↓
prepareMobFinalPageData() - Prepares addon data
    ↓
flightDataService.updateMessage() - Stores data
    ↓
Router navigates to '/flightaddons'
    ↓
flightaddonpage (seat/meal/service selection)
    ↓
onContinue() - Proceeds to payment
    ↓
Payment Gateway
```

## Key Changes Made

### 1. FlightfinalpageComponent (`flightfinalpage.component.ts`)

#### New Method: `proceedToAddons()`
```typescript
proceedToAddons(): void {
  // Validates terms and passenger details
  // Prepares mobile final page data
  // Navigates to addon page
}
```

#### New Method: `prepareMobFinalPageData()`
Prepares comprehensive data structure for addon page:
- **flightSegments**: Onward journey segments
- **flightSegmentsReturn**: Return journey segments (if roundtrip)
- **passengers**: Adults, children, infants with complete details
- **gstDetails**: GST information
- **ssr**: SSR (Special Service Request) data for both journeys
- **fareSummary**: Complete fare breakdown including:
  - Base fares (adults/children/infants)
  - Taxes
  - Baggage charges
  - Meal/Seat/Service charges
  - Final amount
- **baggage**: Pre-selected baggage for both journeys
- **other**: TBO result indices
- **extraMandatoryFields**: Mandatory seat/meal flags
- **passportRequired**: Passport requirement flag

#### Helper Methods Added

**`buildFareSummaryForAddons(isReturn: boolean)`**
- Constructs fare summary structure
- Includes adult/child/infant fare details
- Separates onward and return fares

**`buildBaggageChargesForSummary(isReturn: boolean)`**
- Converts selected baggage to summary format
- Formats for display in addon page

**`buildBaggageArray(isReturn: boolean)`**
- Prepares baggage array for booking payload
- Includes all selected baggage items

#### Modified Method: `finalProceed()`
- Now calls `proceedToAddons()` instead of `proceedToPayment()`
- Validates terms and passenger details first
- Navigates user to addon selection page

### 2. Data Flow Structure

#### Data Stored in FlightdataService
```typescript
{
  // Original flight data
  ...fullFlightData,
  
  // Addon-specific data
  mobFinalPageData: {
    flightSegments: [...],
    flightSegmentsReturn: [...],
    passengers: { adults: [...], children: [...], infants: [...] },
    gstDetails: {...},
    ssr: { onward: {...}, return: {...} },
    fareSummary: {
      onward: {
        summary: {...},
        adultFareDetails: {...},
        childFareDetail: {...},
        infantFareDetails: {...},
        fareDetails: {...}
      },
      return: {...},
      finalAmount: number
    },
    baggage: { onward: [...], return: [...] },
    other: { resultIndex: '', resultIndexReturn: '' },
    extraMandatoryFields: {...},
    passportRequired: boolean
  },
  
  // Passenger counts
  adults: number,
  children: number,
  infants: number,
  
  // Trip details
  tripType: 'oneway' | 'roundtrip' | 'multicity',
  fromCity: string,
  toCity: string,
  departureDate: string,
  returnDate: string,
  
  // API parameters
  tboToken: string,
  traceid: string,
  ipAddress: string
}
```

### 3. FlightaddonpageComponent Usage

The addon page receives this data via:
```typescript
this.flightDataService.currentMessage.subscribe((val: any) => {
  if (!val) {
    this.router.navigate(['/']);
    return;
  }
  
  // Extract data
  const { mobFinalPageData } = val;
  const { flightSegments, flightSegmentsReturn, ssr, fareSummary } = mobFinalPageData;
  
  // Process SSR data for seats/meals/services
  // Initialize addon selections
  // ...
});
```

## Integration Points

### 1. Service Communication
- **FlightdataService** acts as the data bridge
- Uses `updateMessage()` to pass data between components
- Observable pattern ensures reactive updates

### 2. Navigation
- Route: `/flightaddons`
- Programmatic navigation via `Router.navigate()`
- Data pre-loaded before navigation

### 3. Validation Flow
```
User fills passenger details
    ↓
Accepts terms & conditions
    ↓
Clicks "Continue"
    ↓
canProceed() validates:
    - All required fields filled
    - Valid email format
    - Valid mobile number
    - DOB validation
    - Passport/PAN if required
    - GST if mandatory
    ↓
proceedToAddons() executes
    ↓
prepareMobFinalPageData() builds payload
    ↓
Navigate to addon page
```

## Important Notes

### Fare Calculation
- Base fares calculated per passenger type
- Taxes added separately
- Baggage charges based on selected options
- Addon charges (seats/meals/services) added in addon page

### Unified Segment Format
- Handles international roundtrip with single booking
- Combines onward + return in one segment array
- Special handling in `isUnifiedSegmentFormat` flag

### Mandatory Validations
- Seat mandatory flags from `extraMandatoryFields`
- Meal mandatory flags per journey
- Validated in addon page before payment

## Testing Checklist

- [ ] One-way flight: Data passes correctly
- [ ] Roundtrip flight: Both journeys data present
- [ ] Multi-city flight: All segments included
- [ ] Passenger details: All types (adult/child/infant)
- [ ] GST details: Passed when mandatory
- [ ] Baggage: Pre-selected baggage included
- [ ] SSR data: Seats/meals/services available
- [ ] Fare summary: Accurate calculations
- [ ] Navigation: Smooth transition to addon page
- [ ] Back navigation: Data persists

## Future Enhancements

1. **Session Storage**: Add backup to sessionStorage for reliability
2. **Data Encryption**: Sensitive passenger data encryption
3. **State Management**: Consider NgRx/NGRX for complex state
4. **Error Handling**: Enhanced error messages and recovery
5. **Loading States**: Better UX during data preparation
6. **Analytics**: Track addon selection patterns

## Related Files

- `flightfinalpage.component.ts`: Main component logic
- `flightaddonpage.component.ts`: Addon page component
- `flightdata.service.ts`: Data service for communication
- `flightaddons.service.ts`: Addon-specific logic
- `flightbookingpayload.service.ts`: Booking payload generation

## Support

For issues or questions:
1. Check console logs for data structure
2. Verify FlightdataService subscription
3. Ensure all required fields are populated
4. Test with different trip types

---

**Last Updated**: January 2026
**Version**: 1.0.0

