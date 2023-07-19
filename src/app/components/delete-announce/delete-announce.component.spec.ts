import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAnnounceComponent } from './delete-announce.component';

describe('DeleteAnnounceComponent', () => {
  let component: DeleteAnnounceComponent;
  let fixture: ComponentFixture<DeleteAnnounceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAnnounceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAnnounceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
