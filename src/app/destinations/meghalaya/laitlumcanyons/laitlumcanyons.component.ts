import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-laitlumcanyons',
  standalone: true,
  imports: [],
  templateUrl: './laitlumcanyons.component.html',
  styleUrl: './laitlumcanyons.component.css'
})
export class LaitlumcanyonsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['laitlum-faq', 'laitlum-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/laitlum/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Laitlum Canyons Guide | Top Attractions & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Laitlum Canyons Guide | Top Attractions & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Laitlum Canyons Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/laitlum/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/laitlum-canyons-cover.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Laitlum Canyons Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/laitlum-canyons-cover.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit is from October to March, when the weather is cool and the skies are clear for panoramic views."
          }
        },
        {
          "@type": "Question",
          "name": "How difficult is the trek to the bottom of Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The trek to the bottom is moderately difficult. It involves descending steep slopes, but the stunning views along the way make it worth the effort."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Laitlum Canyons from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Laitlum Canyons is located approximately 20 km from Shillong, which takes about 45 minutes by car."
          }
        },
        {
          "@type": "Question",
          "name": "Can I take a cab to Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can easily book a Wizzride reserved cab to Laitlum Canyons from Shillong or other nearby locations."
          }
        },
        {
          "@type": "Question",
          "name": "Are there any accommodation options near Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, there are several guesthouses, resorts, and homestays around Shillong that provide comfortable accommodation for visitors to Laitlum Canyons."
          }
        }
      ]
    }, 'laitlum-faq');

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
          "name": "Laitlum Canyons",
          "item": "https://wizzride.com/destinations/laitlum/"
        }
      ]
    }, 'laitlum-breadcrumb');
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