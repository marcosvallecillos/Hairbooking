import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalShowReserveComponent } from './modal-show-reserve.component';

describe('ModalShowReserveComponent', () => {
  let component: ModalShowReserveComponent;
  let fixture: ComponentFixture<ModalShowReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalShowReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalShowReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
