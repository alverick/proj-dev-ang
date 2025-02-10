import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LayoutFormComponent } from './layout-form.component';

describe('LayoutFormComponent', () => {
  let component: LayoutFormComponent;
  let fixture: ComponentFixture<LayoutFormComponent>;

  const mockActivatedRoute = {
    params: of({}),
    snapshot: {
      params: {},
      data: {},
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled.textContent.trim()).toContain(
      'Gestiona las cobranzas de tu negocio de manera 100% digital con Cobro Simple',
    );
  });
});
