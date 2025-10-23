import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MajuliislandComponent } from './majuliisland.component';

describe('MajuliislandComponent', () => {
  let component: MajuliislandComponent;
  let fixture: ComponentFixture<MajuliislandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MajuliislandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MajuliislandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
