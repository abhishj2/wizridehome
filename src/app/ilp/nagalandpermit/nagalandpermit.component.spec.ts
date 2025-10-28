import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NagalandpermitComponent } from './nagalandpermit.component';

describe('NagalandpermitComponent', () => {
  let component: NagalandpermitComponent;
  let fixture: ComponentFixture<NagalandpermitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NagalandpermitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NagalandpermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
