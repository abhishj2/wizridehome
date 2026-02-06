# Special Offers Section - Dynamic Content Implementation

## Overview
The "Special Offers" section heading and description have been made dynamic with WordPress CMS, similar to the existing stats section implementation.

## Changes Made

### 1. WordPress Backend (`c:\laragon\www\wizcms\wp-content\themes\wizcms\functions.php`)

#### A. Admin Settings Page
- **Added Special Offers Section Configuration** to the existing "Home Statistics Settings" page
  - Location: Settings → Home Statistics
  - New fields:
    - **Heading**: Main heading for the Special Offers section
    - **Description**: Description text shown below the heading
  - Default values:
    - Heading: "Special Offers"
    - Description: "Grab the best deals and discounts on flights, hotels, and cab bookings"

#### B. Data Storage
- Settings are saved in WordPress options table as `home_special_offers_section`
- Sanitized using `sanitize_text_field()` for heading and `sanitize_textarea_field()` for description

#### C. REST API Endpoint
- **Updated endpoint**: `/wp-json/custom/v1/home-statistics`
- Now returns additional field: `special_offers_section`
  ```json
  {
    "shared_cabs": [...],
    "reserved_cabs": [...],
    "numbers_section": [...],
    "special_offers_section": {
      "heading": "Special Offers",
      "description": "Grab the best deals and discounts on flights, hotels, and cab bookings"
    }
  }
  ```

### 2. Angular Frontend (`e:\wizbooking\src\app\home\`)

#### A. TypeScript Component (`home.component.ts`)
- **Added new property**: `specialOffersSection`
  ```typescript
  specialOffersSection: { heading: string, description: string } = { 
    heading: 'Special Offers', 
    description: 'Grab the best deals and discounts on flights, hotels, and cab bookings' 
  };
  ```

- **Updated `loadHomeStatistics()` method** to fetch and apply the Special Offers section data:
  ```typescript
  if (data.special_offers_section) {
    this.specialOffersSection = {
      heading: data.special_offers_section.heading || 'Special Offers',
      description: data.special_offers_section.description || 'Grab the best deals and discounts on flights, hotels, and cab bookings'
    };
  }
  ```

#### B. HTML Template (`home.component.html`)
Updated **4 locations** where "Special Offers" appears:

1. **Mobile Section** (Lines 1108-1110):
   ```html
   <div class="wr-section-title">{{ specialOffersSection.heading }}</div>
   ```

2. **Shared Cabs Section** (Lines 1254-1257):
   ```html
   <div class="offers-header">
       <h2>{{ specialOffersSection.heading }}</h2>
       <p>{{ specialOffersSection.description }}</p>
   </div>
   ```

3. **Flights Section** (Lines 1326-1329):
   ```html
   <div class="offers-header">  
       <h2>{{ specialOffersSection.heading }}</h2>
       <p>{{ specialOffersSection.description }}</p>
   </div>
   ```

4. **Reserved Cabs Section** (Lines 1411-1414):
   ```html
   <div class="offers-header">
       <h2>{{ specialOffersSection.heading }}</h2>
       <p>{{ specialOffersSection.description }}</p>
   </div>
   ```

## How to Use

### For WordPress Admins:
1. Log in to WordPress admin panel
2. Navigate to **Settings → Home Statistics**
3. Scroll down to the **"Special Offers Section"** area
4. Update the **Heading** and **Description** fields as needed
5. Click **"Save Changes"**

### Testing:
1. The changes will be reflected on all four "Special Offers" sections:
   - Mobile view
   - Shared Cabs tab
   - Flights tab
   - Reserved Cabs tab

### Fallback Behavior:
- If WordPress API fails or returns no data, the default values are used:
  - Heading: "Special Offers"
  - Description: "Grab the best deals and discounts on flights, hotels, and cab bookings"

## Benefits
✅ **Centralized Content Management**: Update the Special Offers section from WordPress without code changes
✅ **Consistent Pattern**: Follows the same implementation pattern as the stats section
✅ **Graceful Degradation**: Falls back to default values if API fails
✅ **Type Safety**: TypeScript interface ensures data consistency

## API Endpoint
- **URL**: `https://wizzride.com/wp-json/custom/v1/home-statistics`
- **Method**: GET
- **Response Field**: `special_offers_section`
- **Authentication**: None required (public endpoint)
