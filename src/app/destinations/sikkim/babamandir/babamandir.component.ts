import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-babamandir',
  standalone: true,
  imports: [],
  templateUrl: './babamandir.component.html',
  styleUrl: './babamandir.component.css'
})
export class BabamandirComponent implements OnInit, AfterViewInit, OnDestroy {

  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['babamandir-faq', 'babamandir-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/babamandir/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Baba Mandir Sikkim – History, Timings, How to Reach & Wizzride Travel Guide");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Baba Harbhajan Singh Temple in Sikkim, a sacred site near Tsomgo Lake and Nathula Pass. Learn its history, timings, how to reach, nearby attractions, and book a safe and comfortable trip with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Baba Mandir Sikkim – History, Timings, How to Reach & Wizzride Travel Guide"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Baba Mandir Sikkim – History, Timings, How to Reach & Wizzride Travel Guide' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Baba Harbhajan Singh Temple in Sikkim, a sacred site near Tsomgo Lake and Nathula Pass. Learn its history, timings, how to reach, nearby attractions, and book a safe and comfortable trip with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/babamandir/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/oldbabamandir.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Baba Mandir Sikkim – History, Timings, How to Reach & Wizzride Travel Guide' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Baba Harbhajan Singh Temple in Sikkim, a sacred site near Tsomgo Lake and Nathula Pass. Learn its history, timings, how to reach, nearby attractions, and book a safe and comfortable trip with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/oldbabamandir.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why is Baba Mandir famous?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Baba Mandir is dedicated to Baba Harbhajan Singh, an Indian Army soldier believed to protect soldiers and travelers in the region. It is known for its spiritual significance and unique legends."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to visit Baba Mandir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Baba Mandir is from April to June and October to December when the weather is clear and the roads are accessible."
          }
        },
        {
          "@type": "Question",
          "name": "Is a permit required to visit Baba Mandir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, visitors need a Protected Area Permit (PAP) to access the Baba Mandir region, which can be arranged by registered tour operators or cab services like Wizzride."
          }
        },
        {
          "@type": "Question",
          "name": "How do I reach Baba Mandir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Baba Mandir is accessible via a scenic drive from Gangtok. You can book a reserved cab from Wizzride for a comfortable and safe journey through high-altitude roads."
          }
        },
        {
          "@type": "Question",
          "name": "Are Old Baba Mandir and New Baba Mandir the same?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Old Baba Mandir is near Kupup, while New Baba Mandir is located on the route to Tsomgo Lake. Both are dedicated to Baba Harbhajan Singh and carry deep spiritual significance."
          }
        }
      ]
    }, 'babamandir-faq');

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
          "name": "Baba Mandir",
          "item": "https://wizzride.com/destinations/babamandir/"
        }
      ]
    }, 'babamandir-breadcrumb');
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