import { Component, OnInit } from '@angular/core';
import { DataEnterpriseGTP } from 'src/app/shared/models/data-enterprise-gtp';
import { GtpService } from 'src/app/shared/services/gtp.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-corrige',
  templateUrl: './corrige.component.html',
  styleUrls: ['./corrige.component.scss']
})
export class CorrigeComponent implements OnInit {
  public Enterprise : DataEnterpriseGTP;
  constructor(public gtpService:GtpService, private rutaActiva: ActivatedRoute) { }


  ngOnInit() {

   this.Enterprise  = {
    ruc:12345678912,
    name:'nombre actual',
    entry: '04',
    entryName: '',
    email: 'mnievafra@gmail.com',
    movilNumber: 123456 ,
    movilOperator: 'C',
    newName:'Nuevo Nombre',
    status: 'nueva empresa',
    uniqueCodeIBK: '1321321',
    requestDate:new Date(Date.now()),
    NombreApproved: null
   }


  }

}
