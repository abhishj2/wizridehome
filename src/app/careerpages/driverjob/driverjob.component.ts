import { Component, AfterViewInit, Renderer2, OnInit, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

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
  imports: [],
  templateUrl: './driverjob.component.html',
  styleUrl: './driverjob.component.css'
})
export class DriverjobComponent implements OnInit, AfterViewInit {

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Driver Job Opportunities at Wizzride - Join Our Professional Team' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Apply for driver jobs at Wizzride and join our dedicated team of professionals." });
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
          "name": "Driver Job",
          "item": {
            "@type": "WebPage",
            "@id": "applyforjob/driverjob"
          }
        }
      ]
    });

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
    this.initializeFormInputAnimations();
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
    const form = this.document.getElementById('enquireForm') as HTMLFormElement;
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
    const formData: DriverEnquiryFormData = {
      fullName: (form.elements.namedItem('enquireName') as HTMLInputElement)?.value || '',
      email: (form.elements.namedItem('enquireEmail') as HTMLInputElement)?.value || '',
      contactNumber: (form.elements.namedItem('enquirePhone') as HTMLInputElement)?.value || '',
      subject: (form.elements.namedItem('enquireSubject') as HTMLInputElement)?.value || '',
      message: (form.elements.namedItem('enquireMessage') as HTMLTextAreaElement)?.value || ''
    };

    // Display data in console
    console.log('=== Driver Enquiry Submission ===');
    console.log('Full Name:', formData.fullName);
    console.log('Email:', formData.email);
    console.log('Contact Number:', formData.contactNumber);
    console.log('Subject:', formData.subject);
    console.log('Message:', formData.message);
    console.log('=================================');

    // Display data in alert
    const alertMessage = `
Driver Enquiry Submitted!

Full Name: ${formData.fullName}
Email: ${formData.email}
Contact Number: ${formData.contactNumber}
Subject: ${formData.subject}
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
      }, 3000);
    }, 2000);
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
