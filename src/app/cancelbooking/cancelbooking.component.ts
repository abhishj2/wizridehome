import { Component, AfterViewInit, Renderer2, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-cancelbooking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cancelbooking.component.html',
  styleUrl: './cancelbooking.component.css'
})
export class CancelbookingComponent implements OnInit, AfterViewInit {
  
  // Form properties
  cancelForm!: FormGroup;
  currentStep: number = 1;
  otpSent: boolean = false;
  isLoading: boolean = false;
  dummyOTP: string = '1234'; // Dummy OTP for testing
  ticketDetails: any = null; // Ticket details for Step 2
  cancellationDetails: any = null; // Cancellation charges for Step 3

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeForm();
  }
  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/cancel-ticket');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Cancel Your Ticket - Wizzride");
    this.metaService.updateTag({
      name: 'description',
      content: "Cancel your Wizzride booking easily and get refunds as per our cancellation policy. Simple OTP verification process for secure cancellations."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Cancel Your Ticket - Wizzride"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Cancel Your Ticket - Wizzride' });
    this.metaService.updateTag({ property: 'og:description', content: 'Cancel your Wizzride booking easily and get refunds as per our cancellation policy. Simple OTP verification process for secure cancellations.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancel-ticket' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Cancel Your Ticket - Wizzride' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Cancel your Wizzride booking easily and get refunds as per our cancellation policy. Simple OTP verification process for secure cancellations.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });
  }

  // Initialize form with validators
  initializeForm(): void {
    this.cancelForm = this.fb.group({
      pnr: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      otp: [''] // OTP validation will be added when OTP is sent
    });
  }

  // Form submission handler
  onSubmit(): void {
    if (!this.otpSent) {
      // Check only PNR and mobile validation for sending OTP
      const pnrControl = this.cancelForm.get('pnr');
      const mobileControl = this.cancelForm.get('mobile');
      
      if (pnrControl?.invalid || mobileControl?.invalid) {
        this.cancelForm.markAllAsTouched();
        return;
      }
    } else {
      // Check OTP validation when verifying
      const otpControl = this.cancelForm.get('otp');
      if (otpControl?.invalid) {
        this.cancelForm.markAllAsTouched();
        return;
      }
    }

    this.isLoading = true;

    if (!this.otpSent) {
      // Send OTP
      this.sendOTP();
    } else {
      // Verify OTP
      this.verifyOTP();
    }
  }

  // Send OTP (dummy implementation)
  sendOTP(): void {
    const formData = this.cancelForm.value;
    
    // Simulate API call delay
    setTimeout(() => {
      this.isLoading = false;
      this.otpSent = true;
      
      // Show success message
      alert(`OTP sent successfully to ${formData.mobile}\n\nFor testing purposes, use OTP: ${this.dummyOTP}`);
      console.log('OTP Sent:', {
        pnr: formData.pnr,
        mobile: formData.mobile,
        email: formData.email,
        otp: this.dummyOTP
      });
      
      // Add OTP validation to form
      this.cancelForm.get('otp')?.setValidators([Validators.required, Validators.pattern(/^\d{4}$/)]);
      this.cancelForm.get('otp')?.updateValueAndValidity();
      
      // Force view update
      this.cdr.detectChanges();
    }, 1500);
  }

  // Verify OTP (dummy implementation)
  verifyOTP(): void {
    const formData = this.cancelForm.value;
    
    // Simulate API call delay
    setTimeout(() => {
      this.isLoading = false; // Always set loading to false first
      
      if (formData.otp === this.dummyOTP) {
        // OTP verified successfully
        console.log('OTP Verified Successfully:', formData);
        
        // Fetch ticket details (dummy data) and then move to step 2
        this.fetchTicketDetails(formData.pnr);
      } else {
        alert('Invalid OTP. Please try again.');
        console.log('Invalid OTP:', formData.otp);
      }
      
      // Force view update for both success and failure cases
      this.cdr.detectChanges();
    }, 1000);
  }
  // Fetch ticket details (dummy implementation)
  fetchTicketDetails(pnr: string): void {
    // Simulate API call to fetch ticket details
    this.isLoading = true;
    
    setTimeout(() => {
      // Dummy ticket data based on the reference image
      this.ticketDetails = {
        pnr: pnr,
        from: 'Guwahati Airport (Airport Parking Lot)',
        to: 'Shillong (Police Bazaar Point)',
        travelDate: '2025-11-28',
        pickupTime: '06:00:00 PM',
        seatNumber: '6',
        passengerName: 'Abhishek Jain',
        bookingAmount: 'Rs. 1,200',
        bookingDate: '2025-01-15',
        cabType: 'Shared Cab',
        status: 'Confirmed'
      };
      
      console.log('Ticket Details Fetched:', this.ticketDetails);
      
      // Move to next step after ticket details are loaded
      this.currentStep = 2;
      this.isLoading = false;
      console.log('Current Step:', this.currentStep);
      console.log('Ticket Details:', this.ticketDetails);
      
      // 🔹 Force view update to detect changes made inside setTimeout
      this.cdr.detectChanges();
    }, 500);
  }

  // Proceed with cancellation
  proceedWithCancellation(): void {
    if (this.ticketDetails) {
      alert('Proceeding to cancellation charges calculation...');
      console.log('Proceeding with cancellation for:', this.ticketDetails);
      
      // Calculate cancellation charges
      this.calculateCancellationCharges();
      
      // Move to step 3 (cancellation charges)
      this.currentStep = 3;
      this.cdr.detectChanges();
    }
  }

  // Calculate cancellation charges
  calculateCancellationCharges(): void {
    if (!this.ticketDetails) return;
    
    // Extract amount from ticket details (remove "Rs. " and commas)
    const amountPaidStr = this.ticketDetails.bookingAmount.replace('Rs. ', '').replace(',', '');
    const amountPaid = parseInt(amountPaidStr);
    
    // Calculate cancellation charges based on policy
    // For demo purposes, using Rs. 100 + 5% GST = Rs. 105
    const baseCharge = 100;
    const gst = Math.round(baseCharge * 0.05);
    const cancellationCharges = baseCharge + gst;
    
    // Calculate refund amount
    const refundAmount = amountPaid - cancellationCharges;
    
    this.cancellationDetails = {
      amountPaid: `Rs. ${amountPaid}`,
      cancellationCharges: `Rs. ${cancellationCharges}`,
      refundAmount: `Rs. ${refundAmount}`
    };
    
    console.log('Cancellation Details Calculated:', this.cancellationDetails);
  }

  // Confirm cancellation
  confirmCancellation(): void {
    if (this.cancellationDetails) {
      alert('Cancellation confirmed! You will receive a refund of ' + this.cancellationDetails.refundAmount);
      console.log('Cancellation Confirmed:', this.cancellationDetails);
      
      // Move to step 4 (summary)
      this.currentStep = 4;
      this.cdr.detectChanges();
    }
  }

  // Return to home
  returnToHome(): void {
    // Reset the form and go back to step 1
    this.currentStep = 1;
    this.otpSent = false;
    this.isLoading = false;
    this.ticketDetails = null;
    this.cancellationDetails = null;
    
    // Reset form
    this.cancelForm.reset();
    this.cancelForm.get('otp')?.clearValidators();
    this.cancelForm.get('otp')?.updateValueAndValidity();
    
    console.log('Returned to home - form reset');
    this.cdr.detectChanges();
  }

  // Resend OTP
  resendOTP(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      alert(`OTP resent to ${this.cancelForm.get('mobile')?.value}\n\nFor testing purposes, use OTP: ${this.dummyOTP}`);
      console.log('OTP Resent');
      
      // Force view update
      this.cdr.detectChanges();
    }, 1000);
  }

  // Check if form is valid for submission
  isFormValidForSubmission(): boolean {
    if (!this.otpSent) {
      // For sending OTP, only check PNR and mobile
      const pnrControl = this.cancelForm.get('pnr');
      const mobileControl = this.cancelForm.get('mobile');
      return !!(pnrControl?.valid && mobileControl?.valid);
    } else {
      // For verifying OTP, check OTP field
      const otpControl = this.cancelForm.get('otp');
      return !!otpControl?.valid;
    }
  }    

  ngAfterViewInit(): void {
    // Animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

}
