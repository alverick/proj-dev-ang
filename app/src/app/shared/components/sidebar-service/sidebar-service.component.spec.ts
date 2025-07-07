import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarServiceComponent } from './sidebar-service.component';

describe('SidebarServiceComponent', () => {
  let component: SidebarServiceComponent;
  let fixture: ComponentFixture<SidebarServiceComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
