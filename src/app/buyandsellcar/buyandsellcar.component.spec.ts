import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyandsellcarComponent } from './buyandsellcar.component';

describe('BuyandsellcarComponent', () => {
  let component: BuyandsellcarComponent;
  let fixture: ComponentFixture<BuyandsellcarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyandsellcarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyandsellcarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
