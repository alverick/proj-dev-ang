import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { RegistrationUpdatePage } from './registration-update.page';

describe('RegistrationUpdateComponent', () => {
  let component: RegistrationUpdatePage;
  let fixture: ComponentFixture<RegistrationUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
