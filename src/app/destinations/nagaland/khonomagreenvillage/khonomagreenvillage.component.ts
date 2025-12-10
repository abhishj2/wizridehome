import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-khonomagreenvillage',
  standalone: true,
  imports: [],
  templateUrl: './khonomagreenvillage.component.html',
  styleUrl: './khonomagreenvillage.component.css'
})
export class KhonomagreenvillageComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['khonoma-faq', 'khonoma-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/khonomagreenvillage/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Khonoma Green Village Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Khonoma Green Village with Wizzride. Safe travel from Kohima, Dimapur & Nagaland. Explore eco-tourism, scenic trails & Angami culture.."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Khonoma Green Village Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Khonoma Green Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Khonoma Green Village with Wizzride. Safe travel from Kohima, Dimapur & Nagaland. Explore eco-tourism, scenic trails & Angami culture.." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/khonomagreenvillage/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/khonoma.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Khonoma Green Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Khonoma Green Village with Wizzride. Safe travel from Kohima, Dimapur & Nagaland. Explore eco-tourism, scenic trails & Angami culture.." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/khonoma.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Khonoma from Kohima?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Khonoma is around 20 km from Kohima, approximately 1 hour by road via Wizzride cabs."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Khonoma?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride private cabs are available from Dimapur and Kohima to Khonoma."
          }
        },
        {
          "@type": "Question",
          "name": "Is Khonoma safe for solo travelers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. Locals are welcoming and the village is very safe for solo travelers."
          }
        },
        {
          "@type": "Question",
          "name": "Best season to visit Khonoma?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "October to April is the best time to visit Khonoma for pleasant weather and cultural festivals."
          }
        },
        {
          "@type": "Question",
          "name": "Are there ATMs or network facilities?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mobile network coverage is limited in Khonoma. It's best to carry sufficient cash from Kohima as ATMs are scarce."
          }
        }
      ]
    }, 'khonoma-faq');

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
          "name": "Khonoma Green Village",
          "item": "https://wizzride.com/destinations/khonomagreenvillage/"
        }
      ]
    }, 'khonoma-breadcrumb');
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