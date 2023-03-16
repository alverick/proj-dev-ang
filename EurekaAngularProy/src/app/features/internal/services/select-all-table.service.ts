import { Injectable } from '@angular/core';
import { Table, TableHeaderCheckbox } from 'primeng/table';

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
        const val = this.dt.value;
        const enabledRows = this.dt.value.filter(
          (rowData) =>
            rowData.status !== 'PAGADO' &&
            (rowData.totalAmount === 0 || !rowData.hasIBKPayments)
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
      this._selection = check
        ? this.filteredValue
          ? this.filteredValue.slice()
          : this.value.slice()
        : [];
      this._selection = check
        ? this._selection.filter(
            (rowData) =>
              rowData.status !== 'PAGADO' &&
              (rowData.totalAmount === 0 || !rowData.hasIBKPayments)
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
