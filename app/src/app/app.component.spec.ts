import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { FabWhatsappComponent } from './shared/components/fab-whatsapp/fab-whatsapp.component';
import { ValidationDefaultsComponent } from './shared/components/validation-defaults/validation-defaults.component';
import {
  AdobeLaunchProviderService,
  NewRelicProviderService,
  TrackingService,
} from './shared/services';
import { HotjarProviderService } from './shared/services/hotjar-provider.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let routerEvents$: Subject<any>;
  let storeMock: any;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    routerEvents$ = new Subject();
    storeMock = { dispatch: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        BrowserAnimationsModule,
        RouterModule,
        ValidationDefaultsComponent,
        NgxSpinnerModule,
        FabWhatsappComponent,
      ],
      providers: [
        MockProvider(PrimeNGConfig),
        MockProvider(AdobeLaunchProviderService),
        MockProvider(NewRelicProviderService),
        MockProvider(HotjarProviderService),
        MockProvider(TrackingService),
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dispatchSpy = jest.spyOn(storeMock, 'dispatch');

    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Mis Cobros – Interbank'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance as AppComponent;
    expect(app.title).toEqual('Cobro Simple – Interbank');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled?.textContent).toContain('Comunícate con nosotros');
  });
});
