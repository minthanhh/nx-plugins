import { SupportedIntegrations } from 'packages/astro/typings/style';

export interface Schema {
  directory: string;
  project: string;
  skipFormat?: boolean;
  integrations: SupportedIntegrations | SupportedIntegrations[];
  name: string;
  nameAndDirectoryFormat?: 'as-provided' | 'derived';
  derivedDirectory?: string;
}

export interface NormalizedSchema extends Schema {
  projectSourceRoot: string;
  projectName: string;
  filePath: string;
  projectType: string;
}
