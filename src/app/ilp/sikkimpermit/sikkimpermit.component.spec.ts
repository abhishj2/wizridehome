import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SikkimpermitComponent } from './sikkimpermit.component';

describe('SikkimpermitComponent', () => {
  let component: SikkimpermitComponent;
  let fixture: ComponentFixture<SikkimpermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SikkimpermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SikkimpermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
