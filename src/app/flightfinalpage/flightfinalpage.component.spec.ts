import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightfinalpageComponent } from './flightfinalpage.component';

describe('FlightfinalpageComponent', () => {
  let component: FlightfinalpageComponent;
  let fixture: ComponentFixture<FlightfinalpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightfinalpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlightfinalpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
