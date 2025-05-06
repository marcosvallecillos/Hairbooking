import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuedServicesComponent } from './valued-services.component';

describe('ValuedServicesComponent', () => {
  let component: ValuedServicesComponent;
  let fixture: ComponentFixture<ValuedServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuedServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuedServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
