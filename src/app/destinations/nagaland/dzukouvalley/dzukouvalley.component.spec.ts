import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DzukouvalleyComponent } from './dzukouvalley.component';

describe('DzukouvalleyComponent', () => {
  let component: DzukouvalleyComponent;
  let fixture: ComponentFixture<DzukouvalleyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DzukouvalleyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DzukouvalleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
