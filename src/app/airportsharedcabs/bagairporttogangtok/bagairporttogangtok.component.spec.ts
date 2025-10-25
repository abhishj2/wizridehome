import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagairporttogangtokComponent } from './bagairporttogangtok.component';

describe('BagairporttogangtokComponent', () => {
  let component: BagairporttogangtokComponent;
  let fixture: ComponentFixture<BagairporttogangtokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagairporttogangtokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagairporttogangtokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
