import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesmainComponent } from './servicesmain.component';

describe('ServicesmainComponent', () => {
  let component: ServicesmainComponent;
  let fixture: ComponentFixture<ServicesmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesmainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
