import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-pakyoongtokolkata',
  standalone: true,
  imports: [],
  templateUrl: './pakyoongtokolkata.component.html',
  styleUrl: './pakyoongtokolkata.component.css'
})
export class PakyoongtokolkataComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/pakyongtokolkata');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Pakyong to Kolkata Flights | Cheap PYG to CCU Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Fly Pakyong (PYG) to Kolkata (CCU) with Wizzride. Get affordable fares, quick booking & daily flights for convenient travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Pakyong to Kolkata Flights | Cheap PYG to CCU Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Pakyong to Kolkata Flights | Cheap PYG to CCU Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Fly Pakyong (PYG) to Kolkata (CCU) with Wizzride. Get affordable fares, quick booking & daily flights for convenient travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/pakyongtokolkata' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Pakyong to Kolkata Flights | Cheap PYG to CCU Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Fly Pakyong (PYG) to Kolkata (CCU) with Wizzride. Get affordable fares, quick booking & daily flights for convenient travel." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the flight duration from Pakyong to Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The flight from Pakyong to Kolkata takes around 1 hour 10 minutes to 1 hour 20 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate between Pakyong and Kolkata?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SpiceJet is the primary airline operating flights between Pakyong (PYG) and Kolkata (CCU). IndiGo operates occasionally depending on demand."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the average fare from Pakyong to Kolkata flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Flight fares usually start from ₹2,500 – ₹5,500 depending on season and advance booking."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book both a cab and flight from Pakyong to Kolkata with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride allows you to book both flights and cab transfers for a seamless door-to-door travel experience."
          }
        },
        {
          "@type": "Question",
          "name": "Is Pakyong Airport operational year-round?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Pakyong Airport is operational, but flights may be affected during the monsoon season due to weather and visibility issues."
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
          "name": "Pakyong to Kolkata Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/pakyongtokolkata"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Pakyong to Kolkata Flight",
      "provider": {
        "@type": "Organization",
        "name": "Wizzride",
        "url": "https://wizzride.com/"
      },
      "departureAirport": {
        "@type": "Airport",
        "name": "Pakyong Airport",
        "iataCode": "PYG",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pakyong",
          "addressRegion": "Sikkim",
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
        "name": "Approx. 550 km"
      },
      "estimatedFlightDuration": "PT1H15M",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "2500",
        "url": "https://wizzride.com/ourservices/flight-booking/pakyongtokolkata",
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
