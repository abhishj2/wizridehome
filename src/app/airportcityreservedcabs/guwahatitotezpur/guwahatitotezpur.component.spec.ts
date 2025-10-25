import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitotezpurComponent } from './guwahatitotezpur.component';

describe('GuwahatitotezpurComponent', () => {
  let component: GuwahatitotezpurComponent;
  let fixture: ComponentFixture<GuwahatitotezpurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitotezpurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitotezpurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
