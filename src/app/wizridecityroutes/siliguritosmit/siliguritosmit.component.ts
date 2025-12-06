import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';
@Component({
  selector: 'app-siliguritosmit',
  standalone: true,
  imports: [],
  templateUrl: './siliguritosmit.component.html',
  styleUrl: './siliguritosmit.component.css'
})
export class SiliguritosmitComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service//');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Siliguri to SMIT Shared Cab | Affordable Taxi Service - Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to SMIT . Affordable, safe, and timely rides for a smooth journey."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Siliguri to SMIT Shared Cab | Affordable Taxi Service - Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Siliguri to SMIT Shared Cab | Affordable Taxi Service - Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to SMIT . Affordable, safe, and timely rides for a smooth journey." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service//' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/smit.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Siliguri to SMIT Shared Cab | Affordable Taxi Service - Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Travel conveniently with Wizzride Shared Cab Services from Siliguri to SMIT . Affordable, safe, and timely rides for a smooth journey." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/smit.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(   {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I book a Sikkim cab from Siliguri to SMIT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can easily book a Sikkim cab through the Wizzride website or mobile app. Simply select your pickup location in Siliguri and choose Sikkim Manipal Institute of Technology (SMIT) as your drop-off point."
      }
    },
    {
      "@type": "Question",
      "name": "What is the distance between Siliguri and SMIT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The distance from Siliguri to Sikkim Manipal Institute of Technology (SMIT) is approximately 80 km, and the journey takes around 2.5 to 3 hours by road."
      }
    },
    {
      "@type": "Question",
      "name": "Are shared cabs available for the Siliguri to SMIT route?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Wizzride provides shared cabs in Sikkim, ensuring a cost-effective and comfortable travel option for students, professionals, and visitors."
      }
    },
    {
      "@type": "Question",
      "name": "What is the fare for a shared cab from Siliguri to SMIT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The fare depends on the type of vehicle and availability. You can check the latest prices on the Wizzride website or app before booking."
      }
    },
    {
      "@type": "Question",
      "name": "Can I book a private cab instead of a shared one?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, in addition to shared cabs in Sikkim, Wizzride also offers private cab services for a more personalized travel experience."
      }
    },
    {
      "@type": "Question",
      "name": "What are the pickup and drop-off points for the shared cab service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pickup points in Siliguri include Airport More, Bihar More, Matigara, Darjeeling More, and Vega Mall (near NJP). Drop-off points for SMIT are Rangpo and Majhitar (SMIT Campus)."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best way to travel from Siliguri to SMIT?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most convenient way to reach Sikkim Manipal Institute of Technology (SMIT) from Siliguri is by booking a Sikkim cab with Wizzride, offering both shared and private cabs for a smooth journey."
      }
    },
    {
      "@type": "Question",
      "name": "Are there any additional charges for luggage?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, standard luggage is included in the fare. However, for oversized or extra luggage, additional charges may apply."
      }
    },
    {
      "@type": "Question",
      "name": "Is the shared cab service available every day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Wizzride operates daily shared cabs in Sikkim between Siliguri and SMIT, ensuring seamless travel for passengers."
      }
    },
    {
      "@type": "Question",
      "name": "Can I modify or cancel my booking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can modify or cancel your booking through the Wizzride app or website. Cancellation policies may apply based on the time of cancellation."
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
      "name": "Luxury Shared Cabs",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Siliguri to SMIT Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_SMIT_Shared_Cab_Service/"
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
