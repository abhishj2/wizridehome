import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-tsomgolake',
  standalone: true,
  imports: [],
  templateUrl: './tsomgolake.component.html',
  styleUrl: './tsomgolake.component.css'
})
export class TsomgolakeComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/tsomgo_lake/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Tsomgo Lake Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book safe, reliable cabs to Tsomgo Lake with Wizzride. Travel from Gangtok and nearby areas to this stunning glacial lake in Sikkim with comfort and ease."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Tsomgo Lake Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Tsomgo Lake Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book safe, reliable cabs to Tsomgo Lake with Wizzride. Travel from Gangtok and nearby areas to this stunning glacial lake in Sikkim with comfort and ease." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/tsomgo_lake/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Tsomgo Lake Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book safe, reliable cabs to Tsomgo Lake with Wizzride. Travel from Gangtok and nearby areas to this stunning glacial lake in Sikkim with comfort and ease." });
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
            "name": "How far is Tsomgo Lake from Gangtok?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tsomgo Lake is approximately 40 km from Gangtok, taking around 1.5 to 2 hours by car depending on road and weather conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Are Wizzride cabs available to Tsomgo Lake?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Wizzride offers reserved and shared cab services from Gangtok to Tsomgo Lake. Pre-booking is recommended, especially during peak seasons."
            }
          },
          {
            "@type": "Question",
            "name": "Is a permit required to visit Tsomgo Lake?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Indian citizens require an Inner Line Permit (ILP) to visit Tsomgo Lake. Foreign nationals are not permitted to visit Tsomgo Lake due to its proximity to the China border."
            }
          },
          {
            "@type": "Question",
            "name": "Best time to visit Tsomgo Lake?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The best time to visit is from April to June for pleasant weather and from January to March for snow. Avoid monsoons due to landslide risks."
            }
          },
          {
            "@type": "Question",
            "name": "Are there accommodations near Tsomgo Lake?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There are no stays directly at Tsomgo Lake, but Gangtok (40 km away) offers a wide range of accommodations including hotels and homestays."
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
          "item": "https://wizzride.com/destinations/tsomgo_lake/"
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
