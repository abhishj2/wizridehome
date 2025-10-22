import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamchiComponent } from './namchi.component';

describe('NamchiComponent', () => {
  let component: NamchiComponent;
  let fixture: ComponentFixture<NamchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamchiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NamchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
