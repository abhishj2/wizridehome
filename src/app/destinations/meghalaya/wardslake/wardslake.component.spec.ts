import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardslakeComponent } from './wardslake.component';

describe('WardslakeComponent', () => {
  let component: WardslakeComponent;
  let fixture: ComponentFixture<WardslakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardslakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WardslakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
