import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-mon',
  standalone: true,
  imports: [],
  templateUrl: './mon.component.html',
  styleUrl: './mon.component.css'
})
export class MonComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['mon-faq', 'mon-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/mon/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Mon Village Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Mon Village Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Mon Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/mon/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/monbanner.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Mon Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/monbanner.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Mon from Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mon is approximately 280 km from Dimapur, taking around 9–10 hours by cab, depending on road conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe to travel to Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Mon is safe for tourists. Wizzride ensures experienced drivers and local support throughout your journey."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to visit Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "March and April are ideal, especially to attend the Aoling Festival of the Konyaks. Winters are also scenic and calm."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need any permits to visit Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an Inner Line Permit (ILP) is required to enter Nagaland, including Mon. You can apply online or through designated government offices."
          }
        }
      ]
    }, 'mon-faq');

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
          "name": "Mon",
          "item": "https://wizzride.com/destinations/mon/"
        }
      ]
    }, 'mon-breadcrumb');
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