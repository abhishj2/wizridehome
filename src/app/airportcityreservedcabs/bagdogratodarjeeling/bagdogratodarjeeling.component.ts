import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagdogratodarjeeling',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratodarjeeling.component.html',
  styleUrl: './bagdogratodarjeeling.component.css'
})
export class BagdogratodarjeelingComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra Airport to Darjeeling Reserved Cab Service | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a reserved cab from Bagdogra Airport to Darjeeling with Wizzride. Choose from SUVs, sedans, and luxury cars for a comfortable and affordable journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra Airport to Darjeeling Reserved Cab Service | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra Airport to Darjeeling Reserved Cab Service | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a reserved cab from Bagdogra Airport to Darjeeling with Wizzride. Choose from SUVs, sedans, and luxury cars for a comfortable and affordable journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/airports/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra Airport to Darjeeling Reserved Cab Service | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a reserved cab from Bagdogra Airport to Darjeeling with Wizzride. Choose from SUVs, sedans, and luxury cars for a comfortable and affordable journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is there a bus from Bagdogra Airport to Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, Bagdogra Airport does not have direct bus services to Sikkim. You can catch a bus from the Siliguri Bus Station."
          }
        },
        {
          "@type": "Question",
          "name": "Cab Options and Pricing from Bagdogra Airport to Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride offers a variety of cab options for a comfortable journey, including hatchbacks, sedans, SUVs, and luxury Innovas. Taxi fares start at just ₹999, with a fully online booking experience for convenience. Booking in advance is recommended for a smooth trip."
          }
        },
        {
          "@type": "Question",
          "name": "Are there tolls along the way to Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, there are no toll booths along the way from Bagdogra Airport to Gangtok."
          }
        },
        {
          "@type": "Question",
          "name": "Distance and Travel Time",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The total distance from Bagdogra Airport to Gangtok is approximately 125 km, and travel time can take 4 to 5 hours depending on traffic conditions."
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
          "name": "Reserved Cab from Bagdogra Airport to Darjeeling ",
          "item": "ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Darjeeling_Reserved_Cab_Service"
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
