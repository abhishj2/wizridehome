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
    // CRITICAL FIX: Rename property to _doc to avoid conflict with global 'document' variable
    @Inject(DOCUMENT) private _doc: any 
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize all common airport page functionality
   * Call this from ngAfterViewInit in your component
   */
  initializeAirportPage(): void {
    // 1. Guard: Stop immediately if running on Server
    if (!isPlatformBrowser(this.platformId)) return;
    
    // 2. Run initialization safely on browser
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
    // 1. Redundant Guard: Ensure we are in the browser
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // 2. Use the INJECTED document (this._doc), NOT the global 'document'
      const doc = this._doc;

      // 3. Safety check: Ensure document and API exist
      // We check 'window' here which is safe because of the isPlatformBrowser check above
      if (!doc || !('IntersectionObserver' in window)) {
        return;
      }

      const fadeElements = doc.querySelectorAll(".fade-scroll");
      if (!fadeElements || fadeElements.length === 0) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target); // Animate once
          }
        });
      }, { threshold: 0.15 });

      fadeElements.forEach((el: any) => observer.observe(el));

    } catch (e) {
      // Silently handle any errors to prevent app crash
      console.warn('Error initializing fade scroll animations:', e);
    }
  }
}