import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonAirportService } from '../../airports/commonairport';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-guwahatitoiimshillong',
  standalone: true,
  imports: [],
  templateUrl: './guwahatitoiimshillong.component.html',
  styleUrl: './guwahatitoiimshillong.component.css'
})
export class GuwahatitoiimshillongComponent  implements OnInit, AfterViewInit, OnDestroy {

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
    this.titleService.setTitle("IIM Shillong to Guwahati - Shared Cab Service | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Book a comfortable and affordable cab from IIM Shillong to Guwahati.Enjoy a smooth, scenic 2.5-hour journey with reliable drivers and flexible pickup options."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "IIM Shillong to Guwahati - Shared Cab Service | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'IIM Shillong to Guwahati - Shared Cab Service | Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Book a comfortable and affordable cab from IIM Shillong to Guwahati.Enjoy a smooth, scenic 2.5-hour journey with reliable drivers and flexible pickup options." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Reserved-Cabs/Guwahati_Airport_To_Shillong_Reserved_Cab_Service'});
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/LumdiengjriPeak.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'IIM Shillong to Guwahati - Shared Cab Service | Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book a comfortable and affordable cab from IIM Shillong to Guwahati.Enjoy a smooth, scenic 2.5-hour journey with reliable drivers and flexible pickup options." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/LumdiengjriPeak.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How far is Guwahati Airport from IIM Shillong?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The distance from IIM Shillong to Guwahati Airport is about 118 km, and the journey typically takes 2 to 2.5 hours, depending on traffic and weather conditions."
            }
        },
        {
            "@type": "Question",
            "name": "What’s the best way to reach Guwahati Airport from IIM Shillong?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The most convenient and affordable way is to travel by shared taxi with Wizzride. It’s comfortable, cost-effective, and hassle-free. Alternatively, you can opt for a private cab depending on your preference."
            }
        },
        {
            "@type": "Question",
            "name": "Does Wizzride offer pickup from IIM Shillong?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Wizzride provides pickup from the nearest point to IIM Shillong, i.e., Police Bazaar. If you prefer a pickup directly from IIM Shillong's Entrance Gate, call our helpline to request it in advance."
            }
        },
        {
            "@type": "Question",
            "name": "Can I book a return ride from Guwahati Airport to IIM Shillong?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely! You can easily book your return trip from Guwahati Airport to IIM Shillong at any time, ensuring a seamless travel experience both ways."
            }
        },
        {
            "@type": "Question",
            "name": "How much is the car fare from IIM Shillong to Guwahati?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The cost per seat in a luxury Innova from Shillong to Guwahati typically starts from Rs 799 onwards."
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
                    "name": "Luxury Reserved Cabs",
                    "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs"
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "IIM Shillong to Guwahati Airport Reserved Cab Service",
                    "item": "https://wizzride.com/ourservices/Luxury-Reserved-Cabs/IIM-Shillong-to-Guwahati-Airport"
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
