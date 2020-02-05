import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RecuperaService } from 'src/app/shared/services/recupera.service';
import { drawPopup } from 'src/app/shared/services/popups';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private recuperaService: RecuperaService, private router: Router) { }
   public formulario :boolean =true;
   recupera: FormGroup;
   public  submitted: Boolean = false;
   isCaptchaValidate: boolean = false;


   @HostListener('window:beforeunload', ['$event'])
    public closeWindow($event: any) {
      if ( !this.formulario ) {
        $event.returnValue = 'Se van a perder los cambios.';
      }
    }

  ngOnInit(   ) {

    this.recupera = this.formBuilder.group({
      ruc: new FormControl('',  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
      email:new FormControl('',  [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
      //captcha: new FormControl( '',  [Validators.required])
    });

    // borra el back del navegador
    window['_url_loop_'] = 'recupera';
    history.pushState(null, null, 'recupera');
    // mantiene la pagina con el scroll en la parte superior
    window.scrollTo(0, 0);
  }

  get f(): any {
    return this.recupera.controls;
  }


  resolved(captchaResponse: string) : boolean{
    this.isCaptchaValidate = true;
    return true;
  }

  SubmitRecupera(){

    if (this.recupera.valid && this.isCaptchaValidate == true) {
      this.recuperaService.RecoverPassword({RUC: this.recupera.value.ruc,
        Email: this.recupera.value.email}).subscribe(d =>{
            if(d===true){
              this.mensaje('Hemos recibido tus datos','Estamos revisando los datos que ingresaste, en caso de que sean correctos recibirás un correo electrónico con indicaciones para acceder a tu cuenta');
              this.formulario =false;
              this.f.ruc.reset();
              this.f.ruc.clearValidators();
              this.f.email.reset();
              this.f.email.clearValidators();
              // al ocultar la pantalla se mostrara en la parte de arriba la pagina
              //window.scrollTo(0, 0);
              this.router.navigate(["/login"]);
            }else{
              this.mensaje('Hemos recibido tus datos','Ingrese datos validos');
            }
        });
    }
  }

  Reenviar(){
    this.recuperaService.RecoverPassword({RUC: this.recuperaService.ruc,
      Email:this.recuperaService.email}).subscribe(d =>{
          if(d===true){
            this.mensaje('Hemos recibido tus datos','Se ha reenviado un correo electrónico con indicaciones para acceder a tu cuenta');
            this.formulario =false;
          }else{
            this.mensaje('Hemos recibido tus datos','Ingrese datos validos');
          }
      });
  }



  mensaje( titulo: string, text: string) {
    Swal.fire({
     // type: tipo ,
      title: titulo ,
      html: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText:  'ENTENDIDO',
      onOpen: drawPopup,

    });
  }

}
