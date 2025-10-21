import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyandsecurityComponent } from './privacyandsecurity.component';

describe('PrivacyandsecurityComponent', () => {
  let component: PrivacyandsecurityComponent;
  let fixture: ComponentFixture<PrivacyandsecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyandsecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacyandsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
