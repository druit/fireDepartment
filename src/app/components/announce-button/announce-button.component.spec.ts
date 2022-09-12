import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceButtonComponent } from './announce-button.component';

describe('AnnounceButtonComponent', () => {
  let component: AnnounceButtonComponent;
  let fixture: ComponentFixture<AnnounceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnounceButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
