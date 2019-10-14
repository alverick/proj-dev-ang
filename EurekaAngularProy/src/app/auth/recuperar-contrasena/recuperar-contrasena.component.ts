import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RecuperaService } from 'src/app/shared/services/recupera.service';
import { drawPopup } from 'src/app/shared/services/popups';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.scss']
})
export class RecuperarContrasenaComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private recuperaService: RecuperaService) { }
   public formulario :boolean =true;
   recupera: FormGroup;
   public  submitted: Boolean = false;

  ngOnInit(   ) {

    this.recupera = this.formBuilder.group({
      ruc: new FormControl('',  [Validators.required,  Validators.pattern('[1-2]0[0-9]+?'), Validators.minLength(11)]),
      email:new FormControl('',  [Validators.required , Validators.pattern('^[A-Za-z0-9]{1,}([-._]{1}[A-Za-z0-9]{1,})?@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$'), Validators.minLength(10), Validators.maxLength(100)]),
      //captcha: new FormControl( '',  [Validators.required])
    });
    
  }

  get f(): any {
    return this.recupera.controls;
  }

  SubmitRecupera(){ 

    if (this.recupera.invalid) {
      return;
    }
    console.log('entra a metodo');
    this.recuperaService.RecoverPassword({RUC: this.recupera.value.ruc,
      Email: this.recupera.value.email}).subscribe(d =>{
        console.log('entra a recuperar');
         
          if(d===true){
            this.mensaje('Hemos recibido tus datos','Estamos revisando los datos que ingresaste, en caso de que sean correctos recibirás un correo electrónico con indicaciones para acceder a tu cuenta');
          }else{
            this.mensaje('Hemos recibido tus datos','Ingrese una cuenta valida');
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
