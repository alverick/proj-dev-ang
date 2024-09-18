import { MockBuilder, MockRender } from 'ng-mocks';
import { DialogModule } from 'primeng/dialog';

import { CollectAmountService } from '../../../../store/collections/collect-amount.service';
import { HistoricalCollectService } from '../../../../store/collections/historical-collect.service';
import { TopClientService } from '../../../../store/collections/top-client.service';
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
      .mock(CollectAmountService)
      .mock(HistoricalCollectService)
      .mock(TopClientService)
      .mock(DialogModule);
  });

  it('should create', () => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
    const fixture = MockRender(DashboardPage);
    expect(fixture).toBeTruthy();
  });
});
