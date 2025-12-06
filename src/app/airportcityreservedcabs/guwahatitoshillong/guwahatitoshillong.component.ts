import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-guwahatitoshillong',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitoshillong.component.html',
  styleUrl: './guwahatitoshillong.component.css'
})
export class GuwahatitoshillongComponent   implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Reserve a Cab from Guwahati Airport to Shillong | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Reserve a Cab from Guwahati.Book a reserved cab from Guwahati Airport to Shillong with Wizzride. Choose from Innova, SUVs, or sedans for a comfortable and affordable ride.ahati Airport to Shillong | Wizzride"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Reserve a Cab from Guwahati Airport to Shillong | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Reserve a Cab from Guwahati Airport to Shillong | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Reserve a Cab from Guwahati.Book a reserved cab from Guwahati Airport to Shillong with Wizzride. Choose from Innova, SUVs, or sedans for a comfortable and affordable ride.ahati Airport to Shillong | Wizzride" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service'});
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/sgil.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Reserve a Cab from Guwahati Airport to Shillong | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Reserve a Cab from Guwahati.Book a reserved cab from Guwahati Airport to Shillong with Wizzride. Choose from Innova, SUVs, or sedans for a comfortable and affordable ride.ahati Airport to Shillong | Wizzride" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/sgil.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is there a bus from Guwahati Airport to Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, Guwahati Airport does not have direct bus services to Shillong. You can catch a bus from the Guwahati Bus Station."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Shillong from Guwahati Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey typically takes around 3 to 4 hours, depending on traffic and road conditions."
          }
        },
        {
          "@type": "Question",
          "name": "Can I make stops along the way?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers the flexibility to stop for sightseeing, meals, or photo opportunities along the route."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to visit Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Shillong is between March and June (summer) or September and December (autumn) for pleasant weather and clear views."
          }
        },
        {
          "@type": "Question",
          "name": "Are there tolls along the way?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, there is currently one toll booth along the route from Guwahati to Shillong."
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
      "name": "Guwahati Airport to Shillong Reserved Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service/"
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
