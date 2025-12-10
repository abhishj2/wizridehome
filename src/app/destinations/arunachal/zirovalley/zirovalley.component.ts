import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-zirovalley',
  standalone: true,
  imports: [],
  templateUrl: './zirovalley.component.html',
  styleUrl: './zirovalley.component.css'
})
export class ZirovalleyComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['ziro-faq', 'ziro-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/zirovalley/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Ziro Valley Cab Booking | Wizzride Private Ride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Ziro Valley with Wizzride. Travel safely from Itanagar, Guwahati & Arunachal. Explore lush landscapes, Apatani culture & the Ziro Music Festival."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Ziro Valley Cab Booking | Wizzride Private Ride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Ziro Valley Cab Booking | Wizzride Private Ride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Ziro Valley with Wizzride. Travel safely from Itanagar, Guwahati & Arunachal. Explore lush landscapes, Apatani culture & the Ziro Music Festival." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/tawang/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/ziro-photography.879c0ae245257b97.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Ziro Valley Cab Booking | Wizzride Private Ride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Ziro Valley with Wizzride. Travel safely from Itanagar, Guwahati & Arunachal. Explore lush landscapes, Apatani culture & the Ziro Music Festival." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/ziro-photography.879c0ae245257b97.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Ziro Valley from Itanagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ziro Valley is approximately 115 km from Itanagar, around 3.5 to 4 hours by car."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Ziro Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cab services from Itanagar, Naharlagun, North Lakhimpur, and Guwahati to Ziro Valley."
          }
        },
        {
          "@type": "Question",
          "name": "When is the Ziro Music Festival held?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Ziro Music Festival is usually held in late September, showcasing indie artists in a stunning outdoor setting."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Ziro Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spring, Autumn, and Winter are ideal for pleasant weather, scenic beauty, and cultural experiences."
          }
        },
        {
          "@type": "Question",
          "name": "Are there accommodations in Ziro Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Ziro Valley offers homestays, guesthouses, and eco-lodges with scenic views and local hospitality."
          }
        }
      ]
    }, 'ziro-faq');

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
          "name": "Ziro Valley",
          "item": "https://wizzride.com/destinations/zirovalley/"
        }
      ]
    }, 'ziro-breadcrumb');
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