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
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObject);
      this.renderer.appendChild(this.document.head, script);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize intersection observer for fade-scroll animations
      this.initIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // Intersection Observer for fade-scroll animations
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const IO = (globalThis as any).IntersectionObserver;
      if (!IO) return;
      
      const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-scroll');

      this.intersectionObserver = new IO((entries: IntersectionObserverEntry[], obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      fadeElements.forEach((el: Element) => this.intersectionObserver?.observe(el));
    } catch (e) {
      console.warn('Error initializing intersection observer (likely SSR):', e);
    }
  }
}
