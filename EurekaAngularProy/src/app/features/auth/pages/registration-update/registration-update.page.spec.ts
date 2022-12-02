import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationUpdatePage } from './registration-update.page';

describe('RegistrationUpdateComponent', () => {
  let component: RegistrationUpdatePage;
  let fixture: ComponentFixture<RegistrationUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationUpdatePage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
