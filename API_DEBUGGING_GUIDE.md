# Flight API Debugging Guide

## Current Issue
The API call is succeeding, but returning **no flight results**. This is confirmed by console logs showing:
```
{hasResponse: true, hasResults: false, resultsLength: undefined, results: undefined}
```

## Immediate Next Steps

### 1. **Check the Full API Response (CRITICAL)**
After my latest changes, refresh and search again. Look in the console for:

```
=== ONE-WAY FLIGHT API RESPONSE ===
Full Response: { ... }
```

**What to look for:**
- Is there an `Error` or `Errors` field in the response?
- What is the exact structure of the response?
- Are there any error messages from the TBO API?

### 2. **Check Network Tab**
1. Open DevTools → Network tab
2. Search for flights
3. Find the request to `/app/api/testBed/getSrcDestPickDrop.php`
4. Click on it and check:
   - **Request Payload**: Are all parameters correct?
   - **Response**: What is the actual JSON response?
   - **Status Code**: Is it 200 OK?

### 3. **Verify API Environment**
In `apiservice.service.ts` line 556, there's:
```typescript
env : 'test'
```

**Test both:**
- Try changing to `env: 'production'` (if available)
- Or comment out the env parameter entirely

### 4. **Check TBO Token**
Look in console for logs about token:
```
TBO Token in stored data: ...
```

**Verify:**
- Is the token present?
- Is it expired?
- Was it fetched successfully from the home page?

## Common Causes and Solutions

### Cause 1: Test Environment Has No Data
**Symptom:** API responds successfully but with empty Results array

**Solution:**
```typescript
// In apiservice.service.ts line 556
// Change from:
env : 'test'
// To:
env : 'production'  // or comment it out
```

### Cause 2: Invalid/Expired TBO Token
**Symptom:** API returns error about authentication

**Check:**
1. Go to home page
2. Open console
3. Look for "TBO Token fetched:" log
4. If no token, check `getTboToken()` method in home component

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh and start from home page
- Ensure token is fetched before navigating to flight list

### Cause 3: Invalid Route/Date
**Symptom:** API returns empty results but no error

**Try:**
- Different routes (e.g., BOM to DEL instead of DEL to BOM)
- Different dates (try tomorrow, or 7 days from now)
- Different passenger counts

### Cause 4: API Parameters Format
**Check request payload in Network tab:**

Should look like:
```
page: flightsearchtbo
enduserip: xxx.xxx.xxx.xxx
tokenid: xxxxxxxx
adultcount: 1
childcount: 0
infantcount: 0
journeyType: oneWay
sourceAirport: DEL
destinationAirport: BOM
cabinClass: Economy
departureDate: 2025-12-05
resultFareType: 2
env: test
```

**Common issues:**
- Date format wrong (should be YYYY-MM-DD)
- Airport codes wrong (should be 3-letter IATA codes)
- Journey type wrong (should be 'oneWay' not 'oneway')

## Detailed Debugging Steps

### Step 1: Enable Enhanced Logging
Already done! The component now logs:
- Full API response as JSON
- Response structure analysis
- Error messages if any
- Alternative response structures

### Step 2: Test with Different Parameters

**Test Case A: Popular Route**
```
From: DEL (Delhi)
To: BOM (Mumbai)
Date: Tomorrow
Passengers: 1 Adult
Class: Economy
```

**Test Case B: Different Route**
```
From: BOM (Mumbai)  
To: BLR (Bangalore)
Date: 7 days from now
Passengers: 1 Adult
Class: Economy
```

**Test Case C: Minimal Route**
```
From: DEL
To: CCU (Kolkata)
Date: Tomorrow
Passengers: 1 Adult
Class: Economy
```

### Step 3: Check Backend API

**If you have access to the backend:**
1. Check backend logs at `/app/api/testBed/getSrcDestPickDrop.php`
2. Look for errors when `page=flightsearchtbo` is called
3. Verify TBO API integration is working
4. Check if test environment credentials are valid

### Step 4: Verify Date Format

**Check console for:**
```
Fetching flights with data: {
  departureDate: "2025-12-05"  // Should be YYYY-MM-DD
}
```

**If format is wrong, the issue is in home component's date formatting.**

## Quick Fixes to Try

### Fix 1: Switch to Production Environment
```typescript
// File: src/app/services/apiservice.service.ts
// Line 556

// Change this:
env : 'test'

// To this:
// env : 'production'  // If available
```

### Fix 2: Use Real IP Address
Sometimes test environments require real IP. Check if `flightInputData['ipAddress']` is set correctly.

```typescript
// In console, type:
localStorage.getItem('flightSearchData')
// Check if ipAddress is present
```

### Fix 3: Verify Airport Codes
Make sure airport codes are valid IATA codes:
- Delhi: DEL ✓
- Mumbai: BOM ✓
- Bangalore: BLR ✓
- Kolkata: CCU ✓
- Chennai: MAA ✓

### Fix 4: Check Date Range
Some APIs have limitations:
- Minimum: Tomorrow (some don't allow same-day booking)
- Maximum: Usually 330-365 days in advance

## Expected API Response Structure

### Successful Response:
```json
{
  "Response": {
    "TraceId": "some-trace-id",
    "Results": [
      [
        {
          "Segments": [[...]],
          "FareBreakdown": [...],
          "Fare": {...},
          "IsRefundable": true/false,
          ...
        },
        ...
      ]
    ]
  }
}
```

### Error Response:
```json
{
  "Response": {
    "Error": {
      "ErrorCode": "...",
      "ErrorMessage": "..."
    }
  }
}
```

OR

```json
{
  "Response": {
    "Errors": [
      {
        "Code": "...",
        "Message": "..."
      }
    ]
  }
}
```

## Action Plan

1. ✅ **Search for flights** (you've already done this)
2. ✅ **Check console logs** (showing no results)
3. 🔄 **Refresh and search again** to see new detailed logs
4. ⏭️ **Check Network tab** for actual API response
5. ⏭️ **Try different route/date** if current one has no flights
6. ⏭️ **Check with backend team** about test environment data
7. ⏭️ **Consider switching to production environment** if test has no data

## What to Share for Further Help

If issue persists, share:
1. **Console logs**: The full "=== ONE-WAY FLIGHT API RESPONSE ===" section
2. **Network tab**: Screenshot or copy of the actual API response
3. **Request parameters**: What you searched for (route, date, passengers)
4. **Any error messages**: From console or network tab

## Most Likely Scenario

Based on the console showing `hasResponse: true` but `results: undefined`, the most likely scenario is:

**The test environment has no test flight data for the Delhi → Mumbai route on Dec 5, 2025.**

**Quick Solution:** Try a different date or different route, OR switch to production environment in the API service if that's an option.

