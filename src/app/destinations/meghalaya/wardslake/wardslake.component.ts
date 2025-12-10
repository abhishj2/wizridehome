import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-wardslake',
  standalone: true,
  imports: [],
  templateUrl: './wardslake.component.html',
  styleUrl: './wardslake.component.css'
})
export class WardslakeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['wardslake-faq', 'wardslake-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/wards-lake-shillong');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wards Lake Shillong – Best Tourist Spot & Boating Destination | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Visit Wards Lake Shillong – a serene lake in the heart of the city with boating, gardens, and cafes. Book your Wizzride cab from Guwahati or Shillong for a scenic journey today!"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wards Lake Shillong – Best Tourist Spot & Boating Destination | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wards Lake Shillong – Best Tourist Spot & Boating Destination | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Visit Wards Lake Shillong – a serene lake in the heart of the city with boating, gardens, and cafes. Book your Wizzride cab from Guwahati or Shillong for a scenic journey today!" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/wards-lake-shillong' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/WardsLakeShillong.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wards Lake Shillong – Best Tourist Spot & Boating Destination | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Visit Wards Lake Shillong – a serene lake in the heart of the city with boating, gardens, and cafes. Book your Wizzride cab from Guwahati or Shillong for a scenic journey today!" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/WardsLakeShillong.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Wards Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Wards Lake is between October and May when the weather is pleasant and ideal for outdoor activities."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Wards Lake from Shillong city center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wards Lake is located in the heart of Shillong, near Police Bazaar, within walking distance from major hotels and cafes."
          }
        },
        {
          "@type": "Question",
          "name": "Are boating facilities available at Wards Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, visitors can enjoy paddle boating on the calm waters of Wards Lake throughout the day."
          }
        },
        {
          "@type": "Question",
          "name": "What are the opening hours of Wards Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wards Lake is open daily from 8:30 AM to 5:30 PM, except on Tuesdays when it remains closed."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Wards Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can easily book a Wizzride cab to Wards Lake through the Wizzride website or app by selecting your pickup and drop points."
          }
        }
      ]
    }, 'wardslake-faq');

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
          "name": "Wards Lake",
          "item": "https://wizzride.com/destinations/wards-lake-shillong"
        }
      ]
    }, 'wardslake-breadcrumb');
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