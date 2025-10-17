import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerwithusComponent } from './partnerwithus.component';

describe('PartnerwithusComponent', () => {
  let component: PartnerwithusComponent;
  let fixture: ComponentFixture<PartnerwithusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerwithusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerwithusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
