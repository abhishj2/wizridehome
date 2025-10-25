import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagdogratokalimpong',
  standalone: true,
  imports: [],
  templateUrl: './bagdogratokalimpong.component.html',
  styleUrl: './bagdogratokalimpong.component.css'
})
export class BagdogratokalimpongComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Reserved Cab from Bagdogra Airport to Kalimpong | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Bagdogra to Kalimpong taxi, reserved cab from Bagdogra, Kalimpong taxi, Wizzride, luxury innova, SUV, sedan taxi, private cab service"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Reserved Cab from Bagdogra Airport to Kalimpong | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Reserved Cab from Bagdogra Airport to Kalimpong | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Bagdogra to Kalimpong taxi, reserved cab from Bagdogra, Kalimpong taxi, Wizzride, luxury innova, SUV, sedan taxi, private cab service" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Reserved Cab from Bagdogra Airport to Kalimpong | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Bagdogra to Kalimpong taxi, reserved cab from Bagdogra, Kalimpong taxi, Wizzride, luxury innova, SUV, sedan taxi, private cab service" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(
     {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does a taxi cost from Bagdogra Airport to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The taxi fare for a reserved cab from Bagdogra to Kalimpong starts at ₹999*."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Kalimpong from Bagdogra Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey typically takes around 2 hours 30 minutes, depending on traffic and road conditions."
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
          "name": "What is the best time to visit Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Kalimpong is between March and June (summer) or September and December (autumn) for pleasant weather and clear views."
          }
        },
        {
          "@type": "Question",
          "name": "Are taxis available at Bagdogra Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, taxis are available at Bagdogra Airport. However, booking a reserved cab with Wizzride ensures a more personalized and comfortable experience."
          }
        }
      ]
    }
);

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
      "name": "Bagdogra Airport to Kalimpong Reserved Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Bagdogra_Airport_To_Kalimpong_Reserved_Cab_Service"
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
