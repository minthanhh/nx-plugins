import { SupportedIntegrations, SupportedStyles } from '../../../typings/style';

export interface ComponentGeneratorSchema {
  name: string;
  nameAndDirectoryFormat?: 'as-provided' | 'derived';
  project?: string;
  style?: SupportedStyles;
  directory?: string;
  export?: boolean;
  js?: boolean;
  globalCss?: boolean;
  fileName?: string;
  skipFormat?: boolean;
  derivedDirectory?: string;
  integrations: SupportedIntegrations[] | SupportedIntegrations;
}

export interface NormalizedSchema extends ComponentGeneratorSchema {
  projectSourceRoot: string;
  projectName: string;
  filePath: string;
  fileName: string;
  className: string;
  styledModule: null | string;
  hasStyles: boolean;
}
