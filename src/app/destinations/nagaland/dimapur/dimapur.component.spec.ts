import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimapurComponent } from './dimapur.component';

describe('DimapurComponent', () => {
  let component: DimapurComponent;
  let fixture: ComponentFixture<DimapurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimapurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DimapurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
