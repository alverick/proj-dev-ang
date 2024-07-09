import { TestBed } from '@angular/core/testing';

import { DynamicDialogService } from './dynamic-dialog.service';
import { StorageService } from './storage.service';

describe('DynamicDialogService', () => {
  let service: DynamicDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicDialogService, StorageService],
    });
    service = TestBed.inject(DynamicDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
