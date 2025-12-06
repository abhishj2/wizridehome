import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';
@Component({
  selector: 'app-itanagar',
  standalone: true,
  imports: [],
  templateUrl: './itanagar.component.html',
  styleUrl: './itanagar.component.css'
})
export class ItanagarComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/itanagar/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Itanagar Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Itanagar from Guwahati, Naharlagun & more with Wizzride. Explore Arunachal Pradesh in comfort and safety."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Itanagar Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Itanagar Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Itanagar from Guwahati, Naharlagun & more with Wizzride. Explore Arunachal Pradesh in comfort and safety." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/itanagar/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Arunachal.edc6adb2c16bc584.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Itanagar Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Itanagar from Guwahati, Naharlagun & more with Wizzride. Explore Arunachal Pradesh in comfort and safety." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Arunachal.edc6adb2c16bc584.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(        {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": " How far is Itanagar from Lilabari Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Itanagar is approximately 70 km from Lilabari Airport, around 2 hours by car with Wizzride."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Itanagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, reserved cabs are available from Lilabari, North Lakhimpur, and Guwahati to Itanagar."
          }
        },
        {
          "@type": "Question",
          "name": "Is Itanagar suitable for family trips?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Itanagar offers cultural, historical, and scenic attractions suitable for families and groups."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Itanagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": " Winter, Spring, and Autumn offer pleasant weather and vibrant festivals."
          }
        },
        {
          "@type": "Question",
          "name": "Are there accommodations in Itanagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Itanagar offers hotels, guesthouses, and homestays catering to all budgets."
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
          "name": "Itanagar",
          "item": "https://wizzride.com/destinations/itanagar/"
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
