import { DataServiceGTP } from "./data-service-gtp";

export interface DataEnterpriseGTP {
    ruc: string;
    name: string;
    entry: string;
    email: string;
    movilNumber: number;
    newName: string;
    status: String;
    uniqueCodeIBK: String;
    requestDate?: Date;
    inReview?: boolean;
    arrayServices?: DataServiceGTP[];
    NombreApproved?: boolean;
    enabled: boolean;
}
/**

 ruc: new FormControl({ value: '', disabled: this.inEdit },
          [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
          nombre: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
          rubro: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required]),
          email: new FormControl( {value: '', disabled: this.inEdit }, [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
          telefono: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required,Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'), Validators.minLength(6), Validators.maxLength(9)]),
          contrasena: new FormControl({ value: '', disabled: this.inEdit }),
          repcontrasena: new FormControl({ value: '', disabled: this.inEdit }),
          acceptterms: new FormControl({ value: true, disabled: this.inEdit }),
 */
