import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-shillong',
  standalone: true,
  imports: [],
  templateUrl: './shillong.component.html',
  styleUrl: './shillong.component.css'
})
export class ShillongComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/shillong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Shillong Travel Guide | Attractions, Culture & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Visit Shillong, Meghalaya - the Scotland of the East. Explore its scenic landscapes, vibrant culture, waterfalls, and adventure activities with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Shillong Travel Guide | Attractions, Culture & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Shillong Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Visit Shillong, Meghalaya - the Scotland of the East. Explore its scenic landscapes, vibrant culture, waterfalls, and adventure activities with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/shillong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/LumdiengjriPeak.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Shillong Travel Guide | Attractions, Culture & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Visit Shillong, Meghalaya - the Scotland of the East. Explore its scenic landscapes, vibrant culture, waterfalls, and adventure activities with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/LumdiengjriPeak.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Shillong is from September to May when the weather is pleasant. The monsoon season (June to August) brings heavy rainfall but makes the waterfalls and landscapes lush and scenic."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Shillong from Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Shillong is approximately 100 km from Guwahati and takes around 3 hours by road, depending on traffic and weather conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Are permits required for Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No special permits are required for Indian tourists to visit Shillong. However, foreign tourists need to register with the Meghalaya tourism office or local authorities upon arrival."
          }
        },
        {
          "@type": "Question",
          "name": "What are the must-visit waterfalls in Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Some of the must-visit waterfalls in Shillong are Elephant Falls, Bishop and Beadon Falls, Sweet Falls, and Spread Eagle Falls."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can book a Wizzride cab to Shillong online through the Wizzride website or mobile app. Both shared and reserved cab options are available from Guwahati and other nearby locations."
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
          "name": "Shillong",
          "item": "https://wizzride.com/destinations/shillong/"
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
