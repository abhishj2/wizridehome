import { Component, AfterViewInit, Renderer2, OnInit, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

interface CareerFormData {
  fullName: string;
  contactNumber: string;
  address: string;
  fileName: string;
  message: string;
}

@Component({
  selector: 'app-applyforjob',
  standalone: true,
  imports: [],
  templateUrl: './applyforjob.component.html',
  styleUrl: './applyforjob.component.css'
})
export class ApplyforjobComponent implements OnInit, AfterViewInit {

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/applyforjob');
    
    // SEO Metadata
    this.titleService.setTitle("Career Opportunities at Wizzride - Apply for Jobs Today");
    this.metaService.updateTag({
      name: 'description',
      content: "Explore exciting job opportunities at Wizzride. Join our mission-driven team and build a career in travel, shared mobility, and customer service excellence."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Career Opportunities at Wizzride - Apply for Jobs Today"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Career Opportunities at Wizzride - Apply for Jobs Today' });
    this.metaService.updateTag({ property: 'og:description', content: "Explore exciting job opportunities at Wizzride. Join our mission-driven team and build a career in travel, shared mobility, and customer service excellence." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/applyforjob' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Career Opportunities at Wizzride - Apply for Jobs Today' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore exciting job opportunities at Wizzride. Join our mission-driven team and build a career in travel, shared mobility, and customer service excellence." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
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
      "name": "Careers",
      "item": {
        "@type": "WebPage",
        "@id": "https://www.wizzride.com/applyforjob"
      }
    }
  ]
});

// JobPosting JSON-LD
this.addJsonLd({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Corporate Team Member",
  "description": "Join the dynamic realm of Wizzride, where innovation meets passion, and excellence is the standard. Our corporate team is the brain and soul of our operations.",
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
  "employmentType": "FULL_TIME"
});

// Organization JSON-LD
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
  

  // Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    // Initialize all animations and interactions
    this.initializeIntersectionObserver();
    this.initializePageTitleAnimation();
    this.initializeFormSubmission();
    this.initializeFileInputHandling();
    this.initializeFeatureCardHoverEffects();
    this.initializeFormInputAnimations();
    this.initializeStaggeredFeatureCards();
    this.initializeParallaxEffect();
  }

  /**
   * Initialize Intersection Observer for scroll animations
   */
  private initializeIntersectionObserver(): void {
    const observerOptions: IntersectionObserverInit = {
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
    this.document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Add typing animation effect to page title
   */
  private initializePageTitleAnimation(): void {
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
   * Handle form submission
   */
  private initializeFormSubmission(): void {
    const form = this.document.getElementById('careerForm') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
  }

  /**
   * Process form submission and display data
   */
  private handleFormSubmit(form: HTMLFormElement): void {
    // Get form data
    const fileInput = form.elements.namedItem('files') as HTMLInputElement;
    const formData: CareerFormData = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement)?.value || '',
      contactNumber: (form.elements.namedItem('contactNumber') as HTMLInputElement)?.value || '',
      address: (form.elements.namedItem('address') as HTMLInputElement)?.value || '',
      fileName: fileInput?.files?.[0]?.name || 'No file selected',
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || ''
    };

    // Display data in console
    console.log('=== Career Application Submission ===');
    console.log('Full Name:', formData.fullName);
    console.log('Contact Number:', formData.contactNumber);
    console.log('Address:', formData.address);
    console.log('CV File:', formData.fileName);
    console.log('Message:', formData.message);
    console.log('====================================');

    // Display data in alert
    const alertMessage = `
Career Application Submitted!

Full Name: ${formData.fullName}
Contact Number: ${formData.contactNumber}
Address: ${formData.address}
CV File: ${formData.fileName}
Message: ${formData.message}
    `.trim();
    
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

        // Reset file input display
        const fileInputDisplay = this.document.querySelector('.file-input') as HTMLElement;
        if (fileInputDisplay) {
          const textNode = Array.from(fileInputDisplay.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
          if (textNode) {
            textNode.textContent = ' Choose File (PDF, DOC, DOCX)';
          }
          const icon = fileInputDisplay.querySelector('i');
          if (icon) {
            icon.className = 'fas fa-upload';
          }
          fileInputDisplay.style.borderColor = '';
          fileInputDisplay.style.background = '';
        }
      }, 3000);
    }, 2000);
  }

  /**
   * File input handling
   */
  private initializeFileInputHandling(): void {
    const fileInputElement = this.document.querySelector('.file-input input') as HTMLInputElement;
    const fileDisplay = this.document.querySelector('.file-input') as HTMLElement;
    
    if (!fileInputElement || !fileDisplay) return;

    // Hide the actual input element
    fileInputElement.style.position = 'absolute';
    fileInputElement.style.opacity = '0';
    fileInputElement.style.width = '0';
    fileInputElement.style.height = '0';

    // Make the div clickable to trigger file input
    fileDisplay.style.cursor = 'pointer';
    fileDisplay.addEventListener('click', () => {
      fileInputElement.click();
    });

    // Handle file selection
    fileInputElement.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      
      if (target.files?.[0]) {
        const fileName = target.files[0].name;
        // Update only the text content, not the entire HTML
        const textNode = Array.from(fileDisplay.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = ` ${fileName}`;
        }
        // Update icon
        const icon = fileDisplay.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-file';
        }
        fileDisplay.style.borderColor = 'var(--primary-color)';
        fileDisplay.style.background = 'rgba(29, 170, 186, 0.05)';
      }
    });
  }

  /**
   * Add hover effects to feature cards
   */
  private initializeFeatureCardHoverEffects(): void {
    this.document.querySelectorAll('.feature-card').forEach(card => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateY(-15px) scale(1.02)';
      });
      
      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateY(-10px) scale(1)';
      });
    });
  }

  /**
   * Add focus animations to form inputs
   */
  private initializeFormInputAnimations(): void {
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
   * Stagger animation for feature cards
   */
  private initializeStaggeredFeatureCards(): void {
    this.document.querySelectorAll('.feature-card').forEach((card, index) => {
      const cardElement = card as HTMLElement;
      cardElement.style.opacity = '0';
      cardElement.style.transform = 'translateY(50px)';
      cardElement.style.transition = 'all 0.8s ease';
      
      // Animate when in view
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (entry.target as HTMLElement).style.opacity = '1';
              (entry.target as HTMLElement).style.transform = 'translateY(0)';
            }, index * 200);
          }
        });
      }, { threshold: 0.2 });
      
      cardObserver.observe(cardElement);
    });
  }

  /**
   * Parallax effect for form image
   */
  private initializeParallaxEffect(): void {
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
