import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurphilosophyComponent } from './ourphilosophy.component';

describe('OurphilosophyComponent', () => {
  let component: OurphilosophyComponent;
  let fixture: ComponentFixture<OurphilosophyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurphilosophyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurphilosophyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
