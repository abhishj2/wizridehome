import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';
@Component({
  selector: 'app-bhalukpong',
  standalone: true,
  imports: [],
  templateUrl: './bhalukpong.component.html',
  styleUrl: './bhalukpong.component.css'
})
export class BhalukpongComponent   implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/bhalukpong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bhalukpong Cab Booking | Wizzride Private Rides");
    this.metaService.updateTag({
      name: 'description',
      content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bhalukpong Cab Booking | Wizzride Private Rides"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bhalukpong Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ property: 'og:description', content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/bhalukpong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bhalukpong Cab Booking | Wizzride Private Rides' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book private cabs to Bhalukpong with Wizzride. Safe travel from Guwahati, Tezpur & Arunachal Pradesh. Explore wildlife sanctuaries, scenic landscapes & cultural gateways." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(        {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
              "@type": "Question",
              "name": "How far is Bhalukpong from Tezpur Airport?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bhalukpong is approximately 50 km from Tezpur Airport, around 1.5 hours by car with Wizzride."
              }
          },
          {
              "@type": "Question",
              "name": "Are Wizzride cabs available to Bhalukpong?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Wizzride offers reserved cabs from Tezpur, Guwahati, and nearby towns to Bhalukpong."
              }
          },
          {
              "@type": "Question",
              "name": "Is Bhalukpong suitable for adventure trips?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Bhalukpong is known for camping, river rafting, wildlife exploration, and trekking experiences."
              }
          },
          {
              "@type": "Question",
              "name": "Best time to visit Bhalukpong?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Winter, Spring, and Autumn offer the best weather for outdoor activities and sightseeing."
              }
          },
          {
              "@type": "Question",
              "name": "Are permits required to visit Bhalukpong?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, an Inner Line Permit (ILP) is required to enter Arunachal Pradesh, including Bhalukpong."
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
          "name": "Bhalukpong",
          "item": "https://wizzride.com/destinations/bhalukpong/"
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
