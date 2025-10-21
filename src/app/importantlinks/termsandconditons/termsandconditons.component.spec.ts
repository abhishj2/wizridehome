import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsandconditonsComponent } from './termsandconditons.component';

describe('TermsandconditonsComponent', () => {
  let component: TermsandconditonsComponent;
  let fixture: ComponentFixture<TermsandconditonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsandconditonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TermsandconditonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
