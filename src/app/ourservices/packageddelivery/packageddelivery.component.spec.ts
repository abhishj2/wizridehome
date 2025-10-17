import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageddeliveryComponent } from './packageddelivery.component';

describe('PackageddeliveryComponent', () => {
  let component: PackageddeliveryComponent;
  let fixture: ComponentFixture<PackageddeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageddeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageddeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
