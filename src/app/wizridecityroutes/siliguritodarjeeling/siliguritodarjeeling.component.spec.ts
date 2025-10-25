import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritodarjeelingComponent } from './siliguritodarjeeling.component';

describe('SiliguritodarjeelingComponent', () => {
  let component: SiliguritodarjeelingComponent;
  let fixture: ComponentFixture<SiliguritodarjeelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritodarjeelingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritodarjeelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
