import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShillongairportComponent } from './shillongairport.component';

describe('ShillongairportComponent', () => {
  let component: ShillongairportComponent;
  let fixture: ComponentFixture<ShillongairportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShillongairportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShillongairportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
