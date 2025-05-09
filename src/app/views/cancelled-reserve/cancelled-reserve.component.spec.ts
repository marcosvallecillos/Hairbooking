import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledReserveComponent } from './cancelled-reserve.component';

describe('CancelledReserveComponent', () => {
  let component: CancelledReserveComponent;
  let fixture: ComponentFixture<CancelledReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
