import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratodelhiComponent } from './bagdogratodelhi.component';

describe('BagdogratodelhiComponent', () => {
  let component: BagdogratodelhiComponent;
  let fixture: ComponentFixture<BagdogratodelhiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratodelhiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratodelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
