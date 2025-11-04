import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';

interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
}

interface VehicleBrand {
  id: number;
  name: string;
  slug: string;
}

interface Testimonial {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    location_?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface Vehicle {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  vehicle_category: number[];
  vehicle_brand: number[];
  _embedded?: {
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
  acf?: {
    price: string;
    km: string;
    year: string;
    fuel: string;
    img: string;
    badge?: string;
    registrationyear: string;
    insurance: string;
    seats: number;
    rto: string;
    ownership: string;
    engine_displacement: string;
    transmission: string;
    manufactureyear: string;
    is_approved?: boolean | string | number | string[] | number[];
  };
}

@Component({
  selector: 'app-buyandsellcar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './buyandsellcar.component.html',
  styleUrl: './buyandsellcar.component.css'
})
export class BuyandsellcarComponent implements OnInit, OnDestroy {
  
  selectedAction: string = '';
  showBuyFields: boolean = false;
  submitButtonText: string = 'Select Action';
  submitButtonDisabled: boolean = true;

  // Form fields for buying (filters)
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedBudget: string = '';

  // Vehicle data
  allVehicles: Vehicle[] = [];
  featuredVehicles: Vehicle[] = [];
  isLoadingVehicles: boolean = true;

  // Filter options
  vehicleCategories: VehicleCategory[] = [];
  vehicleBrands: VehicleBrand[] = [];
  isLoadingCategories: boolean = true;
  isLoadingBrands: boolean = true;

  // Testimonials
  testimonials: Testimonial[] = [];
  isLoadingTestimonials: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setMetaTags();
    this.fetchVehicleCategories();
    this.fetchVehicleBrands();
    this.fetchFeaturedVehicles();
    this.fetchTestimonials();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  setMetaTags(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/sellyourcar');
    
    // SEO Metadata
    this.titleService.setTitle('Sell Your Car with Wizzride - Easy & Secure Across NE India');
    this.metaService.updateTag({
      name: 'description',
      content: 'Sell your car with Wizzride across Gangtok, Darjeeling, Siliguri, Shillong, and more. Enjoy a fast, easy, and secure process with fair valuations and seamless service.'
    });
    this.metaService.updateTag({
      name: 'title',
      content: 'Sell Your Car with Wizzride - Easy & Secure Across NE India'
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'buy used cars, sell cars online, used car marketplace, pre-owned cars, second hand cars, car dealers, vehicle marketplace India'
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Sell Your Car with Wizzride - Easy & Secure Across NE India' });
    this.metaService.updateTag({ property: 'og:description', content: 'Sell your car with Wizzride across Gangtok, Darjeeling, Siliguri, Shillong, and more. Enjoy a fast, easy, and secure process with fair valuations and seamless service.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/sellyourcar' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Sell Your Car with Wizzride - Easy & Secure Across NE India' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Buy and sell used cars with Wizzride. Browse verified vehicles, find your perfect car, or list your vehicle for sale.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // FAQ JSON-LD Schema
   
    // BreadcrumbList JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Sell Your Car",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/sellyourcar"
          }
        }
      ]
    });

    // Organization/LocalBusiness JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Wizzride Buy & Sell Cars",
      "image": "https://wizzride.com/assets/images/icons/logo2.webp",
      "description": "Buy and sell used cars with Wizzride. Browse verified vehicles, find your perfect car, or list your vehicle for sale.",
      "url": "https://wizzride.com/sellyourcar",
      "telephone": "+91-9775999444",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Siliguri",
        "addressRegion": "West Bengal",
        "addressCountry": "India"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "100000",
        "highPrice": "2000000"
      }
    });
  }

  // Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  fetchTestimonials(): void {
    this.isLoadingTestimonials = true;
    this.http.get<Testimonial[]>('http://wizcms.test/wp-json/wp/v2/vehicle_testimonials?_embed&per_page=4&orderby=date&order=desc')
      .subscribe({
        next: (data) => {
          this.testimonials = data;
          this.isLoadingTestimonials = false;
          console.log('Vehicle testimonials loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching testimonials:', error);
          this.isLoadingTestimonials = false;
          this.testimonials = [];
        }
      });
  }

  fetchVehicleCategories(): void {
    this.isLoadingCategories = true;
    this.http.get<VehicleCategory[]>('http://wizcms.test/wp-json/wp/v2/vehicle_category')
      .subscribe({
        next: (data) => {
          this.vehicleCategories = data;
          this.isLoadingCategories = false;
          console.log('Vehicle categories loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle categories:', error);
          this.isLoadingCategories = false;
          this.vehicleCategories = [];
        }
      });
  }

  fetchVehicleBrands(): void {
    this.isLoadingBrands = true;
    this.http.get<VehicleBrand[]>('http://wizcms.test/wp-json/wp/v2/vehicle_brand')
      .subscribe({
        next: (data) => {
          this.vehicleBrands = data;
          this.isLoadingBrands = false;
          console.log('Vehicle brands loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle brands:', error);
          this.isLoadingBrands = false;
          this.vehicleBrands = [];
        }
      });
  }

  fetchFeaturedVehicles(): void {
    this.isLoadingVehicles = true;
    // Fetch published vehicles with embedded taxonomies, then filter by is_approved
    this.http.get<Vehicle[]>('http://wizcms.test/wp-json/wp/v2/buy_sell_cars?status=publish&per_page=100&_embed')
      .subscribe({
        next: (data) => {
          // Filter to show only approved vehicles
          // ACF checkbox can return: true, "1", ["1"], or false/null/empty
          this.allVehicles = data.filter(vehicle => {
            if (!vehicle.acf || !vehicle.acf.is_approved) return false;
            
            const isApproved: any = vehicle.acf.is_approved;
            
            // Handle different ACF checkbox return formats
            if (Array.isArray(isApproved)) {
              return isApproved.includes('1') || isApproved.includes(1);
            }
            
            return isApproved === true || isApproved === '1' || isApproved === 1;
          });
          
          // Initially show all approved vehicles
          this.featuredVehicles = [...this.allVehicles];
          this.isLoadingVehicles = false;
          console.log('All vehicles loaded:', data);
          console.log('Approved vehicles:', this.allVehicles);
        },
        error: (error) => {
          console.error('Error fetching vehicles:', error);
          this.isLoadingVehicles = false;
          this.allVehicles = [];
          this.featuredVehicles = [];
        }
      });
  }

  applyFilters(): void {
    let filtered = [...this.allVehicles];

    // Filter by category
    if (this.selectedCategory) {
      const categoryId = parseInt(this.selectedCategory);
      filtered = filtered.filter(vehicle => {
        if (vehicle._embedded && vehicle._embedded['wp:term']) {
          const categories = vehicle._embedded['wp:term'][0] || [];
          return categories.some(cat => cat.id === categoryId);
        }
        return false;
      });
    }

    // Filter by brand
    if (this.selectedBrand) {
      const brandId = parseInt(this.selectedBrand);
      filtered = filtered.filter(vehicle => {
        if (vehicle._embedded && vehicle._embedded['wp:term']) {
          const brands = vehicle._embedded['wp:term'][1] || [];
          return brands.some(brand => brand.id === brandId);
        }
        return false;
      });
    }

    // Filter by budget (price range)
    if (this.selectedBudget) {
      filtered = filtered.filter(vehicle => {
        if (!vehicle.acf || !vehicle.acf.price) return false;
        
        const price = this.extractNumericPrice(vehicle.acf.price);
        
        switch (this.selectedBudget) {
          case 'Under ₹5 Lakh':
            return price < 500000;
          case '₹5-10 Lakh':
            return price >= 500000 && price <= 1000000;
          case '₹10-15 Lakh':
            return price >= 1000000 && price <= 1500000;
          case '₹15-20 Lakh':
            return price >= 1500000 && price <= 2000000;
          case 'Over ₹20 Lakh':
            return price > 2000000;
          default:
            return true;
        }
      });
    }

    this.featuredVehicles = filtered;
    console.log('Filtered vehicles:', this.featuredVehicles);
  }

  extractNumericPrice(priceString: string): number {
    // Remove ₹, commas, and convert to number
    const numericString = priceString.replace(/[₹,\s]/g, '');
    
    // Handle "Lakh" notation
    if (numericString.toLowerCase().includes('lakh')) {
      const value = parseFloat(numericString.replace(/lakh/i, ''));
      return value * 100000;
    }
    
    return parseFloat(numericString) || 0;
  }

  getVehicleTitle(vehicle: Vehicle): string {
    return vehicle.title.rendered;
  }

  getVehiclePrice(vehicle: Vehicle): string {
    return vehicle.acf?.price || 'N/A';
  }

  getVehicleKm(vehicle: Vehicle): string {
    return vehicle.acf?.km || 'N/A';
  }

  getVehicleYear(vehicle: Vehicle): string {
    return vehicle.acf?.year || 'N/A';
  }

  getVehicleFuel(vehicle: Vehicle): string {
    return vehicle.acf?.fuel || 'N/A';
  }

  getVehicleImage(vehicle: Vehicle): string {
    return vehicle.acf?.img || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
  }

  getVehicleBadge(vehicle: Vehicle): string | undefined {
    return vehicle.acf?.badge;
  }

  // Testimonial helper methods
  getTestimonialName(testimonial: Testimonial): string {
    return testimonial.title.rendered;
  }

  getTestimonialContent(testimonial: Testimonial): string {
    return testimonial.content.rendered;
  }

  getTestimonialLocation(testimonial: Testimonial): string {
    return testimonial.acf?.location_ || 'Customer';
  }

  getTestimonialImage(testimonial: Testimonial): string {
    if (testimonial._embedded && testimonial._embedded['wp:featuredmedia'] && testimonial._embedded['wp:featuredmedia'][0]) {
      return testimonial._embedded['wp:featuredmedia'][0].source_url;
    }
    return 'https://randomuser.me/api/portraits/men/32.jpg'; // Default fallback
  }

  getTestimonialImageAlt(testimonial: Testimonial): string {
    if (testimonial._embedded && testimonial._embedded['wp:featuredmedia'] && testimonial._embedded['wp:featuredmedia'][0]) {
      return testimonial._embedded['wp:featuredmedia'][0].alt_text || testimonial.title.rendered;
    }
    return testimonial.title.rendered;
  }

  onActionChange(): void {
    if (this.selectedAction === 'buy') {
      this.showBuyFields = true;
      this.submitButtonDisabled = false;
      this.submitButtonText = 'Apply Filters';
    } else if (this.selectedAction === 'sell') {
      // Redirect to registration form page
      this.router.navigate(['/vehicle-registration-form']);
    } else {
      this.showBuyFields = false;
      this.submitButtonDisabled = true;
      this.submitButtonText = 'Select Action';
      // Reset filters
      this.resetFilters();
    }
  }

  onFilterChange(): void {
    // Apply filters whenever any filter value changes
    this.applyFilters();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedBudget = '';
    this.featuredVehicles = [...this.allVehicles];
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.selectedAction === 'buy') {
      this.applyFilters();
      
      // Scroll to results
      const vehiclesSection = document.querySelector('.featured-section');
      if (vehiclesSection) {
        vehiclesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  viewVehicleDetails(vehicleId: number): void {
    this.router.navigate(['/vehicle-details', vehicleId]);
  }
}
