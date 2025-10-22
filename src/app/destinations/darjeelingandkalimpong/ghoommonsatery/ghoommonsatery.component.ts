import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-ghoommonsatery',
  standalone: true,
  imports: [],
  templateUrl: './ghoommonsatery.component.html',
  styleUrl: './ghoommonsatery.component.css'
})
export class GhoommonsateryComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/ghoom-monastery/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Ghoom Monastery Darjeeling: A Historic Buddhist Retreat");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Ghoom Monastery, one of the oldest Tibetan Buddhist monasteries in Darjeeling. Book your Wizzride trip today for a seamless and comfortable journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Ghoom Monastery Darjeeling: A Historic Buddhist Retreat"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Ghoom Monastery Darjeeling: A Historic Buddhist Retreat' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Ghoom Monastery, one of the oldest Tibetan Buddhist monasteries in Darjeeling. Book your Wizzride trip today for a seamless and comfortable journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/ghoom-monastery/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Ghoom Monastery Darjeeling: A Historic Buddhist Retreat' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Ghoom Monastery, one of the oldest Tibetan Buddhist monasteries in Darjeeling. Book your Wizzride trip today for a seamless and comfortable journey." });
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
            "name": "What are the visiting hours of Ghoom Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ghoom Monastery is generally open from 9:00 AM to 6:00 PM daily. However, timings may vary slightly on special occasions or festival days."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an entry fee for Ghoom Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, there is no entry fee for Ghoom Monastery. Visitors are welcome to make voluntary donations to support the upkeep of the monastery."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to explore the monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Exploring Ghoom Monastery usually takes around 30 minutes to 1 hour, depending on how much time you spend admiring the Buddha statue, murals, and surroundings."
            }
          },
          {
            "@type": "Question",
            "name": "Can I take photographs inside the monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, photography is generally allowed inside Ghoom Monastery, but it is advisable to be respectful and avoid using flash. Some areas may have restrictions, so check with the monks before taking pictures."
            }
          },
          {
            "@type": "Question",
            "name": "How early should I book a Wizzride Reserved Cab to Ghoom Monastery?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It is recommended to book your Wizzride Reserved Cab at least a few hours in advance or the day before, especially during the peak tourist season, to ensure availability and a convenient pickup time."
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
          "item": "https://wizzride.com/destinations/ghoom-monastery/"
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
