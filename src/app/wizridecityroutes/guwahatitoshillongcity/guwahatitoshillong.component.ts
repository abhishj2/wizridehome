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
export class GuwahatitoshillongCityComponent implements OnInit, AfterViewInit, OnDestroy {

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/Luxury-Shared-Cabs/Guwahati_To_Shillong_Shared_Cab_Service');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Guwahati to Shillong Shared Taxi | Wizzride Affordable Taxi Services");
    this.metaService.updateTag({
      name: 'description',
      content: "Book your shared cab from Guwahati Airport to Shillong with Wizzride. Comfortable, affordable rides with multiple pickup and drop points. Call +91-7478-4938-74 for instant booking and smooth travel."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Guwahati to Shillong Shared Taxi | Wizzride Affordable Taxi Services"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Guwahati to Shillong Shared Taxi | Wizzride Affordable Taxi Services' });
    this.metaService.updateTag({ property: 'og:description', content: "Book your shared cab from Guwahati Airport to Shillong with Wizzride. Comfortable, affordable rides with multiple pickup and drop points. Call +91-7478-4938-74 for instant booking and smooth travel." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/Luxury-Shared-Cabs/Guwahati_To_Shillong_Shared_Cab_Service' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Guwahati to Shillong Shared Taxi | Wizzride Affordable Taxi Services' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Book your shared cab from Guwahati Airport to Shillong with Wizzride. Comfortable, affordable rides with multiple pickup and drop points. Call +91-7478-4938-74 for instant booking and smooth travel." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/cityroutes/gangtok.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the distance between Guwahati Airport and Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The distance between Lokpriya Gopinath Bordoloi International Airport and Shillong is around 120 km, and it takes 3–4 hours depending on weather and traffic conditions."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a shared cab from Guwahati Airport to Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can book online at https://wizzride.com or call +91-7478-4938-74 for instant confirmation and assistance."
          }
        },
        {
          "@type": "Question",
          "name": "What are the pickup and drop points for the Guwahati Airport to Shillong route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Major boarding points: Guwahati Airport, Khanapara, ISBT Guwahati, Radisson Blu, Jalukbari, and Azara. Major dropping points: Police Bazaar, Laitumkhrah, Malki, Civil Hospital, Rilbong, and ISBT Mawiong."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a shared cab from Guwahati to Shillong cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fares start from ₹500 per seat, depending on availability and vehicle type."
          }
        },
        {
          "@type": "Question",
          "name": "What vehicles are used for the Guwahati to Shillong route?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride provides Innova, Ertiga, and Tempo Traveller vehicles for shared cab service, ensuring comfort and safety."
          }
        },
        {
          "@type": "Question",
          "name": "Are there any night or early morning cab services available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers multiple daily departures including early morning and evening services, based on seat availability."
          }
        }
      ],
      "hasPart": {
        "@type": "Route",
        "name": "Guwahati Airport to Shillong Shared Cab Route",
        "url": "https://wizzride.com/guwahati-airport-to-shillong-shared-cab",
        "provider": {
          "@type": "Organization",
          "name": "Wizzride",
          "url": "https://wizzride.com",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7478-4938-74",
            "contactType": "Customer Support",
            "areaServed": "IN"
          }
        },
        "departureStation": {
          "@type": "Place",
          "name": "Lokpriya Gopinath Bordoloi International Airport",
          "address": "Borjhar, Guwahati, Assam, India"
        },
        "arrivalStation": {
          "@type": "Place",
          "name": "Police Bazaar, Shillong",
          "address": "Shillong, Meghalaya, India"
        },
        "intermediateStops": [
          { "@type": "Place", "name": "Khanapara, Guwahati" },
          { "@type": "Place", "name": "ISBT Guwahati" },
          { "@type": "Place", "name": "Malki Point, Shillong" },
          { "@type": "Place", "name": "Laitumkhrah, Shillong" }
        ],
        "distance": "120 km",
        "travelMode": "Car"
      }
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
      "name": "Guwahati to Shilllong Shared Cab Service",
      "item": "https://wizzride.com/ourservices/Luxury-Shared-Cabs/Guwahati_To_Shillong_Shared_Cab_Service"
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
