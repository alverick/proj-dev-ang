import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";
import { TransactionService } from "src/app/shared/services/transaction.service";
import { PagoService } from "src/app/shared/services/pago.service";
import { GoogleAnalytics } from "src/app/shared/services/googleAnalytics.service";

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  showed = false;

  items: any[] = [
  ];
  cargando = false;

  @Input() debtId: number = 1288900;
  @Input() status: string;
  @Input() currency: string;
  @Output() statusChange = new EventEmitter<string>();
  @Output() showChange = new EventEmitter<boolean>();

  private removeOutside: () => void = null;

  constructor(private transaction: TransactionService, private pagoService: PagoService,
    private _elementRef: ElementRef, private renderer: Renderer2, private gaService: GoogleAnalytics) {
    pagoService.closeAll.subscribe(() => {
      this.showed = false;
      this.showChange.emit(this.showed);
      if (this.removeOutside !== null)
        this.removeOutside();
    });
  }

  ngOnInit(): void {
  }

  private loadData() {
    this.items = [];
    this.cargando = true;
    this.transaction.getPayments(this.debtId)
      .subscribe(p => {
        this.cargando = false;
        this.items = p;
      });
  }

  public show() {
    if (!this.showed) {
      this.pagoService.closeAll.emit();
      this.showed = true;
      this.loadData();
      setTimeout(() => {
        this.removeOutside = this.renderer.listen('document', 'click', (e) => this.outsideClick(e.target));
      }, 100);
    }
    else {
      this.showed = false;
    }
    this.showChange.emit(this.showed);
  }

  private outsideClick(target: HTMLElement) {
    if (!(this._elementRef.nativeElement as HTMLElement).contains(target)) {
      const cdkContainer = document.getElementsByClassName('cdk-overlay-container');
      if (cdkContainer.length === 0) {
        const swalContainer = document.getElementsByClassName('swal2-container');
        if (swalContainer.length === 0) {
          this.pagoService.closeAll.emit();
        }
        else if (!swalContainer[0].contains(target)) {
          this.pagoService.closeAll.emit();
        }
      }
      else if (!cdkContainer[0].contains(target)) {
        this.pagoService.closeAll.emit();
      }
    }
  }

  mensaje(tipo: any, titulo: string, text: string){
    if (localStorage.getItem('tk') !== null  ) {
      this.mesageeError(tipo,titulo,text);
    }
  }

  mesageeError(tipo: any, titulo: string, text: string){
    Swal.fire({
      title: titulo ,
      html: text,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText:  'CERRAR',
      onOpen: drawPopup
    });
  }

  editItm(itm) {
    itm.editing = true;
    itm.newAmount = itm.amount;
    itm.newDate = itm.date;
    itm.newChannel = itm.channel;
  }

  saveItm(itm) {
    if(itm.newAmount.toString() ==='' ||itm.newAmount.toString() === null){
      itm.errores.amount = 'Ingrese un monto'
    }
    if(itm.newAmount.toString().length < 1){
      itm.errores.amount = 'Ingrese un monto correcto';
    }
    if(parseInt(itm.newAmount.toString()) < 1){
      itm.errores.amount = 'Ingrese un monto correcto';
    }

    if(!itm.newAmount.toString().match(/^[0-9]{1,9}([.][0-9]{0,2})?$/)){
      itm.errores.amount = 'Ingrese un monto válido';
    }

    var lenghted = new Date(itm.newDate).toDateString().length;
    var newdate = parseInt(new Date(itm.newDate).toDateString().substr(lenghted-4, lenghted));

    if (newdate <  2000 || newdate >  2050 ) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    if (itm.newDate == null) {
      itm.errores.date = 'Ingrese una fecha válida';
    }

    for (var s in itm.errores) {
      if (itm.errores[s])
        return;
    }

    Swal.fire({
      title: '¿Deseas Actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, ACTUALIZAR!',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup
    }).then((result) => {
      if (result.value) {
        const payment = {
          date: itm.newDate,
          channel: itm.newChannel,
          amount: parseFloat(itm.newAmount.toString())
        };
        let response = itm.id ?
          this.transaction.editPayment(this.debtId, itm.id, payment) :
          this.transaction.addPayment(this.debtId, payment);
        response.subscribe(r => {
          if (r.success) {
            if (itm.id) {
              this.gaService.sendEvent('EditaPago', {
                'event_category': 'Dashboard',
                'event_label': 'edita_pago'
              });
            }
            else {
              this.gaService.sendEvent('AgregaPago', {
                'event_category': 'Dashboard',
                'event_label': 'agrega_pago'
              });
            }
            this.statusChange.emit(r.status);
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
              }
            });
          }
          else {
            Swal.fire({
              titleText: 'ERROR',
              text: r.message,
              showCloseButton: true,
              showCancelButton: false,
              onOpen: drawPopup
            });
          }
        });
      }
    });
  }

  cancelItm(itm) {
    if (itm.id === undefined) {
      this.items.pop();
    }
    else {
      itm.editing = false;
    }
  }

  addItm() {
    //if (this.items[this.items.length-1] && this.items[this.items.length-1].id) {
      this.items.push({ currency: this.currency, newAmount: 0, newDate: new Date(), newChannel: 'Efectivo', canEdit: true, editing: true, errores: {} });
    //}
  }

  delItm(itm) {
    Swal.fire({
      title: "¿Esta Seguro de Eliminar el Pago? ",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'SI, BORRALO',
      cancelButtonText: 'CERRAR',
      onOpen: drawPopup
    }).then((result) => {
      if (result.value) {
        this.transaction.deletePayment(this.debtId, itm.id)
          .subscribe(r => {
            if (r.success) {
              this.gaService.sendEvent('EliminarPagos', {
                'event_category': 'Dashboard',
                'event_label': 'eliminar_pagos'
              });
              this.statusChange.emit(r.status);
              this.loadData();
            }
            else {
              Swal.fire({
                titleText: 'ERROR',
                text: r.message,
                showCloseButton: true,
                showCancelButton: false,
                onOpen: drawPopup
              });
            }
          });
      }
    });
  }

  AmountBlur(itm) {
    let initalValue = parseFloat(itm.newAmount);
    if(!isNaN(initalValue))
      itm.newAmount = initalValue.toFixed(2);
  }
}
