import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogmainComponent } from './blogmain.component';

describe('BlogmainComponent', () => {
  let component: BlogmainComponent;
  let fixture: ComponentFixture<BlogmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogmainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
