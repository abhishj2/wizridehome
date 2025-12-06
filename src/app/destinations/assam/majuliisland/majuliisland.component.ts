import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-majuliisland',
  standalone: true,
  imports: [],
  templateUrl: './majuliisland.component.html',
  styleUrl: './majuliisland.component.css'
})
export class MajuliislandComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/majuli-island');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Majuli Island Travel Guide | Attractions & Culture of Assam");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Majuli Island Travel Guide | Attractions & Culture of Assam"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Majuli Island Travel Guide | Attractions & Culture of Assam' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/majuli-island/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/majuliboa.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Majuli Island Travel Guide | Attractions & Culture of Assam' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/majuliboa.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(      {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Majuli famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Majuli, the world’s largest river island, is famous for its vibrant Vaishnavite monasteries (Satras), rich cultural heritage, tribal traditions, and scenic beauty along the Brahmaputra River."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Majuli from Jorhat?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It takes about 1 to 1.5 hours to reach Majuli from Jorhat, including a road trip to the ferry ghat and a ferry ride across the Brahmaputra River."
          }
        },
        {
          "@type": "Question",
          "name": "Is there an entry fee for visiting Majuli?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, there is no entry fee for visiting Majuli. However, some Satras and cultural centers may accept voluntary donations from visitors."
          }
        },
        {
          "@type": "Question",
          "name": "Can I visit Majuli in a day?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Majuli can be visited in a day trip from Jorhat. However, staying overnight is recommended to fully experience its Satras, local culture, and traditional lifestyle."
          }
        },
        {
          "@type": "Question",
          "name": "Is Majuli safe for tourists?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Majuli is safe for tourists. The local people are very welcoming, and the island is peaceful. Visitors should, however, plan their ferry rides carefully as services depend on weather conditions."
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
          "name": "Majuli Island",
          "item": "https://wizzride.com/destinations/majuli-island/"
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
