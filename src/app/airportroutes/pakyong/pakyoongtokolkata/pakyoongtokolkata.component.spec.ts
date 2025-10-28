import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakyoongtokolkataComponent } from './pakyoongtokolkata.component';

describe('PakyoongtokolkataComponent', () => {
  let component: PakyoongtokolkataComponent;
  let fixture: ComponentFixture<PakyoongtokolkataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PakyoongtokolkataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PakyoongtokolkataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
