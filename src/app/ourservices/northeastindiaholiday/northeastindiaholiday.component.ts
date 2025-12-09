import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-northeastindiaholiday',
  standalone: true,
  imports: [],
  templateUrl: './northeastindiaholiday.component.html',
  styleUrl: './northeastindiaholiday.component.css'
})
export class NortheastindiaholidayComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/holidaystours/WizzTour-North-East-India-Holiday-Planner/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Expert Holiday Planner for North East India | Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Plan your dream vacation to North East India with tailored tour packages for Sikkim, Darjeeling, Meghalaya, and Assam. Enjoy seamless and unforgettable travel!"
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Expert Holiday Planner for North East India | Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Expert Holiday Planner for North East India | Wizzride" });
    this.metaService.updateTag({ property: 'og:description', content: "Plan your dream vacation to North East India with tailored tour packages for Sikkim, Darjeeling, Meghalaya, and Assam. Enjoy seamless and unforgettable travel!" });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'hhttps://wizzride.com/ourservices/holidaystours/WizzTour-North-East-India-Holiday-Planner/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/Wizzride-destination-holiday-planner.png' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Expert Holiday Planner for North East India | Wizzride" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Plan your dream vacation to North East India with tailored tour packages for Sikkim, Darjeeling, Meghalaya, and Assam. Enjoy seamless and unforgettable travel!" });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/Wizzride-destination-holiday-planner.png' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

 

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd( {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
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
          "name": "Holiday Tours",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/holidaystours"
          }
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "North East India Holiday Planner",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/holidaystours/WizzTour-North-East-India-Holiday-Planner"
          }
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
    this.initSmoothScrolling();
    this.initFormSubmission();
    this.initParallax();
    this.initCardAnimations();
    this.initBookingSystem();
    this.initLoadingAnimation();
    this.animateOnScroll();

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

  // Intersection Observer for scroll animations with better performance
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const IO = (globalThis as any).IntersectionObserver;
    if (!IO) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -120px 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('animate');
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with fade-up and animate-on-scroll classes
    const animateElements = this.elementRef.nativeElement.querySelectorAll('.fade-up, .animate-on-scroll');
    animateElements.forEach((el: Element) => {
      this.intersectionObserver?.observe(el);
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

  // Form submission handling
  private initFormSubmission(): void {
    const contactForm = this.elementRef.nativeElement.querySelector('.contact-form') as HTMLFormElement;
    
    if (contactForm) {
      this.renderer.listen(contactForm, 'submit', (e: Event) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(contactForm);
        const formDataObject: { [key: string]: any } = {};
        
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        
        // Log to console
        console.log('=== Holiday Tour Enquiry Form Submission ===');
        console.log('Form Data:', formDataObject);
        console.log('Timestamp:', new Date().toLocaleString());
        console.log('==========================================');
        
        // Create readable alert message
        let alertMessage = 'Holiday Tour Enquiry Submitted!\n\n';
        for (const [key, value] of Object.entries(formDataObject)) {
          if (value) {
            alertMessage += `${key}: ${value}\n`;
          }
        }
        alertMessage += '\nThank you for your enquiry! We will get back to you soon.';
        
        // Show alert with form data
        alert(alertMessage);
        
        // Reset form
        contactForm.reset();
      });
    }
  }

  // Smooth fade-in animation on scroll
  private animateOnScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    const elements = this.elementRef.nativeElement.querySelectorAll('.fade-up');
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 100;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('visible');
      }
    });
  }

  // Host listener for scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.animateOnScroll();
  }

  // Parallax effect for floating shapes
  private initParallax(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const shapes = this.elementRef.nativeElement.querySelectorAll('.shape');

    this.scrollListener = () => {
      if (typeof window === 'undefined') return;
      const scrolled = window.pageYOffset;

      shapes.forEach((shape: HTMLElement, index: number) => {
        const rate = scrolled * (-0.3 - index * 0.1);
        shape.style.transform = `translateY(${rate}px)`;
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.scrollListener);
    }
  }

  // Enhanced card interactions
  private initCardAnimations(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.package-card, .destination-card, .glass-card');

    cards.forEach((card: HTMLElement) => {
      this.renderer.listen(card, 'mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
      });

      this.renderer.listen(card, 'mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Book Now functionality with modern modal
  private initBookingSystem(): void {
    const bookButtons = this.elementRef.nativeElement.querySelectorAll('.hero-cta, .cta-button');

    bookButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', (e: Event) => {
        e.preventDefault();
        this.showBookingModal();
      });
    });
  }

  // Show booking modal
  private showBookingModal(): void {
    const modal = this.renderer.createElement('div');
    modal.innerHTML = `
      <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          text-align: center;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.2);
      ">
          <div style="
              width: 100px;
              height: 100px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 2rem;
              font-size: 2.5rem;
              color: white;
              box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
          ">
              <i class="fas fa-rocket"></i>
          </div>
          <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: #0f172a; font-weight: 700;">Ready to Start Your Journey?</h3>
          <p style="color: #64748b; margin-bottom: 2rem; line-height: 1.6; font-size: 1.1rem;">
              Contact our travel experts to create your perfect North East India experience. We'll craft a personalized itinerary just for you!
          </p>
          <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 16px;">
              <p style="font-weight: 600; color: #667eea; margin-bottom: 0.5rem; font-size: 1.1rem;">📞 Call us: +91-98765-43210</p>
              <p style="font-weight: 600; color: #667eea; font-size: 1.1rem;">📧 Email: bookings@wizzride.com</p>
          </div>
          <button class="close-modal-btn" style="
              padding: 1rem 2.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 60px;
              font-weight: 700;
              font-size: 1.1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          ">Got it!</button>
      </div>
      <div class="modal-backdrop" style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 9999;
          backdrop-filter: blur(8px);
      "></div>
    `;

    this.renderer.appendChild(this.document.body, modal);

    // Add close listeners
    const closeBtn = modal.querySelector('.close-modal-btn');
    const backdrop = modal.querySelector('.modal-backdrop');

    if (closeBtn) {
      this.renderer.listen(closeBtn, 'click', () => {
        this.renderer.removeChild(this.document.body, modal);
      });
    }

    if (backdrop) {
      this.renderer.listen(backdrop, 'click', () => {
        this.renderer.removeChild(this.document.body, modal);
      });
    }

    // Auto-remove after 12 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        this.renderer.removeChild(this.document.body, modal);
      }
    }, 12000);
  }

  // Loading animation stagger
  private initLoadingAnimation(): void {
    const elements = this.elementRef.nativeElement.querySelectorAll('.fade-up');
    elements.forEach((element: HTMLElement, index: number) => {
      element.style.transitionDelay = `${index * 0}s`;
    });
  }

}
