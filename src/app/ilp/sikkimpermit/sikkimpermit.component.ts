import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { IlpAnimations } from '../commonilp';

@Component({
  selector: 'app-sikkimpermit',
  standalone: true,
  imports: [],
  templateUrl: './sikkimpermit.component.html',
  styleUrl: './sikkimpermit.component.css'
})
export class SikkimpermitComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private listeners: (() => void)[] = [];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/inner-line-permit/nagaland-inner-line-permit');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Sikkim Travel Permits: A Comprehensive Guide for Foreign Tourists");
    this.metaService.updateTag({
      name: 'description',
      content: "Your go-to guide for Sikkim travel permits. Learn about RAP, PAP, restricted areas, and get essential travel info for a hassle-free trip."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Sikkim Travel Permits: A Comprehensive Guide for Foreign Tourists"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Sikkim Travel Permits: A Comprehensive Guide for Foreign Tourists' });
    this.metaService.updateTag({ property: 'og:description', content: "Your go-to guide for Sikkim travel permits. Learn about RAP, PAP, restricted areas, and get essential travel info for a hassle-free trip." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/inner-line-permit/nagaland-inner-line-permit' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Sikkim Travel Permits: A Comprehensive Guide for Foreign Tourists' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Your go-to guide for Sikkim travel permits. Learn about RAP, PAP, restricted areas, and get essential travel info for a hassle-free trip." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd(  {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who needs a Restricted Area Permit (RAP) to visit Sikkim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All foreign nationals, except citizens of Bhutan, require a Restricted Area Permit (RAP) to enter Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a fee for the Restricted Area Permit (RAP)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, the Restricted Area Permit (RAP) is issued free of cost."
          }
        },
        {
          "@type": "Question",
          "name": "Can I travel alone in Sikkim with a RAP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, the RAP is not granted to solo travelers. You must be part of a group of at least two or more people."
          }
        },
        {
          "@type": "Question",
          "name": "What is the validity of the Restricted Area Permit (RAP)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The RAP is valid for 30 days and can be extended for another 30 days, up to a maximum of 60 days stay in Sikkim."
          }
        },
        {
          "@type": "Question",
          "name": "What should I do upon arrival in Sikkim with a RAP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Foreign tourists must register with the Foreigners Registration Office (FRO) in Gangtok within 24 hours of their arrival."
          }
        },
        {
          "@type": "Question",
          "name": "What is a Protected Area Permit (PAP)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Protected Area Permit (PAP) is required for visiting restricted and ecologically sensitive areas like Tsomgo Lake, Lachen, Lachung, and Yumthang Valley."
          }
        },
        {
          "@type": "Question",
          "name": "Can I obtain a PAP on my own?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, the PAP must be arranged through a registered travel agency or tour operator."
          }
        },
        {
          "@type": "Question",
          "name": "How long is the Protected Area Permit (PAP) valid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The validity of the PAP depends on the itinerary and ranges from 1 to 5 days."
          }
        },
        {
          "@type": "Question",
          "name": "Which documents are required to obtain a Sikkim Travel Permit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You need a valid passport with an Indian visa, two recent passport-size photographs, and a completed application form. For PAP areas, a detailed itinerary and guide details are also required."
          }
        },
        {
          "@type": "Question",
          "name": "Where can I apply for an extension of the RAP?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can apply for an extension at the Foreigners Registration Office (FRO) in Gangtok or the Superintendent of Police in Namchi, Gyalshing, or Mangan."
          }
        }
      ]
    });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd(        
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": {
        "@type": "WebPage",
        "@id": "https://www.wizzride.com/"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Sikkim Permit Guide",
      "item": {
        "@type": "WebPage",
        "@id": "https://www.wizzride.com/sikkim_permit_guide"
      }
    }
  ]
});

    

    // Initialize animations when component loads
    IlpAnimations.initializeAnimations();
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  ngOnDestroy(): void {
    this.cleanup();
    // Clean up animations when component is destroyed
    IlpAnimations.cleanup();
  }

  // ================== ANIMATION ON SCROLL ==================
  private initializeAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer?.observe(el);
    });

    // ================== STAGGERED DELAYS ==================
    this.applyStaggeredDelay('.fourcol');
    this.applyStaggeredDelay('.howto-step');
    this.applyStaggeredDelay('.faq-item');
  }

  private applyStaggeredDelay(selector: string): void {
    const cards = document.querySelectorAll(selector);
    cards.forEach((card, index) => {
      (card as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
    });
  }

  private cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }
}
