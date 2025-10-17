import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfulencerapplyComponent } from './infulencerapply.component';

describe('InfulencerapplyComponent', () => {
  let component: InfulencerapplyComponent;
  let fixture: ComponentFixture<InfulencerapplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfulencerapplyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfulencerapplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
