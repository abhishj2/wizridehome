import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingResultsComponent } from './booking-results.component';

describe('BookingResultsComponent', () => {
  let component: BookingResultsComponent;
  let fixture: ComponentFixture<BookingResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
