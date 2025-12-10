import { Component, AfterViewInit, Renderer2, OnInit, Inject, ChangeDetectorRef, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
export class CancelbookingComponent implements OnInit, AfterViewInit, OnDestroy {
  
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

  // Track observer for cleanup
  private observer: IntersectionObserver | null = null;
  // Schema ID
  private readonly schemaIds = ['cancel-breadcrumb', 'cancel-webpage'];

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
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
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
    }, 'cancel-breadcrumb');

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
    }, 'cancel-webpage');
  }

  // ✅ Utility: inject LD+JSON scripts safely
  // Updated: Runs on server (good for SEO) and prevents duplicates
  private addJsonLd(schemaObject: any, scriptId: string): void {
    if (!this.document) return;

    // Remove existing script if it exists
    const existingScript = this.document.getElementById(scriptId);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
    }

    const script = this.renderer.createElement('script');
    script.id = scriptId;
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
  private removeCountryCode(phoneNumber: string): string {
    if (!phoneNumber) return '';
    
    let cleanedNumber = phoneNumber.trim().replace(/[\s-()]/g, '');
    
    if (cleanedNumber.startsWith('+91')) {
      cleanedNumber = cleanedNumber.substring(3);
    }
    else if (cleanedNumber.startsWith('91') && cleanedNumber.length > 10) {
      cleanedNumber = cleanedNumber.substring(2);
    }
    
    cleanedNumber = cleanedNumber.replace(/^0+/, '');
    
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
    if (pnrLength === 7) {
      this.checkFBPNRAndSendOTP(pnr, mobileNumber);
    } else if (pnrLength === 6) {
      this.checkSharedPNRAndSendOTP(pnr, mobileNumber);
    } else {
      this.isLoading = false;
      alert('Invalid PNR length. PNR must be 6 digits (Shared Cab) or 7 digits (Reserved Cab).');
      this.cdr.detectChanges();
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
        
        if (bookingData.STATUS === 'CANCEL-ADMIN' || bookingData.STATUS === 'CANCELLED-VERIFIED') {
          this.isLoading = false;
          alert('Ticket Already Cancelled');
          this.cdr.detectChanges();
          return;
        }
        
        if (bookingData.PASSENGERNUMBER != mobileNumber) {
          this.isLoading = false;
          alert("Primary Number doesn't match. Please enter the registered mobile number.");
          this.cdr.detectChanges();
          return;
        }
        
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
        
        if (bookingData.status === 'CANCELLED-ADMIN' || bookingData.status === 'CANCELLED-VERIFIED') {
          this.isLoading = false;
          alert('Ticket Already Cancelled');
          this.cdr.detectChanges();
          return;
        }
        
        if (bookingData.passengerNumber != mobileNumber) {
          this.isLoading = false;
          alert("Primary Number doesn't match. Please enter the registered mobile number.");
          this.cdr.detectChanges();
          return;
        }
        
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

  // Send OTP using API
  sendOTP(mobileNumber: string): void {
    console.log('Sending OTP to mobile number:', mobileNumber);
    
    this.apiService.sendOtp(mobileNumber).subscribe({
      next: (val: any) => {
        this.isLoading = false;
        console.log('valal', val);
        
        let otpValue = '';
        
        if (typeof val === 'string') {
          otpValue = val.trim();
        } else if (Array.isArray(val) && val.length > 0) {
          otpValue = String(val[0]).trim();
        } else if (val != null) {
          otpValue = String(val).trim();
        }
        
        if (otpValue && /^\d+$/.test(otpValue)) {
          this.receivedOTP = otpValue;
          this.otpSent = true;
          
          console.log('OTP received:', this.receivedOTP);
          
          alert(`OTP sent successfully to ${this.cancelForm.get('mobile')?.value}`);
          
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
    
    if (enteredOTP && this.receivedOTP && enteredOTP === this.receivedOTP) {
      console.log('OTP Verified Successfully:', formData);
      this.fetchTicketDetails(formData.pnr);
    } else {
      alert('Invalid OTP. Please try again.');
      console.log('Invalid OTP. Entered:', enteredOTP, 'Expected:', this.receivedOTP);
    }
    
    this.cdr.detectChanges();
  }

  // Fetch ticket details using API
  fetchTicketDetails(pnr: string): void {
    this.isLoading = true;
    const pnrLength = pnr.length;
    
    console.log('Fetching ticket details for PNR:', pnr, 'Length:', pnrLength);
    
    if (pnrLength === 7) {
      this.fetchFBPNRDetails(pnr);
    } else if (pnrLength === 6) {
      this.fetchSharedPNRDetails(pnr);
    } else {
      this.isLoading = false;
      alert('Invalid PNR length. PNR must be 6 digits (Shared Cab) or 7 digits (Reserved Cab).');
      this.cdr.detectChanges();
    }
  }

  // Fetch Shared Cab PNR details
  fetchSharedPNRDetails(pnr: string): void {
    this.apiService.getPNRDetails(pnr).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Shared PNR Details API Response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          const bookingData = response[0];
          
          const ticketAmount = parseFloat(bookingData.ticketAmount || '0');
          const formattedAmount = `Rs. ${ticketAmount.toFixed(2)}`;
          
          const fromLocation = bookingData.boardingPoint 
            ? `${bookingData.source} (${bookingData.boardingPoint})`
            : bookingData.source || '';
          
          const toLocation = bookingData.dropPoint 
            ? `${bookingData.destination} (${bookingData.dropPoint})`
            : bookingData.destination || '';
          
          this.ticketDetails = {
            pnr: bookingData.PNR || pnr,
            from: fromLocation,
            to: toLocation,
            travelDate: bookingData.travelDate || '',
            pickupTime: bookingData.departureTime || '',
            seatNumber: bookingData.seatNumber || '',
            passengerName: bookingData.passengerName || '',
            bookingAmount: formattedAmount,
            bookingDate: bookingData.travelDate || '',
            cabType: 'Shared Cab',
            status: bookingData.status || 'ACTIVE',
            ticketAmount: ticketAmount,
            appId: bookingData.APPID,
            rid: bookingData.RID
          };
          
          console.log('Shared Cab Ticket Details Mapped:', this.ticketDetails);
          this.currentStep = 2;
        } else {
          alert('No ticket details found for this PNR. Please verify the PNR and try again.');
          console.error('Invalid or empty PNR response:', response);
          this.ticketDetails = null;
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Shared PNR Details API Error:', error);
        alert('Failed to fetch ticket details. Please try again.');
        this.ticketDetails = null;
        this.cdr.detectChanges();
      }
    });
  }

  // Fetch Reserved/Black Cab PNR details
  fetchFBPNRDetails(pnr: string): void {
    this.apiService.getFBPNRDetails(pnr).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Reserved PNR Details API Response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
          const bookingData = response[0];
          
          const ticketAmount = parseFloat(bookingData.TICKETAMOUNT || '0');
          const formattedAmount = `Rs. ${ticketAmount.toFixed(2)}`;
          
          const fromLocation = bookingData.SOURCE || bookingData.source || 
                              (bookingData.FROMLOCID ? `Location ID: ${bookingData.FROMLOCID}` : '');
          const toLocation = bookingData.DESTINATION || bookingData.destination || 
                             (bookingData.TOLOCID ? `Location ID: ${bookingData.TOLOCID}` : '');
          
          const passengerName = bookingData.PASSENGERNAME || bookingData.passengerName || 
                               bookingData.FIRSTNAME || bookingData.firstName || '';
          
          this.ticketDetails = {
            pnr: bookingData.PNR || pnr,
            from: fromLocation,
            to: toLocation,
            travelDate: bookingData.TRAVELDATE || bookingData.travelDate || '',
            pickupTime: bookingData.REPORTINGTIME || bookingData.DEPARTURETIME || 
                        bookingData.reportingTime || bookingData.departureTime || '',
            seatNumber: '', 
            passengerName: passengerName,
            bookingAmount: formattedAmount,
            bookingDate: bookingData.TRAVELDATE || bookingData.travelDate || '',
            cabType: 'Reserved Cab',
            status: bookingData.STATUS || bookingData.status || 'ACTIVE',
            ticketAmount: ticketAmount,
            appId: bookingData.APPID || bookingData.appId,
            rid: bookingData.CARID || bookingData.carId || null
          };
          
          console.log('Reserved Cab Ticket Details Mapped:', this.ticketDetails);
          this.currentStep = 2;
        } else {
          alert('No ticket details found for this PNR. Please verify the PNR and try again.');
          console.error('Invalid or empty PNR response:', response);
          this.ticketDetails = null;
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Reserved PNR Details API Error:', error);
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
    const pnrLength = pnr.length;
    const isReservedCab = pnrLength === 7;
    
    console.log('Fetching cancellation charges for PNR:', pnr, 'Type:', isReservedCab ? 'Reserved Cab' : 'Shared Cab');
    
    const apiCall = isReservedCab 
      ? this.apiService.fbcancelcriteria(pnr)
      : this.apiService.cancelcriteria(pnr);
    
    apiCall.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cancellation Criteria API Response:', response);
        
        if (response && Array.isArray(response) && response.length >= 3) {
          const refundAmount = parseFloat(response[0]) || 0;
          const cancellationCharges = parseFloat(response[1]) || 0;
          const refundMethod = response[2] || 'CASHFREE_REFUND';
          
          let amountPaid: number;
          if (this.ticketDetails.ticketAmount !== undefined && this.ticketDetails.ticketAmount !== null) {
            amountPaid = this.ticketDetails.ticketAmount;
          } else {
            const amountPaidStr = this.ticketDetails.bookingAmount.replace('Rs. ', '').replace(/,/g, '');
            amountPaid = parseFloat(amountPaidStr) || 0;
          }
          
          this.cancellationDetails = {
            amountPaid: `Rs. ${amountPaid.toFixed(2)}`,
            cancellationCharges: `Rs. ${cancellationCharges.toFixed(2)}`,
            refundAmount: `Rs. ${refundAmount.toFixed(2)}`,
            refundMethod: refundMethod
          };
          
          console.log('Cancellation Details from API:', this.cancellationDetails);
          this.currentStep = 3;
        } else {
          alert('Failed to calculate cancellation charges. Please try again.');
          console.error('Invalid cancellation criteria response:', response);
          this.cancellationDetails = null;
        }
        
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
    const pnrLength = pnr.length;
    const isReservedCab = pnrLength === 7;
    
    const refundAmountStr = this.cancellationDetails.refundAmount.replace('Rs. ', '').replace(/,/g, '');
    const refundAmount = parseFloat(refundAmountStr) || 0;
    
    const cancellationChargesStr = this.cancellationDetails.cancellationCharges.replace('Rs. ', '').replace(/,/g, '');
    const wizzAmount = parseFloat(cancellationChargesStr) || 0;
    
    console.log('Confirming cancellation:', {
      pnr: pnr,
      cabType: isReservedCab ? 'Reserved Cab' : 'Shared Cab',
      refundAmount: refundAmount,
      wizzAmount: wizzAmount
    });
    
    this.isLoading = true;
    
    const apiCall = isReservedCab
      ? this.apiService.cancelReservedTicket(pnr, this.ticketDetails.appId, refundAmount, wizzAmount)
      : this.apiService.cancelShareTicket(pnr, refundAmount, wizzAmount);
    
    apiCall.subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Cancel Ticket API Response:', response);
        
        let responseString = '';
        
        if (typeof response === 'string') {
          responseString = response.trim();
        } else if (Array.isArray(response) && response.length > 0) {
          const firstElement = response[0];
          if (typeof firstElement === 'string') {
            responseString = firstElement.trim();
          } else if (firstElement && typeof firstElement === 'object') {
            responseString = firstElement.message || firstElement.status || '';
          }
        } else if (response && typeof response === 'object') {
          responseString = response.message || response.status || '';
        }
        
        console.log('Cancellation response check:', { response, responseString, type: typeof response });
        
        if (responseString === 'CANCEL_SUCCESS' || String(response).trim() === 'CANCEL_SUCCESS') {
          alert('Cancellation confirmed! You will receive a refund of ' + this.cancellationDetails.refundAmount);
          console.log('Cancellation Confirmed Successfully:', response);
          this.currentStep = 4;
        } else {
          alert('Failed to confirm cancellation. Please try again.');
          console.error('Cancellation failed. Response:', response, 'Response String:', responseString);
        }
        
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
    this.router.navigate(['/']);
    console.log('Redirecting to home page');
  }

  // Resend OTP using API
  resendOTP(): void {
    this.isLoading = true;
    const mobileValue = this.cancelForm.get('mobile')?.value;
    const phoneNumberWithoutCountryCode = this.removeCountryCode(mobileValue);
    
    console.log('Resending OTP to phone number:', phoneNumberWithoutCountryCode);
    
    this.apiService.sendOtp(phoneNumberWithoutCountryCode).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Resend OTP API Response:', response);
        
        let otpValue = '';
        
        if (typeof response === 'string') {
          otpValue = response.trim();
        } else if (Array.isArray(response) && response.length > 0) {
          otpValue = String(response[0]).trim();
        } else if (response != null) {
          otpValue = String(response).trim();
        }
        
        if (otpValue && /^\d+$/.test(otpValue)) {
          this.receivedOTP = otpValue;
          console.log('OTP resent from API:', this.receivedOTP);
          alert(`OTP resent successfully to ${mobileValue}`);
        } else {
          alert('Failed to resend OTP. Please try again.');
          console.error('Invalid OTP response format:', response);
        }
        
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
      const pnrControl = this.cancelForm.get('pnr');
      const mobileControl = this.cancelForm.get('mobile');
      return !!(pnrControl?.valid && mobileControl?.valid);
    } else {
      const otpControl = this.cancelForm.get('otp');
      return !!otpControl?.valid;
    }
  }    

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !('IntersectionObserver' in window)) return;
    
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      }, observerOptions);

      const elements = this.document.querySelectorAll('[data-animate]');
      if (elements && elements.length > 0) {
        elements.forEach(el => this.observer?.observe(el));
      }
    } catch (e) {
      console.warn('Error initializing intersection observer (likely SSR):', e);
    }
  }

  ngOnDestroy(): void {
    // 1. Cleanup observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // 2. Remove Schema Scripts
    if (isPlatformBrowser(this.platformId)) {
      this.schemaIds.forEach(id => {
        const script = this.document.getElementById(id);
        if (script) {
          this.renderer.removeChild(this.document.head, script);
        }
      });
    }
  }
}