import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhalukpongComponent } from './bhalukpong.component';

describe('BhalukpongComponent', () => {
  let component: BhalukpongComponent;
  let fixture: ComponentFixture<BhalukpongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BhalukpongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BhalukpongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
