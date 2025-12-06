import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-zuluk',
  standalone: true,
  imports: [],
  templateUrl: './zuluk.component.html',
  styleUrl: './zuluk.component.css'
})
export class ZulukComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/zuluk/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Zuluk Cab Booking | Silk Route & Himalayan Views with Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a Wizzride Reserve Cab to Zuluk, East Sikkim. Explore the Silk Route, Thambi Viewpoint, Zuluk Loops, Gnathang Valley & Kupup Lake with safe travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Zuluk Cab Booking | Silk Route & Himalayan Views with Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Zuluk Cab Booking | Silk Route & Himalayan Views with Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a Wizzride Reserve Cab to Zuluk, East Sikkim. Explore the Silk Route, Thambi Viewpoint, Zuluk Loops, Gnathang Valley & Kupup Lake with safe travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/zuluk/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/zulukloops.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Zuluk Cab Booking | Silk Route & Himalayan Views with Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a Wizzride Reserve Cab to Zuluk, East Sikkim. Explore the Silk Route, Thambi Viewpoint, Zuluk Loops, Gnathang Valley & Kupup Lake with safe travel." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/zulukloops.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do I need a permit to visit Zuluk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Indian tourists require an Inner Line Permit (ILP) issued at Rongli check post. Foreigners are not allowed in this restricted area."
            }
          },
          {
            "@type": "Question",
            "name": "How far is Zuluk from Gangtok?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zuluk is approximately 90 km from Gangtok and takes about 4–5 hours by road."
            }
          },
          {
            "@type": "Question",
            "name": "Is Zuluk safe for solo travelers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Zuluk is safe for solo travelers. The locals are welcoming, and the village has a peaceful environment."
            }
          },
          {
            "@type": "Question",
            "name": "What is the ideal trip duration for Zuluk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A 2-day trip is perfect to explore Zuluk, Thambi Viewpoint, Gnathang Valley, and the Old Silk Route."
            }
          },
          {
            "@type": "Question",
            "name": "Can I see snow in Zuluk?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Zuluk receives heavy snowfall from December to February, making it a snow paradise during winters."
            }
          }
        ]
      });

 

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
          "name": "Zuluk",
          "item": "https://wizzride.com/destinations/zuluk/"
        }
      ]
    }
    );
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
