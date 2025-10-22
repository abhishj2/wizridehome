import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-gangtok',
  standalone: true,
  imports: [],
  templateUrl: './gangtok.component.html',
  styleUrl: './gangtok.component.css'
})
export class GangtokComponent implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/gangtok/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Gangtok Travel Guide | Attractions, Culture & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover the charm of Gangtok, the gateway to the Himalayas. Explore top attractions,local cuisine, and travel tips.Book your Wizzride cab for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Gangtok Travel Guide | Attractions, Culture & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Gangtok Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover the charm of Gangtok, the gateway to the Himalayas. Explore top attractions,local cuisine, and travel tips.Book your Wizzride cab for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/gangtok/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Gangtok Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover the charm of Gangtok, the gateway to the Himalayas. Explore top attractions,local cuisine, and travel tips.Book your Wizzride cab for a seamless journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need a permit to visit Gangtok or nearby areas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Indian tourists generally don’t need a permit to enter Gangtok. However, permits such as the Inner Line Permit (ILP) or Restricted Area Permit (RAP) are required for visiting certain nearby areas like Nathula Pass, Tsomgo Lake, and North Sikkim. Foreign nationals need a Restricted Area Permit to visit Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "What are the transportation options to reach Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The nearest airport is Pakyong Airport (about 30 km from Gangtok) and Bagdogra Airport (about 125 km away). You can also reach Gangtok by train via New Jalpaiguri (NJP) Railway Station, then continue by road. Shared cabs, private taxis, and buses are available for the journey uphill."
          }
        },
        {
          "@type": "Question",
          "name": "Is Gangtok suitable for family vacations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Gangtok is a family-friendly destination with scenic views, monasteries, cable car rides, and safe accommodations. It offers activities suitable for kids, elders, and all age groups."
          }
        },
        {
          "@type": "Question",
          "name": "What should I pack for Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pack warm clothes, comfortable walking shoes, rain gear (depending on the season), essential medicines, and valid ID proofs. Winters require heavy woolens, while light woolens are enough in summer."
          }
        },
        {
          "@type": "Question",
          "name": "Are vegetarian food options available in Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Gangtok offers plenty of vegetarian options. Many restaurants serve Indian, Tibetan, and continental vegetarian dishes. Jain food is also available at select eateries."
          }
        },
        {
          "@type": "Question",
          "name": "Are there medical facilities in Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Gangtok has hospitals, pharmacies, and clinics that provide medical facilities. It’s advisable to carry personal medicines, especially if you plan to visit remote areas where facilities may be limited."
          }
        }
      ]
    });

 

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
          "name": "Gangtok",
          "item": "https://wizzride.com/destinations/gangtok/"
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
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
