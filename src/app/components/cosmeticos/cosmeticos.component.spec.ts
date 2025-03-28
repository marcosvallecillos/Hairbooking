import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmeticosComponent } from './cosmeticos.component';

describe('CosmeticosComponent', () => {
  let component: CosmeticosComponent;
  let fixture: ComponentFixture<CosmeticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosmeticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosmeticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
