import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UmiamlakeComponent } from './umiamlake.component';

describe('UmiamlakeComponent', () => {
  let component: UmiamlakeComponent;
  let fixture: ComponentFixture<UmiamlakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UmiamlakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UmiamlakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
