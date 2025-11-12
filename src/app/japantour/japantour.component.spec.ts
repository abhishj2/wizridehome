import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JapantourComponent } from './japantour.component';

describe('JapantourComponent', () => {
  let component: JapantourComponent;
  let fixture: ComponentFixture<JapantourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JapantourComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JapantourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
