import {
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { propOr } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

import { dataTypeOptions } from '../../constants/services';
import { type IServiceRemoteModelForms } from '../../models';

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
  messageStatus = '';
  updateEditable = false;
  pendingUserReview: boolean;
  pendingGtpReview: boolean;
  hasWarnings: boolean;
  messagesOptions = {
    pendingUserReview: {
      color: 'tw-bg-extended-watermelon-1',
      text: 'Debes revisar este servicio',
    },
    notPendingUserReview: {
      color: 'tw-bg-extended-orange-1',
      text: 'Servicio actualizado',
    },
    pendingGtpReview: {
      color: 'tw-bg-extended-orange-1',
      text: 'Pendiente de revisión',
    },
    pendingUserFix: {
      color: 'tw-bg-extended-watermelon-1',
      text: 'Debes revisar este servicio',
    },
  };

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
    this.name = this.serviceData?.name;
    this.debtorCode = this.serviceData?.debtorCode;
    if (this.lockedMode) {
      this.updateEditable = this.serviceData?.inReview;
      if (isNilOrEmpty(this.serviceData?.name)) {
        this.name = this.serviceData?.newName;
      }
      if (isNilOrEmpty(this.serviceData?.debtorCode)) {
        this.debtorCode = this.serviceData?.newNameCode;
      }
    }
  }

  setStatusCard() {
    this.messageStatus = '';
    this.pendingUserReview = false;
    this.pendingGtpReview = false;
    const {
      newNameCodeGTPStatus,
      newNameGTPStatus,
      name: nameService,
      debtorCode,
      newNameCode,
      newName,
      inReview,
    } = this.serviceData;

    if (this.reviewMode) {
      this.messageStatus = 'notPendingUserReview';
      if (newNameGTPStatus === 3 && nameService === newName) {
        this.pendingUserReview = true;
        this.messageStatus = 'pendingUserReview';
      }
      if (newNameCodeGTPStatus === 3 && debtorCode === newNameCode) {
        this.pendingUserReview = true;
        this.messageStatus = 'pendingUserReview';
      }
    }
    if (this.lockedMode) {
      if (newNameGTPStatus === 3 || newNameCodeGTPStatus === 3) {
        this.pendingUserReview = true;
        this.messageStatus = 'pendingUserFix';
      } else if (
        newNameGTPStatus === 0 ||
        newNameCodeGTPStatus === 0 ||
        newNameGTPStatus === 2 ||
        newNameCodeGTPStatus === 2
      ) {
        this.pendingGtpReview = true;
        this.messageStatus = 'pendingGtpReview';
      }
    }
    this.hasWarnings =
      inReview || this.pendingUserReview || this.pendingGtpReview;
  }

  setDataType() {
    this.dataType =
      dataTypeOptions.find(({ value }) => value === this.serviceData?.dataType)
        ?.label || '';
  }

  setPaymentChannels() {
    const channels = [
      { key: 'useAppWeb', label: 'Digital' },
      { key: 'useAgent', label: 'Agentes' },
    ];
    this.paymentChannels = channels
      .filter(({ key }) => propOr('', key, this.serviceData))
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
