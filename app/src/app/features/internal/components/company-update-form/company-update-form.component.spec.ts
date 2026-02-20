import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { errorRegisterAuth, errorsRegisterForm } from '../../../auth/constants';
import { CompanyConfigurationService } from '../../services';
import { CompanyUpdateFormComponent } from './company-update-form.component';

describe('CompanyUpdateFormComponent', () => {
  let component: CompanyUpdateFormComponent;
  let fixture: ComponentFixture<CompanyUpdateFormComponent>;
  let service: CompanyConfigurationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyUpdateFormComponent, ReactiveFormsModule],
      providers: [
        {
          provide: CompanyConfigurationService,
          useValue: {
            companyForm: new FormBuilder().group({
              name: [''],
              ruc: [''],
              entry: [''],
              entryName: [''],
              email: [''],
              movilNumber: [''],
              movilOperator: [''],
              documentType: [''],
              documentNumber: [''],
            }),
          },
        },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyUpdateFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CompanyConfigurationService);

    fixture.componentRef.setInput('form', service.companyForm);
    fixture.componentRef.setInput('errorMessages', {
      ...errorsRegisterForm,
      ...errorRegisterAuth,
    });
    fixture.componentRef.setInput('operators', []);
    fixture.componentRef.setInput('documentTypes', []);
    fixture.componentRef.setInput('submitted', false);
    fixture.componentRef.setInput('inReview', false);
    fixture.componentRef.setInput('nameInReview', '');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show document fields when documentType and documentNumber are not nil', () => {
    component.form().patchValue({
      documentType: 'DNI',
      documentNumber: '12345678',
    });
    component.ngOnInit();
    expect(component.showDocumentFields).toBe(true);
  });

  it('should not show document fields when documentType and documentNumber are nil', () => {
    component.form().patchValue({
      documentType: null,
      documentNumber: null,
    });
    component.ngOnInit();
    expect(component.showDocumentFields).toBe(false);
  });

  it('should emit showPanel on openPanel', () => {
    const showPanelSpy = jest.spyOn(component.showPanel, 'emit');
    component.openPanel();
    expect(showPanelSpy).toHaveBeenCalledWith(true);
  });
});
