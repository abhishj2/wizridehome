import { Component, EventEmitter, Output, Input, PLATFORM_ID, Inject, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-phone-dialer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-dialer.component.html',
  styleUrls: ['./phone-dialer.component.css']
})
export class PhoneDialerComponent implements OnDestroy {
  @Input() isVisible = false;
  @Input() currentValue = '';
  @Input() maxLength = 10;
  @Output() numberClick = new EventEmitter<string>();
  @Output() backspaceClick = new EventEmitter<void>();
  @Output() doneClick = new EventEmitter<void>();
  @Output() closeDialer = new EventEmitter<void>();

  private touchCooldown = 80; // ms between touches
  private lastTouchTime = 0;
  private isPointerDown = false;
  private activeElement: HTMLElement | null = null;
  private animationFrameId: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onDocumentTouchMove(event: TouchEvent): void {
    // Prevent scrolling when interacting with keypad
    if (this.isPointerDown && this.isVisible) {
      event.preventDefault();
    }
  }

  onOverlayClick(): void {
    this.closeDialer.emit();
  }

  onKeypadClick(event: Event): void {
    event.stopPropagation();
  }

  onNumberClick(number: string, event: Event): void {
    if (!this.canTriggerClick()) return;
    
    if (this.currentValue.length >= this.maxLength) {
      return;
    }
    
    this.triggerHapticFeedback(5);
    this.numberClick.emit(number);
    this.animateButton(event.target as HTMLElement);
  }

  onBackspace(event: Event): void {
    if (!this.canTriggerClick()) return;
    
    this.triggerHapticFeedback(8);
    this.backspaceClick.emit();
    this.animateButton(event.target as HTMLElement);
  }

  onDone(event: Event): void {
    if (!this.canTriggerClick()) return;
    
    this.triggerHapticFeedback(15);
    this.doneClick.emit();
    this.animateButton(event.target as HTMLElement);
  }

  onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      this.isPointerDown = true;
      this.activeElement = event.target as HTMLElement;
      
      // Add active class immediately for visual feedback
      if (this.activeElement.classList.contains('keypad-btn') || 
          this.activeElement.classList.contains('keypad-btn-done')) {
        this.activeElement.classList.add('active');
      }
      
      // Prevent default to avoid browser handling
      if (event.cancelable) {
        event.preventDefault();
      }
    }
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      this.isPointerDown = false;
      
      // Remove active class
      if (this.activeElement) {
        this.activeElement.classList.remove('active');
        this.activeElement = null;
      }
    }
  }

  private canTriggerClick(): boolean {
    const now = performance.now();
    if (now - this.lastTouchTime < this.touchCooldown) {
      return false;
    }
    this.lastTouchTime = now;
    return true;
  }

  private animateButton(element: HTMLElement): void {
    if (!element) return;
    
    // Use animation frame for smooth animation
    this.animationFrameId = requestAnimationFrame(() => {
      element.classList.add('click-animation');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        element.classList.remove('click-animation');
      }, 150);
    });
  }

  private triggerHapticFeedback(duration: number = 5): void {
    if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
      try {
        // Queue vibration on next frame to not block UI
        this.animationFrameId = requestAnimationFrame(() => {
          navigator.vibrate(duration);
        });
      } catch (e) {
        // Silently fail if haptic feedback is not supported
      }
    }
  }
}