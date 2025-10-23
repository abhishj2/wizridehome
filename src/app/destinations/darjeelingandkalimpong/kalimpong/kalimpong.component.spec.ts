import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalimpongComponent } from './kalimpong.component';

describe('KalimpongComponent', () => {
  let component: KalimpongComponent;
  let fixture: ComponentFixture<KalimpongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalimpongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KalimpongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
