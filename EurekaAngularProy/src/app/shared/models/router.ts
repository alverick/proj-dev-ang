export interface IRouteNames {
  [key: string]: string | boolean;
}

export interface IRouteItem {
  link: string;
  key?: string;
  children?: IRouteItem[];
}
