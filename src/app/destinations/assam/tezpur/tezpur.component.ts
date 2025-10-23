import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-tezpur',
  standalone: true,
  imports: [],
  templateUrl: './tezpur.component.html',
  styleUrl: './tezpur.component.css'
})
export class TezpurComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/tezpur/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Tezpur Travel Guide | Assam’s Cultural & Historical Hub");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Tezpur, Assam — known for historical monuments, myths, and scenic beauty. Book a Wizzride reserved cab for a seamless, comfortable journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Tezpur Travel Guide | Assam’s Cultural & Historical Hub"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Tezpur Travel Guide | Assam’s Cultural & Historical Hub' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/tezpur/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Tezpur Travel Guide | Assam’s Cultural & Historical Hub' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(             {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the historical significance of Tezpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tezpur, known as the 'Cultural Capital of Assam,' is historically significant for its ancient temples, mythological connections with the Mahabharata, and archaeological sites showcasing Assamese art and heritage."
          }
        },
        {
          "@type": "Question",
          "name": "How long should I stay in Tezpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A stay of 2 to 3 days is ideal to explore Tezpur, covering attractions such as Agnigarh Hill, Mahabhairav Temple, Bamuni Hills, Da-Parbatia ruins, and nearby wildlife sanctuaries."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a dress code for visiting temples?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There is no strict dress code for temples in Tezpur, but visitors are advised to wear modest and traditional clothing to show respect for the local culture and religious practices."
          }
        },
        {
          "@type": "Question",
          "name": "How can I reach Tezpur easily?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Tezpur can be reached easily by road from Guwahati (about 180 km). Regular buses and taxis are available. The nearest railway station is Rangapara North, and Tezpur also has a small airport with limited flights."
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
          "item": "https://wizzride.com/destinations/tezpur/"
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
