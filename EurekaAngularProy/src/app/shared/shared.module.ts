import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClickOutsideDirective } from 'ng-click-outside2';
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
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
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
import { ServiceChannelChipComponent } from './components/service-channel-chip/service-channel-chip.component';
import { ServiceDebtFormComponent } from './components/service-debt-form/service-debt-form.component';
import { ServiceEditFormComponent } from './components/service-edit-form/service-edit-form.component';
import { ServiceStepConfigurationComponent } from './components/service-step-configuration/service-step-configuration.component';
import { ServiceStepInfoComponent } from './components/service-step-info/service-step-info.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import { SidebarServiceComponent } from './components/sidebar-service/sidebar-service.component';
import { DATA_SERVICES } from './data';
import { DIRECTIVES } from './directives';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.directive';
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
  IconFieldModule,
  InputIconModule,
  InputMaskModule,
  InputNumberModule,
  InputTextModule,
  InputTextareaModule,
  InputGroupModule,
  InputGroupAddonModule,
  KeyFilterModule,
  MenuModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  PasswordModule,
  FileUploadModule,
  RadioButtonModule,
  ProgressBarModule,
  ProgressSpinnerModule,
  RippleModule,
  SidebarModule,
  TieredMenuModule,
  SplitButtonModule,
  StepsModule,
  TableModule,
  TagModule,
  ToastModule,
  TooltipModule,
];
const UI_MODULES = [FontAwesomeModule, OverlayModule];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ...UI_MODULES,
    ...FORM_MODULES,
    ...PRIMENG_MODULES,
    ValdemortModule,
    NgOptimizedImage,
    NgClickOutsideDirective,
    ServiceChannelChipComponent,
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
    BlockCopyPasteDirective,
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
    NgClickOutsideDirective,
    OnlyNumbersFormDirective,
    OnlyNumbersDirective,
    BlockCopyPasteDirective,
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
