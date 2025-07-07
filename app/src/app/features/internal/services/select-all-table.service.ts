import { Injectable } from '@angular/core';
import { Table, TableHeaderCheckbox } from 'primeng/table';

import { type Debts } from '../../../shared/models/debts';

@Injectable()
export class SelectAllTableService {
  overridePrimeNGTableMethods() {
    TableHeaderCheckbox.prototype.updateCheckedState = function () {
      if (this.dt.filteredValue) {
        const val = this.dt.filteredValue;
        return (
          val &&
          val.length > 0 &&
          this.dt.selection &&
          this.dt.selection.length > 0 &&
          this.isAllFilteredValuesChecked()
        );
      } else {
        const val: Partial<Debts>[] = this.dt.value as Partial<Debts>[];
        const enabledRows = (this.dt.value as Partial<Debts>[]).filter(
          (rowData) =>
            rowData.status !== 'PAGADO' &&
            (rowData.totalAmount === 0 || !rowData.hasIBKPayments),
        );
        return (
          val &&
          val.length > 0 &&
          this.dt.selection &&
          this.dt.selection.length > 0 &&
          this.dt.selection.length === enabledRows.length
        );
      }
    };
    Table.prototype.toggleRowsWithCheckbox = function (event, check) {
      if (check) {
        this._selection = this.filteredValue?.slice() ?? this.value.slice();
      } else {
        this._selection = [];
      }

      this._selection = check
        ? this._selection.filter(
            (rowData) =>
              rowData.status !== 'PAGADO' &&
              (rowData.totalAmount === 0 || !rowData.hasIBKPayments),
          )
        : [];
      this.preventSelectionSetterPropagation = true;
      this.updateSelectionKeys();
      this.selectionChange.emit(this._selection);
      this.tableService.onSelectionChange();
      this.onHeaderCheckboxToggle.emit({
        originalEvent: event,
        checked: check,
      });

      if (this.isStateful()) {
        this.saveState();
      }
    };
  }
}
