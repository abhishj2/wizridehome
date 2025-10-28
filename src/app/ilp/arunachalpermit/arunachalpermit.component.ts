import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { IlpAnimations } from '../commonilp';

@Component({
  selector: 'app-arunachalpermit',
  standalone: true,
  imports: [],
  templateUrl: './arunachalpermit.component.html',
  styleUrl: './arunachalpermit.component.css'
})
export class ArunachalpermitComponent implements OnInit, AfterViewInit, OnDestroy {
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
    this.seoService.setCanonicalURL('https://wizzride.com/inner-line-permit/arunachal-inner-line-permit');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Inner Line Permit (ILP) for Arunachal Pradesh | Apply Online & Travel with Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Learn how to apply for the Inner Line Permit (ILP) for Arunachal Pradesh. Check documents required, validity, and permit rules. Book Wizzride cabs for safe travel to Tawang, Ziro, Bomdila, and more."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Inner Line Permit (ILP) for Arunachal Pradesh | Apply Online & Travel with Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Inner Line Permit (ILP) for Arunachal Pradesh | Apply Online & Travel with Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: "Learn how to apply for the Inner Line Permit (ILP) for Arunachal Pradesh. Check documents required, validity, and permit rules. Book Wizzride cabs for safe travel to Tawang, Ziro, Bomdila, and more." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/inner-line-permit/arunachal-inner-line-permit' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Inner Line Permit (ILP) for Arunachal Pradesh | Apply Online & Travel with Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Learn how to apply for the Inner Line Permit (ILP) for Arunachal Pradesh. Check documents required, validity, and permit rules. Book Wizzride cabs for safe travel to Tawang, Ziro, Bomdila, and more." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQ JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who needs an Inner Line Permit (ILP) for Arunachal Pradesh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All Indian citizens, except residents of Arunachal Pradesh, need an ILP. Foreign tourists require a Protected Area Permit (PAP)."
          }
        },
        {
          "@type": "Question",
          "name": "How can I apply for an ILP to Arunachal Pradesh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can apply online via the Arunachal Pradesh ILP portal or offline at Arunachal Bhavan/House offices in Delhi, Kolkata, Guwahati, Shillong, Tezpur, and at check gates."
          }
        },
        {
          "@type": "Question",
          "name": "What documents are required for ILP in Arunachal Pradesh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A valid Government Photo ID (Aadhaar, Passport, Voter ID, Driving License) and two passport-size photographs."
          }
        },
        {
          "@type": "Question",
          "name": "How long is the ILP valid in Arunachal Pradesh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A tourist ILP is valid for 15 days and can be extended at the Deputy Commissioner’s Office in Arunachal Pradesh."
          }
        },
        {
          "@type": "Question",
          "name": "Can Wizzride help me travel in Arunachal Pradesh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride offers safe, reliable cabs from Guwahati, Tezpur, and nearby towns to popular Arunachal destinations like Tawang, Ziro Valley, and Bomdila."
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
          "item": "https://wizzride.com/inner-line-permit/arunachal-inner-line-permit"
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
