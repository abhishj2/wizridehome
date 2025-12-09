import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CommonAirportService } from '../commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-guwahatiairport',
  standalone: true,
  imports: [],
  templateUrl: './guwahatiairport.component.html',
  styleUrl: './guwahatiairport.component.css'
})
export class GuwahatiairportComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private commonAirportService: CommonAirportService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/airports/guwahatiairport');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati Airport Taxi | Wizzride Cab Service");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Guwahati Airport taxis with Wizzride. Affordable fares, pro drivers, and smooth rides to Shillong, Kaziranga & across Northeast India."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati Airport Taxi | Wizzride Cab Service"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Guwahati Airport taxis with Wizzride. Affordable fares, pro drivers, and smooth rides to Shillong, Kaziranga & across Northeast India." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/airports/guwahatiairport/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airports/guwahatiairport.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Guwahati Airport taxis with Wizzride. Affordable fares, pro drivers, and smooth rides to Shillong, Kaziranga & across Northeast India." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airports/guwahatiairport.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a taxi from Guwahati Airport with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can easily book your taxi online through our website or by contacting our customer support team. Just provide your pickup details and destination, and we will confirm your booking."
          }
        },
        {
          "@type": "Question",
          "name": "Are the taxi fares from Guwahati Airport to Shillong and Kaziranga fixed or negotiable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our fares are transparent and fixed as per the vehicle type listed. There are no hidden charges or last-minute price hikes."
          }
        },
        {
          "@type": "Question",
          "name": "What types of vehicles are available for airport transfers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a range of vehicles, including hatchbacks, sedans, SUVs, and shared SUVs, to cater to different group sizes and budgets."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get doorstep pickup from Guwahati Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides doorstep pickup and drop services from Guwahati Airport to your desired destination."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Shillong or Kaziranga from Guwahati Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey to Shillong usually takes about 2.5 to 3 hours, while Kaziranga National Park is around 4 hours away by road."
          }
        },
        {
          "@type": "Question",
          "name": "Is Wizzride’s service available 24/7 at Guwahati Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide taxi services round the clock to ensure your travel plans are convenient at any time of day."
          }
        },
        {
          "@type": "Question",
          "name": "Are the drivers experienced and licensed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! All our drivers are professionally trained, licensed, and familiar with the local routes to guarantee a safe and pleasant journey."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book a taxi for a one-way trip or round trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer both one-way and round-trip taxi booking options based on your travel needs."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods does Wizzride accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept multiple payment options, including cash, credit/debit cards, and online payments for your convenience."
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
          "name": "Airports",
          "item": "https://wizzride.com/airports"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Guwahati Airport",
          "item": "https://wizzride.com/airports/guwahatiairport"
        }
      ]
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.commonAirportService.initializeAirportPage();
    }
  }

  ngOnDestroy(): void {
    this.commonAirportService.cleanup();
  }
}
