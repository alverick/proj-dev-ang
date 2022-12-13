import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNilOrEmpty } from 'ramda-adjunct';
import { dataTypeOptions } from '../../constants/services';
import { IServiceRemoteModel } from '../../models';

@Component({
  selector: 'cs-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit {
  @Input() serviceData: IServiceRemoteModel;
  @Input() position: number;
  @Input() canEdit = true;
  @Input() reviewMode = false;
  @Input() lockedMode = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  paymentChannels = '';
  dataType = '';
  name = '';
  debtorCode = '';
  updateEditable = false;

  ngOnInit() {
    this.setPaymentChannels();
    this.setDataType();
    this.isInReview();
  }

  isInReview() {
    this.name = this.serviceData.name;
    this.debtorCode = this.serviceData.debtorCode;
    if (this.lockedMode) {
      this.updateEditable = this.serviceData.inReview;
      if (isNilOrEmpty(this.serviceData.name)) {
        this.name = this.serviceData.newName;
      }
      if (isNilOrEmpty(this.serviceData.debtorCode)) {
        this.debtorCode = this.serviceData.newNameCode;
      }
    }
  }

  setDataType() {
    this.dataType =
      dataTypeOptions.find(({ value }) => value === this.serviceData.dataType)
        .label || '';
  }

  setPaymentChannels() {
    const channels = [
      { key: 'useAppWeb', label: 'Digital' },
      { key: 'useAgent', label: 'Agentes' },
    ];
    this.paymentChannels = channels
      .filter(({ key }) => this.serviceData[key])
      .map(({ label }) => label)
      .join(', ');
  }

  actionEdit() {
    this.edit.emit(this.position);
  }
  actionDelete() {
    this.delete.emit(this.position);
  }
}
