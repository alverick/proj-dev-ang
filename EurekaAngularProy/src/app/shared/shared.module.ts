import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { TooltipModule as TooltipModuleNgx } from 'ngx-bootstrap/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ValdemortModule } from 'ngx-valdemort';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { ControlRulesPoliciesComponent } from './components/control-rules-policies/control-rules-policies.component';
import { FabWhatsappComponent } from './components/fab-whatsapp/fab-whatsapp.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LabelControlComponent } from './components/label-control/label-control.component';
import { MessageAlertComponent } from './components/message-alert/message-alert.component';
import { ModalTermsComponent } from './components/modal-terms/modal-terms.component';
import { PaymentsFilterComponent } from './components/payments-filter/payments-filter.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ServiceDebtFormComponent } from './components/service-debt-form/service-debt-form.component';
import { ServiceEditFormComponent } from './components/service-edit-form/service-edit-form.component';
import { ServiceStepConfigurationComponent } from './components/service-step-configuration/service-step-configuration.component';
import { ServiceStepInfoComponent } from './components/service-step-info/service-step-info.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { SidebarServiceComponent } from './components/sidebar-service/sidebar-service.component';
import { ValidationDefaultsComponent } from './components/validation-defaults/validation-defaults.component';
import { DATA_SERVICES } from './data';
import { DIRECTIVES } from './directives';
import { CorreoDirective } from './directives/correo.directive';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';
import { OnlyNumbersFormDirective } from './directives/only-numbers-form.directive';
import { OnlynumbersDirective } from './directives/onlynumbers.directive';
import { SearchDirective } from './directives/search.directive';
import { PIPES } from './pipes';
import { RESOLVERS } from './resolvers';
import { SERVICES } from './services';
import { AmountMaxValidateDirective } from './directives/amount-max-validate.directive';

const FORM_MODULES = [
  FormsModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
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
  AccordionModule,
  BadgeModule,
  ButtonModule,
  CalendarModule,
  CarouselModule,
  ChartModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  DynamicDialogModule,
  InputMaskModule,
  InputNumberModule,
  InputTextModule,
  KeyFilterModule,
  KeyFilterModule,
  MessageModule,
  MessageModule,
  MessagesModule,
  MessagesModule,
  MultiSelectModule,
  PasswordModule,
  RadioButtonModule,
  RippleModule,
  SidebarModule,
  SplitButtonModule,
  StepsModule,
  TableModule,
  TooltipModule,
];
const UI_MODULES = [
  FontAwesomeModule,
  OverlayModule,
  PerfectScrollbarModule,
  TooltipModuleNgx.forRoot(),
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
    NgOptimizedImage,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ...SERVICES,
    ...RESOLVERS,
    ...DATA_SERVICES,
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
    ServiceStepInfoComponent,
    ServiceStepConfigurationComponent,
    ServiceDebtFormComponent,
    ServiceEditFormComponent,
    ServicesListComponent,
    SidebarServiceComponent,
    ...DIRECTIVES,
    ...PIPES,
    FabWhatsappComponent,
    ControlRulesPoliciesComponent,
    AmountMaxValidateDirective,
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
    TooltipModuleNgx,
    ValdemortModule,
    LabelControlComponent,
    MessageAlertComponent,
    ValidationDefaultsComponent,
    ServiceStepInfoComponent,
    ServiceStepConfigurationComponent,
    ServiceDebtFormComponent,
    ServiceEditFormComponent,
    ServicesListComponent,
    SidebarServiceComponent,
    ServiceCardComponent,
    ...PIPES,
    FabWhatsappComponent,
    ControlRulesPoliciesComponent,
    AmountMaxValidateDirective,
  ],
})
export class SharedModule {}
