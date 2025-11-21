import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { CommonModule } from '@angular/common';

export interface FlightRoute {
  name: string;
  link: string;
  image: string;
  from: string;
  to: string;
}

@Component({
  selector: 'app-flight-booking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './flight-booking.component.html',
  styleUrl: './flight-booking.component.css'
})
export class FlightBookingComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private listeners: (() => void)[] = [];

  flightRoutes: FlightRoute[] = [
    // Bagdogra routes
    { name: 'Bagdogra to Bengaluru', link: '/ourservices/flight-booking/bagdogratobengaluru', image: 'assets/images/airportroutes/bengaluruairport.jpg', from: 'Bagdogra', to: 'Bengaluru' },
    { name: 'Bagdogra to Delhi', link: '/ourservices/flight-booking/bagdogratodelhi', image: 'assets/images/airportroutes/delhiairp.jpg', from: 'Bagdogra', to: 'Delhi' },
    { name: 'Bagdogra to Dibrugarh', link: '/ourservices/flight-booking/bagdogratodibrugarh', image: 'assets/images/airportroutes/dibriugarh.jpg', from: 'Bagdogra', to: 'Dibrugarh' },
    { name: 'Bagdogra to Guwahati', link: '/ourservices/flight-booking/bagdogratoguwahati', image: 'assets/images/airportroutes/guwahatiairp.jpg', from: 'Bagdogra', to: 'Guwahati' },
    { name: 'Bagdogra to Kolkata', link: '/ourservices/flight-booking/bagdogratokolkata', image: 'assets/images/airportroutes/kolkataairport.jpg', from: 'Bagdogra', to: 'Kolkata' },
    { name: 'Bagdogra to Mumbai', link: '/ourservices/flight-booking/bagdogratomumbai', image: 'assets/images/airportroutes/mumbaiaitp.jpg', from: 'Bagdogra', to: 'Mumbai' },
    
    // Guwahati routes
    { name: 'Guwahati to Agartala', link: '/ourservices/flight-booking/guwahatitoagartala', image: 'assets/images/airportroutes/agartala.jpg', from: 'Guwahati', to: 'Agartala' },
    { name: 'Guwahati to Delhi', link: '/ourservices/flight-booking/guwahatitodelhi', image: 'assets/images/airportroutes/delhiairp.jpg', from: 'Guwahati', to: 'Delhi' },
    { name: 'Guwahati to Dibrugarh', link: '/ourservices/flight-booking/guwahatitodibrugarh', image: 'assets/images/airportroutes/dibriugarh.jpg', from: 'Guwahati', to: 'Dibrugarh' },
    { name: 'Guwahati to Imphal', link: '/ourservices/flight-booking/guwahatitoimphal', image: 'assets/images/airportroutes/guwahatiairp.jpg', from: 'Guwahati', to: 'Imphal' },
    { name: 'Guwahati to Kolkata', link: '/ourservices/flight-booking/guwahatitokolkata', image: 'assets/images/airportroutes/kolkataairport.jpg', from: 'Guwahati', to: 'Kolkata' },
    
    // Pakyong routes
    { name: 'Pakyong to Delhi', link: '/ourservices/flight-booking/pakyongtodelhi', image: 'assets/images/airportroutes/delhiairp.jpg', from: 'Pakyong', to: 'Delhi' },
    { name: 'Pakyong to Kolkata', link: '/ourservices/flight-booking/pakyongtokolkata', image: 'assets/images/airportroutes/kolkataairport.jpg', from: 'Pakyong', to: 'Kolkata' }
  ];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking');
    
    // SEO Metadata
    this.titleService.setTitle("Flight Booking - All Air Routes | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book flights from Bagdogra, Guwahati, and Pakyong to major destinations across India. Browse all available flight routes and book your tickets with Wizzride for the best deals."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Flight Booking - All Air Routes | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Flight Booking - All Air Routes | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: 'Book flights from Bagdogra, Guwahati, and Pakyong to major destinations across India. Browse all available flight routes and book your tickets with Wizzride for the best deals.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Flight Booking - All Air Routes | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Book flights from Bagdogra, Guwahati, and Pakyong to major destinations across India. Browse all available flight routes and book your tickets with Wizzride for the best deals.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // BreadcrumbList JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wizzride.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Flight Booking",
          "item": "https://wizzride.com/ourservices/flight-booking"
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

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // ================== ANIMATION ON SCROLL ==================
  private initializeAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer?.observe(el);
    });

    // Staggered delays for route cards
    this.applyStaggeredDelay('.route-card');
  }

  private applyStaggeredDelay(selector: string): void {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.05}s`;
    });
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}