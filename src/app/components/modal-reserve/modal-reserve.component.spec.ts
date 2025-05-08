import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReserveComponent } from './modal-reserve.component';

describe('ModalReserveComponent', () => {
  let component: ModalReserveComponent;
  let fixture: ComponentFixture<ModalReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
