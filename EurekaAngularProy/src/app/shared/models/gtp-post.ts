export interface GtpPost {
    empresa: GtpEmpresa;
    servicio: GtpServcegtp[]; 
}


export interface GtpEmpresa {
    ClientId:number;
    NombreAprobado:boolean;
}
export interface GtpServcegtp {
    ServiceId:number;
    NewNameCod:boolean;
    NewName:boolean;
}