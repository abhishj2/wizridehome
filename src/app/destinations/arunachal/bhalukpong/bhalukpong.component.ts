import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-bhalukpong',
  standalone: true,
  imports: [],
  templateUrl: './bhalukpong.component.html',
  styleUrl: './bhalukpong.component.css'
})
export class BhalukpongComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['bhalukpong-faq', 'bhalukpong-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/bhalukpong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bhalukpong Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bhalukpong Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bhalukpong Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/bhalukpong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/bhalukpong-nature.b390d3abf2003899.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bhalukpong Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/bhalukpong-nature.b390d3abf2003899.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Bhalukpong from Tezpur Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bhalukpong is approximately 50 km from Tezpur Airport, around 1.5 hours by car with Wizzride."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Bhalukpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cabs from Tezpur, Guwahati, and nearby towns to Bhalukpong."
          }
        },
        {
          "@type": "Question",
          "name": "Is Bhalukpong suitable for adventure trips?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Bhalukpong is known for camping, river rafting, wildlife exploration, and trekking experiences."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Bhalukpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter, Spring, and Autumn offer the best weather for outdoor activities and sightseeing."
          }
        },
        {
          "@type": "Question",
          "name": "Are permits required to visit Bhalukpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an Inner Line Permit (ILP) is required to enter Arunachal Pradesh, including Bhalukpong."
          }
        }
      ]
    }, 'bhalukpong-faq');

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
          "name": "Bhalukpong",
          "item": "https://wizzride.com/destinations/bhalukpong/"
        }
      ]
    }, 'bhalukpong-breadcrumb');
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