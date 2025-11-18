import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabamandirComponent } from './babamandir.component';

describe('BabamandirComponent', () => {
  let component: BabamandirComponent;
  let fixture: ComponentFixture<BabamandirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BabamandirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BabamandirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
