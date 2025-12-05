import { Component, AfterViewInit, Renderer2, OnInit, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-ourvision',
  standalone: true,
  imports: [],
  templateUrl: './ourvision.component.html',
  styleUrl: './ourvision.component.css'
})
export class OurvisionComponent implements AfterViewInit {
  
  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}
  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/aboutcompany/ourvision');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Wizzride: Premier Shared Cab and Tour Services in Northeast India");
    this.metaService.updateTag({
      name: 'description',
      content: "Wizzride's commitment to creating a sustainable travel solution that redefines shared mobility and inter-city connectivity across Northeast India."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Wizzride: Premier Shared Cab and Tour Services in Northeast India"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride: Premier Shared Cab and Tour Services in Northeast India' });
    this.metaService.updateTag({ property: 'og:description', content: "Wizzride's commitment to creating a sustainable travel solution that redefines shared mobility and inter-city connectivity across Northeast India." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/aboutcompany/ourvision' });
    this.metaService.updateTag({ property: 'og:image', content: 'assets/images/aboutimages/aboutvision.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride: Premier Shared Cab and Tour Services in Northeast India' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Wizzride's commitment to creating a sustainable travel solution that redefines shared mobility and inter-city connectivity across Northeast India."});
    this.metaService.updateTag({ name: 'twitter:image', content: 'assets/images/aboutimages/aboutvision.jpg' });
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Our Vision",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/aboutcompany/ourvision"
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
