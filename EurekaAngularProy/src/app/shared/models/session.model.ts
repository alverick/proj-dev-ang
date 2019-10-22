import {User} from "./user.model";

export class Session {
    public token: string;
    public isAuthenticate: boolean;
    public user: User;
    public expire?: string;
    public refresh?: string;
    public prfl?:number;
  }
