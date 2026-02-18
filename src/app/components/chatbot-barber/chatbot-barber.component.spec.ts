import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotBarberComponent } from './chatbot-barber.component';

describe('ChatbotBarberComponent', () => {
  let component: ChatbotBarberComponent;
  let fixture: ComponentFixture<ChatbotBarberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotBarberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotBarberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
