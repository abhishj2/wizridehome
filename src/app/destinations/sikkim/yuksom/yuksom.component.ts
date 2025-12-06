import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-yuksom',
  standalone: true,
  imports: [],
  templateUrl: './yuksom.component.html',
  styleUrl: './yuksom.component.css'
})
export class YuksomComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/yuksom/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Yuksom Travel Guide | Attractions, Trekking & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Yuksom, Sikkim – a historic town with monasteries, trekking trails, and cultural heritage. Discover top attractions, best routes, and Wizzride cab services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Yuksom Travel Guide | Attractions, Trekking & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Yuksom Travel Guide | Attractions, Trekking & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Yuksom, Sikkim – a historic town with monasteries, trekking trails, and cultural heritage. Discover top attractions, best routes, and Wizzride cab services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/yuksom/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/yuksom.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Yuksom Travel Guide | Attractions, Trekking & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Yuksom, Sikkim – a historic town with monasteries, trekking trails, and cultural heritage. Discover top attractions, best routes, and Wizzride cab services." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/yuksom.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How far is Yuksom from Gangtok?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yuksom is approximately 120 kilometers from Gangtok. The journey by road takes around 5 to 6 hours, depending on traffic and road conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Are Wizzride cabs available to Yuksom?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride and other shared cab services are available for travel between Gangtok and Yuksom. Private taxis can also be hired for more convenience."
            }
          },
          {
            "@type": "Question",
            "name": "Is a permit required to visit Yuksom?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No permit is required for Indian tourists to visit Yuksom. However, foreign nationals need a Restricted Area Permit (RAP) to enter Sikkim, which can be obtained online or at designated checkpoints."
            }
          },
          {
            "@type": "Question",
            "name": "Best time to visit Yuksom?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The best time to visit Yuksom is from March to May and from September to November. These months offer pleasant weather, clear skies, and excellent conditions for trekking and sightseeing."
            }
          },
          {
            "@type": "Question",
            "name": "Are there accommodations in Yuksom?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Yuksom has a variety of accommodations including guesthouses, homestays, and mid-range hotels. Most options are budget-friendly and provide basic facilities for trekkers and travelers."
            }
          }
        ]
      });

 

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
          "name": "Yuksom",
          "item": "https://wizzride.com/destinations/yuksom/"
        }
      ]
    }
    );
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
