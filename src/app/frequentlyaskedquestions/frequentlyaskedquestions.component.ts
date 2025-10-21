import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-frequentlyaskedquestions',
  standalone: true,
  imports: [],
  templateUrl: './frequentlyaskedquestions.component.html',
  styleUrl: './frequentlyaskedquestions.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FrequentlyaskedquestionsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private fadeScrollObserver: IntersectionObserver | null = null;
  activeFaqIndex: number | null = null;

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://www.wizzride.com/frequentlyaskedquestions');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride FAQs - Shared & Reserved Cab Services");
    this.metaService.updateTag({
      name: 'description',
      content: "Get answers to common faqs queries on fares, safety, booking, and more. Learn about our shared and reserved cab services, luggage policies, and discounts."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride FAQs - Shared & Reserved Cab Services"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: "Wizzride FAQs - Shared & Reserved Cab Services" });
    this.metaService.updateTag({ property: 'og:description', content: "Get answers to common faqs queries on fares, safety, booking, and more. Learn about our shared and reserved cab services, luggage policies, and discounts." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://www.wizzride.com/frequentlyaskedquestions' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: "Wizzride FAQs - Shared & Reserved Cab Services" });
    this.metaService.updateTag({ name: 'twitter:description', content: "Get answers to common faqs queries on fares, safety, booking, and more. Learn about our shared and reserved cab services, luggage policies, and discounts." });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ FAQPage JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much is the taxi fare from Wizzride Darjeeling to Bagdogra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The taxi fare from Darjeeling to Bagdogra with Wizzride starts at ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "How much is Wizzride from Gangtok to Bagdogra?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The fare for a Wizzride cab from Gangtok to Bagdogra starts at ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "How much is Wizzride from Siliguri to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride's fare from Siliguri to Gangtok starts at ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a cab cost from Guwahati to Shillong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A one-way shared Wizzride cab from Guwahati to Shillong is around ₹799."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a taxi cost from Bagdogra to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A one-way taxi from Bagdogra to Gangtok with Wizzride is approximately ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "Are taxis available at Bagdogra airport?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, taxis, including Wizzride cabs, are available at Bagdogra Airport for various destinations."
          }
        },
        {
          "@type": "Question",
          "name": "How much is a taxi from Siliguri to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A taxi from Siliguri to Kalimpong with Wizzride starts at ₹799."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the car fare from Siliguri to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The car fare from Siliguri to Gangtok with Wizzride starts at ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "What is the taxi fare from Bagdogra to Gangtok?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The fare for a one-way Wizzride taxi from Bagdogra to Gangtok starts at ₹999."
          }
        },
        {
          "@type": "Question",
          "name": "How long is the taxi from Siliguri to Kalimpong?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The journey from Siliguri to Kalimpong takes around 2.5 to 3 hours."
          }
        },
        {
          "@type": "Question",
          "name": "What types of vehicles does Wizzride have available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride offers SUVs (Innova, Innova Crysta) for routes across Shillong, Guwahati, Gangtok, Kalimpong, and Darjeeling. Additional vehicles include hatchbacks, sedans, and more."
          }
        },
        {
          "@type": "Question",
          "name": "How many people can travel in a Wizzride shared cab?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each Wizzride shared cab accommodates up to 5 passengers. Detailed seating configurations are available on our website and app."
          }
        },
        {
          "@type": "Question",
          "name": "Is it safe for female passengers to travel alone with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride prioritizes passenger safety, with dedicated teams ensuring secure communication throughout trips. Many of our customers are female travelers."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wizzride provide assistance for passengers with special needs or senior citizens?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride's team is committed to assisting passengers with special needs and senior citizens for a smooth and comfortable journey."
          }
        },
        {
          "@type": "Question",
          "name": "Will the Wizzride cab depart on time if only one seat is booked?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride cabs prioritize punctuality and will depart on time, even if only one seat is booked."
          }
        },
        {
          "@type": "Question",
          "name": "What if I have a lot of luggage when traveling with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride allows each passenger up to two bags: one up to 21.5 x 15.5 x 9.5 inches and a smaller handbag. Please inform us if you have extra luggage."
          }
        },
        {
          "@type": "Question",
          "name": "What if I need help or have special requests during my Wizzride trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride drivers are trained to accommodate special requests. Communicate any needs, and we'll do our best to assist."
          }
        },
        {
          "@type": "Question",
          "name": "Lost something in a Wizzride cab? How to report and retrieve it?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contact Wizzride customer support at +91 7478493874 if you have misplaced an item. We'll assist in locating and returning your item."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to book a separate seat for my child with Wizzride?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride requires separate bookings for children 2 years and older. Children under 2 may need to present proof of age if requested."
          }
        },
        {
          "@type": "Question",
          "name": "Can I bring my pet in a Wizzride cab?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pets are not allowed in Wizzride shared cabs. For private cabs, pets are allowed with a valid vaccine certificate."
          }
        },
        {
          "@type": "Question",
          "name": "What refreshments does Wizzride provide onboard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride provides refreshments, including a packet of chips, a snack, and either water or juice."
          }
        },
        {
          "@type": "Question",
          "name": "Can I change my name or pickup/drop location on my Wizzride ticket?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride does not permit changes to name, pickup location, or destination after booking."
          }
        },
        {
          "@type": "Question",
          "name": "What if I miss my Wizzride cab?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you miss your Wizzride cab and do not have your ticket scanned on time, it will be considered a no-show and your ticket will be canceled."
          }
        },
        {
          "@type": "Question",
          "name": "Does Wizzride offer discounts for frequent riders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Wizzride provides loyalty discounts for frequent riders. Contact +91 7478493874 for more details."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get a receipt or invoice for my Wizzride trip?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride automatically emails invoices. For additional assistance, email customersupport@wizzride.com."
          }
        },
        {
          "@type": "Question",
          "name": "How long does Wizzride's refund procedure take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride refunds typically take 5-7 business days to process. For questions, contact customersupport@wizzride.com or call +91 7478493874."
          }
        },
        {
          "@type": "Question",
          "name": "Can I reschedule my Wizzride cab in case of a delayed train arrival?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Wizzride allows a 15-minute grace period for delays. For longer delays, you may reschedule within the same day based on seat and cab availability."
          }
        }
      ]
    });

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
          "name": "Frequently Asked Questions",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/frequentlyaskedquestions"
          }
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
    // Initialize only search and scroll features (FAQ accordion is handled globally)
    setTimeout(() => {
      this.initFaqSearch();
      this.initFadeScrollObserver();
      this.initFormSubmissions();
    }, 100);
  }

  ngOnDestroy(): void {
    // Disconnect intersection observer
    if (this.fadeScrollObserver) {
      this.fadeScrollObserver.disconnect();
    }
  }

  // FAQ accordion is handled globally in app.component.ts

  // FAQ hover effects are handled globally in app.component.ts

  // Form submission handling
  private initFormSubmissions(): void {
    const submitButtons = this.elementRef.nativeElement.querySelectorAll('button[type="submit"]');
    
    submitButtons.forEach((button: Element, index: number) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Find the associated textarea
        const textarea = button.previousElementSibling as HTMLTextAreaElement;
        
        if (textarea && textarea.tagName === 'TEXTAREA') {
          const question = textarea.value.trim();
          
          if (question) {
            const formData = {
              question: question,
              formNumber: index + 1,
              timestamp: new Date().toLocaleString(),
              section: index === 0 ? 'Shared Cabs' : 'Reserved Cabs'
            };
            
            // Show data in alert
            alert(`Form ${formData.formNumber} Submitted!\n\n` +
                  `Section: ${formData.section}\n` +
                  `Question: ${formData.question}\n` +
                  `Submitted at: ${formData.timestamp}\n\n` +
                  `Thank you for your question! We'll get back to you soon.`);
            
            // Clear the textarea
            textarea.value = '';
            
            console.log('Form submitted:', formData);
          } else {
            alert('Please enter your question before submitting.');
          }
        }
      });
    });
  }

  // FAQ Search functionality
  private initFaqSearch(): void {
    const searchInput = this.elementRef.nativeElement.querySelector('#faqSearch') as HTMLInputElement;
    const noResults = this.elementRef.nativeElement.querySelector('#noResults') as HTMLElement;
    const faqItems = this.elementRef.nativeElement.querySelectorAll('.faq-item');
    
    if (searchInput && noResults) {
      searchInput.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const searchTerm = target.value.toLowerCase().trim();
        let hasVisibleItems = false;
        
        faqItems.forEach((item: HTMLElement) => {
          const question = item.querySelector('.faq-question h3')?.textContent?.toLowerCase() || '';
          const answer = item.querySelector('.faq-answer p')?.textContent?.toLowerCase() || '';
          
          if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            hasVisibleItems = true;
          } else {
            item.style.display = 'none';
            item.classList.remove('active');
            const icon = item.querySelector('.faq-icon i') as HTMLElement;
            if (icon) icon.style.transform = 'rotate(0deg)';
          }
        });
        
        // Show/hide no results message
        if (searchTerm && !hasVisibleItems) {
          noResults.style.display = 'block';
        } else {
          noResults.style.display = 'none';
        }
      });
    }
  }

  // Fade scroll animation with IntersectionObserver
  private initFadeScrollObserver(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.fadeScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeScrollElements = this.elementRef.nativeElement.querySelectorAll('.fade-scroll');
    fadeScrollElements.forEach((el: Element) => {
      this.fadeScrollObserver?.observe(el);
    });
  }
}
