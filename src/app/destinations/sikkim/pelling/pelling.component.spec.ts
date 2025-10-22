import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PellingComponent } from './pelling.component';

describe('PellingComponent', () => {
  let component: PellingComponent;
  let fixture: ComponentFixture<PellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PellingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
