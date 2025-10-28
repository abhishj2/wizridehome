import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratodibrugarh',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratodibrugarh.component.html',
  styleUrl: './bagdogratodibrugarh.component.css'
})
export class BagdogratodibrugarhComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratodibrugarh');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Dibrugarh Flights | Cheap IXB to DIB Booking");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Bagdogra (IXB) to Dibrugarh (DIB) flights with Wizzride. Get low fares, easy booking & multiple airlines. Fly hassle-free to the Tea City of India today!"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Dibrugarh Flights | Cheap IXB to DIB Booking"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Dibrugarh Flights | Cheap IXB to DIB Booking' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Bagdogra (IXB) to Dibrugarh (DIB) flights with Wizzride. Get low fares, easy booking & multiple airlines. Fly hassle-free to the Tea City of India today!" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratodibrugarh' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Dibrugarh Flights | Cheap IXB to DIB Booking' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Bagdogra (IXB) to Dibrugarh (DIB) flights with Wizzride. Get low fares, easy booking & multiple airlines. Fly hassle-free to the Tea City of India today!" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long is the flight from Bagdogra to Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average direct flight takes around 1 hour 25 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights between Bagdogra and Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airlines like IndiGo, Air India, and Alliance Air operate on this route."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Dibrugarh Airport from the city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dibrugarh Airport (DIB) is about 15 km from the city center."
          }
        },
        {
          "@type": "Question",
          "name": "What is Dibrugarh famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dibrugarh is known as the Tea City of India, famous for tea estates, culture, and as a gateway to Arunachal Pradesh."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to visit Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time is October to March, with pleasant weather for exploring tea gardens and nearby attractions."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
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
              "name": "Bagdogra to Dibrugarh Flights",
              "item": "https://wizzride.com/ourservices/flight-booking/bagdogratodibrugarh"
            }
          ]
        }
      ]
    });

    this.addJsonLd(  {
      "@type": "Flight",
      "name": "Bagdogra to Dibrugarh Flight",
      "airline": {
        "@type": "Airline",
        "name": "IndiGo, Air India, Alliance Air"
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
        "name": "Dibrugarh Airport",
        "iataCode": "DIB",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dibrugarh",
          "addressRegion": "Assam",
          "addressCountry": "IN"
        }
      },
      "flightDistance": {
        "@type": "QuantitativeValue",
        "value": "630",
        "unitCode": "KM"
      },
      "estimatedFlightDuration": "PT1H25M"
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
