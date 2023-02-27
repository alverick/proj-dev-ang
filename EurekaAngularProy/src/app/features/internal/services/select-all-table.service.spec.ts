import { TestBed } from '@angular/core/testing';

import { SelectAllTableService } from './select-all-table.service';

describe('SelectAllTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectAllTableService = TestBed.get(SelectAllTableService);
    expect(service).toBeTruthy();
  });
});
