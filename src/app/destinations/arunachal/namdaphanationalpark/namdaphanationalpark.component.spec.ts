import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamdaphanationalparkComponent } from './namdaphanationalpark.component';

describe('NamdaphanationalparkComponent', () => {
  let component: NamdaphanationalparkComponent;
  let fixture: ComponentFixture<NamdaphanationalparkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamdaphanationalparkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NamdaphanationalparkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
