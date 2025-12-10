import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-mokokchung',
  standalone: true,
  imports: [],
  templateUrl: './mokokchung.component.html',
  styleUrl: './mokokchung.component.css'
})
export class MokokchungComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['mokokchung-faq', 'mokokchung-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/mokokchung/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Mokokchung Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reserved cabs to Mokokchung with Wizzride. Safe travel from Dimapur, Kohima & Nagaland. Explore hills, Ao heritage & vibrant local culture."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Mokokchung Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Mokokchung Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reserved cabs to Mokokchung with Wizzride. Safe travel from Dimapur, Kohima & Nagaland. Explore hills, Ao heritage & vibrant local culture." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/mokokchung/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/mokokchung-town-view.7963861e96a4d888.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Mokokchung Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reserved cabs to Mokokchung with Wizzride. Safe travel from Dimapur, Kohima & Nagaland. Explore hills, Ao heritage & vibrant local culture." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/mokokchung-town-view.7963861e96a4d888.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Mokokchung from Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mokokchung is approximately 160 km from Dimapur, around 5-6 hours by car with Wizzride, depending on road conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Mokokchung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cabs from Dimapur, Kohima, and nearby towns to Mokokchung."
          }
        },
        {
          "@type": "Question",
          "name": "Is Mokokchung worth visiting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Mokokchung is known as the cultural capital of Nagaland, famous for Ao Naga heritage, scenic hills, and traditional villages."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Mokokchung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter, Spring, and Autumn are the best seasons to visit Mokokchung, offering pleasant weather for sightseeing and cultural experiences."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Mokokchung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, domestic tourists require an Inner Line Permit (ILP) to visit Nagaland, including Mokokchung. Foreign tourists need special permits."
          }
        }
      ]
    }, 'mokokchung-faq');

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
          "name": "Mokokchung",
          "item": "https://wizzride.com/destinations/mokokchung/"
        }
      ]
    }, 'mokokchung-breadcrumb');
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