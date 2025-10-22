import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RumtekmonasteryComponent } from './rumtekmonastery.component';

describe('RumtekmonasteryComponent', () => {
  let component: RumtekmonasteryComponent;
  let fixture: ComponentFixture<RumtekmonasteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RumtekmonasteryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RumtekmonasteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
