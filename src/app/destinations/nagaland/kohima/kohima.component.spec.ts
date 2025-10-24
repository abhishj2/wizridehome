import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KohimaComponent } from './kohima.component';

describe('KohimaComponent', () => {
  let component: KohimaComponent;
  let fixture: ComponentFixture<KohimaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KohimaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KohimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
