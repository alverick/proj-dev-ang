import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageService } from '../../services/storage.service';
import { FabWhatsappComponent } from './fab-whatsapp.component';

describe('FabWhatsappComponent', () => {
  let component: FabWhatsappComponent;
  let fixture: ComponentFixture<FabWhatsappComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [StorageService],
    }).compileComponents();

    fixture = TestBed.createComponent(FabWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
