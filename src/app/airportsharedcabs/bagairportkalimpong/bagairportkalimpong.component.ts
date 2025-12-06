import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-bagairportkalimpong',
  standalone: true,
  imports: [],
  templateUrl: './bagairportkalimpong.component.html',
  styleUrl: './bagairportkalimpong.component.css'
})
export class BagairportkalimpongComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Bagdogra to Kalimpong Shared Cab | Book Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a shared cab from Bagdogra to Kalimpong. Enjoy a comfortable, affordable ride with scenic views of Kanchenjunga. Explore Kalimpongs best attractions."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Bagdogra to Kalimpong Shared Cab | Book Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Bagdogra to Kalimpong Shared Cab | Book Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a shared cab from Bagdogra to Kalimpong. Enjoy a comfortable, affordable ride with scenic views of Kanchenjunga. Explore Kalimpongs best attractions." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/kalimpong.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Bagdogra to Kalimpong Shared Cab | Book Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a shared cab from Bagdogra to Kalimpong. Enjoy a comfortable, affordable ride with scenic views of Kanchenjunga. Explore Kalimpongs best attractions." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/kalimpong.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "What is the cost of a shared cab from Bagdogra to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The cost varies based on demand and time of booking. Check our Pricing Page for the latest rates on Bagdogra to Kalimpong shared cab fares."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Kalimpong from Bagdogra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The distance between Bagdogra to Kalimpong is approximately 70 km, and it takes around 2-3 hours to reach Kalimpong."
          }
        },
        {
          "@type": "Question",
          "name": "Are taxis available from Bagdogra Airport to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, taxi services are available from Bagdogra Airport to Kalimpong, and you can easily book a shared cab with Wizzride."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best hotels in Kalimpong with Kanchenjunga view?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong hill station is home to several stunning hotels with breathtaking views of Kanchenjunga, including Mayfair Kalimpong, Sterling Park Kalimpong, and Elgin Resort Kalimpong."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the fare from Kalimpong to NJP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The fare from Kalimpong to NJP (Kalimpong nearest railway station) varies, with shared cab rates starting at INR 350 per seat. For private taxis, the cost is higher depending on the vehicle type."
          }
        },
        {
          "@type": "Question",
          "name": "What are the best places to visit in Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong offers several must-see spots like Delo Park, Kalimpong Pine Tree Resort, and Cactus Garden. The Kanchenjunga Viewpoint is also a top attraction in Kalimpong."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong a good family vacation destination?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kalimpong is perfect for families, with scenic spots like Delo Hill, Kalimpong Pine Tree Resort, and Mission Valley Kalimpong."
          }
        },
        {
          "@type": "Question",
          "name": "What is the nearest Kalimpong airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong's nearest airport is Bagdogra Airport."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
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
          "name": "Bagdogra Airport to Kalimpong Shared Cab Service",
          "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Bagdogra_Airport_To_Kalimpong_Shared_Cab_Service/"
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
