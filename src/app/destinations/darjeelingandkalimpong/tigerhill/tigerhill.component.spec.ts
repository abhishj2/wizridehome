import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TigerhillComponent } from './tigerhill.component';

describe('TigerhillComponent', () => {
  let component: TigerhillComponent;
  let fixture: ComponentFixture<TigerhillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TigerhillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TigerhillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
