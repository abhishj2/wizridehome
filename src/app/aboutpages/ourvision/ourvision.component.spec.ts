import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurvisionComponent } from './ourvision.component';

describe('OurvisionComponent', () => {
  let component: OurvisionComponent;
  let fixture: ComponentFixture<OurvisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurvisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
