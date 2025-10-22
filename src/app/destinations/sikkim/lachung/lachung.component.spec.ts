import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LachungComponent } from './lachung.component';

describe('LachungComponent', () => {
  let component: LachungComponent;
  let fixture: ComponentFixture<LachungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LachungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LachungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
