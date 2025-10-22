import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatasialoopComponent } from './batasialoop.component';

describe('BatasialoopComponent', () => {
  let component: BatasialoopComponent;
  let fixture: ComponentFixture<BatasialoopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatasialoopComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatasialoopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
