import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment'; // dejalo si sale error
import { default as _rollupMoment } from 'moment';

import { GoogleAnalytics } from 'src/app/shared/services/googleAnalytics.service';
import { PagoService } from 'src/app/shared/services/pago.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import { PopoverRef } from '../popover/popover-ref';

const moment = _rollupMoment || _moment;

const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

declare var $: any;
@Component({
  selector: 'cs-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PagosComponent implements OnInit {
  showed = false;

  items: any[] = [];
  cargando = false;

  debtId: number;
  status: string;
  currency: string;
  @Output() statusChange = new EventEmitter<string>();

  constructor(
    private transaction: TransactionService,
    private pagoService: PagoService,
    private popoverRef: PopoverRef,
    private gaService: GoogleAnalytics
  ) {
    this.debtId = popoverRef.data.debtId;
    this.status = popoverRef.data.status;
    this.currency = popoverRef.data.currency;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.items = [];
    this.cargando = true;
    this.transaction.getPayments(this.debtId).subscribe((p) => {
      this.cargando = false;
      this.items = p;
    });
  }

  public show() {
    if (!this.showed) {
      this.pagoService.closeAll.emit();
      this.showed = true;
      this.loadData();
    } else {
      this.showed = false;
    }
  }

  mensaje(tipo: any, titulo: string, text: string) {
    if (sessionStorage.getItem('tk') !== null) {
      this.mesageeError(tipo, titulo, text);
    }
  }

  mesageeError(tipo: any, titulo: string, text: string) {
    Swal.fire({
      title: titulo,
      html: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'CERRAR',
      onOpen: drawPopup,
    });
  }

  editItm(itm) {
    itm.editing = true;
    itm.newAmount = itm.amount;
    itm.newDate = itm.date;
    itm.newChannel = itm.channel;
  }

  saveItm(itm) {
    if (itm.newAmount.toString() === '' || itm.newAmount.toString() === null) {
      itm.errores.amount = 'Ingrese un monto';
    }
    if (itm.newAmount.toString().length < 1) {
      itm.errores.amount = 'Ingrese un monto correcto';
    }
    if (parseInt(itm.newAmount.toString()) < 0) {
      itm.errores.amount = 'Ingrese un monto correcto';
    }

    if (!itm.newAmount.toString().match(/^[0-9]{1,9}([.][0-9]{0,2})?$/)) {
      itm.errores.amount = 'Ingrese un monto válido';
    }

    var lenghted = new Date(itm.newDate).toDateString().length;
    var newdate = parseInt(
      new Date(itm.newDate).toDateString().substr(lenghted - 4, lenghted)
    );

    if (newdate < 2000 || newdate > 2050) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    if (itm.newDate == null) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    for (var s in itm.errores) {
      if (itm.errores[s]) return;
    }

    Swal.fire({
      title: '¿Deseas Actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, ACTUALIZAR!',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    }).then((result) => {
      if (result.value) {
        const payment = {
          date: itm.newDate,
          channel: itm.newChannel,
          amount: parseFloat(itm.newAmount.toString()),
        };
        let response = itm.id
          ? this.transaction.editPayment(this.debtId, itm.id, payment)
          : this.transaction.addPayment(this.debtId, payment);
        response.subscribe((r) => {
          if (r.success) {
            if (itm.id) {
              this.gaService.sendEvent('EditaPago', {
                event_category: 'Dashboard',
                event_label: 'edita_pago',
              });
            } else {
              this.gaService.sendEvent('AgregaPago', {
                event_category: 'Dashboard',
                event_label: 'agrega_pago',
              });
            }
            this.status = r.status;
            //this.statusChange.emit(r.status);
            this.popoverRef.changeStatus(r.status);
            this.loadData();
            Swal.fire({
              titleText: 'Editado!',
              text: 'El pago ha sido editado',
              showCloseButton: true,
              showCancelButton: false,
              onOpen: drawPopup,
              onAfterClose: () => {
                itm.editing = false;
                itm.amount = itm.newAmount;
                itm.date = itm.newDate;
                itm.channel = itm.newChannel;
              },
            });
          } else {
            Swal.fire({
              titleText: 'ERROR',
              text: r.message,
              showCloseButton: true,
              showCancelButton: false,
              onOpen: drawPopup,
            });
          }
        });
      }
    });
  }

  cancelItm(itm) {
    if (itm.id === undefined) {
      this.items.pop();
    } else {
      itm.editing = false;
    }
  }

  addItm() {
    //if (this.items[this.items.length-1] && this.items[this.items.length-1].id) {
    this.items.push({
      currency: this.currency,
      newAmount: '',
      newDate: new Date(),
      newChannel: 'Efectivo',
      canEdit: true,
      editing: true,
      errores: {},
    });
    //}
  }

  delItm(itm) {
    Swal.fire({
      title: '¿Esta Seguro de Eliminar el Pago? ',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, BORRALO',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup,
    }).then((result) => {
      if (result.value) {
        this.transaction.deletePayment(this.debtId, itm.id).subscribe((r) => {
          if (r.success) {
            this.gaService.sendEvent('EliminarPagos', {
              event_category: 'Dashboard',
              event_label: 'eliminar_pagos',
            });
            this.status = r.status;
            //this.statusChange.emit(r.status);
            this.popoverRef.changeStatus(r.status);
            this.loadData();
          } else {
            Swal.fire({
              titleText: 'ERROR',
              text: r.message,
              showCloseButton: true,
              showCancelButton: false,
              onOpen: drawPopup,
            });
          }
        });
      }
    });
  }

  AmountBlur(itm) {
    let initalValue = parseFloat(itm.newAmount);
    if (!isNaN(initalValue)) itm.newAmount = initalValue.toFixed(2);
  }
}
