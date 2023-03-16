import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpHeaderIconComponent } from './help-header-icon.component';

describe('HelpHeaderIconComponent', () => {
  let component: HelpHeaderIconComponent;
  let fixture: ComponentFixture<HelpHeaderIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpHeaderIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpHeaderIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
