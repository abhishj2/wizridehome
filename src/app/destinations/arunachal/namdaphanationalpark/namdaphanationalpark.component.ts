import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-namdaphanationalpark',
  standalone: true,
  imports: [],
  templateUrl: './namdaphanationalpark.component.html',
  styleUrl: './namdaphanationalpark.component.css'
})
export class NamdaphanationalparkComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['namdapha-faq', 'namdapha-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/namdaphanationalpark/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Namdapha National Park Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Namdapha National Park with Wizzride. Travel safely from Dibrugarh, Tinsukia & Arunachal. Explore forests, rare wildlife & adventures."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Namdapha National Park Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Namdapha National Park Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Namdapha National Park with Wizzride. Travel safely from Dibrugarh, Tinsukia & Arunachal. Explore forests, rare wildlife & adventures." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/namdaphanationalpark/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/namdapha-forest.2b9dae05477a56b5.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Namdapha National Park Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Namdapha National Park with Wizzride. Travel safely from Dibrugarh, Tinsukia & Arunachal. Explore forests, rare wildlife & adventures." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/namdapha-forest.2b9dae05477a56b5.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Namdapha National Park from Dibrugarh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Namdapha National Park is approximately 160 km from Dibrugarh, around 5 to 6 hours by car."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Namdapha?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers reserved cab services from Dibrugarh, Tinsukia, and Mohanbari Airport to Namdapha National Park."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Namdapha National Park?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter and Spring (November to April) are ideal for wildlife spotting, trekking, and exploring the park comfortably."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Namdapha?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Inner Line Permit (ILP) for Arunachal Pradesh and park entry permits are mandatory for visitors."
          }
        },
        {
          "@type": "Question",
          "name": "Are accommodations available near Namdapha?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basic guesthouses, eco-camps, and forest rest houses are available near Miao and Deban, the entry points of Namdapha National Park."
          }
        }
      ]
    }, 'namdapha-faq');

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
          "name": "Namdapha National Park",
          "item": "https://wizzride.com/destinations/namdaphanationalpark/"
        }
      ]
    }, 'namdapha-breadcrumb');
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