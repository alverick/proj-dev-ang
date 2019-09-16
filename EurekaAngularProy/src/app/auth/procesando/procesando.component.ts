import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-procesando',
  templateUrl: './procesando.component.html',
  styleUrls: ['./procesando.component.scss']
})
export class ProcesandoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window['_url_loop_'] = 'procesando';
  }

}
