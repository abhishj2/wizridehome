import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-dimapur',
  standalone: true,
  imports: [],
  templateUrl: './dimapur.component.html',
  styleUrl: './dimapur.component.css'
})
export class DimapurComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/dimapur/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Dimapur Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Dimapur with Wizzride. Hassle-free travel from Kohima, Guwahati & Nagaland. Explore markets, historical sites & tribal culture."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Dimapur Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Dimapur Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Dimapur with Wizzride. Hassle-free travel from Kohima, Guwahati & Nagaland. Explore markets, historical sites & tribal culture." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/dimapur/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/dimapur-hills.6451ae835475b39d.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Dimapur Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Dimapur with Wizzride. Hassle-free travel from Kohima, Guwahati & Nagaland. Explore markets, historical sites & tribal culture." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/dimapur-hills.6451ae835475b39d.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available in Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cabs within Dimapur and for routes to Kohima, Guwahati, and nearby destinations."
          }
        },
        {
          "@type": "Question",
          "name": "Is Dimapur worth visiting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Dimapur is Nagaland's commercial hub, known for its markets, Kachari Ruins, and cultural experiences. It's also a key gateway to other parts of Nagaland."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter, Spring, and Autumn are the best seasons to visit Dimapur, offering pleasant weather for sightseeing and exploring markets."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, domestic tourists require an Inner Line Permit (ILP) to visit Nagaland, including Dimapur. Foreign tourists need special permits."
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
          "name": "Dimapur",
          "item": "https://wizzride.com/destinations/dimapur/"
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
