import { Component, OnInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';

interface Vehicle {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
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
    city?: string;
  };
}

interface KeyFeature {
  icon: string;
  title: string;
  description: string;
}

interface Spec {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-vehicledetails',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vehicledetails.component.html',
  styleUrl: './vehicledetails.component.css'
})
export class VehicledetailsComponent implements OnInit, OnDestroy {
  
  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;
  isLoadingVehicle: boolean = true;
  vehicleNotFound: boolean = false;

  keyFeatures: KeyFeature[] = [];
  carSpecs: Spec[] = [];

  // Enquiry form
  enquiryName: string = '';
  enquiryEmail: string = '';
  enquiryPhone: string = '';
  enquiryMessage: string = '';
  isSubmittingEnquiry: boolean = false;
  enquirySuccessMessage: string = '';
  enquiryErrorMessage: string = '';
  
  // Captcha
  captchaQuestion: string = '';
  captchaAnswer: number = 0;
  userCaptchaAnswer: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Get vehicle ID from route parameters
    this.route.params.subscribe(params => {
      this.vehicleId = +params['id']; // Convert to number
      if (this.vehicleId) {
        this.fetchVehicleDetails();
      }
    });
    
    // Generate captcha
    this.generateCaptcha();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  setMetaTags(): void {
    if (!this.vehicle || !this.vehicle.acf) return;

    const carModel = this.getVehicleTitle();
    const price = this.vehicle.acf.price || 'Best Price';
    const location = this.vehicle.acf.city || 'Northeast India';

    // Dynamic Meta Title
    const metaTitle = `Best Used Car ${carModel} Starting from ${price} at ${location}`;
    
    // Dynamic Meta Description
    const metaDescription = `Find the best deals on used ${carModel} starting from ${price} in ${location}. Certified cars with easy financing and quick delivery.`;

    // Set canonical URL with vehicle ID
    this.seoService.setCanonicalURL(`https://wizzride.com/vehicle-details/${this.vehicleId}`);
    
    // SEO Metadata
    this.titleService.setTitle(metaTitle);
    this.metaService.updateTag({
      name: 'description',
      content: metaDescription
    });
    this.metaService.updateTag({
      name: 'title',
      content: metaTitle
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: metaTitle });
    this.metaService.updateTag({ property: 'og:description', content: metaDescription });
    this.metaService.updateTag({ property: 'og:type', content: 'product' });
    this.metaService.updateTag({ property: 'og:url', content: `https://wizzride.com/vehicle-details/${this.vehicleId}` });
    this.metaService.updateTag({ property: 'og:image', content: this.getVehicleImage() });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: metaTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: metaDescription });
    this.metaService.updateTag({ name: 'twitter:image', content: this.getVehicleImage() });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // Product Schema (JSON-LD)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": carModel,
      "image": this.getVehicleImage(),
      "description": metaDescription,
      "brand": {
        "@type": "Brand",
        "name": carModel.split(' ')[0] // Extract brand from car model
      },
      "offers": {
        "@type": "Offer",
        "url": `https://wizzride.com/vehicle-details/${this.vehicleId}`,
        "priceCurrency": "INR",
        "price": this.extractNumericPrice(price),
        "priceValidUntil": this.getNextMonth(),
        "itemCondition": "https://schema.org/UsedCondition",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Wizzride"
        }
      },
      "vehicleEngine": {
        "@type": "EngineSpecification",
        "fuelType": this.vehicle.acf.fuel
      },
      "vehicleTransmission": this.vehicle.acf.transmission,
      "mileageFromOdometer": {
        "@type": "QuantitativeValue",
        "value": this.vehicle.acf.km,
        "unitText": "km"
      },
      "productionDate": this.vehicle.acf.year,
      "vehicleSeatingCapacity": this.vehicle.acf.seats
    });

    // BreadcrumbList Schema
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
            "@id": "https://wizzride.com/"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Buy & Sell Cars",
          "item": {
            "@type": "WebPage",
            "@id": "https://wizzride.com/sellyourcar"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": carModel,
          "item": {
            "@type": "WebPage",
            "@id": `https://wizzride.com/vehicle-details/${this.vehicleId}`
          }
        }
      ]
    });
  }

  // Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  // Extract numeric price for schema
  private extractNumericPrice(priceString: string): string {
    const numericString = priceString.replace(/[₹,\s]/g, '');
    
    if (numericString.toLowerCase().includes('lakh')) {
      const value = parseFloat(numericString.replace(/lakh/i, ''));
      return (value * 100000).toString();
    }
    
    return numericString || '0';
  }

  // Get next month date for price validity
  private getNextMonth(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  }

  generateCaptcha(): void {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    this.captchaAnswer = num1 + num2;
    this.captchaQuestion = `${num1} + ${num2} = ?`;
  }

  fetchVehicleDetails(): void {
    this.isLoadingVehicle = true;
    this.http.get<Vehicle[]>(`https://cms.wizzride.com/wp-json/wp/v2/buy_sell_cars?include=${this.vehicleId}`)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.vehicle = data[0];
            this.vehicleNotFound = false;
            this.prepareVehicleData();
            // Set dynamic meta tags after vehicle data is loaded
            this.setMetaTags();
          } else {
            this.vehicleNotFound = true;
          }
          this.isLoadingVehicle = false;
          console.log('Vehicle details loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle details:', error);
          this.isLoadingVehicle = false;
          this.vehicleNotFound = true;
        }
      });
  }

  prepareVehicleData(): void {
    if (!this.vehicle || !this.vehicle.acf) return;

    const acf = this.vehicle.acf;

    // Prepare Key Features - More compact and relevant
    this.keyFeatures = [
      { icon: 'fas fa-cogs', title: 'Engine', description: acf.engine_displacement },
      { icon: 'fas fa-gear', title: 'Transmission', description: acf.transmission },
      { icon: 'fas fa-gas-pump', title: 'Fuel Type', description: acf.fuel },
      { icon: 'fas fa-user', title: 'Ownership', description: acf.ownership }
    ];

    // Prepare Car Specs - Comprehensive details
    this.carSpecs = [
      { icon: 'fas fa-rupee-sign', label: 'Price', value: acf.price },
      { icon: 'fas fa-calendar-alt', label: 'Model Year', value: acf.year },
      { icon: 'fas fa-tachometer-alt', label: 'Kms Driven', value: acf.km },
      { icon: 'fas fa-calendar-check', label: 'Registration Year', value: acf.registrationyear },
      { icon: 'fas fa-shield-alt', label: 'Insurance', value: acf.insurance },
      { icon: 'fas fa-chair', label: 'Seating Capacity', value: acf.seats + ' Seats' },
      { icon: 'fas fa-building', label: 'RTO', value: acf.rto },
      { icon: 'fas fa-cogs', label: 'Engine', value: acf.engine_displacement },
      { icon: 'fas fa-gear', label: 'Transmission', value: acf.transmission },
      { icon: 'fas fa-clock', label: 'Manufacture Year', value: acf.manufactureyear }
    ];
  }

  getVehicleImage(): string {
    return this.vehicle?.acf?.img || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80';
  }

  getVehicleTitle(): string {
    return this.vehicle?.title.rendered || 'Vehicle Details';
  }

  getVehiclePrice(): string {
    return this.vehicle?.acf?.price || 'N/A';
  }

  getVehicleYear(): string {
    return this.vehicle?.acf?.year || 'N/A';
  }

  getVehicleKm(): string {
    return this.vehicle?.acf?.km || 'N/A';
  }

  getVehicleFuel(): string {
    return this.vehicle?.acf?.fuel || 'N/A';
  }

  scrollToEnquiry(): void {
    const enquirySection = document.getElementById('enquiryFormBlock');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/sellyourcar']);
  }

  onEnquirySubmit(): void {
    // Clear previous messages
    this.enquirySuccessMessage = '';
    this.enquiryErrorMessage = '';

    // Validate captcha first
    const userAnswer = parseInt(this.userCaptchaAnswer);
    if (isNaN(userAnswer) || userAnswer !== this.captchaAnswer) {
      this.enquiryErrorMessage = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswer = '';
      return;
    }

    this.isSubmittingEnquiry = true;

    const enquiryData = {
      title: `Enquiry: ${this.getVehicleTitle()} - ${this.enquiryName}`,
      content: this.enquiryMessage || 'No message provided',
      status: 'publish',
      acf: {
        customer_name: this.enquiryName,
        customer_email: this.enquiryEmail,
        customer_phone: this.enquiryPhone,
        customer_message: this.enquiryMessage || '',
        vehicle_name: this.getVehicleTitle(),
        listing_id: this.vehicleId?.toString() || '',
        enquiry_date: new Date().toISOString()
      }
    };

    console.log('Submitting enquiry:', enquiryData);

    this.http.post('https://cms.wizzride.com/wp-json/wp/v2/vehicle_enquiries', enquiryData)
      .subscribe({
        next: (response) => {
          console.log('Enquiry submitted successfully:', response);
          this.isSubmittingEnquiry = false;
          this.enquirySuccessMessage = 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.';
          
          // Reset form
          this.enquiryName = '';
          this.enquiryEmail = '';
          this.enquiryPhone = '';
          this.enquiryMessage = '';
          this.userCaptchaAnswer = '';
          
          // Generate new captcha
          this.generateCaptcha();
        },
        error: (error) => {
          console.error('Error submitting enquiry:', error);
          this.isSubmittingEnquiry = false;
          this.enquiryErrorMessage = 'There was an error submitting your enquiry. Please try again.';
        }
      });
  }
}
