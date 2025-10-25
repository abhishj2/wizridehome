import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratodarjeelingComponent } from './bagdogratodarjeeling.component';

describe('BagdogratodarjeelingComponent', () => {
  let component: BagdogratodarjeelingComponent;
  let fixture: ComponentFixture<BagdogratodarjeelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratodarjeelingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratodarjeelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
