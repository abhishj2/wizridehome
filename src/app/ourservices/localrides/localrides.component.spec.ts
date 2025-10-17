import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalridesComponent } from './localrides.component';

describe('LocalridesComponent', () => {
  let component: LocalridesComponent;
  let fixture: ComponentFixture<LocalridesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalridesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalridesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
