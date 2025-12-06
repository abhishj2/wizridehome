import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';
@Component({
  selector: 'app-bomdila',
  standalone: true,
  imports: [],
  templateUrl: './bomdila.component.html',
  styleUrl: './bomdila.component.css'
})
export class BomdilaComponent  implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/bomdila/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bomdila Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Bomdila with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bomdila Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bomdila Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Bomdila with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/bomdila/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/bomdila-viewpoint.57afaa5c667d4515.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bomdila Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Bomdila with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/bomdila-viewpoint.57afaa5c667d4515.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(       {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Bomdila?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Bomdila is from March to June and September to November. Spring offers blooming rhododendrons and pleasant weather, while autumn provides clear skies and comfortable temperatures for sightseeing and trekking."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Bomdila from Tezpur and how long does the journey take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bomdila is approximately 160 km from Tezpur. The journey by Wizzride cab typically takes 4-5 hours, depending on road conditions and weather. We recommend booking in advance for a comfortable journey."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Bomdila?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you need an Inner Line Permit (ILP) to visit Bomdila as it's in Arunachal Pradesh. You can apply online through the Arunachal Pradesh government website or obtain it from designated offices in major cities."
          }
        },
        {
          "@type": "Question",
          "name": "What types of accommodation are available in Bomdila?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bomdila offers various accommodation options including government guest houses, private hotels, and homestays. We recommend booking accommodation in advance, especially during peak tourist seasons."
          }
        },
        {
          "@type": "Question",
          "name": "Can Wizzride arrange local sightseeing tours in Bomdila?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Wizzride offers local sightseeing packages in Bomdila. Our experienced drivers can take you to popular attractions like Bomdila Monastery, viewpoints, apple orchards, and craft centers with flexible timing."
          }
        },
        {
          "@type": "Question",
          "name": "What should I pack for my Bomdila trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pack warm clothes (temperatures can drop significantly), comfortable walking shoes, rain gear (especially during monsoon), camera, and essential medications. Don't forget your ILP and identification documents."
          }
        }
      ]
    }
    );

 

    // ✅ TouristDestination JSON-LD (specific to Gangtok)
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
          "name": "Destinations",
          "item": "https://wizzride.com/destinations"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Bomdila",
          "item": "https://wizzride.com/destinations/bomdila/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObject);
      this.renderer.appendChild(this.document.head, script);
    }
  }

  ngAfterViewInit(): void {
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
