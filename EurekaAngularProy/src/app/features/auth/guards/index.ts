import { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
import { AffiliationExitGuard } from './affiliation-exit.guard';
import { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
import { AffiliationRucGuard } from './affiliation-ruc.guard';
import { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';

export const GUARDS = [
  AffiliationCompanyIdGuard,
  AffiliationExitGuard,
  AffiliationResumeExitGuard,
  AffiliationRucGuard,
  AffiliationServiceValidGuard,
];

export { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
export { AffiliationExitGuard } from './affiliation-exit.guard';
export { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
export { AffiliationRucGuard } from './affiliation-ruc.guard';
export { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';
