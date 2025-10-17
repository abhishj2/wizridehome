import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-corporatepackages',
  standalone: true,
  imports: [],
  templateUrl: './corporatepackages.component.html',
  styleUrl: './corporatepackages.component.css'
})
export class CorporatepackagesComponent implements OnInit, AfterViewInit {
  
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
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/corporatepackages/');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Corporate Travel Services - Wizzride Business Taxi & Tours");
    this.metaService.updateTag({
      name: 'description',
      content: "Wizzride offers corporate travel management, taxi hire, and tailored packages for MICE events. Experience seamless business tours with our corporate cabs and services."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Corporate Travel Services - Wizzride Business Taxi & Tours"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Corporate Travel Services - Wizzride Business Taxi & Tours' });
    this.metaService.updateTag({ property: 'og:description', content: 'Wizzride offers corporate travel management, taxi hire, and tailored packages for MICE events. Experience seamless business tours with our corporate cabs and services.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/corporatepackages/' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Corporate Travel Services - Wizzride Business Taxi & Tours' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Wizzride offers corporate travel management, taxi hire, and tailored packages for MICE events. Experience seamless business tours with our corporate cabs and services.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
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
          "name": "Corporate Packages",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/corporatepackages"
          }
        }
      ]
    });

    // ✅ Organization JSON-LD (for branding)
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": [
        "Organization",
        "LocalBusiness",
        "TravelAgency"
      ],
      "name": "Wizzride Technologies Pvt Ltd",
      "alternateName": "Wizzride",
      "url": "https://www.wizzride.com",
      "logo": "https://www.wizzride.com/assets/images/icons/logo2.webp",
      "description": "Book Wizzride online cab services for Bagdogra to Darjeeling, Gangtok, Kalimpong, NJP, Guwahati & Shillong. Safe, affordable rides in Northeast.",
      "foundingDate": "2017",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917478493874",
        "contactType": "reservations",
        "areaServed": "IN",
        "availableLanguage": [
          "en",
          "Hindi"
        ]
      },
      "sameAs": [
        "https://www.facebook.com/wizzride",
        "https://www.instagram.com/wizzride",
        "https://www.linkedin.com/company/in/wizzride-technologies-private-limited-33b0871a0/",
        "https://twitter.com/wizzride"
      ],
      "openingHours": "Mo-Su 04:00-21:00",
      "areaServed": [
        "Assam",
        "Meghalaya",
        "Sikkim",
        "West Bengal"
      ],
      "paymentAccepted": [
        "Cash",
        "Credit Card",
        "UPI"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.7",
        "reviewCount": "2411"
      }
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
    this.initFormSubmission();
    this.initLoadAnimations();
    this.initFocusAnimations();
    this.initStaggeredAnimations();
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

    // Observe all target elements
    const elements = this.elementRef.nativeElement.querySelectorAll('.feature-card, .content-card, .partner-logo, .enquiry-section');
    elements.forEach((el: HTMLElement) => {
      this.renderer.setStyle(el, 'opacity', '0');
      this.renderer.setStyle(el, 'transform', 'translateY(30px)');
      this.renderer.setStyle(el, 'transition', 'opacity 0.8s ease, transform 0.8s ease');
      observer.observe(el);
    });
  }

  // Staggered animations for specific elements
  private initStaggeredAnimations(): void {
    // Stagger feature cards
    const featureCards = this.elementRef.nativeElement.querySelectorAll('.feature-card');
    featureCards.forEach((card: HTMLElement, index: number) => {
      this.renderer.setStyle(card, 'transition-delay', `${index * 0.2}s`);
    });

    // Stagger partner logos
    const partnerLogos = this.elementRef.nativeElement.querySelectorAll('.partner-logo');
    partnerLogos.forEach((logo: HTMLElement, index: number) => {
      this.renderer.setStyle(logo, 'transition-delay', `${index * 0.1}s`);
    });
  }

  // Form submission handling
  private initFormSubmission(): void {
    const form = this.elementRef.nativeElement.querySelector('#enquiryForm') as HTMLFormElement;
    
    if (form) {
      this.renderer.listen(form, 'submit', (e: Event) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const formDataObject: { [key: string]: any } = {};
        
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        
        // Log to console
        console.log('=== Corporate Enquiry Form Submission ===');
        console.log('Form Data:', formDataObject);
        console.log('Timestamp:', new Date().toLocaleString());
        console.log('=======================================');
        
        // Create readable alert message
        let alertMessage = 'Corporate Enquiry Submitted!\n\n';
        for (const [key, value] of Object.entries(formDataObject)) {
          if (value) {
            alertMessage += `${key}: ${value}\n`;
          }
        }
        alertMessage += '\nThank you for your enquiry! Our team will contact you soon.';
        
        // Show alert with form data
        alert(alertMessage);
        
        // Reset form
        form.reset();
      });
    }
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

  // Focus animations for form inputs
  private initFocusAnimations(): void {
    const inputs = this.elementRef.nativeElement.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    inputs.forEach((input: HTMLElement) => {
      this.renderer.listen(input, 'focus', () => {
        if (input.parentElement) {
          this.renderer.setStyle(input.parentElement, 'transform', 'translateY(-2px)');
          this.renderer.setStyle(input.parentElement, 'transition', 'transform 0.3s ease');
        }
      });
      
      this.renderer.listen(input, 'blur', () => {
        if (input.parentElement) {
          this.renderer.setStyle(input.parentElement, 'transform', 'translateY(0)');
        }
      });
    });
  }

}
