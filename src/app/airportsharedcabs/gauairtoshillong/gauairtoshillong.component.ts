import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-gauairtoshillong',
  standalone: true,
  imports: [],
  templateUrl: './gauairtoshillong.component.html',
  styleUrl: './gauairtoshillong.component.css'
})
export class GauairtoshillongComponent implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Shillong - Shared Cab Service | Book Now");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a reliable shared cab from Guwahati to Shillong. Enjoy affordable, comfortable rides with Wizzride. The distance from Guwahati to Shillong is 100 km."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Shillong - Shared Cab Service | Book Now"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Shillong - Shared Cab Service | Book Now' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a reliable shared cab from Guwahati to Shillong. Enjoy affordable, comfortable rides with Wizzride. The distance from Guwahati to Shillong is 100 km." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Shillong - Shared Cab Service | Book Now' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a reliable shared cab from Guwahati to Shillong. Enjoy affordable, comfortable rides with Wizzride. The distance from Guwahati to Shillong is 100 km." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
          "@type": "Question",
          "name": "How far is Shillong from Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Guwahati to Shillong distance is 100 km, and it takes 3-4 hours by road."
          }
        },
        {
          "@type": "Question",
          "name": "What is the best time to visit Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The best time to visit Shillong is during the summer months (March-June), but winter is also beautiful with snowfall."
          }
        },
        {
          "@type": "Question",
          "name": "How to reach Shillong from Guwahati?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can reach Shillong from Guwahati by shared taxi, private cab, or car hire. Popular pickup points include Guwahati Airport and Khanapara."
          }
        },
        {
          "@type": "Question",
          "name": "What is the distance from Shillong to Cherrapunji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Shillong to Cherrapunji distance is 54.1 km, which takes around 2-3 hours by road."
          }
        },
        {
          "@type": "Question",
          "name": "What is the distance from Shillong to Umiam Lake?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Shillong to Umiam Lake distance is 20 km, and it takes around 30 minutes to 1 hour by road."
          }
        },
        {
          "@type": "Question",
          "name": "What is the distance from Shillong to Elephant Falls?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Shillong to Elephant Falls distance is 15 km, and it takes around 30 minutes by road to reach the falls."
          }
        },
        {
          "@type": "Question",
          "name": "What is the distance from Guwahati Airport to Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Guwahati Airport to Shillong distance is approximately 118.3 km, and the travel time is around 3-4 hours by road."
          }
        }
      ]});


    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
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
          "name": "Guwahati Airport to Shillong Shared Cab Service",
          "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/guwahati-to-shillong/"
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
