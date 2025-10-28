import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakyoongtodelhiComponent } from './pakyoongtodelhi.component';

describe('PakyoongtodelhiComponent', () => {
  let component: PakyoongtodelhiComponent;
  let fixture: ComponentFixture<PakyoongtodelhiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PakyoongtodelhiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PakyoongtodelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
