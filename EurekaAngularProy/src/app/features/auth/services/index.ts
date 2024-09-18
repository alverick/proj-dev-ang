import { LoginService } from '../../../shared/services/login.service';
import { NotifyService } from '../../../shared/services/notify.service';
import { AffiliationService } from './affiliation.service';
import { AffiliationFormsService } from './affiliation-forms.service';

export const SERVICES = [
  AffiliationService,
  AffiliationFormsService,
  LoginService,
  NotifyService,
];

export { AffiliationFormsService } from './affiliation-forms.service';
export { AffiliationService } from './affiliation.service';
