import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuwahatitokolkataComponent } from './guwahatitokolkata.component';

describe('GuwahatitokolkataComponent', () => {
  let component: GuwahatitokolkataComponent;
  let fixture: ComponentFixture<GuwahatitokolkataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuwahatitokolkataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuwahatitokolkataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
