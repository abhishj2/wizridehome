import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-siliguritokalimpong',
  standalone: true,
  imports: [],
  templateUrl: './siliguritokalimpong.component.html',
  styleUrl: './siliguritokalimpong.component.css'
})
export class SiliguritokalimpongComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride Taxi Service | Book Cabs to Kalimpong from Siliguri");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Wizzride cabs to Kalimpong from Bagdogra, NJP, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable & scenic ride."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride Taxi Service | Book Cabs to Kalimpong from Siliguri"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride Taxi Service | Book Cabs to Kalimpong from Siliguri' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Wizzride cabs to Kalimpong from Bagdogra, NJP, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable & scenic ride." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride Taxi Service | Book Cabs to Kalimpong from Siliguri' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Wizzride cabs to Kalimpong from Bagdogra, NJP, Siliguri, Darjeeling & Gangtok. Choose shared or reserved taxis for a safe, comfortable & scenic ride." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "Is it worth going to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kalimpong is known for its scenic beauty, monasteries, and cool climate. It offers a peaceful retreat amidst the Himalayan range and is a must-visit for nature lovers."
          }
        },
        {
          "@type": "Question",
          "name": "Is homestay available in Lower Echhey Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, there are a variety of homestays available in Lower Echhey Kalimpong. It's a great way to experience the local culture and hospitality."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the bus ticket from Siliguri to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The bus fare from Siliguri to Kalimpong typically ranges from INR 100 to INR 300, depending on the bus service and seat availability."
          }
        },
        {
          "@type": "Question",
          "name": "How to Reach Itchanath Shivalaya Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Itchanath Shivalaya is located around 15 km from Kalimpong town center. You can reach it via taxi or bus."
          }
        },
        {
          "@type": "Question",
          "name": "How far is Kalimpong from Siliguri by train?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong is not directly connected by train to Siliguri. However, you can take a train to New Jalpaiguri (NJP) station and then take a taxi or bus from NJP to Kalimpong, which is around 50 km."
          }
        },
        {
          "@type": "Question",
          "name": "Which station is near to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The nearest railway station to Kalimpong is New Jalpaiguri Railway Station (NJP), which is around 50 km away. From there, you can travel by bus or taxi to Kalimpong."
          }
        },
        {
          "@type": "Question",
          "name": "Why is Kalimpong so famous?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong is famous for its breathtaking landscapes, Buddhist monasteries, and vibrant culture. It is also a hub for adventure sports like paragliding and offers views of the majestic Kanchenjunga mountain."
          }
        },
        {
          "@type": "Question",
          "name": "Which month is best for Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Kalimpong is between March to June and September to November. The weather is pleasant, ideal for sightseeing, trekking, and other outdoor activities."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong better than Darjeeling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong offers a more peaceful and relaxed atmosphere compared to Darjeeling, which is more commercialized. If you prefer a quieter retreat, Kalimpong may be a better choice."
          }
        },
        {
          "@type": "Question",
          "name": "How many days are enough for Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 2 to 3-day trip is sufficient to explore the major attractions in Kalimpong, including monasteries, scenic spots, and adventure activities."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong a hill station?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kalimpong is a hill station located at an elevation of 1,250 meters in the eastern Himalayas, offering cool weather and panoramic views of the surrounding valleys and mountains."
          }
        },
        {
          "@type": "Question",
          "name": "Does Kalimpong have snowfall?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong doesn't receive heavy snowfall, but it does get chilly weather during the winter months. For snowfall, you may have to visit higher altitude areas like Darjeeling or Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong expensive?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kalimpong is considered relatively affordable, with plenty of budget-friendly accommodation and dining options. However, some high-end resorts and luxury hotels may be pricier."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kalimpong safe to visit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kalimpong is generally considered safe for tourists. However, like any other tourist destination, it's always advisable to follow standard safety precautions and stay in well-known areas."
          }
        },
        {
          "@type": "Question",
          "name": "Which is more beautiful: Kurseong or Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Both places offer stunning views and serene environments, but Kalimpong is often considered more scenic due to its proximity to the Kanchenjunga range and its diverse flora."
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
      "name": "Siliguri to Kalimpong Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Siliguri_To_Kalimpong_Shared_Cab_Service/"
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
