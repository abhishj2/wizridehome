import { Component, AfterViewInit, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { CommonDestinationService } from '../../commondest';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-batasialoop',
  standalone: true,
  imports: [],
  templateUrl: './batasialoop.component.html',
  styleUrl: './batasialoop.component.css'
})
export class BatasialoopComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/destinations/batasia-loop/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Batasia Loop Darjeeling Scenic Marvel of Nature and Railway");
    this.metaService.updateTag({
      name: 'description',
      content: "Experience the breathtaking beauty of Batasia Loop, where nature meets engineering brilliance. Book your trip with Wizzride for a seamless journey"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Batasia Loop Darjeeling Scenic Marvel of Nature and Railway"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Batasia Loop Darjeeling Scenic Marvel of Nature and Railway' });
    this.metaService.updateTag({ property: 'og:description', content: "Experience the breathtaking beauty of Batasia Loop, where nature meets engineering brilliance. Book your trip with Wizzride for a seamless journey" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/destinations/batasia-loop/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Batasia Loop Darjeeling Scenic Marvel of Nature and Railway' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Experience the breathtaking beauty of Batasia Loop, where nature meets engineering brilliance. Book your trip with Wizzride for a seamless journey" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(     {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
              "@type": "Question",
              "name": "What are the visiting hours of Batasia Loop?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Batasia Loop is open daily from 5:00 AM to 8:00 PM. Early mornings are especially popular for views of the Himalayan peaks and the Toy Train passing through."
              }
          },
          {
              "@type": "Question",
              "name": "Is there an entry fee for Batasia Loop?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, there is a small entry fee for visitors to Batasia Loop, which goes towards the maintenance of the garden and war memorial."
              }
          },
          {
              "@type": "Question",
              "name": "How long does it take to visit Batasia Loop?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A visit to Batasia Loop usually takes around 30 minutes to 1 hour, depending on whether you explore the gardens, war memorial, and enjoy the Toy Train experience."
              }
          },
          {
              "@type": "Question",
              "name": "Can I take photographs inside the Batasia Loop?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, photography is allowed inside Batasia Loop. It is one of the most scenic spots in Darjeeling, offering panoramic views of the Kanchenjunga range and the Toy Train."
              }
          },
          {
              "@type": "Question",
              "name": "How can I reach Batasia Loop from Darjeeling?",
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Batasia Loop is located about 5 kilometers from Darjeeling town. You can reach it by shared jeep, private taxi, or by riding the Darjeeling Himalayan Railway (Toy Train)."
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
          "name": "Batasia Loop",
          "item": "https://wizzride.com/destinations/batasia-loop/"
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
