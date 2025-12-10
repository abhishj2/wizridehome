import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-darjeelingtown',
  standalone: true,
  imports: [],
  templateUrl: './darjeelingtown.component.html',
  styleUrl: './darjeelingtown.component.css'
})
export class DarjeelingtownComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['darjeeling-faq', 'darjeeling-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/darjeeling/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Darjeeling Travel Guide | Attractions, Culture & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover the charm of Darjeeling, the Queen of the Hills. Explore top attractions, local cuisine, and travel tips.Book your Wizzride cab for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Darjeeling Travel Guide | Attractions, Culture & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Darjeeling Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover the charm of Darjeeling, the Queen of the Hills. Explore top attractions, local cuisine, and travel tips.Book your Wizzride cab for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/darjeeling/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/darjeeling.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Darjeeling Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover the charm of Darjeeling, the Queen of the Hills. Explore top attractions, local cuisine, and travel tips.Book your Wizzride cab for a seamless journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/darjeeling.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "What is the best time to visit Darjeeling?",
          "acceptedAnswer": {
              "@type": "Answer",
              "text": "The best time to visit Darjeeling is from March to May and from September to November. These months offer pleasant weather and clear views of the Himalayas, making them ideal for sightseeing and outdoor activities."
          }
      },
      {
          "@type": "Question",
          "name": "How far is Darjeeling from Gangtok?",
          "acceptedAnswer": {
              "@type": "Answer",
              "text": "Darjeeling is approximately 100 kilometers from Gangtok. The journey by road takes around 4 to 5 hours depending on traffic and road conditions."
          }
      },
      {
          "@type": "Question",
          "name": "Can I book a shared cab from Bagdogra or NJP to Darjeeling?",
          "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, shared cabs are available from both Bagdogra Airport and New Jalpaiguri (NJP) Railway Station to Darjeeling. Private taxis and app-based cab services are also available for more convenience."
          }
      },
      {
          "@type": "Question",
          "name": "How many days are enough for Darjeeling?",
          "acceptedAnswer": {
              "@type": "Answer",
              "text": "A 3 to 4 day trip is usually enough to explore Darjeeling’s main attractions including Tiger Hill, Batasia Loop, monasteries, tea gardens, and the Darjeeling Himalayan Railway (Toy Train)."
          }
      },
      {
          "@type": "Question",
          "name": "Are there ATMs and mobile networks available in Darjeeling?",
          "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Darjeeling has several ATMs and good mobile network coverage for major service providers. However, connectivity may fluctuate in remote or high-altitude areas nearby."
          }
      }]
    }, 'darjeeling-faq');

    // ✅ BreadcrumbList JSON-LD (Passed with Unique ID)
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
          "name": "Darjeeling",
          "item": "https://wizzride.com/destinations/darjeeling/"
        }
      ]
    }, 'darjeeling-breadcrumb');
  }

  // ✅ Utility: inject LD+JSON scripts safely
  // UPDATED: Allows SSR (removed isPlatformBrowser check) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    // Safety check for document
    if (!this.document) return;

    // Remove existing script with same ID to prevent duplicates
    const existingScript = this.document.getElementById(scriptId);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    // Create and append new script
    const script = this.renderer.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    // Strictly Browser Only - prevents server crash in CommonDestinationService
    if (isPlatformBrowser(this.platformId)) {
      this.commonDestService.initializeDestinationPage();
    }
  }

  ngOnDestroy(): void {
    this.commonDestService.cleanup();

    // Clean up injected Schema scripts (Browser only)
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }
}