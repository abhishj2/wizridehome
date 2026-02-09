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
  private backspaceInterval: any = null;
  private backspaceDelayTimeout: any = null;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.stopBackspace();

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
  startBackspace(event: PointerEvent): void {
    this.onPointerDown(event); // keep your active animation

    // First delete immediately
    this.onBackspace(event);

    // Start continuous delete after small delay (like mobile keyboard)
    this.backspaceDelayTimeout = setTimeout(() => {
      this.backspaceInterval = setInterval(() => {
        this.backspaceClick.emit();
        this.triggerHapticFeedback(3);
      }, 80); // speed of continuous delete
    }, 400); // long press delay
  }
  stopBackspace(): void {
    this.isPointerDown = false;

    if (this.activeElement) {
      this.activeElement.classList.remove('active');
      this.activeElement = null;
    }

    if (this.backspaceDelayTimeout) {
      clearTimeout(this.backspaceDelayTimeout);
      this.backspaceDelayTimeout = null;
    }

    if (this.backspaceInterval) {
      clearInterval(this.backspaceInterval);
      this.backspaceInterval = null;
    }
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
    this.isPointerDown = true;
    this.activeElement = event.target as HTMLElement;

    if (this.activeElement.classList.contains('keypad-btn') ||
      this.activeElement.classList.contains('keypad-btn-done')) {
      this.activeElement.classList.add('active');
    }

    if (event.cancelable) {
      event.preventDefault();
    }
  }

  onPointerUp(event?: PointerEvent): void {
    this.isPointerDown = false;

    if (this.activeElement) {
      this.activeElement.classList.remove('active');
      this.activeElement = null;
    }

    this.stopBackspace(); // important
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