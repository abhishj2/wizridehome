import { Component, AfterViewInit, Renderer2, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CaptchaService, CaptchaData } from '../../services/captcha.service';

interface CareerFormData {
  fullName: string;
  contactNumber: string;
  address: string;
  message: string;
}

@Component({
  selector: 'app-applyforjob',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './applyforjob.component.html',
  styleUrl: './applyforjob.component.css'
})
export class ApplyforjobComponent implements OnInit, AfterViewInit {

  formData: CareerFormData = {
    fullName: '',
    contactNumber: '',
    address: '',
    message: ''
  };

  selectedFile: File | null = null;
  fileName: string = '';

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
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private captchaService: CaptchaService
  ) {}

  ngOnInit(): void {
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
    
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/careermain.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Career Opportunities at Wizzride - Apply for Jobs Today' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Explore exciting job opportunities at Wizzride. Join our mission-driven team and build a career in travel, shared mobility, and customer service excellence." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/careermain.jpg' });
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
    if (!isPlatformBrowser(this.platformId)) return;
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Initialize all animations and interactions
    this.initializeIntersectionObserver();
    this.initializePageTitleAnimation();
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
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const IO = (globalThis as any).IntersectionObserver;
      const doc = this.document;
      
      if (!IO || !doc || typeof doc.querySelectorAll !== 'function') {
        return;
      }
      
      const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IO((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      // Observe all elements with data-animate attribute
      doc.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
      });
    } catch (e) {
      // Ignore on SSR
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
   * Handle file selection
   */
  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = 'Please upload a valid PDF, DOC, or DOCX file.';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size must be less than 5MB.';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.errorMessage = '';
    }
  }

  /**
   * Upload file to WordPress
   */
  uploadFileToWordPress(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(0);
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('https://cms.wizztest.com/wp-json/wp/v2/media', formData)
        .subscribe({
          next: (response) => {
            console.log('File uploaded successfully:', response);
            resolve(response.id);
          },
          error: (error) => {
            console.error('Error uploading file:', error);
            reject(error);
          }
        });
    });
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
    if (!this.formData.fullName || !this.formData.contactNumber || !this.formData.address) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please attach your CV.';
      return;
    }

    this.isSubmitting = true;

    // First upload the file, then submit the form
    this.uploadFileToWordPress()
      .then((fileId) => {
        const submissionData = {
          title: `Career Application - ${this.formData.fullName}`,
          content: this.formData.message || 'No message provided',
          status: 'publish',
          acf: {
            full_name: this.formData.fullName,
            contact_number: this.formData.contactNumber,
            address: this.formData.address,
            message: this.formData.message || '',
            cv_file: fileId, // WordPress media ID
            cv_file_name: this.fileName,
            submission_date: new Date().toISOString()
          }
        };

        console.log('Submitting career application:', submissionData);

        this.http.post('https://cms.wizztest.com/wp-json/wp/v2/career_applications', submissionData)
          .subscribe({
            next: (response) => {
              console.log('Career application submitted successfully:', response);
              this.isSubmitting = false;
              this.successMessage = 'Thank you! Your application has been submitted successfully. We will contact you soon.';
              
              // Reset form
              this.formData = {
                fullName: '',
                contactNumber: '',
                address: '',
                message: ''
              };
              this.selectedFile = null;
              this.fileName = '';
              this.userCaptchaAnswer = '';
              
              // Reset file input
              if (isPlatformBrowser(this.platformId)) {
                const fileInput = this.document.querySelector('#cvFile') as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = '';
                }
              }
              
              // Generate new captcha
              this.captchaData = this.captchaService.generateCaptcha();

              // Clear success message after 5 seconds
              setTimeout(() => {
                this.successMessage = '';
              }, 5000);
            },
            error: (error) => {
              console.error('Error submitting career application:', error);
              this.isSubmitting = false;
              this.errorMessage = 'There was an error submitting your application. Please try again.';
              
              // Clear error message after 5 seconds
              setTimeout(() => {
                this.errorMessage = '';
              }, 5000);
            }
          });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        this.isSubmitting = false;
        this.errorMessage = 'There was an error uploading your CV. Please try again.';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      });
  }

  /**
   * File input handling
   */
  private initializeFileInputHandling(): void {
    if (!isPlatformBrowser(this.platformId)) return;
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
    if (!isPlatformBrowser(this.platformId)) return;
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
   * Stagger animation for feature cards
   */
  private initializeStaggeredFeatureCards(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') return;
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
