import { Component, AfterViewInit, Renderer2, OnInit, Inject, ViewChild, ElementRef, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../services/captcha.service';

interface ContactFormData {
  fullName: string;
  mobileNumber: string;
  emailId: string;
  message: string;
}

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contactForm') contactFormElement?: ElementRef<HTMLFormElement>;
  
  formData: ContactFormData = {
    fullName: '',
    mobileNumber: '',
    emailId: '',
    message: ''
  };

  // Captcha
  captchaData: CaptchaData = { question: '', answer: 0 };
  userCaptchaAnswer: string = '';

  // Form state
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // Track observers and listeners for cleanup
  private observers: IntersectionObserver[] = [];
  private eventCleanups: (() => void)[] = [];

  // Schema ID
  private readonly schemaIds = ['contact-breadcrumb', 'contact-org'];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) {}

  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/contactus');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Contact Us | WizzRide – Taxi Services in Sikkim, Darjeeling");
    this.metaService.updateTag({
      name: 'description',
      content: "Get in touch with WizzRide for taxi bookings in Sikkim, Darjeeling, Guwahati, and Shillong. For cancellations or inquiries, contact us at our service number."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Contact Us | WizzRide – Taxi Services in Sikkim, Darjeeling"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Contact Us | WizzRide – Taxi Services in Sikkim, Darjeeling' });
    this.metaService.updateTag({ property: 'og:description', content: 'Get in touch with WizzRide for taxi bookings in Sikkim, Darjeeling, Guwahati, and Shillong. For cancellations or inquiries, contact us at our service number.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/contactus' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/contactmain.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Contact Us | WizzRide – Taxi Services in Sikkim, Darjeeling' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Get in touch with WizzRide for taxi bookings in Sikkim, Darjeeling, Guwahati, and Shillong. For cancellations or inquiries, contact us at our service number.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/contactmain.jpg' });
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
          "name": "Contact Us",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/contactus"
          }
        }
      ]
    }, 'contact-breadcrumb');

    // ✅ Organization JSON-LD (for branding)
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
    }, 'contact-org');
  }    

  // ✅ Utility: inject LD+JSON scripts safely
  // Updated: Runs on server (good for SEO) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    if (!this.document) return;

    // Remove existing script if it exists
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
    // 1. CRITICAL: Stop Execution on Server
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize all animations and interactions
    this.initializeIntersectionObserver();
    this.initializePageTitleAnimation();
    this.initializeContactCardAnimations();
    this.initializeFormInputAnimations();
    this.initializeContactCardClickAnimations();
    this.initializeStaggeredContactCards();
  }

  ngOnDestroy(): void {
    // 1. Disconnect observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // 2. Remove listeners
    this.eventCleanups.forEach(cleanup => cleanup());
    this.eventCleanups = [];

    // 3. Remove Schema Scripts (Browser only)
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }

  /**
   * Handle form submission
   */
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
    if (!this.formData.fullName || !this.formData.mobileNumber || !this.formData.emailId || !this.formData.message) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    const submissionData = {
      title: `Contact Form Submission - ${this.formData.fullName}`,
      content: this.formData.message,
      status: 'publish',
      acf: {
        full_name: this.formData.fullName,
        mobile_number: this.formData.mobileNumber,
        email_id: this.formData.emailId,
        message: this.formData.message,
        submission_date: new Date().toISOString()
      }
    };

    console.log('Submitting contact form:', submissionData);

    this.http.post('https://cms.wizztest.com/wp-json/wp/v2/contact_submissions', submissionData)
      .subscribe({
        next: (response) => {
          console.log('Contact form submitted successfully:', response);
          this.isSubmitting = false;
          this.successMessage = 'Thank you! Your message has been submitted successfully. We will contact you soon.';
          
          // Reset form
          this.formData = {
            fullName: '',
            mobileNumber: '',
            emailId: '',
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
          console.error('Error submitting contact form:', error);
          this.isSubmitting = false;
          this.errorMessage = 'There was an error submitting your message. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
  }

  /**
   * Initialize Intersection Observer for scroll animations
   */
  private initializeIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      // Track observer
      this.observers.push(observer);

      // Observe all elements with data-animate attribute
      const elements = this.document.querySelectorAll('[data-animate]');
      elements.forEach(el => observer.observe(el));
    } catch (e) {
      console.warn('Error initializing intersection observer:', e);
    }
  }

  /**
   * Add typing animation effect to page title
   */
  private initializePageTitleAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const pageTitle = this.document.querySelector('.page-title') as HTMLElement;
    if (!pageTitle) return;

    const titleText = pageTitle.textContent || '';
    pageTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < titleText.length) {
        pageTitle.textContent += titleText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    // Start typing animation after a short delay
    setTimeout(typeWriter, 200);
  }

  /**
   * Add hover effects to contact cards
   */
  private initializeContactCardAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.document.querySelectorAll('.contact-card').forEach(card => {
      const cardElement = card as HTMLElement;
      
      const enter = this.renderer.listen(cardElement, 'mouseenter', () => {
        cardElement.style.transform = 'translateX(15px) scale(1.02)';
      });
      
      const leave = this.renderer.listen(cardElement, 'mouseleave', () => {
        cardElement.style.transform = 'translateX(10px) scale(1)';
      });

      this.eventCleanups.push(enter, leave);
    });
  }

  /**
   * Add focus animations to form inputs
   */
  private initializeFormInputAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.document.querySelectorAll('input, textarea').forEach(input => {
      const inputElement = input as HTMLElement;
      
      const focus = this.renderer.listen(inputElement, 'focus', () => {
        if (inputElement.parentElement) {
          inputElement.parentElement.style.transform = 'translateY(-2px)';
        }
      });
      
      const blur = this.renderer.listen(inputElement, 'blur', () => {
        if (inputElement.parentElement) {
          inputElement.parentElement.style.transform = 'translateY(0)';
        }
      });

      this.eventCleanups.push(focus, blur);
    });
  }

  /**
   * Add click animation to contact cards
   */
  private initializeContactCardClickAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.document.querySelectorAll('.contact-card').forEach(card => {
      const cardElement = card as HTMLElement;
      
      const click = this.renderer.listen(cardElement, 'click', () => {
        const link = cardElement.querySelector('a') as HTMLAnchorElement;
        if (link && link.href.startsWith('mailto:')) {
          cardElement.style.background = 'rgba(29, 170, 186, 0.1)';
          setTimeout(() => {
            cardElement.style.background = '';
          }, 300);
        }
      });

      this.eventCleanups.push(click);
    });
  }

  /**
   * Stagger animation for contact cards
   */
  private initializeStaggeredContactCards(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const cards = this.document.querySelectorAll('.contact-card');
      if (cards.length === 0) return;

      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Using a captured index approach isn't straightforward with observer pattern inside loop.
            // Better to rely on CSS classes or set timeout inside observer if absolutely needed.
            // Here we just trigger animation.
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.2 });

      this.observers.push(cardObserver);
      
      cards.forEach((card, index) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transitionDelay = `${index * 0.1}s`; // Use CSS transition-delay instead
        cardElement.style.opacity = '0';
        cardElement.style.transform = 'translateY(30px)';
        cardElement.style.transition = 'all 0.8s ease';
        // Re-apply delay property since we overwrote style above
        cardElement.style.transitionDelay = `${index * 0.1}s`;
        
        cardObserver.observe(cardElement);
      });
    } catch (e) {
      console.warn('Error initializing staggered contact cards:', e);
    }
  }
}