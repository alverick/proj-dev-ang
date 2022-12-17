import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalTermsComponent } from './modal-terms.component';

describe('ModalTermsComponent', () => {
  let component: ModalTermsComponent;
  let fixture: ComponentFixture<ModalTermsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTermsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
