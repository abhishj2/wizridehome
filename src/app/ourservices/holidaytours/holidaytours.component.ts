import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';

interface HolidayTourEnquiryFormData {
  fullName: string;
  contactNo: string;
  email: string;
  fromCity: string;
  message: string;
}

@Component({
  selector: 'app-holidaytours',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './holidaytours.component.html',
  styleUrl: './holidaytours.component.css'
})
export class HolidaytoursComponent implements OnInit, AfterViewInit {
  
  formData: HolidayTourEnquiryFormData = {
    fullName: '',
    contactNo: '',
    email: '',
    fromCity: '',
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
    private http: HttpClient,
    private captchaService: CaptchaService
  ) {}
  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/ourservices/holidaystours');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Best Holiday & International Group Tours - Boutique Packages");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Wizzride's boutique holiday packages, including the best holiday experiences and international group tour packages. Enjoy curated, seamless, and unforgettable journeys."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Best Holiday & International Group Tours - Boutique Packages"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Best Holiday & International Group Tours - Boutique Packages" });
    this.metaService.updateTag({ property: 'og:description', content: "Discover Wizzride's boutique holiday packages, including the best holiday experiences and international group tour packages. Enjoy curated, seamless, and unforgettable journeys." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/ourservices/holidaystours' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Best Holiday & International Group Tours - Boutique Packages" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Discover Wizzride's boutique holiday packages, including the best holiday experiences and international group tour packages. Enjoy curated, seamless, and unforgettable journeys." });
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
          "name": "Holiday Tours",
          "item": {
            "@type": "Service",
            "@id": "https://www.wizzride.com/ourservices/holidaytours"
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
    this.initIntersectionObserver();
    this.initSmoothScrolling();
    this.initFormSubmission();
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
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el: Element) => {
      observer.observe(el);
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
    if (!this.formData.fullName || !this.formData.contactNo || !this.formData.email) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;

    const submissionData = {
      title: `Holiday Tour Enquiry - ${this.formData.fullName}`,
      content: this.formData.message || 'No message provided',
      status: 'publish',
      acf: {
        full_name: this.formData.fullName,
        contact_number: this.formData.contactNo,
        email: this.formData.email,
        from_city: this.formData.fromCity || '',
        message: this.formData.message || '',
        enquiry_date: new Date().toISOString()
      }
    };

    console.log('Submitting holiday tour enquiry:', submissionData);

    this.http.post('http://cms.wizztest.com/wp-json/wp/v2/holiday_enquiries', submissionData)
      .subscribe({
        next: (response) => {
          console.log('Holiday tour enquiry submitted successfully:', response);
          this.isSubmitting = false;
          this.successMessage = 'Thank you! Your enquiry has been submitted successfully. We will contact you soon.';
          
          // Reset form
          this.formData = {
            fullName: '',
            contactNo: '',
            email: '',
            fromCity: '',
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
          console.error('Error submitting holiday tour enquiry:', error);
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

}
