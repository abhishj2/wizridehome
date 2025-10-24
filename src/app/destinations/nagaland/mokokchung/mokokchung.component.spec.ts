import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MokokchungComponent } from './mokokchung.component';

describe('MokokchungComponent', () => {
  let component: MokokchungComponent;
  let fixture: ComponentFixture<MokokchungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MokokchungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MokokchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
