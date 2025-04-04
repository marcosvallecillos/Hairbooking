import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCompraComponent } from './modal-compra.component';

describe('ModalCompraComponent', () => {
  let component: ModalCompraComponent;
  let fixture: ComponentFixture<ModalCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
