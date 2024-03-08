import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ValidationDefaultsComponent } from './validation-defaults.component';

describe('ValidationDefaultsComponent', () => {
  let component: ValidationDefaultsComponent;
  let fixture: ComponentFixture<ValidationDefaultsComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(ValidationDefaultsComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationDefaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
