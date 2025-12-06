import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-pakyoongtodelhi',
  standalone: true,
  imports: [],
  templateUrl: './pakyoongtodelhi.component.html',
  styleUrl: './pakyoongtodelhi.component.css'
})
export class PakyoongtodelhiComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/pakyongtodelhi');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Pakyong to Delhi Flights | Cheap PYG to DEL Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Pakyong (PYG) to Delhi (DEL) flights with Wizzride. Compare fares & schedules for a smooth, budget-friendly travel experience."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Pakyong to Delhi Flights | Cheap PYG to DEL Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Pakyong to Delhi Flights | Cheap PYG to DEL Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Pakyong (PYG) to Delhi (DEL) flights with Wizzride. Compare fares & schedules for a smooth, budget-friendly travel experience." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/pakyongtodelhi' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Pakyong to Delhi Flights | Cheap PYG to DEL Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Pakyong (PYG) to Delhi (DEL) flights with Wizzride. Compare fares & schedules for a smooth, budget-friendly travel experience." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/delhiairp.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which airlines operate flights from Pakyong to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "IndiGo operates direct flights, while SpiceJet offers connecting options via Kolkata or Bagdogra."
          }
        },
        {
          "@type": "Question",
          "name": "How long is the flight from Pakyong to Delhi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A direct flight takes about 2 hours, while connecting flights may take 3.5 to 5 hours depending on layovers."
          }
        },
        {
          "@type": "Question",
          "name": "What is the baggage allowance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Economy passengers generally get 15 kg check-in baggage and 7 kg cabin baggage (varies by airline)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to book cheap flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking 2–3 weeks in advance is recommended for cheaper fares."
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
          "item": "https://wizzride.com/ourservices/flight-booking/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Pakyong to Delhi Flights",
          "item": "https://wizzride.com/ourservices/flight-booking/pakyongtodelhi"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Pakyong to Delhi Flight",
      "provider": {
        "@type": "Airline",
        "name": "IndiGo Airlines"
      },
      "departureAirport": {
        "@type": "Airport",
        "name": "Pakyong Airport",
        "iataCode": "PYG"
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": "Indira Gandhi International Airport",
        "iataCode": "DEL"
      },
      "flightDistance": {
        "@type": "Distance",
        "name": "Approx. 1,150 km"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://wizzride.com/ourservices/flight-booking/pakyongtodelhi",
        "priceCurrency": "INR",
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
