import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRegistrationFormComponent } from './vehicle-registration-form.component';

describe('VehicleRegistrationFormComponent', () => {
  let component: VehicleRegistrationFormComponent;
  let fixture: ComponentFixture<VehicleRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleRegistrationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
