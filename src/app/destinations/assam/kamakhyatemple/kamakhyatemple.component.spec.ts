import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KamakhyatempleComponent } from './kamakhyatemple.component';

describe('KamakhyatempleComponent', () => {
  let component: KamakhyatempleComponent;
  let fixture: ComponentFixture<KamakhyatempleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KamakhyatempleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KamakhyatempleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
