import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhonomagreenvillageComponent } from './khonomagreenvillage.component';

describe('KhonomagreenvillageComponent', () => {
  let component: KhonomagreenvillageComponent;
  let fixture: ComponentFixture<KhonomagreenvillageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhonomagreenvillageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KhonomagreenvillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
