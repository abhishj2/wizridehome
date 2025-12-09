import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagdograirport',
  standalone: true,
  imports: [],
  templateUrl: './bagdograirport.component.html',
  styleUrl: './bagdograirport.component.css'
})
export class BagdograirportComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/airports/bagdograairport');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra Airport Taxi | Wizzride Cab Service");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Bagdogra Airport taxis with Wizzride. Affordable, safe, and comfortable rides to Darjeeling, Gangtok, Siliguri & North Bengal."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra Airport Taxi | Wizzride Cab Service"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Bagdogra Airport taxis with Wizzride. Affordable, safe, and comfortable rides to Darjeeling, Gangtok, Siliguri & North Bengal." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/airports/bagdograairport' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airports/bagdogra.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Bagdogra Airport taxis with Wizzride. Affordable, safe, and comfortable rides to Darjeeling, Gangtok, Siliguri & North Bengal." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airports/bagdogra.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a taxi from Bagdogra Airport with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can book online via our website or by contacting our customer support with your pickup and drop details."
          }
        },
        {
          "@type": "Question",
          "name": "Are the taxi fares from Bagdogra Airport fixed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all fares are fixed as per vehicle type with no hidden costs."
          }
        },
        {
          "@type": "Question",
          "name": "What vehicles are available for hire at Bagdogra Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hatchbacks, sedans, SUVs, and shared SUVs are available to suit different group sizes and budgets."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get a taxi for doorstep pickup at Bagdogra Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely, Wizzride provides doorstep pickups and drop-offs from the airport."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Gangtok or Darjeeling from Bagdogra Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It usually takes about 4 to 4.5 hours to Gangtok and 3 to 3.5 hours to Darjeeling by road."
          }
        },
        {
          "@type": "Question",
          "name": "Is Wizzride available 24/7 for Bagdogra Airport transfers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide round-the-clock service for your convenience."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride drivers licensed and experienced?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All our drivers are professionally trained, licensed, and familiar with local routes."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book one-way and round-trip taxis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, both options are available to fit your travel needs."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods does Wizzride accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept cash, credit/debit cards, and online payments."
          }
        }
      ]
    });

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
          "item": "https://wizzride.com/airports/bagdograairport"
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
