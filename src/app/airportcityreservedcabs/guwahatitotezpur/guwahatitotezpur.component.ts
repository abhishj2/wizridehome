import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-guwahatitotezpur',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitotezpur.component.html',
  styleUrl: './guwahatitotezpur.component.css'
})
export class GuwahatitotezpurComponent   implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private commonAirportService: CommonAirportService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride Taxi Service – Guwahati to Tezpur & Vice Versa");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reliable Guwahati to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride Taxi Service – Guwahati to Tezpur & Vice Versa"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride Taxi Service – Guwahati to Tezpur & Vice Versa' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reliable Guwahati to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service/'});
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/tezpur.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride Taxi Service – Guwahati to Tezpur & Vice Versa' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reliable Guwahati to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/tezpur.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "Is there a direct train to Tezpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, the nearest major station is Rangapara North. Wizzride offers cabs from there to Tezpur."
          }
        },
        {
          "@type": "Question",
          "name": "What is the fastest way to travel from Guwahati to Tezpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A Wizzride private cab offers the quickest and most comfortable journey."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Tezpur Airport from the city?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tezpur Airport is about 8 km from the city. Wizzride can take you there in around 15 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "Are there tolls on the Guwahati–Tezpur route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No major toll gates are present along the Guwahati–Tezpur route."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a shared ride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers shared cab services for budget-conscious travelers."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wizzride.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Our Services",
          "item": "https://wizzride.com/ourservices"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Luxury Reserved Cabs",
          "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Guwahati Airport to Tezpur Reserved Cab Service",
          "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_To_Tezpur_Reserved_Cab_Service/"
        }
      ]
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
    this.commonAirportService.initializeAirportPage();
  }

  ngOnDestroy(): void {
    this.commonAirportService.cleanup();
  }
}
