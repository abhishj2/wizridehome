import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';

interface InfluencerFormData {
  fullName: string;
  contactNumber: string;
  emailId: string;
  message: string;
}

@Component({
  selector: 'app-infulencerapply',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './infulencerapply.component.html',
  styleUrl: './infulencerapply.component.css'
})
export class InfulencerapplyComponent implements OnInit, AfterViewInit {
  
  formData: InfluencerFormData = {
    fullName: '',
    contactNumber: '',
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
    this.seoService.setCanonicalURL('https://wizzride.com/influencerapply');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Join the Wizzride Influencer Program - Collaborate with Us");
    this.metaService.updateTag({
      name: 'description',
      content: "Become a Wizzride influencer and collaborate with us to promote sustainable travel and shared mobility solutions. Apply now to create meaningful travel experiences."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Join the Wizzride Influencer Program - Collaborate with Us"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Join the Wizzride Influencer Program - Collaborate with Us' });
    this.metaService.updateTag({ property: 'og:description', content: 'Become a Wizzride influencer and collaborate with us to promote sustainable travel and shared mobility solutions. Apply now to create meaningful travel experiences.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/influencerapply' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Join the Wizzride Influencer Program - Collaborate with Us' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Become a Wizzride influencer and collaborate with us to promote sustainable travel and shared mobility solutions. Apply now to create meaningful travel experiences.' });
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
          "name": "Influencer Apply",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/influencerapply"
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
    // Initialize all interactive features
    this.initIntersectionObserver();
    this.initFocusAnimations();
    this.initParallaxEffect();
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

    // Observe all elements with data-animate attribute
    const animateElements = this.elementRef.nativeElement.querySelectorAll('[data-animate]');
    animateElements.forEach((el: Element) => {
      observer.observe(el);
    });
  }

  // Form submission handling
  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    // Validate captcha
    if (!this.captchaService.validateCaptcha(this.userCaptchaAnswer, this.captchaData.answer)) {
      this.errorMessage = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswer = '';
      this.captchaData = this.captchaService.generateCaptcha();
      return;
    }

    // Validate form fields
    if (!this.formData.fullName || !this.formData.fullName.trim()) {
      this.errorMessage = 'Please enter your full name.';
      return;
    }

    if (!this.formData.contactNumber || !this.formData.contactNumber.trim()) {
      this.errorMessage = 'Please enter your contact number.';
      return;
    }

    // Set submitting state
    this.isSubmitting = true;

    // Prepare submission data
    const submissionData = {
      title: `Influencer Application - ${this.formData.fullName}`,
      content: this.formData.message || 'No message provided',
      status: 'publish',
      acf: {
        full_name: this.formData.fullName,
        contact_number: this.formData.contactNumber,
        email_id: this.formData.emailId || '',
        message: this.formData.message || '',
        submission_date: new Date().toISOString()
      }
    };

    // Submit to WordPress
    this.http.post('https://cms.wizzride.com/wp-json/wp/v2/wiz_influencers', submissionData)
      .subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.successMessage = 'Thank you! Your influencer collaboration request has been submitted successfully. We will get back to you soon.';
          
          // Reset form
          this.formData = {
            fullName: '',
            contactNumber: '',
            emailId: '',
            message: ''
          };
          this.userCaptchaAnswer = '';
          this.captchaData = this.captchaService.generateCaptcha();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting influencer application:', error);
          this.errorMessage = 'Sorry, there was an error submitting your request. Please try again later.';
        }
      });
  }

  // Focus animations for form inputs
  private initFocusAnimations(): void {
    const inputs = this.elementRef.nativeElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach((input: HTMLElement) => {
      this.renderer.listen(input, 'focus', () => {
        if (input.parentElement) {
          this.renderer.setStyle(input.parentElement, 'transform', 'translateY(-2px)');
        }
      });
      
      this.renderer.listen(input, 'blur', () => {
        if (input.parentElement) {
          this.renderer.setStyle(input.parentElement, 'transform', 'translateY(0)');
        }
      });
    });
  }

  // Parallax effect for form image
  private initParallaxEffect(): void {
    this.renderer.listen('window', 'scroll', () => {
      const scrolled = window.pageYOffset;
      const formImage = this.elementRef.nativeElement.querySelector('.form-image') as HTMLElement;
      
      if (formImage) {
        const rect = formImage.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.renderer.setStyle(
            formImage,
            'background-position',
            `center ${50 + (scrolled - rect.top) * 0.1}%`
          );
        }
      }
    });
  }

}
