import { type IErrorObj } from './error.model';

export interface IStatus {
  status?: number;
  error?: IErrorObj;
}
