import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitoshillongComponent } from './guwahatitoshillong.component';

describe('GuwahatitoshillongComponent', () => {
  let component: GuwahatitoshillongComponent;
  let fixture: ComponentFixture<GuwahatitoshillongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitoshillongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitoshillongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
