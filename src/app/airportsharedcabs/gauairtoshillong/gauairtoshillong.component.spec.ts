import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GauairtoshillongComponent } from './gauairtoshillong.component';

describe('GauairtoshillongComponent', () => {
  let component: GauairtoshillongComponent;
  let fixture: ComponentFixture<GauairtoshillongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GauairtoshillongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GauairtoshillongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
