import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-umiamlake',
  standalone: true,
  imports: [],
  templateUrl: './umiamlake.component.html',
  styleUrl: './umiamlake.component.css'
})
export class UmiamlakeComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/umiam-lake/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Umiam Lake Meghalaya | Serene Escape for Boating & Adventure");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Umiam Lake, Meghalaya’s picturesque reservoir. Enjoy boating, water sports, trekking, and scenic views. Book your Wizzride trip for a seamless journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Umiam Lake Meghalaya | Serene Escape for Boating & Adventure"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Umiam Lake Meghalaya | Serene Escape for Boating & Adventure' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Umiam Lake, Meghalaya’s picturesque reservoir. Enjoy boating, water sports, trekking, and scenic views. Book your Wizzride trip for a seamless journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/umiam-lake/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Umiam Lake Meghalaya | Serene Escape for Boating & Adventure' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Umiam Lake, Meghalaya’s picturesque reservoir. Enjoy boating, water sports, trekking, and scenic views. Book your Wizzride trip for a seamless journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Umiam Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Umiam Lake is between October and April, when the weather is pleasant and ideal for sightseeing and water sports."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Umiam Lake from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Umiam Lake is located 15 km from Shillong, and the journey takes about 30 minutes via car."
          }
        },
        {
          "@type": "Question",
          "name": "Are there boating facilities available at Umiam Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can enjoy boating in both speedboats and rowboats at Umiam Lake."
          }
        },
        {
          "@type": "Question",
          "name": "Can I do water sports at Umiam Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, water sports such as kayaking, jet skiing, and speed boating are available for adventure enthusiasts."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Umiam Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can easily book a reserved cab to Umiam Lake through the Wizzride website or mobile app."
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
          "name": "Umiam Lake",
          "item": "https://wizzride.com/destinations/umiam-lake/"
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
