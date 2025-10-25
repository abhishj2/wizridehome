import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-kohima',
  standalone: true,
  imports: [],
  templateUrl: './kohima.component.html',
  styleUrl: './kohima.component.css'
})
export class KohimaComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/kohima/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Kohima Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Kohima with Wizzride. Safe travel from Dimapur, Guwahati & Nagaland. Explore heritage sites, scenic landscapes & cultural festivals."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Kohima Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Kohima Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Kohima with Wizzride. Safe travel from Dimapur, Guwahati & Nagaland. Explore heritage sites, scenic landscapes & cultural festivals." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/kohima/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Kohima Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Kohima with Wizzride. Safe travel from Dimapur, Guwahati & Nagaland. Explore heritage sites, scenic landscapes & cultural festivals." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Kohima?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cabs from Dimapur, Guwahati, and nearby towns to Kohima."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kohima suitable for family trips?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kohima is ideal for family trips with attractions like the War Cemetery, museums, viewpoints, and cultural festivals."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Kohima?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter, Spring, and Autumn are the best seasons for visiting Kohima, offering pleasant weather and vibrant events."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Kohima?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, domestic tourists may require an Inner Line Permit (ILP) to visit Nagaland, including Kohima. Foreign tourists need special permits."
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
          "name": "Kohima",
          "item": "https://wizzride.com/destinations/kohima/"
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
