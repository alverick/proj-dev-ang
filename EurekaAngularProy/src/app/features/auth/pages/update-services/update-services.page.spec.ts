import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UpdateServicesPage } from './update-services.page';

describe('UpdateServicesPage', () => {
  let component: UpdateServicesPage;
  let fixture: ComponentFixture<UpdateServicesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateServicesPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
