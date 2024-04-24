import { Injectable } from '@angular/core';
import * as DOMPurify from 'dompurify';
import { isNil, pathEq } from 'ramda';

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

    this.settings = window.localStorage.getItem(StorageSettings)
      ? (JSON.parse(
          DOMPurify.sanitize(window.localStorage.getItem(StorageSettings))
        ) as Settings)
      : {};
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
      localStorage.setItem(StorageSettings, JSON.stringify(this.settings));
    }
    return saved;
  }
}
