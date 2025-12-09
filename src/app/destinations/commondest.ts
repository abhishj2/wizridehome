import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonDestinationService {
  private renderer: Renderer2;
  private autoPlayInterval: any;
  private currentSlide = 0;
  private isAnimating = false;
  private cloneCount = 0;
  private originalSlides: Element[] = [];
  private listeners: (() => void)[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) @Optional() private document: Document | null
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize all common destination page functionality
   * Call this from ngAfterViewInit in your component
   */
  initializeDestinationPage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // initPageFadeIn disabled - causes SSR errors
    this.initSmoothScroll();
    this.initIntersectionObserver();
    this.initHoverEffects();
    this.initTypingEffect();
    this.initSectionTitles();
    this.initHowToSteps();
    this.initSlider();
  }

  /**
   * Clean up all event listeners
   * Call this from ngOnDestroy in your component
   */
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
    this.stopAutoPlay();
  }

  // ================== PAGE LOAD FADE-IN ==================
  // DISABLED - Causes SSR errors. This is a visual enhancement only.
  private initPageFadeIn(): void {
    // Fully disabled to avoid SSR access; keep as a no-op.
    return;
  }

  // ================== SMOOTH SCROLL ==================
  private initSmoothScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    const links = this.document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      const listener = this.renderer.listen(link, 'click', (e: Event) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute("href");
        if (targetId && this.document) {
          const target = this.document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
      this.listeners.push(listener);
    });
  }

  // ================== INTERSECTION OBSERVER ==================
  private initIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    try {
      const IntersectionObserverClass = typeof IntersectionObserver !== 'undefined' ? IntersectionObserver : null;
      if (!IntersectionObserverClass) return;
      
      const observer = new IntersectionObserverClass(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

      this.document.querySelectorAll(".animate-on-scroll").forEach(el => observer.observe(el));
    } catch {
      // Silently ignore
    }
  }

  // ================== HOVER EFFECTS ==================
  private initHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    // Button hover effects
    this.document.querySelectorAll(".btn-c").forEach(button => {
      const mouseenterListener = this.renderer.listen(button, 'mouseenter', () => {
        (button as HTMLElement).style.transform = "translateY(-3px) scale(1.02)";
      });
      const mouseleaveListener = this.renderer.listen(button, 'mouseleave', () => {
        (button as HTMLElement).style.transform = "translateY(0) scale(1)";
      });
      this.listeners.push(mouseenterListener, mouseleaveListener);
    });

    // Card hover effects
    this.document.querySelectorAll(".carfe").forEach((card, i) => {
      const mouseenterListener = this.renderer.listen(card, 'mouseenter', () => {
        (card as HTMLElement).style.transform = "translateY(-10px) scale(1.02)";
        (card as HTMLElement).style.zIndex = "10";
      });
      const mouseleaveListener = this.renderer.listen(card, 'mouseleave', () => {
        (card as HTMLElement).style.transform = "translateY(0) scale(1)";
        (card as HTMLElement).style.zIndex = "1";
      });
      (card as HTMLElement).style.animationDelay = `${i * 0.1}s`;
      this.listeners.push(mouseenterListener, mouseleaveListener);
    });
  }

  // ================== TYPING EFFECT ==================
  private initTypingEffect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    const heroTitle = this.document.querySelector(".mainbann h1") as HTMLElement;
    if (heroTitle) {
      const text = heroTitle.textContent || '';
      heroTitle.textContent = "";
      let i = 0;
      const typeWriter = () => {
        if (i < text.length && isPlatformBrowser(this.platformId)) {
          heroTitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      setTimeout(typeWriter, 500);
    }
  }

  // ================== SECTION TITLES ==================
  private initSectionTitles(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    this.document.querySelectorAll(".section-title, .section-subtitle").forEach((title, i) => {
      (title as HTMLElement).style.opacity = "0";
      (title as HTMLElement).style.transform = "translateY(20px)";
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          (title as HTMLElement).style.transition = "all 0.8s ease-out";
          (title as HTMLElement).style.opacity = "1";
          (title as HTMLElement).style.transform = "translateY(0)";
        }
      }, 300 + i * 200);
    });
  }

  // ================== HOW-TO STEPS ==================
  private initHowToSteps(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document || typeof window === 'undefined') return;
    
    const steps = this.document.querySelectorAll(".howto-step");
    const revealSteps = () => {
      if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;
      const triggerBottom = window.innerHeight * 0.85;
      steps.forEach((step, i) => {
        if (step.getBoundingClientRect().top < triggerBottom) {
          setTimeout(() => step.classList.add("visible"), i * 200);
        }
      });
    };
    
    const scrollListener = this.renderer.listen('window', 'scroll', revealSteps);
    this.listeners.push(scrollListener);
    revealSteps();
  }

  // ================== SLIDER ==================
  private initSlider(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.document) return;
    
    const sliderContainer = this.document.querySelector(".slider-container");
    if (!sliderContainer) return;

    const sliderTrack = sliderContainer.querySelector(".slider-track") as HTMLElement;
    if (!sliderTrack) return;

    this.originalSlides = Array.from(sliderContainer.querySelectorAll(".slide"));
    const bulletNav = sliderContainer.querySelector(".slider-nav .bullet-nav");

    const getSlidesPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 3;
      return 4;
    };

    const clearClones = () => {
      sliderTrack.innerHTML = "";
      this.originalSlides.forEach(slide => sliderTrack.appendChild(slide.cloneNode(true)));
    };

    const setupInfiniteLoop = () => {
      const slidesPerView = getSlidesPerView();
      this.cloneCount = slidesPerView;
      clearClones();

      // Append & Prepend clones
      for (let i = 0; i < this.cloneCount; i++) {
        sliderTrack.appendChild(this.originalSlides[i].cloneNode(true));
      }
      for (let i = this.originalSlides.length - this.cloneCount; i < this.originalSlides.length; i++) {
        sliderTrack.insertBefore(this.originalSlides[i].cloneNode(true), sliderTrack.firstChild);
      }

      this.currentSlide = this.cloneCount;
      updateSliderPosition(false);
      setupBullets();
      updateBullets();
    };

    const updateSliderPosition = (withTransition = true) => {
      const slidesPerView = getSlidesPerView();
      const slideWidth = (sliderContainer as HTMLElement).offsetWidth / slidesPerView;
      sliderTrack.style.transition = withTransition ? "transform 0.8s ease" : "none";
      sliderTrack.style.transform = `translate3d(-${this.currentSlide * slideWidth}px,0,0)`;
    };

    const goToSlide = (index: number) => {
      if (this.isAnimating) return;
      const totalSlides = sliderTrack.children.length;
      this.currentSlide = index;
      this.isAnimating = true;
      updateSliderPosition(true);

      const onEnd = () => {
        if (this.currentSlide >= totalSlides - this.cloneCount) {
          this.currentSlide = this.cloneCount;
          updateSliderPosition(false);
        } else if (this.currentSlide < this.cloneCount) {
          this.currentSlide = totalSlides - this.cloneCount * 2;
          updateSliderPosition(false);
        }
        this.isAnimating = false;
        updateBullets();
        sliderTrack.removeEventListener("transitionend", onEnd);
      };
      sliderTrack.addEventListener("transitionend", onEnd);
    };

    const setupBullets = () => {
      if (!bulletNav) return;
      bulletNav.innerHTML = "";
      const slidesPerView = getSlidesPerView();
      const pageCount = Math.ceil(this.originalSlides.length / slidesPerView);
      for (let i = 0; i < pageCount; i++) {
        if (!this.document) return;
        const bullet = this.document.createElement("button");
        bullet.className = "bullet";
        bullet.setAttribute("aria-label", `Go to slide ${i + 1}`);
        const listener = this.renderer.listen(bullet, 'click', () => {
          goToSlide(i * slidesPerView + this.cloneCount);
          this.stopAutoPlay();
        });
        this.listeners.push(listener);
        bulletNav.appendChild(bullet);
      }
    };

    const updateBullets = () => {
      if (!bulletNav) return;
      const slidesPerView = getSlidesPerView();
      const activeIndex = Math.floor((this.currentSlide - this.cloneCount) / slidesPerView);
      bulletNav.querySelectorAll(".bullet").forEach((b, i) => {
        b.classList.toggle("active", i === activeIndex);
      });
    };

    const nextSlide = () => {
      goToSlide(this.currentSlide + getSlidesPerView());
    };

    const startAutoPlay = () => {
      this.stopAutoPlay();
      this.autoPlayInterval = setInterval(nextSlide, 5000);
    };

    // Mouse events
    const mouseenterListener = this.renderer.listen(sliderContainer, 'mouseenter', () => {
      this.stopAutoPlay();
    });
    const mouseleaveListener = this.renderer.listen(sliderContainer, 'mouseleave', () => {
      startAutoPlay();
    });
    this.listeners.push(mouseenterListener, mouseleaveListener);

    // Swipe events
    let startX = 0;
    const touchstartListener = this.renderer.listen(sliderContainer, 'touchstart', (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    });
    const touchendListener = this.renderer.listen(sliderContainer, 'touchend', (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          goToSlide(this.currentSlide - getSlidesPerView());
        }
        this.stopAutoPlay();
      }
    });
    this.listeners.push(touchstartListener, touchendListener);

    setupInfiniteLoop();
    startAutoPlay();

    const resizeListener = this.renderer.listen('window', 'resize', setupInfiniteLoop);
    this.listeners.push(resizeListener);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

