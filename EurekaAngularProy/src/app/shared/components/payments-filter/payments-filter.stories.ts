import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MatFormFieldModule,
  MatIconRegistry,
  MatInputModule,
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { withActions } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateList } from '../../models/dateList';
import { WayPay } from '../../models/way-pay';
import { PaymentsFilterComponent } from './payments-filter.component';

function initAppComponentFactory(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
) {
  return async () => {
    matIconRegistry.addSvgIcon(
      'eurc_calendar',
      domSanitizer.bypassSecurityTrustResourceUrl(
        '/assets/images/calendar.svg'
      ),
      { viewBox: '0 0 24 24' }
    );
  };
}

export default {
  title: 'Payments Filter',
  component: PaymentsFilterComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
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
      ],
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [MatIconRegistry, DomSanitizer],
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE],
        },

        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      ],
    }),
    withActions('sendForm', 'click .btn'),
  ],
};

const listStates: WayPay[] = [
  { idWayPay: 'da', descripcion: 'Domiciliaciones' },
];

const listDates: DateList[] = [
  { idDate: '1', descripcion: 'Hoy' },
  { idDate: '2', descripcion: 'Ayer' },
];

export const normal = () => ({
  component: PaymentsFilterComponent,
  props: {
    stateList: listStates,
    dateList: listDates,
    gtpMode: boolean('GTP Mode', false),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});

export const gtp = () => ({
  component: PaymentsFilterComponent,
  props: {
    stateList: listStates,
    gtpMode: boolean('GTP Mode', true),
  },
  argTypes: { sendForm: { action: 'clicked' } },
});
