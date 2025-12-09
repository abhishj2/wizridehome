import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-himalayanzoologicalpark',
  standalone: true,
  imports: [],
  templateUrl: './himalayanzoologicalpark.component.html',
  styleUrl: './himalayanzoologicalpark.component.css'
})
export class HimalayanzoologicalparkComponent  implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/himalayan-zoological-park/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Himalayan Zoological Park Darjeeling | Wildlife & Scenic Beauty");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Himalayan Zoological Park, Darjeeling. See rare animals like Red Panda & Snow Leopard amidst lush forests. Book your wildlife trip with Wizzride today!"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Himalayan Zoological Park Darjeeling | Wildlife & Scenic Beauty"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Himalayan Zoological Park Darjeeling | Wildlife & Scenic Beauty' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Himalayan Zoological Park, Darjeeling. See rare animals like Red Panda & Snow Leopard amidst lush forests. Book your wildlife trip with Wizzride today!" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/himalayan-zoological-park/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Himalayan_Zoological_Park.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Himalayan Zoological Park Darjeeling | Wildlife & Scenic Beauty' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Himalayan Zoological Park, Darjeeling. See rare animals like Red Panda & Snow Leopard amidst lush forests. Book your wildlife trip with Wizzride today!" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Himalayan_Zoological_Park.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are the visiting hours of Himalayan Zoological Park?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Himalayan Zoological Park in Darjeeling is generally open from 8:30 AM to 4:00 PM in winter and until 5:00 PM in summer. It remains closed on Thursdays."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an entry fee for the zoo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, there is a nominal entry fee for the Himalayan Zoological Park. The fee helps maintain the zoo and its conservation programs."
            }
          },
          {
            "@type": "Question",
            "name": "Can I spot rare animals in the zoo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the zoo is home to several rare and endangered Himalayan species such as the Red Panda, Snow Leopard, Tibetan Wolf, and Himalayan Black Bear."
            }
          },
          {
            "@type": "Question",
            "name": "How long should I spend at the zoo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Visitors usually spend around 1.5 to 2 hours exploring the Himalayan Zoological Park, depending on interest in wildlife and photography."
            }
          },
          {
            "@type": "Question",
            "name": "How can I reach the zoo from Darjeeling town?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Himalayan Zoological Park is located about 3 kilometers from Darjeeling town. You can reach it by taxi, shared cab, or even by walking if you prefer a short uphill hike."
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
          "name": "Himalayan Zoological Park",
          "item": "https://wizzride.com/destinations/himalayan-zoological-park/"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObject);
      this.renderer.appendChild(this.document.head, script);
    }
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
