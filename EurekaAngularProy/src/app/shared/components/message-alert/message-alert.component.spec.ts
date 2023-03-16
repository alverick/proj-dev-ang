import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageAlertComponent } from './message-alert.component';

describe('MessageAlertComponent', () => {
  let component: MessageAlertComponent;
  let fixture: ComponentFixture<MessageAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MessageAlertComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
