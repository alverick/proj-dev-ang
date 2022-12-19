import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { isNilOrEmpty } from 'ramda-adjunct';
import { dataTypeOptions } from '../../constants/services';
import { IServiceRemoteModelForms } from '../../models';

@Component({
  selector: 'cs-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit, OnChanges {
  @Input() serviceData: Partial<IServiceRemoteModelForms>;
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
  pendingReview: boolean;

  ngOnInit() {
    this.setPaymentChannels();
    this.setDataType();
    this.isInReview();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.serviceData) {
      this.setStatusCard();
    }
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

  setStatusCard() {
    this.pendingReview = false;
    const {
      newNameCodeGTPStatus,
      newNameGTPStatus,
      name: nameService,
      debtorCode,
      newNameCode,
      newName,
    } = this.serviceData;
    if (newNameGTPStatus === 3 && nameService === newName) {
      this.pendingReview = true;
    }
    if (newNameCodeGTPStatus === 3 && debtorCode === newNameCode) {
      this.pendingReview = true;
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
