import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-siliguritokurseong',
  standalone: true,
  imports: [],
  templateUrl: './siliguritokurseong.component.html',
  styleUrl: './siliguritokurseong.component.css'
})
export class SiliguritokurseongComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Siliguri to Kurseong Taxi & Cab Services | Book Shared Cabs, Fares & More");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a reliable taxi or cab from Siliguri to Kurseong with Wizzride. Find taxi fares, schedules, and more for a comfortable journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Siliguri to Kurseong Taxi & Cab Services | Book Shared Cabs, Fares & More"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Siliguri to Kurseong Taxi & Cab Services | Book Shared Cabs, Fares & More' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a reliable taxi or cab from Siliguri to Kurseong with Wizzride. Find taxi fares, schedules, and more for a comfortable journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/kgn.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Siliguri to Kurseong Taxi & Cab Services | Book Shared Cabs, Fares & More' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a reliable taxi or cab from Siliguri to Kurseong with Wizzride. Find taxi fares, schedules, and more for a comfortable journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/kgn.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much is the taxi from NJP to Kurseong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The taxi fare from NJP to Kurseong varies, but typically might range from INR 2500 to 4500, depending on the vehicle and time of travel."
          }
        },
        {
          "@type": "Question",
          "name": "Which road is better from Siliguri to Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best route from Siliguri to Darjeeling is the NH55 highway. For those traveling to Kurseong, you can take the same route, which is scenic and well-maintained."
          }
        },
        {
          "@type": "Question",
          "name": "How much is a taxi from Darjeeling to Kurseong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A taxi from Darjeeling to Kurseong typically costs around INR 2500* to 4500*, depending on the vehicle type and traffic conditions."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the taxi fare from Gangtok to Kurseong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The taxi fare from Gangtok to Kurseong is approximately INR 2800* to 4500*, based on the vehicle type and the distance."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Darjeeling from Siliguri by toy train?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The toy train from Siliguri to Darjeeling takes about 7-8 hours, covering a distance of 88 km."
          }
        },
        {
          "@type": "Question",
          "name": "Which is cheaper, Gangtok or Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Both destinations offer a range of budget options for the customer to explore."
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
      "name": "Siliguri to Kurseong Shared Cab Service",
      "item": "hhttps://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kurseong_Shared_Cab_Service/"
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
