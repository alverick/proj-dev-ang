import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MockBuilder, MockComponent, MockRender } from 'ng-mocks';
import { DialogModule } from 'primeng/dialog';

import { environment } from '../../../../../environments/environment';
import { DashboardDataService } from '../../../../shared/data';
import { CompanyService } from '../../../../shared/services';
import { AppConfigEffects } from '../../../../store/effects/app-config.effects';
import { CompanyEffects } from '../../../../store/effects/company.effects';
import { entityConfig } from '../../../../store/entity-metadata';
import { appConfigFeature } from '../../../../store/reducers/app-config.reducer';
import { companyFeature } from '../../../../store/reducers/company.reducer';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { DashboardFilterComponent } from '../../components/dashboard-filter/dashboard-filter.component';
import { DashboardGraphComponent } from '../../components/dashboard-graph/dashboard-graph.component';
import { DashboardTableComponent } from '../../components/dashboard-table/dashboard-table.component';
import { DashboardService } from '../../services';
import { DashboardPage } from './dashboard.page';

describe('DashboardComponent', () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
    return MockBuilder(DashboardPage)
      .mock(DashboardService)
      .mock(DashboardCardComponent)
      .mock(DashboardFilterComponent)
      .mock(DashboardGraphComponent)
      .mock(DashboardTableComponent)
      .mock(DialogModule);
  });

  it('should create', () => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
    const fixture = MockRender(DashboardPage);
    expect(fixture).toBeTruthy();
  });
});
