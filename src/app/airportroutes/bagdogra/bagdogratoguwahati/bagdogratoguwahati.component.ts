import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratoguwahati',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratoguwahati.component.html',
  styleUrl: './bagdogratoguwahati.component.css'
})
export class BagdogratoguwahatiComponent  implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratoguwahati');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Guwahati Flights | Cheap IXB to GAU Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Bagdogra to Guwahati flights with Wizzride. Compare fares & airlines, and enjoy a smooth journey between North Bengal and Assam. Reserve your ticket today"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Guwahati Flights | Cheap IXB to GAU Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Guwahati Flights | Cheap IXB to GAU Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Bagdogra to Guwahati flights with Wizzride. Compare fares & airlines, and enjoy a smooth journey between North Bengal and Assam. Reserve your ticket today" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratoguwahati' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Guwahati Flights | Cheap IXB to GAU Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Bagdogra to Guwahati flights with Wizzride. Compare fares & airlines, and enjoy a smooth journey between North Bengal and Assam. Reserve your ticket today" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/guwahatiairp.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the flight duration from Bagdogra to Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average flight time from Bagdogra to Guwahati is 1 hour 10 minutes to 1 hour 20 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights between Bagdogra and Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airlines such as IndiGo, Air India, and Akasa Air operate regular flights on this route."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the average fare for Bagdogra to Guwahati flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flight fares usually start from ₹2,500 – ₹5,000 depending on season and booking time."
          }
        },
        {
          "@type": "Question",
          "name": "Can I combine a cab booking with my Bagdogra to Guwahati flight on Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Wizzride offers door-to-door travel by combining your flight booking with cab transfers."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to book Bagdogra to Guwahati flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For the lowest fares, it is recommended to book Bagdogra to Guwahati flights 3–4 weeks in advance."
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
          "name": "Bagdogra to Guwahati Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/bagdogratoguwahati"
        }
      ]
    });

    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Bagdogra to Guwahati Flight",
      "provider": {
        "@type": "Organization",
        "name": "Wizzride",
        "url": "https://wizzride.com/"
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
        "name": "Lokpriya Gopinath Bordoloi International Airport",
        "iataCode": "GAU",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Guwahati",
          "addressRegion": "Assam",
          "addressCountry": "IN"
        }
      },
      "flightDistance": {
        "@type": "Distance",
        "name": "Approx. 450 km"
      },
      "estimatedFlightDuration": "PT1H10M",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "2000",
        "url": "https://wizzride.com/ourservices/flight-booking/bagdogratoguwahati",
        "availability": "https://schema.org/InStock"
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
