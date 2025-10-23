import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZirovalleyComponent } from './zirovalley.component';

describe('ZirovalleyComponent', () => {
  let component: ZirovalleyComponent;
  let fixture: ComponentFixture<ZirovalleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZirovalleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZirovalleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
