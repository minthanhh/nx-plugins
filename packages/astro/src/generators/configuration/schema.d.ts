import { SupportedIntegrations } from '../../../typings/style';

export interface ConfigurationsGeneratorSchema {
  integrations: SupportedIntegrations[] | SupportedIntegrations;
  projectName: string;
  projectSourceRoot?: string;
  skipFormat?: boolean;
}
