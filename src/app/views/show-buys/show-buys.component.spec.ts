import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBuysComponent } from './show-buys.component';

describe('ShowBuysComponent', () => {
  let component: ShowBuysComponent;
  let fixture: ComponentFixture<ShowBuysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBuysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBuysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
