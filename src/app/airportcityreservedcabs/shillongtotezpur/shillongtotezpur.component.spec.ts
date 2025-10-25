import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShillongtotezpurComponent } from './shillongtotezpur.component';

describe('ShillongtotezpurComponent', () => {
  let component: ShillongtotezpurComponent;
  let fixture: ComponentFixture<ShillongtotezpurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShillongtotezpurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShillongtotezpurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
