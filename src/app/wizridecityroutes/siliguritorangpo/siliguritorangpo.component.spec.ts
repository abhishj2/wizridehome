import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritorangpoComponent } from './siliguritorangpo.component';

describe('SiliguritorangpoComponent', () => {
  let component: SiliguritorangpoComponent;
  let fixture: ComponentFixture<SiliguritorangpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritorangpoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritorangpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
