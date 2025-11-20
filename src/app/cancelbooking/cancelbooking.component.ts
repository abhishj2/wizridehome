import { Component, AfterViewInit, Renderer2, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';
import { ApiserviceService } from '../services/apiservice.service';
import { CaptchaService, CaptchaData } from '../services/captcha.service';

@Component({
  selector: 'app-cancelbooking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './cancelbooking.component.html',
  styleUrl: './cancelbooking.component.css'
})
export class CancelbookingComponent implements OnInit, AfterViewInit {
  
  // Form properties
  cancelForm!: FormGroup;
  currentStep: number = 1;
  otpSent: boolean = false;
  isLoading: boolean = false;
  receivedOTP: string = ''; // OTP received from API
  ticketDetails: any = null; // Ticket details for Step 2
  cancellationDetails: any = null; // Cancellation charges for Step 3
  
  // Captcha properties
  captchaData: CaptchaData = { question: '', answer: 0 };
  userCaptchaAnswer: string = '';

  constructor(
    private seoService: SeoService,
    private renderer: Renderer2,
    private titleService: Title,
    private metaService: Meta,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiserviceService,
    private captchaService: CaptchaService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.initializeForm();
  }
  ngOnInit(): void {
    // Set canonical URL
    this.seoService.setCanonicalURL('https://wizzride.com/cancelticket');
    
    // ✅ SEO Metadata
    this.titleService.setTitle("Cancel Your Ticket | WizzRide – Flexible Taxi Booking Policy");
    this.metaService.updateTag({
      name: 'description',
      content: "Cancellation, Wizzride contact number, Taxi in Sikkim, Taxi in Darjeeling, Taxi in Guwahati, Taxi in Shillong."
    });
    this.metaService.updateTag({
      name: 'title',
      content: "Cancel Your Ticket | WizzRide – Flexible Taxi Booking Policy"
    });

    // Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: 'Cancel Your Ticket | WizzRide – Flexible Taxi Booking Policy' });
    this.metaService.updateTag({ property: 'og:description', content: 'Cancellation, Wizzride contact number, Taxi in Sikkim, Taxi in Darjeeling, Taxi in Guwahati, Taxi in Shillong.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://wizzride.com/cancelticket' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Wizzride' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Cancel Your Ticket | WizzRide – Flexible Taxi Booking Policy' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Cancellation, Wizzride contact number, Taxi in Sikkim, Taxi in Darjeeling, Taxi in Guwahati, Taxi in Shillong.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://wizzride.com/assets/images/icons/logo2.webp' });
    this.metaService.updateTag({ name: 'twitter:site', content: '@wizzride' });

    // ✅ BreadcrumbList JSON-LD
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Cancel Ticket",
          "item": {
            "@type": "WebPage",
            "@id": "https://www.wizzride.com/cancelticket"
          }
        }
      ]
    });

    // ✅ WebPage JSON-LD for Cancel Ticket page
    this.addJsonLd({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cancel Your Ticket | WizzRide – Flexible Taxi Booking Policy",
      "description": "Cancellation, Wizzride contact number, Taxi in Sikkim, Taxi in Darjeeling, Taxi in Guwahati, Taxi in Shillong.",
      "url": "https://www.wizzride.com/cancelticket",
      "mainEntity": {
        "@type": "Service",
        "name": "Ticket Cancellation Service",
        "description": "Cancel your Wizzride taxi booking with flexible cancellation policy and instant refund processing",
        "provider": {
          "@type": "Organization",
          "name": "Wizzride Technologies Pvt Ltd",
          "url": "https://www.wizzride.com"
        },
        "serviceType": "Taxi Booking Cancellation",
        "areaServed": [
          "Sikkim",
          "Darjeeling", 
          "Guwahati",
          "Shillong"
        ],
        "offers": {
          "@type": "Offer",
          "description": "Flexible cancellation policy with refund options",
          "price": "0",
          "priceCurrency": "INR"
        }
      }
    });
  }

  // ✅ Utility: inject LD+JSON scripts
  private addJsonLd(schemaObject: any): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaObject);
    this.renderer.appendChild(this.document.head, script);
  }

  // Initialize form with validators
  initializeForm(): void {
    this.cancelForm = this.fb.group({
      pnr: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      mobile: ['', [Validators.required, Validators.pattern(/^(\+91|91)?[6-9]\d{9}$/)]],
      email: ['', [Validators.email]],
      otp: [''], // OTP validation will be added when OTP is sent
      captcha: ['', [Validators.required]] // Captcha validation
    });
    
    // Generate captcha
    this.captchaData = this.captchaService.generateCaptcha();
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
      // Start validation checks before sending OTP
      this.validateAndSendOTP();
    } else {
      // Verify OTP
      this.verifyOTP();
    }
  }

  // Helper method to remove country code from phone number
  // Handles phone numbers with or without country code (+91, 91, or no prefix)
  private removeCountryCode(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    // Remove all spaces and special characters except + and digits
    let cleanedNumber = phoneNumber.trim().replace(/[\s-()]/g, '');
    
    // Remove +91 prefix if present
    if (cleanedNumber.startsWith('+91')) {
      cleanedNumber = cleanedNumber.substring(3);
    }
    // Remove 91 prefix if present (check if number is 12+ digits to avoid removing 91 from a 10-digit number starting with 91)
    else if (cleanedNumber.startsWith('91') && cleanedNumber.length > 10) {
      cleanedNumber = cleanedNumber.substring(2);
    }
    
    // Remove any leading zeros
    cleanedNumber = cleanedNumber.replace(/^0+/, '');
    
    // If the number is still longer than 10 digits, take the last 10 digits
    // This handles edge cases where extra digits might be present
    if (cleanedNumber.length > 10) {
      cleanedNumber = cleanedNumber.substring(cleanedNumber.length - 10);
    }
    
    return cleanedNumber;
  }

  // Validate and send OTP - includes all mandatory checks
  validateAndSendOTP(): void {
    const formData = this.cancelForm.value;
    const pnr = formData.pnr?.trim().toUpperCase();
    const mobileNumber = this.removeCountryCode(formData.mobile);
    const pnrLength = pnr.length;
    
    // Step 1: Validate custom captcha
    const captchaAnswer = formData.captcha || this.userCaptchaAnswer;
    if (!this.captchaService.validateCaptcha(captchaAnswer, this.captchaData.answer)) {
      this.isLoading = false;
      alert('Incorrect captcha answer! Please solve the math problem correctly.');
      this.userCaptchaAnswer = '';
      this.captchaData = this.captchaService.generateCaptcha();
      this.cancelForm.patchValue({ captcha: '' });
      this.cdr.detectChanges();
      return;
    }
    
    // Step 2: Check PNR based on length
    if (pnrLength > 6) {
      // Reserved/Black Cab - use getFBPNRDetails
      this.checkFBPNRAndSendOTP(pnr, mobileNumber);
    } else {
      // Shared Cab - use getPNRDetails
      this.checkSharedPNRAndSendOTP(pnr, mobileNumber);
    }
  }

  // Check FBPNR (Reserved/Black Cab) and send OTP
  checkFBPNRAndSendOTP(pnr: string, mobileNumber: string): void {
    this.apiService.getFBPNRDetails(pnr).subscribe({
      next: (val: any) => {
        console.log('details', val);
        
        if (String(val).trim() === 'NOT_FOUND') {
          this.isLoading = false;
          alert('PNR not found. Please verify the PNR and try again.');
          this.cdr.detectChanges();
          return;
        }
        
        if (!val || !Array.isArray(val) || val.length === 0) {
          this.isLoading = false;
          alert('PNR not found. Please verify the PNR and try again.');
          this.cdr.detectChanges();
          return;
        }
        
        const bookingData = val[0];
        
        // Check if ticket is already cancelled
        if (bookingData.STATUS === 'CANCEL-ADMIN' || bookingData.STATUS === 'CANCELLED-VERIFIED') {
          this.isLoading = false;
          alert('Ticket Already Cancelled');
          this.cdr.detectChanges();
          return;
        }
        
        // Check if mobile number matches
        if (bookingData.PASSENGERNUMBER != mobileNumber) {
          this.isLoading = false;
          alert("Primary Number doesn't match. Please enter the registered mobile number.");
          this.cdr.detectChanges();
          return;
        }
        
        // All checks passed - send OTP
        this.sendOTP(mobileNumber);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('FBPNR Details API Error:', error);
        alert('Failed to verify PNR. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // Check Shared Cab PNR and send OTP
  checkSharedPNRAndSendOTP(pnr: string, mobileNumber: string): void {
    this.apiService.getPNRDetails(pnr).subscribe({
      next: (val: any) => {
        console.log('detailspp', val);
        
        if (String(val).trim() === 'NOT_FOUND') {
          this.isLoading = false;
          alert('PNR not found. Please verify the PNR and try again.');
          this.cdr.detectChanges();
          return;
        }
        
        if (!val || !Array.isArray(val) || val.length === 0) {
          this.isLoading = false;
          alert('PNR not found. Please verify the PNR and try again.');
          this.cdr.detectChanges();
          return;
        }
        
        const bookingData = val[0];
        
        // Check if ticket is already cancelled
        if (bookingData.status === 'CANCELLED-ADMIN' || bookingData.status === 'CANCELLED-VERIFIED') {
          this.isLoading = false;
          alert('Ticket Already Cancelled');
          this.cdr.detectChanges();
          return;
        }
        
        // Check if mobile number matches
        if (bookingData.passengerNumber != mobileNumber) {
          this.isLoading = false;
          alert("Primary Number doesn't match. Please enter the registered mobile number.");
          this.cdr.detectChanges();
          return;
        }
        
        // All checks passed - send OTP
        this.sendOTP(mobileNumber);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Shared PNR Details API Error:', error);
        alert('Failed to verify PNR. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // Send OTP using API (after all validations pass)
  sendOTP(mobileNumber: string): void {
    console.log('Sending OTP to mobile number:', mobileNumber);
    
    this.apiService.sendOtp(mobileNumber).subscribe({
      next: (val: any) => {
        this.isLoading = false;
        console.log('valal', val);
        
        // API returns OTP as a string (e.g., "1667")
        let otpValue = '';
        
        if (typeof val === 'string') {
          otpValue = val.trim();
        } else if (Array.isArray(val) && val.length > 0) {
          otpValue = String(val[0]).trim();
        } else if (val != null) {
          otpValue = String(val).trim();
        }
        
        // Check if we got a valid OTP
        if (otpValue && /^\d+$/.test(otpValue)) {
          this.receivedOTP = otpValue;
          this.otpSent = true;
          
          console.log('OTP received:', this.receivedOTP);
          
          // Show success message
          alert(`OTP sent successfully to ${this.cancelForm.get('mobile')?.value}`);
          
          // Add OTP validation to form
          this.cancelForm.get('otp')?.setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
          this.cancelForm.get('otp')?.updateValueAndValidity();
        } else {
          alert('Failed to send OTP. Please try again.');
          console.error('Invalid OTP response format:', val);
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('OTP API Error:', error);
        alert('Failed to send OTP. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // Verify OTP
  verifyOTP(): void {
    const formData = this.cancelForm.value;
    const enteredOTP = formData.otp?.trim();
    
    this.isLoading = false;
    
    // Verify OTP against the one received from API
    if (enteredOTP && this.receivedOTP && enteredOTP === this.receivedOTP) {
      // OTP verified successfully
      console.log('OTP Verified Successfully:', formData);
      
      // Fetch ticket details and then move to step 2
      this.fetchTicketDetails(formData.pnr);
    } else {
      alert('Invalid OTP. Please try again.');
      console.log('Invalid OTP. Entered:', enteredOTP, 'Expected:', this.receivedOTP);
    }
    
    // Force view update for both success and failure cases
    this.cdr.detectChanges();
  }
  // Fetch ticket details using API
  fetchTicketDetails(pnr: string): void {
    this.isLoading = true;
    
    console.log('Fetching ticket details for PNR:', pnr);
    
    // Call the API service to get PNR details
    this.apiService.getPNRDetails(pnr).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('PNR Details API Response:', response);
        
        // API returns an array with a single object containing booking details
        if (response && Array.isArray(response) && response.length > 0) {
          const bookingData = response[0];
          
          // Format ticket amount with Rs. prefix
          const ticketAmount = parseFloat(bookingData.ticketAmount || '0');
          const formattedAmount = `Rs. ${ticketAmount.toFixed(2)}`;
          
          // Format from/to with boarding point
          const fromLocation = bookingData.boardingPoint 
            ? `${bookingData.source} (${bookingData.boardingPoint})`
            : bookingData.source || '';
          
          const toLocation = bookingData.dropPoint 
            ? `${bookingData.destination} (${bookingData.dropPoint})`
            : bookingData.destination || '';
          
          // Map API response to ticketDetails format
          this.ticketDetails = {
            pnr: bookingData.PNR || pnr,
            from: fromLocation,
            to: toLocation,
            travelDate: bookingData.travelDate || '',
            pickupTime: bookingData.departureTime || '',
            seatNumber: bookingData.seatNumber || '',
            passengerName: bookingData.passengerName || '',
            bookingAmount: formattedAmount,
            bookingDate: bookingData.travelDate || '', // Using travelDate as bookingDate if not available
            cabType: 'Shared Cab',
            status: bookingData.status || 'ACTIVE',
            // Store additional data for cancellation calculation
            ticketAmount: ticketAmount,
            appId: bookingData.APPID,
            rid: bookingData.RID
          };
          
          console.log('Ticket Details Mapped:', this.ticketDetails);
          
          // Move to next step after ticket details are loaded
          this.currentStep = 2;
        } else {
          // Handle empty or invalid response
          alert('No ticket details found for this PNR. Please verify the PNR and try again.');
          console.error('Invalid or empty PNR response:', response);
          this.ticketDetails = null;
        }
        
        // Force view update
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('PNR Details API Error:', error);
        alert('Failed to fetch ticket details. Please try again.');
        this.ticketDetails = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Proceed with cancellation
  proceedWithCancellation(): void {
    if (this.ticketDetails) {
      console.log('Proceeding with cancellation for:', this.ticketDetails);
      
      // Calculate cancellation charges using API
      this.calculateCancellationCharges();
    }
  }

  // Calculate cancellation charges using API
  calculateCancellationCharges(): void {
    if (!this.ticketDetails || !this.ticketDetails.pnr) {
      alert('Ticket details not available. Please try again.');
      return;
    }
    
    this.isLoading = true;
    const pnr = this.ticketDetails.pnr;
    
    console.log('Fetching cancellation charges for PNR:', pnr);
    
    // Call the API service to get cancellation criteria
    this.apiService.cancelcriteria(pnr).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cancellation Criteria API Response:', response);
        
        // API returns array: [refundAmount, cancellationCharges, refundMethod]
        // Example: [891, 105, "CASHFREE_REFUND"]
        if (response && Array.isArray(response) && response.length >= 3) {
          const refundAmount = parseFloat(response[0]) || 0;
          const cancellationCharges = parseFloat(response[1]) || 0;
          const refundMethod = response[2] || 'CASHFREE_REFUND';
          
          // Get original amount paid from ticket details
          let amountPaid: number;
          if (this.ticketDetails.ticketAmount !== undefined && this.ticketDetails.ticketAmount !== null) {
            amountPaid = this.ticketDetails.ticketAmount;
          } else {
            // Fallback: Extract amount from bookingAmount string
            const amountPaidStr = this.ticketDetails.bookingAmount.replace('Rs. ', '').replace(/,/g, '');
            amountPaid = parseFloat(amountPaidStr) || 0;
          }
          
          // Store cancellation details
          this.cancellationDetails = {
            amountPaid: `Rs. ${amountPaid.toFixed(2)}`,
            cancellationCharges: `Rs. ${cancellationCharges.toFixed(2)}`,
            refundAmount: `Rs. ${refundAmount.toFixed(2)}`,
            refundMethod: refundMethod
          };
          
          console.log('Cancellation Details from API:', this.cancellationDetails);
          
          // Move to step 3 (cancellation charges) after successful API call
          this.currentStep = 3;
        } else {
          // Handle invalid response
          alert('Failed to calculate cancellation charges. Please try again.');
          console.error('Invalid cancellation criteria response:', response);
          this.cancellationDetails = null;
        }
        
        // Force view update
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Cancellation Criteria API Error:', error);
        alert('Failed to fetch cancellation charges. Please try again.');
        this.cancellationDetails = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Confirm cancellation using API
  confirmCancellation(): void {
    if (!this.cancellationDetails || !this.ticketDetails) {
      alert('Cancellation details not available. Please try again.');
      return;
    }
    
    const pnr = this.ticketDetails.pnr;
    
    // Extract numeric values from formatted strings (remove "Rs. " and parse)
    const refundAmountStr = this.cancellationDetails.refundAmount.replace('Rs. ', '').replace(/,/g, '');
    const refundAmount = parseFloat(refundAmountStr) || 0;
    
    const cancellationChargesStr = this.cancellationDetails.cancellationCharges.replace('Rs. ', '').replace(/,/g, '');
    const wizzAmount = parseFloat(cancellationChargesStr) || 0;
    
    console.log('Confirming cancellation:', {
      pnr: pnr,
      refundAmount: refundAmount,
      wizzAmount: wizzAmount
    });
    
    this.isLoading = true;
    
    // Call the API service to cancel the ticket
    this.apiService.cancelShareTicket(pnr, refundAmount, wizzAmount).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cancel Ticket API Response:', response);
        
        // API returns "CANCEL_SUCCESS" as a string when successful
        // Handle both string response and array response formats
        let responseString = '';
        
        if (typeof response === 'string') {
          // Direct string response
          responseString = response.trim();
        } else if (Array.isArray(response) && response.length > 0) {
          // Array response - check first element
          const firstElement = response[0];
          if (typeof firstElement === 'string') {
            responseString = firstElement.trim();
          } else if (firstElement && typeof firstElement === 'object') {
            // Object response - try to get message or status
            responseString = firstElement.message || firstElement.status || '';
          }
        } else if (response && typeof response === 'object') {
          // Object response
          responseString = response.message || response.status || '';
        }
        
        console.log('Cancellation response check:', { response, responseString, type: typeof response });
        
        // Check if response is CANCEL_SUCCESS
        if (responseString === 'CANCEL_SUCCESS' || String(response).trim() === 'CANCEL_SUCCESS') {
          // Cancellation successful
          alert('Cancellation confirmed! You will receive a refund of ' + this.cancellationDetails.refundAmount);
          console.log('Cancellation Confirmed Successfully:', response);
          
          // Move to step 4 (summary)
          this.currentStep = 4;
        } else {
          // Handle error response
          alert('Failed to confirm cancellation. Please try again.');
          console.error('Cancellation failed. Response:', response, 'Response String:', responseString);
        }
        
        // Force view update
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Cancel Ticket API Error:', error);
        alert('Failed to confirm cancellation. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // Return to home
  returnToHome(): void {
    // Navigate to home page
    this.router.navigate(['/']);
    console.log('Redirecting to home page');
  }

  // Resend OTP using API
  resendOTP(): void {
    this.isLoading = true;
    const mobileValue = this.cancelForm.get('mobile')?.value;
    
    // Remove country code from phone number
    const phoneNumberWithoutCountryCode = this.removeCountryCode(mobileValue);
    
    console.log('Resending OTP to phone number:', phoneNumberWithoutCountryCode);
    
    // Call the API service
    this.apiService.sendOtp(phoneNumberWithoutCountryCode).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Resend OTP API Response:', response);
        
        // API returns OTP as a string (e.g., "1667")
        // Handle both string response and array response formats
        let otpValue = '';
        
        if (typeof response === 'string') {
          // Direct string response
          otpValue = response.trim();
        } else if (Array.isArray(response) && response.length > 0) {
          // Array response - take first element
          otpValue = String(response[0]).trim();
        } else if (response != null) {
          // Object response - try to extract OTP
          otpValue = String(response).trim();
        }
        
        // Check if we got a valid OTP (should be numeric)
        if (otpValue && /^\d+$/.test(otpValue)) {
          this.receivedOTP = otpValue;
          console.log('OTP resent from API:', this.receivedOTP);
          alert(`OTP resent successfully to ${mobileValue}`);
        } else {
          alert('Failed to resend OTP. Please try again.');
          console.error('Invalid OTP response format:', response);
        }
        
        // Force view update
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Resend OTP API Error:', error);
        alert('Failed to resend OTP. Please try again.');
        this.cdr.detectChanges();
      }
    });
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
