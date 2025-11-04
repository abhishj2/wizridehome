import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
export class BuyandsellcarComponent implements OnInit {
  
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
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchVehicleCategories();
    this.fetchVehicleBrands();
    this.fetchFeaturedVehicles();
    this.fetchTestimonials();
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
