import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlRulesPoliciesComponent } from './control-rules-policies.component';

describe('ControlRulesPoliciesComponent', () => {
  let component: ControlRulesPoliciesComponent;
  let fixture: ComponentFixture<ControlRulesPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlRulesPoliciesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlRulesPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
