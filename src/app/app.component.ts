import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'wizbooking';
  showNavbarFooter = true;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Show navbar/footer for all pages except booking thank you page
      // Show navbar/footer for thankyou-form page
      this.showNavbarFooter = event.url.includes('/thankyou-form') || !event.url.includes('/thankyou');
      
      // Re-initialize FAQ functionality after route change (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.initFAQFunctionality();
        }, 100);
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize FAQ functionality on app load (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      this.initFAQFunctionality();
    }
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
  }

  // Initialize FAQ functionality
  private initFAQFunctionality(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const faqItems = this.document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item: Element) => {
      const question = item.querySelector('.faq-question');
      const icon = item.querySelector('.faq-icon i');
      
      if (question) {
        // Remove existing listeners to prevent duplicates
        this.renderer.listen(question, 'click', () => {
          const isActive = item.classList.contains('active');
          
          // Close other items
          faqItems.forEach((otherItem: Element) => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherIcon = otherItem.querySelector('.faq-icon i');
              if (otherIcon) {
                (otherIcon as HTMLElement).style.transform = 'rotate(0deg)';
              }
            }
          });
          
          // Toggle current item
          if (isActive) {
            item.classList.remove('active');
            if (icon) {
              (icon as HTMLElement).style.transform = 'rotate(0deg)';
            }
          } else {
            item.classList.add('active');
            if (icon) {
              (icon as HTMLElement).style.transform = 'rotate(45deg)';
            }
          }
        });
      }

      // Hover effects
      this.renderer.listen(item, 'mouseenter', () => {
        if (!item.classList.contains('active')) {
          (item as HTMLElement).style.transform = 'translateY(-2px)';
        }
      });

      this.renderer.listen(item, 'mouseleave', () => {
        if (!item.classList.contains('active')) {
          (item as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    });
  }
}
