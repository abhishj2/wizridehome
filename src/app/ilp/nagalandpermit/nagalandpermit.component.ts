import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { IlpAnimations } from '../commonilp';

@Component({
  selector: 'app-nagalandpermit',
  standalone: true,
  imports: [],
  templateUrl: './nagalandpermit.component.html',
  styleUrl: './nagalandpermit.component.css'
})
export class NagalandpermitComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.titleService.setTitle("Nagaland Inner Line Permit (ILP) – How to Apply, Requirements & Wizzride Cab");
    this.metaService.updateTag({
      name: 'description',
      content: "Planning a trip to Nagaland? Learn everything about Nagaland Inner Line Permit (ILP) – application process, documents, validity & where to apply. Book safe and reliable Wizzride cabs to explore Kohima, Dimapur, Mon & more."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Nagaland Inner Line Permit (ILP) – How to Apply, Requirements & Wizzride Cab"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Nagaland Inner Line Permit (ILP) – How to Apply, Requirements & Wizzride Cab' });
    this.metaService.updateTag({ property: 'og:description', content: "Planning a trip to Nagaland? Learn everything about Nagaland Inner Line Permit (ILP) – application process, documents, validity & where to apply. Book safe and reliable Wizzride cabs to explore Kohima, Dimapur, Mon & more." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/inner-line-permit/nagaland-inner-line-permit' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Nagaland Inner Line Permit (ILP) – How to Apply, Requirements & Wizzride Cab' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Planning a trip to Nagaland? Learn everything about Nagaland Inner Line Permit (ILP) – application process, documents, validity & where to apply. Book safe and reliable Wizzride cabs to explore Kohima, Dimapur, Mon & more." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who needs an Inner Line Permit (ILP) for Nagaland?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All Indian citizens, except residents of Nagaland, require an ILP to visit the state. Foreign tourists do not need ILP but must register with the local Foreigners Registration Office (FRO) upon arrival."
          }
        },
        {
          "@type": "Question",
          "name": "How can I apply for an ILP to visit Nagaland?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can apply both online through the Nagaland State Portal or offline at Nagaland House offices located in Delhi, Kolkata, Guwahati, Shillong, and at entry points like Dimapur and Kohima."
          }
        },
        {
          "@type": "Question",
          "name": "What documents are required for ILP in Nagaland?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You need a valid Government ID proof (Aadhaar, Voter ID, Passport, or Driving License) and two passport-size photographs to apply for an ILP in Nagaland."
          }
        },
        {
          "@type": "Question",
          "name": "How long is the Nagaland ILP valid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A tourist ILP is usually issued for 15 to 30 days and can be extended at the Deputy Commissioner’s Office in Nagaland."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe to travel in Nagaland with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides safe, comfortable, and reliable cab services across Nagaland with experienced local drivers and 24/7 customer support."
          }
        },
        {
          "@type": "Question",
          "name": "How can I book a Wizzride cab for Nagaland?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Booking is simple – visit the Wizzride website or use the mobile app to book a reserved cab from Dimapur Airport, Kohima, or other towns across Nagaland."
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
          "name": "Arunachal Pradesh Inner Line Permit",
          "item": "https://wizzride.com/inner-line-permit/nagaland-inner-line-permit"
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
