import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
  Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomCalendarComponent } from '../calendar/calendar.component';

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
  imports: [CommonModule, FormsModule, CustomCalendarComponent],
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

  specialOffers = [
    {
      id: 1,
      title: 'Fly & Ride Stress-Free',
      description: 'Up to 20% OFF on Flight + Cab Packages',
      subtitle: 'Book your flight and enjoy a private cab from your home to the airport and back. Travel hassle-free from door to destination.',
      code: 'WRFLYCAB20',
      image: 'https://www.yatra.com/ythomepagecms/media/todayspick_home/2025/Aug/1dfd0ec10d44a54b92772dc7ea341368.jpg', // Add your image path
    },
    {
      id: 2,
      title: 'Your Schedule, Your Comfort',
      description: 'Flat ₹400 OFF on Intercity Flight Transfers',
      subtitle: 'Seamless travel between your city and major airports. Perfect for business or leisure trips.',
      code: 'WRINTER400',
      image: 'https://www.yatra.com/ythomepagecms/media/todayspick_home/2025/Aug/1dfd0ec10d44a54b92772dc7ea341368.jpg',
    },
    {
      id: 3,
      title: 'Reserve & Relax',
      description: '15% OFF on Private Cab Reservations',
      subtitle: ' Ideal for airport pickups, drop-offs, or connecting flights — reserve your cab and travel worry-free.',
      code: 'WRPRIVATE15',
      image: 'https://www.yatra.com/ythomepagecms/media/todayspick_home/2025/Aug/1dfd0ec10d44a54b92772dc7ea341368.jpg',
    },
    {
      id: 4,
      title: 'Airport Transfers Made Easy',
      description: 'Flat ₹250 OFF on Home-to-Airport & Airport-to-Home Cabs',
      subtitle: 'Enjoy convenient pickup and drop services along with your flight booking.',
      code: 'WRAIRPORT250',
      image: 'https://www.yatra.com/ythomepagecms/media/todayspick_home/2025/Aug/1dfd0ec10d44a54b92772dc7ea341368.jpg',
    }
  ];
  
// 3D Testimonial Carousel Properties
@ViewChild('testimonialSwiper', { static: false }) testimonialSwiper!: ElementRef;
currentSlide = 0;
totalSlides = 0;
autoplayInterval: any = null;
autoplayDuration = 5000; // 5 seconds
isHovered = false;

// Initialize 3D carousel
private init3DTestimonialCarousel(): void {
  this.totalSlides = this.testimonials.length;
  setTimeout(() => {
    this.startAutoplay();
  }, 1000);
}

// Auto-play functionality
startAutoplay(): void {
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
  if (this.autoplayInterval) {
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
  }
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

// Get slide class for positioning - exact same logic as vanilla JS
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

// TrackBy function for better performance
trackByTestimonial(index: number, testimonial: Testimonial): number {
  return testimonial.id;
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
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {
    // Set page title
    this.titleService.setTitle('Wizzride | Cab Booking from Shillong, Darjeeling, Gangtok');

    // Meta Description
    this.metaService.updateTag({ name: 'description', content: 'Book shared cabs from Bagdogra & Guwahati Airports to Darjeeling,Gangtok, Kalimpong,Shillong.Affordable rates,24/7 service,and safe rides across Northeast India.' });

    // Canonical URL - Add as link element
    this.setCanonicalUrl('https://wizzride.com/');

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
    });

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
    });
  }

  // Helper method to insert JSON-LD structured data
  private insertJsonLd(schema: any): void {
    const script = this.renderer2.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.renderer2.appendChild(this.document.head, script);
  }

  // Helper method to set canonical URL
  private setCanonicalUrl(url: string): void {
    // Remove existing canonical link if any
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      this.renderer2.removeChild(this.document.head, existingLink);
    }
    
    // Create and append new canonical link
    const link = this.renderer2.createElement('link');
    this.renderer2.setAttribute(link, 'rel', 'canonical');
    this.renderer2.setAttribute(link, 'href', url);
    this.renderer2.appendChild(this.document.head, link);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.next();
    this.destroy$.complete();
    
        // Clean up 3D carousel interval
        this.stopAutoplay();
  }

  ngAfterViewInit() {
    const currentIndex = this.tabs.indexOf(this.currentTab);
    const navTabs = document.querySelector('.nav-tabs');
    if (navTabs) {
        navTabs.setAttribute('data-active', currentIndex.toString());
    }

        // Initialize 3D testimonial carousel
        this.init3DTestimonialCarousel();
        
        // Initialize clock display
        if (this.formValues.reservedTime) {
            this.updateClockDisplay(this.formValues.reservedTime);
        }
  }

  /** -------------------
   * Custom Calendar Event Handlers
   -------------------- */
  
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
      if (this.tripType === 'round-trip' && this.formValues.flightReturn < date) {
        this.formValues.flightReturn = '';
      }
    }
  }

  // Flight return date selection
  onFlightReturnDateSelected(date: string) {
    this.formValues.flightReturn = date;
  }

  // Get minimum date for return flight picker
  getReturnMinDate(): string {
    return this.formValues.flightDeparture || this.getTodayDate();
  }

  // Get today's date in YYYY-MM-DD format
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
      // Trip type changed - no need to re-initialize datepickers
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
      console.log('No pending action, cannot navigate');
      return;
    }

    const searchParams = {
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

    console.log('Navigating to booking results with params:', searchParams);
    console.log('Router available:', !!this.router);

    try {
      // Store search params in localStorage as fallback
      localStorage.setItem('bookingSearchParams', JSON.stringify(searchParams));
      
      // Try router navigation first
      console.log('Attempting router navigation...');
      this.router.navigate(['/booking-results']).then(success => {
        console.log('Router navigation success:', success);
        if (!success) {
          console.log('Router navigation failed, trying window.location...');
          // Fallback to window.location
          window.location.href = '/booking-results';
        }
      }).catch(error => {
        console.error('Router navigation error:', error);
        console.log('Falling back to window.location...');
        // Fallback to window.location
        window.location.href = '/booking-results';
      });
    } catch (error) {
      console.error('Error during navigation:', error);
      // Final fallback
      window.location.href = '/booking-results';
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

  confirmPhonePopup() {
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
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      this.phoneError = 'Please enter a valid phone number (7-15 digits)';
      return;
    }

    // Store the full phone number with country code
    const completePhoneNumber = this.selectedCountryCode + this.phoneNumber;

    if (this.pendingAction === 'flights') {
      this.submitFlights(completePhoneNumber);
    } else if (this.pendingAction === 'shared' || this.pendingAction === 'reserved') {
      this.submitCabs(this.pendingAction, completePhoneNumber);
    }

    // Navigate to booking results page FIRST (before clearing pendingAction)
    console.log('About to navigate to booking results...');
    this.navigateToResults(completePhoneNumber);
    
    // Then close the modal
    this.cancelPhonePopup();
  }

  /** -------------------
   * Form Submissions
   -------------------- */
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

  submitCabs(type: 'shared' | 'reserved', phoneNumber?: string) {
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
        phoneNumber: phoneNumber || this.phoneNumber,
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
    console.log('[ReservedCab] Submitting booking payload', payload);
    alert('Reserved cab booking submitted! Check console for details.');
  }

  showCitySuggestions(query: string, target: string) {
    if (!query.trim()) {
      delete this.activeSuggestions[target];
      return;
    }

    // Filter cities based on the query
    const filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.code.toLowerCase().includes(query.toLowerCase())
    );

    // Show up to 8 matching cities
    this.activeSuggestions[target] = filteredCities.slice(0, 8);
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

  showLocationSuggestionsOnFocus(target: string) {
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
    this.activeSuggestions[target] = cityLocations.slice(0, 6);
  }

  hideLocationSuggestions(target: string) {
    // Add a small delay to allow click events to register before hiding
    setTimeout(() => {
      delete this.activeSuggestions[target];
    }, 200);
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
  }

  checkAndShowLocationDetails(target: string) {
    const tabType = target.includes('reserved') ? 'reserved' : 'shared';
    const cities = this.selectedCities[tabType];

    if (cities.pickup && cities.dropoff) {
      // For shared cabs, don't show location details if source and destination are the same
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
    // Validate date field
    if (!this.formValues.flightDeparture || !this.formValues.flightDeparture.trim()) {
      alert('Please select a departure date first.');
      return;
    }
    
    this.openPhonePopup('flights');
  }

  searchCabs(type: 'shared' | 'reserved') {
    const cities = this.selectedCities[type];

    if (!cities.pickup || !cities.dropoff) {
      alert('Please select both pickup and drop-off cities first.');
      return;
    }

    // Validate date field
    const dateField = type === 'shared' ? this.formValues.sharedDateTime : this.formValues.reservedDate;
    if (!dateField || !dateField.trim()) {
      alert('Please select a date first.');
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
      // Only clear suggestions if not clicking on a suggestion item
      if (!target.closest('.city-suggestion')) {
        this.activeSuggestions = {};
      }
    }
  }

  isCityArray(arr: any): arr is City[] {
    return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object' && 'name' in arr[0];
  }
  trackByServiceId(index: number, service: any): number {
  return service.id;
}

  /** -------------------
   * Time Input Methods for Reserved Cabs
   -------------------- */
  
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
    const hoursContainer = document.querySelector('.time-options') as HTMLElement;
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
    if (!time) return '12:00 PM';
    
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


}