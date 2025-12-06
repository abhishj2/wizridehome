import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-shillongtotezpur',
  standalone: true,
  imports: [],
  templateUrl: './shillongtotezpur.component.html',
  styleUrl: './shillongtotezpur.component.css'
})
export class ShillongtotezpurComponent   implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private commonAirportService: CommonAirportService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride Taxi Service – Shillong to Tezpur & Vice Versa");
    this.metaService.updateTag({
      name: 'description',
      content: "Book reliable Shillong to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride Taxi Service – Shillong to Tezpur & Vice Versa"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride Taxi Service – Shillong to Tezpur & Vice Versa' });
    this.metaService.updateTag({ property: 'og:description', content: "Book reliable Shillong to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service/'});
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/tezpur.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride Taxi Service – Shillong to Tezpur & Vice Versa' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book reliable Shillong to Tezpur taxi service with Wizzride. Comfortable rides, affordable fares, and easy online booking. Available for one-way and round trips." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/tezpur.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the distance between Shillong and Tezpur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The road distance is approximately 300 km and takes around 7–8 hours by cab."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide one-way taxi service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers both one-way and round-trip taxi services."
          }
        },
        {
          "@type": "Question",
          "name": "What types of cars are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer sedans, SUVs, and traveller vans to suit different travel needs."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a cab at night?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, night bookings are available but may include an additional night charge."
          }
        },
        {
          "@type": "Question",
          "name": "Are there any sightseeing options on the way?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can plan a detour to places like Umiam Lake or Kaziranga National Park."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
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
      "name": "Our Services",
      "item": "https://wizzride.com/ourservices"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Luxury Reserved Cabs",
      "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Shillong Airport to Tezpur Reserved Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Shillong_To_Tezpur_Reserved_Cab_Service/"
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
    this.commonAirportService.initializeAirportPage();
  }

  ngOnDestroy(): void {
    this.commonAirportService.cleanup();
  }
}
