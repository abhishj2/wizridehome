import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratokolkata',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratokolkata.component.html',
  styleUrl: './bagdogratokolkata.component.css'
})
export class BagdogratokolkataComponent  implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private listeners: (() => void)[] = [];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratokolkata');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Kolkata Flights | Cheap IXB to CCU Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Bagdogra to Kolkata flights with Wizzride. Compare timings, fares & airlines for a seamless travel experience between North Bengal and Kolkata."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Kolkata Flights | Cheap IXB to CCU Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Kolkata Flights | Cheap IXB to CCU Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Bagdogra to Kolkata flights with Wizzride. Compare timings, fares & airlines for a seamless travel experience between North Bengal and Kolkata." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratokolkata' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/kolkataairport.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Kolkata Flights | Cheap IXB to CCU Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Bagdogra to Kolkata flights with Wizzride. Compare timings, fares & airlines for a seamless travel experience between North Bengal and Kolkata." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/kolkataairport.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the flight duration from Bagdogra to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average flight time from Bagdogra to Kolkata is around 1 hour to 1 hour 15 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate between Bagdogra and Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Major airlines like IndiGo, Air India, Vistara, SpiceJet, and Akasa Air operate daily flights between Bagdogra (IXB) and Kolkata (CCU)."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the average flight fare from Bagdogra to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flight fares typically start from ₹2,000 – ₹4,500 depending on season and how early you book your ticket."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book Bagdogra to Kolkata flight and cab together on Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Wizzride allows you to combine your flight booking with a cab service for seamless door-to-door travel between Bagdogra, Kolkata Airport, and the city."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to book Bagdogra to Kolkata flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For the best prices, it is recommended to book Bagdogra to Kolkata flights at least 2–4 weeks in advance."
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
          "item": "https://wizzride.com/ourservices/flight-booking"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Bagdogra to Kolkata Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/bagdogratokolkata"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Bagdogra to Kolkata Flight",
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
        "name": "Netaji Subhas Chandra Bose International Airport",
        "iataCode": "CCU",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kolkata",
          "addressRegion": "West Bengal",
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
        "url": "https://wizzride.com/ourservices/flight-booking/bagdogratokolkata",
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

    // ================== STAGGERED DELAYS ==================
    this.applyStaggeredDelay('.info-card');
    this.applyStaggeredDelay('.feature-card');
    this.applyStaggeredDelay('.airline-card');
    this.applyStaggeredDelay('.attraction-card');
  }

  private applyStaggeredDelay(selector: string): void {
    const cards = document.querySelectorAll(selector);
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
