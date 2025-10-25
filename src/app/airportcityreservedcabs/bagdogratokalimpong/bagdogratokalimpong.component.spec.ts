import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratokalimpongComponent } from './bagdogratokalimpong.component';

describe('BagdogratokalimpongComponent', () => {
  let component: BagdogratokalimpongComponent;
  let fixture: ComponentFixture<BagdogratokalimpongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratokalimpongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratokalimpongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
