import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsomgolakeComponent } from './tsomgolake.component';

describe('TsomgolakeComponent', () => {
  let component: TsomgolakeComponent;
  let fixture: ComponentFixture<TsomgolakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsomgolakeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TsomgolakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
