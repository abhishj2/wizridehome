import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-packageddelivery',
  standalone: true,
  imports: [],
  templateUrl: './packageddelivery.component.html',
  styleUrl: './packageddelivery.component.css'
})
export class PackageddeliveryComponent implements OnInit, AfterViewInit {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/packagedelivery');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Package Delivery Service - Wizzride's Reliable Transport Across NE");
    this.metaService.updateTag({
      name: 'description',
      content: "Wizzride's package delivery services cover Gangtok, Darjeeling, Siliguri, Shillong, and more. Enjoy fast, secure transport for goods with our professional services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Package Delivery Service - Wizzride's Reliable Transport Across NE"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Package Delivery Service - Wizzride's Reliable Transport Across NE" });
    this.metaService.updateTag({ property: 'og:description', content: "Wizzride's package delivery services cover Gangtok, Darjeeling, Siliguri, Shillong, and more. Enjoy fast, secure transport for goods with our professional services." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/packagedelivery' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/packaged.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Package Delivery Service - Wizzride's Reliable Transport Across NE" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Wizzride's package delivery services cover Gangtok, Darjeeling, Siliguri, Shillong, and more. Enjoy fast, secure transport for goods with our professional services." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/packaged.jpg' });
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
          "name": "Package Delivery",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/packagedelivery"
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
    if (!isPlatformBrowser(this.platformId)) return;
    // Initialize all interactive features
    this.initIntersectionObserver();
    this.initStaggeredAnimations();
    this.initSmoothScrolling();
    this.initContactLinkHoverEffects();
    this.initFeatureCardClickEffects();
    this.initContactInfoBounce();
    this.addBounceKeyframes();
  }

  // Intersection Observer for scroll animations
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const IO = (globalThis as any).IntersectionObserver;
    if (!IO) return;
    
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IO((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      // Observe all elements with data-animate attribute
      const animateElements = this.elementRef.nativeElement.querySelectorAll('[data-animate]');
      animateElements.forEach((el: Element) => {
        observer.observe(el);
      });
    } catch (e) {
      console.warn('Error initializing intersection observer (likely SSR):', e);
    }
  }

  // Stagger animation for feature cards
  private initStaggeredAnimations(): void {
    const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');
    featureCards.forEach((card: HTMLElement, index: number) => {
      this.renderer.setStyle(card, 'transition-delay', `${index * 0.2}s`);
    });
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

  // Hover effects for contact links
  private initContactLinkHoverEffects(): void {
    const contactLinks = this.elementRef.nativeElement.querySelectorAll('.contact-link');
    
    contactLinks.forEach((link: HTMLElement) => {
      this.renderer.listen(link, 'mouseenter', () => {
        this.renderer.setStyle(link, 'transform', 'translateY(-3px) scale(1.02)');
      });
      
      this.renderer.listen(link, 'mouseleave', () => {
        this.renderer.setStyle(link, 'transform', 'translateY(-3px) scale(1)');
      });
    });
  }

  // Click animation for feature cards
  private initFeatureCardClickEffects(): void {
    const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');
    
    featureCards.forEach((card: HTMLElement) => {
      this.renderer.listen(card, 'click', () => {
        this.renderer.setStyle(card, 'transform', 'scale(0.98)');
        setTimeout(() => {
          this.renderer.setStyle(card, 'transform', '');
        }, 150);
      });
    });
  }

  // Bounce effect for contact info on scroll
  private initContactInfoBounce(): void {
    const contactInfo = this.elementRef.nativeElement.querySelector('.contact-info');
    let hasAnimated = false;

    if (contactInfo) {
      const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            this.renderer.setStyle(entry.target, 'animation', 'bounce 0.6s ease-out');
            hasAnimated = true;
          }
        });
      }, { threshold: 0.5 });

      contactObserver.observe(contactInfo);
    }
  }

  // Add bounce keyframes dynamically
  private addBounceKeyframes(): void {
    const style = this.renderer.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    this.renderer.appendChild(this.document.head, style);
  }

}
