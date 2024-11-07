import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Ripple } from 'primeng/ripple';
import { forEachObjIndexed, isNil } from 'ramda';

import {
  type ActionEventProperties,
  AdobeEvent,
  type Metadata,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { TransactionService } from '../../../../../../shared/services/transaction.service';
import { swalAlert } from '../../../../../../shared/utils/helpers/popups';
import { companyFeature } from '../../../../../../store/reducers/company.reducer';

@Component({
  selector: 'cs-payment-detail',
  templateUrl: './payment-detail.component.html',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    InputNumberModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    LetDirective,
    ButtonDirective,
    Ripple,
    DecimalPipe,
    DatePipe,
  ],
})
export class PaymentDetailComponent implements OnInit {
  items: any[] = [];
  loading = false;
  isEditingRow = false;
  serviceType = '';
  customer = {};
  debtId: number;
  status: string;
  currency: string;
  useAmountLimits$ = this.store.select(companyFeature.selectUseAmountLimits);
  channelOptions = ['Efectivo', 'POS', 'BCP', 'BBVA', 'Otro banco'];

  constructor(
    private transaction: TransactionService,
    public dialogRef: DynamicDialogRef<PaymentDetailComponent>,
    public dialogConfig: DynamicDialogConfig<PaymentDetailComponent>,
    protected tracking: TrackingService,
    private readonly store: Store,
  ) {
    ({
      debtId: this.debtId,
      customer: this.customer,
      currency: this.currency,
      serviceType: this.serviceType,
    } = this.dialogConfig.data);
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    itm.newDate = new Date(itm.date);
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    if (isNil(itm.newAmount)) {
      itm.errores.amount = 'Ingrese un monto';
    } else {
      if (
        itm.newAmount.toString() === '' ||
        itm.newAmount.toString() === null
      ) {
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
    }

    const newDateYear = new Date(itm.newDate).getFullYear();

    if (newDateYear < 2000 || newDateYear > 2050) {
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

    this.tracking.trackEvent(AdobeEvent.trackView, {
      category: '¿Deseas actualizar?',
      action: 'modal-view',
      detail: '¡No podrás revertir esto!',
      location: 'Modal - Agregar pago',
    });

    void swalAlert
      .fire({
        title: '¿Deseas actualizar?',
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
              this.tracking.trackEvent(AdobeEvent.trackFormSubmit, actionStep);

              this.tracking.trackEvent(AdobeEvent.trackView, {
                category: 'Editado',
                action: 'modal-view',
                detail: 'El pago ha sido editado.',
                location: 'Modal - Agregar pago',
              });
              void swalAlert.fire({
                titleText: 'Editado',
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
              this.tracking.trackEvent(AdobeEvent.trackFormSubmit, {
                ...actionStep,
                state: 'Intención de envío',
                typeError: r.message as string,
              });
              this.tracking.trackEvent(AdobeEvent.trackView, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
      newAmount: null,
      newDate: new Date(),
      newChannel: 'Efectivo',
      canEdit: true,
      editing: true,
      errores: {},
    });
  }

  delItm(itm) {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Eliminar pago',
      label: 'Eliminar',
      typeElement: 'Botón',
      location: 'Movimientos - Detalle de pago',
    });
    this.tracking.trackEvent(AdobeEvent.trackView, {
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
          this.tracking.trackEvent(AdobeEvent.trackAction, {
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
          this.tracking.trackEvent(AdobeEvent.trackAction, {
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
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
