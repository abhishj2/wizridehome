import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritokalimpongComponent } from './siliguritokalimpong.component';

describe('SiliguritokalimpongComponent', () => {
  let component: SiliguritokalimpongComponent;
  let fixture: ComponentFixture<SiliguritokalimpongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritokalimpongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritokalimpongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
