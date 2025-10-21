import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacyandsecurity',
  standalone: true,
  imports: [],
  templateUrl: './privacyandsecurity.component.html',
  styleUrl: './privacyandsecurity.component.css'
})
export class PrivacyandsecurityComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private sectionObserver: IntersectionObserver | null = null;
  private cardObserver: IntersectionObserver | null = null;
  private tableObserver: IntersectionObserver | null = null;

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/cancellationpolicy/privacypolicy');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Privacy Policy | WizzRide – Your Data Security in Taxi Services");
    this.metaService.updateTag({
      name: 'description',
      content: "WizzRide Privacy Policy."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Privacy Policy | WizzRide – Your Data Security in Taxi Services"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Privacy Policy | WizzRide – Your Data Security in Taxi Services" });
    this.metaService.updateTag({ property: 'og:description', content: "WizzRide Privacy Policy." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancellationpolicy/privacypolicy' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Privacy Policy | WizzRide – Your Data Security in Taxi Services" });
    this.metaService.updateTag({ name: 'twitter:description', content: "WizzRide Privacy Policy." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
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
          "name": "Cancellation Policy",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/cancellationpolicy/"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Privacy Policy",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/cancellationpolicy/privacypolicy"
          }
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
    // Initialize all interactive features
    this.initSectionObserver();
    this.initCardObserver();
    this.initHoverEffects();
    this.initTermsListClick();
    this.initTableObserver();
    this.initSectionTitleAnimations();
  }

  ngOnDestroy(): void {
    // Disconnect intersection observers
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
    if (this.cardObserver) {
      this.cardObserver.disconnect();
    }
    if (this.tableObserver) {
      this.tableObserver.disconnect();
    }
  }

  // Intersection Observer for [data-animate] sections
  private initSectionObserver(): void {
    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const animateElements = this.elementRef.nativeElement.querySelectorAll('[data-animate]');
    animateElements.forEach((el: Element) => {
      this.sectionObserver?.observe(el);
    });
  }

  // Card observer for individual card fade-ins
  private initCardObserver(): void {
    this.cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    });

    const contentCards = this.elementRef.nativeElement.querySelectorAll('.content-card');
    contentCards.forEach((card: HTMLElement, index: number) => {
      card.style.transitionDelay = `${index * 0.1}s`;
      this.cardObserver?.observe(card);
    });
  }

  // Hover effects for cards and table rows
  private initHoverEffects(): void {
    // Content card hover effects
    const contentCards = this.elementRef.nativeElement.querySelectorAll('.content-card');
    contentCards.forEach((card: HTMLElement) => {
      this.renderer.listen(card, 'mouseenter', () => {
        card.style.boxShadow = '0 15px 35px rgba(29, 170, 186, 0.2)';
      });
      
      this.renderer.listen(card, 'mouseleave', () => {
        card.style.boxShadow = 'var(--card-shadow)';
      });
    });

    // Table row hover effects
    const tableRows = this.elementRef.nativeElement.querySelectorAll('tbody tr');
    tableRows.forEach((row: HTMLElement) => {
      this.renderer.listen(row, 'mouseenter', () => {
        row.style.boxShadow = '0 5px 15px rgba(29, 170, 186, 0.2)';
      });
      
      this.renderer.listen(row, 'mouseleave', () => {
        row.style.boxShadow = 'none';
      });
    });
  }

  // Click animation for list items
  private initTermsListClick(): void {
    const termsListItems = this.elementRef.nativeElement.querySelectorAll('.terms-list li');
    termsListItems.forEach((li: HTMLElement) => {
      li.style.transition = 'transform 0.2s ease';
      this.renderer.listen(li, 'click', () => {
        li.style.transform = 'translateX(15px) scale(1.02)';
        setTimeout(() => {
          li.style.transform = 'translateX(10px)';
        }, 150);
      });
    });
  }

  // Table container reveal
  private initTableObserver(): void {
    this.tableObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.2 }
    );

    const tables = this.elementRef.nativeElement.querySelectorAll('.table-container');
    tables.forEach((table: HTMLElement) => {
      table.style.opacity = '0';
      table.style.transform = 'translateY(30px)';
      table.style.transition = 'all 0.8s ease';
      this.tableObserver?.observe(table);
    });
  }

  // Fancy entrance for section titles
  private initSectionTitleAnimations(): void {
    const sectionTitles = this.elementRef.nativeElement.querySelectorAll('.section-title');
    sectionTitles.forEach((title: HTMLElement, index: number) => {
      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                (entry.target as HTMLElement).style.animation = 'slideInUp 0.8s ease-out both';
              }, index * 100);
            }
          });
        },
        { threshold: 0.5 }
      );
      titleObserver.observe(title);
    });
  }
}
