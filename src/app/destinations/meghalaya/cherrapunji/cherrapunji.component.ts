import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-cherrapunji',
  standalone: true,
  imports: [],
  templateUrl: './cherrapunji.component.html',
  styleUrl: './cherrapunji.component.css'
})
export class CherrapunjiComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/cherrapunji/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Cherrapunji Travel Guide | Top Attractions & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Cherrapunji, Meghalaya – the land of Living Root Bridges, stunning waterfalls, and eternal rain. Discover the best places, travel tips, and Wizzride cab services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Cherrapunji Travel Guide | Top Attractions & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Cherrapunji Travel Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Cherrapunji, Meghalaya – the land of Living Root Bridges, stunning waterfalls, and eternal rain. Discover the best places, travel tips, and Wizzride cab services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/cherrapunji/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Cherrapunji Travel Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Cherrapunji, Meghalaya – the land of Living Root Bridges, stunning waterfalls, and eternal rain. Discover the best places, travel tips, and Wizzride cab services." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Cherrapunji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cherrapunji can be visited year-round, but the best time is October to April, when the weather is cool and pleasant. The monsoon (June–September) is ideal for witnessing the waterfalls in full glory."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Cherrapunji from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cherrapunji is about 55 km from Shillong, and the journey takes around 2 hours by road. Wizzride shared cabs provide a convenient way to travel."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Cherrapunji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No special permits are required for Indian tourists to visit Cherrapunji. Foreign tourists, however, need to register with the Meghalaya tourism office or local authorities upon arrival."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best waterfalls to visit in Cherrapunji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some of the most stunning waterfalls include Nohkalikai Falls, Seven Sisters Falls, Dainthlen Falls, and Wei Sawdong Falls."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Cherrapunji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking is easy! Visit the Wizzride website or use the mobile app to book a shared or private cab for your journey."
          }
        }
      ]
    });

 

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
          "name": "Cherrapunji",
          "item": "https://wizzride.com/destinations/cherrapunji/"
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
