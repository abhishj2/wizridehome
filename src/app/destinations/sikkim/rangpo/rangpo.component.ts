import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-rangpo',
  standalone: true,
  imports: [],
  templateUrl: './rangpo.component.html',
  styleUrl: './rangpo.component.css'
})
export class RangpoComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/rangpo/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Rangpo Sikkim Travel Guide | Shared & Reserved Cabs Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Plan your Rangpo trip, the Gateway to Sikkim. Book Wizzride Shared or Reserved Cab from Siliguri, NJP & Bagdogra. Explore bazaar, tea gardens & river views."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Rangpo Sikkim Travel Guide | Shared & Reserved Cabs Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Rangpo Sikkim Travel Guide | Shared & Reserved Cabs Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Plan your Rangpo trip, the Gateway to Sikkim. Book Wizzride Shared or Reserved Cab from Siliguri, NJP & Bagdogra. Explore bazaar, tea gardens & river views." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/rangpo/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/rangpo.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Rangpo Sikkim Travel Guide | Shared & Reserved Cabs Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Plan your Rangpo trip, the Gateway to Sikkim. Book Wizzride Shared or Reserved Cab from Siliguri, NJP & Bagdogra. Explore bazaar, tea gardens & river views." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/rangpo.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How far is Rangpo from Siliguri?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rangpo is about 70 km from Siliguri and takes around 2.5 hours by cab."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book a Shared Cab to Rangpo with Wizzride?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride offers both Shared and Reserved cabs from Siliguri, Bagdogra, and NJP to Rangpo."
            }
          },
          {
            "@type": "Question",
            "name": "Is Rangpo worth staying overnight?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, many travelers stay in Rangpo as a peaceful stopover before exploring Gangtok or East Sikkim."
            }
          },
          {
            "@type": "Question",
            "name": "What is Rangpo famous for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rangpo is known as the Gateway to Sikkim, its riverside views, tea gardens, and bustling bazaar."
            }
          },
          {
            "@type": "Question",
            "name": "What documents are required to enter Sikkim via Rangpo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indian tourists need valid ID proof, while foreign nationals require a Restricted Area Permit."
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
          "name": "Rangpo",
          "item": "https://wizzride.com/destinations/rangpo/"
        }
      ]
    }
    );
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
