import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaitlumcanyonsComponent } from './laitlumcanyons.component';

describe('LaitlumcanyonsComponent', () => {
  let component: LaitlumcanyonsComponent;
  let fixture: ComponentFixture<LaitlumcanyonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaitlumcanyonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaitlumcanyonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
