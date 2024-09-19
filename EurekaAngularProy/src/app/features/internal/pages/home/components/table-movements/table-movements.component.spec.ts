import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoggerModule } from 'ngx-logger';
import { DialogModule } from 'primeng/dialog';

import { environment } from '../../../../../../../environments/environment';
import { CompanyService } from '../../../../../../shared/services';
import { StorageService } from '../../../../../../shared/services/storage.service';
import { AppConfigEffects } from '../../../../../../store/effects/app-config.effects';
import { CompanyEffects } from '../../../../../../store/effects/company.effects';
import { entityConfig } from '../../../../../../store/entity-metadata';
import { appConfigFeature } from '../../../../../../store/reducers/app-config.reducer';
import { companyFeature } from '../../../../../../store/reducers/company.reducer';
import { SelectAllTableService } from '../../../../services';
import { TableMovementsComponent } from './table-movements.component';

describe('TableMovementsComponent', () => {
  let component: TableMovementsComponent;
  let fixture: ComponentFixture<TableMovementsComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [TableMovementsComponent],
      imports: [
        LoggerModule.forRoot({
          level: environment.logLevel,
          serverLogLevel: environment.serverLogLevel,
          disableConsoleLogging: false,
          enableSourceMaps: true,
        }),
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictStateImmutability: true,
              strictActionImmutability: true,
              strictStateSerializability: true,
              strictActionSerializability: true,
            },
          }
        ),
        StoreModule.forFeature(companyFeature),
        StoreModule.forFeature(appConfigFeature),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({
          maxAge: 25,
          logOnly: environment.production,
        connectInZone: true}),
        EntityDataModule.forRoot(entityConfig),
        EffectsModule.forFeature([CompanyEffects, AppConfigEffects]),
        HttpClientTestingModule,
        DialogModule,
      ],
      providers: [CompanyService, SelectAllTableService, StorageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
