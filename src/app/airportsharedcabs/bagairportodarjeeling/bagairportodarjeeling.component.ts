import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagairportodarjeeling',
  standalone: true,
  imports: [],
  templateUrl: './bagairportodarjeeling.component.html',
  styleUrl: './bagairportodarjeeling.component.css'
})
export class BagairportodarjeelingComponent implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Darjeeling - Shared Cab Service | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a comfortable shared cab from Bagdogra to Darjeeling. Affordable and reliable services to explore Darjeeling’s top attractions. Distance: 70 km."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Darjeeling - Shared Cab Service | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Darjeeling - Shared Cab Service | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a comfortable shared cab from Bagdogra to Darjeeling. Affordable and reliable services to explore Darjeeling’s top attractions. Distance: 70 km." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Darjeeling - Shared Cab Service | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a comfortable shared cab from Bagdogra to Darjeeling. Affordable and reliable services to explore Darjeeling’s top attractions. Distance: 70 km." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "What is the cost of a shared taxi that covers Bagdogra to Darjeeling distance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The cost varies based on demand and time of booking. Check our Pricing Page for the latest rates."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best month to visit Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best months to visit Darjeeling are from March to May and September to November when the weather is pleasant and the views are clear."
          }
        },
        {
          "@type": "Question",
          "name": "How much does the Darjeeling ropeway cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Darjeeling ropeway ticket price is approximately INR 200 per person, offering breathtaking views of the valley."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I buy the best tea in Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can explore famous tea shops like Golden Tips, Nathmulls, or Lopchu Tea Estate for the best tea in Darjeeling."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the Darjeeling joy ride fare?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Darjeeling Joy Ride fares are around INR 100 for a short trip, offering a glimpse into the toy train experience."
          }
        },
        {
          "@type": "Question",
          "name": "What are the must-visit places in Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Key attractions include Batasia Loop, Tiger Hill, Happy Valley Tea Estate, and the Japanese Peace Pagoda."
          }
        },
        {
          "@type": "Question",
          "name": "Is Darjeeling a good destination for a family trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Darjeeling is perfect for families, with scenic spots like Happy Valley Tea Estate, Darjeeling Zoo, and Mahakal Mandir."
          }
        },
        {
          "@type": "Question",
          "name": "Can I visit Darjeeling from Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the distance from Gangtok to Darjeeling is around 100 km, and there are several travel options available, including shared cabs and private taxis."
          }
        },
        {
          "@type": "Question",
          "name": "Which is the nearest airport for Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bagdogra Airport is the nearest airport for Darjeeling town."
          }
        },
        {
          "@type": "Question",
          "name": "Is Bagdogra to Darjeeling bus available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, there are no direct buses from Bagdogra Airport to Darjeeling."
          }
        },
        {
          "@type": "Question",
          "name": "Is Bagdogra to Darjeeling train available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, there are no direct trains from Bagdogra Airport to Darjeeling."
          }
        },
        {
          "@type": "Question",
          "name": "How many hours does it take to reach Darjeeling from Siliguri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It will take roughly around 3-4 hours to reach Darjeeling from Siliguri."
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
      "name": "Luxury Shared Cabs",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Bagdogra Airport to Darjeeling Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Darjeeling_Shared_Cab_Service/"
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
