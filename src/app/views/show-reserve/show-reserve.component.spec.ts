import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReserveComponent } from './show-reserve.component';

describe('ShowReserveComponent', () => {
  let component: ShowReserveComponent;
  let fixture: ComponentFixture<ShowReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
