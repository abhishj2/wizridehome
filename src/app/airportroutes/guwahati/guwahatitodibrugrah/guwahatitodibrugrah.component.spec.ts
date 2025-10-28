import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitodibrugrahComponent } from './guwahatitodibrugrah.component';

describe('GuwahatitodibrugrahComponent', () => {
  let component: GuwahatitodibrugrahComponent;
  let fixture: ComponentFixture<GuwahatitodibrugrahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitodibrugrahComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitodibrugrahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
