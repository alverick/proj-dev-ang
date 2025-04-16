import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceChannelChipComponent } from './service-channel-chip.component';

describe('ServiceChannelChipComponent', () => {
  let component: ServiceChannelChipComponent;
  let fixture: ComponentFixture<ServiceChannelChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceChannelChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceChannelChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
