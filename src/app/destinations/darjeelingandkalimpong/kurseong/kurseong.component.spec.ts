import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KurseongComponent } from './kurseong.component';

describe('KurseongComponent', () => {
  let component: KurseongComponent;
  let fixture: ComponentFixture<KurseongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KurseongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KurseongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
