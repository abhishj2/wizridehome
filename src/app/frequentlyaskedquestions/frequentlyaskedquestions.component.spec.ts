import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentlyaskedquestionsComponent } from './frequentlyaskedquestions.component';

describe('FrequentlyaskedquestionsComponent', () => {
  let component: FrequentlyaskedquestionsComponent;
  let fixture: ComponentFixture<FrequentlyaskedquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrequentlyaskedquestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrequentlyaskedquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
