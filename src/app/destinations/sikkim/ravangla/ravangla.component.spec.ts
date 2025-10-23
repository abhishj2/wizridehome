import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RavanglaComponent } from './ravangla.component';

describe('RavanglaComponent', () => {
  let component: RavanglaComponent;
  let fixture: ComponentFixture<RavanglaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RavanglaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RavanglaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
