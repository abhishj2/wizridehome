import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';

interface CarAttachmentFormData {
  fullName: string;
  contactNumber: string;
  cityName: string;
  alreadycar: string;
  driver: string;
  message: string;
}

interface InvestorFormData {
  fullName: string;
  contactNumber: string;
  emailId: string;
  organisation: string;
  message: string;
}

interface AgentFormData {
  fullName: string;
  contactNumber: string;
  emailId: string;
  address: string;
  gstnumber: string;
  message: string;
}

interface InfluencerFormData {
  fullName: string;
  contactNumber: string;
  emailId: string;
  message: string;
}

interface B2BFormData {
  fullName: string;
  companyName: string;
  contactNumber: string;
  emailId: string;
  message: string;
}

interface CorporateFormData {
  fullName: string;
  companyName: string;
  contactNumber: string;
  emailId: string;
  message: string;
}

@Component({
  selector: 'app-partnerwithus',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './partnerwithus.component.html',
  styleUrl: './partnerwithus.component.css'
})
export class PartnerwithusComponent implements OnInit, AfterViewInit {
  private selectedTabId: string | null = null;
  
  // Form data objects
  carAttachmentForm: CarAttachmentFormData = {
    fullName: '',
    contactNumber: '',
    cityName: '',
    alreadycar: '',
    driver: '',
    message: ''
  };

  investorForm: InvestorFormData = {
    fullName: '',
    contactNumber: '',
    emailId: '',
    organisation: '',
    message: ''
  };

  agentForm: AgentFormData = {
    fullName: '',
    contactNumber: '',
    emailId: '',
    address: '',
    gstnumber: '',
    message: ''
  };

  influencerForm: InfluencerFormData = {
    fullName: '',
    contactNumber: '',
    emailId: '',
    message: ''
  };

  b2bForm: B2BFormData = {
    fullName: '',
    companyName: '',
    contactNumber: '',
    emailId: '',
    message: ''
  };

  corporateForm: CorporateFormData = {
    fullName: '',
    companyName: '',
    contactNumber: '',
    emailId: '',
    message: ''
  };

  // Captcha for each form
  captchaData: { [key: string]: CaptchaData } = {};
  userCaptchaAnswers: { [key: string]: string } = {};

  // Form state
  isSubmitting: { [key: string]: boolean } = {};
  successMessages: { [key: string]: string } = {};
  errorMessages: { [key: string]: string } = {};
  
  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) {}
  ngOnInit(): void {
    // Generate captcha for all forms
    const formTypes = ['car-attachment', 'investor', 'agent', 'influencer', 'b2b', 'corporateprivate'];
    formTypes.forEach(formType => {
      this.captchaData[formType] = this.captchaService.generateCaptcha();
      this.userCaptchaAnswers[formType] = '';
      this.isSubmitting[formType] = false;
      this.successMessages[formType] = '';
      this.errorMessages[formType] = '';
    });

    // Get query parameters
    this.route.queryParams.subscribe(params => {
      const tabId = params['id'];
      if (tabId) {
        // Map ID to form name
        const tabMapping: { [key: string]: string } = {
          '1': 'car-attachment',
          '2': 'investor',
          '3': 'agent',
          '4': 'influencer',
          '5': 'b2b',
          '6': 'corporateprivate'
        };
        this.selectedTabId = tabMapping[tabId] || null;
      }
    });

    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/applyforjob/partnerwithus');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Partner with Wizzride - Transform Luxury Cab Services Together");
    this.metaService.updateTag({
      name: 'description',
      content: "Join Wizzride as a partner to revolutionize luxury shared cab services. Collaborate with us to expand sustainable, comfortable, and high-quality travel solutions."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Partner with Wizzride - Transform Luxury Cab Services Together"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Partner with Wizzride - Transform Luxury Cab Services Together' });
    this.metaService.updateTag({ property: 'og:description', content: 'Join Wizzride as a partner to revolutionize luxury shared cab services. Collaborate with us to expand sustainable, comfortable, and high-quality travel solutions.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/applyforjob/partnerwithus' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/partnerwithus.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Partner with Wizzride - Transform Luxury Cab Services Together' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Join Wizzride as a partner to revolutionize luxury shared cab services. Collaborate with us to expand sustainable, comfortable, and high-quality travel solutions.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/partnerwithus.jpg' });
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
          "name": "Apply for Job",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/applyforjob"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Partner With Us",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/applyforjob/partnerwithus"
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
    if (!isPlatformBrowser(this.platformId)) return;
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }


  ngAfterViewInit(): void {
    // Initialize all interactive features (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
      this.initTabFunctionality();
      this.initFocusAnimations();
      this.initHoverEffects();
      this.initSmoothScrolling();
      
      // Open specific tab if query parameter is present
      if (this.selectedTabId) {
        this.openTabById(this.selectedTabId);
      }
    }
  }

  // Intersection Observer for scroll animations
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') return;
    
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

  // Tab functionality for partnership options
  private initTabFunctionality(): void {
    const optionBtns = this.elementRef.nativeElement.querySelectorAll('.option-btn');
    const formContainers = this.elementRef.nativeElement.querySelectorAll('.form-container');

    optionBtns.forEach((btn: HTMLElement) => {
      this.renderer.listen(btn, 'click', () => {
        // Remove active class from all buttons
        optionBtns.forEach((b: HTMLElement) => {
          this.renderer.removeClass(b, 'active');
        });
        
        // Add active class to clicked button
        this.renderer.addClass(btn, 'active');
        
        // Hide all form containers
        formContainers.forEach((container: HTMLElement) => {
          this.renderer.removeClass(container, 'active');
        });
        
        // Show selected form container
        const targetFormId = btn.getAttribute('data-form');
        if (targetFormId) {
          const targetForm = this.elementRef.nativeElement.querySelector(`#${targetFormId}`);
          if (targetForm) {
            this.renderer.addClass(targetForm, 'active');
          }
        }
      });
    });
  }

  /**
   * Submit Car Attachment Form
   */
  onSubmitCarAttachment(): void {
    this.submitForm('car-attachment', {
      title: `Car Attachment Request - ${this.carAttachmentForm.fullName}`,
      content: this.carAttachmentForm.message || 'No message provided',
      acf: {
        form_type: 'car-attachment',
        full_name: this.carAttachmentForm.fullName,
        contact_number: this.carAttachmentForm.contactNumber,
        city_name: this.carAttachmentForm.cityName,
        already_car: this.carAttachmentForm.alreadycar,
        driver: this.carAttachmentForm.driver,
        message: this.carAttachmentForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.carAttachmentForm, () => {
      this.carAttachmentForm = {
        fullName: '',
        contactNumber: '',
        cityName: '',
        alreadycar: '',
        driver: '',
        message: ''
      };
    });
  }

  /**
   * Submit Investor Form
   */
  onSubmitInvestor(): void {
    this.submitForm('investor', {
      title: `Investor Inquiry - ${this.investorForm.fullName}`,
      content: this.investorForm.message || 'No message provided',
      acf: {
        form_type: 'investor',
        full_name: this.investorForm.fullName,
        contact_number: this.investorForm.contactNumber,
        email_id: this.investorForm.emailId,
        organisation: this.investorForm.organisation,
        message: this.investorForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.investorForm, () => {
      this.investorForm = {
        fullName: '',
        contactNumber: '',
        emailId: '',
        organisation: '',
        message: ''
      };
    });
  }

  /**
   * Submit Agent Form
   */
  onSubmitAgent(): void {
    this.submitForm('agent', {
      title: `Agent Application - ${this.agentForm.fullName}`,
      content: this.agentForm.message || 'No message provided',
      acf: {
        form_type: 'agent',
        full_name: this.agentForm.fullName,
        contact_number: this.agentForm.contactNumber,
        email_id: this.agentForm.emailId,
        address: this.agentForm.address,
        gst_number: this.agentForm.gstnumber,
        message: this.agentForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.agentForm, () => {
      this.agentForm = {
        fullName: '',
        contactNumber: '',
        emailId: '',
        address: '',
        gstnumber: '',
        message: ''
      };
    });
  }

  /**
   * Submit Influencer Form
   */
  onSubmitInfluencer(): void {
    this.submitForm('influencer', {
      title: `Influencer Collaboration - ${this.influencerForm.fullName}`,
      content: this.influencerForm.message || 'No message provided',
      acf: {
        form_type: 'influencer',
        full_name: this.influencerForm.fullName,
        contact_number: this.influencerForm.contactNumber,
        email_id: this.influencerForm.emailId,
        message: this.influencerForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.influencerForm, () => {
      this.influencerForm = {
        fullName: '',
        contactNumber: '',
        emailId: '',
        message: ''
      };
    });
  }

  /**
   * Submit B2B Form
   */
  onSubmitB2B(): void {
    this.submitForm('b2b', {
      title: `B2B Partnership - ${this.b2bForm.fullName}`,
      content: this.b2bForm.message || 'No message provided',
      acf: {
        form_type: 'b2b',
        full_name: this.b2bForm.fullName,
        company_name: this.b2bForm.companyName,
        contact_number: this.b2bForm.contactNumber,
        email_id: this.b2bForm.emailId,
        message: this.b2bForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.b2bForm, () => {
      this.b2bForm = {
        fullName: '',
        companyName: '',
        contactNumber: '',
        emailId: '',
        message: ''
      };
    });
  }

  /**
   * Submit Corporate/Private Events Form
   */
  onSubmitCorporate(): void {
    this.submitForm('corporateprivate', {
      title: `Corporate/Private Event - ${this.corporateForm.fullName}`,
      content: this.corporateForm.message || 'No message provided',
      acf: {
        form_type: 'corporate-private',
        full_name: this.corporateForm.fullName,
        company_name: this.corporateForm.companyName,
        contact_number: this.corporateForm.contactNumber,
        email_id: this.corporateForm.emailId,
        message: this.corporateForm.message || '',
        submission_date: new Date().toISOString()
      }
    }, this.corporateForm, () => {
      this.corporateForm = {
        fullName: '',
        companyName: '',
        contactNumber: '',
        emailId: '',
        message: ''
      };
    });
  }

  /**
   * Generic form submission handler
   */
  private submitForm(
    formType: string,
    submissionData: any,
    formData: any,
    resetCallback: () => void
  ): void {
    // Clear previous messages
    this.successMessages[formType] = '';
    this.errorMessages[formType] = '';

    // Validate captcha first
    if (!this.captchaService.validateCaptcha(this.userCaptchaAnswers[formType], this.captchaData[formType].answer)) {
      this.errorMessages[formType] = 'Incorrect answer! Please solve the math problem correctly.';
      this.userCaptchaAnswers[formType] = '';
      this.captchaData[formType] = this.captchaService.generateCaptcha();
      return;
    }

    // Validate required fields based on form type
    let isValid = true;
    if (formType === 'car-attachment') {
      isValid = !!(formData.fullName && formData.contactNumber && formData.cityName && formData.alreadycar && formData.driver);
    } else if (formType === 'investor') {
      isValid = !!(formData.fullName && formData.contactNumber && formData.organisation);
    } else if (formType === 'agent') {
      isValid = !!(formData.fullName && formData.contactNumber && formData.address && formData.gstnumber);
    } else if (formType === 'influencer') {
      isValid = !!(formData.fullName && formData.contactNumber);
    } else if (formType === 'b2b' || formType === 'corporateprivate') {
      isValid = !!(formData.fullName && formData.companyName && formData.contactNumber);
    }

    if (!isValid) {
      this.errorMessages[formType] = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting[formType] = true;
    submissionData.status = 'publish';

    console.log(`Submitting ${formType} form:`, submissionData);

    this.http.post('https://cms.wizztest.com/wp-json/wp/v2/wiz_partnerships', submissionData)
      .subscribe({
        next: (response) => {
          console.log(`${formType} form submitted successfully:`, response);
          this.isSubmitting[formType] = false;
          this.successMessages[formType] = 'Thank you! Your request has been submitted successfully. We will contact you soon.';
          
          // Reset form
          resetCallback();
          this.userCaptchaAnswers[formType] = '';
          
          // Generate new captcha
          this.captchaData[formType] = this.captchaService.generateCaptcha();

          // Clear success message after 5 seconds
          setTimeout(() => {
            this.successMessages[formType] = '';
          }, 5000);
        },
        error: (error) => {
          console.error(`Error submitting ${formType} form:`, error);
          this.isSubmitting[formType] = false;
          this.errorMessages[formType] = 'There was an error submitting your request. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.errorMessages[formType] = '';
          }, 5000);
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

  // Hover effects for option buttons
  private initHoverEffects(): void {
    const optionBtns = this.elementRef.nativeElement.querySelectorAll('.option-btn');
    
    optionBtns.forEach((btn: HTMLElement) => {
      this.renderer.listen(btn, 'mouseenter', () => {
        if (!btn.classList.contains('active')) {
          this.renderer.setStyle(btn, 'transform', 'translateX(10px)');
        }
      });
      
      this.renderer.listen(btn, 'mouseleave', () => {
        if (!btn.classList.contains('active')) {
          this.renderer.setStyle(btn, 'transform', 'translateX(0)');
        }
      });
    });
  }

  // Smooth scrolling for internal links
  private initSmoothScrolling(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const anchors = this.elementRef.nativeElement.querySelectorAll('a[href^="#"]');
    
    anchors.forEach((anchor: HTMLAnchorElement) => {
      this.renderer.listen(anchor, 'click', (e: Event) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId) {
          const targetElement = this.document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Open specific tab by ID (used for query parameter navigation)
  private openTabById(tabId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    setTimeout(() => {
      const optionBtns = this.elementRef.nativeElement.querySelectorAll('.option-btn');
      const formContainers = this.elementRef.nativeElement.querySelectorAll('.form-container');
      
      // Find the button with matching data-form attribute
      let targetBtn: HTMLElement | null = null;
      optionBtns.forEach((btn: HTMLElement) => {
        if (btn.getAttribute('data-form') === tabId) {
          targetBtn = btn;
        }
      });
      
      if (targetBtn) {
        // Remove active class from all buttons
        optionBtns.forEach((btn: HTMLElement) => {
          this.renderer.removeClass(btn, 'active');
        });
        
        // Add active class to target button
        this.renderer.addClass(targetBtn, 'active');
        
        // Hide all form containers
        formContainers.forEach((container: HTMLElement) => {
          this.renderer.removeClass(container, 'active');
        });
        
        // Show target form container
        const targetForm = this.elementRef.nativeElement.querySelector(`#${tabId}`);
        if (targetForm) {
          this.renderer.addClass(targetForm, 'active');
          
          // Scroll to the form section smoothly
          setTimeout(() => {
            targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }, 100);
  }

  // Helper method to safely get captcha question for SSR compatibility
  getCaptchaQuestion(formType: string): string {
    return this.captchaData[formType]?.question || '';
  }

}
