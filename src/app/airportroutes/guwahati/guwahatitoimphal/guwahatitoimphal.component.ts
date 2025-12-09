import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahatitoimphal',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitoimphal.component.html',
  styleUrl: './guwahatitoimphal.component.css'
})
export class GuwahatitoimphalComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/guwahatitoimphal');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Imphal Flights | Cheap GAU to IMF Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Guwahati (GAU) to Imphal (IMF) flights with Wizzride. Enjoy budget-friendly fares, flexible schedules & easy online booking today."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Imphal Flights | Cheap GAU to IMF Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Imphal Flights | Cheap GAU to IMF Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Guwahati (GAU) to Imphal (IMF) flights with Wizzride. Enjoy budget-friendly fares, flexible schedules & easy online booking today." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/guwahatitoimphal' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/guwahatiairp.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Imphal Flights | Cheap GAU to IMF Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Guwahati (GAU) to Imphal (IMF) flights with Wizzride. Enjoy budget-friendly fares, flexible schedules & easy online booking today." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/guwahatiairp.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long does a flight from Guwahati to Imphal take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A direct flight from Guwahati to Imphal takes around 1 hour."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate on the Guwahati to Imphal route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IndiGo, Air India, and Alliance Air operate flights between Guwahati and Imphal."
          }
        },
        {
          "@type": "Question",
          "name": "What is the cheapest month to fly to Imphal from Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "February, March, and September usually offer the lowest fares."
          }
        },
        {
          "@type": "Question",
          "name": "Are there direct flights from Guwahati to Imphal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, multiple daily non-stop flights are available from Guwahati to Imphal."
          }
        },
        {
          "@type": "Question",
          "name": "What is the baggage allowance for this route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most airlines allow 15 kg check-in baggage and 7 kg cabin baggage on this route."
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
          "name": "Guwahati to Imphal Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/guwahatitoimphal"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Guwahati to Imphal Flight",
      "airline": {
        "@type": "Airline",
        "name": "IndiGo, Air India, Alliance Air"
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
        "name": "Imphal International Airport",
        "iataCode": "IMF",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Imphal",
          "addressCountry": "IN"
        }
      },
      "flightNumber": "GAU-IMF",
      "description": "Book cheap flights from Guwahati to Imphal with multiple airlines offering direct and connecting options.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "3000",
        "availability": "https://schema.org/InStock",
        "url": "https://wizzride.com/ourservices/flight-booking/guwahatitoimphal"
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
