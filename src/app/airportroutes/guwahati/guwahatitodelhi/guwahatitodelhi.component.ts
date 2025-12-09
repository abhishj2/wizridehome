import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahatitodelhi',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitodelhi.component.html',
  styleUrl: './guwahatitodelhi.component.css'
})
export class GuwahatitodelhiComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/guwahatitodelhi');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Delhi Flights | Cheap GAU to DEL Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Guwahati (GAU) to Delhi (DEL) flights with Wizzride. Compare fares, schedules & airlines for smooth and affordable travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Delhi Flights | Cheap GAU to DEL Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Delhi Flights | Cheap GAU to DEL Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Guwahati (GAU) to Delhi (DEL) flights with Wizzride. Compare fares, schedules & airlines for smooth and affordable travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/guwahatitodelhi' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Delhi Flights | Cheap GAU to DEL Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Guwahati (GAU) to Delhi (DEL) flights with Wizzride. Compare fares, schedules & airlines for smooth and affordable travel." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long is the flight from Guwahati to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average non-stop flight takes around 2 hrs 30 mins."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights on this route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IndiGo, Air India, Vistara, and Akasa Air operate regular flights."
          }
        },
        {
          "@type": "Question",
          "name": "What is the aerial distance between Guwahati and Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The aerial distance between Guwahati and Delhi is approximately 1,450 km."
          }
        },
        {
          "@type": "Question",
          "name": "Are direct flights available from Guwahati to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, multiple airlines operate daily non-stop flights from Guwahati to Delhi."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to book cheap flights from Guwahati to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is recommended to book tickets at least 2–3 weeks in advance for the best fares."
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
          "item": "https://wizzride.com/flights/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Guwahati to Delhi Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/guwahatitodelhi"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Guwahati to Delhi Flight",
      "provider": {
        "@type": "Organization",
        "name": "Wizzride"
      },
      "departureAirport": {
        "@type": "Airport",
        "name": "Lokpriya Gopinath Bordoloi International Airport",
        "iataCode": "GAU",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Guwahati",
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
          "addressCountry": "IN"
        }
      },
      "flightDistance": {
        "@type": "Distance",
        "name": "1,450 km"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://wizzride.com/ourservices/flight-booking/guwahatitodelhi"
      }
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
