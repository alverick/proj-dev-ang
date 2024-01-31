import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { type IpInfo, IpInfoDataService } from '../data/ip-info-data.service';

export type FingerPrintData = {
  Browser: Browser;
  General: General;
  Personalization: Personalization;
  Alterations: Alterations;
  Network: Network;
  Site: Site;
  Identifiers: Identifiers;
  Geoip?: IpInfo;
};

export type Alterations = {
  adblock: string;
  hasLiedLanguages: string;
  hasLiedResolution: string;
  hasLiedOs: string;
  hasLiedBrowser: string;
  touchSupport: string;
};

export type Browser = {
  userAgent: string;
  browserName: string;
  browserVersion: string;
  browserMajor: string;
  browserEngineName: string;
  browserEngineVersion: string;
  osName: string;
  osVersion: string;
  deviceVendor: string;
  deviceModel: string;
  deviceType: string;
  cpuArchitecture: string;
  isPrivateMode: string;
};

export type General = {
  fingerprintVersion: string;
  language: string;
  colorDepth: string;
  deviceMemory: string;
  hardwareConcurrency: string;
  resolution: string;
  availableResolution: string;
  timezoneOffset: string;
  sessionStorage: string;
  cookieEnabled: string;
  localStorage: string;
  indexedDb: string;
  cpuClass: string;
  openDatabase: string;
  navigatorPlatform: string;
  vendorWebGL: string;
  rendererVideo: string;
  timeZone: string;
  zone: string;
  UTC: number;
  ram: string;
  processorCount: string;
  videoInput: string;
  audio: string;
  canvas: number;
};

export type Identifiers = {
  cookie: string;
  localStorageValue: string;
  unanimity1: string;
  unanimity2: string;
  unanimity3: string;
  unanimity4: string;
  unanimity5: string;
  hash: string;
};

export type Network = {
  publicIp: string;
  localIp: string;
};

export type Personalization = {
  numberPlugins: string;
  numberFonts: string;
};

export type Site = {
  host: string;
  hostName: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
};

export type FingerPrintType = {
  getData(flag1: boolean, flag2: boolean): Promise<FingerPrintData>;
  clean(): void;
};

declare const window: {
  MPFingerprint: FingerPrintType;
} & Window;

@Injectable()
export class DigitalDataService {
  private digital: FingerPrintType;

  constructor(private readonly ipInfoService: IpInfoDataService) {
    this.digital = window.MPFingerprint;
  }

  getData(): Promise<FingerPrintData> {
    return this.digital.getData(true, true).then((data: FingerPrintData) => {
      return this.ipInfoService
        .getIpInfo()
        .pipe(
          mergeMap((ip) => Promise.resolve({ ...data, Geoip: ip })),
          catchError(() => Promise.resolve(data))
        )
        .toPromise();
    });
  }
}
