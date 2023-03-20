import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabWhatsappComponent } from './fab-whatsapp.component';

describe('FabWhatsappComponent', () => {
  let component: FabWhatsappComponent;
  let fixture: ComponentFixture<FabWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabWhatsappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
