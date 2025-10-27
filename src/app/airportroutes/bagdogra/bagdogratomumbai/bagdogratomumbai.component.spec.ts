import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratomumbaiComponent } from './bagdogratomumbai.component';

describe('BagdogratomumbaiComponent', () => {
  let component: BagdogratomumbaiComponent;
  let fixture: ComponentFixture<BagdogratomumbaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratomumbaiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratomumbaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
