import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-intercityrides',
  standalone: true,
  imports: [],
  templateUrl: './intercityrides.component.html',
  styleUrl: './intercityrides.component.css'
})
export class IntercityridesComponent implements OnInit, AfterViewInit {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/intercityrides/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Intercity Shared Cabs | Comfortable & Reliable Travel");
    this.metaService.updateTag({
      name: 'description',
      content: "Book Wizzride intercity shared cabs for safe, on-time, and affordable travel. Enjoy luxury rides with AC comfort and hassle-free booking across major routes."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Intercity Shared Cabs | Comfortable & Reliable Travel"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Intercity Shared Cabs | Comfortable & Reliable Travel' });
    this.metaService.updateTag({ property: 'og:description', content: 'Book Wizzride intercity shared cabs for safe, on-time, and affordable travel. Enjoy luxury rides with AC comfort and hassle-free booking across major routes.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/intercityrides/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/intercitybanner.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Intercity Shared Cabs | Comfortable & Reliable Travel' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Book Wizzride intercity shared cabs for safe, on-time, and affordable travel. Enjoy luxury rides with AC comfort and hassle-free booking across major routes.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/intercitybanner.jpeg' });
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
          "name": "Intercity Rides",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/intercityrides"
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
    this.initCTAButton();
    this.initTableRowHoverEffects();
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
      '.feature-card, .step-item, .routes-section, .journey-section'
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

  // CTA button click handler
  private initCTAButton(): void {
    const ctaButton = this.elementRef.nativeElement.querySelector('.cta-button');
    
    if (ctaButton) {
      this.renderer.listen(ctaButton, 'click', (e: Event) => {
        console.log('Book ride clicked');
        // Add booking functionality here
      });
    }
  }

  // Hover effects for table rows
  private initTableRowHoverEffects(): void {
    const tableRows = this.elementRef.nativeElement.querySelectorAll('.routes-table tbody tr');
    
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

}
