import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '../crear-contrasena/must-match.validator';
import { RecuperaService } from 'src/app/shared/services/recupera.service';
import Swal from 'sweetalert2';
import { drawPopup } from 'src/app/shared/services/popups';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-cambia-contrasena',
  templateUrl: './cambia-contrasena.component.html',
  styleUrls: ['./cambia-contrasena.component.scss']
})
export class CambiaContrasenaComponent implements OnInit {

  public llave: string;
  public formulario: boolean;

  constructor(public formBuilder: FormBuilder, private rutaActiva: ActivatedRoute, private router: Router, private recuperaService: RecuperaService, public storage: StorageService) { }
  public Cambia: FormGroup;
  ngOnInit() {
    this.Cambia = this.formBuilder.group({
        contrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
        repcontrasena: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), UnaLetra]),
    }, {
      validator: MustMatch('contrasena', 'repcontrasena')
    })
    this.llave =  this.rutaActiva.snapshot.params.llave;


     this.Verificar(this.llave);

  }



  get f():any{
    return this.Cambia.controls;
  }


  //  los 6 primeros de adelante
  // 3173I1201910171716
  Verificar(key:any){
    console.log('entra a verificar');
    this.recuperaService.VerifingToken({TokenEncrypted:key}).subscribe(d => {
      console.log('entra a recuper????');
      if(d===true){
      }else{
        this.mensaje('Enlace expirado','El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro para recuperar tu contraseña');
         this.router.navigate(['/login']);
      }
    });
  }

  SubmitCambia(){
    if(this.Cambia.valid){
      this.recuperaService.ChangePassword({NewPassword:this.Cambia.value.contrasena,
           Token:this.llave })
          .subscribe(d =>{
              if(d == false){
                this.mensaje('Actualizar Contraseña','Error al actualizar Contraseña');
              }else if(d == true){ 
                this.PopUpWithOneButon('Contraseña actualizada','Tu contraseña ha sido actualizada','Iniciar sesión');
              }
          })
    }
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
      confirmButtonText:  'ENTIENDO',
      onOpen: drawPopup,

    });
  }

  PopUpWithOneButon( titulo: string, text: string, firstButton: string) {
    Swal.fire({
     // type: tipo ,
      title: titulo ,
      html: text,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText:  firstButton,
      onOpen: drawPopup,

    }).then((result) => {
        this.router.navigate(['/login']);
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
