import { Component, AfterViewInit, Renderer2, OnInit, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements AfterViewInit {
  
  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/aboutcompany');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride: Premier Shared Cab and Tour Services in Northeast India");
    this.metaService.updateTag({
      name: 'description',
      content: "Discover Wizzride, a leading travel management and shared cab company in Northeast India, offering reliable tour packages and comfortable travel solutions."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride: Premier Shared Cab and Tour Services in Northeast India"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride: Premier Shared Cab and Tour Services in Northeast India' });
    this.metaService.updateTag({ property: 'og:description', content: 'Discover Wizzride, a leading travel management and shared cab company in Northeast India, offering reliable tour packages and comfortable travel solutions.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/aboutcompany' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride: Premier Shared Cab and Tour Services in Northeast India' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Discover Wizzride, a leading travel management and shared cab company in Northeast India, offering reliable tour packages and comfortable travel solutions.' });
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
          "name": "About Company",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/aboutcompany"
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
  }    

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }


  ngAfterViewInit(): void {
    // Animation on scroll
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

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // Staggered animation delays
    function applyStaggeredDelay(selector: string) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        (element as HTMLElement).style.transitionDelay = `${index * 0.2}s`;
      });
    }

    applyStaggeredDelay('.value-card');
    applyStaggeredDelay('.timeline-item');
  }

}
