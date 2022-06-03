import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { internalAuthFullRoutingNames } from 'src/app/app-routing.collection';

@Component({
  selector: 'app-completado-primera-parte',
  templateUrl: './completado-primera-parte.component.html',
  styleUrls: ['./completado-primera-parte.component.scss'],
})
export class CompletadoPrimeraParteComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onConfigurarCobros() {
    this.router.navigate([
      internalAuthFullRoutingNames.CHARGES_AFFILIATION_ADD_STEP_1,
    ]);
  }
}
