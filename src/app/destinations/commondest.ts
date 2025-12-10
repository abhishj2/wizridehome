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
  private originalSlides: any[] = []; // Changed to any[] to handle DOM elements safely
  private listeners: (() => void)[] = [];
  
  // CRITICAL FIX: Rename to _doc to avoid conflict with global 'document'
  private _doc: Document;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) doc: any
  ) {
    this._doc = doc; // Assign injected document to local property
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize all common destination page functionality
   * Call this from ngAfterViewInit in your component
   */
  initializeDestinationPage(): void {
    // 1. Guard: Stop immediately if running on Server
    if (!isPlatformBrowser(this.platformId)) return;
    
    // 2. Run initializations safely
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
  private initPageFadeIn(): void {
    // Keep disabled/empty to prevent SSR issues
    return;
  }

  // ================== SMOOTH SCROLL ==================
  private initSmoothScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const links = this._doc.querySelectorAll('a[href^="#"]');
    links.forEach((link: any) => {
      const listener = this.renderer.listen(link, 'click', (e: Event) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        if (targetId) {
          const target = this._doc.querySelector(targetId);
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
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

      this._doc.querySelectorAll(".animate-on-scroll").forEach((el: any) => observer.observe(el));
    } catch {
      // Silently ignore errors
    }
  }

  // ================== HOVER EFFECTS ==================
  private initHoverEffects(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Button hover effects
    this._doc.querySelectorAll(".btn-c").forEach((button: any) => {
      const mouseenterListener = this.renderer.listen(button, 'mouseenter', () => {
        button.style.transform = "translateY(-3px) scale(1.02)";
      });
      const mouseleaveListener = this.renderer.listen(button, 'mouseleave', () => {
        button.style.transform = "translateY(0) scale(1)";
      });
      this.listeners.push(mouseenterListener, mouseleaveListener);
    });

    // Card hover effects
    this._doc.querySelectorAll(".carfe").forEach((card: any, i: number) => {
      const mouseenterListener = this.renderer.listen(card, 'mouseenter', () => {
        card.style.transform = "translateY(-10px) scale(1.02)";
        card.style.zIndex = "10";
      });
      const mouseleaveListener = this.renderer.listen(card, 'mouseleave', () => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.zIndex = "1";
      });
      card.style.animationDelay = `${i * 0.1}s`;
      this.listeners.push(mouseenterListener, mouseleaveListener);
    });
  }

  // ================== TYPING EFFECT ==================
  private initTypingEffect(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const heroTitle = this._doc.querySelector(".mainbann h1") as HTMLElement;
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
    
    this._doc.querySelectorAll(".section-title, .section-subtitle").forEach((title: any, i: number) => {
      title.style.opacity = "0";
      title.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          title.style.transition = "all 0.8s ease-out";
          title.style.opacity = "1";
          title.style.transform = "translateY(0)";
        }
      }, 300 + i * 200);
    });
  }

  // ================== HOW-TO STEPS ==================
  private initHowToSteps(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;
    
    const steps = this._doc.querySelectorAll(".howto-step");
    const revealSteps = () => {
      if (!isPlatformBrowser(this.platformId)) return;
      const triggerBottom = window.innerHeight * 0.85;
      steps.forEach((step: any, i: number) => {
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
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;
    
    const sliderContainer = this._doc.querySelector(".slider-container");
    if (!sliderContainer) return;

    const sliderTrack = sliderContainer.querySelector(".slider-track") as HTMLElement;
    if (!sliderTrack) return;

    // Use querySelectorAll on the container
    const slideNodes = sliderContainer.querySelectorAll(".slide");
    this.originalSlides = Array.from(slideNodes);
    
    const bulletNav = sliderContainer.querySelector(".slider-nav .bullet-nav");

    const getSlidesPerView = () => {
      if (typeof window === 'undefined') return 4; // Fallback
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
        const bullet = this._doc.createElement("button");
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
      bulletNav.querySelectorAll(".bullet").forEach((b: any, i: number) => {
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