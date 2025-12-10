import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-nathulapass',
  standalone: true,
  imports: [],
  templateUrl: './nathulapass.component.html',
  styleUrl: './nathulapass.component.css'
})
export class NathulapassComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // IDs for tracking and cleaning up Schema scripts
  private readonly schemaIds = ['nathula-faq', 'nathula-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/nathula_pass/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Nathula Pass Cab Booking|Wizzride Shared and Reserved Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book safe and reliable cabs to Nathula Pass with Wizzride. Scenic travel from Gangtok to Sikkim’s iconic high-altitude pass."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Nathula Pass Cab Booking|Wizzride Shared and Reserved Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Nathula Pass Cab Booking|Wizzride Shared and Reserved Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book safe and reliable cabs to Nathula Pass with Wizzride. Scenic travel from Gangtok to Sikkim’s iconic high-altitude pass." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/nathula_pass/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/nathula-lake.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Nathula Pass Cab Booking|Wizzride Shared and Reserved Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book safe and reliable cabs to Nathula Pass with Wizzride. Scenic travel from Gangtok to Sikkim’s iconic high-altitude pass." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/nathula-lake.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD (Passed with Unique ID)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Nathula Pass from Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nathula Pass is located about 55 kilometers from Gangtok. The drive usually takes around 2 to 3 hours depending on road and weather conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Nathula Pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride and other private taxis can be booked from Gangtok to Nathula Pass. However, only authorized vehicles with permits are allowed on this route."
          }
        },
        {
          "@type": "Question",
          "name": "Is a permit required to visit Nathula Pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an entry permit is mandatory for all visitors to Nathula Pass. Indian nationals can obtain it through registered tour operators in Gangtok. Foreign nationals are not allowed to visit Nathula Pass due to its location near the Indo-China border."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Nathula Pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Nathula Pass is from May to October when the weather is clear and the roads are accessible. The pass remains closed on Mondays and Tuesdays and during heavy snowfall in winter."
          }
        },
        {
          "@type": "Question",
          "name": "Are there accommodations near Nathula Pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There are no hotels or guesthouses at Nathula Pass itself due to its high altitude and military presence. Tourists usually stay in Gangtok and make a day trip to Nathula Pass."
          }
        }
      ]
    }, 'nathula-faq');

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
          "name": "Nathula Pass",
          "item": "https://wizzride.com/destinations/nathula_pass/"
        }
      ]
    }, 'nathula-breadcrumb');
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