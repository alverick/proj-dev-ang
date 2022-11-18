import { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
import { AffiliationExitGuard } from './affiliation-exit.guard';
import { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
import { AffiliationRucGuard } from './affiliation-ruc.guard';
import { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';
import { AffiliationUpdateCompanyGuard } from './affiliation-update-company.guard.service';

export const GUARDS = [
  AffiliationCompanyIdGuard,
  AffiliationExitGuard,
  AffiliationResumeExitGuard,
  AffiliationRucGuard,
  AffiliationServiceValidGuard,
  AffiliationUpdateCompanyGuard,
];

export { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
export { AffiliationExitGuard } from './affiliation-exit.guard';
export { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
export { AffiliationRucGuard } from './affiliation-ruc.guard';
export { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';
export { AffiliationUpdateCompanyGuard } from './affiliation-update-company.guard.service';
