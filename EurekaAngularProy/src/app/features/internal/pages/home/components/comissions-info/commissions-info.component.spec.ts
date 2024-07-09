import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { StorageService } from '../../../../../../shared/services/storage.service';
import { CommissionsInfoComponent } from './commissions-info.component';

describe('CommissionsInfoComponent', () => {
  let component: CommissionsInfoComponent;
  let fixture: ComponentFixture<CommissionsInfoComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [CommissionsInfoComponent],
      imports: [ButtonModule],
      providers: [DynamicDialogRef, DynamicDialogConfig, StorageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
