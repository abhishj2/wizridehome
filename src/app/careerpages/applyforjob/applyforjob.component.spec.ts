import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyforjobComponent } from './applyforjob.component';

describe('ApplyforjobComponent', () => {
  let component: ApplyforjobComponent;
  let fixture: ComponentFixture<ApplyforjobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyforjobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplyforjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
