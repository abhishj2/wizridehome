import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavasagarComponent } from './savasagar.component';

describe('SavasagarComponent', () => {
  let component: SavasagarComponent;
  let fixture: ComponentFixture<SavasagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavasagarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavasagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
