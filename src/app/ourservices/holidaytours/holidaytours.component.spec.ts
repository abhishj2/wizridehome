import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaytoursComponent } from './holidaytours.component';

describe('HolidaytoursComponent', () => {
  let component: HolidaytoursComponent;
  let fixture: ComponentFixture<HolidaytoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaytoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidaytoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
