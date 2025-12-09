import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahatitokolkata',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitokolkata.component.html',
  styleUrl: './guwahatitokolkata.component.css'
})
export class GuwahatitokolkataComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/guwahatitokolkata');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Kolkata Flights | Cheap GAU to CCU Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Reserve Guwahati (GAU) to Kolkata (CCU) flights with Wizzride. Compare fares, find timings & enjoy hassle-free travel with secure booking."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Kolkata Flights | Cheap GAU to CCU Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Kolkata Flights | Cheap GAU to CCU Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Reserve Guwahati (GAU) to Kolkata (CCU) flights with Wizzride. Compare fares, find timings & enjoy hassle-free travel with secure booking." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/guwahatitokolkata' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/kolkataairport.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Kolkata Flights | Cheap GAU to CCU Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Reserve Guwahati (GAU) to Kolkata (CCU) flights with Wizzride. Compare fares, find timings & enjoy hassle-free travel with secure booking." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/kolkataairport.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long is the flight from Guwahati to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average flight duration from Guwahati (GAU) to Kolkata (CCU) is around 1 hour to 1 hour 15 minutes, depending on weather and airline schedules."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights from Guwahati to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Major airlines including IndiGo, Air India, Vistara, and SpiceJet operate regular direct flights between Guwahati and Kolkata."
          }
        },
        {
          "@type": "Question",
          "name": "What is the distance between Guwahati and Kolkata by air?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The aerial distance between Guwahati and Kolkata is approximately 500 kilometers."
          }
        },
        {
          "@type": "Question",
          "name": "Are there daily flights from Guwahati to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, there are multiple daily flights from Guwahati to Kolkata, ensuring flexible travel options for passengers."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to book cheap flights from Guwahati to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking 3-4 weeks in advance usually helps secure cheaper fares for flights from Guwahati to Kolkata."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@graph": [
        {
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
              "name": "Guwahati to Kolkata Flights",
              "item": "https://wizzride.com/ourservices/flight-booking/guwahatitokolkata"
            }
          ]
        }
      ]
    });

    this.addJsonLd(   {
      "@type": "Flight",
      "name": "Guwahati to Kolkata Flight",
      "provider": {
        "@type": "Airline",
        "name": "IndiGo, Air India, Vistara, SpiceJet"
      },
      "departureAirport": {
        "@type": "Airport",
        "name": "Lokpriya Gopinath Bordoloi International Airport",
        "iataCode": "GAU",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Guwahati",
          "addressRegion": "Assam",
          "addressCountry": "IN"
        }
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": "Netaji Subhas Chandra Bose International Airport",
        "iataCode": "CCU",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
          "addressCountry": "IN"
        }
      },
      "flightNumber": "6E 345, AI 729, UK 747, SG 658",
      "offers": {
        "@type": "Offer",
        "url": "https://wizzride.com/ourservices/flight-booking/guwahatitokolkata",
        "priceCurrency": "INR",
        "price": "2500",
        "availability": "https://schema.org/InStock"
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
