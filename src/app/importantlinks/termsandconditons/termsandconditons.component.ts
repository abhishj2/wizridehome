import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-termsandconditons',
  standalone: true,
  imports: [],
  templateUrl: './termsandconditons.component.html',
  styleUrl: './termsandconditons.component.css'
})
export class TermsandconditonsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Track observers for cleanup
  private intersectionObserver: IntersectionObserver | null = null;
  private tableObserver: IntersectionObserver | null = null;
  private sectionTitleObserver: IntersectionObserver | null = null;

  // Track listeners for cleanup
  private clickListeners: (() => void)[] = [];
  private hoverListeners: (() => void)[] = [];

  // Schema ID
  private readonly schemaIds = ['terms-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/cancellationpolicy/termsandconditions');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Terms & Conditions | Reliable Cab Booking in Shillong, Darjeeling, and Gangtok");
    this.metaService.updateTag({
      name: 'description',
      content: "WizzRide Terms and Conditions, WizzRide T&C."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Terms & Conditions | Reliable Cab Booking in Shillong, Darjeeling, and Gangtok"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Terms & Conditions | Reliable Cab Booking in Shillong, Darjeeling, and Gangtok" });
    this.metaService.updateTag({ property: 'og:description', content: "WizzRide Terms and Conditions, WizzRide T&C." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancellationpolicy/termsandconditions' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Terms & Conditions | Reliable Cab Booking in Shillong, Darjeeling, and Gangtok" });
    this.metaService.updateTag({ name: 'twitter:description', content: "WizzRide Terms and Conditions, WizzRide T&C." });
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
          "name": "Terms and Conditions",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/cancellationpolicy/termsandconditions"
          }
        }
      ]
    }, 'terms-breadcrumb');
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
    this.initIntersectionObserver();
    this.initTypingAnimation();
    this.initContentCardHoverEffects();
    this.initTableHoverEffects();
    this.initTermsListClick();
    this.initTableAnimations();
    this.initSectionTitleAnimations();
    this.initStaggerAnimation();
  }

  ngOnDestroy(): void {
    // 1. Disconnect observers
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
    if (this.tableObserver) this.tableObserver.disconnect();
    if (this.sectionTitleObserver) this.sectionTitleObserver.disconnect();

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

  // Intersection Observer for animations
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.intersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      // Observe all elements with data-animate attribute
      const animateElements = this.elementRef.nativeElement.querySelectorAll('[data-animate]');
      animateElements.forEach((el: Element) => {
        this.intersectionObserver?.observe(el);
      });
    } catch (e) {
      console.warn('Error initializing intersection observer:', e);
    }
  }

  // Add typing animation effect to page title
  private initTypingAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const pageTitle = this.elementRef.nativeElement.querySelector('.page-title');
    if (pageTitle) {
      const titleText = pageTitle.textContent || '';
      pageTitle.textContent = '';
      
      let i = 0;
      const typeWriter = () => {
        if (i < titleText.length) {
          pageTitle.textContent += titleText.charAt(i);
          i++;
          setTimeout(typeWriter, 60);
        }
      };

      // Start typing animation after load
      setTimeout(typeWriter, 1200);
    }
  }

  // Add hover effects to content cards
  private initContentCardHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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
  }

  // Add hover effects to table rows
  private initTableHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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

  // Add click animation to list items
  private initTermsListClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const termsListItems = this.elementRef.nativeElement.querySelectorAll('.terms-list li');
    
    termsListItems.forEach((li: HTMLElement) => {
      const click = this.renderer.listen(li, 'click', () => {
        li.style.transform = 'translateX(15px) scale(1.02)';
        setTimeout(() => {
          li.style.transform = 'translateX(10px)';
        }, 150);
      });
      this.clickListeners.push(click);
    });
  }

  // Initialize table animations
  private initTableAnimations(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      this.tableObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.2 });

      const tables = this.elementRef.nativeElement.querySelectorAll('.table-container');
      tables.forEach((table: HTMLElement) => {
        table.style.opacity = '0';
        table.style.transform = 'translateY(30px)';
        table.style.transition = 'all 0.8s ease';
        this.tableObserver?.observe(table);
      });
    } catch (e) {
      console.warn('Error initializing table animations:', e);
    }
  }

  // Add bounce effect to section titles
  private initSectionTitleAnimations(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      this.sectionTitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Using a generic timeout since we can't reliably pass index here without closure
            setTimeout(() => {
              (entry.target as HTMLElement).style.animation = 'slideInUp 0.8s ease-out';
            }, 100);
          }
        });
      }, { threshold: 0.5 });
      
      const sectionTitles = this.elementRef.nativeElement.querySelectorAll('.section-title');
      sectionTitles.forEach((title: HTMLElement) => {
        this.sectionTitleObserver?.observe(title);
      });
    } catch (e) {
      console.warn('Error initializing section title animations:', e);
    }
  }

  // Stagger animation for content cards
  private initStaggerAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const contentCards = this.elementRef.nativeElement.querySelectorAll('.content-card');
    contentCards.forEach((card: HTMLElement, index: number) => {
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
}