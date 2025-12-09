import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-siliguritogangtok',
  standalone: true,
  imports: [],
  templateUrl: './siliguritogangtok.component.html',
  styleUrl: './siliguritogangtok.component.css'
})
export class SiliguritogangtokComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Siliguri to Gangtok Shared Taxi | Wizzride Affordable Taxi Services");
    this.metaService.updateTag({
      name: 'description',
      content: "Book your shared cab from Siliguri to Gangtok with Wizzride. Affordable taxi service with multiple pickup points in Siliguri and drop-off locations in Gangtok."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Siliguri to Gangtok Shared Taxi | Wizzride Affordable Taxi Services"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Siliguri to Gangtok Shared Taxi | Wizzride Affordable Taxi Services' });
    this.metaService.updateTag({ property: 'og:description', content: "Book your shared cab from Siliguri to Gangtok with Wizzride. Affordable taxi service with multiple pickup points in Siliguri and drop-off locations in Gangtok." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Siliguri to Gangtok Shared Taxi | Wizzride Affordable Taxi Services' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book your shared cab from Siliguri to Gangtok with Wizzride. Affordable taxi service with multiple pickup points in Siliguri and drop-off locations in Gangtok." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Siliguri from Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The distance of Gangtok from Siliguri is approximately 120 km, and it takes about 4-5 hours by road. A shared taxi from Siliguri to Gangtok is a popular choice for an affordable and convenient journey."
          }
        },
        {
          "@type": "Question",
          "name": "What is the taxi fare from Siliguri to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The taxi fare from Siliguri to Gangtok varies based on vehicle type and whether you choose a shared or private taxi. On average, the fare is around ₹3500* to ₹4500* for a private taxi."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a shared taxi from Gangtok to Siliguri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can book a shared taxi from Gangtok to Siliguri with Wizzride. Our service offers comfortable and affordable rides with flexible pickup and drop-off locations."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best places to visit in Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some popular attractions in Gangtok include MG Marg, Baba Mandir, Changu Lake (Tsomgo Lake), Rumtek Monastery, and the famous Tashi View Point."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a taxi service from Siliguri to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides taxi service from Siliguri to Gangtok, including both shared and private options. Our reliable taxi service ensures a comfortable journey to Gangtok."
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
      "name": "Siliguri to Gangtok Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Gangtok_Shared_Cab_Service/"
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
