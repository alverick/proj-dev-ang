import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RubroModel } from 'src/app/shared/models';
import { drawPopup } from 'src/app/shared/services/popups';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { GtpEmpresa } from 'src/app/shared/models/gtp-post';
import { GtpService } from 'src/app/shared/services/gtp.service';

declare var $: any;
@Component({
  selector: 'app-crear-contrasena',
  templateUrl: './crear-contrasena.component.html',
  styleUrls: ['./crear-contrasena.component.scss']
})
export class CrearContrasenaComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  public llave: number;
  public inEdit: boolean = false;
  public empresa : DataEnterpriseGTP;

  constructor(
    private formBuilder: FormBuilder,
    private afiliacionService: AfiliacionService,
    private router: Router,
    private gaService: GoogleAnalytics,
    private route: ActivatedRoute,
    private rutaActiva: ActivatedRoute,
    public gtpService:GtpService
  ) {}

  rubros: RubroModel[] = [];

  @HostListener('window:beforeunload', ['$event'])
  public closeWindow($event: any) {

    if (!this.afiliacionService.Guardado) {
      $event.returnValue = 'Se van a perder los cambios.';
    }
  }

  ngOnInit() {
    this.route.data.subscribe(d => {
      this.inEdit = d.isEdit;

      this.empresa  = {
        ruc:12345678912,
        name:'nombre actual',
        entry: '04',
        email: 'mnievafra@gmail.com',
        movilNumber: 123456 ,
        newName:'Nuevo Nombre',
        status: 'nueva empresa',
        uniqueCodeIBK: '1321321',
        requestDate:new Date(Date.now()),
        NombreApproved: false
      }
      if (d.isEdit) {
        this.llave =  this.rutaActiva.snapshot.params.llave;
        this.registerForm = this.formBuilder.group({
          ruc: new FormControl({ value: this.empresa.ruc, disabled: this.inEdit },  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
          nombre: new FormControl({ value: this.empresa.name, disabled: this.empresa.NombreApproved }, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
          rubro: new FormControl({ value: this.empresa.entry, disabled: this.inEdit }, [Validators.required]),
          email: new FormControl( {value: this.empresa.email, disabled: this.inEdit }, [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
          telefono: new FormControl({ value: this.empresa.movilNumber, disabled: this.inEdit }, [Validators.required,Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'), Validators.minLength(6), Validators.maxLength(9)]),
          contrasena: new FormControl({ value: '', disabled: this.inEdit }),
          repcontrasena: new FormControl({ value: '', disabled: this.inEdit }),
          acceptterms: new FormControl({ value: true, disabled: this.inEdit }),
        }, {
          validator: MustMatch('contrasena', 'repcontrasena')
        });
      }else{
        window['_url_loop_'] = 'crearContrasena';
        this.registerForm = this.formBuilder.group({
          ruc: new FormControl({ value: '', disabled: this.inEdit },  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
          nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]),
          rubro: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required]),
          email: new FormControl( { value: '', disabled: this.inEdit }, [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
          telefono: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required,Validators.pattern('^([9][0-9]{8})?([1-8][0-9]{5,6})?$'), Validators.minLength(6), Validators.maxLength(9)]),
          contrasena: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
          repcontrasena: new FormControl({ value: '', disabled: this.inEdit }, [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
          acceptterms: new FormControl({ value: '', disabled: this.inEdit },Validators.requiredTrue),
        }, {
          validator: MustMatch('contrasena', 'repcontrasena')
        });
      }
    });



    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
  }

  // Obtención de conveniencia para un fácil acceso a los campos de formulario
  get f(): any {
    return this.registerForm.controls;
  }



  onSubmit() {
    this.submitted = true;
   // var ruc  = this.registerForm.value.ruc.toString();

    if (this.registerForm.invalid) {
      return;
    }

    if(this.inEdit == false){

      this.afiliacionService.Registrar({
        ruc: this.registerForm.value.ruc,
        name: this.registerForm.value.nombre,
        entry: this.registerForm.value.rubro,
        email: this.registerForm.value.email,
        movilNumber: this.registerForm.value.telefono,
        password: this.registerForm.value.contrasena,
        acceptTerms: this.registerForm.value.acceptterms
      }).subscribe(d => {
        if (d.success) {
          this.router.navigate(["/configurarServicios"/*, this.registerForm.get('ruc')*/]);
        } else {
          if (d.code === 1) {
            Swal.fire({
            //  type: 'warning',
              title: 'Crea tu cuenta',
              text: `El RUC: ${this.registerForm.value.ruc} ya se encuentra registrado en Eureca`,
              showConfirmButton:true ,
              showCancelButton: false,
              showCloseButton: true,
              confirmButtonText: 'CERRAR',
              onOpen: drawPopup,
            });
          } else {
            Swal.fire({
             // type: 'warning',
              title: 'Abre tu Cuenta Negocios',
              text: `Te llevaremos a la página web de Interbank para abrir la cuenta. Una vez que llenes el formulario regresa aquí.`,
              showConfirmButton: true,
              showCancelButton: false,
              showCloseButton: true,
              confirmButtonText: 'CREAR MI CUENTA',
              onOpen: drawPopup,
            }).then(res => {
              if (res.value) {
                this.gaService.sendEvent('IrACrearCuenta', {
                  'event_category': GoogleAnalytics.Afiliacion,
                  'event_label': 'ir_a_crear_cuenta'
                });
                window.open('https://interbank.pe/cuenta-negocios');
                this.router.navigate(['/login']);
              }
            });
          }
        }
      }, err => {
        this.mensaje('error', 'Regístrame', 'Ha ocurrido un error con el servidor<br />Intente de nuevo' );

      });

    }else{
      console.log('se guarda la nueva empresa');
      this.gtpService.emp= null;
      this.gtpService.emp = {ClientId: this.llave, NombreAprobado:this.registerForm.value.nombre.toString()};
      this.router.navigate(["/configurarServicios"/*, this.registerForm.get('ruc')*/]);

      console.log( this.gtpService.emp);
    }


  }


  terminos() {
   $('#terminos').modal('show');
   // alert('hola');
  }

  mensaje(tipo: any, titulo: string, text: string) {
    Swal.fire({
     // type: tipo ,
      title: titulo ,
      html: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText:  'CERRAR',
      onOpen: drawPopup,

    });
  }


  nameSerInput(e) {
    let initalValue = this.f.nombre.value;
   /* initalValue = initalValue.replace(/[ ]{2}/g, ' ');
    initalValue = initalValue.replace(/[ ]{2}$/g, '');  */
    initalValue = initalValue.replace(/\s{2,}/g, " ");
    this.f.nombre.setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ''));
  }

  nameSerBlur(e) {
    let initalValue = this.f.nombre.value;
    this.f.nombre.setValue(initalValue.trim());
  }

  enviarDatosEmpresa() {
    this.gaService.sendEvent('EnviarDatosEmpresa', {
      'event_category': 'Afiliación',
      'event-label': 'enviar_datos_empresa'
    });
  }
}


function UnaLetra(c: FormControl) {
  let regex = /[a-zA-Z]/g;
  if (c.value && !regex.test(c.value)) {
    return { unaletra: true };
  }
  return null;
}
