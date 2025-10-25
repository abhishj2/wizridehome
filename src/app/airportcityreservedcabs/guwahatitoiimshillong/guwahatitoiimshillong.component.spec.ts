import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitoiimshillongComponent } from './guwahatitoiimshillong.component';

describe('GuwahatitoiimshillongComponent', () => {
  let component: GuwahatitoiimshillongComponent;
  let fixture: ComponentFixture<GuwahatitoiimshillongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitoiimshillongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitoiimshillongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
