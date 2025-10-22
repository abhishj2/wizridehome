import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuksomComponent } from './yuksom.component';

describe('YuksomComponent', () => {
  let component: YuksomComponent;
  let fixture: ComponentFixture<YuksomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YuksomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YuksomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
