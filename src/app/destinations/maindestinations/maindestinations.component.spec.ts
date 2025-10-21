import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindestinationsComponent } from './maindestinations.component';

describe('MaindestinationsComponent', () => {
  let component: MaindestinationsComponent;
  let fixture: ComponentFixture<MaindestinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaindestinationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaindestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
