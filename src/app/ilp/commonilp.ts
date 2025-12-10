export class IlpAnimations {
  private static ticking: boolean = false;
  private static observer: IntersectionObserver | null = null;
  private static parallaxHandler: (() => void) | null = null;
  private static stepsHandler: (() => void) | null = null;

  /**
   * Initialize all ILP page animations
   * Safe to call from Angular ngAfterViewInit
   */
  public static initializeAnimations(): void {
    // Strict check to ensure we are in a browser environment
    // This prevents server-side crashes during SSR
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    this.initPageLoadFadeIn();
    this.initSmoothScroll();
    this.initIntersectionObserver();
    this.initParallax();
    this.initHoverEffects();
    this.initTypingEffect();
    this.initSectionTitles();
    this.initHowToSteps();
  }

  /**
   * Clean up event listeners and observers
   * Call this in ngOnDestroy
   */
  public static cleanup(): void {
    if (typeof window === 'undefined') return;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.parallaxHandler) {
      window.removeEventListener("scroll", this.parallaxHandler);
      this.parallaxHandler = null;
    }
    
    if (this.stepsHandler) {
      window.removeEventListener("scroll", this.stepsHandler);
      this.stepsHandler = null;
    }
  }

  /**
   * Page load fade-in effect
   * UPDATED: Checks for window to prevent hiding content on Server (SEO safe)
   */
  private static initPageLoadFadeIn(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Only fade in if not already visible (prevents double fade or stuck opacity)
    if (document.body.style.opacity !== '1') {
        document.body.style.opacity = "0";
        document.body.style.transition = "opacity 0.5s ease-in-out";
        
        // Small delay to ensure CSS is applied before fading in
        requestAnimationFrame(() => {
            document.body.style.opacity = "1";
        });
    }
  }

  /**
   * Smooth scroll for anchor links
   */
  private static initSmoothScroll(): void {
    if (typeof document === 'undefined') return;
    const anchorLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach((link: HTMLAnchorElement) => {
      // Clone to remove existing listeners to prevent duplicates
      const newLink = link.cloneNode(true) as HTMLAnchorElement;
      link.parentNode?.replaceChild(newLink, link);
      
      newLink.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const targetId: string | null = newLink.getAttribute("href");
        if (targetId && targetId !== '#') {
          const targetElement: Element | null = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  /**
   * Intersection Observer for scroll animations
   */
  private static initIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const animateElements: NodeListOf<Element> = document.querySelectorAll(".animate-on-scroll");
    
    if (this.observer) {
        this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            // Optional: Stop observing once animated to save performance
            // this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    animateElements.forEach((el: Element) => this.observer!.observe(el));
  }

  /**
   * Parallax effect for hero section
   */
  private static initParallax(): void {
    if (typeof window === 'undefined') return;
    
    const heroSection: HTMLElement | null = document.querySelector(".mainbann");
    if (heroSection) {
      const updateParallax = (): void => {
        const scrolled: number = window.pageYOffset;
        const rate: number = scrolled * -0.1;
        heroSection.style.transform = `translateY(${rate}px)`;
        this.ticking = false;
      };

      this.parallaxHandler = (): void => {
        if (!this.ticking) {
          requestAnimationFrame(updateParallax);
          this.ticking = true;
        }
      };

      window.addEventListener("scroll", this.parallaxHandler, { passive: true });
    }
  }

  /**
   * Hover effects for buttons and cards
   */
  private static initHoverEffects(): void {
    if (typeof document === 'undefined') return;
    
    const addHover = (selector: string, scale = 1.02, y = -3) => {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector);
        elements.forEach((el: HTMLElement) => {
            // Remove old listeners implicitly by referencing strict events
            // but for simple hover CSS is often better. 
            // JS approach:
            el.onmouseenter = () => {
                el.style.transform = `translateY(${y}px) scale(${scale})`;
                if(selector.includes('card')) el.style.zIndex = "10";
            };
            el.onmouseleave = () => {
                el.style.transform = "translateY(0) scale(1)";
                if(selector.includes('card')) el.style.zIndex = "1";
            };
        });
    };

    addHover(".btn-c, .plan-trip-btn");
    addHover(".carfe, .reach-card, .cultural-card", 1.02, -10);
  }

  /**
   * Typing effect for hero title
   */
  private static initTypingEffect(): void {
    if (typeof document === 'undefined') return;
    const heroTitle: Element | null = document.querySelector(".mainbann h1");
    
    // Only init if not already processed (prevents re-typing on navigation back)
    if (heroTitle && !heroTitle.getAttribute('data-typed')) {
      const originalText: string = heroTitle.textContent || "";
      heroTitle.textContent = "";
      heroTitle.setAttribute('data-typed', 'true');
      
      let i: number = 0;
      const typeWriter = (): void => {
        if (i < originalText.length) {
          heroTitle.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };

      setTimeout(typeWriter, 500);
    }
  }

  /**
   * Animate section titles
   */
  private static initSectionTitles(): void {
    if (typeof document === 'undefined') return;
    const titles: NodeListOf<HTMLElement> = document.querySelectorAll(".section-title, .section-subtitle");
    titles.forEach((title: HTMLElement, index: number) => {
      // Check if already animated to prevent flicker
      if(title.style.opacity === '1') return;

      title.style.opacity = "0";
      title.style.transform = "translateY(20px)";
      setTimeout(() => {
        title.style.transition = "all 0.8s ease-out";
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
      }, 300 + index * 200);
    });
  }

  /**
   * Animate how-to steps on scroll
   */
  private static initHowToSteps(): void {
    if (typeof window === 'undefined') return;
    
    const steps: NodeListOf<Element> = document.querySelectorAll(".howto-step");
    if(steps.length === 0) return;

    const revealSteps = (): void => {
      const triggerBottom: number = window.innerHeight * 0.85;
      steps.forEach((step: Element, idx: number) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < triggerBottom && rect.bottom > 0) {
          setTimeout(() => step.classList.add("visible"), idx * 200);
        }
      });
    };
    
    this.stepsHandler = revealSteps;
    window.addEventListener("scroll", this.stepsHandler, { passive: true });
    
    // Initial check in case elements are already in view
    revealSteps();
  }
}