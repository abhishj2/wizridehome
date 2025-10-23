import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahaticityComponent } from './guwahaticity.component';

describe('GuwahaticityComponent', () => {
  let component: GuwahaticityComponent;
  let fixture: ComponentFixture<GuwahaticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahaticityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahaticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
