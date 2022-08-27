import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDateServiceComponent } from './select-date-service.component';

describe('SelectDateServiceComponent', () => {
  let component: SelectDateServiceComponent;
  let fixture: ComponentFixture<SelectDateServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectDateServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
