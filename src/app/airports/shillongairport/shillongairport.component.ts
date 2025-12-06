import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-shillongairport',
  standalone: true,
  imports: [],
  templateUrl: './shillongairport.component.html',
  styleUrl: './shillongairport.component.css'
})
export class ShillongairportComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/airports/shillongairport');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Shillong Airport Taxi | Wizzride Cab Service");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Shillong Airport taxis with Wizzride. Affordable, safe rides to Guwahati, Cherrapunji, Dawki & other Northeast destinations."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Shillong Airport Taxi | Wizzride Cab Service"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Shillong Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ property: 'og:description', content: "Book Shillong Airport taxis with Wizzride. Affordable, safe rides to Guwahati, Cherrapunji, Dawki & other Northeast destinations." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/airports/guwahatiairport/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/airports/shillongairport.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Shillong Airport Taxi | Wizzride Cab Service' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book Shillong Airport taxis with Wizzride. Affordable, safe rides to Guwahati, Cherrapunji, Dawki & other Northeast destinations." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/airports/shillongairport.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I book a taxi from Shillong Airport with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can easily book online via our website or by contacting our customer support team with your travel details."
          }
        },
        {
          "@type": "Question",
          "name": "Are the taxi fares from Shillong Airport fixed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, all fares are fixed according to the vehicle type with no hidden charges."
          }
        },
        {
          "@type": "Question",
          "name": "What types of vehicles does Wizzride offer at Shillong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide hatchbacks, sedans, SUVs, and shared SUVs to suit different group sizes and budgets."
          }
        },
        {
          "@type": "Question",
          "name": "Is doorstep pickup available from Shillong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides doorstep pickup and drop-off services at Shillong Airport."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to reach Shillong city or Cherrapunji from Shillong Airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It takes about 1 to 1.5 hours to Shillong city and 2.5 to 3 hours to Cherrapunji by road."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wizzride operate 24/7 for Shillong Airport transfers?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our taxi services are available round the clock for your convenience."
          }
        },
        {
          "@type": "Question",
          "name": "Are the drivers experienced and licensed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All Wizzride drivers are professionally trained, licensed, and familiar with the local terrain."
          }
        },
        {
          "@type": "Question",
          "name": "Can I book one-way and round-trip taxi services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer both one-way and round-trip taxi options."
          }
        },
        {
          "@type": "Question",
          "name": "What payment options does Wizzride accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept cash, credit/debit cards, and online payments."
          }
        }
      ]}
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
          "name": "Airports",
          "item": "https://wizzride.com/airports"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Guwahati Airport",
          "item": "https://wizzride.com/airports/shillongairport"
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
