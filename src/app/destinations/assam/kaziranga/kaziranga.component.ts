import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-kaziranga',
  standalone: true,
  imports: [],
  templateUrl: './kaziranga.component.html',
  styleUrl: './kaziranga.component.css'
})
export class KazirangaComponent  implements OnInit, AfterViewInit, OnDestroy {
  
  constructor(
    private commonDestService: CommonDestinationService,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/kaziranga-national-park/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Kaziranga Travel Guide | Top Attractions & Safari Tips");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Kaziranga National Park – home to one-horned rhinos, scenic landscapes, and thrilling wildlife safaris. Travel tips and Wizzride cab services included."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Kaziranga Travel Guide | Top Attractions & Safari Tips"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Kaziranga Travel Guide | Top Attractions & Safari Tips' });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Kaziranga National Park – home to one-horned rhinos, scenic landscapes, and thrilling wildlife safaris. Travel tips and Wizzride cab services included." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/kaziranga-national-park/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/destinations/Kaziranga_Hero.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Kaziranga Travel Guide | Top Attractions & Safari Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Kaziranga National Park – home to one-horned rhinos, scenic landscapes, and thrilling wildlife safaris. Travel tips and Wizzride cab services included." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/destinations/Kaziranga_Hero.jpg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(      {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the park's opening hours?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kaziranga National Park is open daily from 7:30 AM to 4:00 PM during the tourist season (November to April). The park remains closed during the monsoon months (May to October)."
          }
        },
        {
          "@type": "Question",
          "name": "What is the entry fee for Kaziranga National Park?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The entry fee for Kaziranga National Park varies depending on nationality and safari type. For Indian tourists, it is around ₹100–₹200 per person, while for foreign tourists it is higher. Jeep and elephant safari charges are additional."
          }
        },
        {
          "@type": "Question",
          "name": "Can I spot tigers in Kaziranga?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kaziranga is a tiger reserve and home to the Royal Bengal Tiger. However, tiger sightings are rare compared to the more common sightings of one-horned rhinoceroses, elephants, wild buffaloes, swamp deer, and various bird species."
          }
        },
        {
          "@type": "Question",
          "name": "How long does a safari take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A jeep safari in Kaziranga usually lasts about 2 to 3 hours, while an elephant safari lasts around 1 hour. Timings depend on the zone and season."
          }
        },
        {
          "@type": "Question",
          "name": "Is Kaziranga safe for tourists?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Kaziranga National Park is safe for tourists when proper guidelines are followed. Safaris are conducted with trained guides and drivers, and visitors are advised not to step out of the vehicles during the safari."
          }
        }
      ]
    });

 

    // ✅ TouristDestination JSON-LD (specific to Gangtok)
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
          "name": "Destinations",
          "item": "https://wizzride.com/destinations"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kaziranga National Park",
          "item": "https://wizzride.com/destinations/kaziranga-national-park/"
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
    // Initialize all common destination page functionality
    this.commonDestService.initializeDestinationPage();
  }

  ngOnDestroy(): void {
    // Clean up event listeners
    this.commonDestService.cleanup();
  }
}
