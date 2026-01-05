import { Component, EventEmitter, Output, Input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-phone-dialer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './phone-dialer.component.html',
  styleUrls: ['./phone-dialer.component.css']
})
export class PhoneDialerComponent {
  @Input() isVisible = false;
  @Input() currentValue = '';
  @Input() maxLength = 10;
  @Output() numberClick = new EventEmitter<string>();
  @Output() backspaceClick = new EventEmitter<void>();
  @Output() doneClick = new EventEmitter<void>();
  @Output() closeDialer = new EventEmitter<void>();

  private lastTouchTime = 0;
  private lastTouchTarget: EventTarget | null = null;
  private touchStartTime = 0;
  private touchStartTarget: EventTarget | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onOverlayClick(): void {
    this.closeDialer.emit();
  }

  onKeypadClick(event: Event): void {
    event.stopPropagation();
  }

  onNumberClick(number: string): void {
    if (this.currentValue.length >= this.maxLength) {
      return;
    }
    this.triggerHapticFeedback(5);
    this.numberClick.emit(number);
  }

  onBackspace(): void {
    this.triggerHapticFeedback(8);
    this.backspaceClick.emit();
  }

  onDone(): void {
    this.triggerHapticFeedback(15);
    this.doneClick.emit();
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
      return;
    }
    this.touchStartTime = Date.now();
    this.touchStartTarget = event.target;
  }

  onTouchEnd(event: TouchEvent): void {
    const now = Date.now();
    const timeSinceLastTouch = now - this.lastTouchTime;
    const touchDuration = now - this.touchStartTime;
    
    if (event.target === this.lastTouchTarget && 
        timeSinceLastTouch < 100 && 
        touchDuration < 100) {
      event.preventDefault();
    }
    
    this.lastTouchTime = now;
    this.lastTouchTarget = event.target;
  }

  private triggerHapticFeedback(duration: number = 5): void {
    if (isPlatformBrowser(this.platformId) && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Silently fail if haptic feedback is not supported
      }
    }
  }
}

