import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratobengaluruComponent } from './bagdogratobengaluru.component';

describe('BagdogratobengaluruComponent', () => {
  let component: BagdogratobengaluruComponent;
  let fixture: ComponentFixture<BagdogratobengaluruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratobengaluruComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratobengaluruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
