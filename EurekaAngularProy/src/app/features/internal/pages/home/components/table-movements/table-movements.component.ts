import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { forEachObjIndexed, isEmpty, isNil } from 'ramda';
import { SelectAllTableService } from '../../../../services';

@Component({
  selector: 'cs-table-movements',
  templateUrl: './table-movements.component.html',
  styleUrls: ['./table-movements.component.scss'],
})
export class TableMovementsComponent implements OnInit {
  cols = [
    {
      field: 'firstName',
      header: 'Cliente',
      editable: true,
      checkEditableField: 'canEditFirstName',
    },
    { field: 'service', header: 'Servicio' },
    { field: 'concept', header: 'Descripción' },
    {
      field: 'emissionDate',
      header: 'F. emisión',
      editable: true,
      checkEditableField: 'canEditEmissionDate',
    },
    {
      field: 'dueDate',
      header: 'F. vcto.',
      editable: true,
      checkEditableField: 'canEditDueDate',
    },
    {
      field: 'totalAmount',
      header: 'Total',
      editable: true,
      checkEditableField: 'canEditAmount',
    },
    { field: 'totalAmountPayed', header: 'Monto pagado' },
    { field: 'status', header: 'Estado' },
  ];
  @Input() data = [];
  selectedRows = [];
  @Output() selectedChange = new EventEmitter<any>();
  @Output() showDetails = new EventEmitter<any>();
  @Output() saveRow = new EventEmitter<any>();
  dataSet = {};

  constructor(
    private logger: NGXLogger,
    private selectAllTable: SelectAllTableService
  ) {}

  ngOnInit() {
    this.selectAllTable.overridePrimeNGTableMethods();
  }

  actionShowDetails(data) {
    this.showDetails.emit(data);
  }
  setStatusRow({ status, dueDate }) {
    const statusData = {
      PAGADO: {
        dueDate: {
          text: 'Pagado',
          canEdit: false,
          color: 'tw-text-primary-green-1',
        },
        nilDueDate: {
          text: 'Deshabilitado',
          canEdit: false,
          color: 'tw-text-extended-grey-3',
        },
      },
      VENCIDO: {
        dueDate: {
          text: 'Vencido',
          canEdit: true,
          color: 'tw-text-extended-watermelon-1',
        },
        nilDueDate: {
          text: 'Vencido',
          canEdit: true,
          color: 'tw-text-extended-watermelon-1',
        },
      },
      PARCIAL: {
        dueDate: {
          text: 'Parcial',
          canEdit: true,
          color: 'tw-text-extended-yellow-1',
        },
        nilDueDate: {
          text: 'Habilitado',
          canEdit: true,
          color: 'tw-text-primary-green-1',
        },
      },
      PENDIENTE: {
        dueDate: {
          text: 'Pendiente',
          canEdit: true,
          color: 'tw-text-extended-grey-3',
        },
        nilDueDate: {
          text: 'Habilitado',
          canEdit: true,
          color: 'tw-text-primary-green-1',
        },
      },
    };
    // this.logger.debug('-> { status, dueDate }', status, dueDate);
    let result = '';
    switch (status) {
      case 'PAGADO':
        result = isNil(dueDate) ? ' Deshabilitado' : 'Pagado';
        break;
      case 'VENCIDO':
        result = 'Vencido';
        break;
      case 'PARCIAL':
        result = isNil(dueDate) ? 'Habilitado' : 'Parcial';
        break;
      case 'PENDIENTE':
        result = isNil(dueDate) ? 'Habilitado' : 'Pendiente';
        break;
    }

    return statusData[status][isNil(dueDate) ? 'nilDueDate' : 'dueDate'];
  }
  onRowSelect() {
    this.selectedChange.emit(this.selectedRows);
  }

  onRowEditInit(data: any) {
    console.log(data, this.data[0]);
    this.dataSet[data.id] = { ...data };
  }

  onRowEditSave(data: any) {
    const changed = {};
    forEachObjIndexed((val, key) => {
      if (this.dataSet[data.id][key] !== val) {
        changed[key] = val;
      }
    }, data);
    delete this.dataSet[data.id];
    console.log(data, this.data[0], changed);
    if (!isEmpty(changed)) {
      this.saveRow.emit({
        emissionDate: data.emissionDate,
        dueDate: data.dueDate,
        concept: data.concept,
        amount: data.amount,
        firstName: data.firstName,
        newStatus: '1',
        id: data.id,
      });
    }
  }

  onRowEditCancel(data: any, pos) {
    this.data[pos] = this.dataSet[data.id];
    delete this.dataSet[data.id];
  }
}
