import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercityridesComponent } from './intercityrides.component';

describe('IntercityridesComponent', () => {
  let component: IntercityridesComponent;
  let fixture: ComponentFixture<IntercityridesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntercityridesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntercityridesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
