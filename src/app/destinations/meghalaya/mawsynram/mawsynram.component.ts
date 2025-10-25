import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-mawsynram',
  standalone: true,
  imports: [],
  templateUrl: './mawsynram.component.html',
  styleUrl: './mawsynram.component.css'
})
export class MawsynramComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/mawsynram/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Mawsynram Travel Guide | Attractions,Best Time & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Mawsynram, the wettest place on Earth.Discover top attractions, adventure activities, and Wizzride cab services for a comfortable journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Mawsynram Travel Guide | Attractions,Best Time & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Mawsynram Travel Guide | Attractions,Best Time & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Mawsynram, the wettest place on Earth.Discover top attractions, adventure activities, and Wizzride cab services for a comfortable journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/mawsynram/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Mawsynram Travel Guide | Attractions,Best Time & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Mawsynram, the wettest place on Earth.Discover top attractions, adventure activities, and Wizzride cab services for a comfortable journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Mawsynram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Mawsynram is October to April, when the weather is cool and dry. The monsoon (June–September) is great for witnessing heavy rainfall and lush greenery."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Mawsynram from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mawsynram is about 61 km from Shillong, and the journey takes around 2.5 to 3 hours by road. Wizzride shared cabs provide an easy way to reach Mawsynram."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need permits to visit Mawsynram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No permits are required for Indian tourists. However, foreign nationals need an Inner Line Permit (ILP), which can be obtained online."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best waterfalls to visit in Mawsynram?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some of the most stunning waterfalls include Khreng Khreng Falls, Byrdaw Falls, and Phan Nonglait Falls."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Mawsynram?",
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
          "name": "Mawsynram",
          "item": "https://wizzride.com/destinations/mawsynram/"
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
