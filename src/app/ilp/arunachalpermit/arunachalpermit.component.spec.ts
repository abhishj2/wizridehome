import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArunachalpermitComponent } from './arunachalpermit.component';

describe('ArunachalpermitComponent', () => {
  let component: ArunachalpermitComponent;
  let fixture: ComponentFixture<ArunachalpermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArunachalpermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArunachalpermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
