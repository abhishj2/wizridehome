import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NortheastindiaholidayComponent } from './northeastindiaholiday.component';

describe('NortheastindiaholidayComponent', () => {
  let component: NortheastindiaholidayComponent;
  let fixture: ComponentFixture<NortheastindiaholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NortheastindiaholidayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NortheastindiaholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
