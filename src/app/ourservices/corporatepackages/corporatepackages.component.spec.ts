import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporatepackagesComponent } from './corporatepackages.component';

describe('CorporatepackagesComponent', () => {
  let component: CorporatepackagesComponent;
  let fixture: ComponentFixture<CorporatepackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporatepackagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporatepackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
