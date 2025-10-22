import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-rumtekmonastery',
  standalone: true,
  imports: [],
  templateUrl: './rumtekmonastery.component.html',
  styleUrl: './rumtekmonastery.component.css'
})
export class RumtekmonasteryComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/rumtek_monastery/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Rumtek Monastery Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book safe private cabs to Rumtek Monastery with Wizzride. Travel from Gangtok, Bagdogra & Siliguri. Discover Sikkim’s famous monastery, culture & views."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Rumtek Monastery Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Rumtek Monastery Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book safe private cabs to Rumtek Monastery with Wizzride. Travel from Gangtok, Bagdogra & Siliguri. Discover Sikkim’s famous monastery, culture & views." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/rumtek_monastery/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Rumtek Monastery Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book safe private cabs to Rumtek Monastery with Wizzride. Travel from Gangtok, Bagdogra & Siliguri. Discover Sikkim’s famous monastery, culture & views." });
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
            "name": "How far is Rumtek Monastery from Gangtok?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rumtek Monastery is about 23 km from Gangtok and takes approximately 45 minutes to 1 hour by car."
            }
          },
          {
            "@type": "Question",
            "name": "Are Wizzride cabs available to Rumtek Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride offers reserved cab services from Gangtok, Bagdogra, and Siliguri to Rumtek Monastery. Pre-booking is recommended."
            }
          },
          {
            "@type": "Question",
            "name": "What is Rumtek Monastery famous for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rumtek Monastery is the largest monastery in Sikkim and the seat of the Karmapa of the Kagyu sect. It's known for its Tibetan Buddhist architecture, spiritual importance, and scenic surroundings."
            }
          },
          {
            "@type": "Question",
            "name": "Best time to visit Rumtek Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The best time to visit Rumtek is from March to June and October to December when the weather is pleasant and skies are clear."
            }
          },
          {
            "@type": "Question",
            "name": "Are there entry fees or permits for Rumtek Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There is a small entry fee to enter Rumtek Monastery. No special permits are required for Indian or foreign tourists."
            }
          }
        ]
      });

 

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
          "name": "Lachung",
          "item": "https://wizzride.com/destinations/rumtek_monastery/"
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
