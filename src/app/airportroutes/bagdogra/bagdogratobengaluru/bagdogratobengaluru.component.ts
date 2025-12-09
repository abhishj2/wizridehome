import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bagdogratobengaluru',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratobengaluru.component.html',
  styleUrl: './bagdogratobengaluru.component.css'
})
export class BagdogratobengaluruComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/flight-booking/bagdogratobengaluru');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Bengaluru Flights - Book Affordable Wizzride Flights");
    this.metaService.updateTag({
      name: 'description',
      content: "Book cheap flights from Bagdogra (IXB) to Bengaluru (BLR) with Wizzride. Find flight schedules, fares, and travel tips for a smooth journey. Reserve your Bagdogra to Bengaluru flight today"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Bengaluru Flights - Book Affordable Wizzride Flights"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Bengaluru Flights - Book Affordable Wizzride Flights' });
    this.metaService.updateTag({ property: 'og:description', content: "Book cheap flights from Bagdogra (IXB) to Bengaluru (BLR) with Wizzride. Find flight schedules, fares, and travel tips for a smooth journey. Reserve your Bagdogra to Bengaluru flight today" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/flight-booking/bagdogratobengaluru' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airportroutes/bengaluruairport.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Bengaluru Flights - Book Affordable Wizzride Flights' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book cheap flights from Bagdogra (IXB) to Bengaluru (BLR) with Wizzride. Find flight schedules, fares, and travel tips for a smooth journey. Reserve your Bagdogra to Bengaluru flight today" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airportroutes/bengaluruairport.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the flight duration from Bagdogra to Bengaluru?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The average flight duration from Bagdogra (IXB) to Bengaluru (BLR) is around 3 hours to 3 hours 15 minutes for a nonstop flight."
          }
        },
        {
          "@type": "Question",
          "name": "Which airlines operate flights from Bagdogra to Bengaluru?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Popular airlines such as IndiGo, Air India, SpiceJet, and Vistara operate regular flights between Bagdogra and Bengaluru."
          }
        },
        {
          "@type": "Question",
          "name": "Are there nonstop flights from Bagdogra to Bengaluru?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, nonstop flights are available from Bagdogra Airport (IXB) to Kempegowda International Airport Bengaluru (BLR) offered by select airlines."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to book Bagdogra to Bengaluru flights?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is best to book Bagdogra to Bengaluru flights at least 2-3 weeks in advance to get affordable fares and more options."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Bengaluru airport from the city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kempegowda International Airport (BLR) is located about 40 kilometers from Bengaluru city center and can be reached by taxi, cab, or airport shuttle services."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd( {
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
              "item": "https://wizzride.com/ourservices/flight-booking/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Bagdogra to Bengaluru Flights",
              "item": "https://wizzride.com/ourservices/flight-booking/bagdogratobengaluru"
            }
          ]
          
        } 
      ]   
      });


      this.addJsonLd(   {
        "@type": "Flight",
        "name": "Bagdogra to Bengaluru Flight",
        "provider": {
          "@type": "Airline",
          "name": "Multiple Airlines"
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
          "name": "Kempegowda International Airport",
          "iataCode": "BLR",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bengaluru",
            "addressRegion": "Karnataka",
            "addressCountry": "India"
          }
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": "4500",
          "url": "https://wizzride.com/ourservices/flight-booking/bagdogratobengaluru/",
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
