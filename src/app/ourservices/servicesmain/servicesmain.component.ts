import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-servicesmain',
  standalone: true,
  imports: [],
  templateUrl: './servicesmain.component.html',
  styleUrl: './servicesmain.component.css'
})
export class ServicesmainComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private intersectionObserver: IntersectionObserver | null = null;
  // Unique IDs to track and clean up injected scripts
  private readonly schemaIds = ['services-faq', 'services-breadcrumb'];

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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Premium Luxury Cab Services- Intercity, Airport & Long Distance");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Wizzride's premium shared cab services, intercity taxi service, airport taxi cab services, local cab services, and corporate travel solutions."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Premium Luxury Cab Services- Intercity, Airport & Long Distance"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Premium Luxury Cab Services- Intercity, Airport & Long Distance" });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Wizzride's premium shared cab services, intercity taxi service, airport taxi cab services, local cab services, and corporate travel solutions." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/icons/our-services-hero.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Premium Luxury Cab Services- Intercity, Airport & Long Distance" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Wizzride's premium shared cab services, intercity taxi service, airport taxi cab services, local cab services, and corporate travel solutions." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/icons/our-services-hero.jpg' });
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
          "name": "Our Services",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices"
          }
        }
      ]
    }, 'services-breadcrumb');
  }

  // ✅ Utility: inject LD+JSON scripts safely
  // UPDATED: Removed isPlatformBrowser check to allow SEO on Server (SSR)
  // UPDATED: Added scriptId to prevent duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    if (!this.document) return;

    // Remove existing script with same ID to prevent duplicates
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
    // Strictly Browser Only - fixes server crash
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Clean up injected Schema scripts
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }

  // Intersection Observer for fade-scroll animations
  private initIntersectionObserver(): void {
    // Safety check: Ensure we are in browser and IntersectionObserver exists
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) {
      return;
    }
    
    try {
      const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-scroll');
      if (fadeElements.length === 0) return;

      this.intersectionObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      fadeElements.forEach((el: Element) => this.intersectionObserver?.observe(el));
    } catch (e) {
      console.warn('Error initializing intersection observer:', e);
    }
  }
}