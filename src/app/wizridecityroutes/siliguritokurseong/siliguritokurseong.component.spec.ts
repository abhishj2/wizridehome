import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiliguritokurseongComponent } from './siliguritokurseong.component';

describe('SiliguritokurseongComponent', () => {
  let component: SiliguritokurseongComponent;
  let fixture: ComponentFixture<SiliguritokurseongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiliguritokurseongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiliguritokurseongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
