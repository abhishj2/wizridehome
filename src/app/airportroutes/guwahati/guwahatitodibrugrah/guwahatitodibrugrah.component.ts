import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahatitodibrugrah',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitodibrugrah.component.html',
  styleUrl: './guwahatitodibrugrah.component.css'
})
export class GuwahatitodibrugrahComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/guwahatitodibrugarh');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Dibrugarh Flights | Cheap GAU to DIB Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Fly Guwahati (GAU) to Dibrugarh (DIB) with Wizzride. Get low fares, daily flights & secure booking for a seamless journey across Assam."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Dibrugarh Flights | Cheap GAU to DIB Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Dibrugarh Flights | Cheap GAU to DIB Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Fly Guwahati (GAU) to Dibrugarh (DIB) with Wizzride. Get low fares, daily flights & secure booking for a seamless journey across Assam." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/guwahatitodibrugarh' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/dibriugarh.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Dibrugarh Flights | Cheap GAU to DIB Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Fly Guwahati (GAU) to Dibrugarh (DIB) with Wizzride. Get low fares, daily flights & secure booking for a seamless journey across Assam." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/dibriugarh.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the average flight time from Guwahati to Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average non-stop flight takes around 1 hour."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate between Guwahati and Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Popular airlines include IndiGo, Air India, and Alliance Air."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Dibrugarh city from the airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dibrugarh Airport (DIB) is around 15 km from the city center."
          }
        },
        {
          "@type": "Question",
          "name": "What is the cheapest month to fly to Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Generally, July to September (monsoon) sees lower fares."
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
          "name": "Guwahati to Dibrugarh Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/guwahatitodibrugarh"
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
        "name": "Dibrugarh Airport",
        "iataCode": "DIB"
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
