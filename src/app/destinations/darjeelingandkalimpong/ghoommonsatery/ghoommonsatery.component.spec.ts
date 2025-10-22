import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhoommonsateryComponent } from './ghoommonsatery.component';

describe('GhoommonsateryComponent', () => {
  let component: GhoommonsateryComponent;
  let fixture: ComponentFixture<GhoommonsateryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhoommonsateryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GhoommonsateryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
