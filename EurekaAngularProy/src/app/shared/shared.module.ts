import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxPaginationModule } from 'ngx-pagination';
import { ValdemortModule } from 'ngx-valdemort';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
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
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ControlRulesPoliciesComponent } from './components/control-rules-policies/control-rules-policies.component';
import { FooterComponent } from './components/footer/footer.component';
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
import { DATA_SERVICES } from './data';
import { DIRECTIVES } from './directives';
import { NameEnterpiseDirective } from './directives/name-enterpise.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { OnlyNumbersFormDirective } from './directives/only-numbers-form.directive';
import { SearchDirective } from './directives/search.directive';
import { PIPES } from './pipes';
import { RESOLVERS } from './resolvers';
import { SERVICES } from './services';

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
  CheckboxModule,
  ChipModule,
  DialogModule,
  DropdownModule,
  DynamicDialogModule,
  InputMaskModule,
  InputNumberModule,
  InputTextModule,
  KeyFilterModule,
  MenuModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  PasswordModule,
  FileUploadModule,
  RadioButtonModule,
  RippleModule,
  SidebarModule,
  TieredMenuModule,
  SplitButtonModule,
  StepsModule,
  TableModule,
  ToastModule,
  TooltipModule,
];
const UI_MODULES = [FontAwesomeModule, OverlayModule];

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
    OnlyNumbersDirective,
    SearchDirective,
    NameEnterpiseDirective,
    PaymentsFilterComponent,
    FooterComponent,
    LabelControlComponent,
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
    ControlRulesPoliciesComponent,
  ],
  exports: [
    OnlyNumbersFormDirective,
    OnlyNumbersDirective,
    SearchDirective,
    NameEnterpiseDirective,
    ...DIRECTIVES,
    FooterComponent,
    ...FORM_MODULES,
    ...PRIMENG_MODULES,
    PaymentsFilterComponent,
    ValdemortModule,
    LabelControlComponent,
    MessageAlertComponent,
    ServiceStepInfoComponent,
    ServiceStepConfigurationComponent,
    ServiceDebtFormComponent,
    ServiceEditFormComponent,
    ServicesListComponent,
    SidebarServiceComponent,
    ServiceCardComponent,
    ...PIPES,
    ControlRulesPoliciesComponent,
  ],
})
export class SharedModule {}
