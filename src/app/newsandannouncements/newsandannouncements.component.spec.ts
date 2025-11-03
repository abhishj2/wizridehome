import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsandannouncementsComponent } from './newsandannouncements.component';

describe('NewsandannouncementsComponent', () => {
  let component: NewsandannouncementsComponent;
  let fixture: ComponentFixture<NewsandannouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsandannouncementsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsandannouncementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
