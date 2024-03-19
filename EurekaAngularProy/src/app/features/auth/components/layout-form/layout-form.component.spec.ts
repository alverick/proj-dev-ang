import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { LayoutFormComponent } from './layout-form.component';

describe('LayoutFormComponent', () => {
  let component: LayoutFormComponent;
  let fixture: ComponentFixture<LayoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(LayoutFormComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled.textContent.trim()).toEqual(
      'Gestiona las cobranzas de tu negocio de manera 100% digital con Cobro Simple'
    );
  });
});
