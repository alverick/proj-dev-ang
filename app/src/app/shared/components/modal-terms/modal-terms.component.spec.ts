import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { ModalTermsComponent } from './modal-terms.component';

describe('ModalTermsComponent', () => {
  let component: ModalTermsComponent;
  let fixture: ComponentFixture<ModalTermsComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [DynamicDialogRef],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
