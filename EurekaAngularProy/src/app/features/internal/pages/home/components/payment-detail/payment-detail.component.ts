import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { forEachObjIndexed, isNil } from 'ramda';

import {
  ActionEventProperties,
  AdobeAnalyticsService,
  AdobeEvent,
  Metadata,
} from '../../../../../../shared/services/adobe-analytics.service';
import { TransactionService } from '../../../../../../shared/services/transaction.service';
import { swalAlert } from '../../../../../../shared/utils/helpers/popups';

@Component({
  selector: 'cs-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss'],
})
export class PaymentDetailComponent implements OnInit {
  items: any[] = [];
  loading = false;
  isEditingRow = false;
  customer: any = {};
  debtId: number;
  status: string;
  currency: string;

  constructor(
    private transaction: TransactionService,
    public dialogRef: MatDialogRef<PaymentDetailComponent>,
    protected adobeAnalytics: AdobeAnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.debtId = data.debtId;
    this.customer = data.customer;
    this.currency = data.currency;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.items = [];
    this.loading = true;
    this.transaction.getPayments(this.debtId).subscribe((p) => {
      this.loading = false;
      this.items = p;
    });
  }

  editItm(itm) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Editar pago',
      label: 'Editar',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.cancelItm(this.getItemEditing());
    this.isEditingRow = true;
    itm.editing = true;
    itm.newAmount = itm.amount;
    itm.newDate = itm.date;
    itm.newChannel = itm.channel;
    itm.errores = {};
  }

  saveItem() {
    this.saveItm(this.getItemEditing());
  }

  private getItemEditing() {
    return this.items.find(({ editing }) => editing);
  }

  cancelItem() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Cancelar agregar un pago',
      label: 'Cancelar',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.cancelItm(this.getItemEditing());
  }

  saveItm(itm) {
    if (itm.newAmount.toString() === '' || itm.newAmount.toString() === null) {
      itm.errores.amount = 'Ingrese un monto';
    }
    if (itm.newAmount.toString().length < 1) {
      itm.errores.amount = 'Ingrese un monto correcto';
    }
    if (parseInt(itm.newAmount.toString(), 10) < 0) {
      itm.errores.amount = 'Ingrese un monto correcto';
    }

    if (!itm.newAmount.toString().match(/^\d{1,9}([.]\d{0,2})?$/)) {
      itm.errores.amount = 'Ingrese un monto válido';
    }

    const lenghted = new Date(itm.newDate).toDateString().length;
    const newdate = parseInt(
      new Date(itm.newDate).toDateString().substr(lenghted - 4, lenghted),
      10
    );

    if (newdate < 2000 || newdate > 2050) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    if (itm.newDate == null) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    for (const s in itm.errores) {
      if (itm.errores[s]) {
        return;
      }
    }

    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: '¿Deseas Actualizar?',
      action: 'modal-view',
      detail: '¡No podrás revertir esto!',
      location: 'Modal - Agregar pago',
    });

    void swalAlert
      .fire({
        title: '¿Deseas Actualizar?',
        text: '¡No podrás revertir esto!',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.value) {
          const payment = {
            date: itm.newDate,
            channel: itm.newChannel,
            amount: parseFloat(itm.newAmount.toString()),
          };
          const metadata: Metadata[] = [];
          forEachObjIndexed((value, key) => {
            metadata.push({
              key,
              value: value as string,
            });
          }, payment);
          const actionStep: Partial<ActionEventProperties> = {
            category: 'Home movimientos',
            action: 'Click',
            label: 'Guardar',
            location: 'Modal - Detalle de pago ',
            step: 'Not available',
            state: 'Envío exitoso',
            metadata,
          };

          const response = itm.id
            ? this.transaction.editPayment(this.debtId, itm.id, payment)
            : this.transaction.addPayment(this.debtId, payment);
          response.subscribe((r) => {
            if (r.success) {
              this.status = r.status;
              this.loadData();
              this.adobeAnalytics.trackEvent(
                AdobeEvent.trackFormSubmit,
                actionStep
              );

              this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                category: 'Editado!',
                action: 'modal-view',
                detail: 'El pago ha sido editado.',
                location: 'Modal - Agregar pago',
              });
              void swalAlert.fire({
                titleText: 'Editado!',
                text: 'El pago ha sido editado.',
                showCloseButton: true,
                showCancelButton: false,
                didClose: () => {
                  this.isEditingRow = false;
                  itm.editing = false;
                  itm.amount = itm.newAmount;
                  itm.date = itm.newDate;
                  itm.channel = itm.newChannel;
                },
              });
            } else {
              this.adobeAnalytics.trackEvent(AdobeEvent.trackFormSubmit, {
                ...actionStep,
                state: 'Intención de envío',
                typeError: r.message as string,
              });
              this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
                category: 'ERROR',
                action: 'modal-view',
                detail: r.message,
                location: 'Modal - Agregar pago',
              });
              void swalAlert.fire({
                titleText: 'ERROR',
                text: r.message,
                showCloseButton: true,
                showCancelButton: false,
              });
            }
          });
        }
      });
  }

  cancelItm(itm) {
    if (isNil(itm)) {
      return;
    }
    this.isEditingRow = false;
    if (itm.id === undefined) {
      this.items.pop();
    } else {
      itm.editing = false;
    }
  }

  addItem() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Agregar un pago',
      label: 'Agregar un pago',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.isEditingRow = true;
    this.items.push({
      currency: this.currency,
      newAmount: '',
      newDate: new Date(),
      newChannel: 'Efectivo',
      canEdit: true,
      editing: true,
      errores: {},
    });
  }

  delItm(itm) {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Eliminar pago',
      label: 'Eliminar',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.adobeAnalytics.trackEvent(AdobeEvent.trackView, {
      category: '¿Estás seguro que deseas eliminar el pago?',
      action: 'modal-view',
      detail: 'Eliminar pago',
      location: 'Modal - Agregar pago',
    });
    void swalAlert
      .fire({
        title: '¿Estás seguro que deseas eliminar el pago?',
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.value) {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
            category: 'Home movimientos',
            action: 'Click',
            detail: 'Confirmar eliminación de pago',
            label: 'Sí, eliminar',
            typeElement: 'Botón',
            location: 'Movimientos - Detalle de pago',
          });
          this.transaction.deletePayment(this.debtId, itm.id).subscribe((r) => {
            if (r.success) {
              this.status = r.status;
              this.loadData();
            } else {
              void swalAlert.fire({
                titleText: 'ERROR',
                text: r.message,
                showCloseButton: true,
                showCancelButton: false,
              });
            }
          });
        } else {
          this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
            category: 'Home movimientos',
            action: 'Click',
            detail: 'Cancelar eliminación de pago',
            label: 'Cancelar',
            typeElement: 'Botón',
            location: 'Movimientos - Detalle de pago',
          });
        }
      });
  }

  amountBlur(itm) {
    const initalValue = parseFloat(itm.newAmount);
    if (!isNaN(initalValue)) {
      itm.newAmount = initalValue.toFixed(2);
    }
  }

  close() {
    this.adobeAnalytics.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Cerrar agregar un pago',
      label: 'Cerrar',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.dialogRef.close({ status: this.status });
  }
}
