import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-tawang',
  standalone: true,
  imports: [],
  templateUrl: './tawang.component.html',
  styleUrl: './tawang.component.css'
})
export class TawangComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/tawang/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Tawang Cab Booking | Wizzride Rides to Monasteries & Lakes");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Wizzride cabs to Tawang and explore the Himalayas. Visit Tawang Monastery, Sela Pass, Madhuri Lake & Nuranang Falls with safe rides and local drivers."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Tawang Cab Booking | Wizzride Rides to Monasteries & Lakes"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Tawang Cab Booking | Wizzride Rides to Monasteries & Lakes' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Wizzride cabs to Tawang and explore the Himalayas. Visit Tawang Monastery, Sela Pass, Madhuri Lake & Nuranang Falls with safe rides and local drivers." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/tawang/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Tawang.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Tawang Cab Booking | Wizzride Rides to Monasteries & Lakes' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Wizzride cabs to Tawang and explore the Himalayas. Visit Tawang Monastery, Sela Pass, Madhuri Lake & Nuranang Falls with safe rides and local drivers." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Tawang.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(   {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Tawang from Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tawang is about 445 km from Guwahati, taking approximately 12–14 hours by road."
          }
        },
        {
          "@type": "Question",
          "name": "Is Tawang safe for tourists?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Tawang is safe for travelers. Visitors should, however, be prepared for high-altitude conditions and cold weather."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Tawang?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an Inner Line Permit (ILP) is required for Indian citizens to visit Tawang and other parts of Arunachal Pradesh."
          }
        },
        {
          "@type": "Question",
          "name": "What is Tawang famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tawang is famous for the Tawang Monastery, Sela Pass, Madhuri Lake, Nuranang Waterfalls, and the unique culture of the Monpa tribe."
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
          "name": "Tawang",
          "item": "https://wizzride.com/destinations/tawang/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObject);
      this.renderer.appendChild(this.document.head, script);
    }
  }

  ngAfterViewInit(): void {
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
