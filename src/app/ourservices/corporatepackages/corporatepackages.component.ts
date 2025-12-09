import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';

interface CorporateEnquiryFormData {
  fullName: string;
  email: string;
  contact: string;
  message: string;
}

@Component({
  selector: 'app-corporatepackages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './corporatepackages.component.html',
  styleUrl: './corporatepackages.component.css'
})
export class CorporatepackagesComponent implements OnInit, AfterViewInit {
  
  formData: CorporateEnquiryFormData = {
    fullName: '',
    email: '',
    contact: '',
    message: ''
  };

  // Captcha
  captchaData: CaptchaData = { question: '', answer: 0 };
  userCaptchaAnswer: string = '';

  // Form state
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) {}
  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/corporatheader.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Corporate Travel Services - Wizzride Business Taxi & Tours' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Wizzride offers corporate travel management, taxi hire, and tailored packages for MICE events. Experience seamless business tours with our corporate cabs and services.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/corporatheader.jpeg' });
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
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof IntersectionObserver === 'undefined') return;
    
    try {
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
    } catch (e) {
      // Silently handle SSR errors
      console.warn('Error initializing intersection observer (likely SSR):', e);
    }
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
  onSubmit(): void {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Validate captcha first
    if (!this.captchaService.validateCaptcha(this.userCaptchaAnswer, this.captchaData.answer)) {
      this.errorMessage = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswer = '';
      this.captchaData = this.captchaService.generateCaptcha();
      return;
    }

    // Validate form data
    if (!this.formData.fullName || !this.formData.email || !this.formData.contact) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    const submissionData = {
      title: `Corporate Package Enquiry - ${this.formData.fullName}`,
      content: this.formData.message || 'No message provided',
      status: 'publish',
      acf: {
        full_name: this.formData.fullName,
        email: this.formData.email,
        contact_number: this.formData.contact,
        message: this.formData.message || '',
        enquiry_date: new Date().toISOString()
      }
    };

    console.log('Submitting corporate enquiry:', submissionData);

    this.http.post('https://cms.wizztest.com/wp-json/wp/v2/corporate_enquiries', submissionData)
      .subscribe({
        next: (response) => {
          console.log('Corporate enquiry submitted successfully:', response);
          this.isSubmitting = false;
          this.successMessage = 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.';
          
          // Reset form
          this.formData = {
            fullName: '',
            email: '',
            contact: '',
            message: ''
          };
          this.userCaptchaAnswer = '';
          
          // Generate new captcha
          this.captchaData = this.captchaService.generateCaptcha();

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting corporate enquiry:', error);
          this.isSubmitting = false;
          this.errorMessage = 'There was an error submitting your enquiry. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
  }

  // Form submission handling (kept for backward compatibility but not used)
  private initFormSubmission(): void {
    // This method is kept for backward compatibility but onSubmit() is now used
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
