export class IlpAnimations {
  private static ticking: boolean = false;
  private static observer: IntersectionObserver | null = null;
  private static parallaxHandler: (() => void) | null = null;
  private static stepsHandler: (() => void) | null = null;

  /**
   * Initialize all ILP page animations
   */
  public static initializeAnimations(): void {
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
   */
  public static cleanup(): void {
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
   */
  private static initPageLoadFadeIn(): void {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 100);
  }

  /**
   * Smooth scroll for anchor links
   */
  private static initSmoothScroll(): void {
    const anchorLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const targetId: string | null = link.getAttribute("href");
        if (targetId) {
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
    const animateElements: NodeListOf<Element> = document.querySelectorAll(".animate-on-scroll");
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
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
    const heroSection: Element | null = document.querySelector(".mainbann");
    if (heroSection) {
      const updateParallax = (): void => {
        const scrolled: number = window.pageYOffset;
        const rate: number = scrolled * -0.1;
        (heroSection as HTMLElement).style.transform = `translateY(${rate}px)`;
        this.ticking = false;
      };

      this.parallaxHandler = (): void => {
        if (!this.ticking) {
          requestAnimationFrame(updateParallax);
          this.ticking = true;
        }
      };

      window.addEventListener("scroll", this.parallaxHandler);
    }
  }

  /**
   * Hover effects for buttons and cards
   */
  private static initHoverEffects(): void {
    const buttons: NodeListOf<HTMLElement> = document.querySelectorAll(".btn-c, .plan-trip-btn");
    buttons.forEach((button: HTMLElement) => {
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-3px) scale(1.02)";
      });
      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0) scale(1)";
      });
    });

    const cards: NodeListOf<HTMLElement> = document.querySelectorAll(".carfe, .reach-card, .cultural-card");
    cards.forEach((card: HTMLElement, index: number) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.02)";
        card.style.zIndex = "10";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.zIndex = "1";
      });
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  /**
   * Typing effect for hero title
   */
  private static initTypingEffect(): void {
    const heroTitle: Element | null = document.querySelector(".mainbann h1");
    if (heroTitle) {
      const originalText: string = heroTitle.textContent || "";
      heroTitle.textContent = "";
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
    const titles: NodeListOf<HTMLElement> = document.querySelectorAll(".section-title, .section-subtitle");
    titles.forEach((title: HTMLElement, index: number) => {
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
    const steps: NodeListOf<Element> = document.querySelectorAll(".howto-step");
    const revealSteps = (): void => {
      const triggerBottom: number = window.innerHeight * 0.85;
      steps.forEach((step: Element, idx: number) => {
        const stepTop: number = step.getBoundingClientRect().top;
        if (stepTop < triggerBottom) {
          setTimeout(() => step.classList.add("visible"), idx * 200);
        }
      });
    };
    
    this.stepsHandler = revealSteps;
    window.addEventListener("scroll", this.stepsHandler);
    revealSteps();
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  IlpAnimations.initializeAnimations();
});
  
  