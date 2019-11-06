export interface GtpPost {
    EnterpriseObj?: GtpEmpresa;
    ListServiceObj?: GtpServcegtp[];
}


export interface GtpEmpresa {
    ClientId: number;
    NombreAprobado: boolean;
}
export interface GtpServcegtp {
    ServiceId: number;
    NombreAprobado: boolean;
    NombreCodAprobado: boolean;
}
