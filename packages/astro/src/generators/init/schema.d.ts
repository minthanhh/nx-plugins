import { SupportedIntegrations } from '../../../typings/style';

export interface InitSchema {
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  keepExistingVersions?: boolean;
  updatePackageScripts?: boolean;
  addPlugin?: boolean;
  integrations?: SupportedIntegrations[] | SupportedIntegrations;
}
