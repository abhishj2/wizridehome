import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NathulapassComponent } from './nathulapass.component';

describe('NathulapassComponent', () => {
  let component: NathulapassComponent;
  let fixture: ComponentFixture<NathulapassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NathulapassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NathulapassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
