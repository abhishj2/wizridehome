import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-lachung',
  standalone: true,
  imports: [],
  templateUrl: './lachung.component.html',
  styleUrl: './lachung.component.css'
})
export class LachungComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['lachung-faq', 'lachung-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/lachung/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Lachung Travel Guide | Attractions, Activities & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Lachung, Sikkim – a scenic mountain village with stunning landscapes, monasteries, and pristine beauty. Find top attractions, travel tips, and Wizzride cab services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Lachung Travel Guide | Attractions, Activities & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Lachung Travel Guide | Attractions, Activities & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Lachung, Sikkim – a scenic mountain village with stunning landscapes, monasteries, and pristine beauty. Find top attractions, travel tips, and Wizzride cab services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/lachung/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/lachung.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Lachung Travel Guide | Attractions, Activities & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Lachung, Sikkim – a scenic mountain village with stunning landscapes, monasteries, and pristine beauty. Find top attractions, travel tips, and Wizzride cab services." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/lachung.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Lachung suitable for a family trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Lachung is a great family travel destination. It offers scenic landscapes, waterfalls, the Yumthang Valley, and a peaceful environment suitable for families with children and elders."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to carry cash in Lachung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, it is advisable to carry sufficient cash while visiting Lachung, as ATMs and digital payment facilities are very limited in the region."
          }
        },
        {
          "@type": "Question",
          "name": "Are permits required to visit Lachung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, a Protected Area Permit (PAP) is required for both Indian and foreign tourists to visit Lachung. These permits can be arranged through registered tour operators in Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "What kind of clothing should I pack for Lachung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pack warm clothes, as Lachung is a cold destination throughout the year. Heavy woolens, jackets, gloves, and comfortable trekking shoes are recommended, especially in winter."
          }
        },
        {
          "@type": "Question",
          "name": "Are there medical facilities in Lachung?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Lachung has limited medical facilities with small health centers. For serious medical needs, tourists may need to travel back to Gangtok or larger towns. It is advisable to carry personal medicines."
          }
        }
      ]
    }, 'lachung-faq');

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
          "name": "Lachung",
          "item": "https://wizzride.com/destinations/lachung/"
        }
      ]
    }, 'lachung-breadcrumb');
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