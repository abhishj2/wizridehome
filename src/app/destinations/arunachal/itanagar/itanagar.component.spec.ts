import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItanagarComponent } from './itanagar.component';

describe('ItanagarComponent', () => {
  let component: ItanagarComponent;
  let fixture: ComponentFixture<ItanagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItanagarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItanagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
