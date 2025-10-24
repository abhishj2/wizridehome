import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-dzukouvalley',
  standalone: true,
  imports: [],
  templateUrl: './dzukouvalley.component.html',
  styleUrl: './dzukouvalley.component.css'
})
export class DzukouvalleyComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/dzukouvalley/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Dzukou Valley Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book safe and reliable private cabs to Dzukou Valley with Wizzride. Explore scenic trails and valleys from Dimapur, Kohima & Nagaland."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Dzukou Valley Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Dzukou Valley Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book safe and reliable private cabs to Dzukou Valley with Wizzride. Explore scenic trails and valleys from Dimapur, Kohima & Nagaland." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/dzukouvalley/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Dzukou Valley Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book safe and reliable private cabs to Dzukou Valley with Wizzride. Explore scenic trails and valleys from Dimapur, Kohima & Nagaland." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(       {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Dzukou Valley from Kohima?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The starting point for the Dzukou Valley trek is approximately 20 km from Kohima, around 45 minutes by Wizzride cab."
          }
        },
        {
          "@type": "Question",
          "name": "Are Wizzride cabs available to Dzukou Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers private cab services from Dimapur, Kohima, and surrounding areas to the Dzukou Valley trek starting points."
          }
        },
        {
          "@type": "Question",
          "name": "Is Dzukou Valley suitable for beginner trekkers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Dzukou Valley treks are moderate in difficulty and suitable for beginners with basic fitness levels."
          }
        },
        {
          "@type": "Question",
          "name": "Best time to visit Dzukou Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Dzukou Valley is from April to November, with July to September being ideal for witnessing the famous floral bloom."
          }
        },
        {
          "@type": "Question",
          "name": "Are permits required to visit Dzukou Valley?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, an Inner Line Permit (ILP) is required for visitors entering Nagaland, including the Dzukou Valley region."
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
          "item": "https://wizzride.com/destinations/dzukouvalley/"
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
