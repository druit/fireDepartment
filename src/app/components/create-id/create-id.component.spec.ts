import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIDComponent } from './create-id.component';

describe('CreateIDComponent', () => {
  let component: CreateIDComponent;
  let fixture: ComponentFixture<CreateIDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
