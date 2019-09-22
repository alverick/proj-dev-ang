import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";
import { TransactionService } from "src/app/shared/services/transaction.service";

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

  @Input() debtId: number;
  @Input() status: string;
  @Output() statusChange = new EventEmitter<string>();

  constructor(private transaction: TransactionService) { }

  ngOnInit(): void {
    this.loadData();
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

  public toggle() {
    this.showed = !this.showed;
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
      confirmButtonText:  'Cerrar',
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
      this.mensaje( 'error', 'Error en el monto','Ingrese un Monto');
      return;
    }
    if(itm.newAmount.toString().length < 1){
      this.mensaje( 'error', 'Error en el monto','Ingrese un Monto correcto');
      return;
    }
    if(parseInt(itm.newAmount.toString()) < 1){
      this.mensaje( 'error', 'Error en el monto','Ingrese un Monto correcto');
      return;
    }

    if(!itm.newAmount.toString().match(/^[0-9]{1,9}([.][0-9]{0,2})?$/)){
      this.mensaje( 'error', 'Error en el monto','Ingrese un monto válido mínimo de 1 y máximo de 9 caracteres enteros y 2 decimales como máximo');
      return;
    }

    var lenghted = new Date(itm.newDate).toDateString().length;
    var newdate = parseInt(new Date(itm.newDate).toDateString().substr(lenghted-4, lenghted));

    if (newdate <  2000 || newdate >  2050 ) {
      this.mensaje( 'error', 'Error en la fecha','Ingrese una fecha válida para la fecha de pago');
      return;
    }

    if(itm.newChannel.length <  3) {
      this.mensaje( 'error', 'Error en el Medio','El medio tiene que tener como minimo 3 digitos');
      return;
    }

    if(itm.newChannel === null || itm.newChannel === ""){
      this.mensaje( 'error', 'Error en el Concepto','Ingrese el medio');
      return;
    }
    if (itm.newDate == null) {
      this.mensaje( 'error', 'Error en la fecha','Ingrese la fecha de pago');
      return;
    }

    Swal.fire({
      title: '¿Deseas Actualizar?',
      text: '¡No podrás revertir esto!',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Si, Actualizar!',
      cancelButtonText: 'Cerrar',
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
    this.items.push({ newAmount: 0, newDate: new Date(), newChannel: 'Efectivo', canEdit: true, editing: true });
  }

  delItm(itm) {
    Swal.fire({
      title: "¿Esta Seguro de Eliminar el Pago? ",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Si, Borralo',
      cancelButtonText: 'Cerrar',
      onOpen: drawPopup
    }).then((result) => {
      if (result.value) {
        this.transaction.deletePayment(this.debtId, itm.id)
          .subscribe(r => {
            if (r.success) {
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
