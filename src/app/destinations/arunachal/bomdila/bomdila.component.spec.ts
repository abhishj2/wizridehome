import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomdilaComponent } from './bomdila.component';

describe('BomdilaComponent', () => {
  let component: BomdilaComponent;
  let fixture: ComponentFixture<BomdilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BomdilaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BomdilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
