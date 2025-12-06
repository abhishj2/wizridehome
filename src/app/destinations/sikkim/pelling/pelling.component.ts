import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-pelling',
  standalone: true,
  imports: [],
  templateUrl: './pelling.component.html',
  styleUrl: './pelling.component.css'
})
export class PellingComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/pelling/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("The Jewel of West Sikkim");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Pelling, a scenic hill station in Sikkim with breathtaking views of Kanchenjunga. Explore top attractions and travel tips with Wizzride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "The Jewel of West Sikkim"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'The Jewel of West Sikkim' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Pelling, a scenic hill station in Sikkim with breathtaking views of Kanchenjunga. Explore top attractions and travel tips with Wizzride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/pelling/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/pelling-cover.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'The Jewel of West Sikkim' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Pelling, a scenic hill station in Sikkim with breathtaking views of Kanchenjunga. Explore top attractions and travel tips with Wizzride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/pelling-cover.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(  
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the altitude of Pelling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pelling is located at an altitude of around 2,150 meters (7,200 feet) above sea level, offering panoramic views of the Himalayas including Mount Kanchenjunga."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a permit to visit Pelling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No special permit is required for Indian tourists to visit Pelling. However, foreign nationals need a Restricted Area Permit (RAP) to enter Sikkim, which can be obtained online or at designated checkpoints."
            }
          },
          {
            "@type": "Question",
            "name": "Are there ATMs in Pelling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Pelling has a few ATMs, but availability can be limited and cash shortages may occur. It is recommended to carry sufficient cash before traveling."
            }
          },
          {
            "@type": "Question",
            "name": "What souvenirs can I buy in Pelling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Pelling, you can buy traditional handicrafts, woolen items, Tibetan carpets, Thangka paintings, prayer flags, and locally made organic products like tea and spices as souvenirs."
            }
          },
          {
            "@type": "Question",
            "name": "Is Pelling good for family vacations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Pelling is a family-friendly destination with monasteries, waterfalls, scenic viewpoints, and safe accommodations. It is suitable for travelers of all age groups."
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
          "name": "Pelling",
          "item": "https://wizzride.com/destinations/pelling/"
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
