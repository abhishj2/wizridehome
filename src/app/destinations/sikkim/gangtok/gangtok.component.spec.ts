import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GangtokComponent } from './gangtok.component';

describe('GangtokComponent', () => {
  let component: GangtokComponent;
  let fixture: ComponentFixture<GangtokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GangtokComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GangtokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
