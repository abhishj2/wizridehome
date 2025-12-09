import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-pakyongairport',
  standalone: true,
  imports: [],
  templateUrl: './pakyongairport.component.html',
  styleUrl: './pakyongairport.component.css'
})
export class PakyongairportComponent  implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private commonAirportService: CommonAirportService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/airports/pakyongairport');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Pakyong Airport Taxi | Wizzride Cab Service");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Pakyong Airport taxis with Wizzride. Affordable fares, expert drivers & comfy rides to Gangtok, Darjeeling & across Sikkim."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Pakyong Airport Taxi | Wizzride Cab Service"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Pakyong Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Pakyong Airport taxis with Wizzride. Affordable fares, expert drivers & comfy rides to Gangtok, Darjeeling & across Sikkim." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/airports/pakyongairport/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airports/pakyonairport.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Pakyong Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Pakyong Airport taxis with Wizzride. Affordable fares, expert drivers & comfy rides to Gangtok, Darjeeling & across Sikkim." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airports/pakyonairport.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a taxi from Pakyong Airport with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can book easily online or through our customer support by providing your travel details."
          }
        },
        {
          "@type": "Question",
          "name": "Are the taxi fares from Pakyong Airport fixed or negotiable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our fares are fixed according to vehicle type with no hidden charges."
          }
        },
        {
          "@type": "Question",
          "name": "What types of vehicles does Wizzride offer at Pakyong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide hatchbacks, sedans, SUVs, and shared SUVs."
          }
        },
        {
          "@type": "Question",
          "name": "Is doorstep pickup available from Pakyong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer doorstep pickups and drop-offs for your convenience."
          }
        },
        {
          "@type": "Question",
          "name": "What is the travel time from Pakyong Airport to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey takes approximately 1 to 1.5 hours."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wizzride operate 24/7 from Pakyong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our services are available round the clock."
          }
        },
        {
          "@type": "Question",
          "name": "Are the drivers experienced and licensed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All our drivers are licensed and well-trained with knowledge of local routes."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book one-way or round-trip taxi services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, both one-way and round-trip options are available."
          }
        },
        {
          "@type": "Question",
          "name": "What payment options are accepted by Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept cash, card payments, and online transactions."
          }
        }
      ]
    }
    );

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
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
          "name": "Airports",
          "item": "https://wizzride.com/airports"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Guwahati Airport",
          "item": "https://wizzride.com/airports/pakyongairport"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.commonAirportService.initializeAirportPage();
    }
  }

  ngOnDestroy(): void {
    this.commonAirportService.cleanup();
  }
}
