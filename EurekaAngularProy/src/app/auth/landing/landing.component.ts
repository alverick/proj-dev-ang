import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(
    private gaService: GoogleAnalytics

  ) { }

  ngOnInit() {
    this.gaService.sendEvent('Landing', {
      'event_category': 'Landing',
      'event_label': 'ingreso_landing'
    });
  }

  clickRegistrarse() {
    this.gaService.sendEvent('Registrarme', {
      'event_category': GoogleAnalytics.Afiliacion,
      'event_label': 'registrarme'
    });
  }

  clickLogin(){
    this.gaService.sendEvent('Registrarme', {
      'event_category': GoogleAnalytics.Afiliacion,
      'event_label': 'registrarme'
    });
  }
}
