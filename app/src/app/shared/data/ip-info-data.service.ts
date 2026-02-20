import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type Observable } from 'rxjs';

export interface IpInfo {
  as: string;
  asname: string;
  callingCode: string;
  city: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  countryCode3: string;
  currency: string;
  currentTime: string;
  district: string;
  hosting: false;
  isp: string;
  lat: number;
  lon: number;
  mobile: boolean;
  offset: number;
  org: string;
  proxy: boolean;
  query: string;
  region: string;
  regionName: string;
  reverse: string;
  status: string;
  timezone: string;
  zip: string;
}

@Injectable()
export class IpInfoDataService {
  private readonly httpClient = inject(HttpClient);

  private readonly url = `https://pro.ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,countryCode3,region,regionName,city,district,zip,lat,lon,timezone,offset,currentTime,currency,callingCode,isp,org,as,asname,reverse,mobile,proxy,hosting,query&key=BwfSJxuANSbGW0B`;

  getIpInfo(): Observable<IpInfo> {
    return this.httpClient.get<IpInfo>(this.url);
  }
}
