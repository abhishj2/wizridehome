import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagdogratokolkataComponent } from './bagdogratokolkata.component';

describe('BagdogratokolkataComponent', () => {
  let component: BagdogratokolkataComponent;
  let fixture: ComponentFixture<BagdogratokolkataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagdogratokolkataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BagdogratokolkataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
