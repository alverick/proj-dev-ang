export class LoginObject {
    
      public ruc: string;
      public password: string;
    
      constructor( object: any){
        this.ruc = (object.ruc) ? object.ruc : null;
        this.password = (object.password) ? object.password : null;
      }
    }
    