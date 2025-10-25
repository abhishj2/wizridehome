import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagairportodarjeelingComponent } from './bagairportodarjeeling.component';

describe('BagairportodarjeelingComponent', () => {
  let component: BagairportodarjeelingComponent;
  let fixture: ComponentFixture<BagairportodarjeelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagairportodarjeelingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagairportodarjeelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
