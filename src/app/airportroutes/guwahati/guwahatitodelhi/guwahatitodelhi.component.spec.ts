import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitodelhiComponent } from './guwahatitodelhi.component';

describe('GuwahatitodelhiComponent', () => {
  let component: GuwahatitodelhiComponent;
  let fixture: ComponentFixture<GuwahatitodelhiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitodelhiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitodelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
