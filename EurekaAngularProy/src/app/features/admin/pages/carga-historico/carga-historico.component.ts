import * as saveAs from 'file-saver';

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ProcessService } from 'src/app/shared/services/process.service';

@Component({
  selector: 'app-carga-historico',
  templateUrl: './carga-historico.component.html',
  styleUrls: ['./carga-historico.component.scss'],
})
export class CargaHistoricoComponent implements OnInit {
  items: any[] = [];
  pageNumber = 1;
  totalItems = 0;

  constructor(
    private processService: ProcessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarItems();
  }

  cargarItems() {
    this.items = [];
    this.totalItems = 0;
    this.processService
      .getList(this.route.snapshot.paramMap.get('llave'), this.pageNumber)
      .subscribe((d) => {
        this.items = d.items;
        this.totalItems = d.total;
      });
  }

  changePage(page) {
    this.pageNumber = parseInt(page);
    this.cargarItems();
  }

  bajarExcel(itm) {
    this.processService.getFile(itm.id).subscribe((r: Blob) => {
      saveAs(r, itm.filename);
    });
  }
}
