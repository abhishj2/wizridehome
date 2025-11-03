import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

@Component({
  selector: 'app-newsandannouncements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsandannouncements.component.html',
  styleUrl: './newsandannouncements.component.css'
})
export class NewsandannouncementsComponent implements OnInit, AfterViewInit, OnDestroy {
  private modernSliderInstance: ModernSlider | null = null;
  announcements: Announcement[] = [];
  isLoadingAnnouncements = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Component initialization
    this.fetchAnnouncements();
  }

  fetchAnnouncements(): void {
    this.isLoadingAnnouncements = true;
    this.http.get<Announcement[]>('http://wizcms.test/wp-json/wp/v2/announcements')
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
    // Create a temporary div to strip HTML tags
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    return temp.textContent || temp.innerText || '';
  }

  ngAfterViewInit(): void {
    // Initialize after view is ready
    setTimeout(() => {
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
    const typewriterElement = document.querySelector('.typewriter-line') as HTMLElement;
    if (!typewriterElement) return;

    const text = 'News & Updates';
    let i = 0;

    typewriterElement.textContent = '';
    typewriterElement.style.width = 'auto';
    typewriterElement.style.borderRight = '3px solid #f59e0b';

    const type = () => {
      if (i < text.length) {
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, 150);
      } else {
        setTimeout(() => {
          typewriterElement.style.animation = 'blink-cursor 1s infinite';
        }, 500);
      }
    };

    setTimeout(type, 1000);
  }

  // Hero Stats Counter Animation
  animateCounters(): void {
    const statItems = document.querySelectorAll('.stat-item[data-counter]');

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
    this.modernSliderInstance = new ModernSlider();
  }

  // Setup Event Listeners
  setupEventListeners(): void {
    // Action cards
    document.querySelectorAll('.action-card').forEach(card => {
      card.addEventListener('click', () => {
        const service = (card as HTMLElement).dataset['service'];
        console.log(`Exploring: ${service}`);
      });
    });

    // Social Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = (btn as HTMLElement).dataset['platform'];
        const card = (btn as HTMLElement).closest('.offer-card');
        if (!card) return;

        const title = card.querySelector('h3')?.textContent || '';
        const link = window.location.href;

        this.shareContent(platform || '', title, link);
      });
    });

    // Toggle Details buttons
    document.querySelectorAll('.toggle-details').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const card = (button as HTMLElement).closest('.feacard');
        if (!card) return;

        const moreContent = card.querySelector('.more-content');
        if (!moreContent) return;

        const isOpen = moreContent.classList.contains('show');
        moreContent.classList.toggle('show');
        (button as HTMLElement).textContent = isOpen ? 'View Details' : 'Hide Details';
      });
    });

    // Filter functionality
    this.setupFilterButtons();
  }

  // Setup Filter Buttons
  setupFilterButtons(): void {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const allSlides = document.querySelectorAll('.slider-track .slide');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = (button as HTMLElement).dataset['filter'];

        allSlides.forEach(slide => {
          (slide as HTMLElement).style.display = 'none';
          (slide as HTMLElement).style.order = '999';
        });

        let visibleIndex = 0;
        allSlides.forEach(slide => {
          if (filter === 'all' || (slide as HTMLElement).dataset['category'] === filter) {
            (slide as HTMLElement).style.display = 'flex';
            (slide as HTMLElement).style.order = visibleIndex.toString();
            visibleIndex++;
          }
        });

        const sliderTrack = document.querySelector('.slider-track') as HTMLElement;
        if (sliderTrack) {
          sliderTrack.style.transform = 'translateX(0%)';
        }

        if (this.modernSliderInstance) {
          this.modernSliderInstance.destroy();
        }

        setTimeout(() => {
          this.modernSliderInstance = new ModernSlider();
          console.log('Slider reinitialized');
        }, 100);
      });
    });
  }

  // Share Content
  shareContent(platform: string, title: string, link: string): void {
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

  constructor() {
    this.sliderContainer = document.querySelector('.slider-container');
    this.sliderTrack = document.querySelector('.slider-track');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');

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

    document.addEventListener('keydown', this.onKeyDown);
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
    document.removeEventListener('keydown', this.onKeyDown);
  }

  updateSlideCount(): void {
    this.slides = Array.from(document.querySelectorAll('.slide:not([style*="display: none"])'));
    this.slideCount = this.slides.length;
    this.currentSlide = 0;

    const dotsContainer = document.querySelector('.slider-dots');
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
        const dot = document.createElement('button');
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
