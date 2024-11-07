import { TestBed } from '@angular/core/testing';

import { Sections, SettingOptions, StorageSettings } from '../models/settings';
import { SettingsStorageService } from './settings-storage.service';

describe('SettingsService', () => {
  describe('storage empty', () => {
    const rucTest = '92873762623';
    let service: SettingsStorageService;

    beforeEach(() => {
      window.sessionStorage.setItem('username', rucTest);
      TestBed.configureTestingModule({ providers: [SettingsStorageService] });
      service = TestBed.inject(SettingsStorageService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('check username', () => {
      expect(service.username).toEqual(rucTest);
    });

    it('check settings', () => {
      expect(
        service.getSettingAndSave(
          SettingOptions.onBoarding,
          Sections.movements,
        ),
      ).toBeFalsy();
      expect(
        service.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        ),
      ).toBeFalsy();
    });
  });

  describe('change ruc', () => {
    const rucTest = '9287376999999';
    let service: SettingsStorageService;

    beforeEach(() => {
      window.sessionStorage.setItem('username', rucTest);

      TestBed.configureTestingModule({ providers: [SettingsStorageService] });
      service = TestBed.inject(SettingsStorageService);
    });

    it('check settings', () => {
      expect(
        service.getSettingAndSave(
          SettingOptions.onBoarding,
          Sections.movements,
        ),
      ).toBeFalsy();
      expect(
        service.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        ),
      ).toBeFalsy();
      expect(
        service.getSettingAndSave(
          SettingOptions.onBoarding,
          Sections.movements,
        ),
      ).toBeTruthy();
      expect(
        service.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        ),
      ).toBeTruthy();
    });
  });

  describe('change ruc and set on boarding', () => {
    const rucTest = '9287376888888';
    let service: SettingsStorageService;

    beforeEach(() => {
      window.sessionStorage.setItem('username', rucTest);
      window.localStorage.setItem(
        StorageSettings,
        `{"${rucTest}":{"ob":{"mov":1}}}`,
      );
      TestBed.configureTestingModule({ providers: [SettingsStorageService] });
      service = TestBed.inject(SettingsStorageService);
    });

    it('check settings', () => {
      expect(
        service.getSettingAndSave(
          SettingOptions.onBoarding,
          Sections.movements,
        ),
      ).toBeTruthy();
      expect(
        service.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        ),
      ).toBeFalsy();
    });
  });

  describe('error in settings', () => {
    const rucTest = '9287376888888';
    let service: SettingsStorageService;

    beforeEach(() => {
      window.sessionStorage.setItem('username', rucTest);
      window.localStorage.setItem(StorageSettings, undefined);
      TestBed.configureTestingModule({ providers: [SettingsStorageService] });
      service = TestBed.inject(SettingsStorageService);
    });

    it('check settings', () => {
      expect(
        service.getSettingAndSave(
          SettingOptions.onBoarding,
          Sections.movements,
        ),
      ).toBeFalsy();
      expect(
        service.getSettingAndSave(
          SettingOptions.commissions,
          Sections.movements,
        ),
      ).toBeFalsy();
    });
  });
});
