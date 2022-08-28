import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDateServiceComponent } from './delete-date-service.component';

describe('DeleteDateServiceComponent', () => {
  let component: DeleteDateServiceComponent;
  let fixture: ComponentFixture<DeleteDateServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDateServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
