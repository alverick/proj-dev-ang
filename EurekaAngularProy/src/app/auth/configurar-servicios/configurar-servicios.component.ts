import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export interface Animal {
  name: string;
  sound: string;
}
@Component({
  selector: 'app-configurar-servicios',
  templateUrl: './configurar-servicios.component.html',
  styleUrls: ['./configurar-servicios.component.scss']
})
export class ConfigurarServiciosComponent implements OnInit {

  Formulario: boolean =true;
  constructor() { }

  ngOnInit() {
    this.Formulario =true;
  }

  animalControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];

  OcultarFormulario(){
    this.Formulario = false 
  }
  MostarFormulario() {
    this.Formulario = true;
  }
   
}
