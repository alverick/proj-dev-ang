import 'jest-preset-angular/setup-jest';

import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { MockService, ngMocks } from 'ng-mocks';

ngMocks.autoSpy('jest');
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);
