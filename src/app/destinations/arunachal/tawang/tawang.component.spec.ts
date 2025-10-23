import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TawangComponent } from './tawang.component';

describe('TawangComponent', () => {
  let component: TawangComponent;
  let fixture: ComponentFixture<TawangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TawangComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TawangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
