import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-kurseong',
  standalone: true,
  imports: [],
  templateUrl: './kurseong.component.html',
  styleUrl: './kurseong.component.css'
})
export class KurseongComponent implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/kurseong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Kurseong Travel Guide | Shared & Reserved Cabs with Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Kurseong’s tea gardens, orchids & heritage sites. Book Wizzride Shared or Reserved Cab from Siliguri, Bagdogra & NJP for safe, easy travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Kurseong Travel Guide | Shared & Reserved Cabs with Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Kurseong Travel Guide | Shared & Reserved Cabs with Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Kurseong’s tea gardens, orchids & heritage sites. Book Wizzride Shared or Reserved Cab from Siliguri, Bagdogra & NJP for safe, easy travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/kurseong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Kurseong Travel Guide | Shared & Reserved Cabs with Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Kurseong’s tea gardens, orchids & heritage sites. Book Wizzride Shared or Reserved Cab from Siliguri, Bagdogra & NJP for safe, easy travel." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Do I need a permit to visit Kurseong?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, permits are not required for Indian or foreign tourists to visit Kurseong."
            }
          },
          {
            "@type": "Question",
            "name": "How far is Kurseong from Siliguri?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kurseong is about 32 km (1.5 hours) from Siliguri."
            }
          },
          {
            "@type": "Question",
            "name": "Is Kurseong good for family trips?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Kurseong is a safe and peaceful destination suitable for family vacations."
            }
          },
          {
            "@type": "Question",
            "name": "What is Kurseong famous for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kurseong is famous for its tea estates, orchids, colonial schools, and heritage charm."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book a Shared Cab to Kurseong?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride offers both Shared and Reserved Cabs from Siliguri, NJP, and Bagdogra to Kurseong."
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
          "name": "Gangtok",
          "item": "https://wizzride.com/destinations/kurseong/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
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
