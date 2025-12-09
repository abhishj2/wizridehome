import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-kamakhyatemple',
  standalone: true,
  imports: [],
  templateUrl: './kamakhyatemple.component.html',
  styleUrl: './kamakhyatemple.component.css'
})
export class KamakhyatempleComponent  implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/kamakhya/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Kamakhya Temple Guide | History, Festivals & Travel Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Kamakhya Temple, a sacred Shakti Peetha in Guwahati. Learn about its history, festivals, and how to visit with Wizzride cab services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Kamakhya Temple Guide | History, Festivals & Travel Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Kamakhya Temple Guide | History, Festivals & Travel Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Kamakhya Temple, a sacred Shakti Peetha in Guwahati. Learn about its history, festivals, and how to visit with Wizzride cab services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/kamakhya/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Kamakhya.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Kamakhya Temple Guide | History, Festivals & Travel Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Kamakhya Temple, a sacred Shakti Peetha in Guwahati. Learn about its history, festivals, and how to visit with Wizzride cab services." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Kamakhya.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(      {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the significance of Kamakhya Temple?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kamakhya Temple in Guwahati is one of the most important Shakti Peethas in India, dedicated to Goddess Kamakhya. It is a major pilgrimage site, especially known for the Ambubachi Mela, symbolizing fertility and womanhood."
          }
        },
        {
          "@type": "Question",
          "name": "How long does darshan take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The darshan time at Kamakhya Temple can vary depending on the crowd. On normal days, it may take 1 to 2 hours, while during festivals like Ambubachi Mela, it can take several hours."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a dress code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "There is no strict dress code, but visitors are advised to wear modest and traditional attire while visiting Kamakhya Temple as a mark of respect for the religious site."
          }
        },
        {
          "@type": "Question",
          "name": "How can I reach Kamakhya Temple conveniently?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kamakhya Temple is located on Nilachal Hill, about 7 km from Guwahati Railway Station. Visitors can reach conveniently by taxi, auto-rickshaw, or app-based cab services. Local buses also connect to the base of the hill."
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
          "name": "Kamakhya",
          "item": "https://wizzride.com/destinations/kamakhya/"
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
