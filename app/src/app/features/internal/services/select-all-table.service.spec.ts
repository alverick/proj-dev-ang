import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';

import { SelectAllTableService } from './select-all-table.service';

describe('SelectAllTableService', () => {
  let service: SelectAllTableService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(SelectAllTableService)],
    });
    service = TestBed.inject(SelectAllTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
