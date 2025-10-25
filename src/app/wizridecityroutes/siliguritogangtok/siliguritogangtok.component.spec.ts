import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritogangtokComponent } from './siliguritogangtok.component';

describe('SiliguritogangtokComponent', () => {
  let component: SiliguritogangtokComponent;
  let fixture: ComponentFixture<SiliguritogangtokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritogangtokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritogangtokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
