import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-guwahaticity',
  standalone: true,
  imports: [],
  templateUrl: './guwahaticity.component.html',
  styleUrl: './guwahaticity.component.css'
})
export class GuwahaticityComponent  implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,`r`n    @Inject(PLATFORM_ID) private platformId: Object`r`n  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/guwahati/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati Travel Guide | Attractions, Culture & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Guwahati, the Gateway to Northeast India. Explore top attractions, local cuisine & travel tips. Book your Wizzride cab today for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati Travel Guide | Attractions, Culture & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Guwahati, the Gateway to Northeast India. Explore top attractions, local cuisine & travel tips. Book your Wizzride cab today for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/guwahati/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/majuliboa.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Guwahati, the Gateway to Northeast India. Explore top attractions, local cuisine & travel tips. Book your Wizzride cab today for a seamless journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/majuliboa.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(      {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Guwahati famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Guwahati is famous for the Kamakhya Temple, the Brahmaputra River, vibrant Assamese culture, wildlife sanctuaries, and as the gateway to Northeast India."
          }
        },
        {
          "@type": "Question",
          "name": "How many days are enough for Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 2 to 3 day trip is usually enough to explore Guwahati’s main attractions such as the Kamakhya Temple, Umananda Temple, Assam State Zoo, and Brahmaputra River cruises."
          }
        },
        {
          "@type": "Question",
          "name": "Is Guwahati safe for tourists?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Guwahati is generally safe for tourists. Standard travel precautions should be followed, especially when traveling at night or in less-crowded areas."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best way to travel in Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best way to travel in Guwahati is by local taxis, app-based cab services, and auto-rickshaws. City buses also operate on major routes, while private cabs are convenient for sightseeing."
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
          "name": "Guwahati",
          "item": "https://wizzride.com/destinations/guwahati/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {`r`n    if (isPlatformBrowser(this.platformId)) {`r`n      const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);`r`n    }
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
