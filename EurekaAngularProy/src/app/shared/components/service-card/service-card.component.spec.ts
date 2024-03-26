import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockComponents, MockPipe } from 'ng-mocks';

import { NotEmptyPipe } from '../../pipes/not-empty.pipe';
import { ServiceCardComponent } from './service-card.component';

describe('ServiceCardComponent', () => {
  let component: ServiceCardComponent;
  let fixture: ComponentFixture<ServiceCardComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [ServiceCardComponent, NotEmptyPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
