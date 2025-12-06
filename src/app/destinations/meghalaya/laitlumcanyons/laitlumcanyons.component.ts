import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-laitlumcanyons',
  standalone: true,
  imports: [],
  templateUrl: './laitlumcanyons.component.html',
  styleUrl: './laitlumcanyons.component.css'
})
export class LaitlumcanyonsComponent   implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,`r`n    @Inject(PLATFORM_ID) private platformId: Object`r`n  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/laitlum/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Laitlum Canyons Guide | Top Attractions & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Laitlum Canyons Guide | Top Attractions & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Laitlum Canyons Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/laitlum/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/laitlum-canyons-cover.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Laitlum Canyons Guide | Top Attractions & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Laitlum Canyons, Meghalaya – stunning views, trekking trails & serene landscapes. Explore attractions & travel tips with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/laitlum-canyons-cover.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the best time to visit Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit is from October to March, when the weather is cool and the skies are clear for panoramic views."
          }
        },
        {
          "@type": "Question",
          "name": "How difficult is the trek to the bottom of Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The trek to the bottom is moderately difficult. It involves descending steep slopes, but the stunning views along the way make it worth the effort."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Laitlum Canyons from Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Laitlum Canyons is located approximately 20 km from Shillong, which takes about 45 minutes by car."
          }
        },
        {
          "@type": "Question",
          "name": "Can I take a cab to Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can easily book a Wizzride reserved cab to Laitlum Canyons from Shillong or other nearby locations."
          }
        },
        {
          "@type": "Question",
          "name": "Are there any accommodation options near Laitlum Canyons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, there are several guesthouses, resorts, and homestays around Shillong that provide comfortable accommodation for visitors to Laitlum Canyons."
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
          "name": "Laitlum Canyons",
          "item": "https://wizzride.com/destinations/laitlum/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {`r`n    if (isPlatformBrowser(this.platformId)) {`r`n      const script = this.renderer.createElement('script');`r`n      script.type = 'application/ld+json';`r`n      script.text = JSON.stringify(schemaObject);`r`n      this.renderer.appendChild(this.document.head, script);`r`n    }`r`n  }

  ngAfterViewInit(): void {
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
