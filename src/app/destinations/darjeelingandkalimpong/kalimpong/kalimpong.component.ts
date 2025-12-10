import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-kalimpong',
  standalone: true,
  imports: [],
  templateUrl: './kalimpong.component.html',
  styleUrl: './kalimpong.component.css'
})
export class KalimpongComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['kalimpong-faq', 'kalimpong-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/kalimpong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride Taxi Service – Book Cabs to Kalimpong from Siliguri, Darjeeling & Gangtok");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reliable Wizzride cabs to Kalimpong from Bagdogra Airport, NJP Railway Station, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable, and scenic ride to Kalimpong."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride Taxi Service – Book Cabs to Kalimpong from Siliguri, Darjeeling & Gangtok"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride Taxi Service – Book Cabs to Kalimpong from Siliguri, Darjeeling & Gangtok' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reliable Wizzride cabs to Kalimpong from Bagdogra Airport, NJP Railway Station, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable, and scenic ride to Kalimpong." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/kalimpong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/kalimpong.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride Taxi Service – Book Cabs to Kalimpong from Siliguri, Darjeeling & Gangtok' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reliable Wizzride cabs to Kalimpong from Bagdogra Airport, NJP Railway Station, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable, and scenic ride to Kalimpong." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/kalimpong.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Kalimpong from Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong is approximately 50 km from Darjeeling and takes around 2.5 hours by road."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best activities to do in Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some of the best activities include paragliding at Deolo Hill, visiting monasteries, exploring Lower Echhey Village, and shopping at Haat Bazaar."
          }
        },
        {
          "@type": "Question",
          "name": "Are there shared cabs available to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides shared and reserved cabs from Bagdogra Airport, NJP Railway Station, Darjeeling, and Gangtok."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong safe for solo travelers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kalimpong is one of the safest hill stations in India. The locals are friendly, and there is a low crime rate."
          }
        },
        {
          "@type": "Question",
          "name": "What is the ideal duration to explore Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 2 to 3-day trip is perfect to explore all the major attractions and enjoy a relaxing stay."
          }
        }
      ]
    }, 'kalimpong-faq');

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
          "name": "Kalimpong",
          "item": "https://wizzride.com/destinations/kalimpong/"
        }
      ]
    }, 'kalimpong-breadcrumb');
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