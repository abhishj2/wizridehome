import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-partnerwithus',
  standalone: true,
  imports: [],
  templateUrl: './partnerwithus.component.html',
  styleUrl: './partnerwithus.component.css'
})
export class PartnerwithusComponent implements OnInit, AfterViewInit {
  private selectedTabId: string | null = null;
  
  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit(): void {
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Partner with Wizzride - Transform Luxury Cab Services Together' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Join Wizzride as a partner to revolutionize luxury shared cab services. Collaborate with us to expand sustainable, comfortable, and high-quality travel solutions.' });
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
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }


  ngAfterViewInit(): void {
    // Initialize all interactive features
    this.initIntersectionObserver();
    this.initTabFunctionality();
    this.initFormSubmissions();
    this.initFocusAnimations();
    this.initHoverEffects();
    this.initSmoothScrolling();
    
    // Open specific tab if query parameter is present
    if (this.selectedTabId) {
      this.openTabById(this.selectedTabId);
    }
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

  // Form submission handling
  private initFormSubmissions(): void {
    const forms = this.elementRef.nativeElement.querySelectorAll('.partnership-form');
    
    forms.forEach((form: HTMLFormElement) => {
      this.renderer.listen(form, 'submit', (e: Event) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const formDataObject: { [key: string]: any } = {};
        
        formData.forEach((value, key) => {
          formDataObject[key] = value;
        });
        
        // Get form type from parent container
        const formContainer = form.closest('.form-container');
        const formType = formContainer?.id || 'Unknown Form';
        
        // Log to console
        console.log('=== Form Submission ===');
        console.log('Form Type:', formType);
        console.log('Form Data:', formDataObject);
        console.log('Timestamp:', new Date().toLocaleString());
        console.log('====================');
        
        // Create readable alert message
        let alertMessage = `Form Type: ${formType}\n\n`;
        for (const [key, value] of Object.entries(formDataObject)) {
          if (value) {
            alertMessage += `${key}: ${value}\n`;
          }
        }
        
        // Add loading state to button
        const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
          // Show alert with form data
          alert(alertMessage);
          
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Request Submitted Successfully!';
          submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
          
          // Reset form
          setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        }, 2000);
      });
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

}
