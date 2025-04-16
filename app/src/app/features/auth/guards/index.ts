import { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
import { AffiliationExitGuard } from './affiliation-exit.guard';
import { AffiliationFinishedGuard } from './affiliation-finished.guard';
import { AffiliationLoadGuard } from './affiliation-load.guard';
import { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
import { AffiliationRucGuard } from './affiliation-ruc.guard';
import { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';
import { AffiliationUpdatingGuard } from './affiliation-updating.guard';
import { ValidateTokenGuard } from './validate-token.guard';

export const GUARDS = [
  AffiliationCompanyIdGuard,
  AffiliationExitGuard,
  AffiliationFinishedGuard,
  AffiliationLoadGuard,
  AffiliationResumeExitGuard,
  AffiliationRucGuard,
  AffiliationServiceValidGuard,
  AffiliationUpdatingGuard,
  ValidateTokenGuard,
];

export { AffiliationCompanyIdGuard } from './affiliation-company-id.guard';
export { AffiliationExitGuard } from './affiliation-exit.guard';
export { AffiliationFinishedGuard } from './affiliation-finished.guard';
export { AffiliationLoadGuard } from './affiliation-load.guard';
export { AffiliationResumeExitGuard } from './affiliation-resume-exit.guard';
export { AffiliationRucGuard } from './affiliation-ruc.guard';
export { AffiliationServiceValidGuard } from './affiliation-service-valid.guard';
export { AffiliationUpdatingGuard } from './affiliation-updating.guard';
export { ValidateTokenGuard } from './validate-token.guard';
