 import { Component, OnInit, EventEmitter, HostListener, ɵConsole } from '@angular/core';
import { ServiceModel, RubroModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormServicioComponent } from '../form-servicio/form-servicio.component';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { ServicesGTPChange } from 'src/app/shared/models/data-gtpchange';
import { DataServiceGTP } from 'src/app/shared/models/data-service-gtp';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';

@Component({
  selector: 'app-configurar-gtp',
  templateUrl: './configurar-gtp.component.html',
  styleUrls: ['./configurar-gtp.component.scss']
})
export class ConfigurarGtpComponent implements OnInit {

  protected ruc: number;
  public stateCreate: boolean = false;
  public stateEdit: boolean = false;
  public input: FormServicioComponent;
  EmpresaFormulario: boolean = false;
  Formulario: boolean = false;
  Formulariogtp: boolean = false;
  buttonServicios ='';
  public inEdit: boolean = false;
  public inGTP: boolean = false;
  public titulo: string;
  public SvcEdit: ServicesGTPChange[];
  public Empgtp: DataEnterpriseGTP = null;
  public Enterprise: DataEnterpriseGTP = {
    ruc: '0',
    name: '',
    entry: '',
    email: '',
    movilNumber: 0 ,
    newName: '' ,
    status: '',
    uniqueCodeIBK: '',
    enabled: false
  };
  public rubro:string;
  rubros: RubroModel[] = [];
  public onFormAction: EventEmitter<string> = new EventEmitter();

  constructor(public afiliacionService: AfiliacionService,
              private route: ActivatedRoute,
              private router: Router,
              private gaService: GoogleAnalytics,
              public gtpService: GtpService) { }

    @HostListener('window:beforeunload', ['$event'])
    public closeWindow($event: any) {
      if (!this.afiliacionService.Guardado) {
        $event.returnValue = 'Se van a perder los cambios.';
      }
    }

  ngOnInit() {
    this.inEdit = true;
    window['_url_loop_'] = `ApGTP/${this.route.snapshot.paramMap.get('llave')}`;
    history.pushState(null, null, `ApGTP/${this.route.snapshot.paramMap.get('llave')}`);
    this.gtpService.GetServicesGtp(this.route.snapshot.paramMap.get('llave'));
    this.getInfoEmpresa();
    this.buttonServicios = 'Actualizar';
    this.titulo = 'Edita el servicio';
  }

  public indiceActual: number = -1;
  serviceActual: ServiceModel = null;

  OcultarFormulario(requireConfirm: boolean) {
    if (requireConfirm) {
      Swal.fire({
        title: 'Descartar cambios',
        text: 'Se van a descartar los cambios.',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'DESCARTAR',
        cancelButtonText: 'REGRESAR',
        onOpen: drawPopup
      }).then(r => {
        if (r.value) {
          console.log('descartar');
          this.gtpService.Descartar(this.indiceActual, this.stateCreate);
          this.EmpresaFormulario = false;
          this.Formulario = false ;
          this.stateCreate = false;
          this.stateEdit = false;
          this.addNewAfterSave = false;
          this.sendAfterSave = false;
          this.indiceActual = -1;
          this.Formulariogtp = false;
          console.log(this.Formulario);
        }
      });
    }
  }

  getInfoEmpresa() {
    this.gtpService.GetEnterpriseGtp(this.route.snapshot.paramMap.get('llave'))
      .subscribe( dataEnterprise => {
        this.Enterprise = dataEnterprise;
        console.log(this.Enterprise);
        this.rubro =  this.rubros.find((v) => v.code = this.Enterprise.entry).name;
        });
  }

  addNewAfterSave: boolean = false;
  sendAfterSave: boolean = false;

  MostarFormulario() {
    console.table(this.gtpService.services);
    if (this.gtpService.services.length >= 99) {
      Swal.fire({
        text: 'Usted solo puede tener 99 servicios como máximo',
        onOpen: drawPopup
      });
      return;
    }

    let svcSinCta = this.gtpService.services.find((v) => v.nroCuenta === '');
    if (svcSinCta) {
      Swal.fire({
        text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
        onOpen: drawPopup
      });
      return;
    }

    if (this.Formulario) {
      Swal.fire({
        title: 'Servicio no guardado',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'GUARDAR',
        cancelButtonText: 'DESHACER CAMBIOS',
        onOpen: drawPopup
      }).then(r => {
        this.addNewAfterSave = true;
        if (r.value) {
          this.onFormAction.emit('save');
        }
        else if (r.dismiss === Swal.DismissReason.cancel) {
          this.OcultarFormulario(false);
        }
        else {
          this.addNewAfterSave = false;
        }
       });
    }
    else {
      this.indiceActual = this.gtpService.services.length;
      this.serviceActual = this.gtpService.CrearSevice();
      this.stateEdit = true;
      this.stateCreate = true;
      this.Formulario = true;
    }
  }



  EnviarServicios() {

    if (this.Formulario === true) {
      Swal.fire({
        title: 'Servicio no guardado',
        text: `Guarde los cambios del servicio ${this.serviceActual === null ? '' : this.serviceActual.nombre} para poder continuar al siguiente paso`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText:  'DESHACER CAMBIOS',
        confirmButtonText: 'GUARDAR',
        onOpen: drawPopup
      }).then(r => {
        this.sendAfterSave = true;
        if (r.value) {
          this.onFormAction.emit('save');
        }
        else if (r.dismiss === Swal.DismissReason.cancel) {
          this.OcultarFormulario(false);
        }
        else {
          this.sendAfterSave = false;
        }
      });
      return;
    }
    // this.frm.get('monto').value
    let res = '';
    let resVacio = false;
    let resValido = true;
    this.gtpService.services.forEach(s => {
      if (s.res !== '' && s.res !== null) {
        if (res === '' || res === null) {
          res = s.res;
        }
        else {
          if (res.substring(0, 5) !== s.res.substring(0, 5)) {
            resValido = false;
          }
        }
      }
      else {
        resVacio = true;
      }
    });
    if (resVacio && this.Enterprise.enabled) {
      Swal.fire({
        title: 'Error en RES',
        html: `Uno de los servicios no tiene RES asignada.<br />No puede poner este cliente como activo`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText:  'CERRAR',
        onOpen: drawPopup
      });
      return;
    }
    if (!resValido) {
      Swal.fire({
        title: 'Error en RES',
        text: `Uno de los RES no coincide. Por favor corrija.`,
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: '#d33',
        cancelButtonText:  'CERRAR',
        onOpen: drawPopup
      });
      return;
    }

        let svcSinCta = this.gtpService.services.find((v) => v.nroCuenta === '');
        if(svcSinCta) {
          Swal.fire({
            text: `Falta Ingresar datos en su servicio ${svcSinCta.nombre}`,
            onOpen: drawPopup
          });
          return;
        }
        this.gaService.sendEvent('EnviarServicios', {
          'event_category': GoogleAnalytics.Afiliacion,
          'event_label': 'enviar_servicios'
        });
        this.gtpService.GrabarServicios(parseInt(this.route.snapshot.paramMap.get('llave')), this.Enterprise)
          .subscribe(r => {
            this.router.navigate(['/gtp']);
          });
  }


  mensaje( titulo: string, text: string) {
    Swal.fire({
     // type: tipo ,
      title: titulo ,
      text: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      // cancelButtonText:  'CERRAR',
      allowOutsideClick: false,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }

  getCanales(svc: ServiceModel) {
    let str = '';
    if (svc.usaWebApp) {
      str += "Digital"
    }
    if (svc.usaAgente) {
      str += (str !== '' ? ', ' : '') + "Agentes"
    }
    if (svc.usaTienda) {
      str += (str !== '' ? ', ' : '') + "Tiendas"
    }

    return str;
  }

  getCodDebtor(svc: ServiceModel) {
      if (svc.codDeudor === '?') {
        if (svc.newNameCode.substring(0, 3) === '???') {
          return svc.newNameCode.substring(3, svc.newNameCode.length);
        }
        return svc.newNameCode;
      }
      return svc.newNameCode;
  }
  getCodDebtorCreate(svc: ServiceModel) {
     if (svc.codDeudor   === 'RUC' || svc.codDeudor  === 'DNI' || svc.codDeudor === 'Codigo Interno') {
         return svc.codDeudor;
      }
      if (svc.codDeudor === 'Otro') {
        return svc.nameCod;
      }
  }

getNameGTP(svc: ServiceModel) {
  if (svc.nombre  !== '?') {
    return svc.nombre;
 }
  if (svc.nombre  === '?') {
    return svc.newName.substring(3, svc.newName.length).toString();
 }
}


pendienteRevision(svc: ServiceModel) {
 if (this.inEdit ) {

  if(svc.id === null){
    return true;
  }
   if ((svc.nombre === svc.newName) && ((svc.codDeudor  === svc.newNameCode ) || (svc.nameCod  === svc.newNameCode ) )) {
    return false;
   }
  if (((svc.nombre !== svc.newName) && (svc.nombre === '?')) || ((svc.codDeudor  !== svc.newNameCode ) && (svc.codDeudor === '?') )) {
    return true;
  }

  if ((svc.nombre !== svc.newName) || ((svc.nameCod  !== svc.newNameCode) ||
   (svc.codDeudor  !== svc.newNameCode)  )) {
    return true;
  }
 } else {
  return false;
 }

}

getName(svc: ServiceModel) {
  if (svc.nombre === '?') {
    if (svc.newName.substring(0, 3) === '???') {
      return svc.newName.substring(3, svc.newName.length);
    } else {
      return svc.newName;
    }
  }

  return svc.nombre;
}

getCodigoNameGTP(svc: ServiceModel) {
  if (svc.codDeudor !== '?' ) {
    if (svc.codDeudor === 'Otro' ) {
      return  svc.nameCod;
    }
    return  svc.codDeudor;
 }
  if (svc.codDeudor === '?' ) {
    return  svc.newNameCode.substring(3, svc.newNameCode.length).toString();
 }
}




  delService(index: number) {
    if (this.EmpresaFormulario || this.Formulario) {
      return;
    }
    if (this.inEdit && this.gtpService.services[index].id) {
      this.gtpService.CanDeleteService(index).subscribe(r => {
        let title = 'Eliminación total del servicio';
        let msg = 'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio';
        if (r.hasPayed) {
          title = 'Eliminación Parcial del Servicio';
          msg = 'Ya existe un historial de pagos realizados con este servicio, sólo se eliminarán las deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
        }
        Swal.fire({
          text: msg,
          title: title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'CONFIRMAR',
          cancelButtonText: 'CANCELAR',
          onOpen: drawPopup
        }).then(r => {
          if (r.value) {
            this.gtpService.SendDelService(index)
              .subscribe(r => {
                this.gaService.sendEvent('ServicioEliminado', {
                  'event_category': GoogleAnalytics.Afiliacion,
                  'event_label': 'servicio_eliminado'
                });
                Swal.fire({
                  text: 'Se ha eliminado el Servicio',
                  title: title,
                  onOpen: drawPopup
                });
              });
          }
        });
      });
    }
    else {
      Swal.fire({
        text: 'Se eliminará el servicio de los canales de interbank',
        title: 'Eliminación total el servicio',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
        allowOutsideClick: false,
        onOpen: drawPopup
      }).then(r => {
        if (r.value) {
          this.afiliacionService.DelService(index);
        }
      });
    }
  }

  editService(svc: ServiceModel, index: number) {
    if (this.Formulario && this.indiceActual !== index) {
      return;
    }
    if (this.Formulariogtp && this.indiceActual !== index) {
      return;
    }

    if (this.inGTP) {
       this.Formulariogtp = true;
       this.stateEdit = true;
      this.stateCreate = false;
      this.indiceActual = index;
      this.serviceActual = svc;
       return;
    }
    this.stateEdit = true;
    this.stateCreate = false;
    this.indiceActual = index;
    this.serviceActual = svc;
    this.Formulario = true;
  }

  onGrabar(svc: any) {
    if (this.indiceActual >= 0) {

      if (this.inEdit) {
        if (this.gtpService.services.find((s, i) => s.newName.toUpperCase() === svc.newName.toUpperCase() && i !== this.indiceActual)) {
          Swal.fire({
            text: 'Ya existe un servicio con este nombre',
            onOpen: drawPopup
          });
          return;
        }
      } else {
        if (this.gtpService.services.find((s, i) => s.nombre.toUpperCase() === svc.nombre.toUpperCase() && i !== this.indiceActual)) {
          Swal.fire({
            text: 'Ya existe un servicio con este nombre',
            onOpen: drawPopup
          });
          return;
        }
      }

      this.gtpService.services[this.indiceActual] = svc;
      this.indiceActual = -1;
      if (!svc.id) {
        this.gaService.sendEvent('ServicioAgregado', {
          'event_category': GoogleAnalytics.Afiliacion,
          'event_label': 'servicio_agregado'
        });
      }
    } else {
      let nro = 1;
      this.gtpService.services.forEach((s, i) => {
        if (s.nombre.startsWith(svc.nombre)) {
          if (!isNaN(parseInt(s.nombre.substr(svc.nombre.length))) || s.nombre.substr(svc.nombre.length) === ''){
            nro += 1;
          }
        }
      });
      if (nro > 1) {
        svc.nombre += nro.toString();
      }
      this.gtpService.services.push(svc);

    }
    this.Formulario = false;
    this.Formulariogtp = false;
    if (this.addNewAfterSave) {
      setTimeout(() => this.MostarFormulario(), 600);
    } else if (this.sendAfterSave) {
      setTimeout(() => this.EnviarServicios(), 600);
    } else {
      Swal.fire({
        title: 'Servicio Guardado',
        text: 'Los datos han sido guardados',
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: "CERRAR",
        onOpen: drawPopup
      });
    }
    this.addNewAfterSave = false;
    this.sendAfterSave = false;
  }

  getState(svc: DataServiceGTP) {
    if(svc.newName !== undefined && svc.newName !== null && (svc.newName.substring(0, 3).toString() === '???' || svc.newNameCode.substring(0, 3).toString() === '???')) {
      return 'Servicio Rechazado';
    }
    if (((svc.name !==  '?' )&&(svc.name !== svc.newName)) || ( (svc.debtorCode !==  '?' ) && (svc.debtorCode !== svc.newNameCode)) &&  svc.inReview) {
      return 'Edicion de Servicio';
    }
    if (((svc.name === '?'  &&  svc.debtorCode === '?') &&  svc.inReview)) {
      return 'Nuevo Servicio';
    }
    return '';
  }

  VerCamposEnterprise(etp: DataEnterpriseGTP) {
    if (this.Formulario === true) {
      this.mensaje('Aprobando Servicio ',
      'Actualmente se esta aprobando un Servicio' );
      return;
    }
    this.EmpresaFormulario = true;
    this.Empgtp = etp;
  }

  VerCamposSer(etp: DataServiceGTP, index: number) {
    if (this.EmpresaFormulario === true) {
      this.mensaje('Aprobando Empresa',
      'Actualmente se esta aprobando una Empresa' );
      return;
    }
    this.Formulario = true;
    this.indiceActual = index;
  }


  onGrabarEmp(emp: DataEnterpriseGTP) {
    console.log(emp);
    this.Enterprise = emp;
    this.EmpresaFormulario = false;
  }

}
