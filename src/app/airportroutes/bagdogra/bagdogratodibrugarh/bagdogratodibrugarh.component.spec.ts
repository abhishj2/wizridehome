import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratodibrugarhComponent } from './bagdogratodibrugarh.component';

describe('BagdogratodibrugarhComponent', () => {
  let component: BagdogratodibrugarhComponent;
  let fixture: ComponentFixture<BagdogratodibrugarhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratodibrugarhComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratodibrugarhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
