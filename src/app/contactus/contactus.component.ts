import { Component, AfterViewInit, Renderer2, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';
import { FormsModule } from '@angular/forms';

interface ContactFormData {
  fullName: string;
  mobileNumber: string;
  emailId: string;
  message: string;
}

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent implements OnInit, AfterViewInit {
  @ViewChild('contactForm') contactFormElement?: ElementRef<HTMLFormElement>;
  
  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit(): void {
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
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Contact Us | WizzRide – Taxi Services in Sikkim, Darjeeling' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Get in touch with WizzRide for taxi bookings in Sikkim, Darjeeling, Guwahati, and Shillong. For cancellations or inquiries, contact us at our service number.' });
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
          "name": "Contact Us",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/contactus"
          }
        }
      ]
    });

    // ✅ Organization JSON-LD (for branding)
        this.addJsonLd( { "@context": "https://schema.org", "@type": "Organization", "name": "Wizzride", "url": "https://wizzride.com", "logo": "https://wizzride.com/wp-content/uploads/2023/06/wizzride-logo.png", "description": "Wizzride offers comfortable and reliable cab and flight booking services across India. Book shared or reserved cabs, flights, and more with ease through our platform.", "foundingDate": "2015", "founders": [ { "@type": "Person", "name": "Wizzride Founders" } ], "contactPoint": [ { "@type": "ContactPoint", "telephone": "+91-9775999444", "contactType": "customer service", "areaServed": "IN", "availableLanguage": ["English", "Hindi"] } ], "sameAs": [ "https://www.facebook.com/wizzride", "https://twitter.com/wizzride", "https://www.instagram.com/wizzride", "https://www.linkedin.com/company/wizzride" ], "address": { "@type": "PostalAddress", "streetAddress": "Gangtok, Sikkim", "addressLocality": "Gangtok", "addressRegion": "Sikkim", "postalCode": "737101", "addressCountry": "IN" }, "department": [ { "@type": "Organization", "name": "Wizzride Cab Booking", "url": "https://wizzride.com/cab-booking/", "description": "Book intercity and local cabs with flexible shared or reserved options." }, { "@type": "Organization", "name": "Wizzride Flight Booking", "url": "https://wizzride.com/flights/", "description": "Compare and book domestic and international flights easily." } ] });
  }    

  // ✅ Utility: inject LD+JSON scripts
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
    this.initializeContactCardAnimations();
    this.initializeFormInputAnimations();
    this.initializeContactCardClickAnimations();
    this.initializeStaggeredContactCards();
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
        setTimeout(typeWriter, 100);
      }
    };

    // Start typing animation after a short delay
    setTimeout(typeWriter, 200);
  }

  /**
   * Handle form submission
   */
  private initializeFormSubmission(): void {
    const form = this.document.getElementById('contactForm') as HTMLFormElement;
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
    const formData: ContactFormData = {
      fullName: (form.elements.namedItem('fullName') as HTMLInputElement)?.value || '',
      mobileNumber: (form.elements.namedItem('mobileNumber') as HTMLInputElement)?.value || '',
      emailId: (form.elements.namedItem('emailId') as HTMLInputElement)?.value || '',
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || ''
    };

    // Display data in console
    console.log('=== Contact Form Submission ===');
    console.log('Full Name:', formData.fullName);
    console.log('Contact Number:', formData.mobileNumber);
    console.log('Email ID:', formData.emailId);
    console.log('Message:', formData.message);
    console.log('================================');

    // Display data in alert
    const alertMessage = `
Contact Form Submitted!

Full Name: ${formData.fullName}
Contact Number: ${formData.mobileNumber}
Email ID: ${formData.emailId}
Message: ${formData.message}
    `.trim();
    
    // Add loading state to button
    const submitBtn = form.querySelector('.submit-btn') as HTMLButtonElement;
    if (!submitBtn) return;

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      // Show alert with form data
      alert(alertMessage);

      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      
      // Reset form
      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);
    }, 1500);
  }

  /**
   * Add hover effects to contact cards
   */
  private initializeContactCardAnimations(): void {
    this.document.querySelectorAll('.contact-card').forEach(card => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('mouseenter', () => {
        cardElement.style.transform = 'translateX(15px) scale(1.02)';
      });
      
      cardElement.addEventListener('mouseleave', () => {
        cardElement.style.transform = 'translateX(10px) scale(1)';
      });
    });
  }

  /**
   * Add focus animations to form inputs
   */
  private initializeFormInputAnimations(): void {
    this.document.querySelectorAll('input, textarea').forEach(input => {
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
   * Add click animation to contact cards
   */
  private initializeContactCardClickAnimations(): void {
    this.document.querySelectorAll('.contact-card').forEach(card => {
      const cardElement = card as HTMLElement;
      
      cardElement.addEventListener('click', () => {
        const link = cardElement.querySelector('a') as HTMLAnchorElement;
        if (link && link.href.startsWith('mailto:')) {
          // Visual feedback for email clicks
          cardElement.style.background = 'rgba(29, 170, 186, 0.1)';
          setTimeout(() => {
            cardElement.style.background = '';
          }, 300);
        }
      });
    });
  }

  /**
   * Stagger animation for contact cards
   */
  private initializeStaggeredContactCards(): void {
    this.document.querySelectorAll('.contact-card').forEach((card, index) => {
      const cardElement = card as HTMLElement;
      cardElement.style.animationDelay = `${index * 0.1}s`;
      cardElement.style.opacity = '0';
      cardElement.style.transform = 'translateY(30px)';
      cardElement.style.transition = 'all 0.8s ease';
      
      // Animate when in view
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (entry.target as HTMLElement).style.opacity = '1';
              (entry.target as HTMLElement).style.transform = 'translateY(0)';
            }, index * 100);
          }
        });
      }, { threshold: 0.2 });
      
      cardObserver.observe(cardElement);
    });
  }

}
