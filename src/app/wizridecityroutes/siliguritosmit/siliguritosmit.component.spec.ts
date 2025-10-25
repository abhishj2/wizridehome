import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritosmitComponent } from './siliguritosmit.component';

describe('SiliguritosmitComponent', () => {
  let component: SiliguritosmitComponent;
  let fixture: ComponentFixture<SiliguritosmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritosmitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritosmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
