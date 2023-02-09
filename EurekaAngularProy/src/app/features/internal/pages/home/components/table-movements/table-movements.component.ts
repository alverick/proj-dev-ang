import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { clone, forEachObjIndexed, isEmpty, pathEq } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

import { SelectAllTableService } from '../../../../services';

enum StatusRowType {
  dueDate,
  nilDueDate,
}

enum DataStatus {
  PENDIENTE,
  VENCIDO,
  PARCIAL,
  PAGADO,
}

interface IStatusRow {
  color: string;
  canEdit: boolean;
  text: string;
}

@Component({
  selector: 'cs-table-movements',
  templateUrl: './table-movements.component.html',
  styleUrls: ['./table-movements.component.scss'],
})
export class TableMovementsComponent implements OnInit, OnChanges {
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
  @Input() totalRecords: number;
  @Input() sortField = '';
  @Output() sortFieldChange = new EventEmitter<string>();
  @Output() selectedChange = new EventEmitter<any>();
  @Output() showDetails = new EventEmitter<any>();
  @Output() saveRow = new EventEmitter<any>();
  @Output() loadData = new EventEmitter<LazyLoadEvent>();
  selectedRows = [];
  displayDialog = false;
  editRowData: any = {};
  dataSet = {};
  es = {
    firstDayOfWeek: 1,
    dayNames: [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    monthNamesShort: [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ],
    today: 'Hoy',
    clear: 'Borrar',
  };
  @ViewChild('table', { static: false }) table: Table;

  constructor(
    private logger: NGXLogger,
    private selectAllTable: SelectAllTableService
  ) {}

  ngOnInit() {
    this.selectAllTable.overridePrimeNGTableMethods();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (pathEq(['sortField', 'currentValue'], '', changes)) {
      this.table.sortOrder = 0;
      this.table.sortField = '';
      this.table.reset();
    }
  }

  actionShowDetails(data) {
    this.showDetails.emit(data);
  }
  setStatusRow({ status, dueDate, svcStatus, hasIBKPayments }): IStatusRow {
    const statusData: {
      [key in keyof typeof DataStatus]: {
        [keyChild in keyof typeof StatusRowType]: IStatusRow;
      };
    } = {
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

    const isEditable = svcStatus !== 1 && status !== 'PAGADO';
    const isEditableRow =
      (dueDate === null && !hasIBKPayments) ||
      dueDate !== null ||
      hasIBKPayments;

    return {
      ...statusData[status][isNilOrEmpty(dueDate) ? 'nilDueDate' : 'dueDate'],
      canEdit: isEditable && isEditableRow,
    };
  }
  onRowSelect() {
    this.selectedChange.emit(this.selectedRows);
  }

  onRowEditInit(data: any) {
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

  openDialog(data: any) {
    this.displayDialog = true;
    this.dataSet[data.id] = { ...data };
    this.editRowData = clone(data);
  }

  onSave() {
    this.displayDialog = false;
    const changed = {};
    forEachObjIndexed((val, key) => {
      if (this.dataSet[this.editRowData.id][key] !== val) {
        changed[key] = val;
      }
    }, this.editRowData);
    delete this.dataSet[this.editRowData.id];
    if (!isEmpty(changed)) {
      this.saveRow.emit({
        emissionDate: this.editRowData.emissionDate,
        dueDate: this.editRowData.dueDate,
        concept: this.editRowData.concept,
        amount: this.editRowData.amount,
        firstName: this.editRowData.firstName,
        newStatus: '1',
        id: this.editRowData.id,
      });
    }
  }

  onCancel() {
    this.displayDialog = false;
  }

  loadDataLazy(event: LazyLoadEvent) {
    this.loadData.emit(event);
    this.sortField = event.sortField || '';
    this.sortFieldChange.emit(event.sortField || '');
  }
}
