import { Component, AfterViewInit, Renderer2, OnInit, Inject, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-infulencerapply',
  standalone: true,
  imports: [],
  templateUrl: './infulencerapply.component.html',
  styleUrl: './infulencerapply.component.css'
})
export class InfulencerapplyComponent implements OnInit, AfterViewInit {
  
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
    this.initFormSubmission();
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
  private initFormSubmission(): void {
    const form = this.elementRef.nativeElement.querySelector('#driverForm') as HTMLFormElement;
    
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
        console.log('=== Influencer Form Submission ===');
        console.log('Form Data:', formDataObject);
        console.log('Timestamp:', new Date().toLocaleString());
        console.log('================================');
        
        // Create readable alert message
        let alertMessage = 'Influencer Collaboration Request\n\n';
        for (const [key, value] of Object.entries(formDataObject)) {
          if (value) {
            alertMessage += `${key}: ${value}\n`;
          }
        }
        
        // Add loading state to button
        const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
        if (!submitBtn) return;

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Application...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
          // Show alert with form data
          alert(alertMessage);
          
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Application Submitted!';
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
    }
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
