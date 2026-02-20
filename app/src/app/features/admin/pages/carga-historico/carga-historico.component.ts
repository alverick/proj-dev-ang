import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { QueryDataService } from '../../../../shared/data';
import { ProcessService } from '../../../../shared/services/process.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';

@Component({
  selector: 'cs-carga-historico',
  templateUrl: './carga-historico.component.html',
  styleUrls: ['./carga-historico.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    Ripple,
    TooltipModule,
    NgxPaginationModule,
    FooterComponent,
    DecimalPipe,
    DatePipe,
  ],
})
export class CargaHistoricoComponent implements OnInit {
  private readonly processService = inject(ProcessService);
  private readonly route = inject(ActivatedRoute);
  private readonly queryDataService = inject(QueryDataService);

  items: any[] = [];
  pageNumber = 1;
  totalItems = 0;

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
        title: 'Sincronizar carga de cobros',
        html: `La carga de excel pasará del estado SAVING o VALIDATING a FAILED, luego el cliente podrá realizar una nueva carga. Recuerda que <strong>la empresa de esta carga deberá cerrar sesión</strong> para una mejor sincronización.`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sí, sincronizar',
        cancelButtonText: 'Cancelar',
      })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.queryDataService
            .regularizeProcessById(processId)
            .subscribe((result) => {
              this.cargarItems();
              void swalAlert.fire({
                title: result.success
                  ? 'Sincronización exitosa'
                  : 'Ha ocurrido un error',
                html:
                  result.rows === 0
                    ? result.message
                    : `Se actualizó <strong>${result.rows} registro(s)</strong> de carga de cobros, del estado SAVING o VALIDATING a FAILED.`,
                showConfirmButton: true,
                confirmButtonText: 'Entendido',
              });
            });
        }
      });
  }
}
