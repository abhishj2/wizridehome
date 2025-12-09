import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratodelhi',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratodelhi.component.html',
  styleUrl: './bagdogratodelhi.component.css'
})
export class BagdogratodelhiComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratodelhi');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Delhi Flights | Wizzride Affordable Air Tickets");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Bagdogra to Delhi flights with Wizzride for a seamless and affordable journey. Find schedules, ticket prices, and travel tips for a comfortable trip."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Delhi Flights | Wizzride Affordable Air Tickets"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Delhi Flights | Wizzride Affordable Air Tickets' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Bagdogra to Delhi flights with Wizzride for a seamless and affordable journey. Find schedules, ticket prices, and travel tips for a comfortable trip." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratodelhi' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Delhi Flights | Wizzride Affordable Air Tickets' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Bagdogra to Delhi flights with Wizzride for a seamless and affordable journey. Find schedules, ticket prices, and travel tips for a comfortable trip." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the average flight time from Bagdogra to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average non-stop flight takes about 2 hr 20 min."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate on the Bagdogra to Delhi route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IndiGo, Vistara, Air India, SpiceJet, and Akasa Air operate frequent flights."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Bagdogra Airport from Siliguri city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bagdogra Airport is about 16 km from Siliguri city center."
          }
        },
        {
          "@type": "Question",
          "name": "When is the cheapest time to book Bagdogra to Delhi flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking in advance, especially during off-peak travel months (July–September), offers the best deals."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book Bagdogra to Delhi round-trip flights with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride allows easy round-trip booking with flexible options."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
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
          "item": "https://wizzride.com/ourservices/flight-booking"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Bagdogra to Delhi Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/bagdogratodelhi"
        }
      ]
    });

    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Bagdogra to Delhi Flight",
      "flightNumber": "WZ123",
      "airline": {
          "@type": "Airline",
          "name": "Wizzride",
          "iataCode": "WZ"
      },
      "departureAirport": {
          "@type": "Airport",
          "name": "Bagdogra Airport",
          "iataCode": "IXB",
          "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bagdogra",
              "addressRegion": "West Bengal",
              "addressCountry": "IN"
          }
      },
      "arrivalAirport": {
          "@type": "Airport",
          "name": "Indira Gandhi International Airport",
          "iataCode": "DEL",
          "address": {
              "@type": "PostalAddress",
              "addressLocality": "Delhi",
              "addressRegion": "Delhi",
              "addressCountry": "IN"
          }
      },
      "offers": {
          "@type": "Offer",
          "url": "https://wizzride.com/ourservices/flight-booking/bagdogratodelhi",
          "priceCurrency": "INR",
          "price": "4500",
          "availability": "https://schema.org/InStock",
          "validFrom": "2025-08-20T00:00:00+05:30"
      }
  });
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
      // Silently handle SSR errors
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
