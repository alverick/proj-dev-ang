import {
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { NGXLogger } from 'ngx-logger';
import { type LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { clone, forEachObjIndexed, has, isEmpty, pathEq } from 'ramda';
import { isNilOrEmpty, isNotNil } from 'ramda-adjunct';

import { type CurrencyWithLimit } from '../../../../../../shared/constants/currencies';
import { ServiceTypes } from '../../../../../../shared/constants/services';
import { type ServiceTypeType } from '../../../../../../shared/models';
import { type Debts } from '../../../../../../shared/models/debts';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../../../shared/services/tracking.service';
import { companyFeature } from '../../../../../../store/reducers/company.reducer';
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

type TableCol = {
  field: string;
  header: string;
  editable: boolean;
  serviceType: ServiceTypeType[];
  checkEditableField: string;
};

@Component({
  selector: 'cs-table-movements',
  templateUrl: './table-movements.component.html',
  styleUrls: ['./table-movements.component.scss'],
})
export class TableMovementsComponent implements OnInit, OnChanges {
  cols: Partial<TableCol>[] = [
    {
      field: 'firstName',
      header: 'Cliente',
      editable: true,
      serviceType: [
        ServiceTypes.complete,
        ServiceTypes.partial,
        ServiceTypes.withoutData,
      ],
      checkEditableField: 'canEditFirstName',
    },
    { field: 'service', header: 'Servicio' },
    { field: 'concept', header: 'Descripción' },
    {
      field: 'emissionDate',
      header: 'F. emisión',
      serviceType: [
        ServiceTypes.complete,
        ServiceTypes.partial,
        ServiceTypes.withoutData,
      ],
      editable: true,
      checkEditableField: 'canEditEmissionDate',
    },
    {
      field: 'dueDate',
      header: 'F. vcto.',
      serviceType: [ServiceTypes.complete],
      editable: true,
      checkEditableField: 'canEditDueDate',
    },
    {
      field: 'totalAmount',
      header: 'Total',
      serviceType: [ServiceTypes.complete],
      editable: true,
      checkEditableField: 'canEditAmount',
    },
    { field: 'totalAmountPayed', header: 'Monto pagado' },
    { field: 'status', header: 'Estado' },
  ];
  @Input() data: Partial<Debts>[] = [];
  @Input() totalRecords: number;
  @Input() sortField = '';
  @Input() selectedRows: Debts[] = [];
  @Input() maxAmountLimits: CurrencyWithLimit[] = [];
  @Output() sortFieldChange = new EventEmitter<string>();
  @Output() selectedRowsChange = new EventEmitter<Debts[]>();
  @Output() showDetails = new EventEmitter<any>();
  @Output() saveRow = new EventEmitter<any>();
  @Output() loadData = new EventEmitter<LazyLoadEvent>();
  displayDialog = false;
  willCloseModal = false;
  useAmountLimits = false;
  editRowData: any = {};
  dataSet = {};
  selectedAll = false;
  @ViewChild('table') table: Table;

  constructor(
    private logger: NGXLogger,
    private selectAllTable: SelectAllTableService,
    private tracking: TrackingService,
    private store: Store
  ) {}

  ngOnInit() {
    this.selectAllTable.overridePrimeNGTableMethods();
    this.store
      .select(companyFeature.selectUseAmountLimits)
      .subscribe((useLimits) => {
        this.useAmountLimits = useLimits;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.table) {
      if (
        pathEq('', ['sortField', 'currentValue'], changes) ||
        has('totalRecords', changes)
      ) {
        this.table.sortOrder = 0;
        this.table.sortField = '';
        this.table.reset();
      }
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
  onRowSelect(evt) {
    if (has('checked', evt)) {
      this.selectedAll = evt.checked as boolean;
    }
    this.selectedRowsChange.emit(this.selectedRows);
    console.log(this.selectedRows);
  }

  updateSelected(rowData: Debts) {
    if (!this.selectedAll) {
      return;
    }
    if (
      rowData.status != 'PAGADO' &&
      (rowData.totalAmount === 0 || !rowData.hasIBKPayments)
    ) {
      this.selectedRows = [...this.selectedRows, rowData];
    } else {
      this.selectedRows = this.selectedRows.filter(
        (item) => item.id !== rowData.id
      );
    }
    this.selectedRowsChange.emit(this.selectedRows);
  }

  onRowEditInit(data: any) {
    this.dataSet[data.id] = { ...data };
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Editar movimiento',
      label: 'Editar',
      typeElement: 'Botón',
      location: 'Movimientos',
    });
  }

  onRowEditSave(data: any) {
    if (!this.validateRow(data)) {
      return;
    }

    const changed = {};

    forEachObjIndexed((val, key) => {
      if (this.dataSet[data.id][key] !== val) {
        changed[key] = val;
      }
    }, data);

    delete this.dataSet[data.id];
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
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Cancelar edición de movimientos seleccionado',
      label: 'Cancelar',
      typeElement: 'Link',
      location: 'Movimientos',
    });
  }

  openDialog(data: any) {
    this.displayDialog = true;
    this.willCloseModal = false;
    this.dataSet[data.id] = { ...data };
    this.editRowData = clone(data);
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: 'Editar movimiento móvil',
      label: 'Editar',
      typeElement: 'Botón',
      location: 'Movimientos',
    });
  }

  onSave() {
    if (!this.validateRow(this.editRowData)) {
      return;
    }
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

  onCancel(text: string) {
    if (this.willCloseModal) {
      this.willCloseModal = false;
      return;
    }
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Home movimientos',
      action: 'Click',
      detail: `${text} editar movimiento móvil`,
      label: text,
      typeElement: 'Botón',
      location: 'Movimientos',
    });
    if (text === 'Cancelar') {
      this.willCloseModal = true;
    }
    this.displayDialog = false;
  }

  getLimit(currencySel: string) {
    return this.maxAmountLimits.find(
      (currency) => currency.symbol === currencySel
    )?.limitMax;
  }

  loadDataLazy(event: LazyLoadEvent) {
    this.loadData.emit(event);
    this.sortField = event.sortField || '';
    this.sortFieldChange.emit(event.sortField || '');
  }

  validateRow(data) {
    const fields = this.cols.filter(
      (field) =>
        isNotNil(field.checkEditableField) &&
        field.serviceType.includes(data.serviceType)
    );

    for (const field of fields) {
      if (
        field.checkEditableField === 'canEditAmount' &&
        this.useAmountLimits &&
        data.amount > this.getLimit(data.currency)
      ) {
        return false;
      }
      if (isNilOrEmpty(data[field.field])) {
        return false;
      }
    }
    return true;
  }
}
