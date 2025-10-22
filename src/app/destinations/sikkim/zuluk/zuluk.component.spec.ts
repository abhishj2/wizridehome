import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZulukComponent } from './zuluk.component';

describe('ZulukComponent', () => {
  let component: ZulukComponent;
  let fixture: ComponentFixture<ZulukComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZulukComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZulukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
