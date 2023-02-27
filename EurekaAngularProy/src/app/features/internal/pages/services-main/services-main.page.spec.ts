import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesMainPage } from './services-main.page';

describe('ServicesMainPage', () => {
  let component: ServicesMainPage;
  let fixture: ComponentFixture<ServicesMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesMainPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
