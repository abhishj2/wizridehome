import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DawkiComponent } from './dawki.component';

describe('DawkiComponent', () => {
  let component: DawkiComponent;
  let fixture: ComponentFixture<DawkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DawkiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DawkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
