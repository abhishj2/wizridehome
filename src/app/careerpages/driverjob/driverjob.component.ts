import { Component, AfterViewInit, Renderer2, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';
import { Router } from '@angular/router';

interface DriverEnquiryFormData {
  fullName: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-driverjob',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './driverjob.component.html',
  styleUrl: './driverjob.component.css'
})
export class DriverjobComponent implements OnInit, AfterViewInit, OnDestroy {

  formData: DriverEnquiryFormData = {
    fullName: '',
    email: '',
    contactNumber: '',
    subject: '',
    message: ''
  };

  // Captcha
  captchaData: CaptchaData = { question: '', answer: 0 };
  userCaptchaAnswer: string = '';

  // Form state
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Tracking for cleanup
  private observers: IntersectionObserver[] = [];
  private readonly schemaIds = ['driver-breadcrumb', 'driver-job'];

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private captchaService: CaptchaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/applyforjob/driverjob');
    
    // SEO Metadata
    this.titleService.setTitle("Driver Job Opportunities at Wizzride - Join Our Professional Team");
    this.metaService.updateTag({
      name: 'description',
      content: "Apply for driver jobs at Wizzride and join our dedicated team of professionals."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Driver Job Opportunities at Wizzride - Join Our Professional Team"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Driver Job Opportunities at Wizzride - Join Our Professional Team' });
    this.metaService.updateTag({ property: 'og:description', content: "Apply for driver jobs at Wizzride and join our dedicated team of professionals." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/applyforjob/driverjob' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/wizcar.jpeg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Driver Job Opportunities at Wizzride - Join Our Professional Team' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Apply for driver jobs at Wizzride and join our dedicated team of professionals." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/wizcar.jpeg' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // BreadcrumbList JSON-LD
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
          "name": "Driver Job",
          "item": {
            "@type": "WebPage",
            "@id": "applyforjob/driverjob"
          }
        }
      ]
    }, 'driver-breadcrumb');

    // JobPosting JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": "Wizzride Driver Captain",
      "description": "Being a Wizzride Captain is more than just being behind the wheel. Drive for the best and join our team of professional drivers.",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Wizzride Technologies Pvt Ltd",
        "sameAs": "https://www.wizzride.com",
        "logo": "https://www.wizzride.com/assets/images/icons/logo2.webp"
      },
      "datePosted": "2024-01-01",
      "jobLocationType": "TELECOMMUTE",
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "India"
      },
      "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACTOR"]
    }, 'driver-job');
  }

  // Utility: inject LD+JSON scripts safely
  // UPDATED: Allows SSR (removed isPlatformBrowser check) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    // Safety check for document
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
    // Strictly Browser Only - prevents server crash
    if (isPlatformBrowser(this.platformId)) {
      this.initializeIntersectionObserver();
      this.initializePageTitleAnimation();
      this.initializeFormInputAnimations();
      this.initializeParallaxEffect();
    }
  }

  ngOnDestroy(): void {
    // 1. Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // 2. Remove Schema Scripts (if in browser)
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
   * Initialize Intersection Observer for scroll animations
   */
  private initializeIntersectionObserver(): void {
    // CRITICAL GUARD: Ensure browser environment and API existence
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const doc = this.document;
      
      const observerOptions: IntersectionObserverInit = {
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

      // Track observer for cleanup
      this.observers.push(observer);

      // Observe all elements with data-animate attribute
      const elements = doc.querySelectorAll('[data-animate]');
      if (elements && elements.length > 0) {
        elements.forEach(el => observer.observe(el));
      }
    } catch (e) {
      console.warn('Animation observer failed to initialize:', e);
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
        setTimeout(typeWriter, 80);
      }
    };

    // Start typing animation after a short delay
    setTimeout(typeWriter, 200);
  }

  /**
   * Handle phone number input - filter non-digits and limit to 10
   */
  onPhoneNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    this.formData.contactNumber = value;
    input.value = value;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Validate required fields
    if (!this.formData.fullName || !this.formData.email || !this.formData.contactNumber) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    // Validate email format
    if (!this.isValidEmail(this.formData.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    // Validate phone number (exactly 10 digits)
    const cleanedPhoneNumber = this.formData.contactNumber.replace(/\D/g, '');
    if (cleanedPhoneNumber.length !== 10) {
      this.errorMessage = 'Phone number must be exactly 10 digits.';
      return;
    }

    // Validate captcha
    if (!this.captchaService.validateCaptcha(this.userCaptchaAnswer, this.captchaData.answer)) {
      this.errorMessage = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswer = '';
      this.captchaData = this.captchaService.generateCaptcha();
      return;
    }

    this.isSubmitting = true;

    const submissionData = {
      title: `Driver Application - ${this.formData.fullName}`,
      content: this.formData.message || 'No message provided',
      status: 'publish',
      acf: {
        full_name: this.formData.fullName,
        email: this.formData.email,
        contact_number: this.formData.contactNumber,
        subject: this.formData.subject || '',
        message: this.formData.message || '',
        submission_date: new Date().toISOString()
      }
    };

    console.log('Submitting driver application:', submissionData);

    this.http.post('https://cms.wizztest.com/wp-json/wp/v2/driver_applications', submissionData)
      .subscribe({
        next: (response) => {
          console.log('Driver application submitted successfully:', response);
          this.isSubmitting = false;
          
          // Prepare data for Thank You page
          const formData = {
            title: 'Thank You for Your Application!',
            message: 'Your driver application has been submitted successfully.',
            subtitle: 'We have received your application and our team will review it shortly.',
            formType: 'job',
            additionalInfo: 'You will receive a confirmation email shortly. If you have any questions, please contact our recruitment team.',
            redirectUrl: '/applyforjob/driverjob',
            redirectText: 'Back to Driver Jobs'
          };

          // Store in localStorage as fallback
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('thankyouFormData', JSON.stringify(formData));
          }

          // Navigate to Thank You page with state
          this.router.navigate(['/thankyou-form'], {
            state: { formData: formData }
          });
        },
        error: (error) => {
          console.error('Error submitting driver application:', error);
          this.isSubmitting = false;
          this.errorMessage = 'There was an error submitting your application. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
  }

  /**
   * Add focus animations to form inputs
   */
  private initializeFormInputAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.document.querySelectorAll('input, textarea, select').forEach(input => {
      const inputElement = input as HTMLElement;
      
      inputElement.addEventListener('focus', () => {
        if (inputElement.parentElement) {
          inputElement.parentElement.style.transform = 'translateY(-2px)';
        }
      });
      
      inputElement.addEventListener('blur', () => {
        if (inputElement.parentElement) {
          inputElement.parentElement.style.transform = 'translateY(0)';
        }
      });
    });
  }

  /**
   * Parallax effect for form image
   */
  private initializeParallaxEffect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const formImage = this.document.querySelector('.form-image') as HTMLElement;
      
      if (formImage) {
        const rect = formImage.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          formImage.style.backgroundPosition = `center ${50 + (scrolled - rect.top) * 0.1}%`;
        }
      }
    });
  }
}