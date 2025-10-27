import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratoguwahatiComponent } from './bagdogratoguwahati.component';

describe('BagdogratoguwahatiComponent', () => {
  let component: BagdogratoguwahatiComponent;
  let fixture: ComponentFixture<BagdogratoguwahatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratoguwahatiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratoguwahatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
