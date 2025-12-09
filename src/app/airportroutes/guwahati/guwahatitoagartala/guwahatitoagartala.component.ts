import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahatitoagartala',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitoagartala.component.html',
  styleUrl: './guwahatitoagartala.component.css'
})
export class GuwahatitoagartalaComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private listeners: (() => void)[] = [];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/guwahatitoagartala/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Agartala Flights | Cheap GAU to IXA Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Guwahati (GAU) to Agartala (IXA) flights with Wizzride. Compare fares & schedules, choose daily flights, and enjoy secure booking with 24/7 Support"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Agartala Flights | Cheap GAU to IXA Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Agartala Flights | Cheap GAU to IXA Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Guwahati (GAU) to Agartala (IXA) flights with Wizzride. Compare fares & schedules, choose daily flights, and enjoy secure booking with 24/7 Support" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/guwahatitoagartala/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/agartala.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Agartala Flights | Cheap GAU to IXA Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Guwahati (GAU) to Agartala (IXA) flights with Wizzride. Compare fares & schedules, choose daily flights, and enjoy secure booking with 24/7 Support" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/agartala.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the flight duration from Guwahati to Agartala?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average flight duration is about 1 hour 10 minutes for direct flights."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights from Guwahati to Agartala?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airlines like IndiGo, Air India, and Alliance Air operate daily flights on this route."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Agartala Airport (IXA) from the city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Agartala Airport is located about 12 km from the city center, easily accessible by taxis and local transport."
          }
        },
        {
          "@type": "Question",
          "name": "When is the cheapest time to book Guwahati to Agartala flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking at least 2–3 weeks in advance usually ensures the best fares."
          }
        },
        {
          "@type": "Question",
          "name": "Are there nonstop flights available on this route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, most flights between Guwahati and Agartala are nonstop."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(   {
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
          "name": "Flights",
          "item": "https://wizzride.com/flight-booking/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Guwahati to Agartala Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/guwahatitoagartala/"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Guwahati to Dibrugarh Flight",
      "departureAirport": {
        "@type": "Airport",
        "name": "Lokpriya Gopinath Bordoloi International Airport",
        "iataCode": "GAU"
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": "Agartala Airport",
        "iataCode": "IXA"
      },
      "carrier": {
        "@type": "Airline",
        "name": "IndiGo, Air India, Alliance Air"
      },
      "flightDistance": {
        "@type": "Distance",
        "name": "370 km"
      },
      "estimatedFlightDuration": "PT1H"
    }
    );
  }

  // ✅ Utility: inject LD+JSON scripts
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
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof IntersectionObserver === 'undefined') return;
    
    try {
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

      this.document.querySelectorAll('.animate-on-scroll').forEach(el => {
        this.observer?.observe(el);
      });

      // ================== STAGGERED DELAYS ==================
      this.applyStaggeredDelay('.info-card');
      this.applyStaggeredDelay('.feature-card');
      this.applyStaggeredDelay('.airline-card');
      this.applyStaggeredDelay('.attraction-card');
    } catch (e) {
      console.warn('Error initializing animations (likely SSR):', e);
    }
  }

  private applyStaggeredDelay(selector: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    const cards = this.document.querySelectorAll(selector);
    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
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
