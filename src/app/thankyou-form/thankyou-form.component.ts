import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface ThankYouFormData {
  title?: string;
  message?: string;
  subtitle?: string;
  redirectUrl?: string;
  redirectText?: string;
  formType?: string;
  additionalInfo?: string;
}

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

    // Get data from router state (SEO-friendly, no query params)
    const navigation = this.router.getCurrentNavigation();
    let formData: any = null;

    if (navigation?.extras?.state) {
      formData = navigation.extras.state['formData'];
    }

    // Fallback: try to get from history state
    if (!formData && (window as any).history?.state) {
      formData = (window as any).history.state['formData'];
    }

    // Fallback: try to get from localStorage
    if (!formData) {
      const storedData = localStorage.getItem('thankyouFormData');
      if (storedData) {
        formData = JSON.parse(storedData);
        // Clear localStorage after reading
        localStorage.removeItem('thankyouFormData');
      }
    }

    // Apply form data if available
    if (formData) {
      if (formData.title) this.title = formData.title;
      if (formData.message) this.message = formData.message;
      if (formData.subtitle) this.subtitle = formData.subtitle;
      if (formData.redirectUrl) this.redirectUrl = formData.redirectUrl;
      if (formData.redirectText) this.redirectText = formData.redirectText;
      if (formData.formType) this.formType = formData.formType;
      if (formData.additionalInfo) {
        this.showAdditionalInfo = true;
        this.additionalInfo = formData.additionalInfo;
      }
    }
    // If no formData, use default values (for direct navigation or fallback)

    // Set form-specific defaults based on formType
    this.setFormSpecificDefaults();
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
      case 'japantour':
        this.title = this.title === 'Thank You!' ? 'Thank You for Your Japan Tour Enquiry!' : this.title;
        this.message = this.message === 'Your form has been submitted successfully.' 
          ? 'Your Japan Tour enquiry has been received. We will contact you soon with more details and a personalized quote.' 
          : this.message;
        break;
    }
  }

  navigateNow() {
    this.router.navigate([this.redirectUrl]);
  }
}
