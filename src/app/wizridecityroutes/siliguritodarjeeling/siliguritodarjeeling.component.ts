import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-siliguritodarjeeling',
  standalone: true,
  imports: [],
  templateUrl: './siliguritodarjeeling.component.html',
  styleUrl: './siliguritodarjeeling.component.css'
})
export class SiliguritodarjeelingComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Siliguri to Darjeeling Shared Cab Service - Comfortable & Affordable Taxi | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book your shared cab from Siliguri to Darjeeling (Distance: 62.7 km) with Wizzride. Enjoy top attractions like Tiger Hill and Batasia Loop."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Siliguri to Darjeeling Shared Cab Service - Comfortable & Affordable Taxi | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Siliguri to Darjeeling Shared Cab Service - Comfortable & Affordable Taxi | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book your shared cab from Siliguri to Darjeeling (Distance: 62.7 km) with Wizzride. Enjoy top attractions like Tiger Hill and Batasia Loop." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/darjeeling.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Siliguri to Darjeeling Shared Cab Service - Comfortable & Affordable Taxi | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book your shared cab from Siliguri to Darjeeling (Distance: 62.7 km) with Wizzride. Enjoy top attractions like Tiger Hill and Batasia Loop." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/darjeeling.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How can I reach Darjeeling from Siliguri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can reach Darjeeling from Siliguri by taxi or shared cab. You can book your ride with Wizzride for a hassle-free journey."
          }
        },
        {
          "@type": "Question",
          "name": "How much does it cost from Siliguri to Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The cost of the ride depends on the type of cab and service you choose. For shared cabs, the price is more affordable, whereas private rides will cost slightly more. Get in touch with us for exact fare details."
          }
        },
        {
          "@type": "Question",
          "name": "How much is a taxi from Siliguri to Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Taxi fares from Siliguri to Darjeeling typically range from INR 2500 to INR 4500 depending on the cab type. For shared cabs, the cost is generally lower."
          }
        },
        {
          "@type": "Question",
          "name": "Which railway station is closest to Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Darjeeling has its own railway station, Darjeeling Railway Station, which is connected by the famous Darjeeling Himalayan Railway (Toy Train)."
          }
        },
        {
          "@type": "Question",
          "name": "Is the Toy train in Darjeeling running?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the Toy Train runs from New Jalpaiguri (NJP) to Darjeeling, providing a scenic and heritage travel experience."
          }
        },
        {
          "@type": "Question",
          "name": "Is Ola available in Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ola cabs are not commonly available in Darjeeling due to its hill station nature. Local taxis are more commonly used."
          }
        },
        {
          "@type": "Question",
          "name": "Is Darjeeling cheap to visit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Darjeeling offers a range of accommodations and experiences to suit all budgets. You can find both budget and luxury options in Darjeeling."
          }
        },
        {
          "@type": "Question",
          "name": "Is Ola available in Siliguri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Ola and other taxi services like Uber, Rapido, and Wizzride are available in Siliguri for your convenience."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Darjeeling from Siliguri by car?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The distance of Darjeeling from Siliguri is approximately 62.7 kilometers, and the travel time from Siliguri to Darjeeling by car is around 2.5 to 3 hours depending on traffic and road conditions."
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
      "name": "Siliguri to Darjeeling Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Darjeeling_Shared_Cab_Service/"
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
