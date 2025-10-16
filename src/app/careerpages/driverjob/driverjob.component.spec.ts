import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverjobComponent } from './driverjob.component';

describe('DriverjobComponent', () => {
  let component: DriverjobComponent;
  let fixture: ComponentFixture<DriverjobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverjobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriverjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
