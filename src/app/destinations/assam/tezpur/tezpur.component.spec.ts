import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TezpurComponent } from './tezpur.component';

describe('TezpurComponent', () => {
  let component: TezpurComponent;
  let fixture: ComponentFixture<TezpurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TezpurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TezpurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
