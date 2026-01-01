import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thankyou-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thankyou-form.component.html',
  styleUrl: './thankyou-form.component.css'
})
export class ThankyouFormComponent implements OnInit {
  // Customizable properties from route params or defaults
  title: string = 'Thank You!';
  message: string = 'Your form has been submitted successfully.';
  subtitle: string = 'We have received your information and will get back to you soon.';
  showCountdown: boolean = true;
  countdown: number = 10;
  redirectUrl: string = '/';
  redirectText: string = 'Go to Home';
  showAdditionalInfo: boolean = false;
  additionalInfo: string = '';
  formType: string = '';

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Get parameters from route query params
    this.route.queryParams.subscribe(params => {
      if (params['title']) this.title = params['title'];
      if (params['message']) this.message = params['message'];
      if (params['subtitle']) this.subtitle = params['subtitle'];
      if (params['redirectUrl']) this.redirectUrl = params['redirectUrl'];
      if (params['redirectText']) this.redirectText = params['redirectText'];
      if (params['formType']) this.formType = params['formType'];
      if (params['countdown'] === 'false') this.showCountdown = false;
      if (params['countdown']) this.countdown = parseInt(params['countdown'], 10);
      if (params['additionalInfo']) {
        this.showAdditionalInfo = true;
        this.additionalInfo = params['additionalInfo'];
      }
    });

    // Set form-specific defaults based on formType
    this.setFormSpecificDefaults();

    // Start countdown if enabled
    if (this.showCountdown) {
      this.startCountdown();
    }
  }

  setFormSpecificDefaults() {
    switch (this.formType.toLowerCase()) {
      case 'contact':
        this.title = this.title === 'Thank You!' ? 'Thank You for Contacting Us!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'We have received your message and will respond within 24 hours.' 
          : this.message;
        break;
      case 'career':
      case 'job':
        this.title = this.title === 'Thank You!' ? 'Thank You for Your Application!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'Your application has been received. Our team will review it and get back to you soon.' 
          : this.message;
        break;
      case 'collaborate':
        this.title = this.title === 'Thank You!' ? 'Thank You for Your Interest!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'We have received your collaboration request and will contact you shortly.' 
          : this.message;
        break;
      case 'caraddition':
        this.title = this.title === 'Thank You!' ? 'Request Submitted Successfully!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'Your car addition request has been received. We will try our best to add a car for your preferred timing.' 
          : this.message;
        break;
      case 'vehicle':
        this.title = this.title === 'Thank You!' ? 'Vehicle Registration Submitted!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'Your vehicle registration request has been received. Our team will contact you soon.' 
          : this.message;
        break;
    }
  }

  startCountdown() {
    const countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(countdownInterval);
        this.router.navigate([this.redirectUrl]);
      }
    }, 1000);
  }

  navigateNow() {
    this.router.navigate([this.redirectUrl]);
  }
}
