import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';
// import type { Linter } from '@nx/eslint';
import type { SupportedIntegrations, SupportedStyles } from '../../../typings/style';

export interface Schema {
  name: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  tags?: string;
  unitTestRunner?: 'jest' | 'vitest' | 'none';
  e2eTestRunner?: 'cypress' | 'playwright' | 'none';
  linter?: Linter;
  js?: boolean;
  setParserOptionsProject?: boolean;
  skipPackageJson?: boolean;
  rootProject?: boolean;
  addPlugin?: boolean;
  reactComponent: boolean;
  integrations?: SupportedIntegrations[];
}

export interface NormalizedSchema extends Schema {
  projectName?: string;
  appProjectRoot: string;
  outputPath: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  parsedTags: string[];
  styledModule: null | string;
  js?: boolean;
}
