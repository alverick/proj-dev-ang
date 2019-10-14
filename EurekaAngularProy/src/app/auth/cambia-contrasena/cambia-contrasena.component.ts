import { FormControl, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cambia-contrasena',
  templateUrl: './cambia-contrasena.component.html',
  styleUrls: ['./cambia-contrasena.component.scss']
})
export class CambiaContrasenaComponent implements OnInit {

  constructor(public formBuilder: FormBuilder) { }
  public Cambia: FormGroup;
  ngOnInit() {
    this.Cambia = this.formBuilder.group({
        password: new FormControl('', [Validators.required]),
        newpassword: new FormControl('', [Validators.required])
    })
  }

  f():any{
    return this.Cambia.controls;
  }

  SubmitCambia(){

  }

}
