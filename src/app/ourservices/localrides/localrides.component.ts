import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-localrides',
  standalone: true,
  imports: [],
  templateUrl: './localrides.component.html',
  styleUrl: './localrides.component.css'
})
export class LocalridesComponent implements OnInit, AfterViewInit {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/localrides/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Local Shared Cab Services - Wizzride's Reliable Rides Across Destinations");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore Wizzride's local shared cab services for Siliguri, Gangtok, Darjeeling, Shillong, Bagdogra Airport and Guwahati Airport."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Local Shared Cab Services - Wizzride's Reliable Rides Across Destinations"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Local Shared Cab Services - Wizzride's Reliable Rides Across Destinations" });
    this.metaService.updateTag({ property: 'og:description', content: "Explore Wizzride's local shared cab services for Siliguri, Gangtok, Darjeeling, Shillong, Bagdogra Airport and Guwahati Airport." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/localrides/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Local Shared Cab Services - Wizzride's Reliable Rides Across Destinations" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore Wizzride's local shared cab services for Siliguri, Gangtok, Darjeeling, Shillong, Bagdogra Airport and Guwahati Airport." });
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
          "name": "Our Services",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Local Rides",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/localrides"
          }
        }
      ]
    });

  this.addJsonLd({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Wizzride",
  "url": "https://wizzride.com",
  "logo": "https://wizzride.com/wp-content/uploads/2023/06/wizzride-logo.png",
  "description": "Wizzride offers comfortable and reliable cab and flight booking services across India. Book shared or reserved cabs, flights, and more with ease through our platform.",
  "foundingDate": "2015",
  "founders": [
    {
      "@type": "Person",
      "name": "Wizzride Founders"
    }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-9775999444",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  ],
  "sameAs": [
    "https://www.facebook.com/wizzride",
    "https://twitter.com/wizzride",
    "https://www.instagram.com/wizzride",
    "https://www.linkedin.com/company/wizzride"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Gangtok, Sikkim",
    "addressLocality": "Gangtok",
    "addressRegion": "Sikkim",
    "postalCode": "737101",
    "addressCountry": "IN"
  },
  "department": [
    {
      "@type": "Organization",
      "name": "Wizzride Cab Booking",
      "url": "https://wizzride.com/cab-booking/",
      "description": "Book intercity and local cabs with flexible shared or reserved options."
    },
    {
      "@type": "Organization",
      "name": "Wizzride Flight Booking",
      "url": "https://wizzride.com/flights/",
      "description": "Compare and book domestic and international flights easily."
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
    this.initSmoothScrolling();
    this.initIntersectionObserver();
    this.initStaggeredAnimations();
    this.initCTAButtons();
    this.initTableRowHoverEffects();
    this.initLoadAnimations();
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

  // Intersection Observer for scroll animations
  private initIntersectionObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setStyle(entry.target, 'opacity', '1');
          this.renderer.setStyle(entry.target, 'transform', 'translateY(0)');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elements = this.elementRef.nativeElement.querySelectorAll(
      '.feature-card, .step-item, .content-card'
    );
    
    elements.forEach((el: HTMLElement) => {
      this.renderer.setStyle(el, 'opacity', '0');
      this.renderer.setStyle(el, 'transform', 'translateY(30px)');
      this.renderer.setStyle(el, 'transition', 'opacity 0.8s ease, transform 0.8s ease');
      observer.observe(el);
    });
  }

  // Staggered animations for feature cards and step items
  private initStaggeredAnimations(): void {
    // Add stagger delay to feature cards
    const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');
    featureCards.forEach((card: HTMLElement, index: number) => {
      this.renderer.setStyle(card, 'transition-delay', `${index * 0.2}s`);
    });

    // Add stagger delay to step items
    const stepItems = this.elementRef.nativeElement.querySelectorAll('.step-item');
    stepItems.forEach((item: HTMLElement, index: number) => {
      this.renderer.setStyle(item, 'transition-delay', `${index * 0.1}s`);
    });
  }

  // CTA buttons click handlers (both .cta-button and .cta-button-hero)
  private initCTAButtons(): void {
    const ctaButtons = this.elementRef.nativeElement.querySelectorAll('.cta-button, .cta-button-hero');
    
    ctaButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', (e: Event) => {
        e.preventDefault();
        console.log('Book ride clicked');
        // Add booking functionality here
      });
    });
  }

  // Hover effects for table rows
  private initTableRowHoverEffects(): void {
    const tableRows = this.elementRef.nativeElement.querySelectorAll('.destinations-table tbody tr');
    
    tableRows.forEach((row: HTMLElement) => {
      this.renderer.listen(row, 'mouseenter', () => {
        this.renderer.setStyle(row, 'transform', 'translateX(5px)');
        this.renderer.setStyle(row, 'transition', 'transform 0.3s ease');
      });
      
      this.renderer.listen(row, 'mouseleave', () => {
        this.renderer.setStyle(row, 'transform', 'translateX(0)');
      });
    });
  }

  // Load animations for section titles and descriptions
  private initLoadAnimations(): void {
    setTimeout(() => {
      const elementsToAnimate = this.elementRef.nativeElement.querySelectorAll('.section-title, .section-desc');
      elementsToAnimate.forEach((element: HTMLElement, index: number) => {
        setTimeout(() => {
          this.renderer.setStyle(element, 'opacity', '1');
          this.renderer.setStyle(element, 'transform', 'translateY(0)');
        }, index * 100);
      });
    }, 0);
  }

}
