import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangpoComponent } from './rangpo.component';

describe('RangpoComponent', () => {
  let component: RangpoComponent;
  let fixture: ComponentFixture<RangpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
