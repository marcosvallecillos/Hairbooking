import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyCookiesComponent } from './policy-cookies.component';

describe('PolicyCookiesComponent', () => {
  let component: PolicyCookiesComponent;
  let fixture: ComponentFixture<PolicyCookiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyCookiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




