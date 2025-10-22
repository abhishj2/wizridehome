import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyvalleyteaestateComponent } from './happyvalleyteaestate.component';

describe('HappyvalleyteaestateComponent', () => {
  let component: HappyvalleyteaestateComponent;
  let fixture: ComponentFixture<HappyvalleyteaestateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyvalleyteaestateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HappyvalleyteaestateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
