import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as saveAs from 'file-saver';
import { ProcessService } from 'src/app/shared/services/process.service';

import { QueryDataService } from '../../../../shared/data';
import { swalAlert } from '../../../../shared/utils/helpers/popups';

@Component({
  selector: 'cs-carga-historico',
  templateUrl: './carga-historico.component.html',
  styleUrls: ['./carga-historico.component.scss'],
})
export class CargaHistoricoComponent implements OnInit {
  items: any[] = [];
  pageNumber = 1;
  totalItems = 0;

  constructor(
    private processService: ProcessService,
    private route: ActivatedRoute,
    private queryDataService: QueryDataService
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

  fixProcess(processId: number): void {
    void swalAlert
      .fire({
        title: 'Actualización de estado saving',
        text: `Actualiza el estado saving a completed, tras error en carga de archivos Excel.`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.queryDataService
            .regularizeProcessById(processId)
            .subscribe((result) => {
              this.cargarItems();
              void swalAlert.fire({
                title: 'Actualización de estado saving',
                text: result.message,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
              });
            });
        }
      });
  }
}
