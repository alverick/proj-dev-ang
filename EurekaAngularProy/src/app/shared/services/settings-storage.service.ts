import { Injectable } from '@angular/core';
import * as DOMPurify from 'dompurify';
import { isNil, pathEq } from 'ramda';
import { isObj } from 'ramda-adjunct';

import {
  type SectionsType,
  type SettingOptionsType,
  type Settings,
  Status,
  StorageSettings,
} from '../models/settings';

@Injectable()
export class SettingsStorageService {
  username = '';
  settings: Settings = {};

  constructor() {
    this.username = DOMPurify.sanitize(
      window.sessionStorage.getItem('username')
    );

    const localSettings = window.localStorage.getItem(StorageSettings);

    this.settings =
      localSettings === 'undefined' || isNil(localSettings)
        ? {}
        : (JSON.parse(DOMPurify.sanitize(localSettings)) as Settings);
  }

  getSetting(keySettings: SettingOptionsType, keyPage: SectionsType) {
    return pathEq(
      [this.username, keySettings, keyPage],
      Status.saved,
      this.settings
    );
  }

  getSettingAndSave(keySettings: SettingOptionsType, keyPage: SectionsType) {
    const saved = this.getSetting(keySettings, keyPage);
    if (!saved) {
      if (isNil(this.settings[this.username])) {
        this.settings[this.username] = {};
      }
      this.settings[this.username] = {
        ...this.settings[this.username],
        [keySettings]: { [keyPage]: Status.saved },
      };

      if (isObj(this.settings)) {
        localStorage.setItem(StorageSettings, JSON.stringify(this.settings));
      }
    }
    return saved;
  }
}
