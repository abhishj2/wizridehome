import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-ravangla',
  standalone: true,
  imports: [],
  templateUrl: './ravangla.component.html',
  styleUrl: './ravangla.component.css'
})
export class RavanglaComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/ravangla/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Ravangla Sikkim Travel Guide | Reserved Cab & NIT Highlight");
    this.metaService.updateTag({
      name: 'description',
      content: "Visit Ravangla’s Buddha Park, monasteries & NIT campus. Book Wizzride Reserved Cab from Siliguri, Bagdogra & NJP for safe, private & comfortable travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Ravangla Sikkim Travel Guide | Reserved Cab & NIT Highlight"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Ravangla Sikkim Travel Guide | Reserved Cab & NIT Highlight' });
    this.metaService.updateTag({ property: 'og:description', content: "Visit Ravangla’s Buddha Park, monasteries & NIT campus. Book Wizzride Reserved Cab from Siliguri, Bagdogra & NJP for safe, private & comfortable travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/ravangla/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Ravangla Sikkim Travel Guide | Reserved Cab & NIT Highlight' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Visit Ravangla’s Buddha Park, monasteries & NIT campus. Book Wizzride Reserved Cab from Siliguri, Bagdogra & NJP for safe, private & comfortable travel." });
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
            "name": "How far is Ravangla from Siliguri?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ravangla is about 120 km from Siliguri and takes around 4.5 hours by Reserved Cab."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book a Reserved Cab to Ravangla with Wizzride?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride offers exclusive Reserved Cab services from Siliguri, Bagdogra, and NJP to Ravangla."
            }
          },
          {
            "@type": "Question",
            "name": "What is Ravangla famous for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ravangla is famous for Buddha Park, monasteries, scenic treks, and as the site of NIT Ravangla."
            }
          },
          {
            "@type": "Question",
            "name": "Is Ravangla good for family trips?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Ravangla is peaceful, family-friendly, and filled with natural and cultural attractions."
            }
          },
          {
            "@type": "Question",
            "name": "Why is NIT Ravangla important?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "NIT Ravangla is a national-level engineering institute that adds academic significance to this Himalayan town."
            }
          }
        ]
      }
      );

 

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
          "name": "Ravangla",
          "item": "https://wizzride.com/destinations/ravangla/"
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
