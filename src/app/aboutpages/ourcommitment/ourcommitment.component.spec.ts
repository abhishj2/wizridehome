import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurcommitmentComponent } from './ourcommitment.component';

describe('OurcommitmentComponent', () => {
  let component: OurcommitmentComponent;
  let fixture: ComponentFixture<OurcommitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurcommitmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurcommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
