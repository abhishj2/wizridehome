import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizzrideinternationalholidayComponent } from './wizzrideinternationalholiday.component';

describe('WizzrideinternationalholidayComponent', () => {
  let component: WizzrideinternationalholidayComponent;
  let fixture: ComponentFixture<WizzrideinternationalholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizzrideinternationalholidayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WizzrideinternationalholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
