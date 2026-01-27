import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteallComponent } from './modal-deleteall.component';

describe('ModalDeleteallComponent', () => {
  let component: ModalDeleteallComponent;
  let fixture: ComponentFixture<ModalDeleteallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeleteallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
