import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-completado-primera-parte',
  templateUrl: './completado-primera-parte.component.html',
  styleUrls: ['./completado-primera-parte.component.scss']
})
export class CompletadoPrimeraParteComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onConfigurarCobros(){
    //this.router.navigate(["/configuraCobrosParteUno"]);
  }

}
