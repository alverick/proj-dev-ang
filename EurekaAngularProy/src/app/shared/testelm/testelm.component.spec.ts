import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestelmComponent } from './testelm.component';

describe('TestelmComponent', () => {
  let component: TestelmComponent;
  let fixture: ComponentFixture<TestelmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestelmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestelmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
