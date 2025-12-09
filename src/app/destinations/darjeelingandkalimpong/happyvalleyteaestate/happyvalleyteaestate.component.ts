import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-happyvalleyteaestate',
  standalone: true,
  imports: [],
  templateUrl: './happyvalleyteaestate.component.html',
  styleUrl: './happyvalleyteaestate.component.css'
})
export class HappyvalleyteaestateComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/happy-valley-tea-estate/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Happy Valley Tea Estate Darjeeling: Discover the Art of Tea-Making & Scenic Beauty");
    this.metaService.updateTag({
      name: 'description',
      content: "Step into the lush greenery of Happy Valley Tea Estate, one of Darjeeling’s oldest tea gardens. Explore the tea-making process, enjoy breathtaking views, and savor world-famous Darjeeling tea. Book your trip with Wizzride for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Happy Valley Tea Estate Darjeeling: Discover the Art of Tea-Making & Scenic Beauty"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Happy Valley Tea Estate Darjeeling: Discover the Art of Tea-Making & Scenic Beauty' });
    this.metaService.updateTag({ property: 'og:description', content: "Step into the lush greenery of Happy Valley Tea Estate, one of Darjeeling’s oldest tea gardens. Explore the tea-making process, enjoy breathtaking views, and savor world-famous Darjeeling tea. Book your trip with Wizzride for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/happy-valley-tea-estate/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Happy_Valley_Tea_Estate.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Happy Valley Tea Estate Darjeeling: Discover the Art of Tea-Making & Scenic Beauty' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Step into the lush greenery of Happy Valley Tea Estate, one of Darjeeling’s oldest tea gardens. Explore the tea-making process, enjoy breathtaking views, and savor world-famous Darjeeling tea. Book your trip with Wizzride for a seamless journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Happy_Valley_Tea_Estate.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the visiting hours of Happy Valley Tea Estate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy Valley Tea Estate is generally open to visitors from 8:00 AM to 4:00 PM, Monday to Saturday. It is closed on Sundays and during certain holidays."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an entry fee for the tea estate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, there is a small entry fee for visiting Happy Valley Tea Estate, which includes a guided tour of the tea factory and plantation."
            }
          },
          {
            "@type": "Question",
            "name": "Can I buy tea from Happy Valley Tea Estate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, visitors can purchase freshly processed Darjeeling tea directly from the Happy Valley Tea Estate’s outlet. It is one of the best places to buy authentic Darjeeling tea."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to visit the Happy Valley Tea Estate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A visit to Happy Valley Tea Estate usually takes around 1 to 2 hours, including a guided tour of the tea factory and a walk through the plantation."
            }
          },
          {
            "@type": "Question",
            "name": "How can I reach Happy Valley Tea Estate from Darjeeling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Happy Valley Tea Estate is located about 3 kilometers from Darjeeling town. You can reach it by taxi, shared cab, or a 20–30 minute uphill walk through scenic routes."
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
          "name": "Happy Valley Tea Estate",
          "item": "https://wizzride.com/destinations/happy-valley-tea-estate/"
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
