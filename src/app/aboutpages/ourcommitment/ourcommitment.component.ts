import { Component, AfterViewInit, Renderer2, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-ourcommitment',
  standalone: true,
  imports: [],
  templateUrl: './ourcommitment.component.html',
  styleUrl: './ourcommitment.component.css'
})
export class OurcommitmentComponent implements OnInit, AfterViewInit, OnDestroy {

  // IDs to track scripts for cleanup
  private readonly schemaIds = ['commitment-breadcrumb', 'commitment-org'];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/aboutcompany/ourcommittment');

    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride's Commitment to Excellence - Luxury Shared Cab Service");
    this.metaService.updateTag({
      name: 'description',
      content: "Experience Wizzride's unwavering commitment to delivering luxury shared cab services. Our promise focuses on comfort, safety, and exceptional travel experiences."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride's Commitment to Excellence - Luxury Shared Cab Service"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Wizzride's Commitment to Excellence - Luxury Shared Cab Service" });
    this.metaService.updateTag({ property: 'og:description', content: "Experience Wizzride's unwavering commitment to delivering luxury shared cab services. Our promise focuses on comfort, safety, and exceptional travel experiences." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/aboutcompany/ourcommittment' });
    this.metaService.updateTag({ property: 'og:image', content: 'assets/images/aboutimages/commitment.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({
      name: 'twitter:title', content: "Wizzride's Commitment to Excellence - Luxury Shared Cab Service"
    });
    this.metaService.updateTag({ name: 'twitter:description', content: "Experience Wizzride's unwavering commitment to delivering luxury shared cab services. Our promise focuses on comfort, safety, and exceptional travel experiences." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'assets/images/aboutimages/commitment.jpg' });
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
          "name": "About Company",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/aboutcompany"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Our Vision",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/aboutcompany/ourcommittment"
          }
        }
      ]
    }, 'commitment-breadcrumb'); // Pass Unique ID

    // ✅ Organization JSON-LD (for branding)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Wizzride",
      "url": "https://wizzride.com",
      "logo": "https://wizzride.com/wp-content/uploads/2023/06/wizzride-logo.png",
      "description": "Wizzride offers comfortable and reliable cab and flight booking services across India. Book shared or reserved cabs, flights, and more with ease through our platform.",
      "foundingDate": "2015",
      "founders": [{ "@type": "Person", "name": "Wizzride Founders" }],
      "contactPoint": [{ "@type": "ContactPoint", "telephone": "+91-9775999444", "contactType": "customer service", "areaServed": "IN", "availableLanguage": ["English", "Hindi"] }],
      "sameAs": ["https://www.facebook.com/wizzride", "https://twitter.com/wizzride", "https://www.instagram.com/wizzride", "https://www.linkedin.com/company/wizzride"],
      "address": { "@type": "PostalAddress", "streetAddress": "Gangtok, Sikkim", "addressLocality": "Gangtok", "addressRegion": "Sikkim", "postalCode": "737101", "addressCountry": "IN" },
      "department": [{ "@type": "Organization", "name": "Wizzride Cab Booking", "url": "https://wizzride.com/cab-booking/", "description": "Book intercity and local cabs with flexible shared or reserved options." }, { "@type": "Organization", "name": "Wizzride Flight Booking", "url": "https://wizzride.com/flights/", "description": "Compare and book domestic and international flights easily." }]
    }, 'commitment-org'); // Pass Unique ID
  }

  // ✅ Utility: inject LD+JSON scripts
  // Updated to allow SSR (SEO Friendly) and prevent duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    // 1. Safety check for document
    if (!this.document) return;

    // 2. Remove existing script with same ID to prevent duplicates on navigation
    const existingScript = this.document.getElementById(scriptId);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    // 3. Create and append new script
    const script = this.renderer.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngOnDestroy(): void {
    // Cleanup JSON-LD scripts when component is destroyed
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    // 1. CRITICAL: Stop Execution on Server
    if (!isPlatformBrowser(this.platformId)) return;

    // 2. Check if IntersectionObserver is supported in the browser
    if ('IntersectionObserver' in window) {
      try {
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              // Optional: Stop observing once animated
              // observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        const elements = this.document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
          observer.observe(el);
        });
      } catch (e) {
        console.warn('Animation observer failed:', e);
      }
    }

    // 3. Staggered animation delays
    const applyStaggeredDelay = (selector: string) => {
      const elements = this.document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        (element as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      });
    };

    applyStaggeredDelay('.value-card');
    applyStaggeredDelay('.timeline-item');
  }
}