import { Component, OnInit } from '@angular/core';
import { authFullRoutingNames } from 'src/app/app-routing.collection';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';

@Component({
  selector: 'app-afiliacion',
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.scss'],
})
export class AfiliacionComponent implements OnInit {
  linkGeneratePassword = authFullRoutingNames.GENERATE_PASSWORD;
  constructor(
    private gaService: GoogleAnalytics,
    private afiliacion: AfiliacionService
  ) {}

  public solAgente = 1;
  public solTienda = 7;
  public dolAgente = 1;
  public dolTienda = 7;

  ngOnInit() {
    this.afiliacion.GetTipoCambio().subscribe((d) => {
      if (d === 0) {
        d = 1;
      }
      this.dolAgente = Math.round((this.solAgente / d) * 100) / 100;
      this.dolTienda = Math.round((this.dolTienda / d) * 100) / 100;
    });
  }

  clickRegistrarme() {
    this.gaService.sendEvent('QuieroRegistrarme', {
      event_category: GoogleAnalytics.Afiliacion,
      event_label: 'quiero_registrarme',
    });
  }

  crearCuenta() {
    window.open(
      'https://interbank.pe/pequena-empresa/cuentas/para-mi-dia-a-dia/cuenta-negocios#cuenta-negocios'
    );
  }
}
