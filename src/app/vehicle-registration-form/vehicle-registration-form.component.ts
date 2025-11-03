import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
}

interface VehicleBrand {
  id: number;
  name: string;
  slug: string;
}

interface VehicleFormData {
  title: string;
  content: string;
  status: string;
  vehicle_category: number[];
  vehicle_brand: number[];
  acf: {
    price: string;
    km: string;
    year: string;
    fuel: string;
    img: string | number;
    registrationyear: string;
    insurance: string;
    seats: number;
    rto: string;
    ownership: string;
    engine_displacement: string;
    transmission: string;
    manufactureyear: string;
    owner_name: string;
    email: string;
    phone_number: string;
    vehicle_number: string;
    address: string;
    city: string;
    state: string;
    pin_code: string;
    is_approved: boolean;
  };
}

@Component({
  selector: 'app-vehicle-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-registration-form.component.html',
  styleUrl: './vehicle-registration-form.component.css'
})
export class VehicleRegistrationFormComponent implements OnInit {
  
  // Form data
  vehicleTitle: string = '';
  vehicleCategory: number | null = null;
  vehicleBrand: number | null = null;
  price: string = '';
  km: string = '';
  year: string = '';
  fuel: string = '';
  img: string = '';
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  registrationYear: string = '';
  insurance: string = '';
  seats: number | null = null;
  rto: string = '';
  ownership: string = '';
  engineDisplacement: string = '';
  transmission: string = '';
  manufactureYear: string = '';
  ownerName: string = '';
  email: string = '';
  phoneNumber: string = '';
  vehicleNumber: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  pinCode: string = '';
  
  vehicleCategories: VehicleCategory[] = [];
  isLoadingCategories: boolean = true;
  vehicleBrands: VehicleBrand[] = [];
  isLoadingBrands: boolean = true;
  
  isSubmitting: boolean = false;
  submitMessage: string = '';
  submitError: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchVehicleCategories();
    this.fetchVehicleBrands();
  }

  fetchVehicleCategories(): void {
    this.isLoadingCategories = true;
    this.http.get<VehicleCategory[]>('http://wizcms.test/wp-json/wp/v2/vehicle_category')
      .subscribe({
        next: (data) => {
          this.vehicleCategories = data;
          this.isLoadingCategories = false;
          console.log('Vehicle categories loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle categories:', error);
          this.isLoadingCategories = false;
          this.vehicleCategories = [];
        }
      });
  }

  fetchVehicleBrands(): void {
    this.isLoadingBrands = true;
    this.http.get<VehicleBrand[]>('http://wizcms.test/wp-json/wp/v2/vehicle_brand')
      .subscribe({
        next: (data) => {
          this.vehicleBrands = data;
          this.isLoadingBrands = false;
          console.log('Vehicle brands loaded:', data);
        },
        error: (error) => {
          console.error('Error fetching vehicle brands:', error);
          this.isLoadingBrands = false;
          this.vehicleBrands = [];
        }
      });
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      console.log('Image selected:', file.name);
    }
  }

  uploadImageToWordPress(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.selectedImageFile) {
        resolve(0); // No image selected
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedImageFile);

      this.http.post<any>('http://wizcms.test/wp-json/wp/v2/media', formData)
        .subscribe({
          next: (response) => {
            console.log('Image uploaded successfully:', response);
            console.log('Media ID:', response.id);
            console.log('Image URL:', response.source_url);
            resolve(response.id); // Return the media ID (not URL)
          },
          error: (error) => {
            console.error('Error uploading image:', error);
            reject(error);
          }
        });
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitError = '';

    try {
      // Upload image first if file is selected
      let imageId: number | string = this.img;
      if (this.selectedImageFile) {
        imageId = await this.uploadImageToWordPress();
      }

      const vehicleData: VehicleFormData = {
        title: this.vehicleTitle,
        content: `${this.vehicleTitle} - ${this.year} ${this.fuel}`,
        status: 'publish', // Publish immediately, but is_approved controls visibility
        vehicle_category: this.vehicleCategory ? [this.vehicleCategory] : [],
        vehicle_brand: this.vehicleBrand ? [this.vehicleBrand] : [],
        acf: {
          price: this.price,
          km: this.km,
          year: this.year,
          fuel: this.fuel,
          img: imageId, // Send as number (media ID) for ACF File field
          registrationyear: this.registrationYear,
          insurance: this.insurance,
          seats: this.seats || 0,
          rto: this.rto,
          ownership: this.ownership,
          engine_displacement: this.engineDisplacement,
          transmission: this.transmission,
          manufactureyear: this.manufactureYear,
          owner_name: this.ownerName,
          email: this.email,
          phone_number: this.phoneNumber,
          vehicle_number: this.vehicleNumber,
          address: this.address,
          city: this.city,
          state: this.state,
          pin_code: this.pinCode,
          is_approved: false // Default to not approved
        }
      };

      console.log('Submitting vehicle data:', vehicleData);

      this.http.post('http://wizcms.test/wp-json/wp/v2/buy_sell_cars', vehicleData)
        .subscribe({
          next: (response) => {
            console.log('Vehicle submitted successfully:', response);
            this.isSubmitting = false;
            this.submitMessage = 'Your vehicle has been submitted successfully! It will be reviewed by our admin team.';
            
            // Reset form after 3 seconds and redirect
            setTimeout(() => {
              this.router.navigate(['/sellyourcar']);
            }, 3000);
          },
          error: (error) => {
            console.error('Error submitting vehicle:', error);
            this.isSubmitting = false;
            this.submitError = 'There was an error submitting your vehicle. Please try again.';
          }
        });
    } catch (error) {
      console.error('Error during form submission:', error);
      this.isSubmitting = false;
      this.submitError = 'There was an error uploading the image. Please try again.';
    }
  }

  goBack(): void {
    this.router.navigate(['/sellyourcar']);
  }
}
