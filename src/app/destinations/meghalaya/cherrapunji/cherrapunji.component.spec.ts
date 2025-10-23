import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CherrapunjiComponent } from './cherrapunji.component';

describe('CherrapunjiComponent', () => {
  let component: CherrapunjiComponent;
  let fixture: ComponentFixture<CherrapunjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CherrapunjiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CherrapunjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
