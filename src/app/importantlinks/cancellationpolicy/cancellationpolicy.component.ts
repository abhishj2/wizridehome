import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, OnDestroy, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cancellationpolicy',
  standalone: true,
  imports: [],
  templateUrl: './cancellationpolicy.component.html',
  styleUrl: './cancellationpolicy.component.css'
})
export class CancellationpolicyComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Track listeners and observers for cleanup
  private removeScrollListener: (() => void) | null = null;
  private clickListeners: (() => void)[] = [];
  private observers: IntersectionObserver[] = [];
  
  // Schema IDs
  private readonly schemaIds = ['cancellation-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/cancellationpolicy/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Cancellation Policy | WizzRide – Hassle-Free Taxi Cancellations");
    this.metaService.updateTag({
      name: 'description',
      content: "WizzRide Cancellation Policy."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Cancellation Policy | WizzRide – Hassle-Free Taxi Cancellations"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Cancellation Policy | WizzRide – Hassle-Free Taxi Cancellations" });
    this.metaService.updateTag({ property: 'og:description', content: "WizzRide Cancellation Policy." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancellationpolicy/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Cancellation Policy | WizzRide – Hassle-Free Taxi Cancellations" });
    this.metaService.updateTag({ name: 'twitter:description', content: "WizzRide Cancellation Policy." });
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
        }
      ]
    }, 'cancellation-breadcrumb');
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
    this.initSmoothScrolling();
    this.initTableHoverEffects();
    this.initImportantPointsClick();
    this.initTableShimmerEffect();
    this.initSectionTitleAnimations();

    // Enable smooth scrolling behavior safely
    if (this.document.documentElement) {
      this.document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  ngOnDestroy(): void {
    // 1. Clean up event listeners
    if (this.removeScrollListener) {
      this.removeScrollListener();
    }
    this.clickListeners.forEach(cleanup => cleanup());
    this.clickListeners = [];

    // 2. Disconnect intersection observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // 3. Clean up Schema Scripts (Browser only)
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

      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      // Track for cleanup
      this.observers.push(observer);

      // Observe all elements with data-animate attribute
      const animateElements = this.elementRef.nativeElement.querySelectorAll('[data-animate]');
      animateElements.forEach((el: Element) => {
        observer.observe(el);
      });
    } catch (e) {
      console.warn('Error initializing intersection observer:', e);
    }
  }

  // Smooth scrolling for anchor links
  private initSmoothScrolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const anchors = this.elementRef.nativeElement.querySelectorAll('a[href^="#"]');
    
    anchors.forEach((anchor: HTMLAnchorElement) => {
      const listener = this.renderer.listen(anchor, 'click', (e: Event) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId) {
          const target = this.document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
      this.clickListeners.push(listener);
    });
  }

  // Add hover effects to table rows
  private initTableHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tableRows = this.elementRef.nativeElement.querySelectorAll('tbody tr');
    
    tableRows.forEach((row: HTMLElement) => {
      const enterListener = this.renderer.listen(row, 'mouseenter', () => {
        row.style.boxShadow = '0 5px 15px rgba(29, 170, 186, 0.2)';
      });
      const leaveListener = this.renderer.listen(row, 'mouseleave', () => {
        row.style.boxShadow = 'none';
      });
      
      this.clickListeners.push(enterListener, leaveListener);
    });
  }

  // Add click animation to important points
  private initImportantPointsClick(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const importantPoints = this.elementRef.nativeElement.querySelectorAll('.important-points li');
    
    importantPoints.forEach((li: HTMLElement) => {
      const listener = this.renderer.listen(li, 'click', () => {
        li.style.transform = 'translateX(15px) scale(1.02)';
        setTimeout(() => {
          li.style.transform = 'translateX(10px)';
        }, 150);
      });
      this.clickListeners.push(listener);
    });
  }

  // Add shimmer effect to tables
  private initTableShimmerEffect(): void {
    // CRITICAL: Strict check for Browser and API
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const tables = this.elementRef.nativeElement.querySelectorAll('.table-container');
      if (tables.length === 0) return;
      
      const tableObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.2 });

      this.observers.push(tableObserver);

      tables.forEach((table: HTMLElement, index: number) => {
        table.style.opacity = '0';
        table.style.transform = 'translateY(30px)';
        table.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
          tableObserver.observe(table);
        }, index * 200);
      });
    } catch (e) {
      // Ignore
    }
  }

  // Add bounce effect to section titles
  private initSectionTitleAnimations(): void {
    // CRITICAL: Strict check for Browser and API
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const sectionTitles = this.elementRef.nativeElement.querySelectorAll('.section-title');
      if (sectionTitles.length === 0) return;
      
      const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Use setTimeout to create staggered effect if needed, otherwise distinct observer per element logic
            // Note: In a loop like this, `index` isn't available inside the callback unless captured. 
            // We animate immediately here or use a class.
            (entry.target as HTMLElement).style.animation = 'slideInUp 0.8s ease-out';
          }
        });
      }, { threshold: 0.5 });

      this.observers.push(titleObserver);
      
      sectionTitles.forEach((title: HTMLElement) => {
        titleObserver.observe(title);
      });
    } catch (e) {
      // Ignore
    }
  }
}