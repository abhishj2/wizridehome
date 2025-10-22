import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HimalayanzoologicalparkComponent } from './himalayanzoologicalpark.component';

describe('HimalayanzoologicalparkComponent', () => {
  let component: HimalayanzoologicalparkComponent;
  let fixture: ComponentFixture<HimalayanzoologicalparkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HimalayanzoologicalparkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HimalayanzoologicalparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
