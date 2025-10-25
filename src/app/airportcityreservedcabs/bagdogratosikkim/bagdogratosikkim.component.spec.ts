import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratosikkimComponent } from './bagdogratosikkim.component';

describe('BagdogratosikkimComponent', () => {
  let component: BagdogratosikkimComponent;
  let fixture: ComponentFixture<BagdogratosikkimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratosikkimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratosikkimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
