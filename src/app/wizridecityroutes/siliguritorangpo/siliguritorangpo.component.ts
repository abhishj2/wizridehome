import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-siliguritorangpo',
  standalone: true,
  imports: [],
  templateUrl: './siliguritorangpo.component.html',
  styleUrl: './siliguritorangpo.component.css'
})
export class SiliguritorangpoComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Siliguri to Rangpo Shared Cab | Affordable Taxi Service - Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to Rangpo Sikkim. Affordable, safe, and timely rides for a smooth journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Siliguri to Rangpo Shared Cab | Affordable Taxi Service - Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Siliguri to Rangpo Shared Cab | Affordable Taxi Service - Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to Rangpo Sikkim. Affordable, safe, and timely rides for a smooth journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/rangpo.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Siliguri to Rangpo Shared Cab | Affordable Taxi Service - Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to Rangpo Sikkim. Affordable, safe, and timely rides for a smooth journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/rangpo.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Rangpo in Sikkim famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rangpo is known for its scenic landscapes, the confluence of the Rangpo and Teesta rivers, and its proximity to the Sikkim border. It serves as a major entry point to Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Siliguri from Rangpo by train?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rangpo does not have a railway station yet."
          }
        },
        {
          "@type": "Question",
          "name": "Which is the nearest airport to Rangpo Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The nearest airport to Rangpo is Bagdogra Airport (IXB), located about 86.9 km away, with a 2.5-hour drive to Rangpo."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a Rangpo railway station?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, Rangpo does not have its own railway station."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Rangpo from Siliguri by bus?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rangpo is approximately 75.1 km from Siliguri by bus, taking about 2 to 2.5 hours for the journey."
          }
        },
        {
          "@type": "Question",
          "name": "Which is the ice point in Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tsomgo Lake (Changu Lake) is one of the famous ice points in Sikkim, known for its frozen waters during winter."
          }
        },
        {
          "@type": "Question",
          "name": "What is the name of god of Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The main deity worshipped in Sikkim is Guru Rinpoche (Padmasambhava), who is regarded as the patron saint of the state."
          }
        },
        {
          "@type": "Question",
          "name": "Which part of Sikkim is beautiful?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sikkim is known for its breathtaking beauty, especially places like Gangtok, Yuksom, Zuluk, and Pelling. The entire state offers stunning views of the Himalayas and lush landscapes."
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
      "name": "Siliguri to Rangpo Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Rangpo_Shared_Cab_Service/"
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
