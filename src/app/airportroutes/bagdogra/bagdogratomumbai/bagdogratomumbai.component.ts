import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratomumbai',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratomumbai.component.html',
  styleUrl: './bagdogratomumbai.component.css'
})
export class BagdogratomumbaiComponent  implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratomumbai');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Mumbai Flights – Book Affordable IXB to BOM Tickets with Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Find affordable Bagdogra to Mumbai (IXB–BOM) flight tickets with Wizzride. Enjoy smooth booking, flexible timings, and budget-friendly fares. Book your IXB to BOM flights today!"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Mumbai Flights – Book Affordable IXB to BOM Tickets with Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Mumbai Flights – Book Affordable IXB to BOM Tickets with Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Find affordable Bagdogra to Mumbai (IXB–BOM) flight tickets with Wizzride. Enjoy smooth booking, flexible timings, and budget-friendly fares. Book your IXB to BOM flights today!" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratomumbai' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Mumbai Flights – Book Affordable IXB to BOM Tickets with Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Find affordable Bagdogra to Mumbai (IXB–BOM) flight tickets with Wizzride. Enjoy smooth booking, flexible timings, and budget-friendly fares. Book your IXB to BOM flights today!" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long is the flight from Bagdogra to Mumbai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Non-stop flights from Bagdogra to Mumbai take around 3 hrs 10 mins."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate on this route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airlines like IndiGo, Vistara, Air India, and SpiceJet operate flights between Bagdogra and Mumbai."
          }
        },
        {
          "@type": "Question",
          "name": "What is the baggage allowance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The standard allowance is 15 kg check-in baggage and 7 kg cabin baggage, but this may vary by airline."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Mumbai Airport from the city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mumbai Airport is about 25 km from South Mumbai and 6 km from Bandra-Kurla Complex (BKC)."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to book Bagdogra to Mumbai flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is best to book at least 3-4 weeks in advance for cheaper fares on this route."
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
          "name": "Bagdogra to Mumbai",
          "item":"https://wizzride.com/ourservices/flight-booking/bagdogratomumbai"
        }
      ]
    });

    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "Flight",
      "name": "Bagdogra to Mumbai Flight",
      "provider": {
        "@type": "Airline",
        "name": "IndiGo, Air India, Vistara, SpiceJet"
      },
      "departureAirport": {
        "@type": "Airport",
        "name": "Bagdogra Airport",
        "iataCode": "IXB",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bagdogra",
          "addressRegion": "West Bengal",
          "addressCountry": "India"
        }
      },
      "arrivalAirport": {
        "@type": "Airport",
        "name": "Chhatrapati Shivaji Maharaj International Airport",
        "iataCode": "BOM",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Mumbai",
          "addressRegion": "Maharashtra",
          "addressCountry": "India"
        }
      },
      "flightNumber": "Varies by airline",
      "aircraft": {
        "@type": "Airplane",
        "name": "Airbus A320 / Boeing 737"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "5000",
        "url": "https://wizzride.com/ourservices/flight-booking/bagdogratomumbai",
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-08-20T00:00"
      },
      "potentialAction": {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://wizzride.com/book-flight/bagdogratomumbai",
          "inLanguage": "en",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Bagdogra to Mumbai Flight Reservation"
        }
      },
      "description": "Book direct and connecting flights from Bagdogra (IXB) to Mumbai (BOM) with Wizzride. Enjoy affordable fares, multiple airlines, and convenient booking options."
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
