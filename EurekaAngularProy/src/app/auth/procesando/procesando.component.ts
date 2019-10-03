import { Component, OnInit } from '@angular/core';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';

@Component({
  selector: 'app-procesando',
  templateUrl: './procesando.component.html',
  styleUrls: ['./procesando.component.scss']
})
export class ProcesandoComponent implements OnInit {
   public email: string; 
  constructor(public afiliacion: AfiliacionService) { }

  ngOnInit() {
    window['_url_loop_'] = 'procesando';
    this.email = this.afiliacion.email;
  }

}
