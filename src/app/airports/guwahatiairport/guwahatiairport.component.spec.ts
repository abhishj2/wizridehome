import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatiairportComponent } from './guwahatiairport.component';

describe('GuwahatiairportComponent', () => {
  let component: GuwahatiairportComponent;
  let fixture: ComponentFixture<GuwahatiairportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatiairportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatiairportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
