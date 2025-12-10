import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService } from '../services/seo.service';

interface Announcement {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    link_to_any?: string;
  };
}

interface FeaturedOffer {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  featured_media: number;
  offer_category: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

interface PressRelease {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    pdf_file?: {
      url: string;
      filename: string;
      filesize: number;
    } | string;
  };
}

interface BlogPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

@Component({
  selector: 'app-newsandannouncements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './newsandannouncements.component.html',
  styleUrl: './newsandannouncements.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NewsandannouncementsComponent implements OnInit, AfterViewInit, OnDestroy {
  private modernSliderInstance: ModernSlider | null = null;
  announcements: Announcement[] = [];
  isLoadingAnnouncements = true;
  featuredOffers: FeaturedOffer[] = [];
  filteredOffers: FeaturedOffer[] = [];
  isLoadingOffers = true;
  activeFilter = 'all';
  pressReleases: PressRelease[] = [];
  isLoadingPressReleases = true;
  blogPosts: BlogPost[] = [];
  isLoadingBlogPosts = true;

  constructor(
    private http: HttpClient,
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Component initialization
    this.setMetaTags();
    this.fetchAnnouncements();
    this.fetchFeaturedOffers();
    this.fetchPressReleases();
    this.fetchBlogPosts();
  }

  setMetaTags(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/newsandannouncements');
    
    // SEO Metadata
    this.titleService.setTitle('Wizzride News & Announcements - Latest Updates & Travel Alerts');
    this.metaService.updateTag({
      name: 'description',
      content: "Stay updated with Wizzride's latest news, service announcements, travel updates, and important alerts for our cab services and tour packages across destinations."
    });
    this.metaService.updateTag({
      name: 'title',
      content: 'Wizzride News & Announcements - Latest Updates & Travel Alerts'
    });
    

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Wizzride News & Announcements - Latest Updates & Travel Alerts' });
    this.metaService.updateTag({ property: 'og:description', content: "Stay updated with Wizzride's latest news, service announcements, travel updates, and important alerts for our cab services and tour packages across destinations." });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/newsandannouncements' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizztest.com/assets/images/pexels-neosiam-590059.jpg' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Wizzride News & Announcements - Latest Updates & Travel Alerts' });
    this.metaService.updateTag({ name: 'twitter:description', content: "Stay updated with Wizzride's latest news, service announcements, travel updates, and important alerts for our cab services and tour packages across destinations."});
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizztest.com/assets/images/pexels-neosiam-590059.jpg' });
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
          "name": "News & Announcements",
          "item": {
            "@type": "WebPage",
            "@id": "https://wizzride.com/newsandannouncements"
          }
        }
      ]
    });

    // Organization JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Wizzride",
      "url": "https://wizzride.com",
      "logo": "https://wizzride.com/assets/images/icons/logo2.webp",
      "description": "Wizzride - Your trusted partner for cab services, flight bookings, and travel solutions in Northeast India.",
      "sameAs": [
        "https://www.facebook.com/wizzride",
        "https://twitter.com/wizzride",
        "https://www.instagram.com/wizzride"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9775999444",
        "contactType": "Customer Service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      }
    });

    // NewsArticle/Blog Posting Schema
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "News & Announcements",
      "description": "Latest news, announcements, offers, and press releases from Wizzride",
      "url": "https://wizzride.com/newsandannouncements",
      "publisher": {
        "@type": "Organization",
        "name": "Wizzride",
        "logo": {
          "@type": "ImageObject",
          "url": "https://wizzride.com/assets/images/icons/logo2.webp"
        }
      }
    });
  }

  // Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    // Only inject if document is available
    if(this.document && this.document.head) {
      const script = this.renderer.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaObject);
      this.renderer.appendChild(this.document.head, script);
    }
  }

  fetchBlogPosts(): void {
    this.isLoadingBlogPosts = true;
    this.http.get<BlogPost[]>('https://cms.wizztest.com/wp-json/wp/v2/posts?_embed&per_page=5')
      .subscribe({
        next: (data) => {
          this.blogPosts = data;
          this.isLoadingBlogPosts = false;
          console.log('Blog posts loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching blog posts:', error);
          this.isLoadingBlogPosts = false;
          this.blogPosts = [];
        }
      });
  }

  fetchPressReleases(): void {
    this.isLoadingPressReleases = true;
    this.http.get<PressRelease[]>('https://cms.wizztest.com/wp-json/wp/v2/press_releases')
      .subscribe({
        next: (data) => {
          this.pressReleases = data;
          this.isLoadingPressReleases = false;
          console.log('Press releases loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching press releases:', error);
          this.isLoadingPressReleases = false;
          this.pressReleases = [];
        }
      });
  }

  getPdfUrl(pressRelease: PressRelease): string {
    if (pressRelease.acf && pressRelease.acf.pdf_file) {
      // Check if pdf_file is an object with url property
      if (typeof pressRelease.acf.pdf_file === 'object' && 'url' in pressRelease.acf.pdf_file) {
        return pressRelease.acf.pdf_file.url;
      }
      // Check if pdf_file is a string (direct URL)
      if (typeof pressRelease.acf.pdf_file === 'string') {
        return pressRelease.acf.pdf_file;
      }
    }
    return '#'; // Fallback if no PDF
  }

  hasPdf(pressRelease: PressRelease): boolean {
    return !!(pressRelease.acf && pressRelease.acf.pdf_file);
  }

  getTruncatedContent(htmlContent: string, maxLength: number = 120): string {
    // Always use SSR-safe regex method - works in both SSR and browser
    // This method is called from template, so it must be SSR-safe
    const plainText = htmlContent
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[^;]+;/g, ' ') // Remove any remaining entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Truncate and add ellipsis
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength).trim() + ' ...';
    }
    return plainText;
  }

  fetchFeaturedOffers(): void {
    this.isLoadingOffers = true;
    this.http.get<FeaturedOffer[]>('https://cms.wizztest.com/wp-json/wp/v2/featured_offers?_embed')
      .subscribe({
        next: (data) => {
          this.featuredOffers = data;
          this.filteredOffers = data;
          this.isLoadingOffers = false;
          console.log('Featured offers loaded:', data);
          
          // Debug: Log the content to see what's being received
          data.forEach((offer, index) => {
            console.log(`Offer ${index + 1} content:`, offer.content.rendered);
          });
          
          // Reinitialize slider and event listeners after data loads
          setTimeout(() => {
            if (this.modernSliderInstance) {
              this.modernSliderInstance.destroy();
            }
            // Check platform before accessing DOM
            if (isPlatformBrowser(this.platformId)) {
                this.modernSliderInstance = new ModernSlider(this.document, this.platformId);
                this.attachToggleDetailListeners();
                this.attachShareButtonListeners();
            }
          }, 100);
        },
        error: (error) => {
          console.error('Error fetching featured offers:', error);
          this.isLoadingOffers = false;
          this.featuredOffers = [];
          this.filteredOffers = [];
        }
      });
  }

  filterOffers(category: string): void {
    this.activeFilter = category;
    if (category === 'all') {
      this.filteredOffers = this.featuredOffers;
    } else {
      this.filteredOffers = this.featuredOffers.filter(offer => {
        if (offer._embedded && offer._embedded['wp:term'] && offer._embedded['wp:term'][0]) {
          return offer._embedded['wp:term'][0].some(term => term.slug === category);
        }
        return false;
      });
    }
    
    // Reinitialize slider and event listeners after filtering
    setTimeout(() => {
      if (this.modernSliderInstance) {
        this.modernSliderInstance.destroy();
      }
      
      if (isPlatformBrowser(this.platformId)) {
          this.modernSliderInstance = new ModernSlider(this.document, this.platformId);
          this.attachToggleDetailListeners();
          this.attachShareButtonListeners();
      }
    }, 100);
  }

  getOfferImage(offer: FeaturedOffer): string {
    if (offer._embedded && offer._embedded['wp:featuredmedia'] && offer._embedded['wp:featuredmedia'][0]) {
      return offer._embedded['wp:featuredmedia'][0].source_url;
    }
    return '../../assets/images/cab.jpg'; // Default fallback image
  }

  getOfferImageAlt(offer: FeaturedOffer): string {
    if (offer._embedded && offer._embedded['wp:featuredmedia'] && offer._embedded['wp:featuredmedia'][0]) {
      return offer._embedded['wp:featuredmedia'][0].alt_text || offer.title.rendered;
    }
    return offer.title.rendered;
  }

  getOfferCategory(offer: FeaturedOffer): string {
    if (offer._embedded && offer._embedded['wp:term'] && offer._embedded['wp:term'][0] && offer._embedded['wp:term'][0][0]) {
      return offer._embedded['wp:term'][0][0].name;
    }
    return 'Offer';
  }

  getOfferCategorySlug(offer: FeaturedOffer): string {
    if (offer._embedded && offer._embedded['wp:term'] && offer._embedded['wp:term'][0] && offer._embedded['wp:term'][0][0]) {
      return offer._embedded['wp:term'][0][0].slug;
    }
    return 'all';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  fetchAnnouncements(): void {
    this.isLoadingAnnouncements = true;
    this.http.get<Announcement[]>('https://cms.wizztest.com/wp-json/wp/v2/announcements')
      .subscribe({
        next: (data) => {
          this.announcements = data;
          this.isLoadingAnnouncements = false;
          console.log('Announcements loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching announcements:', error);
          this.isLoadingAnnouncements = false;
          // Fallback to empty array or show error message
          this.announcements = [];
        }
      });
  }

  getPlainTextContent(htmlContent: string): string {
    // SSR-safe: use regex to strip HTML tags (works in both SSR and browser)
    // This method is called from template, so it must be SSR-safe
    // NO document access - pure string manipulation only
    if (!htmlContent) return '';
    
    try {
      return htmlContent
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&[^;]+;/g, ' ') // Remove any remaining entities
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    } catch {
      // Fallback: return empty string if anything fails
      return '';
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Initialize after view is ready
    setTimeout(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.typeWriter();
      this.animateCounters();
      this.initializeSlider();
      this.setupEventListeners();
    }, 100);
  }

  ngOnDestroy(): void {
    // Cleanup
    if (this.modernSliderInstance) {
      this.modernSliderInstance.destroy();
    }
  }

  // Typewriter Effect
  typeWriter(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    
    const typewriterElement = this.document.querySelector('.typewriter-line') as HTMLElement;
    if (!typewriterElement) return;

    const text = 'News & Updates';
    let i = 0;

    typewriterElement.textContent = '';
    typewriterElement.style.width = 'auto';
    typewriterElement.style.borderRight = '3px solid #f59e0b';

    const type = () => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, 150);
      } else {
        setTimeout(() => {
          if (isPlatformBrowser(this.platformId)) {
            typewriterElement.style.animation = 'blink-cursor 1s infinite';
          }
        }, 500);
      }
    };

    setTimeout(type, 1000);
  }

  // Hero Stats Counter Animation
  animateCounters(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    const statItems = this.document.querySelectorAll('.stat-item[data-counter]');

    statItems.forEach((item, index) => {
      const counter = item.getAttribute('data-counter');
      const numberElement = item.querySelector('.stat-number') as HTMLElement;
      if (!numberElement || !counter) return;

      const isPercentage = counter.includes('%');
      const isSpecial = counter === '24';

      if (isSpecial) {
        setTimeout(() => {
          numberElement.textContent = '24/7';
        }, 5500 + index * 500);
      } else {
        const targetNumber = parseInt(counter);
        let currentNumber = 0;
        const increment = targetNumber / 20;

        const countUp = () => {
          currentNumber += increment;
          if (currentNumber >= targetNumber) {
            numberElement.textContent = targetNumber + (isPercentage ? '%' : '');
          } else {
            numberElement.textContent = Math.floor(currentNumber) + (isPercentage ? '%' : '');
            requestAnimationFrame(countUp);
          }
        };

        setTimeout(() => {
          countUp();
        }, 5500 + index * 500);
      }
    });
  }

  // Initialize Slider
  initializeSlider(): void {
    if (isPlatformBrowser(this.platformId)) {
        this.modernSliderInstance = new ModernSlider(this.document, this.platformId);
    }
  }

  // Setup Event Listeners
  setupEventListeners(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    // Action cards
    this.document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('click', () => {
        const service = (card as HTMLElement).dataset['service'];
        console.log(`Exploring: ${service}`);
      });
    });

    this.attachShareButtonListeners();
    this.attachToggleDetailListeners();

    // Filter functionality
    this.setupFilterButtons();
  }

  // Attach Toggle Detail Listeners (for dynamically loaded content)
  attachToggleDetailListeners(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    this.document.querySelectorAll('.toggle-details').forEach(button => {
      // Remove existing listener if any
      const newButton = button.cloneNode(true);
      button.parentNode?.replaceChild(newButton, button);
      
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        const card = (newButton as HTMLElement).closest('.feacard');
        if (!card) return;

        const moreContent = card.querySelector('.more-content');
        if (!moreContent) return;

        const isOpen = moreContent.classList.contains('show');
        moreContent.classList.toggle('show');
        (newButton as HTMLElement).textContent = isOpen ? 'View Details' : 'Hide Details';
      });
    });
  }

  // Attach Share Button Listeners (for dynamically loaded content)
  attachShareButtonListeners(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document) return;
    this.document.querySelectorAll('.share-btn').forEach(btn => {
      // Remove existing listener if any
      const newBtn = btn.cloneNode(true);
      btn.parentNode?.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = (newBtn as HTMLElement).dataset['platform'];
        const card = (newBtn as HTMLElement).closest('.offer-card');
        if (!card) return;

        const title = card.querySelector('h3')?.textContent || '';
        const link = window.location.href;

        this.shareContent(platform || '', title, link);
      });
    });
  }

  // Setup Filter Buttons
  setupFilterButtons(): void {
    // Filter buttons are now handled by Angular click events in the template
    // This method is kept for compatibility but logic moved to filterOffers()
  }

  // Share Content
  shareContent(platform: string, title: string, link: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const text = `${title} - Check out this amazing offer!`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(link);

    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}&quote=${encodedText}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }
}

// Modern Slider Class
class ModernSlider {
  sliderContainer: Element | null;
  sliderTrack: Element | null;
  prevBtn: Element | null;
  nextBtn: Element | null;
  slides: Element[];
  dots: Element[];
  slideCount: number;
  currentSlide: number;
  autoplayInterval: any;
  autoplayDelay: number;
  isHovered: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  onKeyDown: (e: KeyboardEvent) => void;

  constructor(
    private document: Document,
    private platformId: Object
  ) {
    if (!isPlatformBrowser(this.platformId) || !this.document) {
      // Initialize with null values for SSR
      this.sliderContainer = null;
      this.sliderTrack = null;
      this.prevBtn = null;
      this.nextBtn = null;
      this.slides = [];
      this.dots = [];
      this.slideCount = 0;
      this.currentSlide = 0;
      this.autoplayInterval = null;
      this.autoplayDelay = 5000;
      this.isHovered = false;
      this.onPrevClick = () => {};
      this.onNextClick = () => {};
      this.onKeyDown = () => {};
      return;
    }
    
    this.sliderContainer = this.document.querySelector('.slider-container');
    this.sliderTrack = this.document.querySelector('.slider-track');
    this.prevBtn = this.document.querySelector('.prev-btn');
    this.nextBtn = this.document.querySelector('.next-btn');

    this.onPrevClick = this.prevSlide.bind(this);
    this.onNextClick = this.nextSlide.bind(this);
    this.onKeyDown = this.handleKeyDown.bind(this);

    this.currentSlide = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    this.isHovered = false;
    this.slides = [];
    this.dots = [];
    this.slideCount = 0;

    this.updateSlideCount();
    this.init();
  }

  init(): void {
    if (!this.sliderContainer) return;
    this.setupEventListeners();
    this.updateSlides();
    this.startAutoplay();
    console.log('Slider initialized with', this.slideCount, 'slides');
  }

  setupEventListeners(): void {
    if (!this.sliderContainer) return;

    if (this.prevBtn) this.prevBtn.addEventListener('click', this.onPrevClick);
    if (this.nextBtn) this.nextBtn.addEventListener('click', this.onNextClick);

    this.sliderContainer.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.stopAutoplay();
    });

    this.sliderContainer.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.startAutoplay();
    });

    let startX = 0;
    this.sliderContainer.addEventListener('touchstart', ((e: TouchEvent) => {
      startX = e.touches[0].clientX;
    }) as EventListener);

    this.sliderContainer.addEventListener('touchend', ((e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    }) as EventListener);

    if (this.document) {
      this.document.addEventListener('keydown', this.onKeyDown);
    }
  }

  destroy(): void {
    this.stopAutoplay();
    if (this.prevBtn) this.prevBtn.removeEventListener('click', this.onPrevClick);
    if (this.nextBtn) this.nextBtn.removeEventListener('click', this.onNextClick);
    if (this.dots && this.dots.length) {
      this.dots.forEach((dot) => {
        const handler = (dot as any)._clickHandler;
        if (handler) {
          dot.removeEventListener('click', handler);
        }
      });
    }
    if (this.document) {
      this.document.removeEventListener('keydown', this.onKeyDown);
    }
  }

  updateSlideCount(): void {
    if (!this.document) return;
    this.slides = Array.from(this.document.querySelectorAll('.slide:not([style*="display: none"])'));
    this.slideCount = this.slides.length;
    this.currentSlide = 0;

    const dotsContainer = this.document.querySelector('.slider-dots');
    if (!dotsContainer) return;

    // Check if dots already exist in HTML
    const existingDots = dotsContainer.querySelectorAll('.dot');
    
    // If dots count matches slide count, use existing dots
    if (existingDots.length === this.slideCount) {
      this.dots = Array.from(existingDots);
      
      // Add click handlers to existing dots
      this.dots.forEach((dot, i) => {
        const clickHandler = () => this.goToSlide(i);
        dot.addEventListener('click', clickHandler);
        (dot as any)._clickHandler = clickHandler;
        
        // Set active class on first dot
        if (i === 0) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    } else {
      // Otherwise, recreate dots dynamically
      dotsContainer.innerHTML = '';
      this.dots = [];

      for (let i = 0; i < this.slideCount; i++) {
        const dot = this.document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i.toString());

        const clickHandler = () => this.goToSlide(i);
        dot.addEventListener('click', clickHandler);
        (dot as any)._clickHandler = clickHandler;

        dotsContainer.appendChild(dot);
        this.dots.push(dot);
      }
    }

    this.updateSlides();
  }

  updateSlides(): void {
    if (!this.sliderTrack) return;

    this.slides.forEach(slide => slide.classList.remove('active'));

    if (this.currentSlide >= this.slideCount) {
      this.currentSlide = 0;
    }

    (this.sliderTrack as HTMLElement).style.transform = `translateX(-${this.currentSlide * 100}%)`;

    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.add('active');
    }

    if (this.dots && this.dots.length) {
      this.dots.forEach((dot, index) => {
        (dot as HTMLElement).style.display = index < this.slideCount ? 'block' : 'none';
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }

    if (this.prevBtn) {
      (this.prevBtn as HTMLElement).style.opacity = this.currentSlide === 0 ? '0.5' : '1';
      (this.prevBtn as HTMLElement).style.display = this.slideCount <= 1 ? 'none' : 'flex';
    }
    if (this.nextBtn) {
      (this.nextBtn as HTMLElement).style.opacity = this.currentSlide === this.slideCount - 1 ? '0.5' : '1';
      (this.nextBtn as HTMLElement).style.display = this.slideCount <= 1 ? 'none' : 'flex';
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slideCount;
    this.updateSlides();
    this.resetAutoplay();
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
    this.updateSlides();
    this.resetAutoplay();
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slideCount) return;
    this.currentSlide = index;
    this.updateSlides();
    this.resetAutoplay();
  }

  startAutoplay(): void {
    if (!this.isHovered && this.slideCount > 1) {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoplayDelay);
    }
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  handleSwipe(startX: number, endX: number): void {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (e.key === 'ArrowRight') {
      this.nextSlide();
    }
  }
}