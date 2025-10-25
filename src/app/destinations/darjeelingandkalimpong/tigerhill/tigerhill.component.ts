import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-tigerhill',
  standalone: true,
  imports: [],
  templateUrl: './tigerhill.component.html',
  styleUrl: './tigerhill.component.css'
})
export class TigerhillComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/tigerhill/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Tiger Hill Darjeeling: Best Sunrise View Over Kanchenjunga");
    this.metaService.updateTag({
      name: 'description',
      content: "Witness the breathtaking sunrise over Mount Kanchenjunga at Tiger Hill, Darjeeling’s iconic attraction. Book your trip with Wizzride for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Tiger Hill Darjeeling: Best Sunrise View Over Kanchenjunga"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Tiger Hill Darjeeling: Best Sunrise View Over Kanchenjunga' });
    this.metaService.updateTag({ property: 'og:description', content: "Witness the breathtaking sunrise over Mount Kanchenjunga at Tiger Hill, Darjeeling’s iconic attraction. Book your trip with Wizzride for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/tigerhill/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Tiger Hill Darjeeling: Best Sunrise View Over Kanchenjunga' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Witness the breathtaking sunrise over Mount Kanchenjunga at Tiger Hill, Darjeeling’s iconic attraction. Book your trip with Wizzride for a seamless journey." });
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
            "name": "What time should I leave for Tiger Hill from Darjeeling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To catch the sunrise at Tiger Hill, it is recommended to leave Darjeeling town between 3:30 AM and 4:00 AM, depending on the season. Sunrise timings vary, so starting early ensures a good viewing spot."
            }
          },
          {
            "@type": "Question",
            "name": "Can I visit Tiger Hill during the day?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Tiger Hill can be visited during the day. While sunrise is the most popular time, the viewpoint also offers stunning panoramic views of the Himalayas during daylight hours."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an entry fee for Tiger Hill?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, there is a nominal entry fee to access Tiger Hill’s viewing area. Charges may vary depending on whether you choose general entry or the upgraded observatory lounge."
            }
          },
          {
            "@type": "Question",
            "name": "How cold does it get at Tiger Hill?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tiger Hill is located at an altitude of about 2,590 meters (8,500 feet). Early mornings, especially in winter, can get very cold with temperatures often dropping close to freezing. Warm clothing is highly recommended."
            }
          },
          {
            "@type": "Question",
            "name": "How early should I book a Wizzride Reserved Cab?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It is advisable to book your Wizzride Reserved Cab at least a day in advance, especially during peak tourist season, to ensure availability and timely pickup for the sunrise trip to Tiger Hill."
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
          "name": "Tiger Hill",
          "item": "https://wizzride.com/destinations/tigerhill/"
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
