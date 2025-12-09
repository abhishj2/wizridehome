import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagairporttogangtok',
  standalone: true,
  imports: [],
  templateUrl: './bagairporttogangtok.component.html',
  styleUrl: './bagairporttogangtok.component.css'
})
export class BagairporttogangtokComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Luxury-Shared-Cabs/Bagdogra_Airport_to_Gangtok_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Gangtok - Shared Cab Service| Book with Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a reliable shared cab from Bagdogra to Gangtok. Enjoy affordable, comfortable rides with Wizzride. Bagdogra to Gangtok Distance is 125km."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Gangtok - Shared Cab Service| Book with Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Gangtok - Shared Cab Service| Book with Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a reliable shared cab from Bagdogra to Gangtok. Enjoy affordable, comfortable rides with Wizzride. Bagdogra to Gangtok Distance is 125km." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Luxury-Shared-Cabs/Bagdogra_Airport_to_Gangtok_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Gangtok - Shared Cab Service| Book with Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a reliable shared cab from Bagdogra to Gangtok. Enjoy affordable, comfortable rides with Wizzride. Bagdogra to Gangtok Distance is 125km." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "What is the cost of a shared cab from Bagdogra to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The cost varies based on demand and time of booking. Check our Pricing Page for the latest rates."
          }
        },
        {
          "@type": "Question",
          "name": "Which month is best to visit Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best months to visit are March to May and September to November for pleasant weather and breathtaking views."
          }
        },
        {
          "@type": "Question",
          "name": "Is Ola available in Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ola services are not available in Gangtok, but Wizzride provides reliable cab options for shared or reserved rides."
          }
        },
        {
          "@type": "Question",
          "name": "What is the last time to avail Bagdogra taxi service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Bagdogra Airport taxi services are available anytime at the Airport. For a more reliable and affordable option, choose Wizzride's shared cab services."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the car fare from Siliguri to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Car fares vary depending on the service type."
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
          "name": "Luxury Shared Cabs",
          "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Bagdogra Airport to Gangtok Shared Cab Service",
          "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Luxury-Shared-Cabs/Bagdogra_Airport_to_Gangtok_Shared_Cab_Service/"
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
    if (isPlatformBrowser(this.platformId)) {
      this.commonAirportService.initializeAirportPage();
    }
  }

  ngOnDestroy(): void {
    this.commonAirportService.cleanup();
  }
}
