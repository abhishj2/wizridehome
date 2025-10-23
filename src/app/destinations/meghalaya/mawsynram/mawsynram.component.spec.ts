import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MawsynramComponent } from './mawsynram.component';

describe('MawsynramComponent', () => {
  let component: MawsynramComponent;
  let fixture: ComponentFixture<MawsynramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MawsynramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MawsynramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
