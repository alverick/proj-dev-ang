import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppConfigActions } from '../../store/actions/app-config.actions';
import { type RespuestaLogin } from '../models/respuestaLogin.model';
import { type Session } from '../models/session.model';
import { LoginService } from './login.service';
import { NotifyService } from './notify.service';
import { StorageService } from './storage.service';

const mockDate = (isoDate: string): Date => new Date(isoDate);

const mockSuccessResponse: RespuestaLogin = {
  respuestaHttp: 200,
  codRespuesta: 1,
  estado: true,
  paramStr:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiIxMjQ2IiwicnVjIjoiMjA2NDU2OTI5NzEiLCJwcmZsIjoiMCIsImV4cCI6MTc0NTAzMTQ4OCwiaXNzIjoiRXVyZWNhIiwiYXVkIjoiRXVyZWNhIH0.WY79rIDhTw2IYB6DL0MlBkzPbCb433XoiuFNqmXFjDI',
  rfs: '2025-04-19T02:53:08.2510914Z',
  exp: '2025-04-19T02:58:08.2510914Z',
  paramNum: 0,
  prfl: 0,
};

describe('LoginService', () => {
  let service: LoginService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let storageServiceMock: jest.Mocked<StorageService>;
  let notifyServiceMock: jest.Mocked<NotifyService>;
  let storeMock: jest.Mocked<Store>;

  const testRuc = '12345678901';
  const testPsw = 'password123';
  const tokenRecaptcha = 'password123as34kdjd62jdhas';
  const apiBaseUrl = environment.END_POINT;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,

        MockProvider(HttpClient),
        MockProvider(StorageService),
        MockProvider(NotifyService),
        MockProvider(Store),
      ],
    });

    service = TestBed.inject(LoginService);

    httpClientMock = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
    storageServiceMock = TestBed.inject(
      StorageService,
    ) as jest.Mocked<StorageService>;
    notifyServiceMock = TestBed.inject(
      NotifyService,
    ) as jest.Mocked<NotifyService>;
    storeMock = TestBed.inject(Store) as jest.Mocked<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const loginUrl = `${apiBaseUrl}/login`;
    const expectedData = new HttpParams()
      .set('username', testRuc)
      .set('password', testPsw)
      .set('recaptcha', tokenRecaptcha);
    const expectedOpts = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
    };

    it('should call login endpoint, store session, notify, and reset config on successful login (estado: true)', fakeAsync(() => {
      const expectedSession: Partial<Session> = {
        user: { ruc: testRuc },
        isAuthenticate: true,
        token: mockSuccessResponse.paramStr,
        expire: mockSuccessResponse.exp,
        refresh: mockSuccessResponse.rfs,
        prfl: mockSuccessResponse.prfl,
      };

      httpClientMock.post.mockReturnValue(of(mockSuccessResponse));
      storageServiceMock.isValidSession.mockReturnValue(true);

      let result: RespuestaLogin | undefined;

      service
        .login(testRuc, testPsw, tokenRecaptcha)
        .subscribe((res) => (result = res));
      flush();

      expect(notifyServiceMock.clear).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        loginUrl,
        expectedData.toString(),
        expectedOpts,
      );
      expect(storageServiceMock.setCurrentSession).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.setCurrentSession).toHaveBeenCalledWith(
        expectedSession,
      );
      expect(storageServiceMock.isValidSession).toHaveBeenCalledTimes(1);
      expect(notifyServiceMock.iniciar).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
      expect(storeMock.dispatch).toHaveBeenCalledWith(
        AppConfigActions.resetConfig(),
      );
      expect(result).toEqual(mockSuccessResponse);
    }));

    it('should call login endpoint but not store session or notify if login response state is false', fakeAsync(() => {
      const mockFailedStateResponse: RespuestaLogin = {
        respuestaHttp: 204,
        codRespuesta: 3,
        estado: false,
        paramStr: 'Credenciales Inválidas',
        rfs: null,
        exp: null,
        paramNum: 1,
        prfl: null,
      };

      httpClientMock.post.mockReturnValue(of(mockFailedStateResponse));

      let result: RespuestaLogin | undefined;

      service
        .login(testRuc, testPsw, tokenRecaptcha)
        .subscribe((res) => (result = res));
      flush();

      expect(notifyServiceMock.clear).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        loginUrl,
        expectedData.toString(),
        expectedOpts,
      );
      expect(storageServiceMock.setCurrentSession).not.toHaveBeenCalled();
      expect(storageServiceMock.isValidSession).not.toHaveBeenCalled();
      expect(notifyServiceMock.iniciar).not.toHaveBeenCalled();
      expect(storeMock.dispatch).not.toHaveBeenCalled();
      expect(result).toEqual(mockFailedStateResponse);
    }));

    it('should not call notify.iniciar if session is not valid after setting', fakeAsync(() => {
      httpClientMock.post.mockReturnValue(of(mockSuccessResponse));
      storageServiceMock.isValidSession.mockReturnValue(false);

      service.login(testRuc, testPsw, tokenRecaptcha).subscribe();
      flush();

      expect(storageServiceMock.setCurrentSession).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.isValidSession).toHaveBeenCalledTimes(1);
      expect(notifyServiceMock.iniciar).not.toHaveBeenCalled();
      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
    }));

    it('should handle HTTP errors during login', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      httpClientMock.post.mockReturnValue(throwError(() => mockError));

      let receivedError: HttpErrorResponse | undefined;

      service.login(testRuc, testPsw, tokenRecaptcha).subscribe({
        error: (err) => (receivedError = err),
      });
      flush();

      expect(notifyServiceMock.clear).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.setCurrentSession).not.toHaveBeenCalled();
      expect(notifyServiceMock.iniciar).not.toHaveBeenCalled();
      expect(storeMock.dispatch).not.toHaveBeenCalled();
      expect(receivedError).toBe(mockError);
    }));
  });

  describe('logout', () => {
    const logoutUrl = `${apiBaseUrl}/login/out`;

    it('should call logout endpoint and remove session on successful logout', fakeAsync(() => {
      httpClientMock.post.mockReturnValue(of({}));

      service.logout().subscribe();
      flush();

      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(logoutUrl, {});
      expect(storageServiceMock.removeCurrentSession).toHaveBeenCalledTimes(1);
    }));

    it('should still remove session even if logout endpoint fails (based on current implementation)', fakeAsync(() => {
      const mockError = new HttpErrorResponse({ status: 500 });

      httpClientMock.post.mockReturnValue(throwError(() => mockError));
      let receivedError: HttpErrorResponse | undefined;

      service.logout().subscribe({
        error: (err) => (receivedError = err),
      });
      flush();

      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(logoutUrl, {});

      expect(storageServiceMock.removeCurrentSession).not.toHaveBeenCalled();
      expect(receivedError).toBe(mockError);
    }));
  });

  describe('refresh', () => {
    const refreshUrl = `${apiBaseUrl}/login`;
    let originalDateNow: () => number;

    beforeAll(() => {
      originalDateNow = Date.now;
    });

    afterAll(() => {
      Date.now = originalDateNow;
    });

    beforeEach(() => {
      (service as any).callingRefresh = false;
    });

    it('should not call refresh endpoint if there is no current session', () => {
      storageServiceMock.getCurrentSession.mockReturnValue(null);

      service.refresh();

      expect(storageServiceMock.getCurrentSession).toHaveBeenCalledTimes(1);
      expect(httpClientMock.get).not.toHaveBeenCalled();
    });

    it('should not call refresh endpoint if current time is before refresh time', () => {
      const now = mockDate('2024-01-01T11:00:00Z');
      const session: Session = {
        user: { ruc: testRuc },
        isAuthenticate: true,
        token: 't1',
        expire: '2024-01-01T12:00:00Z',
        refresh: '2024-01-01T11:30:00Z',
        prfl: 0,
      };
      Date.now = jest.fn(() => now.getTime());
      storageServiceMock.getCurrentSession.mockReturnValue(session);

      service.refresh();

      expect(storageServiceMock.getCurrentSession).toHaveBeenCalledTimes(1);
      expect(httpClientMock.get).not.toHaveBeenCalled();
      expect(storageServiceMock.setCurrentSession).not.toHaveBeenCalled();
    });

    it('should not call refresh endpoint if current time is after expiry time', () => {
      const now = mockDate('2024-01-01T12:05:00Z');
      const session: Session = {
        user: { ruc: testRuc },
        isAuthenticate: true,
        token: 't1',
        expire: '2024-01-01T12:00:00Z',
        refresh: '2024-01-01T11:30:00Z',
        prfl: 0,
      };
      Date.now = jest.fn(() => now.getTime());
      storageServiceMock.getCurrentSession.mockReturnValue(session);

      service.refresh();

      expect(storageServiceMock.getCurrentSession).toHaveBeenCalledTimes(1);
      expect(httpClientMock.get).not.toHaveBeenCalled();
      expect(storageServiceMock.setCurrentSession).not.toHaveBeenCalled();
    });

    it('should call refresh endpoint and update session if refresh is needed', fakeAsync(() => {
      const now = mockDate('2024-01-01T11:45:00Z');
      const initialSession: Session = {
        user: { ruc: testRuc },
        isAuthenticate: true,
        token: 'old-token',
        expire: '2024-01-01T12:00:00Z',
        refresh: '2024-01-01T11:30:00Z',
        prfl: 0,
      };
      const mockRefreshResponse: RespuestaLogin = {
        estado: true,
        paramStr: 'new-refreshed-token',
        exp: '2024-01-01T12:30:00Z',
        rfs: '2024-01-01T12:15:00Z',
        prfl: 0,
      };
      const expectedNewSession: Partial<Session> = {
        user: initialSession.user,
        isAuthenticate: true,
        token: mockRefreshResponse.paramStr,
        expire: mockRefreshResponse.exp,
        refresh: mockRefreshResponse.rfs,
        prfl: mockRefreshResponse.prfl,
      };

      Date.now = jest.fn(() => now.getTime());
      storageServiceMock.getCurrentSession
        .mockReturnValueOnce(initialSession)
        .mockReturnValueOnce(initialSession);
      httpClientMock.get.mockReturnValue(of(mockRefreshResponse));

      service.refresh().subscribe(); // Add a subscription to trigger the observable chain
      flush();

      expect(storageServiceMock.getCurrentSession).toHaveBeenCalledTimes(2);
      expect(httpClientMock.get).toHaveBeenCalledTimes(1);
      expect(httpClientMock.get).toHaveBeenCalledWith(refreshUrl, {});
      expect(storageServiceMock.setCurrentSession).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.setCurrentSession).toHaveBeenCalledWith(
        expectedNewSession,
      );
      expect((service as any).callingRefresh).toBe(false);
    }));
  });
  describe('getCompanyDataUpdate', () => {
    const dencryptUrl = `${apiBaseUrl}/Login/dencrypt`;
    const testInputData = { encrypted: 'some_data' };

    it('should call dencrypt endpoint and return data on success', fakeAsync(() => {
      const mockDencryptResponse = {
        companyName: 'Test Corp',
        address: '123 Main St',
      };

      httpClientMock.post.mockReturnValue(of(mockDencryptResponse));
      let receivedResponse: any;

      service.getCompanyDataUpdate(testInputData).subscribe((response) => {
        receivedResponse = response;
      });
      flush();

      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        dencryptUrl,
        testInputData,
      );
      expect(receivedResponse).toEqual(mockDencryptResponse);
    }));

    it('should handle HTTP errors during getCompanyDataUpdate', fakeAsync(() => {
      const mockError = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });

      httpClientMock.post.mockReturnValue(throwError(() => mockError));
      let receivedError: HttpErrorResponse | undefined;

      service.getCompanyDataUpdate(testInputData).subscribe({
        error: (err) => (receivedError = err),
      });
      flush();

      expect(httpClientMock.post).toHaveBeenCalledTimes(1);
      expect(httpClientMock.post).toHaveBeenCalledWith(
        dencryptUrl,
        testInputData,
      );
      expect(receivedError).toBe(mockError);
    }));
  });
});
