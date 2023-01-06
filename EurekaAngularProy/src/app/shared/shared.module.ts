import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MatExpansionModule,
  MatFormFieldModule,
  MatRadioModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import {
  MatMomentDateModule,
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
} from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { TooltipModule } from 'ngx-bootstrap';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ValdemortModule } from 'ngx-valdemort';
import { ButtonModule } from 'primeng-lts/button';
import { CalendarModule } from 'primeng-lts/calendar';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { DialogModule } from 'primeng-lts/dialog';
import { DropdownModule } from 'primeng-lts/dropdown';
import { InputMaskModule } from 'primeng-lts/inputmask';
import { InputTextModule } from 'primeng-lts/inputtext';
import { KeyFilterModule } from 'primeng-lts/keyfilter';
import { RadioButtonModule } from 'primeng-lts/radiobutton';
import { SidebarModule } from 'primeng-lts/sidebar';
import { StepsModule } from 'primeng-lts/steps';
import { TableModule } from 'primeng-lts/table';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LabelControlComponent } from './components/label-control/label-control.component';
import { MessageAlertComponent } from './components/message-alert/message-alert.component';
import { ModalTermsComponent } from './components/modal-terms/modal-terms.component';
import { PaymentsFilterComponent } from './components/payments-filter/payments-filter.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ValidationDefaultsComponent } from './components/validation-defaults/validation-defaults.component';
import { DIRECTIVES } from './directives';
import { CorreoDirective } from './directives/correo.directive';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';
import { OnlyNumbersFormDirective } from './directives/only-numbers-form.directive';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive';
import { PIPES } from './pipes';
import { CompanyService } from './services/company.service';
import { DebtService } from './services/debt.service';
import { EnterpriseHeadingService } from './services/enterprise-heading.service';

const FORM_MODULES = [
  FormsModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MaterialFileInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMomentDateModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  NgxPaginationModule,
  ReactiveFormsModule,
];
const PRIMENG_MODULES = [
  KeyFilterModule,
  InputMaskModule,
  InputTextModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  StepsModule,
  SidebarModule,
  ButtonModule,
  TableModule,
  CalendarModule,
  DialogModule,
];
const UI_MODULES = [
  FontAwesomeModule,
  OverlayModule,
  PerfectScrollbarModule,
  TooltipModule.forRoot(),
];

@NgModule({
  imports: [
    CommonModule,
    DigitOnlyModule,
    RouterModule,
    ...UI_MODULES,
    ...FORM_MODULES,
    ...PRIMENG_MODULES,
    ValdemortModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    CompanyService,
    EnterpriseHeadingService,
    DebtService,
  ],
  declarations: [
    OnlyNumbersFormDirective,
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective,
    HeaderComponent,
    PaymentsFilterComponent,
    FooterComponent,
    LabelControlComponent,
    ValidationDefaultsComponent,
    MessageAlertComponent,
    ModalTermsComponent,
    ServiceCardComponent,
    ...DIRECTIVES,
    ...PIPES,
  ],
  exports: [
    OnlyNumbersFormDirective,
    OnlynumbersDirective,
    SearchDirective,
    CorreoDirective,
    NameEnterpiseDirective,
    ...DIRECTIVES,
    FooterComponent,
    ...FORM_MODULES,
    ...PRIMENG_MODULES,
    HeaderComponent,
    PaymentsFilterComponent,
    TooltipModule,
    ValdemortModule,
    LabelControlComponent,
    MessageAlertComponent,
    ValidationDefaultsComponent,
    ServiceCardComponent,
    ...PIPES,
  ],
  entryComponents: [ModalTermsComponent],
})
export class SharedModule {}
