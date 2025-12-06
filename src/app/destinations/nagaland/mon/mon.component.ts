import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-mon',
  standalone: true,
  imports: [],
  templateUrl: './mon.component.html',
  styleUrl: './mon.component.css'
})
export class MonComponent implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,`r`n    @Inject(PLATFORM_ID) private platformId: Object`r`n  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/mon/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Mon Village Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Mon Village Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Mon Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/mon/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/monbanner.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Mon Village Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reserved cabs to Mon Village with Wizzride. Safe travel from Dimapur, Mokokchung & Nagaland. Explore Konyak heritage, tattooed tribes & scenic hills." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/monbanner.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Mon from Dimapur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mon is approximately 280 km from Dimapur, taking around 9–10 hours by cab, depending on road conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe to travel to Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Mon is safe for tourists. Wizzride ensures experienced drivers and local support throughout your journey."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to visit Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "March and April are ideal, especially to attend the Aoling Festival of the Konyaks. Winters are also scenic and calm."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need any permits to visit Mon?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an Inner Line Permit (ILP) is required to enter Nagaland, including Mon. You can apply online or through designated government offices."
          }
        }
      ]
    }
    );

 

    // ✅ TouristDestination JSON-LD (specific to Gangtok)
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
          "name": "Mon",
          "item": "https://wizzride.com/destinations/mon/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {`r`n    if (isPlatformBrowser(this.platformId)) {`r`n      const script = this.renderer.createElement('script');`r`n      script.type = 'application/ld+json';`r`n      script.text = JSON.stringify(schemaObject);`r`n      this.renderer.appendChild(this.document.head, script);`r`n    }`r`n  }

  ngAfterViewInit(): void {
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
