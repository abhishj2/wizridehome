import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-savasagar',
  standalone: true,
  imports: [],
  templateUrl: './savasagar.component.html',
  styleUrl: './savasagar.component.css'
})
export class SavasagarComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/sivasagar');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Sivasagar Cab Booking | Explore Assam’s Royal Heritage");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Wizzride cabs to Sivasagar and explore Assam’s royal heritage. Visit Rang Ghar, Talatal Ghar, Sivadol Temple & more with safe rides and local drivers."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Sivasagar Cab Booking | Explore Assam’s Royal Heritage"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Sivasagar Cab Booking | Explore Assam’s Royal Heritage' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/sivasagar/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Sivasagar Cab Booking | Explore Assam’s Royal Heritage' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Majuli Island, Assam – the world’s largest river island with monasteries, biodiversity & serene landscapes. Plan your trip with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(            {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How far is Sivasagar from Jorhat?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sivasagar is about 55 km from Jorhat, roughly a 1.5-hour drive."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe to travel to Sivasagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Sivasagar is safe for travelers, with welcoming locals and secure routes."
          }
        },
        {
          "@type": "Question",
          "name": "What is Sivasagar famous for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sivasagar is famous for its Ahom-era monuments, temples, and large water tanks like Borpukhuri and Joysagar."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time to visit Sivasagar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Winter (November–February) and Spring (March–April) are the best times to visit Sivasagar for heritage tours and cultural exploration."
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
          "item": "https://wizzride.com/destinations/sivasagar/"
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
