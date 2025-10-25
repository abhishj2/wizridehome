import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-dawki',
  standalone: true,
  imports: [],
  templateUrl: './dawki.component.html',
  styleUrl: './dawki.component.css'
})
export class DawkiComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/dawki/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Dawki Travel Guide | Attractions, Best Time & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Cherrapunji, Meghalaya – the land of Living Root Bridges, stunning waterfalls, and eternal rain. Discover the best places, travel tips, and Wizzride cab services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Dawki Travel Guide | Attractions, Best Time & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Dawki Travel Guide | Attractions, Best Time & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Cherrapunji, Meghalaya – the land of Living Root Bridges, stunning waterfalls, and eternal rain. Discover the best places, travel tips, and Wizzride cab services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/dawki/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Dawki Travel Guide | Attractions, Best Time & Travel Tips' });
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
          "name": "What is the best time to visit Dawki?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Dawki is between October and April, when the weather is pleasant, and the Umngot River is at its clearest."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Dawki from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dawki is approximately 82 km from Shillong, and the journey takes about 2.5 to 3 hours by road."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need a permit to visit Dawki?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No permit is required for Indian tourists. However, foreign nationals need an Inner Line Permit (ILP), which can be obtained online."
          }
        },
        {
          "@type": "Question",
          "name": "What adventure activities can I do in Dawki?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dawki offers a range of adventure activities, including boating, kayaking, snorkeling, scuba diving, zip-lining, and camping by the riverside."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab to Dawki?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking a Wizzride reserved cab is simple. Visit the Wizzride website or use the mobile app to book a shared or private cab for a seamless journey to Dawki."
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
          "name": "Dawki",
          "item": "https://wizzride.com/destinations/dawki/"
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
