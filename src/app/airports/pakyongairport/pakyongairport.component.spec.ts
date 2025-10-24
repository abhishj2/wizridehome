import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakyongairportComponent } from './pakyongairport.component';

describe('PakyongairportComponent', () => {
  let component: PakyongairportComponent;
  let fixture: ComponentFixture<PakyongairportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PakyongairportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PakyongairportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
