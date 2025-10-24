import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonAirportService {
  private renderer: Renderer2;
  private listeners: (() => void)[] = [];

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Initialize all common airport page functionality
   * Call this from ngAfterViewInit in your component
   */
  initializeAirportPage(): void {
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
    const fadeElements = document.querySelectorAll(".fade-scroll");

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => observer.observe(el));
  }

}