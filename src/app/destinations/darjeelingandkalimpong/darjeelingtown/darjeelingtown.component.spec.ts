import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarjeelingtownComponent } from './darjeelingtown.component';

describe('DarjeelingtownComponent', () => {
  let component: DarjeelingtownComponent;
  let fixture: ComponentFixture<DarjeelingtownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarjeelingtownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DarjeelingtownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
