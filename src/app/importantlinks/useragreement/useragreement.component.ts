import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-useragreement',
  standalone: true,
  imports: [],
  templateUrl: './useragreement.component.html',
  styleUrl: './useragreement.component.css'
})
export class UseragreementComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Track observers for cleanup
  private sectionObserver: IntersectionObserver | null = null;
  private cardObserver: IntersectionObserver | null = null;
  private tableObserver: IntersectionObserver | null = null;
  
  // Track listeners for cleanup
  private clickListeners: (() => void)[] = [];
  private hoverListeners: (() => void)[] = [];

  // Schema ID
  private readonly schemaIds = ['agreement-breadcrumb'];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/cancellationpolicy/useragreement');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("User Agreement | WizzRide – Cab Services in Sikkim & Darjeeling");
    this.metaService.updateTag({
      name: 'description',
      content: "WizzRide User Agreement."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "User Agreement | WizzRide – Cab Services in Sikkim & Darjeeling"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "User Agreement | WizzRide – Cab Services in Sikkim & Darjeeling" });
    this.metaService.updateTag({ property: 'og:description', content: "WizzRide User Agreement." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancellationpolicy/useragreement' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "User Agreement | WizzRide – Cab Services in Sikkim & Darjeeling" });
    this.metaService.updateTag({ name: 'twitter:description', content: "WizzRide User Agreement." });
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
          "name": "User Agreement",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/cancellationpolicy/useragreement"
          }
        }
      ]
    }, 'agreement-breadcrumb');
  }

  // ✅ Utility: inject LD+JSON scripts safely
  // Updated: Runs on server (good for SEO) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    if (!this.document) return;

    // Remove existing script if it exists
    const existingScript = this.document.getElementById(scriptId);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    const script = this.renderer.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    // 1. CRITICAL: Stop Execution on Server
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize all interactive features
    this.initSectionObserver();
    this.initCardObserver();
    this.initHoverEffects();
    this.initTermsListClick();
    this.initTableObserver();
    this.initSectionTitleAnimations();
  }

  ngOnDestroy(): void {
    // 1. Disconnect observers
    if (this.sectionObserver) this.sectionObserver.disconnect();
    if (this.cardObserver) this.cardObserver.disconnect();
    if (this.tableObserver) this.tableObserver.disconnect();

    // 2. Remove listeners
    this.clickListeners.forEach(unlisten => unlisten());
    this.hoverListeners.forEach(unlisten => unlisten());

    // 3. Remove Schema Scripts (Browser only)
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }

  // Intersection Observer for [data-animate] sections
  private initSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
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
    } catch (e) {
      console.warn('Error initializing section observer:', e);
    }
  }

  // Card observer for individual card fade-ins
  private initCardObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
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
    } catch (e) {
      console.warn('Error initializing card observer:', e);
    }
  }

  // Hover effects for cards and table rows
  private initHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Content card hover effects
    const contentCards = this.elementRef.nativeElement.querySelectorAll('.content-card');
    contentCards.forEach((card: HTMLElement) => {
      const enter = this.renderer.listen(card, 'mouseenter', () => {
        card.style.boxShadow = '0 15px 35px rgba(29, 170, 186, 0.2)';
      });
      const leave = this.renderer.listen(card, 'mouseleave', () => {
        card.style.boxShadow = 'var(--card-shadow)';
      });
      this.hoverListeners.push(enter, leave);
    });

    // Table row hover effects
    const tableRows = this.elementRef.nativeElement.querySelectorAll('tbody tr');
    tableRows.forEach((row: HTMLElement) => {
      const enter = this.renderer.listen(row, 'mouseenter', () => {
        row.style.boxShadow = '0 5px 15px rgba(29, 170, 186, 0.2)';
      });
      const leave = this.renderer.listen(row, 'mouseleave', () => {
        row.style.boxShadow = 'none';
      });
      this.hoverListeners.push(enter, leave);
    });
  }

  // Click animation for list items
  private initTermsListClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const termsListItems = this.elementRef.nativeElement.querySelectorAll('.terms-list li');
    termsListItems.forEach((li: HTMLElement) => {
      li.style.transition = 'transform 0.2s ease';
      const click = this.renderer.listen(li, 'click', () => {
        li.style.transform = 'translateX(15px) scale(1.02)';
        setTimeout(() => {
          li.style.transform = 'translateX(10px)';
        }, 150);
      });
      this.clickListeners.push(click);
    });
  }

  // Table container reveal
  private initTableObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
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
    } catch (e) {
      console.warn('Error initializing table observer:', e);
    }
  }

  // Fancy entrance for section titles
  private initSectionTitleAnimations(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const sectionTitles = this.elementRef.nativeElement.querySelectorAll('.section-title');
      
      const titleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                (entry.target as HTMLElement).style.animation = 'slideInUp 0.8s ease-out both';
              }, 100);
            }
          });
        },
        { threshold: 0.5 }
      );

      sectionTitles.forEach((title: HTMLElement) => {
        titleObserver.observe(title);
      });
    } catch (e) {
      console.warn('Error initializing section title animations:', e);
    }
  }
}