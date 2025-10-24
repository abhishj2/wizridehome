import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdograirportComponent } from './bagdograirport.component';

describe('BagdograirportComponent', () => {
  let component: BagdograirportComponent;
  let fixture: ComponentFixture<BagdograirportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdograirportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdograirportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
