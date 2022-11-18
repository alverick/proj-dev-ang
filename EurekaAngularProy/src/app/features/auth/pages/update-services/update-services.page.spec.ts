import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateServicesPage } from './update-services.page';

describe('UpdateServicesPage', () => {
  let component: UpdateServicesPage;
  let fixture: ComponentFixture<UpdateServicesPage>;

  beforeEach(async(() => {
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
