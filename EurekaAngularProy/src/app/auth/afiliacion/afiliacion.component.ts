import { Component, OnInit } from '@angular/core';
import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';

@Component({
  selector: 'app-afiliacion',
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.scss']
})
export class AfiliacionComponent implements OnInit {

  constructor(private gaService: GoogleAnalytics) { }

  ngOnInit() {
  }

  clickRegistrarme() {
    this.gaService.sendEvent('QuieroRegistrarme', {
      'event_category': GoogleAnalytics.Afiliacion,
      'event_label': 'quiero_registrarme'
    });
  }
}
