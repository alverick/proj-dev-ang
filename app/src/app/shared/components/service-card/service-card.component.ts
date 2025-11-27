import { NgClass } from '@angular/common';
import {
  Component,
  input,
  type OnChanges,
  type OnInit,
  output,
  type SimpleChanges,
} from '@angular/core';
import { propOr } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';

import { dataTypeOptions } from '../../constants/services';
import { type IServiceRemoteModelForms } from '../../models';
import { NotEmptyPipe } from '../../pipes/not-empty.pipe';

@Component({
  selector: 'cs-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
  imports: [NgClass, NotEmptyPipe],
})
export class ServiceCardComponent implements OnInit, OnChanges {
  readonly serviceData = input<Partial<IServiceRemoteModelForms>>(undefined);
  readonly position = input<number>(undefined);
  readonly canEdit = input(true);
  readonly reviewMode = input(false);
  readonly lockedMode = input(false);
  readonly edit = output<number>();
  readonly delete = output<number>();
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
    const serviceData = this.serviceData();
    this.name = serviceData?.name;
    this.debtorCode = serviceData?.debtorCode;
    if (this.lockedMode()) {
      this.updateEditable = serviceData?.inReview;
      if (isNilOrEmpty(serviceData?.name)) {
        this.name = serviceData?.newName;
      }
      if (isNilOrEmpty(serviceData?.debtorCode)) {
        this.debtorCode = serviceData?.newNameCode;
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
    } = this.serviceData();

    if (this.reviewMode()) {
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
    if (this.lockedMode()) {
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
      dataTypeOptions.find(
        ({ value }) => value === this.serviceData()?.dataType,
      )?.label || '';
  }

  setPaymentChannels() {
    const channels = [
      { key: 'useAppWeb', label: 'Digital' },
      { key: 'useAgent', label: 'Agentes' },
    ];
    this.paymentChannels = channels
      .filter(({ key }) => propOr('', key, this.serviceData()))
      .map(({ label }) => label)
      .join(', ');
  }

  actionEdit() {
    this.edit.emit(this.position());
  }

  actionDelete() {
    this.delete.emit(this.position());
  }
}
