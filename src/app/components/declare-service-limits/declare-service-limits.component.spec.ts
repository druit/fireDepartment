import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareServiceLimitsComponent } from './declare-service-limits.component';

describe('DeclareServiceLimitsComponent', () => {
  let component: DeclareServiceLimitsComponent;
  let fixture: ComponentFixture<DeclareServiceLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclareServiceLimitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclareServiceLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
