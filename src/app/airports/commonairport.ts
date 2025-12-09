import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonAirportService {
  private renderer: Renderer2;
  private listeners: (() => void)[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize all common airport page functionality
   * Call this from ngAfterViewInit in your component
   */
  initializeAirportPage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initFadeScrollAnimations();
  }

  /**
   * Clean up all event listeners
   * Call this from ngOnDestroy in your component
   */
  cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }

  // ================== FADE SCROLL ANIMATIONS ==================
  private initFadeScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // ALL YOUR DOM CODE SAFE HERE
    try {
      // Safely check for document and IntersectionObserver
      const doc = this.document;
      const IntersectionObserverClass = (globalThis as any).IntersectionObserver;
      
      if (!doc || typeof IntersectionObserverClass === 'undefined' || typeof doc.querySelectorAll !== 'function') {
        return;
      }
      
      const fadeElements = doc.querySelectorAll(".fade-scroll");

      const observer = new IntersectionObserverClass((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // Animate once
          }
        });
      }, { threshold: 0.15 });

      fadeElements.forEach(el => observer.observe(el));
    } catch (e) {
      // Silently handle any SSR errors
      console.warn('Error initializing fade scroll animations (likely SSR):', e);
    }
  }

}