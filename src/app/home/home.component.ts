import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  Renderer2,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SeoService } from '../services/seo.service';
import { WordpressService } from '../services/wordpress.service';
import { ApiserviceService, SourceValue } from '../services/apiservice.service';
import { FlightdataService } from '../services/flightdata.service';
import { FlightData } from '../interface/flight-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomCalendarComponent } from '../calendar/calendar.component';
import { PhoneDialerComponent } from '../shared/phone-dialer/phone-dialer.component';
import Swal from 'sweetalert2';

interface City {
  name: string;
  code: string;
  state: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  popular?: boolean;
  airportName?: string;
  country?: string;
}

interface StateWiseCity {
  state: string;
  cities: Array<{
    city: string;
    popular: boolean | string | number | undefined;
  }>;
}

interface ApiLocationResponse {
  locations: StateWiseCity[];
}

interface TravelerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  isVerified: boolean;
}

interface SelectedCities {
  shared: { pickup: string; dropoff: string };
  reserved: { pickup: string; dropoff: string };
  flights: { from: string; to: string };
}

interface Offer {
  id: number;
  title: string;
  description: string;
  subtitle: string;
  code: string;
  image: string;
}
interface FareData {
  date: string;
  price: number;
  airline: string;
  isLowest: boolean;
}

interface HomepagePopup {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_url: string;
  is_active: boolean;
  show_once: boolean;
  delay_seconds: number;
}

interface WordPressOffer {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    offer_subtitle?: string;
    offer_code?: string;
    offer_tab?: string; // ACF field for tab filtering (shared-cabs, flights, reserved-cabs)
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          medium?: { source_url?: string };
          large?: { source_url?: string };
          full?: { source_url?: string };
        };
      };
    }>;
  };
}

@Component({
  selector: 'app-travel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCalendarComponent, PhoneDialerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // Mobile tab state (mobile-only UI)
  mobileTab: 'shared' | 'reserved' | 'flights' = 'shared';
  private mobileTabOrder: Array<'shared' | 'reserved' | 'flights'> = ['shared', 'reserved', 'flights'];

  // Mobile popup state
  showMobileLocationPopup = false;
  mobilePopupType: 'from' | 'to' | 'pickup' | 'dropoff' | null = null;
  mobilePopupTarget: string = '';
  mobileSearchQuery: string = '';
  showMobileDatePicker = false;
  mobileDatePickerType: 'shared' | 'reserved' | 'flights' | 'flights-return' | null = null;
  mobileLocationTab: 'popular' | 'seeall' = 'popular';
  expandedStates: Set<string> = new Set();
  showMobileTravelersPopup = false;
  showMobileCountryPopup = false;
  mobileCountrySearchQuery = '';
  showMobileMultiCityModal = false;
  currentMultiCityRouteIndex: number = 0;
  currentMultiCityField: 'from' | 'to' = 'from';
  showCustomKeypad = false;
  activePhoneInput: HTMLInputElement | null = null;
  phoneInputCursorPosition: number = 0;
  customCursorElement: HTMLElement | null = null;
  private cachedInputStyles: any = null;
  private cachedInputElement: HTMLInputElement | null = null;
  private cachedMeasurementSpan: HTMLSpanElement | null = null;
  // Homepage Auto Popup
  showHomepagePopup = false;
  homepagePopupData: HomepagePopup | null = null;
  isLoadingPopup = false;
  calendarFareMap: Map<string, FareData> = new Map();
  calendarFareMapReturn: Map<string, FareData> = new Map();

  // State-wise city data from API
  stateWiseCities: StateWiseCity[] = [];
  stateWiseCitiesLoaded = false;

  services = [
    {
      id: 1,
      title: 'International Packages',
      description: 'Explore the world with our curated international travel packages. Hassle-free planning for your global adventures.',
      image: 'assets/images/international.jpg',
      link: 'https://wizzride.com/ourservices/holidaystours/Wizzride-International-Holiday-Planner/'
    },
    {
      id: 2,
      title: 'Flight & Hotel Bookings',
      description: 'Simplify your travel with our flight and hotel booking services. Best deals, easy reservations, and 24/7 support.',
      image: 'assets/images/flight.jpg',
      link: 'https://wizzride.com/flight-booking'
    },
    {
      id: 3,
      title: 'Luxury Shared Taxis',
      description: 'Enjoy premium shared taxi rides with top-notch comfort and convenience. On-time departures, spacious seating, and budget-friendly fares for all.',
      image: 'assets/images/wizcar.jpeg',
      link: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/'
    },
    {
      id: 4,
      title: 'Expert Holiday Planner',
      description: 'Let our experts plan your dream holiday. From itineraries to bookings, we ensure a seamless and memorable travel experience.',
      image: 'assets/images/holiday.jpg',
      link: 'https://wizzride.com/ourservices/holidaystours/'
    },
    {
      id: 5,
      title: 'Private Reserved Cabs',
      description: 'Book a private cab for a personalized travel experience. Perfect for families, groups, or solo travelers seeking privacy.',
      image: 'assets/images/ridetoairport_3.jpg',
      link: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/'
    },
  ];

  testimonials: Testimonial[] = [];
  expandedTestimonials: Set<number> = new Set();
  specialOffers: Offer[] = [];
  isLoadingOffers = false;

  // Home statistics
  sharedCabsStats: Array<{ number: string, label: string }> = [];
  reservedCabsStats: Array<{ number: string, label: string }> = [];
  numbersSectionStats: Array<{ number: string, label: string, description: string, icon: string }> = [];
  specialOffersSection: { heading: string, description: string } = { heading: 'Special Offers', description: 'Grab the best deals and discounts on flights, hotels, and cab bookings' };
  isLoadingStats = false;

  // Track home schema IDs for cleanup
  private homeSchemaIds: string[] = ['home-breadcrumb-schema', 'home-org-schema'];

  // 3D Testimonial Carousel Properties
  @ViewChild('testimonialSwiper', { static: false }) testimonialSwiper!: ElementRef;
  @ViewChild('mobileCountrySearchInput', { static: false }) mobileCountrySearchInput?: ElementRef<HTMLInputElement>;
  currentSlide = 0;
  totalSlides = 0;
  autoplayInterval: any = null;
  autoplayDuration = 5000; // 5 seconds
  isHovered = false;

  // Initialize 3D carousel
  private init3DTestimonialCarousel(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.totalSlides = this.testimonials.length;
    setTimeout(() => {
      this.startAutoplay();
    }, 1000);
  }

  // Auto-play functionality
  startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }

    this.autoplayInterval = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, this.autoplayDuration);
  }

  stopAutoplay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  async fetchCalendarFare(from: string, to: string, fareMap: Map<string, FareData>) {
    console.log(`Fetching calendar fares from ${from} to ${to}`);
    fareMap.clear();
    const today = new Date();
    const startMonth = today.getMonth();
    const startYear = today.getFullYear();
    const fetchPromises = [];

    for (let i = 0; i < 12; i++) {
      const start = i === 0 ? new Date(today) : new Date(startYear, startMonth + i, 1);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

      const startDate = this.formatDate(start);
      const endDate = this.formatDate(end);

      const promise = this.apiService
        .getCalendarFare(this.ip, this.tboTokenId, 'oneway', from, to, 'all', startDate, endDate)
        .toPromise()
        .then((res: any) => {
          const results = res?.Response?.SearchResults || [];
          results.forEach((fare: any) => {
            const raw = fare.DepartureDate;
            const date = new Date(new Date(raw).getTime() + 5.5 * 3600 * 1000);
            const iso = this.formatDate(date);
            fareMap.set(iso, {
              date: iso,
              price: fare.Fare,
              airline: fare.AirlineName,
              isLowest: fare.IsLowestFareOfMonth
            });
          });
        })
        .catch((error) => {
          console.error(`Error fetching fares for ${startDate} to ${endDate}:`, error);
        });

      fetchPromises.push(promise);
    }

    await Promise.all(fetchPromises);
    return fareMap;
  }

  // Navigation methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0
      ? this.totalSlides - 1
      : this.currentSlide - 1;
    this.resetAutoplay();
  }

  goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex;
    this.resetAutoplay();
  }

  resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // Get slide class for positioning
  getSlideClass(index: number): string {
    const totalSlides = this.testimonials.length;
    const position = (index - this.currentSlide + totalSlides) % totalSlides;

    if (position === 0) {
      return 'active';
    } else if (position === 1 || position === totalSlides - 1) {
      return position === 1 ? 'next' : 'prev';
    } else if (position === 2 || position === totalSlides - 2) {
      return position === 2 ? 'far-next' : 'far-prev';
    } else {
      return 'hidden';
    }
  }

  // Mouse hover events
  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  // Touch/swipe functionality
  private startX = 0;
  private endX = 0;
  private minSwipeDistance = 50;

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.endX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const diffX = this.startX - this.endX;

    if (Math.abs(diffX) > this.minSwipeDistance) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  // Mouse drag functionality
  private isDragging = false;

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.clientX;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.endX = event.clientX;
    this.handleSwipe();
  }

  onMouseUpLeave(): void {
    this.isDragging = false;
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  setMobileTab(tab: 'shared' | 'reserved' | 'flights'): void {
    this.mobileTab = tab;

    // Update URL to reflect the current tab
    const urlMap = {
      'shared': '/shared',
      'reserved': '/reserved',
      'flights': '/flight'
    };

    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate([urlMap[tab]], { replaceUrl: true });
    }

    // On mobile, ensure flight fields are empty (no defaults) when switching to flights tab
    if (tab === 'flights' && this.isMobileView()) {
      if (this.flightRoutes.length > 0) {
        this.flightRoutes[0].from = '';
        this.flightRoutes[0].to = '';
      }
      this.formValues.flightFrom = '';
      this.formValues.flightTo = '';
    }
  }

  getMobileTabIndex(tab: 'shared' | 'reserved' | 'flights'): number {
    return this.mobileTabOrder.indexOf(tab);
  }

  // Mobile popup methods
  openMobileLocationPopup(type: 'from' | 'to' | 'pickup' | 'dropoff'): void {
    // If custom phone keypad is open, close it so it can't interfere with taps
    this.closeCustomKeypad();

    // Prevent pickup/drop selection until from & to chosen
    if ((type === 'pickup' || type === 'dropoff')) {
      if (this.mobileTab === 'shared' && (!this.formValues.sharedPickup || !this.formValues.sharedDropoff)) {
        this.openMobileLocationPopup('from');
        return;
      }
      if (this.mobileTab === 'reserved' && (!this.formValues.reservedPickup || !this.formValues.reservedDropoff)) {
        this.openMobileLocationPopup('from');
        return;
      }
      if (this.mobileTab === 'flights' && (!this.formValues.flightFrom || !this.formValues.flightTo)) {
        this.openMobileLocationPopup('from');
        return;
      }
    }

    this.mobilePopupType = type;
    this.mobileSearchQuery = '';
    // Preload suggestions for city selection popups
    if (type === 'from' || type === 'to') {
      const targetToLoad = (this.mobileTab === 'shared')
        ? (type === 'from' ? 'mobile-shared-pickup' : 'mobile-shared-dropoff')
        : (this.mobileTab === 'reserved'
          ? (type === 'from' ? 'mobile-reserved-pickup' : 'mobile-reserved-dropoff')
          : (type === 'from' ? 'mobile-flight-from' : 'mobile-flight-to'));
      this.showCitySuggestionsOnFocus(targetToLoad);
    }

    // Set target based on type and current tab and clear the field for easy re-selection
    if (type === 'from') {
      if (this.mobileTab === 'shared') {
        this.mobilePopupTarget = 'mobile-shared-pickup';
        // Clear the field when opening popup to change city
        if (this.formValues.sharedPickup) {
          this.formValues.sharedPickup = '';
        }
        this.mobileSearchQuery = '';
      } else if (this.mobileTab === 'reserved') {
        this.mobilePopupTarget = 'mobile-reserved-pickup';
        // Clear the field when opening popup to change city
        if (this.formValues.reservedPickup) {
          this.formValues.reservedPickup = '';
          this.selectedReservedCodes.pickup = '';
        }
        this.mobileSearchQuery = '';
      } else if (this.mobileTab === 'flights') {
        this.mobilePopupTarget = 'mobile-flight-from';
        // Clear the field when opening popup to change city
        if (this.flightRoutes[0]?.from) {
          this.flightRoutes[0].from = '';
        }
        if (this.formValues.flightFrom) {
          this.formValues.flightFrom = '';
        }
        this.mobileSearchQuery = '';
      }
    } else if (type === 'to') {
      if (this.mobileTab === 'shared') {
        this.mobilePopupTarget = 'mobile-shared-dropoff';
        // Clear the field when opening popup to change city
        if (this.formValues.sharedDropoff) {
          this.formValues.sharedDropoff = '';
        }
        this.mobileSearchQuery = '';
      } else if (this.mobileTab === 'reserved') {
        this.mobilePopupTarget = 'mobile-reserved-dropoff';
        // Clear the field when opening popup to change city
        if (this.formValues.reservedDropoff) {
          this.formValues.reservedDropoff = '';
          this.selectedReservedCodes.dropoff = '';
        }
        this.mobileSearchQuery = '';
      } else if (this.mobileTab === 'flights') {
        this.mobilePopupTarget = 'mobile-flight-to';
        // Clear the field when opening popup to change city
        if (this.flightRoutes[0]?.to) {
          this.flightRoutes[0].to = '';
        }
        if (this.formValues.flightTo) {
          this.formValues.flightTo = '';
        }
        this.mobileSearchQuery = '';
      }
    } else if (type === 'pickup') {
      if (this.mobileTab === 'shared') {
        this.mobilePopupTarget = 'mobile-shared-pickup-specific';
        this.mobileSearchQuery = this.formValues.sharedPickupLocation || '';
      } else if (this.mobileTab === 'reserved') {
        this.mobilePopupTarget = 'mobile-reserved-pickup-specific';
        this.mobileSearchQuery = this.formValues.reservedPickupLocation || '';
      }
    } else if (type === 'dropoff') {
      if (this.mobileTab === 'shared') {
        this.mobilePopupTarget = 'mobile-shared-dropoff-specific';
        this.mobileSearchQuery = this.formValues.sharedDropoffLocation || '';
      } else if (this.mobileTab === 'reserved') {
        this.mobilePopupTarget = 'mobile-reserved-dropoff-specific';
        this.mobileSearchQuery = this.formValues.reservedDropoffLocation || '';
      }
    }

    this.showMobileLocationPopup = true;

    // Load suggestions
    if (type === 'from' || type === 'to') {
      if (this.mobileSearchQuery.trim()) {
        this.showCitySuggestions(this.mobileSearchQuery, this.mobilePopupTarget);
      } else {
        this.showCitySuggestionsOnFocus(this.mobilePopupTarget);
      }
    } else {
      if (this.mobileSearchQuery.trim()) {
        this.showLocationSuggestions(this.mobileSearchQuery, this.mobilePopupTarget);
      } else {
        this.showLocationSuggestionsOnFocus(this.mobilePopupTarget);
      }
    }
  }

  closeMobileLocationPopup(): void {
    this.showMobileLocationPopup = false;
    this.mobilePopupType = null;
    this.mobilePopupTarget = '';
    this.mobileSearchQuery = '';
    this.mobileLocationTab = 'popular';
    this.expandedStates.clear();
    // Clear suggestions
    if (this.mobilePopupTarget) {
      delete this.activeSuggestions[this.mobilePopupTarget];
    }
  }

  openMobileCountryPopup(): void {
    // Ensure only one popup is active at a time (prevents overlapping sliders on iOS)
    this.closeCustomKeypad();
    this.showMobileLocationPopup = false;
    this.showMobileDatePicker = false;
    this.showMobileTravelersPopup = false;

    this.showMobileCountryPopup = true;
    this.mobileCountrySearchQuery = '';

    if (isPlatformBrowser(this.platformId)) {
      // iOS Safari sometimes ignores immediate focus during animations
      setTimeout(() => {
        const el = this.mobileCountrySearchInput?.nativeElement;
        if (!el) return;
        try {
          el.focus();
        } catch { }
      }, 250);
    }
  }

  closeMobileCountryPopup(): void {
    this.showMobileCountryPopup = false;
  }

  selectMobileCountry(country: any): void {
    this.selectedCountryCode = country.code;
    this.closeMobileCountryPopup();
  }

  onMobileCountrySuggestionTouch(event: any, country: any): void {
    // Prevent iOS from treating it as a scroll/ghost click
    event.preventDefault();
    event.stopPropagation();
    this.selectMobileCountry(country);
  }

  getFilteredCountries(): any[] {
    if (!this.mobileCountrySearchQuery.trim()) {
      return this.countryList;
    }
    const query = this.mobileCountrySearchQuery.toLowerCase().trim();
    return this.countryList.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.code.includes(query)
    );
  }

  onMobileLocationInput(query: string): void {
    this.mobileSearchQuery = query;

    if (!query.trim()) {
      if (this.mobilePopupType === 'from' || this.mobilePopupType === 'to') {
        this.showCitySuggestionsOnFocus(this.mobilePopupTarget);
      } else {
        this.showLocationSuggestionsOnFocus(this.mobilePopupTarget);
      }
      return;
    }

    if (this.mobilePopupType === 'from' || this.mobilePopupType === 'to') {
      this.showCitySuggestions(query, this.mobilePopupTarget);
    } else {
      this.showLocationSuggestions(query, this.mobilePopupTarget);
    }
  }

  selectMobileCity(cityName: string, cityCode: string): void {
    // Map mobile target to actual target
    let actualTarget = '';
    if (this.mobilePopupTarget === 'mobile-shared-pickup') {
      actualTarget = 'shared-pickup';
    } else if (this.mobilePopupTarget === 'mobile-shared-dropoff') {
      actualTarget = 'shared-dropoff';
    } else if (this.mobilePopupTarget === 'mobile-reserved-pickup') {
      actualTarget = 'reserved-pickup';
    } else if (this.mobilePopupTarget === 'mobile-reserved-dropoff') {
      actualTarget = 'reserved-dropoff';
    } else if (this.mobilePopupTarget === 'mobile-flight-from') {
      actualTarget = 'flight-from-0';
    } else if (this.mobilePopupTarget === 'mobile-flight-to') {
      actualTarget = 'flight-to-0';
    } else if (this.mobilePopupTarget && (this.mobilePopupTarget.startsWith('mobile-flight-from-') || this.mobilePopupTarget.startsWith('mobile-flight-to-'))) {
      // Handle multi-city route selection directly
      actualTarget = this.mobilePopupTarget.replace('mobile-', '');
      this.selectMultiCity(cityName, cityCode, actualTarget);
      this.closeMobileLocationPopup();
      return;
    }

    if (actualTarget) {
      this.selectCity(cityName, cityCode, actualTarget);
    }

    this.closeMobileLocationPopup();
  }

  selectMobileLocation(locationName: string): void {
    // Map mobile target to actual target
    let actualTarget = '';
    if (this.mobilePopupTarget === 'mobile-shared-pickup-specific') {
      actualTarget = 'shared-pickup-specific';
    } else if (this.mobilePopupTarget === 'mobile-shared-dropoff-specific') {
      actualTarget = 'shared-dropoff-specific';
    } else if (this.mobilePopupTarget === 'mobile-reserved-pickup-specific') {
      actualTarget = 'reserved-pickup-specific';
    } else if (this.mobilePopupTarget === 'mobile-reserved-dropoff-specific') {
      actualTarget = 'reserved-dropoff-specific';
    }

    if (actualTarget) {
      this.selectLocation(locationName, actualTarget);
    }

    this.closeMobileLocationPopup();
  }

  getMobilePopupSuggestions(): City[] | string[] {
    return this.activeSuggestions[this.mobilePopupTarget] || [];
  }

  isMobileCityArray(): boolean {
    // For city selection (from/to), always return true since we're dealing with cities
    if (this.mobilePopupType === 'from' || this.mobilePopupType === 'to') {
      return true;
    }
    // For location selection (pickup/dropoff), check if suggestions are strings
    const suggestions = this.activeSuggestions[this.mobilePopupTarget];
    return Array.isArray(suggestions) && suggestions.length > 0 && typeof suggestions[0] === 'object';
  }

  // Check if current popup is for flights
  isFlightPopup(): boolean {
    const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);
    return normalizedTarget.startsWith('flight-from-') || normalizedTarget.startsWith('flight-to-');
  }

  getMobileCitySuggestionsList(): City[] {
    // For flights, show all airports (sorted with Indian first)
    if (this.isFlightPopup()) {
      const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);
      let allAirports = [...this.flightAirports];

      // Filter based on search query
      if (this.mobileSearchQuery && this.mobileSearchQuery.trim()) {
        const query = this.mobileSearchQuery.toLowerCase().trim();
        allAirports = allAirports.filter(airport =>
          airport.name.toLowerCase().includes(query) ||
          airport.code.toLowerCase().includes(query) ||
          (airport.state && airport.state.toLowerCase().includes(query))
        );
      }

      // Filter out selected airport from the other field
      if (normalizedTarget.startsWith('flight-from-')) {
        const routeIndex = parseInt(normalizedTarget.replace('flight-from-', ''));
        const selectedTo = this.flightRoutes[routeIndex]?.to || (routeIndex === 0 ? this.formValues.flightTo : '') || '';
        if (selectedTo) {
          const toCityName = this.extractCityNameFromDisplay(selectedTo);
          allAirports = allAirports.filter(airport =>
            airport.name.toLowerCase() !== toCityName.toLowerCase()
          );
        }
      } else if (normalizedTarget.startsWith('flight-to-')) {
        const routeIndex = parseInt(normalizedTarget.replace('flight-to-', ''));
        const selectedFrom = this.flightRoutes[routeIndex]?.from || (routeIndex === 0 ? this.formValues.flightFrom : '') || '';
        if (selectedFrom) {
          const fromCityName = this.extractCityNameFromDisplay(selectedFrom);
          allAirports = allAirports.filter(airport =>
            airport.name.toLowerCase() !== fromCityName.toLowerCase()
          );
        }
      }

      return allAirports;
    }

    // For reserved (mobile) from/to show full reserved list by default
    const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);
    if ((normalizedTarget === 'reserved-pickup' || normalizedTarget === 'reserved-dropoff')) {
      let cities = [...this.reservedCities];
      // Exclude opposite selection
      if (normalizedTarget === 'reserved-pickup' && this.formValues.reservedDropoff) {
        cities = cities.filter(c => c.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase());
      } else if (normalizedTarget === 'reserved-dropoff' && this.formValues.reservedPickup) {
        cities = cities.filter(c => c.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase());
      }
      if (this.mobileSearchQuery && this.mobileSearchQuery.trim()) {
        const q = this.mobileSearchQuery.toLowerCase().trim();
        cities = cities.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
      }
      return cities;
    }

    // For non-flight popups, use existing logic
    const suggestions = this.getMobilePopupSuggestions();
    return this.isMobileCityArray() ? (suggestions as City[]) : [];
  }

  getMobileLocationSuggestionsList(): string[] {
    const suggestions = this.getMobilePopupSuggestions();
    return Array.isArray(suggestions) && suggestions.length > 0 && typeof suggestions[0] === 'string'
      ? (suggestions as string[])
      : [];
  }

  // Map city name to state (fallback method - state info should come from API)
  private getCityState(cityName: string): string {
    // Since state-wise cities API provides state information directly,
    // this is now just a fallback for other APIs that might not have state info
    // Returns 'Other' as default since we rely on API data for accurate state information
    return 'Other';
  }

  // Get actual city state from state-wise cities data
  private getActualCityState(cityName: string): string {
    if (!this.stateWiseCitiesLoaded || !this.stateWiseCities || this.stateWiseCities.length === 0) {
      return this.getCityState(cityName);
    }

    // Search through state-wise cities to find the city and return its state
    for (const stateData of this.stateWiseCities) {
      const foundCity = stateData.cities.find(
        cityData => cityData.city.toLowerCase() === cityName.toLowerCase()
      );
      if (foundCity) {
        return stateData.state;
      }
    }

    // Fallback to getCityState if not found in state-wise cities
    return this.getCityState(cityName);
  }

  // Group cities by state for Popular Searches
  getCitiesGroupedByState(): { state: string; cities: City[]; expanded: boolean }[] {
    // If state-wise cities are loaded, use them
    if (this.stateWiseCitiesLoaded && this.stateWiseCities.length > 0) {
      return this.stateWiseCities.map(stateData => {
        // Convert API format to City[] format
        const cities: City[] = stateData.cities.map(cityData => {
          // Normalize popular value to boolean
          let popularValue: boolean | undefined = undefined;
          if (cityData.popular === true || cityData.popular === 1) {
            popularValue = true;
          } else if (cityData.popular === false || cityData.popular === 0) {
            popularValue = false;
          } else if (typeof cityData.popular === 'string') {
            popularValue = cityData.popular.toLowerCase() === 'true';
          }

          return {
            name: cityData.city,
            code: cityData.city.substring(0, 3).toUpperCase(), // Generate code from city name
            state: stateData.state,
            popular: popularValue
          };
        });

        // Sort cities: popular first, then alphabetically
        const sortedCities = cities.sort((a, b) => {
          // Popular cities first
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          // Then alphabetically
          return a.name.localeCompare(b.name);
        });

        // Apply filtering logic (exclude selected city from the other field)
        const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);
        let filteredCities = sortedCities;

        if (normalizedTarget === 'shared-pickup' && this.formValues.sharedDropoff) {
          filteredCities = sortedCities.filter(city =>
            city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
          );
        } else if (normalizedTarget === 'shared-dropoff' && this.formValues.sharedPickup) {
          filteredCities = sortedCities.filter(city =>
            city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
          );
        } else if (normalizedTarget === 'reserved-pickup' && this.formValues.reservedDropoff) {
          filteredCities = sortedCities.filter(city =>
            city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
          );
        } else if (normalizedTarget === 'reserved-dropoff' && this.formValues.reservedPickup) {
          filteredCities = sortedCities.filter(city =>
            city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
          );
        }

        return {
          state: stateData.state,
          cities: filteredCities,
          expanded: this.expandedStates.has(stateData.state)
        };
      });
    }

    // Fallback to old logic if API data not loaded
    let allCities: City[] = [];

    if (this.mobileSearchQuery && this.mobileSearchQuery.trim()) {
      allCities = this.getMobileCitySuggestionsList();
    } else {
      const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);

      if (normalizedTarget === 'reserved-pickup' || normalizedTarget === 'reserved-dropoff') {
        allCities = [...this.reservedCities];
      } else if (normalizedTarget === 'shared-pickup' || normalizedTarget === 'shared-dropoff') {
        allCities = [...this.sourceCities];
      } else if (normalizedTarget.startsWith('flight-from-') || normalizedTarget.startsWith('flight-to-')) {
        allCities = [...this.flightAirports];
      } else {
        allCities = [...this.cities];
      }

      if (normalizedTarget === 'shared-pickup' && this.formValues.sharedDropoff) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
        );
      } else if (normalizedTarget === 'shared-dropoff' && this.formValues.sharedPickup) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
        );
      } else if (normalizedTarget === 'reserved-pickup' && this.formValues.reservedDropoff) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
        );
      } else if (normalizedTarget === 'reserved-dropoff' && this.formValues.reservedPickup) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
        );
      }
    }

    const stateMap = new Map<string, City[]>();

    allCities.forEach(city => {
      const state = (city.state && city.state.trim()) ? city.state : this.getCityState(city.name);
      if (!stateMap.has(state)) {
        stateMap.set(state, []);
      }
      stateMap.get(state)!.push(city);
    });

    const stateGroups = Array.from(stateMap.entries())
      .filter(([state]) => state !== 'Other')
      .map(([state, cities]) => ({
        state,
        cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
        expanded: this.expandedStates.has(state)
      }))
      .sort((a, b) => a.state.localeCompare(b.state));

    return stateGroups;
  }

  // Get initial cities per state (show ONLY popular cities initially)
  getInitialCitiesForState(stateGroup: { state: string; cities: City[]; expanded: boolean }): City[] {
    if (!stateGroup || !stateGroup.cities || stateGroup.cities.length === 0) {
      // console.log('getInitialCitiesForState: No cities in stateGroup', stateGroup);
      return [];
    }

    if (stateGroup.expanded) {
      // When expanded (See More clicked), show ALL cities (both popular and non-popular)
      // console.log(`State ${stateGroup.state} expanded - showing ALL ${stateGroup.cities.length} cities (popular + non-popular)`);
      return stateGroup.cities;
    }

    // When not expanded, show ONLY popular cities (popular = true)
    const popularCities = stateGroup.cities.filter(city => {
      return city.popular === true;
    });
    // console.log(`State ${stateGroup.state} - showing ${popularCities.length} popular cities out of ${stateGroup.cities.length} total`);
    if (popularCities.length === 0) {
      // console.warn(`No popular cities found for ${stateGroup.state}. Sample cities:`, stateGroup.cities.slice(0, 3).map(c => ({ name: c.name, popular: c.popular, type: typeof c.popular })));
    }
    return popularCities;
  }

  // Toggle state expansion
  toggleStateExpansion(state: string): void {
    if (this.expandedStates.has(state)) {
      this.expandedStates.delete(state);
    } else {
      this.expandedStates.add(state);
    }
  }

  // Check if state has more cities to show (non-popular cities exist)
  hasMoreCities(stateGroup: { state: string; cities: City[]; expanded: boolean }): boolean {
    if (stateGroup.expanded) {
      return false; // Already showing non-popular cities
    }
    // Check if there are non-popular cities to show
    const nonPopularCount = stateGroup.cities.filter(city => city.popular === false || city.popular === undefined).length;
    return nonPopularCount > 0; // Has non-popular cities
  }

  // Check if state has non-popular cities (for See Less button)
  hasNonPopularCities(stateGroup: { state: string; cities: City[]; expanded: boolean }): boolean {
    const nonPopularCount = stateGroup.cities.filter(city => city.popular === false || city.popular === undefined).length;
    return nonPopularCount > 0;
  }

  // Set mobile location tab
  setMobileLocationTab(tab: 'popular' | 'seeall'): void {
    this.mobileLocationTab = tab;
  }

  // Get all cities for "See All" tab (sorted alphabetically)
  getAllCitiesForSeeAll(): City[] {
    // If state-wise cities are loaded, use them
    if (this.stateWiseCitiesLoaded && this.stateWiseCities.length > 0) {
      let allCities: City[] = [];

      // Flatten all cities from all states
      this.stateWiseCities.forEach(stateData => {
        const cities: City[] = stateData.cities.map(cityData => {
          // Normalize popular value to boolean
          let popularValue: boolean | undefined = undefined;
          if (cityData.popular === true || cityData.popular === 1) {
            popularValue = true;
          } else if (cityData.popular === false || cityData.popular === 0) {
            popularValue = false;
          } else if (typeof cityData.popular === 'string') {
            popularValue = cityData.popular.toLowerCase() === 'true';
          }

          return {
            name: cityData.city,
            code: cityData.city.substring(0, 3).toUpperCase(),
            state: stateData.state,
            popular: popularValue
          };
        });
        allCities = allCities.concat(cities);
      });

      // Apply filtering logic (exclude selected city from the other field)
      const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);

      if (normalizedTarget === 'shared-pickup' && this.formValues.sharedDropoff) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
        );
      } else if (normalizedTarget === 'shared-dropoff' && this.formValues.sharedPickup) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
        );
      } else if (normalizedTarget === 'reserved-pickup' && this.formValues.reservedDropoff) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
        );
      } else if (normalizedTarget === 'reserved-dropoff' && this.formValues.reservedPickup) {
        allCities = allCities.filter(city =>
          city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
        );
      }

      // Sort alphabetically by city name
      return allCities.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Fallback to old logic if API data not loaded
    let allCities: City[] = [];
    const normalizedTarget = this.normalizeTarget(this.mobilePopupTarget);

    if (normalizedTarget === 'reserved-pickup' || normalizedTarget === 'reserved-dropoff') {
      allCities = [...this.reservedCities];
    } else if (normalizedTarget === 'shared-pickup' || normalizedTarget === 'shared-dropoff') {
      allCities = [...this.sourceCities];
    } else if (normalizedTarget.startsWith('flight-from-') || normalizedTarget.startsWith('flight-to-')) {
      allCities = [...this.flightAirports];
    } else {
      allCities = [...this.cities];
    }

    if (normalizedTarget === 'shared-pickup' && this.formValues.sharedDropoff) {
      allCities = allCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
      );
    } else if (normalizedTarget === 'shared-dropoff' && this.formValues.sharedPickup) {
      allCities = allCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
      );
    } else if (normalizedTarget === 'reserved-pickup' && this.formValues.reservedDropoff) {
      allCities = allCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
      );
    } else if (normalizedTarget === 'reserved-dropoff' && this.formValues.reservedPickup) {
      allCities = allCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
      );
    }

    return allCities.sort((a, b) => a.name.localeCompare(b.name));
  }

  getMobilePassengers(): number {
    if (this.mobileTab === 'shared') return this.formValues.sharedPassengers || 1;
    if (this.mobileTab === 'reserved') return this.formValues.reservedPassengers || 1;
    return 1;
  }

  updateMobilePassengers(delta: number): void {
    if (this.mobileTab === 'shared') {
      this.updateSharedPassengers(delta);
    } else if (this.mobileTab === 'reserved') {
      this.updateReservedPassengers(delta);
    }
  }

  getChildrenCount(): number {
    return this.counts.children || 0;
  }

  updateChildrenCount(delta: number): void {
    this.counts.children = Math.max(0, Math.min(9, (this.counts.children || 0) + delta));
  }

  private normalizeTarget(target: string): string {
    // Map mobile targets to desktop equivalents for suggestion logic
    // Handle multi-city flight targets (flight-from-0, flight-to-1, etc.) first
    if (target.startsWith('flight-from-') || target.startsWith('flight-to-')) {
      return target;
    }

    // Handle mobile multi-city flight targets (mobile-flight-from-0, mobile-flight-to-1, etc.)
    if (target.startsWith('mobile-flight-from-') || target.startsWith('mobile-flight-to-')) {
      return target.replace('mobile-', '');
    }

    switch (target) {
      case 'mobile-shared-pickup':
        return 'shared-pickup';
      case 'mobile-shared-dropoff':
        return 'shared-dropoff';
      case 'mobile-reserved-pickup':
        return 'reserved-pickup';
      case 'mobile-reserved-dropoff':
        return 'reserved-dropoff';
      case 'mobile-flight-from':
        return 'flight-from-0';
      case 'mobile-flight-to':
        return 'flight-to-0';
      case 'mobile-shared-pickup-specific':
        return 'shared-pickup-specific';
      case 'mobile-shared-dropoff-specific':
        return 'shared-dropoff-specific';
      case 'mobile-reserved-pickup-specific':
        return 'reserved-pickup-specific';
      case 'mobile-reserved-dropoff-specific':
        return 'reserved-dropoff-specific';
      default:
        return target;
    }
  }

  getMobileCityCode(type: 'from' | 'to'): string {
    // For reserved cabs, don't show codes (they are numeric location IDs, not display codes)
    if (this.mobileTab === 'reserved') {
      return '';
    }

    let cityValue = '';
    if (type === 'from') {
      if (this.mobileTab === 'shared') {
        cityValue = this.formValues.sharedPickup || '';
      } else if (this.mobileTab === 'flights') {
        // Check flightRoutes[0] first, then fallback to formValues
        cityValue = (this.flightRoutes[0]?.from || this.formValues.flightFrom || '').trim();
        // Return empty if no value selected for flights
        if (!cityValue || cityValue === '') {
          return '';
        }
      }
    } else {
      if (this.mobileTab === 'shared') {
        cityValue = this.formValues.sharedDropoff || '';
      } else if (this.mobileTab === 'flights') {
        // Check flightRoutes[0] first, then fallback to formValues
        cityValue = (this.flightRoutes[0]?.to || this.formValues.flightTo || '').trim();
        // Return empty if no value selected for flights
        if (!cityValue || cityValue === '') {
          return '';
        }
      }
    }

    if (!cityValue) {
      return '';
    }

    // Extract code from display value like "Delhi (DEL)" -> "DEL"
    const codeMatch = cityValue.match(/\(([^)]+)\)/);
    if (codeMatch) {
      return codeMatch[1];
    }

    // If no code, try to find in cities array
    const cityName = this.extractCityNameFromDisplay(cityValue);
    let citiesToSearch: City[] = [];
    if (this.mobileTab === 'shared') {
      citiesToSearch = this.sourceCities;
    } else if (this.mobileTab === 'flights') {
      citiesToSearch = this.flightAirports;
    }

    const city = citiesToSearch.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    return city?.code || cityName.substring(0, 3).toUpperCase();
  }

  getMobileCityName(type: 'from' | 'to'): string {
    let cityValue = '';
    if (type === 'from') {
      if (this.mobileTab === 'shared') {
        cityValue = this.formValues.sharedPickup || '';
      } else if (this.mobileTab === 'reserved') {
        cityValue = this.formValues.reservedPickup || '';
      } else if (this.mobileTab === 'flights') {
        // Check flightRoutes[0] first, then fallback to formValues
        cityValue = (this.flightRoutes[0]?.from || this.formValues.flightFrom || '').trim();
        // Return empty if no value selected for flights
        if (!cityValue || cityValue === '') {
          return '';
        }
      }
    } else {
      if (this.mobileTab === 'shared') {
        cityValue = this.formValues.sharedDropoff || '';
      } else if (this.mobileTab === 'reserved') {
        cityValue = this.formValues.reservedDropoff || '';
      } else if (this.mobileTab === 'flights') {
        // Check flightRoutes[0] first, then fallback to formValues
        cityValue = (this.flightRoutes[0]?.to || this.formValues.flightTo || '').trim();
        // Return empty if no value selected for flights
        if (!cityValue || cityValue === '') {
          return '';
        }
      }
    }

    if (!cityValue) {
      return '';
    }

    return this.extractCityNameFromDisplay(cityValue);
  }

  isMobileView(): boolean {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  }

  async onMobileSearch(): Promise<void> {
    // Validate phone number from mobile form
    if (!this.phoneNumber || !this.phoneNumber.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Phone Number Required',
        text: 'Please enter your phone number',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    if (!this.selectedCountryCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Country Code Required',
        text: 'Please select a country code',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid phone number (10-15 digits)',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Validate phone number starts with 9, 8, 7, or 6
    if (!/^[9876]/.test(this.phoneNumber)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Phone number must start with 9, 8, 7, or 6',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Check if number is blocked
    const isBlocked = await this.checkIfNumberBlocked(this.phoneNumber);
    if (isBlocked) {
      Swal.fire({
        icon: 'error',
        title: 'Access Blocked',
        text: 'Sorry, you are blocked. Please contact our support for assistance.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Store the complete phone number
    const completePhoneNumber = this.selectedCountryCode + this.phoneNumber;

    if (this.mobileTab === 'shared') {
      this.searchCabsMobile('shared', completePhoneNumber);
    } else if (this.mobileTab === 'reserved') {
      this.searchCabsMobile('reserved', completePhoneNumber);
    } else {
      this.searchFlightsMobile(completePhoneNumber);
    }
  }

  openMobileDatePicker(type: 'shared' | 'reserved' | 'flights'): void {
    this.closeCustomKeypad();
    this.mobileDatePickerType = type;
    this.showMobileDatePicker = true;

    // Prevent background scrolling
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }

    // Fetch calendar fares for flight departure
    if (type === 'flights') {
      const fromCity = this.flightRoutes[0]?.from;
      const toCity = this.flightRoutes[0]?.to;

      if (fromCity && toCity) {
        const fromCode = this.extractAirportCode(fromCity);
        const toCode = this.extractAirportCode(toCity);

        if (fromCode && toCode) {
          this.fetchCalendarFare(fromCode, toCode, this.calendarFareMap);
        }
      }
    }
  }

  openMobileReturnDatePicker(): void {
    this.closeCustomKeypad();
    this.mobileDatePickerType = 'flights-return';
    this.showMobileDatePicker = true;

    // Prevent background scrolling
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }

    // Fetch calendar fares for flight return (reversed route)
    const fromCity = this.flightRoutes[0]?.from;
    const toCity = this.flightRoutes[0]?.to;

    if (fromCity && toCity) {
      const fromCode = this.extractAirportCode(fromCity);
      const toCode = this.extractAirportCode(toCity);

      if (fromCode && toCode) {
        // Reversed: to -> from for return flight
        this.fetchCalendarFare(toCode, fromCode, this.calendarFareMapReturn);
      }
    }
  }

  openMobileMultiCityModal(): void {
    this.closeCustomKeypad();
    this.showMobileMultiCityModal = true;
  }

  closeMobileMultiCityModal(): void {
    this.showMobileMultiCityModal = false;
  }

  openMobileMultiCityLocationPopupDirect(field: 'from' | 'to', routeIndex: number): void {
    const target = `mobile-flight-${field}-${routeIndex}`;
    this.mobilePopupTarget = target;
    this.mobilePopupType = field;
    this.mobileSearchQuery = '';
    this.currentMultiCityRouteIndex = routeIndex;
    this.currentMultiCityField = field;
    // Use the normalized target (without mobile- prefix) for suggestions
    const normalizedTarget = target.replace('mobile-', '');
    this.showCitySuggestionsOnFocus(target);
    this.showMobileLocationPopup = true;
  }

  openMobileMultiCityLocationPopup(field: 'from' | 'to', routeIndex: number): void {
    this.currentMultiCityRouteIndex = routeIndex;
    this.currentMultiCityField = field;
    this.mobilePopupTarget = `flight-${field}-${routeIndex}`;
    this.mobilePopupType = field; // Set popup type to 'from' or 'to' for city suggestions
    this.mobileSearchQuery = '';
    // Close multi-city modal when opening location popup
    this.showMobileMultiCityModal = false;
    // Show city suggestions on focus
    this.showCitySuggestionsOnFocus(this.mobilePopupTarget);
    this.showMobileLocationPopup = true;
  }

  openMobileMultiCityDatePicker(routeIndex: number): void {
    this.currentMultiCityRouteIndex = routeIndex;
    this.mobileDatePickerType = `flights-multicity-${routeIndex}` as any;
    this.showMobileDatePicker = true;

    // Prevent background scrolling
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }

    // Close multi-city modal when opening date picker
    this.showMobileMultiCityModal = false;
  }

  getCityCodeFromDisplay(displayValue: string): string {
    if (!displayValue) return '';
    const codeMatch = displayValue.match(/\(([^)]+)\)/);
    return codeMatch ? codeMatch[1] : '';
  }

  getCityNameFromDisplay(displayValue: string): string {
    if (!displayValue) return '';
    return displayValue.replace(/\s*\([^)]+\)\s*$/, '').trim();
  }

  getMultiCityCode(displayValue: string): string {
    if (!displayValue || typeof displayValue !== 'string') return '';
    // Extract code from format like "CityName (CODE)" or "Guwahati (GAU)"
    const codeMatch = displayValue.match(/\(([^)]+)\)/);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].trim();
    }
    // If no parentheses, try to extract from format like "CODE - CityName"
    const dashMatch = displayValue.match(/^([A-Z]{2,4})\s*-\s*/);
    if (dashMatch && dashMatch[1]) {
      return dashMatch[1].trim();
    }
    return '';
  }

  getMultiCityName(displayValue: string): string {
    if (!displayValue || typeof displayValue !== 'string') return '';
    // Extract city name from format like "CityName (CODE)" or "Guwahati (GAU)"
    let name = displayValue.replace(/\s*\([^)]+\)\s*$/, '').trim();
    // If format is "CODE - CityName", extract the city name part
    const dashMatch = name.match(/^[A-Z]{2,4}\s*-\s*(.+)$/);
    if (dashMatch && dashMatch[1]) {
      return dashMatch[1].trim();
    }
    return name || '';
  }

  closeMobileDatePicker(): void {
    this.showMobileDatePicker = false;
    this.mobileDatePickerType = null;

    // Restore background scrolling
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  onMobileDateSelected(date: string, type?: 'shared' | 'reserved' | 'flights' | 'flights-return' | string): void {
    // If type is provided, use it; otherwise use mobileDatePickerType
    const dateType = type || this.mobileDatePickerType;

    if (dateType === 'shared') {
      this.onSharedDateSelected(date);
    } else if (dateType === 'reserved') {
      this.onReservedDateSelected(date);
    } else if (dateType === 'flights') {
      this.onFlightDepartureDateSelected(date, 0);
    } else if (dateType === 'flights-return') {
      this.onFlightReturnDateSelected(date);
    } else if (dateType && typeof dateType === 'string' && dateType.startsWith('flights-multicity-')) {
      // Handle multi-city date selection
      const routeIndex = parseInt(dateType.split('-')[2]);
      if (!isNaN(routeIndex) && this.flightRoutes[routeIndex]) {
        this.onFlightDepartureDateSelected(date, routeIndex);
        // Re-open multi-city modal after date selection
        setTimeout(() => {
          this.showMobileMultiCityModal = true;
        }, 100);
      }
    }
    this.closeMobileDatePicker();
  }

  getMobileDateDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return 'Today';
    }
    return this.formatMobileDate(dateString);
  }

  formatMobileDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${month} ${dayNum}${this.getOrdinalSuffix(dayNum)} ${year}`;
  }

  getMobileFlagCode(): string {
    return this.getFlagCode(this.selectedCountryCode);
  }

  getFlagCode(code: string): string {
    const flagMap: { [key: string]: string } = {
      '+1': 'us', '+7': 'ru', '+20': 'eg', '+27': 'za', '+30': 'gr',
      '+31': 'nl', '+32': 'be', '+33': 'fr', '+34': 'es', '+36': 'hu',
      '+39': 'it', '+40': 'ro', '+41': 'ch', '+43': 'at', '+44': 'gb',
      '+45': 'dk', '+46': 'se', '+47': 'no', '+48': 'pl', '+49': 'de',
      '+51': 'pe', '+52': 'mx', '+53': 'cu', '+54': 'ar', '+55': 'br',
      '+56': 'cl', '+57': 'co', '+58': 've', '+60': 'my', '+61': 'au',
      '+62': 'id', '+63': 'ph', '+64': 'nz', '+65': 'sg', '+66': 'th',
      '+81': 'jp', '+82': 'kr', '+84': 'vn', '+86': 'cn', '+90': 'tr',
      '+91': 'in', '+92': 'pk', '+93': 'af', '+94': 'lk', '+95': 'mm',
      '+98': 'ir', '+212': 'ma', '+213': 'dz', '+216': 'tn', '+218': 'ly',
      '+220': 'gm', '+221': 'sn', '+222': 'mr', '+223': 'ml', '+224': 'gn',
      '+225': 'ci', '+226': 'bf', '+227': 'ne', '+228': 'tg', '+229': 'bj',
      '+230': 'mu', '+231': 'lr', '+232': 'sl', '+233': 'gh', '+234': 'ng',
      '+235': 'td', '+236': 'cf', '+237': 'cm', '+238': 'cv', '+239': 'st',
      '+240': 'gq', '+241': 'ga', '+242': 'cg', '+243': 'cd', '+244': 'ao',
      '+245': 'gw', '+246': 'io', '+248': 'sc', '+249': 'sd', '+250': 'rw',
      '+251': 'et', '+252': 'so', '+253': 'dj', '+254': 'ke', '+255': 'tz',
      '+256': 'ug', '+257': 'bi', '+258': 'mz', '+260': 'zm', '+261': 'mg',
      '+262': 're', '+263': 'zw', '+264': 'na', '+265': 'mw', '+266': 'ls',
      '+267': 'bw', '+268': 'sz', '+269': 'km', '+290': 'sh', '+291': 'er',
      '+297': 'aw', '+298': 'fo', '+299': 'gl', '+350': 'gi', '+351': 'pt',
      '+352': 'lu', '+353': 'ie', '+354': 'is', '+355': 'al', '+356': 'mt',
      '+357': 'cy', '+358': 'fi', '+359': 'bg', '+370': 'lt', '+371': 'lv',
      '+372': 'ee', '+373': 'md', '+374': 'am', '+375': 'by', '+376': 'ad',
      '+377': 'mc', '+378': 'sm', '+380': 'ua', '+381': 'rs', '+382': 'me',
      '+383': 'xk', '+385': 'hr', '+386': 'si', '+387': 'ba', '+389': 'mk',
      '+420': 'cz', '+421': 'sk', '+423': 'li', '+500': 'fk', '+501': 'bz',
      '+502': 'gt', '+503': 'sv', '+504': 'hn', '+505': 'ni', '+506': 'cr',
      '+507': 'pa', '+508': 'pm', '+509': 'ht', '+590': 'bl', '+591': 'bo',
      '+592': 'gy', '+593': 'ec', '+594': 'gf', '+595': 'py', '+596': 'mq',
      '+597': 'sr', '+598': 'uy', '+599': 'cw', '+670': 'tl', '+672': 'nf',
      '+673': 'bn', '+674': 'nr', '+675': 'pg', '+676': 'to', '+677': 'sb',
      '+678': 'vu', '+679': 'fj', '+680': 'pw', '+681': 'wf', '+682': 'ck',
      '+683': 'nu', '+685': 'ws', '+686': 'ki', '+687': 'nc', '+688': 'tv',
      '+689': 'pf', '+690': 'tk', '+691': 'fm', '+692': 'mh', '+850': 'kp',
      '+852': 'hk', '+853': 'mo', '+855': 'kh', '+856': 'la', '+880': 'bd',
      '+886': 'tw', '+960': 'mv', '+961': 'lb', '+962': 'jo', '+963': 'sy',
      '+964': 'iq', '+965': 'kw', '+966': 'sa', '+967': 'ye', '+968': 'om',
      '+970': 'ps', '+971': 'ae', '+972': 'il', '+973': 'bh', '+974': 'qa',
      '+975': 'bt', '+976': 'mn', '+977': 'np', '+992': 'tj', '+993': 'tm',
      '+994': 'az', '+995': 'ge', '+996': 'kg', '+998': 'uz'
    };
    return flagMap[code] || 'in';
  }

  onMobileCountryCodeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCountryCode = select.value;
  }

  swapMobileLocations(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.mobileTab === 'shared') {
      this.swapCabLocations('shared');
    } else if (this.mobileTab === 'reserved') {
      this.swapCabLocations('reserved');
    } else if (this.mobileTab === 'flights') {
      if (this.flightRoutes.length > 0) {
        this.swapFlightLocations(0);
      }
    }
  }

  private getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  // TrackBy function for better performance
  trackByTestimonial(index: number, testimonial: Testimonial): number {
    return testimonial.id;
  }

  // Read More/Less functionality for mobile testimonials
  isTestimonialExpanded(testimonialId: number): boolean {
    return this.expandedTestimonials.has(testimonialId);
  }

  toggleTestimonial(testimonialId: number): void {
    if (this.expandedTestimonials.has(testimonialId)) {
      this.expandedTestimonials.delete(testimonialId);
    } else {
      this.expandedTestimonials.add(testimonialId);
    }
  }

  shouldShowReadMore(text: string): boolean {
    // Show read more if text is longer than approximately 150 characters (roughly 5 lines)
    return !!(text && text.length > 150);
  }

  getTruncatedText(text: string): string {
    if (!text || text.length <= 150) {
      return text;
    }
    return text.substring(0, 150) + '...';
  }

  get infiniteOffers() {
    return [...this.specialOffers, ...this.specialOffers, ...this.specialOffers];
  }

  trackByOfferId(index: number, offer: any): number {
    return offer.id;
  }
  // Duplicate services for infinite loop
  get infiniteServices() {
    return [...this.services, ...this.services, ...this.services];
  }
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription = new Subscription();

  // Tabs & State
  currentTab = 'shared-cabs';
  previousTab: string | null = null;
  isSliding = false;
  slideDirection: 'left' | 'right' = 'right'; // Track slide direction

  // Flight-specific
  selectedClass = 'economy';
  tripType = 'one-way'; // 'one-way', 'round-trip', 'multi-city'
  fareType: 'regular' | 'student' | 'senior' | 'armed' | 'doctor' = 'regular';
  counts: TravelerCounts = { adults: 1, children: 0, infants: 0 };
  flightRoutes: {
    from: string;
    to: string;
    date: string;
  }[] = [
      {
        from: '',
        to: '',
        date: ''
      }
    ];

  // TBO Token and IP for flight booking
  tboTokenId: string | null = null;
  ip: string = '';
  loader: boolean = true;

  // Calendar fare fetched flags
  calendarFareFetched = false;
  fullYearCalendarFare: any[] = [];

  // Selected flight airports
  selectedFromAirport: any = null;
  selectedToAirport: any = null;

  // Selected flight airports as objects (matching working code)
  selectedFrom: any = null;
  selectedTo: any = null;

  // Popups
  isTravelersOpen = false;
  showPhonePopup = false;
  phoneNumber = '';
  phoneError = '';
  popupTitle = '';
  pendingAction: 'flights' | 'shared' | 'reserved' | null = null;
  selectedCountryCode = '+91';
  countryList = [
    { code: '+1', name: 'United States' },
    { code: '+1', name: 'Canada' },
    { code: '+7', name: 'Russia' },
    { code: '+20', name: 'Egypt' },
    { code: '+27', name: 'South Africa' },
    { code: '+30', name: 'Greece' },
    { code: '+31', name: 'Netherlands' },
    { code: '+32', name: 'Belgium' },
    { code: '+33', name: 'France' },
    { code: '+34', name: 'Spain' },
    { code: '+36', name: 'Hungary' },
    { code: '+39', name: 'Italy' },
    { code: '+40', name: 'Romania' },
    { code: '+41', name: 'Switzerland' },
    { code: '+43', name: 'Austria' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+45', name: 'Denmark' },
    { code: '+46', name: 'Sweden' },
    { code: '+47', name: 'Norway' },
    { code: '+48', name: 'Poland' },
    { code: '+49', name: 'Germany' },
    { code: '+51', name: 'Peru' },
    { code: '+52', name: 'Mexico' },
    { code: '+53', name: 'Cuba' },
    { code: '+54', name: 'Argentina' },
    { code: '+55', name: 'Brazil' },
    { code: '+56', name: 'Chile' },
    { code: '+57', name: 'Colombia' },
    { code: '+58', name: 'Venezuela' },
    { code: '+60', name: 'Malaysia' },
    { code: '+61', name: 'Australia' },
    { code: '+62', name: 'Indonesia' },
    { code: '+63', name: 'Philippines' },
    { code: '+64', name: 'New Zealand' },
    { code: '+65', name: 'Singapore' },
    { code: '+66', name: 'Thailand' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+84', name: 'Vietnam' },
    { code: '+86', name: 'China' },
    { code: '+90', name: 'Turkey' },
    { code: '+91', name: 'India' },
    { code: '+92', name: 'Pakistan' },
    { code: '+93', name: 'Afghanistan' },
    { code: '+94', name: 'Sri Lanka' },
    { code: '+95', name: 'Myanmar' },
    { code: '+98', name: 'Iran' },
    { code: '+212', name: 'Morocco' },
    { code: '+213', name: 'Algeria' },
    { code: '+216', name: 'Tunisia' },
    { code: '+218', name: 'Libya' },
    { code: '+220', name: 'Gambia' },
    { code: '+221', name: 'Senegal' },
    { code: '+222', name: 'Mauritania' },
    { code: '+223', name: 'Mali' },
    { code: '+224', name: 'Guinea' },
    { code: '+225', name: 'Ivory Coast' },
    { code: '+226', name: 'Burkina Faso' },
    { code: '+227', name: 'Niger' },
    { code: '+228', name: 'Togo' },
    { code: '+229', name: 'Benin' },
    { code: '+230', name: 'Mauritius' },
    { code: '+231', name: 'Liberia' },
    { code: '+232', name: 'Sierra Leone' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    { code: '+235', name: 'Chad' },
    { code: '+236', name: 'Central African Republic' },
    { code: '+237', name: 'Cameroon' },
    { code: '+238', name: 'Cape Verde' },
    { code: '+239', name: 'São Tomé and Príncipe' },
    { code: '+240', name: 'Equatorial Guinea' },
    { code: '+241', name: 'Gabon' },
    { code: '+242', name: 'Republic of the Congo' },
    { code: '+243', name: 'Democratic Republic of the Congo' },
    { code: '+244', name: 'Angola' },
    { code: '+245', name: 'Guinea-Bissau' },
    { code: '+246', name: 'British Indian Ocean Territory' },
    { code: '+248', name: 'Seychelles' },
    { code: '+249', name: 'Sudan' },
    { code: '+250', name: 'Rwanda' },
    { code: '+251', name: 'Ethiopia' },
    { code: '+252', name: 'Somalia' },
    { code: '+253', name: 'Djibouti' },
    { code: '+254', name: 'Kenya' },
    { code: '+255', name: 'Tanzania' },
    { code: '+256', name: 'Uganda' },
    { code: '+257', name: 'Burundi' },
    { code: '+258', name: 'Mozambique' },
    { code: '+260', name: 'Zambia' },
    { code: '+261', name: 'Madagascar' },
    { code: '+262', name: 'Réunion' },
    { code: '+263', name: 'Zimbabwe' },
    { code: '+264', name: 'Namibia' },
    { code: '+265', name: 'Malawi' },
    { code: '+266', name: 'Lesotho' },
    { code: '+267', name: 'Botswana' },
    { code: '+268', name: 'Eswatini' },
    { code: '+269', name: 'Comoros' },
    { code: '+290', name: 'Saint Helena' },
    { code: '+291', name: 'Eritrea' },
    { code: '+297', name: 'Aruba' },
    { code: '+298', name: 'Faroe Islands' },
    { code: '+299', name: 'Greenland' },
    { code: '+350', name: 'Gibraltar' },
    { code: '+351', name: 'Portugal' },
    { code: '+352', name: 'Luxembourg' },
    { code: '+353', name: 'Ireland' },
    { code: '+354', name: 'Iceland' },
    { code: '+355', name: 'Albania' },
    { code: '+356', name: 'Malta' },
    { code: '+357', name: 'Cyprus' },
    { code: '+358', name: 'Finland' },
    { code: '+359', name: 'Bulgaria' },
    { code: '+370', name: 'Lithuania' },
    { code: '+371', name: 'Latvia' },
    { code: '+372', name: 'Estonia' },
    { code: '+373', name: 'Moldova' },
    { code: '+374', name: 'Armenia' },
    { code: '+375', name: 'Belarus' },
    { code: '+376', name: 'Andorra' },
    { code: '+377', name: 'Monaco' },
    { code: '+378', name: 'San Marino' },
    { code: '+380', name: 'Ukraine' },
    { code: '+381', name: 'Serbia' },
    { code: '+382', name: 'Montenegro' },
    { code: '+383', name: 'Kosovo' },
    { code: '+385', name: 'Croatia' },
    { code: '+386', name: 'Slovenia' },
    { code: '+387', name: 'Bosnia and Herzegovina' },
    { code: '+389', name: 'North Macedonia' },
    { code: '+420', name: 'Czech Republic' },
    { code: '+421', name: 'Slovakia' },
    { code: '+423', name: 'Liechtenstein' },
    { code: '+500', name: 'Falkland Islands' },
    { code: '+501', name: 'Belize' },
    { code: '+502', name: 'Guatemala' },
    { code: '+503', name: 'El Salvador' },
    { code: '+504', name: 'Honduras' },
    { code: '+505', name: 'Nicaragua' },
    { code: '+506', name: 'Costa Rica' },
    { code: '+507', name: 'Panama' },
    { code: '+508', name: 'Saint Pierre and Miquelon' },
    { code: '+509', name: 'Haiti' },
    { code: '+590', name: 'Guadeloupe' },
    { code: '+591', name: 'Bolivia' },
    { code: '+592', name: 'Guyana' },
    { code: '+593', name: 'Ecuador' },
    { code: '+594', name: 'French Guiana' },
    { code: '+595', name: 'Paraguay' },
    { code: '+596', name: 'Martinique' },
    { code: '+597', name: 'Suriname' },
    { code: '+598', name: 'Uruguay' },
    { code: '+599', name: 'Netherlands Antilles' },
    { code: '+670', name: 'East Timor' },
    { code: '+672', name: 'Antarctica' },
    { code: '+673', name: 'Brunei' },
    { code: '+674', name: 'Nauru' },
    { code: '+675', name: 'Papua New Guinea' },
    { code: '+676', name: 'Tonga' },
    { code: '+677', name: 'Solomon Islands' },
    { code: '+678', name: 'Vanuatu' },
    { code: '+679', name: 'Fiji' },
    { code: '+680', name: 'Palau' },
    { code: '+681', name: 'Wallis and Futuna' },
    { code: '+682', name: 'Cook Islands' },
    { code: '+683', name: 'Niue' },
    { code: '+684', name: 'American Samoa' },
    { code: '+685', name: 'Samoa' },
    { code: '+686', name: 'Kiribati' },
    { code: '+687', name: 'New Caledonia' },
    { code: '+688', name: 'Tuvalu' },
    { code: '+689', name: 'French Polynesia' },
    { code: '+690', name: 'Tokelau' },
    { code: '+691', name: 'Micronesia' },
    { code: '+692', name: 'Marshall Islands' },
    { code: '+850', name: 'North Korea' },
    { code: '+852', name: 'Hong Kong' },
    { code: '+853', name: 'Macau' },
    { code: '+855', name: 'Cambodia' },
    { code: '+856', name: 'Laos' },
    { code: '+880', name: 'Bangladesh' },
    { code: '+886', name: 'Taiwan' },
    { code: '+960', name: 'Maldives' },
    { code: '+961', name: 'Lebanon' },
    { code: '+962', name: 'Jordan' },
    { code: '+963', name: 'Syria' },
    { code: '+964', name: 'Iraq' },
    { code: '+965', name: 'Kuwait' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+967', name: 'Yemen' },
    { code: '+968', name: 'Oman' },
    { code: '+970', name: 'Palestine' },
    { code: '+971', name: 'United Arab Emirates' },
    { code: '+972', name: 'Israel' },
    { code: '+973', name: 'Bahrain' },
    { code: '+974', name: 'Qatar' },
    { code: '+975', name: 'Bhutan' },
    { code: '+976', name: 'Mongolia' },
    { code: '+977', name: 'Nepal' },
    { code: '+992', name: 'Tajikistan' },
    { code: '+993', name: 'Turkmenistan' },
    { code: '+994', name: 'Azerbaijan' },
    { code: '+995', name: 'Georgia' },
    { code: '+996', name: 'Kyrgyzstan' },
    { code: '+998', name: 'Uzbekistan' }
  ];

  // Selected cities
  selectedCities: SelectedCities = {
    shared: { pickup: '', dropoff: '' },
    reserved: { pickup: '', dropoff: '' },
    flights: { from: 'Chandigarh', to: 'Bagdogra' },
  };

  // Track selected reserved city codes separately for mobile API usage
  selectedReservedCodes = { pickup: '', dropoff: '' };

  // Source cities from API for shared cabs
  sourceCities: City[] = [];

  // Reserved cities from API for reserved cabs
  reservedCities: City[] = [];

  // Flight airports from API
  flightAirports: City[] = [];

  // Geo helpers for airport sorting
  userLocation: { lat: number; lng: number } | null = null;
  geolocationRequested = false;

  // API response locations for shared cabs
  sharedPickupLocations: string[] = [];
  sharedDropoffLocations: string[] = [];

  // Cities & Locations
  cities: City[] = [
    { name: 'Delhi', code: 'DEL', state: 'Delhi' },
    { name: 'Mumbai', code: 'BOM', state: 'Maharashtra' },
    { name: 'Bangalore', code: 'BLR', state: 'Karnataka' },
    { name: 'Chennai', code: 'MAA', state: 'Tamil Nadu' },
    { name: 'Kolkata', code: 'CCU', state: 'West Bengal' },
    { name: 'Hyderabad', code: 'HYD', state: 'Telangana' },
    { name: 'Pune', code: 'PNQ', state: 'Maharashtra' },
    { name: 'Ahmedabad', code: 'AMD', state: 'Gujarat' },
    { name: 'Jaipur', code: 'JAI', state: 'Rajasthan' },
    { name: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh' },
    { name: 'Chandigarh', code: 'IXC', state: 'Punjab' },
    { name: 'Goa', code: 'GOI', state: 'Goa' },
    { name: 'Kochi', code: 'COK', state: 'Kerala' },
    { name: 'Indore', code: 'IDR', state: 'Madhya Pradesh' },
    { name: 'Bhopal', code: 'BHO', state: 'Madhya Pradesh' },
    { name: 'Nagpur', code: 'NAG', state: 'Maharashtra' },
    { name: 'Vadodara', code: 'BDQ', state: 'Gujarat' },
    { name: 'Coimbatore', code: 'CJB', state: 'Tamil Nadu' },
    { name: 'Madurai', code: 'IXM', state: 'Tamil Nadu' },
    { name: 'Thiruvananthapuram', code: 'TRV', state: 'Kerala' },
    { name: 'Bagdogra', code: 'IXB', state: 'West Bengal' },
    { name: 'Guwahati', code: 'GAU', state: 'Assam' },
    { name: 'Bhubaneswar', code: 'BBI', state: 'Odisha' },
    { name: 'Ranchi', code: 'IXR', state: 'Jharkhand' },
    { name: 'Patna', code: 'PAT', state: 'Bihar' },
  ];

  locations: { [key: string]: string[] } = {
    Delhi: [
      'Connaught Place',
      'India Gate',
      'Red Fort',
      'Chandni Chowk',
      'Airport Terminal 1',
      'Airport Terminal 2',
      'Karol Bagh',
      'Paharganj',
      'New Delhi Railway Station',
    ],
    Mumbai: [
      'Gateway of India',
      'Marine Drive',
      'Bandra-Kurla Complex',
      'Andheri East',
      'Chhatrapati Shivaji Airport',
      'CST Station',
      'Powai',
      'Malad',
      'Juhu Beach',
    ],
    Bangalore: [
      'MG Road',
      'Brigade Road',
      'Electronic City',
      'Whitefield',
      'Koramangala',
      'Indiranagar',
      'Kempegowda International Airport',
      'Silk Board',
      'HSR Layout',
    ],
    Chennai: [
      'Marina Beach',
      'T. Nagar',
      'Anna Nagar',
      'Velachery',
      'OMR',
      'Chennai Airport',
      'Central Railway Station',
      'Adyar',
      'Mylapore',
    ],
    Kolkata: [
      'Park Street',
      'Howrah Station',
      'Salt Lake',
      'Esplanade',
      'Netaji Subhash Airport',
      'Sealdah Station',
      'New Market',
      'Dalhousie',
      'Gariahat',
    ],
    Chandigarh: [
      'Sector 17',
      'Sector 22',
      'Railway Station',
      'ISBT',
      'Rock Garden',
      'Sukhna Lake',
      'PGI',
      'Sector 35',
      'Elante Mall',
    ],
    Bagdogra: [
      'Bagdogra Airport',
      'Siliguri Junction',
      'Matigara',
      'Hill Cart Road',
      'New Jalpaiguri',
      'Sevoke Road',
      'City Centre',
      'Station Feeder Road',
    ],
  };

  // Suggestions & UI state
  activeSuggestions: { [key: string]: City[] | string[] } = {};
  locationDetailsVisible: { [key: string]: boolean } = {};
  returnDateError: string = '';

  // Form values
  formValues = {
    flightFrom: '',
    flightTo: '',
    flightDeparture: '',
    flightReturn: '',
    sharedPickup: '',
    sharedDropoff: '',
    sharedDateTime: '',
    sharedPassengers: 1,
    sharedPickupLocation: '',
    sharedDropoffLocation: '',
    reservedPickup: '',
    reservedDropoff: '',
    reservedDate: '',
    reservedTime: '',
    reservedPassengers: 1,
    reservedPickupLocation: '',
    reservedDropoffLocation: '',
  };

  tabs = ['shared-cabs', 'reserved-cabs', 'flights'];
  // showMobileBottomNav = true;
  lastScrollTop = 0;

  // Validation methods
  isSameCitySelected(pickup: string, dropoff: string): boolean {
    if (!pickup || !dropoff) return false;

    // Extract city names from display format (handle "Delhi (DEL)" format)
    const pickupCity = this.extractCityNameFromDisplay(pickup).toLowerCase();
    const dropoffCity = this.extractCityNameFromDisplay(dropoff).toLowerCase();

    return pickupCity === dropoffCity;
  }

  getValidationMessage(pickup: string, dropoff: string): string {
    if (this.isSameCitySelected(pickup, dropoff)) {
      return 'From and To cities cannot be the same';
    }
    return '';
  }

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private seoService: SeoService,
    private wordpressService: WordpressService,
    private apiService: ApiserviceService,
    public flightDataService: FlightdataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Check route data for tab parameter
    this.subscriptions.add(
      this.route.data.subscribe(data => {
        if (data['tab']) {
          this.mobileTab = data['tab'];

          // Sync desktop tab based on route data
          let targetDesktopTab = '';
          if (data['tab'] === 'shared') targetDesktopTab = 'shared-cabs';
          else if (data['tab'] === 'reserved') targetDesktopTab = 'reserved-cabs';
          else if (data['tab'] === 'flights') targetDesktopTab = 'flights';

          if (targetDesktopTab && this.currentTab !== targetDesktopTab && !this.isSliding) {
            this.currentTab = targetDesktopTab;
            this.loadOffers(targetDesktopTab);
          }
        }
      })
    );

    // Set canonical URL using SEO service
    this.seoService.setCanonicalURL('https://wizzride.com/');

    // Set page title
    this.titleService.setTitle('Wizzride | Cab Booking from Shillong, Darjeeling, Gangtok');

    // Fetch TBO Token for flight booking
    if (isPlatformBrowser(this.platformId)) {

      // 1. Fetch TBO Token (Browser Only)
      this.subscriptions.add(
        this.apiService.getTboToken().subscribe((val: any) => {
          // console.log('TBo Token', val);
          if (val) {
            this.loader = false;
            this.tboTokenId = val['TokenId'];
          } else {
            this.loader = true;
          }
        })
      );

      this.subscriptions.add(
        this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe((res) => {
          this.ip = res.ip;
          // console.log('nIp', this.ip);
        })
      );
    }

    // Fetch IP address


    // Fetch source cities for shared cabs
    this.apiService.getSource().subscribe({
      next: (data) => {
        // console.log('data received in HomeComponent:', data);
        // Transform API data to City[] format for shared cabs
        if (Array.isArray(data)) {
          this.sourceCities = data.map((item: SourceValue | string) => {
            const name = typeof item === 'string' ? item : item.name;
            const id = typeof item === 'string' ? '' : item.id;
            return {
              name: name,
              code: id || name.substring(0, 3).toUpperCase(),
              state: this.getActualCityState(name)
            };
          });
          // console.log('Source cities populated:', this.sourceCities);
        }
      },
      error: (error) => {
        // console.error('Error fetching source data:', error);
      }
    });

    // Fetch cities for reserved cabs (same API for source and destination)
    this.apiService.getSourceDestinationFb().subscribe({
      next: (data) => {
        // console.log('Reserved cities data received:', data);
        // Transform API data to City[] format for reserved cabs
        // API returns array with objects containing LOCATIONCODE and LOCATION
        if (Array.isArray(data)) {
          this.reservedCities = data.map((item: any) => {
            const name = item.LOCATION || item.location || '';
            const code = item.LOCATIONCODE || item.locationcode || '';
            return {
              name: name,
              code: code || name.substring(0, 3).toUpperCase(),
              state: this.getCityState(name)
            };
          });
          // console.log('Reserved cities populated:', this.reservedCities);
        }
      },
      error: (error) => {
        // console.error('Error fetching reserved cities data:', error);
      }
    });

    // Kick off geolocation early (browser only) so we can sort airports once list arrives
    this.requestUserLocationForAirports();

    // Fetch airports for flight booking
    this.apiService.getFullAiportList().subscribe({
      next: (data) => {
        // console.log('Airport list data received:', data);
        // Transform API data to City[] format for flights
        // API returns array with objects containing AIRPORTCODE, NAME, CITY, CITYCODE, COUNTRY, COUNTRYCODE
        if (Array.isArray(data)) {
          // Map airports to City[] format
          const allAirports = data.map((item: any) => {
            // Use CITY if available, otherwise use NAME as city name
            const cityName = item.CITY || item.city || item.NAME || item.name || '';
            const airportCode = item.AIRPORTCODE || item.airportcode || item.CITYCODE || item.citycode || '';
            const country = item.COUNTRY || item.country || '';
            const airportName = item.NAME || item.name || '';
            const countryCode = item.COUNTRYCODE || item.countrycode || '';
            const coords = this.extractAirportCoordinates(item);

            // Use just the city name for display
            const displayName = cityName || item.NAME || item.name || '';

            // Try to get state from city name first, fallback to country
            const cityState = this.getCityState(displayName);
            return {
              name: displayName,
              code: airportCode || displayName.substring(0, 3).toUpperCase(),
              state: cityState !== 'Other' ? cityState : (country || 'Other'), // Use city state mapping, fallback to country
              countryCode: countryCode, // Store country code for sorting
              country: country, // Store country name
              airportName: airportName, // Store airport name (e.g., "Lokpriya Gopinath Bordoloi International")
              lat: coords.lat,
              lng: coords.lng
            };
          });

          // Sort: Indian airports first (COUNTRYCODE === 'IN'), then others, both sorted alphabetically by city name
          const indianAirports = allAirports
            .filter(airport => (airport as any).countryCode === 'IN')
            .sort((a, b) => a.name.localeCompare(b.name));

          const otherAirports = allAirports
            .filter(airport => (airport as any).countryCode !== 'IN')
            .sort((a, b) => a.name.localeCompare(b.name));

          // Combine: Indian airports first, then others
          this.flightAirports = [...indianAirports, ...otherAirports];
          // Reorder by proximity if we already have the user location
          this.sortAirportsByDistance();
          // Or request geolocation now if not available yet
          this.requestUserLocationForAirports();
          // console.log('Flight airports populated:', this.flightAirports);

          // Set dynamic default airports (only on desktop, not mobile)
          if (!this.isMobileView()) {
            this.setDefaultAirports();
          } else {
            // On mobile, ensure flight fields are empty (no defaults)
            if (this.flightRoutes.length > 0) {
              this.flightRoutes[0].from = '';
              this.flightRoutes[0].to = '';
            }
            this.formValues.flightFrom = '';
            this.formValues.flightTo = '';
          }
        }
      },
      error: (error) => {
        // console.error('Error fetching airport data:', error);
      }
    });

    // Fetch state-wise cities with popularity
    // console.log('=== FETCHING STATE-WISE CITIES API ===');
    this.apiService.getstatewisecitywithpopularity().subscribe((data: any) => {
      // console.log('=== API RESPONSE RECEIVED ===');
      // console.log('Raw API Response:', data);
      // console.log('Response Type:', typeof data);
      // console.log('Is Array:', Array.isArray(data));
      // console.log('Response Keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');

      // API returns array of state objects directly: [{state: "Sikkim", cities: [{city: "Gangtok", popular: true}, ...]}, ...]
      let locations: StateWiseCity[] = [];
      if (Array.isArray(data)) {
        // console.log('API returned array directly, length:', data.length);
        // API returns array directly - each element is {state: string, cities: Array}
        locations = data;
        if (data.length > 0) {
          // console.log('First state sample:', JSON.stringify(data[0], null, 2));
        }
      } else if (data && data.locations && Array.isArray(data.locations)) {
        // console.log('API returned object with locations property, length:', data.locations.length);
        // If API returns object with locations property
        locations = data.locations;
        if (data.locations.length > 0) {
          // console.log('First state sample:', JSON.stringify(data.locations[0], null, 2));
        }
      } else if (data && typeof data === 'object') {
        // console.log('API returned single object, wrapping in array');
        // If single object, wrap in array
        locations = [data];
        // console.log('State sample:', JSON.stringify(data, null, 2));
      } else {
        // console.warn('Unexpected API response format:', data);
      }

      // console.log('Processed locations count:', locations.length);

      if (locations.length > 0) {
        this.stateWiseCities = locations;
        this.stateWiseCitiesLoaded = true;
        // console.log('=== STATE-WISE CITIES POPULATED ===');
        // console.log('Total states:', this.stateWiseCities.length);
        // console.log('Full state-wise cities data:', JSON.stringify(this.stateWiseCities, null, 2));

        this.stateWiseCities.forEach((state, index) => {
          const popularCount = state.cities.filter(c => {
            if (c.popular === true) return true;
            if (typeof c.popular === 'string' && c.popular.toLowerCase() === 'true') return true;
            if (c.popular === 1) return true;
            return false;
          }).length;
          // console.log(`State ${index + 1}: ${state.state}`);
          // console.log(`  - Total Cities: ${state.cities.length}`);
          // console.log(`  - Popular Cities: ${popularCount}`);
          // console.log(`  - Non-Popular Cities: ${state.cities.length - popularCount}`);
          // console.log(`  - Sample cities:`, state.cities.slice(0, 5).map(c => ({ 
          //   name: c.city, 
          //   popular: c.popular, 
          //   popularType: typeof c.popular 
          // })));
        });

        // Update sourceCities with actual state information if they were already loaded
        if (this.sourceCities && this.sourceCities.length > 0) {
          this.sourceCities = this.sourceCities.map(city => ({
            ...city,
            state: this.getActualCityState(city.name)
          }));
          // console.log('Source cities updated with actual state information');
        }
      } else {
        // console.warn('=== NO STATE-WISE CITIES DATA ===');
        // console.warn('No state-wise cities data received from API');
        // console.warn('Raw data was:', data);
      }
    }, (error) => {
      // console.error('=== API ERROR ===');
      // console.error('Error fetching state-wise cities data:', error);
      // console.error('Error details:', JSON.stringify(error, null, 2));
      this.stateWiseCitiesLoaded = false;
    });

    // Meta Description
    this.metaService.updateTag({ name: 'description', content: 'Book shared cabs from Bagdogra & Guwahati Airports to Darjeeling, Gangtok, Kalimpong & Shillong. Affordable rates, 24/7 service, and safe rides across Northeast India..' });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride | Cab Booking from Shillong, Darjeeling, Gangtok' });
    this.metaService.updateTag({ property: 'og:description', content: 'Book shared cabs from Bagdogra & Guwahati Airports to Darjeeling, Gangtok,Kalimpong & Shillong. Affordable rates, 24/7 service, and safe rides across Northeast India.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride | Cab Booking from Shillong, Darjeeling, Gangtok' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Book shared cabs from Bagdogra & Guwahati Airports to Darjeeling, Gangtok, Kalimpong & Shillong. Affordable rates, 24/7 service, and safe rides across Northeast India.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // Breadcrumb Schema (JSON-LD)
    this.insertJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.wizzride.com/"
        }
      ]
    }, 'home-breadcrumb-schema');

    // Organization Schema (JSON-LD)
    this.insertJsonLd({
      "@context": "https://schema.org",
      "@type": [
        "Organization",
        "LocalBusiness",
        "TravelAgency"
      ],
      "name": "Wizzride Technologies Pvt Ltd",
      "alternateName": "Wizzride",
      "url": "https://www.wizzride.com",
      "logo": "https://www.wizzride.com/assets/images/icons/logo2.webp",
      "description": "Book Wizzride online cab services for Bagdogra to Darjeeling, Gangtok, Kalimpong, NJP, Guwahati & Shillong. Safe, affordable rides in Northeast.",
      "foundingDate": "2017",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917478493874",
        "contactType": "reservations",
        "areaServed": "IN",
        "availableLanguage": [
          "en",
          "Hindi"
        ]
      },
      "sameAs": [
        "https://www.facebook.com/wizzride",
        "https://www.instagram.com/wizzride",
        "https://www.linkedin.com/company/in/wizzride-technologies-private-limited-33b0871a0/",
        "https://twitter.com/wizzride"
      ],
      "openingHours": "Mo-Su 04:00-21:00",
      "areaServed": [
        "Assam",
        "Meghalaya",
        "Sikkim",
        "West Bengal"
      ],
      "paymentAccepted": [
        "Cash",
        "Credit Card",
        "UPI"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "2411"
      }
    }, 'home-org-schema');

    // Load offers for current tab
    this.loadOffers(this.currentTab);

    // Load Google reviews
    this.loadGoogleReviews();

    // Load home statistics
    this.loadHomeStatistics();

    // Load homepage popup
    this.loadHomepagePopup();
  }

  // Helper method to insert JSON-LD structured data
  private insertJsonLd(schema: any, id: string): void {
    if (!this.document) return;
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      this.renderer2.removeChild(this.document.head, existingScript);
    }
    const script = this.renderer2.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.renderer2.appendChild(this.document.head, script);
  }

  // Helper method to set canonical URL


  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      // Clean up home schemas to prevent duplicates
      this.homeSchemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          script.remove();
        }
      });
    }

    this.destroy$.next();
    this.destroy$.complete();

    // Clean up 3D carousel interval
    this.stopAutoplay();
  }

  ngAfterViewInit(): void {
    // 1. CRITICAL GUARD: This must be the very first line.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 2. Safe DOM operations (Only runs in browser)
    // Make sure you use 'this.document', NOT global 'document'
    const currentIndex = this.tabs.indexOf(this.currentTab);
    const navTabs = this.document.querySelector('.nav-tabs'); // Use this.document

    if (navTabs) {
      navTabs.setAttribute('data-active', currentIndex.toString());
    }

    // 3. Initialize 3D testimonial carousel
    this.init3DTestimonialCarousel();

    // 4. Initialize clock display
    if (this.formValues.reservedTime) {
      this.updateClockDisplay(this.formValues.reservedTime);
    }
  }

  /** -------------------
   * Custom Calendar Event Handlers
   * -------------------- */

  // Shared cab date selection
  onSharedDateSelected(date: string) {
    this.formValues.sharedDateTime = date;
  }

  // Reserved cab date selection
  onReservedDateSelected(date: string) {
    this.formValues.reservedDate = date;
  }

  // Flight departure date selection
  onFlightDepartureDateSelected(date: string, routeIndex?: number) {
    if (routeIndex !== undefined) {
      // Multi-city flight
      this.flightRoutes[routeIndex].date = date;
    } else {
      // Single/round-trip flight
      this.formValues.flightDeparture = date;
      if (this.tripType === 'round-trip') {
        // Clear return date if it's before the new departure date
        if (this.formValues.flightReturn && this.formValues.flightReturn < date) {
          this.formValues.flightReturn = '';
          this.returnDateError = '';
        }
        // Clear any existing error when departure date changes
        this.returnDateError = '';
      }
    }
  }

  // Flight return date selection
  onFlightReturnDateSelected(date: string) {
    // Get the departure date (check both flightRoutes and formValues)
    const departureDate = this.flightRoutes[0]?.date || this.formValues.flightDeparture;

    // Validate that return date is not before departure date
    if (departureDate && date && date < departureDate) {
      this.returnDateError = 'Return date cannot be before departure date.';
      this.formValues.flightReturn = '';
      return;
    }

    // Clear error if validation passes
    this.returnDateError = '';
    this.formValues.flightReturn = date;
  }

  // Get minimum date for return flight picker
  getReturnMinDate(): string {
    // Check both flightRoutes[0].date and formValues.flightDeparture
    const departureDate = this.flightRoutes[0]?.date || this.formValues.flightDeparture;
    return departureDate || this.getTodayDate();
  }

  // Get today's date in YYYY-MM-DD format
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Format any date to YYYY-MM-DD format
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /** -------------------
   * Tab Handling
   * -------------------- */
  switchTab(tabName: string) {
    if (tabName !== this.currentTab && !this.isSliding) {
      this.previousTab = this.currentTab;
      this.isSliding = true;

      // Update URL to match tab
      const urlMap: { [key: string]: string } = {
        'shared-cabs': '/shared',
        'reserved-cabs': '/reserved',
        'flights': '/flight',
      };

      if (urlMap[tabName] && isPlatformBrowser(this.platformId)) {
        this.router.navigate([urlMap[tabName]], { replaceUrl: true });
      }

      // Determine slide direction based on tab indices
      const currentIndex = this.tabs.indexOf(this.currentTab);
      const newIndex = this.tabs.indexOf(tabName);
      this.slideDirection = newIndex > currentIndex ? 'right' : 'left';

      // Update nav tabs active state immediately for smooth color transition
      if (isPlatformBrowser(this.platformId)) {
        const navTabs = this.document.querySelector('.nav-tabs');
        if (navTabs) {
          navTabs.setAttribute('data-active', newIndex.toString());
        }
      }

      setTimeout(() => {
        this.currentTab = tabName;
        // Load offers for the new tab
        this.loadOffers(tabName);
        setTimeout(() => {
          this.previousTab = null;
          this.isSliding = false;
        }, 1000);
      }, 0);
    }
  }
  setTripType(type: string) {
    this.tripType = type;

    // Clear return date error when trip type changes
    this.returnDateError = '';

    // Reset routes based on trip type
    if (type === 'multi-city') {
      this.flightRoutes = [
        {
          from: '',
          to: '',
          date: ''
        },
        {
          from: '',
          to: '',
          date: ''
        }
      ];
    } else {
      this.flightRoutes = [
        {
          from: '',
          to: '',
          date: ''
        }
      ];
    }

    setTimeout(() => {
      // Trip type changed - no need to re-initialize datepickers
    }, 0);
  }

  setFareType(type: 'regular' | 'student' | 'senior' | 'armed' | 'doctor') {
    this.fareType = type;
  }

  /** -------------------
   * Phone modal handling
   * -------------------- */
  openPhonePopup(action: 'flights' | 'shared' | 'reserved') {
    this.pendingAction = action;
    this.popupTitle =
      action === 'flights'
        ? 'Enter your phone number to search flights'
        : action === 'shared'
          ? 'Enter your phone number to search shared cabs'
          : 'Enter your phone number to search reserved cabs';
    this.showPhonePopup = true;

    // Scroll to top to ensure modal is visible
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  cancelPhonePopup() {
    this.showPhonePopup = false;
    this.phoneNumber = '';
    this.phoneError = '';
    this.pendingAction = null;
  }

  onModalBackdropClick(event: Event) {
    // Close modal when clicking on backdrop
    if (event.target === event.currentTarget) {
      this.cancelPhonePopup();
    }
  }

  navigateToResults(phoneNumber: string) {
    if (!this.pendingAction) {
      // console.log('No pending action, cannot navigate');
      return;
    }

    const searchParams: any = {
      from: this.getCurrentFromLocation(),
      to: this.getCurrentToLocation(),
      date: this.getCurrentDate(),
      passengers: this.getCurrentPassengers(),
      type: this.pendingAction,
      phoneNumber: phoneNumber,
      pickupLocation: this.getCurrentPickupLocation(),
      dropLocation: this.getCurrentDropLocation(),
      pickupTime: this.getCurrentPickupTime()
    };

    // Add location codes for reserved cabs
    if (this.pendingAction === 'reserved') {
      const source = this.selectedCities.reserved.pickup || '';
      const destination = this.selectedCities.reserved.dropoff || '';
      searchParams.fromlocid = this.getReservedCityCode(source);
      searchParams.tolocid = this.getReservedCityCode(destination);
    }

    // console.log('Navigating to booking results with params:', searchParams);
    // console.log('Router available:', !!this.router);

    if (!isPlatformBrowser(this.platformId)) return;
    try {
      // Store search params in localStorage as fallback
      localStorage.setItem('bookingSearchParams', JSON.stringify(searchParams));

      // Try router navigation first
      // console.log('Attempting router navigation...');
      this.router.navigate(['/booking-results'], { state: { searchParams } }).then(success => {
        // console.log('Router navigation success:', success);
        if (!success) {
          // console.log('Router navigation failed, trying window.location...');
          // Fallback to window.location
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = '/booking-results';
          }
        }
      }).catch(error => {
        // console.error('Router navigation error:', error);
        // console.log('Falling back to window.location...');
        // Fallback to window.location
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = '/booking-results';
        }
      });
    } catch (error) {
      // console.error('Error during navigation:', error);
      // Final fallback
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = '/booking-results';
      }
    }
  }

  private getCurrentFromLocation(): string {
    if (this.pendingAction === 'flights') {
      return this.selectedCities.flights.from || 'Delhi';
    } else if (this.pendingAction === 'shared') {
      return this.selectedCities.shared.pickup || 'Delhi';
    } else {
      return this.selectedCities.reserved.pickup || 'Delhi';
    }
  }

  private getCurrentToLocation(): string {
    if (this.pendingAction === 'flights') {
      return this.selectedCities.flights.to || 'Mumbai';
    } else if (this.pendingAction === 'shared') {
      return this.selectedCities.shared.dropoff || 'Mumbai';
    } else {
      return this.selectedCities.reserved.dropoff || 'Mumbai';
    }
  }

  private getCurrentDate(): string {
    if (this.pendingAction === 'flights') {
      return this.flightRoutes[0]?.date || this.getTodayDate();
    } else if (this.pendingAction === 'shared') {
      return this.formValues.sharedDateTime || this.getTodayDate();
    } else {
      return this.formValues.reservedDate || this.getTodayDate();
    }
  }

  private getCurrentPassengers(): number {
    if (this.pendingAction === 'flights') {
      return this.counts.adults + this.counts.children;
    } else if (this.pendingAction === 'shared') {
      return this.formValues.sharedPassengers || 1;
    } else {
      return this.formValues.reservedPassengers || 1;
    }
  }

  private getCurrentPickupLocation(): string {
    if (this.pendingAction === 'shared') {
      return this.formValues.sharedPickupLocation || '';
    } else if (this.pendingAction === 'reserved') {
      return this.formValues.reservedPickupLocation || '';
    }
    return '';
  }

  private getCurrentDropLocation(): string {
    if (this.pendingAction === 'shared') {
      return this.formValues.sharedDropoffLocation || '';
    } else if (this.pendingAction === 'reserved') {
      return this.formValues.reservedDropoffLocation || '';
    }
    return '';
  }

  private getCurrentPickupTime(): string {
    if (this.pendingAction === 'reserved') {
      return this.formValues.reservedTime || '';
    }
    return '';
  }


  onPhoneInput(event: any) {
    // Clear error when user starts typing
    this.phoneError = '';

    // Remove any non-digit characters
    let value = event.target.value.replace(/\D/g, '');

    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    this.phoneNumber = value;
    event.target.value = value;
  }

  onPhoneKeyPress(event: KeyboardEvent) {
    // Allow only digits
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onPhoneEnter(event: any) {
    // Close mobile keyboard when Enter is pressed
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.keyCode === 13) {
      const target = keyboardEvent.target as HTMLInputElement;
      if (target) {
        target.blur();
      }
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
    }
  }

  // Custom keypad methods
  openCustomKeypad(inputElement: HTMLInputElement, event?: Event): void {
    if (this.isMobileView()) {
      // Prevent native keyboard from opening immediately
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Store cursor position
      this.phoneInputCursorPosition = inputElement.selectionStart || inputElement.value.length;

      // CRITICAL: Use readonly to prevent native keyboard, and create custom cursor
      inputElement.readOnly = true;
      inputElement.setAttribute('readonly', 'readonly');
      inputElement.setAttribute('inputmode', 'none');

      // Create and show custom cursor
      this.createCustomCursor(inputElement);

      // Add event listeners to track cursor position and prevent native keyboard
      // Use arrow functions to maintain 'this' context
      const clickHandler = (e: MouseEvent) => this.onPhoneInputClick(e);
      const keyDownHandler = (e: KeyboardEvent) => this.onPhoneInputKeyDown(e);
      const inputHandler = (e: Event) => this.onPhoneInputInput(e);
      const selectHandler = (e: Event) => this.onPhoneInputSelect(e);
      const focusHandler = (e: FocusEvent) => this.onPhoneInputFocus(e);
      const touchStartHandler = (e: TouchEvent) => this.onPhoneInputTouchStart(e);

      // Store handlers on the element for later removal
      (inputElement as any)._phoneInputClickHandler = clickHandler;
      (inputElement as any)._phoneInputKeyDownHandler = keyDownHandler;
      (inputElement as any)._phoneInputInputHandler = inputHandler;
      (inputElement as any)._phoneInputSelectHandler = selectHandler;
      (inputElement as any)._phoneInputFocusHandler = focusHandler;
      (inputElement as any)._phoneInputTouchStartHandler = touchStartHandler;

      inputElement.addEventListener('click', clickHandler, true);
      inputElement.addEventListener('keydown', keyDownHandler, true);
      inputElement.addEventListener('input', inputHandler, true);
      inputElement.addEventListener('select', selectHandler, true);
      inputElement.addEventListener('focus', focusHandler, true);
      inputElement.addEventListener('touchstart', touchStartHandler, true);

      this.activePhoneInput = inputElement;
      this.showCustomKeypad = true;

      // Focus the input for visual feedback
      inputElement.focus();

      // Update custom cursor position
      this.updateCustomCursorPosition();

      // Scroll immediately - no delay
      this.scrollToInput(inputElement, true);
    }
  }

  // Prevent native keyboard on touchstart (mobile) and handle tap position
  private onPhoneInputTouchStart(event: TouchEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      // CRITICAL: Prevent default to stop native keyboard
      event.preventDefault();
      event.stopPropagation();

      // Calculate cursor position based on touch position
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const touchX = touch.clientX;
        const inputRect = input.getBoundingClientRect();
        const inputStyles = getComputedStyle(input);
        const paddingLeft = parseFloat(inputStyles.paddingLeft) || 0;

        const value = input.value || '';
        const relativeX = touchX - inputRect.left - paddingLeft;

        // Find the best cursor position
        let bestPos = value.length;
        let minDistance = Infinity;

        const tempSpan = this.document.createElement('span');
        tempSpan.style.cssText = `
          position: absolute;
          visibility: hidden;
          white-space: pre;
          font-family: ${inputStyles.fontFamily};
          font-size: ${inputStyles.fontSize};
          font-weight: ${inputStyles.fontWeight};
          letter-spacing: ${inputStyles.letterSpacing};
        `;

        const wrapper = input.closest('.wr-phone-wrapper') || input.parentElement;
        if (wrapper) {
          wrapper.appendChild(tempSpan);

          for (let i = 0; i <= value.length; i++) {
            tempSpan.textContent = value.substring(0, i);
            const textWidth = tempSpan.offsetWidth;
            const distance = Math.abs(textWidth - relativeX);

            if (distance < minDistance) {
              minDistance = distance;
              bestPos = i;
            }
          }

          wrapper.removeChild(tempSpan);
        }

        this.phoneInputCursorPosition = bestPos;
        this.updateCustomCursorPosition();
      }
    }
  }

  // Prevent native keyboard on focus - keep readonly to prevent native cursor
  private onPhoneInputFocus(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      // Ensure readonly is set to prevent native keyboard and cursor
      input.setAttribute('inputmode', 'none');
      input.readOnly = true;
      input.setAttribute('readonly', 'readonly');
      // Update custom cursor position
      this.updateCustomCursorPosition();
    }
  }

  // Track cursor position on input click - immediate update for fast response
  private onPhoneInputClick(event: MouseEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      event.preventDefault();
      event.stopPropagation();

      // Calculate cursor position based on click position accurately
      const clickX = event.clientX;
      const inputRect = input.getBoundingClientRect();
      const inputStyles = getComputedStyle(input);
      const paddingLeft = parseFloat(inputStyles.paddingLeft) || 0;

      // Get the text before cursor to measure width
      const value = input.value || '';
      const relativeX = clickX - inputRect.left - paddingLeft;

      // Binary search or linear search to find the correct position
      let bestPos = value.length;
      let minDistance = Infinity;

      // Create temporary span for measurement
      const tempSpan = this.document.createElement('span');
      tempSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
        font-family: ${inputStyles.fontFamily};
        font-size: ${inputStyles.fontSize};
        font-weight: ${inputStyles.fontWeight};
        letter-spacing: ${inputStyles.letterSpacing};
      `;

      const wrapper = input.closest('.wr-phone-wrapper') || input.parentElement;
      if (wrapper) {
        wrapper.appendChild(tempSpan);

        // Try each position to find the closest match
        for (let i = 0; i <= value.length; i++) {
          tempSpan.textContent = value.substring(0, i);
          const textWidth = tempSpan.offsetWidth;
          const distance = Math.abs(textWidth - relativeX);

          if (distance < minDistance) {
            minDistance = distance;
            bestPos = i;
          }
        }

        wrapper.removeChild(tempSpan);
      }

      this.phoneInputCursorPosition = bestPos;

      // Update custom cursor position
      this.updateCustomCursorPosition();
    }
  }

  // Track cursor position on input - allow native input events for cursor
  private onPhoneInputInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      // Only prevent if it's actual text input (not cursor movement)
      // Allow cursor movement events
      const newValue = input.value;
      const oldValue = this.phoneNumber || '';

      // If value changed and it's not from our keypad, prevent it
      // But allow cursor position updates
      if (newValue !== oldValue && newValue.length > oldValue.length) {
        // This might be native keyboard input - restore old value
        input.value = oldValue;
        this.phoneInputCursorPosition = input.selectionStart || input.value.length;
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Just cursor movement - allow it
        this.phoneInputCursorPosition = input.selectionStart || input.value.length;
      }
    }
  }

  // Track cursor position on selection
  private onPhoneInputSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      this.phoneInputCursorPosition = input.selectionStart || input.value.length;
    }
  }

  // Prevent native keyboard but allow cursor movement
  private onPhoneInputKeyDown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (input && input === this.activePhoneInput) {
      // Allow cursor movement keys and backspace/delete for editing
      const allowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Backspace', 'Delete', 'Tab'];
      if (allowedKeys.includes(event.key)) {
        // Update cursor position immediately - no delay
        this.phoneInputCursorPosition = input.selectionStart || input.value.length;
        // Update model if value changed (backspace/delete) - immediate
        if (event.key === 'Backspace' || event.key === 'Delete') {
          this.phoneNumber = input.value;
          this.cdr.markForCheck();
        }
        return;
      }
      // Prevent all other keys (native keyboard) - but allow numbers from our keypad
      // Numbers typed directly should be blocked, only our keypad should work
      if (event.key.length === 1 && /[0-9]/.test(event.key)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      // Allow other control keys
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      // Block everything else
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Helper method to scroll input into view
  private scrollToInput(inputElement: HTMLInputElement, accountForKeypad: boolean = false): void {
    if (!inputElement || !isPlatformBrowser(this.platformId)) return;

    const inputContainer = inputElement.closest('.wr-field-pill, .wr-phone-wrapper') || inputElement;
    const containerRect = inputContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const keypadHeight = accountForKeypad ? 350 : 0; // Keypad height when shown
    const padding = 20;

    // Calculate target scroll position to center input in visible area
    const inputTop = containerRect.top + window.scrollY;
    const inputHeight = containerRect.height;
    const availableHeight = viewportHeight - keypadHeight - padding;
    const targetScroll = inputTop - (availableHeight / 2) + (inputHeight / 2);

    // Check if input is too close to bottom (where keypad will appear)
    if (accountForKeypad && containerRect.bottom > viewportHeight - keypadHeight) {
      const scrollAmount = containerRect.bottom - (viewportHeight - keypadHeight) + padding;
      window.scrollTo({
        top: window.scrollY + scrollAmount,
        behavior: 'auto' // Instant scroll
      });
    } else {
      // Scroll to center the input
      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'auto' // Instant scroll
      });
    }
  }

  closeCustomKeypad(): void {
    // Remove custom cursor
    this.removeCustomCursor();

    // Clean up cached elements
    if (this.cachedMeasurementSpan && this.cachedMeasurementSpan.parentElement) {
      this.cachedMeasurementSpan.parentElement.removeChild(this.cachedMeasurementSpan);
    }
    this.cachedMeasurementSpan = null;
    this.cachedInputStyles = null;
    this.cachedInputElement = null;

    if (this.activePhoneInput) {
      // Remove event listeners using stored handlers
      const clickHandler = (this.activePhoneInput as any)._phoneInputClickHandler;
      const keyDownHandler = (this.activePhoneInput as any)._phoneInputKeyDownHandler;
      const inputHandler = (this.activePhoneInput as any)._phoneInputInputHandler;
      const selectHandler = (this.activePhoneInput as any)._phoneInputSelectHandler;
      const focusHandler = (this.activePhoneInput as any)._phoneInputFocusHandler;
      const touchStartHandler = (this.activePhoneInput as any)._phoneInputTouchStartHandler;

      if (clickHandler) {
        this.activePhoneInput.removeEventListener('click', clickHandler, true);
        delete (this.activePhoneInput as any)._phoneInputClickHandler;
      }
      if (keyDownHandler) {
        this.activePhoneInput.removeEventListener('keydown', keyDownHandler, true);
        delete (this.activePhoneInput as any)._phoneInputKeyDownHandler;
      }
      if (inputHandler) {
        this.activePhoneInput.removeEventListener('input', inputHandler, true);
        delete (this.activePhoneInput as any)._phoneInputInputHandler;
      }
      if (selectHandler) {
        this.activePhoneInput.removeEventListener('select', selectHandler, true);
        delete (this.activePhoneInput as any)._phoneInputSelectHandler;
      }
      if (focusHandler) {
        this.activePhoneInput.removeEventListener('focus', focusHandler, true);
        delete (this.activePhoneInput as any)._phoneInputFocusHandler;
      }
      if (touchStartHandler) {
        this.activePhoneInput.removeEventListener('touchstart', touchStartHandler, true);
        delete (this.activePhoneInput as any)._phoneInputTouchStartHandler;
      }

      // Restore normal behavior
      this.activePhoneInput.readOnly = false;
      this.activePhoneInput.removeAttribute('inputmode');
      this.activePhoneInput.removeAttribute('readonly');

      this.activePhoneInput.blur();
      this.activePhoneInput = null;
    }
    this.showCustomKeypad = false;
    this.phoneInputCursorPosition = 0;
  }

  // Create custom cursor element
  private createCustomCursor(inputElement: HTMLInputElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove existing cursor if any
    this.removeCustomCursor();

    // Create cursor element
    const cursor = this.document.createElement('span');
    cursor.className = 'custom-phone-cursor';
    cursor.style.cssText = `
      position: absolute;
      width: 2px;
      height: 20px;
      background-color: #0f9d92;
      display: inline-block;
      animation: blink 1s infinite;
      pointer-events: none;
      z-index: 1000;
    `;

    this.customCursorElement = cursor;

    // Add to input wrapper
    const wrapper = inputElement.closest('.wr-phone-wrapper') || inputElement.parentElement;
    if (wrapper) {
      (wrapper as HTMLElement).style.position = 'relative';
      wrapper.appendChild(cursor);
    }

    // Update position
    this.updateCustomCursorPosition();
  }

  // Update custom cursor position
  private updateCustomCursorPosition(): void {
    if (!this.customCursorElement || !this.activePhoneInput || !isPlatformBrowser(this.platformId)) return;

    const input = this.activePhoneInput;
    const cursor = this.customCursorElement;
    const value = input.value || '';
    const cursorPos = this.phoneInputCursorPosition || value.length;

    // Get computed styles for accurate measurement
    const inputStyles = getComputedStyle(input);
    const inputRect = input.getBoundingClientRect();

    // Create a temporary span to measure text width with exact same styling
    const tempSpan = this.document.createElement('span');
    tempSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: pre;
      font-family: ${inputStyles.fontFamily};
      font-size: ${inputStyles.fontSize};
      font-weight: ${inputStyles.fontWeight};
      letter-spacing: ${inputStyles.letterSpacing};
      padding-left: ${inputStyles.paddingLeft};
      padding-right: ${inputStyles.paddingRight};
    `;
    tempSpan.textContent = value.substring(0, cursorPos);

    const wrapper = input.closest('.wr-phone-wrapper') || input.parentElement;
    if (wrapper) {
      const wrapperRect = wrapper.getBoundingClientRect();

      // Measure text width
      wrapper.appendChild(tempSpan);
      const textWidth = tempSpan.offsetWidth;
      wrapper.removeChild(tempSpan);

      // Calculate position relative to input's left edge (not wrapper)
      // Account for input's padding and position within wrapper
      const inputLeftInWrapper = inputRect.left - wrapperRect.left;
      const inputPaddingLeft = parseFloat(inputStyles.paddingLeft) || 0;
      const leftOffset = inputLeftInWrapper + inputPaddingLeft + textWidth;

      // Position cursor
      cursor.style.left = `${leftOffset}px`;
      cursor.style.top = `${inputRect.top - wrapperRect.top + (inputRect.height - 20) / 2}px`;
    }
  }

  // Remove custom cursor
  private removeCustomCursor(): void {
    if (this.customCursorElement && this.customCursorElement.parentElement) {
      this.customCursorElement.parentElement.removeChild(this.customCursorElement);
    }
    this.customCursorElement = null;
  }

  onKeypadNumberClick(number: string): void {
    if (!this.activePhoneInput) return;

    // Haptic feedback - ultra-light vibration (5ms) for instant tactile response
    this.triggerHapticFeedback(5);

    // Get values directly - no function calls for speed
    const currentValue = this.activePhoneInput.value || '';
    const cursorPos = this.phoneInputCursorPosition || currentValue.length;

    // Check maxlength (10 digits for mobile) - fast exit
    if (currentValue.length >= 10) return;

    // Insert number at cursor position - optimized string manipulation
    const newValue = currentValue.slice(0, cursorPos) + number + currentValue.slice(cursorPos);
    const newCursorPos = cursorPos + 1;

    // Batch DOM updates for better performance
    this.activePhoneInput.value = newValue;
    this.phoneNumber = newValue;
    this.phoneInputCursorPosition = newCursorPos;

    // Defer cursor update to next frame for immediate visual feedback
    requestAnimationFrame(() => {
      this.updateCustomCursorPositionFast();
    });
  }

  private lastTouchTime = 0;
  private lastTouchTarget: EventTarget | null = null;
  private touchStartTime = 0;
  private touchStartTarget: EventTarget | null = null;

  // Prevent iOS double-tap zoom on keypad buttons while allowing rapid consecutive taps
  // CSS touch-action: manipulation handles most zoom prevention, these are fallback

  onKeypadBackspace(): void {
    if (!this.activePhoneInput) return;

    // Haptic feedback - slightly stronger for backspace (8ms)
    this.triggerHapticFeedback(8);

    // Get values directly - no function calls for speed
    const currentValue = this.activePhoneInput.value || '';
    const cursorPos = this.phoneInputCursorPosition || currentValue.length;

    // Fast exit if nothing to delete
    if (currentValue.length === 0 || cursorPos === 0) return;

    // Delete character at cursor position - optimized string manipulation
    const newValue = currentValue.slice(0, cursorPos - 1) + currentValue.slice(cursorPos);
    const newCursorPos = cursorPos - 1;

    // Batch DOM updates for better performance
    this.activePhoneInput.value = newValue;
    this.phoneNumber = newValue;
    this.phoneInputCursorPosition = newCursorPos;

    // Defer cursor update to next frame for immediate visual feedback
    requestAnimationFrame(() => {
      this.updateCustomCursorPositionFast();
    });
  }
  private updateCustomCursorPositionFast(): void {
    if (!this.customCursorElement || !this.activePhoneInput || !isPlatformBrowser(this.platformId)) return;

    const input = this.activePhoneInput;
    const cursor = this.customCursorElement;
    const value = input.value || '';
    const cursorPos = this.phoneInputCursorPosition || value.length;

    // Cache computed styles to avoid repeated getComputedStyle calls
    if (!this.cachedInputStyles || this.cachedInputElement !== input) {
      const inputStyles = getComputedStyle(input);
      this.cachedInputStyles = {
        fontFamily: inputStyles.fontFamily,
        fontSize: inputStyles.fontSize,
        fontWeight: inputStyles.fontWeight,
        letterSpacing: inputStyles.letterSpacing,
        paddingLeft: parseFloat(inputStyles.paddingLeft) || 0
      };
      this.cachedInputElement = input;
    }

    const inputRect = input.getBoundingClientRect();
    const wrapper = input.closest('.wr-phone-wrapper') || input.parentElement;

    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();

    // Reuse or create measurement span
    if (!this.cachedMeasurementSpan) {
      this.cachedMeasurementSpan = this.document.createElement('span');
      this.cachedMeasurementSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: pre;
      `;
      wrapper.appendChild(this.cachedMeasurementSpan);
    }

    // Update measurement span style only if input changed
    const span = this.cachedMeasurementSpan;
    span.style.fontFamily = this.cachedInputStyles.fontFamily;
    span.style.fontSize = this.cachedInputStyles.fontSize;
    span.style.fontWeight = this.cachedInputStyles.fontWeight;
    span.style.letterSpacing = this.cachedInputStyles.letterSpacing;

    // Measure text width
    span.textContent = value.substring(0, cursorPos);
    const textWidth = span.offsetWidth;

    // Calculate position
    const inputLeftInWrapper = inputRect.left - wrapperRect.left;
    const leftOffset = inputLeftInWrapper + this.cachedInputStyles.paddingLeft + textWidth;

    // Update cursor position with transform for better performance
    cursor.style.transform = `translate(${leftOffset}px, ${inputRect.top - wrapperRect.top + (inputRect.height - 20) / 2}px)`;
    cursor.style.left = '0';
    cursor.style.top = '0';
  }
  onKeypadDone(): void {
    // Haptic feedback - stronger for done button (15ms)
    this.triggerHapticFeedback(15);
    this.closeCustomKeypad();
  }

  // Ultra-fast haptic feedback for keypad
  private triggerHapticFeedback(duration: number = 5): void {
    if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Silently fail - haptic feedback is optional
      }
    }
  }

  async confirmPhonePopup() {
    // Clear previous error
    this.phoneError = '';

    if (!this.phoneNumber || !this.phoneNumber.trim()) {
      this.phoneError = 'Phone number is required!';
      return;
    }

    if (!this.selectedCountryCode) {
      this.phoneError = 'Please select a country code!';
      return;
    }

    // Validate phone number based on country code
    const fullPhoneNumber = this.selectedCountryCode + this.phoneNumber;

    // Basic validation - at least 7 digits after country code
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      this.phoneError = 'Please enter a valid phone number (10-15 digits)';
      return;
    }

    // Validate phone number starts with 9, 8, 7, or 6
    if (!/^[9876]/.test(this.phoneNumber)) {
      this.phoneError = 'Phone number must start with 9, 8, 7, or 6';
      return;
    }

    // Store the full phone number with country code
    const completePhoneNumber = this.selectedCountryCode + this.phoneNumber;

    // Check if number is blocked
    const isBlocked = await this.checkIfNumberBlocked(this.phoneNumber);
    if (isBlocked) {
      this.cancelPhonePopup();
      Swal.fire({
        icon: 'error',
        title: 'Access Blocked',
        text: 'Sorry, you are blocked. Please contact our support for assistance.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (this.pendingAction === 'flights') {
      // Close the popup first
      this.cancelPhonePopup();
      // Proceed with flight search
      this.performFlightSearch();
    } else if (this.pendingAction === 'shared') {
      // For shared cabs, check API first before navigating
      this.checkAndNavigateForSharedCabs(completePhoneNumber);
    } else if (this.pendingAction === 'reserved') {
      // For reserved cabs, check API first before navigating
      this.checkAndNavigateForReservedCabs(completePhoneNumber);
    }
  }

  // Helper method to get location code from city name for reserved cabs
  private getReservedCityCode(cityName: string): string {
    const city = this.reservedCities.find(c =>
      c.name.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.code : '';
  }

  // Helper method to format date to "Nov 21, 2025" format
  private formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  // Helper method to format time to "01:15 P.M." format
  private formatTimeForAPI(timeString: string): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const minute = minutes || '00';

    let hour12 = hour24;
    let period = 'A.M.';

    if (hour24 === 0) {
      hour12 = 12;
      period = 'A.M.';
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = 'A.M.';
    } else if (hour24 === 12) {
      hour12 = 12;
      period = 'P.M.';
    } else {
      hour12 = hour24 - 12;
      period = 'P.M.';
    }

    return `${hour12.toString().padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
  }

  checkAndNavigateForReservedCabs(phoneNumber: string) {
    const source = this.selectedCities.reserved.pickup || '';
    const destination = this.selectedCities.reserved.dropoff || '';
    const travelDate = this.formValues.reservedDate || '';
    const travelTime = this.formValues.reservedTime || '';

    if (!source || !destination || !travelDate || !travelTime) {
      this.cancelPhonePopup();
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields (From, To, Date, and Pickup Time).',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      return;
    }

    // Get location codes from selected cities
    const fromlocid = this.selectedReservedCodes.pickup || this.getReservedCityCode(source);
    const tolocid = this.selectedReservedCodes.dropoff || this.getReservedCityCode(destination);

    if (!fromlocid || !tolocid) {
      this.cancelPhonePopup();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to get location codes. Please try selecting the cities again.',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      return;
    }

    // Format date and time according to API requirements
    const formattedDate = this.formatDateForAPI(travelDate);
    const formattedTime = this.formatTimeForAPI(travelTime);

    // console.log('=== Checking reserved cab availability before navigation ===');
    // console.log('Source:', source, 'Code:', fromlocid);
    // console.log('Destination:', destination, 'Code:', tolocid);
    // console.log('Travel Date (original):', travelDate, 'Formatted:', formattedDate);
    // console.log('Travel Time (original):', travelTime, 'Formatted:', formattedTime);

    // Call API to check if reserved cabs are available
    this.apiService.getReservedCarList(
      fromlocid,
      tolocid,
      formattedDate,
      formattedTime
    ).subscribe({
      next: (data: any) => {
        // console.log('=== Reserved Cab Availability Check Response ===');
        // console.log('Response:', JSON.stringify(data, null, 2));
        // console.log('Response type:', typeof data);
        // console.log('Is array:', Array.isArray(data));

        // Check if response contains "SORRY NO CABS AVAILABLE"
        const responseString = JSON.stringify(data);
        let isNoCabsAvailable = false;

        if (typeof data === 'string') {
          isNoCabsAvailable = (data as string).toUpperCase().includes('SORRY NO CABS AVAILABLE');
        } else if (Array.isArray(data)) {
          // Check for nested array structure [[{...}]]
          if (data.length === 0) {
            isNoCabsAvailable = true;
          } else if (Array.isArray(data[0])) {
            // Nested array structure: [[{...}]]
            if (data[0].length === 0) {
              isNoCabsAvailable = true;
            } else {
              // Check if first element is a string with "SORRY NO CABS AVAILABLE"
              const firstElement = data[0][0];
              if (typeof firstElement === 'string' && firstElement.toUpperCase().includes('SORRY NO CABS AVAILABLE')) {
                isNoCabsAvailable = true;
              }
            }
          } else {
            // Flat array structure: check for error message
            isNoCabsAvailable = data.some(item =>
              String(item).toUpperCase().includes('SORRY NO CABS AVAILABLE')
            );
          }
        } else {
          isNoCabsAvailable = responseString.toUpperCase().includes('SORRY NO CABS AVAILABLE');
        }

        if (isNoCabsAvailable) {
          // Close phone popup before showing alert
          this.cancelPhonePopup();

          // Show SweetAlert
          Swal.fire({
            icon: 'warning',
            title: 'No Cabs Available',
            text: 'Sorry, no cabs available for this route at the selected time.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
          });

          // console.log('No cabs available - SORRY NO CABS AVAILABLE in response');
        } else if (Array.isArray(data) && data.length > 0) {
          // Check nested array structure: [[{...}]]
          let hasCabs = false;
          if (Array.isArray(data[0]) && data[0].length > 0) {
            // Nested array structure - check if it contains valid cab objects
            const firstCab = data[0][0];
            if (firstCab && typeof firstCab === 'object' && firstCab.CTD) {
              hasCabs = true;
              // console.log('Cabs available - Found', data[0].length, 'vehicles in nested array');
              // console.log('Vehicle details:', data[0]);
            }
          } else if (data.length > 0 && typeof data[0] === 'object' && data[0].CTD) {
            // Flat array structure with cab objects
            hasCabs = true;
            // console.log('Cabs available - Found', data.length, 'vehicles');
            // console.log('Vehicle details:', data);
          }

          if (hasCabs) {
            this.submitCabs('reserved', phoneNumber);
            this.navigateToResults(phoneNumber);
            this.cancelPhonePopup();
          } else {
            // Close phone popup before showing alert
            this.cancelPhonePopup();

            // Empty or unexpected response
            Swal.fire({
              icon: 'warning',
              title: 'No Vehicles Found',
              text: 'No vehicles available for this route at the moment.',
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
              allowOutsideClick: false
            });
            // console.log('No vehicles found in response');
          }
        } else {
          // Close phone popup before showing alert
          this.cancelPhonePopup();

          // Empty or unexpected response
          Swal.fire({
            icon: 'warning',
            title: 'No Vehicles Found',
            text: 'No vehicles available for this route at the moment.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
          });
          // console.log('No vehicles found in response');
        }
      },
      error: (error) => {
        // Close phone popup before showing error alert
        this.cancelPhonePopup();

        // console.error('=== Reserved Cab Availability Check Error ===');
        // console.error('Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to check cab availability. Please try again.',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      }
    });
  }

  checkAndNavigateForSharedCabs(phoneNumber: string) {
    const source = this.selectedCities.shared.pickup || '';
    const destination = this.selectedCities.shared.dropoff || '';
    const pickup = this.formValues.sharedPickupLocation || '';
    const drop = this.formValues.sharedDropoffLocation || '';
    const seats = this.formValues.sharedPassengers || 1;
    const traveldate = this.formValues.sharedDateTime || '';

    if (!source || !destination || !pickup || !drop) {
      this.showSwal('Please fill in all required fields.', 'warning');
      return;
    }

    // console.log('=== Checking route availability before navigation ===');
    // console.log('Source:', source);
    // console.log('Destination:', destination);
    // console.log('Pickup:', pickup);
    // console.log('Dropoff:', drop);
    // console.log('Seats:', seats);
    // console.log('Travel Date:', traveldate);

    // Call API to check if route is available
    this.apiService.getSharedCarList(
      phoneNumber,
      source,
      destination,
      pickup,
      drop,
      seats,
      traveldate
    ).subscribe({
      next: (data: any) => {
        // console.log('=== Route Availability Check Response ===');
        // console.log('Response:', JSON.stringify(data, null, 2));

        // Check if response contains "NOT_PRESENT"
        const responseString = JSON.stringify(data);
        let isNotPresent = false;

        if (typeof data === 'string') {
          isNotPresent = (data as string).includes('NOT_PRESENT');
        } else if (Array.isArray(data)) {
          isNotPresent = data.length === 1 && String(data[0]) === 'NOT_PRESENT';
        } else {
          isNotPresent = responseString.includes('NOT_PRESENT');
        }

        if (isNotPresent) {
          // Close phone popup before showing alert
          this.cancelPhonePopup();

          // Show SweetAlert for 5 seconds
          Swal.fire({
            icon: 'error',
            title: 'Route Not Available',
            text: 'Sorry, this route is not present at the moment.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
          });

          // console.log('Route not available - NOT_PRESENT in response');
        } else if (Array.isArray(data) && data.length > 0) {
          // Data is present, navigate to booking results
          // console.log('Route available - Found', data.length, 'vehicles');
          // console.log('Vehicle details:', data);

          this.submitCabs('shared', phoneNumber);
          this.navigateToResults(phoneNumber);
          this.cancelPhonePopup();
        } else {
          // Close phone popup before showing alert
          this.cancelPhonePopup();

          // Empty or unexpected response
          Swal.fire({
            icon: 'warning',
            title: 'No Vehicles Found',
            text: 'No vehicles available for this route at the moment.',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false
          });
          // console.log('No vehicles found in response');
        }
      },
      error: (error) => {
        // Close phone popup before showing error alert
        this.cancelPhonePopup();

        // console.error('=== Route Availability Check Error ===');
        // console.error('Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to check route availability. Please try again.',
          timer: 5000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
      }
    });
  }

  /** -------------------
   * Form Submissions
   * -------------------- */
  submitFlights(phoneNumber?: string) {
    let payload: any = {
      phoneNumber: phoneNumber || this.phoneNumber,
    };

    // console.log('Current flightRoutes:', this.flightRoutes);
    // console.log('Current tripType:', this.tripType);

    if (this.tripType === 'multi-city') {
      payload.type = 'multi-city';
      payload.travelers = { ...this.counts };
      payload.travelClass = this.selectedClass;

      // Debug: Show all routes before filtering
      // console.log('All routes before filtering:', this.flightRoutes);
      // console.log('Shared travelers:', this.counts);
      // console.log('Shared travel class:', this.selectedClass);

      // Filter routes that have at least some data
      const validRoutes = this.flightRoutes.filter(route => route.from && route.to && route.date);
      // console.log('Valid routes found:', validRoutes);

      // If no valid routes, include all routes for debugging
      if (validRoutes.length === 0) {
        // console.log('No valid routes found, including all routes for debugging');
        payload.routes = this.flightRoutes.map(route => ({
          from: route.from || '',
          to: route.to || '',
          date: route.date || ''
        }));
      } else {
        payload.routes = validRoutes.map(route => ({
          from: route.from,
          to: route.to,
          date: route.date
        }));
      }
    } else {
      payload.type = this.tripType;
      const route = this.flightRoutes[0];
      payload.from = route.from;
      payload.to = route.to;
      payload.departureDate = route.date;
      payload.travelers = { ...this.counts };
      payload.travelClass = this.selectedClass;
      if (this.tripType === 'round-trip' && this.formValues.flightReturn) {
        payload.returnDate = this.formValues.flightReturn;
      }
    }

    // console.log('Final payload:', payload);
    // this.showSwal('Flight booking submitted! Check console for details.', 'success', 2500);
  }

  submitCabs(type: 'shared' | 'reserved', phoneNumber?: string) {
    const cities = this.selectedCities[type];
    if (!cities.pickup || !cities.dropoff) {
      this.showSwal('Please select both pickup and drop-off cities first.', 'warning');
      return;
    }

    const pickupLocation =
      type === 'shared'
        ? this.formValues.sharedPickupLocation
        : this.formValues.reservedPickupLocation;
    const dropoffLocation =
      type === 'shared'
        ? this.formValues.sharedDropoffLocation
        : this.formValues.reservedDropoffLocation;

    if (!pickupLocation || !dropoffLocation) {
      this.showSwal('Please enter specific pickup and drop-off locations within the selected cities.', 'warning');
      return;
    }

    if (type === 'shared') {
      const payload = {
        phoneNumber: phoneNumber || this.phoneNumber,
        type: 'shared',
        pickupCity: this.formValues.sharedPickup,
        dropoffCity: this.formValues.sharedDropoff,
        date: this.formValues.sharedDateTime,
        passengers: this.formValues.sharedPassengers,
        pickupLocation: this.formValues.sharedPickupLocation,
        dropoffLocation: this.formValues.sharedDropoffLocation,
      };
      // console.log('Submitting shared cab booking:', payload);
      // this.showSwal('Shared cab booking submitted! Check console for details.', 'success', 2500);
      return;
    }

    // reserved
    const payload = {
      phoneNumber: phoneNumber || this.phoneNumber,
      type: 'reserved',
      pickupCity: this.formValues.reservedPickup,
      dropoffCity: this.formValues.reservedDropoff,
      reservedDate: this.formValues.reservedDate,
      reservedTime: this.formValues.reservedTime,
      passengers: this.formValues.reservedPassengers,
      pickupLocation: this.formValues.reservedPickupLocation,
      dropoffLocation: this.formValues.reservedDropoffLocation,
    };
    // console.log('[ReservedCab] Submitting booking payload', payload);
    // this.showSwal('Reserved cab booking submitted! Check console for details.', 'success', 2500);
  }

  /**
   * Closes all other dropdowns except the one specified by currentTarget
   * @param currentTarget - The target that should remain open (empty string to close all)
   */
  closeAllOtherDropdowns(currentTarget: string) {
    // Close travelers panel
    this.isTravelersOpen = false;

    // Close all city/location suggestion dropdowns except the current one
    Object.keys(this.activeSuggestions).forEach(key => {
      if (key !== currentTarget) {
        delete this.activeSuggestions[key];
      }
    });
  }

  showCitySuggestions(query: string, target: string) {
    const storeTarget = target;
    target = this.normalizeTarget(target);

    // Close all other dropdowns before opening this one
    this.closeAllOtherDropdowns(storeTarget);

    if (!query.trim()) {
      delete this.activeSuggestions[storeTarget];
      this.toggleDropdownActiveClass();
      return;
    }

    // Use reservedCities for reserved cabs, sourceCities for shared cabs, flightAirports for flights, otherwise use cities
    let citiesToSearch: City[];
    if (target === 'reserved-pickup' || target === 'reserved-dropoff') {
      citiesToSearch = this.reservedCities;
    } else if (target === 'shared-pickup' || target === 'shared-dropoff') {
      citiesToSearch = this.sourceCities;
    } else if (target.startsWith('flight-from-') || target.startsWith('flight-to-')) {
      citiesToSearch = this.flightAirports;
    } else {
      citiesToSearch = this.cities;
    }

    // Filter cities based on the query
    let filteredCities = citiesToSearch.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.code.toLowerCase().includes(query.toLowerCase())
    );

    // For shared cabs, exclude the city selected in the other field
    if (target === 'shared-pickup' && this.formValues.sharedDropoff) {
      filteredCities = filteredCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
      );
    } else if (target === 'shared-dropoff' && this.formValues.sharedPickup) {
      filteredCities = filteredCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
      );
    }

    // For reserved cabs, exclude the city selected in the other field
    if (target === 'reserved-pickup' && this.formValues.reservedDropoff) {
      filteredCities = filteredCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
      );
    } else if (target === 'reserved-dropoff' && this.formValues.reservedPickup) {
      filteredCities = filteredCities.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
      );
    }

    // For flights, exclude the airport selected in the other field of the same route
    if (target.startsWith('flight-from-')) {
      const routeIndex = parseInt(target.replace('flight-from-', ''));
      if (this.flightRoutes[routeIndex]?.to) {
        // Extract city name from display value (remove code part like "Delhi (DEL)" -> "Delhi")
        const selectedCityName = this.extractCityNameFromDisplay(this.flightRoutes[routeIndex].to);
        filteredCities = filteredCities.filter(city =>
          city.name.toLowerCase() !== selectedCityName.toLowerCase()
        );
      }
    } else if (target.startsWith('flight-to-')) {
      const routeIndex = parseInt(target.replace('flight-to-', ''));
      if (this.flightRoutes[routeIndex]?.from) {
        // Extract city name from display value (remove code part like "Delhi (DEL)" -> "Delhi")
        const selectedCityName = this.extractCityNameFromDisplay(this.flightRoutes[routeIndex].from);
        filteredCities = filteredCities.filter(city =>
          city.name.toLowerCase() !== selectedCityName.toLowerCase()
        );
      }
    }

    // Show all matching cities
    this.activeSuggestions[storeTarget] = filteredCities;

    // Toggle dropdown-active class on tabs-container
    this.toggleDropdownActiveClass();
  }

  showCitySuggestionsOnFocus(target: string) {
    const storeTarget = target;
    target = this.normalizeTarget(target);

    // Close all other dropdowns before opening this one
    this.closeAllOtherDropdowns(storeTarget);

    // Clear the field if it already has a value (for easy re-selection)
    if (target === 'shared-pickup' && this.formValues.sharedPickup) {
      this.formValues.sharedPickup = '';
    } else if (target === 'shared-dropoff' && this.formValues.sharedDropoff) {
      this.formValues.sharedDropoff = '';
    } else if (target === 'reserved-pickup' && this.formValues.reservedPickup) {
      this.formValues.reservedPickup = '';
      this.selectedReservedCodes.pickup = '';
    } else if (target === 'reserved-dropoff' && this.formValues.reservedDropoff) {
      this.formValues.reservedDropoff = '';
      this.selectedReservedCodes.dropoff = '';
    } else if (target.startsWith('flight-from-')) {
      const routeIndex = parseInt(target.replace('flight-from-', ''));
      if (this.flightRoutes[routeIndex]?.from) {
        this.flightRoutes[routeIndex].from = '';
      }
    } else if (target.startsWith('flight-to-')) {
      const routeIndex = parseInt(target.replace('flight-to-', ''));
      if (this.flightRoutes[routeIndex]?.to) {
        this.flightRoutes[routeIndex].to = '';
      }
    } else if (target === 'flight-from' || target === 'flight-to') {
      const routeIndex = 0;
      if (target === 'flight-from' && this.flightRoutes[routeIndex]?.from) {
        this.flightRoutes[routeIndex].from = '';
      } else if (target === 'flight-to' && this.flightRoutes[routeIndex]?.to) {
        this.flightRoutes[routeIndex].to = '';
      }
    }

    // Use reservedCities for reserved cabs, sourceCities for shared cabs, flightAirports for flights, otherwise use cities
    let citiesToShow: City[];
    if (target === 'reserved-pickup' || target === 'reserved-dropoff') {
      citiesToShow = this.reservedCities;
    } else if (target === 'shared-pickup' || target === 'shared-dropoff') {
      citiesToShow = this.sourceCities;
    } else if (target.startsWith('flight-from-') || target.startsWith('flight-to-')) {
      citiesToShow = this.flightAirports;
    } else {
      citiesToShow = this.cities;
    }

    // For shared cabs, exclude the city selected in the other field
    if (target === 'shared-pickup' && this.formValues.sharedDropoff) {
      citiesToShow = citiesToShow.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedDropoff.toLowerCase()
      );
    } else if (target === 'shared-dropoff' && this.formValues.sharedPickup) {
      citiesToShow = citiesToShow.filter(city =>
        city.name.toLowerCase() !== this.formValues.sharedPickup.toLowerCase()
      );
    }

    // For reserved cabs, exclude the city selected in the other field
    if (target === 'reserved-pickup' && this.formValues.reservedDropoff) {
      citiesToShow = citiesToShow.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedDropoff.toLowerCase()
      );
    } else if (target === 'reserved-dropoff' && this.formValues.reservedPickup) {
      citiesToShow = citiesToShow.filter(city =>
        city.name.toLowerCase() !== this.formValues.reservedPickup.toLowerCase()
      );
    }

    // For flights, exclude the airport selected in the other field of the same route
    if (target.startsWith('flight-from-')) {
      const routeIndex = parseInt(target.replace('flight-from-', ''));
      if (this.flightRoutes[routeIndex]?.to) {
        // Extract city name from display value (remove code part like "Delhi (DEL)" -> "Delhi")
        const selectedCityName = this.extractCityNameFromDisplay(this.flightRoutes[routeIndex].to);
        citiesToShow = citiesToShow.filter(city =>
          city.name.toLowerCase() !== selectedCityName.toLowerCase()
        );
      }
    } else if (target.startsWith('flight-to-')) {
      const routeIndex = parseInt(target.replace('flight-to-', ''));
      if (this.flightRoutes[routeIndex]?.from) {
        // Extract city name from display value (remove code part like "Delhi (DEL)" -> "Delhi")
        const selectedCityName = this.extractCityNameFromDisplay(this.flightRoutes[routeIndex].from);
        citiesToShow = citiesToShow.filter(city =>
          city.name.toLowerCase() !== selectedCityName.toLowerCase()
        );
      }
    }

    // Show all cities when focusing on input
    this.activeSuggestions[storeTarget] = citiesToShow;

    // Toggle dropdown-active class on tabs-container
    this.toggleDropdownActiveClass();
  }

  getMultiCitySuggestions(target: string): City[] {
    const suggestions = this.activeSuggestions[target];
    return this.isCityArray(suggestions) ? suggestions : [];
  }

  showLocationSuggestions(query: string, target: string) {
    const storeTarget = target;
    target = this.normalizeTarget(target);

    // Close all other dropdowns before opening this one
    this.closeAllOtherDropdowns(storeTarget);

    if (!query.trim()) {
      delete this.activeSuggestions[storeTarget];
      this.toggleDropdownActiveClass();
      return;
    }

    let locations: string[] = [];

    if (target.includes('shared-pickup-specific')) {
      locations = this.sharedPickupLocations;
    } else if (target.includes('shared-dropoff-specific')) {
      locations = this.sharedDropoffLocations;
    } else {
      let cityName = '';
      if (target.includes('reserved-pickup-specific')) {
        cityName = this.selectedCities.reserved.pickup;
      } else if (target.includes('reserved-dropoff-specific')) {
        cityName = this.selectedCities.reserved.dropoff;
      }
      locations = this.locations[cityName] || [];
    }

    const filteredLocations = locations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    );

    this.activeSuggestions[storeTarget] = filteredLocations;
    this.toggleDropdownActiveClass();
  }

  showLocationSuggestionsOnFocus(target: string) {
    const storeTarget = target;
    target = this.normalizeTarget(target);

    // Close all other dropdowns before opening this one
    this.closeAllOtherDropdowns(storeTarget);

    let locations: string[] = [];

    if (target.includes('shared-pickup-specific')) {
      locations = this.sharedPickupLocations;
    } else if (target.includes('shared-dropoff-specific')) {
      locations = this.sharedDropoffLocations;
    } else {
      let cityName = '';
      if (target.includes('reserved-pickup-specific')) {
        cityName = this.selectedCities.reserved.pickup;
      } else if (target.includes('reserved-dropoff-specific')) {
        cityName = this.selectedCities.reserved.dropoff;
      }
      locations = this.locations[cityName] || [];
    }

    this.activeSuggestions[storeTarget] = locations;
    this.toggleDropdownActiveClass();
  }

  hideLocationSuggestions(target: string) {
    // Add a small delay to allow click events to register before hiding
    setTimeout(() => {
      delete this.activeSuggestions[target];
      this.toggleDropdownActiveClass();
    }, 200);
  }

  selectCity(cityName: string, cityCode: string, target: string) {
    // Update form value
    if (target.includes('flight')) {
      const displayValue = cityCode
        ? `${cityName} (${cityCode})`
        : cityName;

      // Handle flight-from-0 and flight-to-0 (for mobile and multi-city)
      if (target.startsWith('flight-from-') || target === 'flight-from') {
        const routeIndex = target.includes('-') && target.split('-').length > 2
          ? parseInt(target.split('-')[2])
          : 0;
        if (this.flightRoutes[routeIndex]) {
          this.flightRoutes[routeIndex].from = displayValue;
        }
        if (routeIndex === 0) {
          this.formValues.flightFrom = displayValue;
          this.onAirportSelected('from', displayValue);
        }
      } else if (target.startsWith('flight-to-') || target === 'flight-to') {
        const routeIndex = target.includes('-') && target.split('-').length > 2
          ? parseInt(target.split('-')[2])
          : 0;
        if (this.flightRoutes[routeIndex]) {
          this.flightRoutes[routeIndex].to = displayValue;
        }
        if (routeIndex === 0) {
          this.formValues.flightTo = displayValue;
          this.onAirportSelected('to', displayValue);
        }
      }
    } else {
      if (target === 'shared-pickup') {
        this.formValues.sharedPickup = cityName;
      } else if (target === 'shared-dropoff') {
        this.formValues.sharedDropoff = cityName;
      } else if (target === 'reserved-pickup') {
        this.formValues.reservedPickup = cityName;
      } else if (target === 'reserved-dropoff') {
        this.formValues.reservedDropoff = cityName;
      }
    }

    // Update selected cities
    if (target === 'shared-pickup') {
      this.selectedCities.shared.pickup = cityName;
      // Refresh suggestions for shared-dropoff to exclude the selected pickup city
      if (this.activeSuggestions['shared-dropoff']) {
        const currentQuery = this.formValues.sharedDropoff || '';
        if (currentQuery.trim()) {
          this.showCitySuggestions(currentQuery, 'shared-dropoff');
        } else {
          this.showCitySuggestionsOnFocus('shared-dropoff');
        }
      }
    } else if (target === 'shared-dropoff') {
      this.selectedCities.shared.dropoff = cityName;
      // Refresh suggestions for shared-pickup to exclude the selected dropoff city
      if (this.activeSuggestions['shared-pickup']) {
        const currentQuery = this.formValues.sharedPickup || '';
        if (currentQuery.trim()) {
          this.showCitySuggestions(currentQuery, 'shared-pickup');
        } else {
          this.showCitySuggestionsOnFocus('shared-pickup');
        }
      }
    } else if (target === 'reserved-pickup') {
      this.selectedCities.reserved.pickup = cityName;
      this.selectedReservedCodes.pickup = cityCode || this.getReservedCityCode(cityName);
      // Refresh suggestions for reserved-dropoff to exclude the selected pickup city
      if (this.activeSuggestions['reserved-dropoff']) {
        const currentQuery = this.formValues.reservedDropoff || '';
        if (currentQuery.trim()) {
          this.showCitySuggestions(currentQuery, 'reserved-dropoff');
        } else {
          this.showCitySuggestionsOnFocus('reserved-dropoff');
        }
      }
    } else if (target === 'reserved-dropoff') {
      this.selectedCities.reserved.dropoff = cityName;
      this.selectedReservedCodes.dropoff = cityCode || this.getReservedCityCode(cityName);
      // Refresh suggestions for reserved-pickup to exclude the selected dropoff city
      if (this.activeSuggestions['reserved-pickup']) {
        const currentQuery = this.formValues.reservedPickup || '';
        if (currentQuery.trim()) {
          this.showCitySuggestions(currentQuery, 'reserved-pickup');
        } else {
          this.showCitySuggestionsOnFocus('reserved-pickup');
        }
      }
    } else if (target === 'flight-from' || target.startsWith('flight-from-')) {
      this.selectedCities.flights.from = cityName;
    } else if (target === 'flight-to' || target.startsWith('flight-to-')) {
      this.selectedCities.flights.to = cityName;
    }

    // Clear suggestions
    delete this.activeSuggestions[target];
    this.toggleDropdownActiveClass();

    // Check for location details
    if (target.includes('shared') || target.includes('reserved')) {
      this.checkAndShowLocationDetails(target);
    }

    // Call getPickupDrop API when both source and destination cities are selected for shared cabs
    if (target === 'shared-pickup' || target === 'shared-dropoff') {
      const source = this.selectedCities.shared.pickup;
      const destination = this.selectedCities.shared.dropoff;

      // Clear previous locations when cities change
      if (target === 'shared-pickup') {
        this.sharedPickupLocations = [];
        this.formValues.sharedPickupLocation = '';
      } else if (target === 'shared-dropoff') {
        this.sharedDropoffLocations = [];
        this.formValues.sharedDropoffLocation = '';
      }

      if (source && destination && source !== destination) {
        this.apiService.getPickupDrop(source, destination).subscribe({
          next: (data) => {
            if (Array.isArray(data) && data.length >= 2) {
              this.sharedPickupLocations = Array.isArray(data[0]) ? data[0] : [];
              this.sharedDropoffLocations = Array.isArray(data[1]) ? data[1] : [];
            }
          },
          error: (error) => {
            // console.error('Error fetching pickup/dropoff locations:', error);
            this.sharedPickupLocations = [];
            this.sharedDropoffLocations = [];
          }
        });
      }
    }
  }

  selectMultiCity(cityName: string, cityCode: string, target: string) {
    const routeIndex = parseInt(target.split('-')[2]);
    const field = target.split('-')[1]; // 'from' or 'to'

    // Format: "CityName (CODE)"
    const displayValue = cityCode
      ? `${cityName} (${cityCode})`
      : cityName;

    if (field === 'from') {
      this.flightRoutes[routeIndex].from = displayValue;
      // Trigger calendar fare fetching for first route
      if (routeIndex === 0) {
        this.onAirportSelected('from', displayValue);
      }
    } else {
      // When selecting 'to' for a route, auto-populate the next route's 'from'
      const oldDestination = this.flightRoutes[routeIndex].to;
      this.flightRoutes[routeIndex].to = displayValue;

      // Auto-populate next route's 'from' if it exists and is empty or matches old destination
      if (routeIndex < this.flightRoutes.length - 1) {
        const nextRoute = this.flightRoutes[routeIndex + 1];
        if (!nextRoute.from || nextRoute.from === oldDestination) {
          nextRoute.from = displayValue;
        }
      }

      // Trigger calendar fare fetching for first route
      if (routeIndex === 0) {
        this.onAirportSelected('to', displayValue);
      }
    }

    delete this.activeSuggestions[target];
  }

  addFlightRoute() {
    if (this.flightRoutes.length < 5) {
      // Auto-populate 'from' with the previous route's 'to' value
      const previousRoute = this.flightRoutes[this.flightRoutes.length - 1];
      const autoFrom = previousRoute?.to || '';

      this.flightRoutes.push({
        from: autoFrom,
        to: '',
        date: ''
      });

      // Multi-city route added - no need to re-initialize datepickers
    }
  }

  removeFlightRoute(index: number) {
    if (this.flightRoutes.length > 1) {
      this.flightRoutes.splice(index, 1);
    }
  }

  swapFlightLocations(index: number) {
    const route = this.flightRoutes[index];
    const temp = route.from;
    route.from = route.to;
    route.to = temp;

    // Also swap formValues for flights
    const tempFrom = this.formValues.flightFrom;
    this.formValues.flightFrom = this.formValues.flightTo;
    this.formValues.flightTo = tempFrom;

    // Swap selected cities if they exist
    if (this.selectedCities.flights) {
      const tempCity = this.selectedCities.flights.from;
      this.selectedCities.flights.from = this.selectedCities.flights.to;
      this.selectedCities.flights.to = tempCity;
    }
  }

  selectLocation(locationName: string, target: string) {
    if (target === 'shared-pickup-specific') {
      this.formValues.sharedPickupLocation = locationName;
    } else if (target === 'shared-dropoff-specific') {
      this.formValues.sharedDropoffLocation = locationName;
    } else if (target === 'reserved-pickup-specific') {
      this.formValues.reservedPickupLocation = locationName;
    } else if (target === 'reserved-dropoff-specific') {
      this.formValues.reservedDropoffLocation = locationName;
    }

    // Clear suggestions immediately when location is selected
    delete this.activeSuggestions[target];

    if (target === 'shared-pickup-specific' || target === 'shared-dropoff-specific') {
      const hasPickupLocation = !!this.formValues.sharedPickupLocation;
      const hasDropoffLocation = !!this.formValues.sharedDropoffLocation;
      const hasSourceCity = !!this.selectedCities.shared.pickup;
      const hasDestinationCity = !!this.selectedCities.shared.dropoff;

      // API call is already handled in selectCity method when cities are selected
      // No need to call again here
    }
  }

  checkAndShowLocationDetails(target: string) {
    const tabType = target.includes('reserved') ? 'reserved' : 'shared';
    const cities = this.selectedCities[tabType];

    if (cities.pickup && cities.dropoff) {
      if (tabType === 'shared' && this.isSameCitySelected(cities.pickup, cities.dropoff)) {
        this.locationDetailsVisible[tabType] = false;
        return;
      }

      this.locationDetailsVisible[tabType] = true;
    }
  }


  swapCabLocations(tabType: 'shared' | 'reserved') {
    if (tabType === 'shared') {
      const temp = this.formValues.sharedPickup;
      this.formValues.sharedPickup = this.formValues.sharedDropoff;
      this.formValues.sharedDropoff = temp;

      const tempCity = this.selectedCities.shared.pickup;
      this.selectedCities.shared.pickup = this.selectedCities.shared.dropoff;
      this.selectedCities.shared.dropoff = tempCity;

      // Swap locations and fetch new data
      const tempLocations = this.sharedPickupLocations;
      this.sharedPickupLocations = this.sharedDropoffLocations;
      this.sharedDropoffLocations = tempLocations;

      // Fetch fresh data for swapped cities
      if (this.selectedCities.shared.pickup && this.selectedCities.shared.dropoff) {
        this.apiService.getPickupDrop(
          this.selectedCities.shared.pickup,
          this.selectedCities.shared.dropoff
        ).subscribe({
          next: (data) => {
            if (Array.isArray(data) && data.length >= 2) {
              this.sharedPickupLocations = Array.isArray(data[0]) ? data[0] : [];
              this.sharedDropoffLocations = Array.isArray(data[1]) ? data[1] : [];
            }
          },
          error: (error) => {
            // console.error('Error fetching pickup/dropoff locations:', error);
          }
        });
      }
    } else {
      const temp = this.formValues.reservedPickup;
      this.formValues.reservedPickup = this.formValues.reservedDropoff;
      this.formValues.reservedDropoff = temp;

      const tempCity = this.selectedCities.reserved.pickup;
      this.selectedCities.reserved.pickup = this.selectedCities.reserved.dropoff;
      this.selectedCities.reserved.dropoff = tempCity;

      const tempCode = this.selectedReservedCodes.pickup;
      this.selectedReservedCodes.pickup = this.selectedReservedCodes.dropoff;
      this.selectedReservedCodes.dropoff = tempCode;
    }
  }

  swapSpecificLocations(tabType: 'shared' | 'reserved') {
    if (tabType === 'shared') {
      const temp = this.formValues.sharedPickupLocation;
      this.formValues.sharedPickupLocation = this.formValues.sharedDropoffLocation;
      this.formValues.sharedDropoffLocation = temp;
    } else {
      const temp = this.formValues.reservedPickupLocation;
      this.formValues.reservedPickupLocation = this.formValues.reservedDropoffLocation;
      this.formValues.reservedDropoffLocation = temp;
    }
  }

  toggleTravelersPanel() {
    // Close all city/location dropdowns when opening travelers panel
    if (!this.isTravelersOpen) {
      this.closeAllOtherDropdowns('');
    }
    this.isTravelersOpen = !this.isTravelersOpen;

    // Toggle dropdown-active class on tabs-container
    this.toggleDropdownActiveClass();
  }

  closeTravelersPanel() {
    this.isTravelersOpen = false;

    // Toggle dropdown-active class on tabs-container
    this.toggleDropdownActiveClass();
  }

  updateCount(type: keyof TravelerCounts, delta: number) {
    const newValue = this.counts[type] + delta;

    if (type === 'adults' && newValue < 1) return;
    if (newValue < 0) return;
    if (type === 'infants' && newValue > this.counts.adults) return;

    this.counts[type] = newValue;
  }

  updateClass(newClass: string) {
    this.selectedClass = newClass;
  }


  updateSharedPassengers(delta: number) {
    const newValue = this.formValues.sharedPassengers + delta;
    if (newValue >= 1) {
      this.formValues.sharedPassengers = newValue;
    }
  }

  updateReservedPassengers(delta: number) {
    const newValue = this.formValues.reservedPassengers + delta;
    if (newValue >= 1) {
      this.formValues.reservedPassengers = newValue;
    }
  }

  selectClass(className: string) {
    this.selectedClass = className;
  }

  getTravelersText(): string {
    const total = this.counts.adults + this.counts.children;
    const classText = this.selectedClass.charAt(0).toUpperCase() + this.selectedClass.slice(1);
    const travelers = total === 1 ? '1 Traveller' : `${total} Travellers`;
    return `${travelers}, ${classText}`;
  }

  canDecrease(type: keyof TravelerCounts): boolean {
    if (type === 'adults') return this.counts[type] > 1;
    return this.counts[type] > 0;
  }

  // Mobile travelers popup methods
  openMobileTravelersPopup(): void {
    this.showMobileTravelersPopup = true;
  }

  closeMobileTravelersPopup(): void {
    this.showMobileTravelersPopup = false;
  }

  getMobileTravelersDisplay(): string {
    const total = this.counts.adults + this.counts.children;
    if (total === 1) {
      return '1 Passenger';
    }
    return `${total} Passengers`;
  }

  getMobileClassDisplay(): string {
    return this.selectedClass.charAt(0).toUpperCase() + this.selectedClass.slice(1);
  }

  getMobileTravelersText(): string {
    const total = this.counts.adults + this.counts.children;
    const classText = this.selectedClass.charAt(0).toUpperCase() + this.selectedClass.slice(1);
    const travelers = total === 1 ? '1 Traveller' : `${total} Travellers`;
    return `${travelers}, ${classText}`;
  }

  submitForm() {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      title: 'Enter your phone number',
      input: 'text',
      inputLabel: 'Phone Number',
      inputPlaceholder: 'Enter your phone number',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
        return null; // Return null if validation passes
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const phone = result.value;
        const submissionData = {
          ...this.formValues,
          travelers: this.counts,
          travelClass: this.selectedClass,
          phoneNumber: phone
        };
        // console.log("Form Submitted:", submissionData);
        // Swal.fire('Submitted!', 'Check console for details.', 'success');
      }
    });
  }

  searchFlights() {
    const errors: string[] = [];

    // Get selected airports from flightRoutes or formValues
    const fromValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.from
      : (this.flightRoutes[0]?.from || this.formValues.flightFrom);
    const toValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.to
      : (this.flightRoutes[0]?.to || this.formValues.flightTo);

    // Extract airport codes
    const fromCode = this.extractAirportCode(fromValue);
    const toCode = this.extractAirportCode(toValue);

    if (!fromCode || !toCode) {
      errors.push("Departure and Destination airports must be selected.");
    }

    if (fromCode === toCode) {
      errors.push("Departure and Destination airports cannot be the same.");
    }

    const departureDate = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.date
      : (this.flightRoutes[0]?.date || this.formValues.flightDeparture);

    if (!departureDate) {
      errors.push("Please select a departure date.");
    }

    const today = new Date();
    const depDate = departureDate ? new Date(departureDate) : null;
    const retDate = this.tripType === 'round-trip' && this.formValues.flightReturn
      ? new Date(this.formValues.flightReturn)
      : null;

    if (depDate && depDate < this.stripTime(today)) {
      errors.push("Departure date cannot be in the past.");
    }

    if (this.tripType === 'round-trip') {
      if (!this.formValues.flightReturn) {
        errors.push("Please select a return date.");
      } else if (retDate && retDate < this.stripTime(today)) {
        errors.push("Return date cannot be in the past.");
      } else if (retDate && depDate && retDate < depDate) {
        errors.push("Return date cannot be before departure date.");
      }
    }

    if (errors.length) {
      Swal.fire({
        title: 'Sorry!',
        html: errors.join('<br>'),
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Validate that TBO token and IP address are available
    if (!this.tboTokenId || !this.ip) {
      Swal.fire({
        title: 'Please Wait',
        html: 'We are preparing your search. Please try again in a moment.',
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: 3000
      });

      // Try to fetch token if missing
      if (!this.tboTokenId) {
        this.subscriptions.add(
          this.apiService.getTboToken().subscribe((val: any) => {
            // console.log('TBo Token', val);
            if (val && val['TokenId']) {
              this.tboTokenId = val['TokenId'];
              // Retry search after token is fetched
              setTimeout(() => {
                this.searchFlights();
              }, 500);
            }
          })
        );
      }

      // Try to fetch IP if missing
      if (!this.ip) {
        this.subscriptions.add(
          this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe((res) => {
            this.ip = res.ip;
            // console.log('nIp', this.ip);
            // Retry search after IP is fetched
            if (this.tboTokenId) {
              setTimeout(() => {
                this.searchFlights();
              }, 500);
            }
          })
        );
      }

      return;
    }

    // For desktop, show phone popup before proceeding with search
    if (!this.isMobileView()) {
      this.openPhonePopup('flights');
      return;
    }

    // For mobile, proceed directly with search (phone number is in form)
    this.performFlightSearch();
  }

  performFlightSearch() {
    // Get selected airports from flightRoutes or formValues
    const fromValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.from
      : (this.flightRoutes[0]?.from || this.formValues.flightFrom);
    const toValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.to
      : (this.flightRoutes[0]?.to || this.formValues.flightTo);

    // Extract airport codes
    const fromCode = this.extractAirportCode(fromValue);
    const toCode = this.extractAirportCode(toValue);

    const departureDate = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.date
      : (this.flightRoutes[0]?.date || this.formValues.flightDeparture);

    // Find airport objects from flightAirports list using already extracted codes
    const fromAirport = this.flightAirports.find(a => a.code === fromCode);
    const toAirport = this.flightAirports.find(a => a.code === toCode);

    // Set selectedFrom and selectedTo as objects (matching working code)
    this.selectedFrom = fromAirport ? {
      name: fromAirport.name,
      code: fromAirport.code,
      airport: fromAirport.name // Using name as airport for now
    } : null;

    this.selectedTo = toAirport ? {
      name: toAirport.name,
      code: toAirport.code,
      airport: toAirport.name // Using name as airport for now
    } : null;

    const returnDate = this.tripType === 'round-trip' ? this.formValues.flightReturn : null;

    // Map tripType to match working code format
    const tripTypeMapping: { [key: string]: string } = {
      'one-way': 'oneway',
      'round-trip': 'round',
      'multi-city': 'multi'
    };
    const mappedTripType = tripTypeMapping[this.tripType] || 'oneway';

    // Store flight data using flightDataService (matching working code)
    this.flightDataService.setStringValue({
      tboToken: this.tboTokenId,
      ipAddress: this.ip,
      tripType: mappedTripType,
      fromCity: this.selectedFrom?.name || '',
      fromAirport: this.selectedFrom?.airport || '',
      fromAirportCode: this.selectedFrom?.code || '',
      toCity: this.selectedTo?.name || '',
      toAirport: this.selectedTo?.airport || '',
      toAirportCode: this.selectedTo?.code || '',
      departureDate: departureDate,
      returnDate: returnDate,
      fareType: this.fareType,
      adults: this.counts.adults,
      children: this.counts.children,
      infants: this.counts.infants,
      travelClass: this.selectedClass,
      calendarFareMap: Object.fromEntries(this.calendarFareMap),
      calendarFareMapReturn: Object.fromEntries(this.calendarFareMapReturn),
      multiCityRoutes: this.tripType === 'multi-city' ? this.flightRoutes.map(route => ({
        from: route.from,
        to: route.to,
        date: route.date
      })) : []
    } as FlightData);

    // Navigate to flight list page using path parameter (matching route definition)
    this.router.navigate(['flightlist', 'FLIGHT']);
  }

  searchCabs(type: 'shared' | 'reserved') {
    const cities = this.selectedCities[type];

    if (!cities.pickup || !cities.dropoff) {
      this.showSwal('Please select both pickup and drop-off cities first.', 'warning');
      return;
    }

    // Validate date field
    const dateField = type === 'shared' ? this.formValues.sharedDateTime : this.formValues.reservedDate;
    if (!dateField || !dateField.trim()) {
      this.showSwal('Please select a date first.', 'warning');
      return;
    }

    // For reserved cabs, validate time field
    if (type === 'reserved') {
      if (!this.formValues.reservedTime || !this.formValues.reservedTime.trim()) {
        this.showSwal('Please select a pickup time first.', 'warning');
        return;
      }
    }

    const pickupLocation = type === 'shared'
      ? this.formValues.sharedPickupLocation
      : this.formValues.reservedPickupLocation;
    const dropoffLocation = type === 'shared'
      ? this.formValues.sharedDropoffLocation
      : this.formValues.reservedDropoffLocation;

    if (!pickupLocation || !dropoffLocation) {
      this.showSwal('Please enter specific pickup and drop-off locations within the selected cities.', 'warning');
      return;
    }

    // Check if mobile - if so, phone number should be in form, don't show popup
    if (this.isMobileView()) {
      // For mobile, phone number is already in the form, so we need to get it from there
      // But since searchCabs is called from desktop, we'll keep the popup for desktop
      this.openPhonePopup(type);
    } else {
      this.openPhonePopup(type);
    }
  }

  searchCabsMobile(type: 'shared' | 'reserved', phoneNumber: string) {
    const cities = this.selectedCities[type];

    if (!cities.pickup || !cities.dropoff) {
      Swal.fire({
        icon: 'warning',
        title: 'Cities Required',
        text: 'Please select both pickup and drop-off cities first.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Validate date field
    const dateField = type === 'shared' ? this.formValues.sharedDateTime : this.formValues.reservedDate;
    if (!dateField || !dateField.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a date first.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // For reserved cabs, validate time field
    if (type === 'reserved') {
      if (!this.formValues.reservedTime || !this.formValues.reservedTime.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Pickup Time Required',
          text: 'Please select a pickup time first.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        return;
      }
    }

    const pickupLocation = type === 'shared'
      ? this.formValues.sharedPickupLocation
      : this.formValues.reservedPickupLocation;
    const dropoffLocation = type === 'shared'
      ? this.formValues.sharedDropoffLocation
      : this.formValues.reservedDropoffLocation;

    if (!pickupLocation || !dropoffLocation) {
      Swal.fire({
        icon: 'warning',
        title: 'Locations Required',
        text: 'Please enter specific pickup and drop-off locations within the selected cities.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Use the phone number from mobile form and proceed directly
    this.pendingAction = type;
    if (type === 'shared') {
      this.checkAndNavigateForSharedCabs(phoneNumber);
    } else {
      this.checkAndNavigateForReservedCabs(phoneNumber);
    }
  }

  searchFlightsMobile(phoneNumber: string) {
    // Get selected airports from flightRoutes or formValues
    const fromValue = this.flightRoutes[0]?.from || this.formValues.flightFrom;
    const toValue = this.flightRoutes[0]?.to || this.formValues.flightTo;

    // Extract airport codes
    const fromCode = this.extractAirportCode(fromValue);
    const toCode = this.extractAirportCode(toValue);

    if (!fromCode || !toCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Airports Required',
        text: 'Departure and Destination airports must be selected.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    if (fromCode === toCode) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Selection',
        text: 'Departure and Destination airports cannot be the same.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    const departureDate = this.flightRoutes[0]?.date || this.formValues.flightDeparture;
    if (!departureDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select a departure date.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }

    // Validate that TBO token and IP address are available
    if (!this.tboTokenId || !this.ip) {
      Swal.fire({
        title: 'Please Wait',
        html: 'We are preparing your search. Please try again in a moment.',
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: 3000
      });
      return;
    }

    // Find airport objects from flightAirports list
    const fromAirport = this.flightAirports.find(a => a.code === fromCode);
    const toAirport = this.flightAirports.find(a => a.code === toCode);

    // Set selectedFrom and selectedTo as objects (matching desktop code)
    this.selectedFrom = fromAirport ? {
      name: fromAirport.name,
      code: fromAirport.code,
      airport: fromAirport.name
    } : null;

    this.selectedTo = toAirport ? {
      name: toAirport.name,
      code: toAirport.code,
      airport: toAirport.name
    } : null;

    const returnDate = this.tripType === 'round-trip' ? this.formValues.flightReturn : null;

    // Map tripType to match working code format
    const tripTypeMapping: { [key: string]: string } = {
      'one-way': 'oneway',
      'round-trip': 'round',
      'multi-city': 'multi'
    };
    const mappedTripType = tripTypeMapping[this.tripType] || 'oneway';

    // Store flight data using flightDataService (same as desktop)
    this.flightDataService.setStringValue({
      tboToken: this.tboTokenId,
      ipAddress: this.ip,
      tripType: mappedTripType,
      fromCity: this.selectedFrom?.name || '',
      fromAirport: this.selectedFrom?.airport || '',
      fromAirportCode: this.selectedFrom?.code || '',
      toCity: this.selectedTo?.name || '',
      toAirport: this.selectedTo?.airport || '',
      toAirportCode: this.selectedTo?.code || '',
      departureDate: departureDate,
      returnDate: returnDate,
      fareType: this.fareType,
      adults: this.counts.adults,
      children: this.counts.children,
      infants: this.counts.infants,
      travelClass: this.selectedClass,
      calendarFareMap: Object.fromEntries(this.calendarFareMap),
      calendarFareMapReturn: Object.fromEntries(this.calendarFareMapReturn),
      multiCityRoutes: this.tripType === 'multi-city' ? this.flightRoutes.map(route => ({
        from: route.from,
        to: route.to,
        date: route.date
      })) : []
    } as FlightData);

    // Navigate to flight list page (same as desktop)
    this.router.navigate(['flightlist', 'FLIGHT']);
  }

  createGroupBooking() {
    this.showSwal('Redirecting to group booking... This would redirect to a specialized group booking form.', 'info', 2500);
  }

  toggleDropdownActiveClass(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const tabsContainer = this.document.querySelector('.tabs-container') as HTMLElement;
    if (!tabsContainer) return;

    // Check if any dropdown is active (city suggestions, calendar, or travelers panel)
    const hasActiveDropdown = Object.keys(this.activeSuggestions).length > 0;
    const hasActiveCalendar = this.isCalendarOpen;
    const hasTravelersOpen = this.isTravelersOpen;

    if (hasActiveDropdown || hasActiveCalendar || hasTravelersOpen) {
      tabsContainer.classList.add('dropdown-active');
    } else {
      tabsContainer.classList.remove('dropdown-active');
    }
  }

  isCalendarOpen: boolean = false;
  private currentCalendarType: 'departure' | 'return' = 'departure';

  onCalendarOpened(type: 'departure' | 'return' = 'departure') {
    this.isCalendarOpen = true;
    this.currentCalendarType = type;
    this.toggleDropdownActiveClass();

    // Get the selected from and to cities
    const fromCity = this.flightRoutes[0]?.from;
    const toCity = this.flightRoutes[0]?.to;

    if (fromCity && toCity) {
      // Extract airport codes from city strings
      const fromCode = this.extractAirportCode(fromCity);
      const toCode = this.extractAirportCode(toCity);

      if (fromCode && toCode) {
        // Fetch departure fares (from -> to)
        if (type === 'departure') {
          this.fetchCalendarFare(fromCode, toCode, this.calendarFareMap);
        }
        // Fetch return fares (to -> from)
        else if (type === 'return') {
          this.fetchCalendarFare(toCode, fromCode, this.calendarFareMapReturn);
        }
      }
    }
  }

  onCalendarClosed(): void {
    this.isCalendarOpen = false;
    this.toggleDropdownActiveClass();
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.travelers-dropdown')) {
      this.isTravelersOpen = false;
      this.toggleDropdownActiveClass();
    }

    if (!target.closest('.city-select')) {
      // Only clear suggestions if not clicking on a suggestion item
      if (!target.closest('.city-suggestion')) {
        this.activeSuggestions = {};
        this.toggleDropdownActiveClass();
      }
    }
  }

  isCityArray(arr: any): arr is City[] {
    return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && 'name' in arr[0];
  }
  trackByServiceId(index: number, service: any): number {
    return service.id;
  }

  /**
   * Show a SweetAlert message (replaces native alert).
   * Defaults to warning icon; use timers for toasts if needed.
   */
  private showSwal(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'warning',
    timerMs?: number
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;

    Swal.fire({
      icon,
      title: message,
      timer: timerMs,
      timerProgressBar: !!timerMs,
      showConfirmButton: !timerMs,
      confirmButtonColor: '#149494'
    });
  }

  /** -------------------
   * Time Input Methods for Reserved Cabs
   * -------------------- */

  // Time picker modal state
  timePickerVisible = false;
  selectedHour = 12;
  selectedMinute = '00';
  selectedPeriod = 'PM';

  // Time options for the picker
  hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  minutes = ['00', '15', '30', '45'];

  openTimePicker() {
    this.timePickerVisible = true;
    this.initializeTimePicker();
  }

  closeTimePicker() {
    this.timePickerVisible = false;
  }

  initializeTimePicker() {
    // Parse current time and set selected values
    const currentTime = this.formValues.reservedTime || '12:00';
    const [hourStr, minuteStr] = currentTime.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    // Convert 24-hour to 12-hour format
    if (hour === 0) {
      this.selectedHour = 12;
      this.selectedPeriod = 'AM';
    } else if (hour < 12) {
      this.selectedHour = hour;
      this.selectedPeriod = 'AM';
    } else if (hour === 12) {
      this.selectedHour = 12;
      this.selectedPeriod = 'PM';
    } else {
      this.selectedHour = hour - 12;
      this.selectedPeriod = 'PM';
    }

    // Set closest minute
    const closestMinute = Math.round(minute / 15) * 15;
    this.selectedMinute = closestMinute.toString().padStart(2, '0');

    // Scroll to selected hour
    setTimeout(() => {
      this.scrollToSelectedHour();
    }, 100);
  }

  scrollToSelectedHour() {
    if (!isPlatformBrowser(this.platformId)) return;
    const hoursContainer = this.document.querySelector('.time-options') as HTMLElement;
    if (hoursContainer) {
      const selectedOption = hoursContainer.children[this.selectedHour - 1] as HTMLElement;
      if (selectedOption) {
        selectedOption.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
  }

  selectMinute(minute: string) {
    this.selectedMinute = minute;
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }

  confirmTimeSelection() {
    // Convert 12-hour to 24-hour format
    let hour24 = this.selectedHour;

    if (this.selectedPeriod === 'AM' && this.selectedHour === 12) {
      hour24 = 0;
    } else if (this.selectedPeriod === 'PM' && this.selectedHour !== 12) {
      hour24 = this.selectedHour + 12;
    }

    // Format time as HH:mm
    const time24 = `${hour24.toString().padStart(2, '0')}:${this.selectedMinute}`;

    this.formValues.reservedTime = time24;
    this.updateClockDisplay(time24);
    this.closeTimePicker();
  }

  updateClockDisplay(time: string) {
    // Clock display removed - keeping method for compatibility
  }

  formatTimeDisplay(time: string): string {
    if (!time) return 'Select Time';

    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    let displayHour = hour;
    let period = 'AM';

    if (hour === 0) {
      displayHour = 12;
      period = 'AM';
    } else if (hour < 12) {
      displayHour = hour;
      period = 'AM';
    } else if (hour === 12) {
      displayHour = 12;
      period = 'PM';
    } else {
      displayHour = hour - 12;
      period = 'PM';
    }

    return `${displayHour}:${minuteStr} ${period}`;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const bookingSection = this.document.querySelector('.booking-section-wrapper');
    if (!bookingSection) return;

    const bookingSectionRect = bookingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Show bottom nav when booking section is visible
    // Hide when scrolled past the booking section
    // if (bookingSectionRect.bottom > 0 && bookingSectionRect.top < windowHeight) {
    //   this.showMobileBottomNav = true;
    // } else {
    //   this.showMobileBottomNav = false;
    // }
  }

  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Scroll to contact section or footer
    const footer = this.document.querySelector('app-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** -------------------
   * Helper Methods for SSR Safety
   * -------------------- */

  private decodeHtmlEntities(text: string): string {
    if (!text) {
      return '';
    }

    // SSR-safe regex for common entities
    const regexDecoded = text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'');

    // Browser path: use DOM to decode entities safely
    if (isPlatformBrowser(this.platformId) && this.document && typeof this.document.createElement === 'function') {
      try {
        const textarea = this.document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
      } catch {
        // Fall through to regex fallback if DOM fails
        return regexDecoded;
      }
    }

    // SSR fallback: regex replace of common entities
    return regexDecoded;
  }

  // New helper to safely strip HTML tags
  private stripHtmlTags(html: string): string {
    if (!html) return '';

    if (isPlatformBrowser(this.platformId) && this.document && typeof this.document.createElement === 'function') {
      try {
        const tempDiv = this.document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
      } catch (e) {
        // Fallback to regex
      }
    }
    // SSR or Error fallback
    return html.replace(/<[^>]*>/g, '').trim();
  }

  /** -------------------
   * Load Offers from WordPress
   * -------------------- */
  loadOffers(tab: string): void {
    this.isLoadingOffers = true;

    this.wordpressService.getHomepageOffers().subscribe({
      next: (wpOffers: WordPressOffer[]) => {
        // Filter offers by tab using ACF field, then map to our Offer interface
        const filteredOffers = wpOffers.filter((wpOffer) => {
          // If offer_tab ACF field matches current tab, or if no tab specified, show all
          const offerTab = wpOffer.acf?.offer_tab;
          return !offerTab || offerTab === tab;
        });

        // Map WordPress offers to our Offer interface
        this.specialOffers = filteredOffers.map((wpOffer) => {
          // Decode HTML entities in title
          const decodedTitle = this.decodeHtmlEntities(wpOffer.title.rendered);

          // Extract description from content (strip HTML tags safely)
          const description = this.stripHtmlTags(wpOffer.content?.rendered || '');

          // Decode HTML entities in subtitle
          const decodedSubtitle = this.decodeHtmlEntities(wpOffer.acf?.offer_subtitle || '');

          // Get featured image
          let imageUrl = 'https://www.yatra.com/ythomepagecms/media/todayspick_home/2025/Aug/1dfd0ec10d44a54b92772dc7ea341368.jpg'; // Default fallback

          if (wpOffer._embedded && wpOffer._embedded['wp:featuredmedia'] && wpOffer._embedded['wp:featuredmedia'][0]) {
            const featuredMedia = wpOffer._embedded['wp:featuredmedia'][0];
            imageUrl = featuredMedia.source_url ||
              featuredMedia.media_details?.sizes?.large?.source_url ||
              featuredMedia.media_details?.sizes?.medium?.source_url ||
              featuredMedia.media_details?.sizes?.full?.source_url ||
              imageUrl;
          }

          return {
            id: wpOffer.id,
            title: decodedTitle,
            description: description,
            subtitle: decodedSubtitle,
            code: wpOffer.acf?.offer_code || '',
            image: imageUrl
          };
        });

        this.isLoadingOffers = false;
        // console.log('Offers loaded for tab:', tab, this.specialOffers);
      },
      error: (error) => {
        // console.error('Error loading offers:', error);
        this.isLoadingOffers = false;
        // Keep empty array or show fallback offers
        this.specialOffers = [];
      }
    });
  }

  /** -------------------
   * Load Google Reviews from WordPress
   * -------------------- */
  loadGoogleReviews(): void {
    this.wordpressService.getGoogleReviews(10).subscribe({
      next: (wpReviews: any[]) => {
        if (wpReviews && wpReviews.length > 0) {
          // Map WordPress reviews to testimonial structure
          this.testimonials = wpReviews.map((wpReview) => {
            // Extract text from content (strip HTML tags safely)
            const reviewText = this.stripHtmlTags(wpReview.content?.rendered || '');

            // Get avatar from featured image or ACF field
            let avatarUrl = wpReview.acf?.avatar_url || '';
            if (!avatarUrl && wpReview._embedded && wpReview._embedded['wp:featuredmedia'] && wpReview._embedded['wp:featuredmedia'][0]) {
              const featuredMedia = wpReview._embedded['wp:featuredmedia'][0];
              avatarUrl = featuredMedia.source_url ||
                featuredMedia.media_details?.sizes?.thumbnail?.source_url ||
                featuredMedia.media_details?.sizes?.medium?.source_url ||
                '';
            }

            // Fallback avatar if none provided
            if (!avatarUrl) {
              avatarUrl = 'https://via.placeholder.com/60';
            }

            return {
              id: wpReview.id,
              name: this.decodeHtmlEntities(wpReview.title?.rendered || 'Anonymous'),
              location: wpReview.acf?.location || '',
              avatar: avatarUrl,
              rating: wpReview.acf?.rating ? parseInt(wpReview.acf.rating) : 5,
              text: reviewText,
              isVerified: wpReview.acf?.is_verified !== undefined ? wpReview.acf.is_verified : true
            };
          });

          // Initialize carousel after loading reviews
          setTimeout(() => {
            this.init3DTestimonialCarousel();
          }, 100);
        } else {
          // No reviews found - keep testimonials empty
          this.testimonials = [];
        }
        // console.log('Google reviews loaded:', this.testimonials);
      },
      error: (error) => {
        // console.error('Error loading Google reviews:', error);
        // Keep testimonials empty on error
        this.testimonials = [];
      }
    });
  }

  /** -------------------
   * Load Home Statistics from WordPress
   * -------------------- */
  loadHomeStatistics(): void {
    this.isLoadingStats = true;

    this.wordpressService.getHomeStatistics().subscribe({
      next: (data: any) => {
        if (data && data.shared_cabs && data.reserved_cabs) {
          this.sharedCabsStats = data.shared_cabs;
          this.reservedCabsStats = data.reserved_cabs;

          // Load numbers section stats if available
          if (data.numbers_section && Array.isArray(data.numbers_section)) {
            this.numbersSectionStats = data.numbers_section;
          } else {
            // Fallback to default values
            this.numbersSectionStats = [
              { number: '7+', label: 'Years of service', description: 'Trusted experience in the travel industry', icon: 'assets/images/icon1.png' },
              { number: '201,574+', label: 'Passengers Served', description: 'Happy customers who chose our service', icon: 'assets/images/icon2.png' },
              { number: '180,801+', label: 'Trips Completed', description: 'Successful journeys across destinations', icon: 'assets/images/icon3.png' },
              { number: '23,401,092+', label: 'Kilometers Covered', description: 'Miles of safe and comfortable travel', icon: 'assets/images/icon4.png' }
            ];
          }

          // Load special offers section if available
          if (data.special_offers_section) {
            this.specialOffersSection = {
              heading: data.special_offers_section.heading || 'Special Offers',
              description: data.special_offers_section.description || 'Grab the best deals and discounts on flights, hotels, and cab bookings'
            };
          }
        } else {
          // Fallback to default values if API fails
          this.sharedCabsStats = [
            { number: '60%', label: 'Cost Savings' },
            { number: '10K+', label: 'Daily Rides' },
            { number: '4.8⭐', label: 'User Rating' },
            { number: '100+', label: 'Cities Covered' }
          ];
          this.reservedCabsStats = [
            { number: '5⭐', label: 'Service Rating' },
            { number: '98%', label: 'On-Time Performance' },
            { number: '500+', label: 'Premium Vehicles' },
            { number: '24/7', label: 'Available Service' }
          ];
          this.numbersSectionStats = [
            { number: '7+', label: 'Years of service', description: 'Trusted experience in the travel industry', icon: 'assets/images/icon1.png' },
            { number: '201,574+', label: 'Passengers Served', description: 'Happy customers who chose our service', icon: 'assets/images/icon2.png' },
            { number: '180,801+', label: 'Trips Completed', description: 'Successful journeys across destinations', icon: 'assets/images/icon3.png' },
            { number: '23,401,092+', label: 'Kilometers Covered', description: 'Miles of safe and comfortable travel', icon: 'assets/images/icon4.png' }
          ];
        }
        this.isLoadingStats = false;
        // console.log('Home statistics loaded:', { shared: this.sharedCabsStats, reserved: this.reservedCabsStats, numbers: this.numbersSectionStats });
      },
      error: (error) => {
        // console.error('Error loading home statistics:', error);
        // Fallback to default values on error
        this.sharedCabsStats = [
          { number: '60%', label: 'Cost Savings' },
          { number: '10K+', label: 'Daily Rides' },
          { number: '4.8⭐', label: 'User Rating' },
          { number: '100+', label: 'Cities Covered' }
        ];
        this.reservedCabsStats = [
          { number: '5⭐', label: 'Service Rating' },
          { number: '98%', label: 'On-Time Performance' },
          { number: '500+', label: 'Premium Vehicles' },
          { number: '24/7', label: 'Available Service' }
        ];
        this.numbersSectionStats = [
          { number: '7+', label: 'Years of service', description: 'Trusted experience in the travel industry', icon: 'assets/images/icon1.png' },
          { number: '201,574+', label: 'Passengers Served', description: 'Happy customers who chose our service', icon: 'assets/images/icon2.png' },
          { number: '180,801+', label: 'Trips Completed', description: 'Successful journeys across destinations', icon: 'assets/images/icon3.png' },
          { number: '23,401,092+', label: 'Kilometers Covered', description: 'Miles of safe and comfortable travel', icon: 'assets/images/icon4.png' }
        ];
        this.isLoadingStats = false;
      }
    });
  }

  /** -------------------
   * Load Homepage Popup from WordPress
   * -------------------- */
  loadHomepagePopup(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isLoadingPopup = true;

    this.wordpressService.getHomepagePopup().subscribe({
      next: (response: any) => {
        if (response.success && response.image) {
          this.homepagePopupData = response;

          // Check if popup should be shown only once
          if (response.show_once) {
            const popupShown = localStorage.getItem('homepage_popup_shown');
            if (popupShown) {
              this.isLoadingPopup = false;
              return;
            }
          }

          // Show popup after delay
          const delay = (response.delay_seconds || 2) * 1000;
          setTimeout(() => {
            this.showHomepagePopup = true;

            // Mark as shown if show_once is true
            if (response.show_once) {
              localStorage.setItem('homepage_popup_shown', 'true');
            }
          }, delay);
        }
        this.isLoadingPopup = false;
      },
      error: (error) => {
        // console.error('Error loading homepage popup:', error);
        this.isLoadingPopup = false;
      }
    });
  }

  /** -------------------
   * Close Homepage Popup
   * -------------------- */
  closeHomepagePopup(): void {
    this.showHomepagePopup = false;
  }

  /** -------------------
   * Handle Homepage Popup Button Click
   * -------------------- */
  onHomepagePopupButtonClick(): void {
    if (this.homepagePopupData?.button_url) {
      // Check if URL is external or internal
      if (this.homepagePopupData.button_url.startsWith('http')) {
        window.open(this.homepagePopupData.button_url, '_blank');
      } else {
        this.router.navigate([this.homepagePopupData.button_url]);
      }
    }
    this.closeHomepagePopup();
  }

  /**
   * Set dynamic default airports for flight booking
   * Tries to find Delhi and Mumbai, otherwise uses first two airports
   */
  private setDefaultAirports(): void {
    if (!this.flightAirports || this.flightAirports.length === 0) {
      return;
    }

    // Don't set defaults on mobile - let users select cities manually
    if (this.isMobileView()) {
      return;
    }

    // Try to find Delhi (DEL) and Mumbai (BOM) by code or name
    // const delhiAirport = this.flightAirports.find(airport =>
    //   airport.code === 'DEL' ||
    //   airport.name.toLowerCase().includes('delhi') ||
    //   airport.name.toLowerCase().includes('indira gandhi')
    // );

    // const mumbaiAirport = this.flightAirports.find(airport =>
    //   airport.code === 'BOM' ||
    //   airport.name.toLowerCase().includes('mumbai') ||
    //   airport.name.toLowerCase().includes('chhatrapati')
    // );

    // Use found airports or fallback to first two airports
    // const defaultFrom = delhiAirport || this.flightAirports[0];
    // const defaultTo = mumbaiAirport || (this.flightAirports.length > 1 ? this.flightAirports[1] : this.flightAirports[0]);

    // Format: "CityName (CODE)"
    // const defaultFromDisplay = defaultFrom.code
    //   ? `${defaultFrom.name} (${defaultFrom.code})`
    //   : defaultFrom.name;
    // const defaultToDisplay = defaultTo.code
    //   ? `${defaultTo.name} (${defaultTo.code})`
    //   : defaultTo.name;

    // Always update flightRoutes with dynamic defaults
    if (this.flightRoutes.length > 0) {
      // Only update if still using static defaults or empty
      if (!this.flightRoutes[0].from || this.flightRoutes[0].from === 'Delhi' ||
        this.flightRoutes[0].from === 'Mumbai' ||
        !this.flightRoutes[0].to || this.flightRoutes[0].to === 'Delhi' ||
        this.flightRoutes[0].to === 'Mumbai') {
        // this.flightRoutes[0].from = defaultFromDisplay;
        // this.flightRoutes[0].to = defaultToDisplay;
      }
    }

    // Always update formValues with dynamic defaults
    if (!this.formValues.flightFrom || this.formValues.flightFrom === 'Delhi' ||
      this.formValues.flightFrom === 'Mumbai' ||
      !this.formValues.flightTo || this.formValues.flightTo === 'Delhi' ||
      this.formValues.flightTo === 'Mumbai') {
      // this.formValues.flightFrom = defaultFromDisplay;
      // this.formValues.flightTo = defaultToDisplay;
    }

    // console.log('Default airports set:', { from: defaultFromDisplay, to: defaultToDisplay });
  }

  /**
   * Try to read browser geolocation and re-order airports so nearest appear first.
   * Silent no-op if permission denied or coords unavailable.
   */
  private requestUserLocationForAirports(): void {
    if (!isPlatformBrowser(this.platformId) || this.geolocationRequested) {
      return;
    }

    this.geolocationRequested = true;

    if (!('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.sortAirportsByDistance();
      },
      () => {
        // Ignore errors (user denied or unavailable); keep default ordering
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000
      }
    );
  }

  /**
   * Sort flightAirports in-place by distance to the user's coordinates, keeping
   * airports without coordinates at the end.
   */
  private sortAirportsByDistance(): void {
    if (!this.userLocation || !this.flightAirports || this.flightAirports.length === 0) {
      return;
    }

    const { lat: userLat, lng: userLng } = this.userLocation;

    const withCoords = this.flightAirports.filter(a => this.hasAirportCoordinates(a));
    const withoutCoords = this.flightAirports.filter(a => !this.hasAirportCoordinates(a));

    withCoords.sort((a, b) => {
      const distA = this.calculateDistanceKm(userLat, userLng, a.lat!, a.lng!);
      const distB = this.calculateDistanceKm(userLat, userLng, b.lat!, b.lng!);
      return distA - distB;
    });

    this.flightAirports = [...withCoords, ...withoutCoords];
  }

  private hasAirportCoordinates(airport: City): airport is City & { lat: number; lng: number } {
    return typeof airport.lat === 'number' && !isNaN(airport.lat) &&
      typeof airport.lng === 'number' && !isNaN(airport.lng);
  }

  // Haversine formula
  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (value: number) => value * Math.PI / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private extractAirportCoordinates(item: any): { lat?: number; lng?: number } {
    const latCandidate = item?.LATITUDE ?? item?.latitude ?? item?.LAT ?? item?.lat;
    const lngCandidate = item?.LONGITUDE ?? item?.longitude ?? item?.LON ?? item?.lon ?? item?.LNG ?? item?.lng;

    const lat = latCandidate !== undefined ? parseFloat(latCandidate) : undefined;
    const lng = lngCandidate !== undefined ? parseFloat(lngCandidate) : undefined;

    return {
      lat: Number.isFinite(lat) ? lat : undefined,
      lng: Number.isFinite(lng) ? lng : undefined
    };
  }

  /**
   * Extract city name from display value
   * Handles formats like "Delhi (DEL)" -> "Delhi" or "DEL - Delhi" -> "Delhi"
   */
  private extractCityNameFromDisplay(displayValue: string): string {
    if (!displayValue) return '';

    // If format is "CityName (CODE)", extract just the city name
    const matchWithParens = displayValue.match(/^([^(]+)\s*\(/);
    if (matchWithParens) {
      return matchWithParens[1].trim();
    }

    // If format is "CODE - CityName", extract city name
    const matchWithDash = displayValue.match(/-\s*(.+)$/);
    if (matchWithDash) {
      return matchWithDash[1].trim();
    }

    // Otherwise, return as is
    return displayValue.trim();
  }

  /**
   * Extract airport code from display value
   * Handles formats like "Delhi (DEL)" -> "DEL" or "DEL - Delhi" -> "DEL"
   */
  private extractAirportCode(displayValue: string): string {
    if (!displayValue) return '';

    // If format is "CityName (CODE)", extract the code
    const matchWithParens = displayValue.match(/\(([^)]+)\)/);
    if (matchWithParens) {
      return matchWithParens[1].trim();
    }

    // If format is "CODE - CityName", extract code
    const matchWithDash = displayValue.match(/^([^-]+)\s*-/);
    if (matchWithDash) {
      return matchWithDash[1].trim();
    }

    // Otherwise, try to find in flightAirports
    const cityName = this.extractCityNameFromDisplay(displayValue);
    const airport = this.flightAirports.find(a =>
      a.name.toLowerCase() === cityName.toLowerCase()
    );
    return airport ? airport.code : '';
  }

  /**
   * Check if phone number is blocked
   */
  async checkIfNumberBlocked(phoneNumber: string): Promise<boolean> {
    try {
      // Check with just the phone number
      const response1: any = await this.apiService.getCheckedBlockedNumber(phoneNumber).toPromise();
      if (response1 === 'BLOCKED') {
        return true;
      }

      // If phone number includes country code, also check without country code
      if (phoneNumber.length > 10) {
        // Extract last 10 digits
        const numberWithoutCode = phoneNumber.slice(-10);
        const response2: any = await this.apiService.getCheckedBlockedNumber(numberWithoutCode).toPromise();
        if (response2 === 'BLOCKED') {
          return true;
        }
      }

      // Also check with country code if not already included
      if (phoneNumber.length === 10 && this.selectedCountryCode) {
        const numberWithCode = this.selectedCountryCode + phoneNumber;
        const response3: any = await this.apiService.getCheckedBlockedNumber(numberWithCode).toPromise();
        if (response3 === 'BLOCKED') {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking blocked number:', error);
      // If API fails, allow the search to proceed (fail open for better UX)
      return false;
    }
  }

  /**
   * Strip time from date
   */
  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Store flight data for navigation to flightlist page
   */
  private storeFlightDataForNavigation(): void {
    const fromValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.from
      : (this.flightRoutes[0]?.from || this.formValues.flightFrom);
    const toValue = this.tripType === 'multi-city'
      ? this.flightRoutes[0]?.to
      : (this.flightRoutes[0]?.to || this.formValues.flightTo);

    const fromCode = this.extractAirportCode(fromValue);
    const toCode = this.extractAirportCode(toValue);
    const fromCity = this.extractCityNameFromDisplay(fromValue);
    const toCity = this.extractCityNameFromDisplay(toValue);

    // Find airport details
    const fromAirport = this.flightAirports.find(a => a.code === fromCode);
    const toAirport = this.flightAirports.find(a => a.code === toCode);

    const flightData = {
      tboToken: this.tboTokenId,
      ipAddress: this.ip,
      tripType: this.tripType === 'one-way' ? 'oneway' : this.tripType === 'round-trip' ? 'round' : 'multi',
      fromCity: fromCity || '',
      fromAirport: fromAirport?.name || '',
      fromAirportCode: fromCode || '',
      toCity: toCity || '',
      toAirport: toAirport?.name || '',
      toAirportCode: toCode || '',
      departureDate: this.tripType === 'multi-city'
        ? this.flightRoutes[0]?.date
        : (this.flightRoutes[0]?.date || this.formValues.flightDeparture),
      returnDate: this.tripType === 'round-trip' ? this.formValues.flightReturn : null,
      fareType: this.fareType,
      adults: this.counts.adults,
      children: this.counts.children,
      infants: this.counts.infants,
      travelClass: this.selectedClass,
      calendarFareMap: Object.fromEntries(this.calendarFareMap),
      calendarFareMapReturn: Object.fromEntries(this.calendarFareMapReturn),
      multiCityRoutes: this.tripType === 'multi-city' ? this.flightRoutes.map(route => ({
        from: route.from,
        to: route.to,
        date: route.date
      })) : []
    };

    // Store in localStorage for flightlist component
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('flightSearchData', JSON.stringify(flightData));
    }

    // console.log('Flight data stored for navigation:', flightData);
    // console.log('TBO Token being stored:', flightData.tboToken);
    // console.log('IP Address being stored:', flightData.ipAddress);

    // Validate critical data before storing
    if (!flightData.tboToken) {
      // console.error('WARNING: TBO Token is null/undefined when storing flight data!');
    }
    if (!flightData.ipAddress) {
      // console.error('WARNING: IP Address is missing when storing flight data!');
    }
  }

  /**
   * Fetch calendar fare for full year
   */
  fetchFullYearCalendarFare(direction: 'departure' | 'return' = 'departure'): void {
    // Use selectedFrom/selectedTo objects (matching working code)
    if (!this.selectedFrom || !this.selectedTo || !this.tboTokenId || !this.ip) {
      return;
    }

    const fromCode = direction === 'departure'
      ? this.selectedFrom.code
      : this.selectedTo.code;
    const toCode = direction === 'departure'
      ? this.selectedTo.code
      : this.selectedFrom.code;

    if (!fromCode || !toCode) {
      return;
    }

    const mapToUse = direction === 'departure' ? this.calendarFareMap : this.calendarFareMapReturn;
    mapToUse.clear();

    const today = new Date();
    const startMonth = today.getMonth();
    const startYear = today.getFullYear();
    const fetchPromises = [];

    for (let i = 0; i < 12; i++) {
      const start = i === 0 ? new Date(today) : new Date(startYear, startMonth + i, 1);
      const end = this.getMonthEndDate(new Date(startYear, startMonth + i, 1));

      const startDate = this.formatToISO(start);
      const endDate = this.formatToISO(end);

      const promise = this.apiService
        .getCalendarFare(this.ip, this.tboTokenId, 'oneway', fromCode, toCode, 'all', startDate, endDate)
        .toPromise()
        .then((res: any) => {
          // console.log("values of calendar", res);
          const results = res?.Response?.SearchResults || [];

          results.forEach((fareItem: any) => {
            const raw = fareItem.DepartureDate;
            const istDate = new Date(new Date(raw).getTime() + 5.5 * 60 * 60 * 1000);
            const iso = this.formatToISO(istDate);

            mapToUse.set(iso, {
              date: iso,
              price: fareItem.Fare,
              airline: fareItem.AirlineName,
              isLowest: fareItem.IsLowestFareOfMonth
            });
          });
        });

      fetchPromises.push(promise);
    }

    Promise.all(fetchPromises).then(() => {
      if (direction === 'departure') {
        this.calendarFareFetched = true;
      }
      // Calendar fare fetched successfully
      // console.log('Calendar fare fetched for', direction);
    });
  }

  /**
   * Format date to ISO string
   */
  private formatToISO(date: Date): string {
    const istOffset = 5.5 * 60; // in minutes
    const istTime = new Date(date.getTime() + istOffset * 60000);
    const year = istTime.getUTCFullYear();
    const month = (istTime.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = istTime.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get month end date
   */
  private getMonthEndDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  /**
   * Handle airport selection for calendar fare fetching
   * Matches working code's selectFrom/selectTo methods
   */
  onAirportSelected(type: 'from' | 'to', airportValue: string): void {
    // Extract airport code from display value
    const airportCode = this.extractAirportCode(airportValue);

    // Find airport object from flightAirports list
    const airport = this.flightAirports.find(a => a.code === airportCode);

    if (airport) {
      const airportObj = {
        name: airport.name,
        code: airport.code,
        airport: airport.name // Using name as airport for now
      };

      if (type === 'from') {
        this.selectedFrom = airportObj;
        this.selectedFromAirport = airportValue;
      } else {
        this.selectedTo = airportObj;
        this.selectedToAirport = airportValue;
      }
    } else {
      // Fallback: set string values if airport not found
      if (type === 'from') {
        this.selectedFromAirport = airportValue;
      } else {
        this.selectedToAirport = airportValue;
      }
    }

    // Clear calendar fare maps when airports change (matching working code)
    this.calendarFareFetched = false;
    this.fullYearCalendarFare = [];
    this.calendarFareMap.clear();
    this.calendarFareMapReturn.clear();

    // Fetch calendar fare if both airports are selected (matching working code)
    if (this.selectedFrom && this.selectedTo) {
      this.fetchFullYearCalendarFare('departure');
      if (this.tripType === 'round-trip') {
        this.fetchFullYearCalendarFare('return');
      }
    }
  }

}