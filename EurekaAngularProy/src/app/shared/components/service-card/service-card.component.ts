import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { dataTypeOptions } from '../../../features/auth/constants';
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
  @Input() update = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  paymentChannels = '';
  dataType = '';
  name = '';
  updateEditable = false;
  pendingReview: boolean;

  ngOnInit() {
    this.setPaymentChannels();
    this.setDataType();
    this.isEditable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.serviceData) {
      this.setStatusCard();
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

  isEditable() {
    if (this.update) {
      this.updateEditable = this.serviceData.inReview;
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
