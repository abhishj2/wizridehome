import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,ElementRef, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

interface City {
  name: string;
  code: string;
  state: string;
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

@Component({
  selector: 'app-travel-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
    services = [
    {
      id: 1,
      title: 'International Packages',
      description: 'Explore the world with our curated international travel packages. Hassle-free planning for your global adventures.',
      image: '../assets/images/international.jpg',
      link:'https://wizzride.com/ourservices/holidaystours/Wizzride-International-Holiday-Planner/'
    },
    {
      id: 2,
      title: 'Flight & Hotel Bookings',
      description: 'Simplify your travel with our flight and hotel booking services. Best deals, easy reservations, and 24/7 support.',
      image: '../assets/images/flight.jpg',
      link:'https://wizzride.com/flight-booking'
      
    },
    {
      id: 3,
      title: 'Luxury Shared Taxis',
      description: 'Enjoy premium shared taxi rides with top-notch comfort and convenience. On-time departures, spacious seating, and budget-friendly fares for all.',
      image: 'https://wizzride.com/assets/images_new/wizcar.jpeg',
      link:'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/'
    },
    
   
    {
      id:4,
      title: 'Expert Holiday Planner',
      description: 'Let our experts plan your dream holiday. From itineraries to bookings, we ensure a seamless and memorable travel experience.',
      image: '../assets/images/holiday.jpg',
      link:'https://wizzride.com/ourservices/holidaystours/'
    },
    {
      id: 5,
      title: 'Private Reserved Cabs',
      description: 'Book a private cab for a personalized travel experience. Perfect for families, groups, or solo travelers seeking privacy.',
      image: 'https://wizzride.com/assets/images_new/ridetoairport_3.jpg',
      link:'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/'
     
    },
 
  ];
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Shin Tae',
      location: 'Guwahati, Assam',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW9XkZcnJ9unApgswH-n9yaY9o_8wqmYTPFewdzV8cKoV1Llkhd=w60-h60-p-rp-mo-ba3-br100',
      rating: 5,
      text: 'Luxury ride for a reasonable price. Instead of taking the local taxis from Shillong to Guwahati, opt for WizzRide. They give u an amazing ride for the same price of the local taxis. AC, complimentary snacks and enough space for a comfortable ride.',
      isVerified: true
    },
    {
      id: 2,
      name: 'Anisha Bafna',
      location: 'Shillong, Meghalaya',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjVpO-1WuShjg-gRa9B32C8F8xQP8i0DWT53AFj8GWm9hXGZms1a0w=w60-h60-p-rp-mo-ba3-br100',
      rating: 5,
      text: 'Punctual and professional... Drivers know there job very well... Also, on customer support a special mention to Sanjay who been very helpful when asked various questions about the pickup/drop points and also Adhar who helped me to change the pickup timing. You guys are doing very well and I would recommend people to use their services.',
      isVerified: true
    },
    {
      id: 3,
      name: 'Subrata Sen',
      location: 'Darjeeling, West Bengal',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjUAU5-omdu4KAXKVbJ2HB3NLhv-O8yomE6H1VhL3AKxL2P4LFToPw=w60-h60-p-rp-mo-ba2-br100',
      rating: 5,
      text: 'Excellent services by Wizzride. I use to avail this facility from Guwahati to Shillong and vice versa. The vehicle is well maintained and drivers are well behaved. The recently introduced Home pickup & drop facility is also very much helpful. Please keep it up 👍👍',
      isVerified: true
    },
    {
      id: 4,
      name: 'Sourav Ganguly',
      location: 'Gangtok, Sikkim',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXdCeN4QWS1UD0s7gpW4ro13xg-c6o-cZDFiZeY2IUgfxMpIy0m=w81-h81-p-rp-mo-ba4-br100',
      rating: 5,
      text: 'I had a good first experience with WIZZRIDE service recently booked a cab from Siliguri to darjeeling. The booking process was simple and user-friendly. The cab arrived on time, the vehicle was clean, and the ride was smooth and comfortable. the driver was courteous and professional, felt safe throughout the journey, and the fare was reasonable too. Overall, it was a convenient and pleasant way to travel—definitely a service I’d use again.',
      isVerified: true
    },
    {
      id: 5,
      name: 'Vinny P Mathew',
      location: 'Bagdogra, West Bengal',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjU5Klc_GVjMjPUYCyGM9WNoqgmema4EfwAAXT55TAjgWxykf_baHw=w81-h81-p-rp-mo-ba5-br100',
      rating: 5,
      text: 'Amazing service from Wizzride is hands down one of the best shared cab services in the Northeast! Always on time, with soft-spoken and professional drivers, clean and well-maintained cabs, and excellent coordination with customers. The experience is smooth and hassle-free every time. Also, it’s super pocket-friendly, which makes it even better. I truly hope Wizzride expands to other states soon — we need more services like this across India. Keep up the great work!',
      isVerified: true
    },
    {
      id: 6,
      name: 'Kapil khatiwara',
      location: 'Kalimpong, West Bengal',
      avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjXPO5HRBOfekxRFTtgC2fEbSgS8DuiENBQazOp2GElIk4FUxeCe=w81-h81-p-rp-mo-br100',
      rating: 5,
      text: 'The ride was incredibly comfortable, and the driver was punctual and courteous. But what truly stood out was the exceptional customer support provided by Miss Easther. She was extremely helpful, responding to all my queries in a professional and friendly manner. Her dedication to ensuring a smooth experience made all the difference. Highly recommend!',
      isVerified: true
    }
  ];
// Testimonials Slider Properties
@ViewChild('testimonialTrack', { static: false }) testimonialTrack!: ElementRef<HTMLDivElement>;

testimonialCurrentSlide = 0;
testimonialTotalSlides = 0;
testimonialSlideInterval: any = null;
testimonialSlideDuration = 4000; // 4 seconds
isTestimonialHovered = false;

// Add these methods to your HomeComponent class

// Initialize testimonials slider after view init
private initTestimonialsSlider(): void {
  this.testimonialTotalSlides = this.testimonials.length;
  setTimeout(() => {
    this.startTestimonialAutoPlay();
  }, 1000);
}

// Auto-play functionality
startTestimonialAutoPlay(): void {
  if (this.testimonialSlideInterval) {
    clearInterval(this.testimonialSlideInterval);
  }
  
  this.testimonialSlideInterval = setInterval(() => {
    if (!this.isTestimonialHovered) {
      this.nextTestimonialSlide();
    }
  }, this.testimonialSlideDuration);
}

stopTestimonialAutoPlay(): void {
  if (this.testimonialSlideInterval) {
    clearInterval(this.testimonialSlideInterval);
    this.testimonialSlideInterval = null;
  }
}

// Slide navigation
nextTestimonialSlide(): void {
  this.testimonialCurrentSlide = (this.testimonialCurrentSlide + 1) % this.testimonialTotalSlides;
  this.updateTestimonialSlider();
}

prevTestimonialSlide(): void {
  this.testimonialCurrentSlide = this.testimonialCurrentSlide === 0 
    ? this.testimonialTotalSlides - 1 
    : this.testimonialCurrentSlide - 1;
  this.updateTestimonialSlider();
}

goToTestimonialSlide(slideIndex: number): void {
  this.testimonialCurrentSlide = slideIndex;
  this.updateTestimonialSlider();
  // Restart autoplay after manual navigation
  this.startTestimonialAutoPlay();
}

// Update slider position
updateTestimonialSlider(): void {
  if (this.testimonialTrack) {
    const slideWidth = this.getTestimonialSlideWidth();
    const translateX = -this.testimonialCurrentSlide * slideWidth;
    
    this.testimonialTrack.nativeElement.style.transform = `translateX(${translateX}%)`;
  }
}

// Calculate slide width based on screen size
getTestimonialSlideWidth(): number {
  const windowWidth = window.innerWidth;
  
  if (windowWidth <= 768) {
    return 100; // Full width on mobile (1 card)
  } else if (windowWidth <= 1024) {
    return 50; // Half width on tablet (2 cards)
  } else {
    return 33.333; // Third width on desktop (3 cards)
  }
}

// Mouse hover events
onTestimonialMouseEnter(): void {
  this.isTestimonialHovered = true;
}

onTestimonialMouseLeave(): void {
  this.isTestimonialHovered = false;
}

// Helper methods for template
getStarArray(rating: number): number[] {
  return new Array(rating).fill(0);
}

getTestimonialDotArray(): number[] {
  return new Array(this.testimonialTotalSlides).fill(0);
}

// Touch/Swipe functionality for mobile
private testimonialStartX = 0;
private testimonialEndX = 0;
private minTestimonialSwipeDistance = 50;

onTestimonialTouchStart(event: TouchEvent): void {
  this.testimonialStartX = event.touches[0].clientX;
}

onTestimonialTouchEnd(event: TouchEvent): void {
  this.testimonialEndX = event.changedTouches[0].clientX;
  this.handleTestimonialSwipe();
}

private handleTestimonialSwipe(): void {
  const diffX = this.testimonialStartX - this.testimonialEndX;
  
  if (Math.abs(diffX) > this.minTestimonialSwipeDistance) {
    if (diffX > 0) {
      // Swipe left - next slide
      this.nextTestimonialSlide();
    } else {
      // Swipe right - previous slide
      this.prevTestimonialSlide();
    }
    // Restart autoplay after swipe
    this.startTestimonialAutoPlay();
  }
}

// Responsive handling
onTestimonialWindowResize(): void {
  this.updateTestimonialSlider();
}

// TrackBy function for better performance
trackByTestimonial(index: number, testimonial: Testimonial): number {
  return testimonial.id;
}
  // Duplicate services for infinite loop
  get infiniteServices() {
    return [...this.services, ...this.services, ...this.services];
  }
  private destroy$ = new Subject<void>();

  // Tabs & State
  currentTab = 'shared-cabs';
  previousTab: string | null = null;
  isSliding = false;

  // Flight-specific
  selectedClass = 'economy';
  tripType = 'one-way'; // 'one-way', 'round-trip', 'multi-city'
  counts: TravelerCounts = { adults: 1, children: 0, infants: 0 };
  flightRoutes: { 
    from: string; 
    to: string; 
    date: string;
  }[] = [
    { 
      from: 'Delhi', 
      to: 'Mumbai', 
      date: ''
    }
  ];

  // Popups
  isTravelersOpen = false;
  showPhonePopup = false;
  phoneNumber = '';
  popupTitle = '';
  pendingAction: 'flights' | 'shared' | 'reserved' | null = null;

  // Selected cities
  selectedCities: SelectedCities = {
    shared: { pickup: '', dropoff: '' },
    reserved: { pickup: '', dropoff: '' },
    flights: { from: 'Chandigarh', to: 'Bagdogra' },
  };

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

  // Form values
  formValues = {
    flightFrom: 'Delhi',
    flightTo: 'Mumbai',
    flightDeparture: '',
    flightReturn: '',
    sharedPickup: 'Delhi',
    sharedDropoff: 'Mumbai',
    sharedDateTime: '',
    sharedPassengers: 1,
    sharedPickupLocation: '',
    sharedDropoffLocation: '',
    reservedPickup: 'Delhi',
    reservedDropoff: 'Mumbai',
    reservedDate: '',
    reservedTime: '',
    reservedPassengers: 1,
    reservedPickupLocation: '',
    reservedDropoffLocation: '',
  };

  tabs = ['shared-cabs', 'reserved-cabs', 'flights'];

  // Validation methods
  isSameCitySelected(pickup: string, dropoff: string): boolean {
    return !!(pickup && dropoff && pickup.toLowerCase() === dropoff.toLowerCase());
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.next();
  this.destroy$.complete();
  
  // Clean up testimonials interval
  this.stopTestimonialAutoPlay();
  }

  ngAfterViewInit() {
    this.initDatepickers();
    const currentIndex = this.tabs.indexOf(this.currentTab);
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.setAttribute('data-active', currentIndex.toString());
    }

    
  this.initTestimonialsSlider();
  }

  /** -------------------
   * Datepicker Handling
   -------------------- */
  private initDatepickers() {
    // console.log('Initializing datepickers for trip type:', this.tripType);
    
    const selectors = [
      '.datecab',
      '.datecabreserved-date',
      '.datecabreserved-time',
      '.dateflight-departure',
      '.dateflight-return',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll<HTMLInputElement>(selector);
      elements.forEach((el) => {
        const anyEl = el as any;
        if (anyEl._flatpickr) {
          try {
            anyEl._flatpickr.destroy();
          } catch {}
        }

        if (selector === '.datecabreserved-date') {
          flatpickr(el, {
            enableTime: false,
            dateFormat: 'Y-m-d',
            minDate: 'today',
            defaultDate: this.formValues.reservedDate || new Date(),
            monthSelectorType: 'static',
            prevArrow: '<span class="flatpickr-prev">&lt;</span>', // left arrow
            nextArrow: '<span class="flatpickr-next">&gt;</span>', // right arrow
            onChange: (selectedDates, dateStr) => {
              this.formValues.reservedDate = dateStr;
            },
          });
        } else if (selector === '.datecabreserved-time') {
          flatpickr(el, {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
            time_24hr: true,
            defaultDate: this.formValues.reservedTime || '12:00',
            monthSelectorType: 'static',
            prevArrow: '<span class="flatpickr-prev">&lt;</span>', // left arrow
            nextArrow: '<span class="flatpickr-next">&gt;</span>', // right arrow
            onChange: (selectedDates, dateStr) => {
              this.formValues.reservedTime = dateStr;
            },
          });
        } else if (selector === '.dateflight' || selector === '.datecab') {
          flatpickr(el, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        defaultDate: this.formValues.flightDeparture || new Date(),
        monthSelectorType: 'static',
        prevArrow: '<span class="flatpickr-prev">&lt;</span>', // left arrow
        nextArrow: '<span class="flatpickr-next">&gt;</span>', // right arrow
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          this.formValues.flightDeparture = dateStr;
              if (
                this.tripType === 'round-trip' &&
                this.formValues.flightReturn < dateStr
              ) {
            this.formValues.flightReturn = '';
                this.initReturnPickerMinDate();
          }
            },
      });
        } else if (selector === '.dateflight-departure' && this.tripType !== 'multi-city') {
          // Handle single/round-trip departure dates
          flatpickr(el, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        defaultDate: this.formValues.flightDeparture || new Date(),
        minDate: 'today',
        monthSelectorType: 'static',
        prevArrow: '<span class="flatpickr-prev">&lt;</span>', // left arrow
        nextArrow: '<span class="flatpickr-next">&gt;</span>', // right arrow
        onChange: (selectedDates, dateStr) => {
          this.formValues.flightDeparture = dateStr;
              if (
                this.tripType === 'round-trip' &&
                this.formValues.flightReturn < dateStr
              ) {
            this.formValues.flightReturn = '';
                this.initReturnPickerMinDate();
          }
            },
      });
        } else if (selector === '.dateflight-return') {
          flatpickr(el, {
        enableTime: false,
        dateFormat: 'Y-m-d',
            defaultDate: this.formValues.flightReturn || '',
        minDate: this.formValues.flightDeparture || 'today',
        monthSelectorType: 'static',
        prevArrow: '<span class="flatpickr-prev">&lt;</span>', // left arrow
        nextArrow: '<span class="flatpickr-next">&gt;</span>', // right arrow
        onChange: (selectedDates, dateStr) => {
          this.formValues.flightReturn = dateStr;
            },
          });
        }
      });
    });
    
    // Initialize multi-city datepickers only if in multi-city mode
    if (this.tripType === 'multi-city') {
      // console.log('Initializing multi-city datepickers');
      this.initMultiCityDatepickers();
    }
  }

  private initMultiCityDatepickers() {
    const multiCityDateElements = document.querySelectorAll<HTMLInputElement>('.dateflight-departure');
    // console.log('Found multi-city date elements:', multiCityDateElements.length);
    multiCityDateElements.forEach((el, index) => {
      const anyEl = el as any;
      if (anyEl._flatpickr) {
        try {
          anyEl._flatpickr.destroy();
        } catch {}
      }

      // Find the corresponding route index
      const routeIndex = this.findRouteIndexForElement(el);
      
      flatpickr(el, {
        enableTime: false,
        dateFormat: 'Y-m-d',
        defaultDate: this.flightRoutes[routeIndex]?.date || new Date(),
        minDate: 'today',
        onChange: (selectedDates, dateStr) => {
          if (routeIndex !== -1) {
            this.flightRoutes[routeIndex].date = dateStr;
          }
        },
      });
    });
  }

  private findRouteIndexForElement(element: HTMLInputElement): number {
    // Find the route index by looking at the parent form-row and counting previous form-rows
    const formRow = element.closest('.form-row');
    if (!formRow) return -1;
    
    const allFormRows = document.querySelectorAll('.form-row');
    const currentIndex = Array.from(allFormRows).indexOf(formRow as Element);
    return currentIndex;
  }

  private initReturnPickerMinDate() {
    const returnEls =
      document.querySelectorAll<HTMLInputElement>('.dateflight-return');
    returnEls.forEach((el) => {
      const anyEl = el as any;
      if (anyEl._flatpickr) {
        anyEl._flatpickr.set(
          'minDate',
          this.formValues.flightDeparture || 'today'
        );
      }
    });
  }

  /** -------------------
   * Tab Handling
   -------------------- */
   switchTab(tabName: string) {
    if (tabName !== this.currentTab && !this.isSliding) {
        this.previousTab = this.currentTab;
        this.isSliding = true;

        // Update nav tabs active state immediately for smooth color transition
        const currentIndex = this.tabs.indexOf(tabName);
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
            navTabs.setAttribute('data-active', currentIndex.toString());
        }

        setTimeout(() => {
            this.currentTab = tabName;
            setTimeout(() => {
                this.previousTab = null;
                this.isSliding = false;
                this.initDatepickers();
            }, 300);
        }, 100);
    }
}
  setTripType(type: string) {
    this.tripType = type;
    
    // Reset routes based on trip type
    if (type === 'multi-city') {
      this.flightRoutes = [
        { 
          from: 'Delhi', 
          to: 'Mumbai', 
          date: ''
        },
        { 
          from: 'Mumbai', 
          to: 'Bangalore', 
          date: ''
        }
      ];
    } else {
      this.flightRoutes = [
        { 
          from: 'Delhi', 
          to: 'Mumbai', 
          date: ''
        }
      ];
    }
    
    setTimeout(() => {
      this.initReturnPickerMinDate();
      this.initDatepickers(); // Re-initialize datepickers after trip type change
    }, 0);
  }

  /** -------------------
   * Phone modal handling
   -------------------- */
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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  cancelPhonePopup() {
    this.showPhonePopup = false;
    this.phoneNumber = '';
    this.pendingAction = null;
  }

  confirmPhonePopup() {
    if (!this.phoneNumber || !this.phoneNumber.trim()) {
      alert('Phone number is required!');
      return;
    }

    if (this.pendingAction === 'flights') {
      this.submitFlights();
    } else if (this.pendingAction === 'shared' || this.pendingAction === 'reserved') {
      this.submitCabs(this.pendingAction);
    }

    this.cancelPhonePopup();
  }

  /** -------------------
   * Form Submissions
   -------------------- */
  submitFlights() {
    let payload: any = {
      phoneNumber: this.phoneNumber,
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
        console.log('No valid routes found, including all routes for debugging');
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

    console.log('Final payload:', payload);
    alert('Flight booking submitted! Check console for details.');
  }

  submitCabs(type: 'shared' | 'reserved') {
    const cities = this.selectedCities[type];
    if (!cities.pickup || !cities.dropoff) {
      alert('Please select both pickup and drop-off cities first.');
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
      alert('Please enter specific pickup and drop-off locations within the selected cities.');
      return;
    }

    if (type === 'shared') {
      const payload = {
        phoneNumber: this.phoneNumber,
        type: 'shared',
        pickupCity: this.formValues.sharedPickup,
        dropoffCity: this.formValues.sharedDropoff,
        date: this.formValues.sharedDateTime,
        passengers: this.formValues.sharedPassengers,
        pickupLocation: this.formValues.sharedPickupLocation,
        dropoffLocation: this.formValues.sharedDropoffLocation,
      };
      console.log('Submitting shared cab booking:', payload);
      alert('Shared cab booking submitted! Check console for details.');
      return;
    }

    // reserved
    const payload = {
      phoneNumber: this.phoneNumber,
      type: 'reserved',
      pickupCity: this.formValues.reservedPickup,
      dropoffCity: this.formValues.reservedDropoff,
      reservedDate: this.formValues.reservedDate,
      reservedTime: this.formValues.reservedTime,
      passengers: this.formValues.reservedPassengers,
      pickupLocation: this.formValues.reservedPickupLocation,
      dropoffLocation: this.formValues.reservedDropoffLocation,
    };
    console.log('[ReservedCab] Submitting booking payload', payload);
    alert('Reserved cab booking submitted! Check console for details.');
  }

  showCitySuggestions(query: string, target: string) {
    // Only show suggestions on focus, not while typing
    if (!query.trim()) {
      delete this.activeSuggestions[target];
      return;
    }
  }

  showCitySuggestionsOnFocus(target: string) {
    // Show all cities when focusing on input
    this.activeSuggestions[target] = this.cities.slice(0, 8);
  }

  getMultiCitySuggestions(target: string): City[] {
    const suggestions = this.activeSuggestions[target];
    return this.isCityArray(suggestions) ? suggestions : [];
  }

  showLocationSuggestions(query: string, target: string) {
    if (!query.trim()) {
      delete this.activeSuggestions[target];
      return;
    }

    let cityName = '';
    if (target.includes('shared-pickup-specific')) {
      cityName = this.selectedCities.shared.pickup;
    } else if (target.includes('shared-dropoff-specific')) {
      cityName = this.selectedCities.shared.dropoff;
    } else if (target.includes('reserved-pickup-specific')) {
      cityName = this.selectedCities.reserved.pickup;
    } else if (target.includes('reserved-dropoff-specific')) {
      cityName = this.selectedCities.reserved.dropoff;
    }

    const cityLocations = this.locations[cityName] || [];
    const filteredLocations = cityLocations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);

    this.activeSuggestions[target] = filteredLocations;
  }

  selectCity(cityName: string, cityCode: string, target: string) {
    // Update form value
    if (target.includes('flight')) {
      if (target === 'flight-from') {
        this.formValues.flightFrom = `${cityCode} - ${cityName}`;
      } else {
        this.formValues.flightTo = `${cityCode} - ${cityName}`;
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
    } else if (target === 'shared-dropoff') {
      this.selectedCities.shared.dropoff = cityName;
    } else if (target === 'reserved-pickup') {
      this.selectedCities.reserved.pickup = cityName;
    } else if (target === 'reserved-dropoff') {
      this.selectedCities.reserved.dropoff = cityName;
    } else if (target === 'flight-from') {
      this.selectedCities.flights.from = cityName;
    } else if (target === 'flight-to') {
      this.selectedCities.flights.to = cityName;
    }

    // Clear suggestions
    delete this.activeSuggestions[target];

    // Check for location details
    if (target.includes('shared') || target.includes('reserved')) {
      this.checkAndShowLocationDetails(target);
    }
  }

  selectMultiCity(cityName: string, cityCode: string, target: string) {
    const routeIndex = parseInt(target.split('-')[2]);
    const field = target.split('-')[1]; // 'from' or 'to'
    
    if (field === 'from') {
      this.flightRoutes[routeIndex].from = `${cityCode} - ${cityName}`;
    } else {
      this.flightRoutes[routeIndex].to = `${cityCode} - ${cityName}`;
    }

    delete this.activeSuggestions[target];
  }

  addFlightRoute() {
    if (this.flightRoutes.length < 5) {
      this.flightRoutes.push({ 
        from: '', 
        to: '', 
        date: ''
      });
      
      // Re-initialize date pickers for the new route
      setTimeout(() => this.initMultiCityDatepickers(), 100);
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

    delete this.activeSuggestions[target];
  }

  checkAndShowLocationDetails(target: string) {
    const tabType = target.includes('reserved') ? 'reserved' : 'shared';
    const cities = this.selectedCities[tabType];

    if (cities.pickup && cities.dropoff) {
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
    } else {
      const temp = this.formValues.reservedPickup;
      this.formValues.reservedPickup = this.formValues.reservedDropoff;
      this.formValues.reservedDropoff = temp;

      const tempCity = this.selectedCities.reserved.pickup;
      this.selectedCities.reserved.pickup = this.selectedCities.reserved.dropoff;
      this.selectedCities.reserved.dropoff = tempCity;
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
    this.isTravelersOpen = !this.isTravelersOpen;
  }

  closeTravelersPanel() {
    this.isTravelersOpen = false;
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

  submitForm() {
  const phone = prompt("Please enter your phone number:");

  if (!phone) {
    alert("Phone number is required!");
    return;
  }

  const submissionData = {
    ...this.formValues,
    travelers: this.counts,
    travelClass: this.selectedClass,
    phoneNumber: phone
  };

  console.log("Form Submitted:", submissionData);
  alert("Form submitted! Check console for details.");
}


  searchFlights() {
    this.openPhonePopup('flights');
  }

  searchCabs(type: 'shared' | 'reserved') {
    const cities = this.selectedCities[type];

    if (!cities.pickup || !cities.dropoff) {
      alert('Please select both pickup and drop-off cities first.');
      return;
    }

    const pickupLocation = type === 'shared' 
      ? this.formValues.sharedPickupLocation 
      : this.formValues.reservedPickupLocation;
    const dropoffLocation = type === 'shared' 
      ? this.formValues.sharedDropoffLocation 
      : this.formValues.reservedDropoffLocation;

    if (!pickupLocation || !dropoffLocation) {
      alert('Please enter specific pickup and drop-off locations within the selected cities.');
      return;
    }

    this.openPhonePopup(type);
  }

  createGroupBooking() {
    alert('Redirecting to group booking... This would redirect to a specialized group booking form.');
  }

  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.travelers-dropdown')) {
      this.isTravelersOpen = false;
    }
    
    if (!target.closest('.city-select')) {
      this.activeSuggestions = {};
    }
  }

  isCityArray(arr: any): arr is City[] {
    return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && 'name' in arr[0];
  }
  trackByServiceId(index: number, service: any): number {
  return service.id;
}
}