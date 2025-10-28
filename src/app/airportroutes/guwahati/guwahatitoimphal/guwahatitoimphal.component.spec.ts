import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitoimphalComponent } from './guwahatitoimphal.component';

describe('GuwahatitoimphalComponent', () => {
  let component: GuwahatitoimphalComponent;
  let fixture: ComponentFixture<GuwahatitoimphalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitoimphalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitoimphalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
