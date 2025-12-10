import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-namchi',
  standalone: true,
  imports: [],
  templateUrl: './namchi.component.html',
  styleUrl: './namchi.component.css'
})
export class NamchiComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['namchi-faq', 'namchi-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/namchi/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Namchi Travel Guide | Attractions, Activities & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Namchi, Sikkim - the cultural heart of the Himalayas. Discover top attractions, best activities, and plan your journey with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Namchi Travel Guide | Attractions, Activities & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Namchi Travel Guide | Attractions, Activities & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Namchi, Sikkim - the cultural heart of the Himalayas. Discover top attractions, best activities, and plan your journey with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/namchi/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Samdruptse.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Namchi Travel Guide | Attractions, Activities & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Namchi, Sikkim - the cultural heart of the Himalayas. Discover top attractions, best activities, and plan your journey with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Samdruptse.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Namchi suitable for family vacations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Namchi is a great family vacation destination. It offers peaceful monasteries, cultural attractions, scenic viewpoints, and family-friendly accommodations suitable for travelers of all ages."
          }
        },
        {
          "@type": "Question",
          "name": "What permits are required to visit Namchi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Indian tourists do not require a permit to visit Namchi. However, foreign nationals need a Restricted Area Permit (RAP) to enter Sikkim, which can be obtained online or at entry checkpoints."
          }
        },
        {
          "@type": "Question",
          "name": "Are there good accommodations in Namchi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Namchi offers a wide range of accommodations including hotels, resorts, and homestays. Options are available for different budgets, from budget-friendly stays to premium resorts with modern amenities."
          }
        },
        {
          "@type": "Question",
          "name": "What should I pack for a trip to Namchi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It is advisable to pack light woolens or jackets, comfortable walking shoes, rain gear if traveling in the monsoon, essential medicines, and ID proofs. Winters can get chilly, so heavier woolens are recommended during that season."
          }
        },
        {
          "@type": "Question",
          "name": "Can I visit Namchi during the monsoon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can visit Namchi during the monsoon, but heavy rains may cause landslides and roadblocks. While the landscapes are lush and green, travel disruptions are common, so visitors should plan accordingly."
          }
        }
      ]
    }, 'namchi-faq');

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
          "name": "Namchi",
          "item": "https://wizzride.com/destinations/namchi/"
        }
      ]
    }, 'namchi-breadcrumb');
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