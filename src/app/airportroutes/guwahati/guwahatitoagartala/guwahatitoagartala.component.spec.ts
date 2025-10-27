import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitoagartalaComponent } from './guwahatitoagartala.component';

describe('GuwahatitoagartalaComponent', () => {
  let component: GuwahatitoagartalaComponent;
  let fixture: ComponentFixture<GuwahatitoagartalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitoagartalaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitoagartalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
