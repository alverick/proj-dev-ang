import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarCompanyComponent } from './sidebar-company.component';

describe('SidebarInfoComponent', () => {
  let component: SidebarCompanyComponent;
  let fixture: ComponentFixture<SidebarCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarCompanyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
