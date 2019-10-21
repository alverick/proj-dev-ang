import { CheckFields } from "./check-fields";

 
export interface PendingResquest {
/* type: string;
 accion: string;
 state: string;*/
 idSolicitud: number;
 type: number;
 texto: string;
 state: string;
 checkFields:CheckFields[];

 /*type: es servicio o empresa 
 accion: es edicion  o nuevo , 
 cantidad: solo aplica a servicio */
}   
