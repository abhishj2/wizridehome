import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
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
  
  private scrollListener: (() => void) | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

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
    });
  }    

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Initialize all interactive features
    this.initIntersectionObserver();
    this.initSmoothScrolling();
    this.initTableHoverEffects();
    this.initImportantPointsClick();
    this.initTableShimmerEffect();
    this.initSectionTitleAnimations();

    // Enable smooth scrolling behavior
    this.document.documentElement.style.scrollBehavior = 'smooth';
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Clean up event listeners
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }

    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // Intersection Observer for animations
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const IO = (globalThis as any).IntersectionObserver;
      
      if (!IO) {
        return;
      }
      
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.intersectionObserver = new IO((entries: IntersectionObserverEntry[]) => {
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
      console.warn('Error initializing intersection observer (likely SSR):', e);
    }
  }

  // Smooth scrolling for anchor links
  private initSmoothScrolling(): void {
    const anchors = this.elementRef.nativeElement.querySelectorAll('a[href^="#"]');
    
    anchors.forEach((anchor: HTMLAnchorElement) => {
      this.renderer.listen(anchor, 'click', (e: Event) => {
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
    });
  }


  // Add hover effects to table rows
  private initTableHoverEffects(): void {
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

  // Add click animation to important points
  private initImportantPointsClick(): void {
    const importantPoints = this.elementRef.nativeElement.querySelectorAll('.important-points li');
    
    importantPoints.forEach((li: HTMLElement) => {
      this.renderer.listen(li, 'click', () => {
        li.style.transform = 'translateX(15px) scale(1.02)';
        setTimeout(() => {
          li.style.transform = 'translateX(10px)';
        }, 150);
      });
    });
  }

  // Add shimmer effect to tables
  private initTableShimmerEffect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const IntersectionObserverClass = typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null;
      if (!IntersectionObserverClass) return;
      
      const tables = this.elementRef.nativeElement.querySelectorAll('.table-container');
      
      const tableObserver = new IntersectionObserverClass((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.2 });

      tables.forEach((table: HTMLElement, index: number) => {
        table.style.opacity = '0';
        table.style.transform = 'translateY(30px)';
        table.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
          tableObserver.observe(table);
        }, index * 200);
      });
    } catch (e) {
      console.warn('Error initializing table shimmer effect (likely SSR):', e);
    }
  }

  // Add bounce effect to section titles
  private initSectionTitleAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const IntersectionObserverClass = typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null;
      if (!IntersectionObserverClass) return;
      
      const sectionTitles = this.elementRef.nativeElement.querySelectorAll('.section-title');
      
      sectionTitles.forEach((title: HTMLElement, index: number) => {
        const titleObserver = new IntersectionObserverClass((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                (entry.target as HTMLElement).style.animation = 'slideInUp 0.8s ease-out';
              }, index * 100);
            }
          });
        }, { threshold: 0.5 });
        
        titleObserver.observe(title);
      });
    } catch (e) {
      console.warn('Error initializing section title animations (likely SSR):', e);
    }
  }

}
