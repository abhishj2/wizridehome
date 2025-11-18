import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AritarlakeComponent } from './aritarlake.component';

describe('AritarlakeComponent', () => {
  let component: AritarlakeComponent;
  let fixture: ComponentFixture<AritarlakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AritarlakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AritarlakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
