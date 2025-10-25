import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagairportkalimpongComponent } from './bagairportkalimpong.component';

describe('BagairportkalimpongComponent', () => {
  let component: BagairportkalimpongComponent;
  let fixture: ComponentFixture<BagairportkalimpongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagairportkalimpongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagairportkalimpongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
