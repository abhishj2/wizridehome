import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-aritarlake',
  standalone: true,
  imports: [],
  templateUrl: './aritarlake.component.html',
  styleUrl: './aritarlake.component.css'
})
export class AritarlakeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['aritar-faq', 'aritar-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/aritarlake/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Aritar Lake – Top Attractions, How to Reach, Best Time & Wizzride Travel Guide");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Aritar Lake (Lampokhari), an offbeat gem in East Sikkim known for boating, scenic views, monasteries, and nature trails. Explore attractions, things to do, how to reach, best time to visit, stays, and book your Aritar trip with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Aritar Lake – Top Attractions, How to Reach, Best Time & Wizzride Travel Guide"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Aritar Lake – Top Attractions, How to Reach, Best Time & Wizzride Travel Guide' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Aritar Lake (Lampokhari), an offbeat gem in East Sikkim known for boating, scenic views, monasteries, and nature trails. Explore attractions, things to do, how to reach, best time to visit, stays, and book your Aritar trip with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/aritarlake/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/lampokhari.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Aritar Lake – Top Attractions, How to Reach, Best Time & Wizzride Travel Guide' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Aritar Lake (Lampokhari), an offbeat gem in East Sikkim known for boating, scenic views, monasteries, and nature trails. Explore attractions, things to do, how to reach, best time to visit, stays, and book your Aritar trip with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/lampokhari.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Aritar Lake suitable for families?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Aritar Lake is peaceful, safe, and ideal for family trips with boating and scenic walks."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to visit Aritar Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Aritar Lake is from March to May and September to November when the weather is pleasant and mountain views are clear."
          }
        },
        {
          "@type": "Question",
          "name": "How do I reach Aritar Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Aritar Lake is accessible from Gangtok, Bagdogra, NJP, and Pakyong Airport by road. You can book a comfortable reserved cab with Wizzride for a smooth journey."
          }
        },
        {
          "@type": "Question",
          "name": "Is boating available at Aritar Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, paddle boating is available at Lampokhari Lake, making it one of the few natural lakes in Sikkim offering boating."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a permit to visit Aritar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No permits are required to visit Aritar. However, if you plan to travel further to Zuluk, Nathang Valley, or Kupup, a Protected Area Permit (PAP) is needed."
          }
        }
      ]
    }, 'aritar-faq');

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
          "name": "Aritar Lake",
          "item": "https://wizzride.com/destinations/aritarlake/"
        }
      ]
    }, 'aritar-breadcrumb');
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
    // CRITICAL FIX: Strictly Browser Only
    // This prevents the "document is not defined" error in CommonDestinationService during SSR
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