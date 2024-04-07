import { logger, names, readProjectConfiguration, Tree } from '@nx/devkit';

import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

import { assertValidStyle } from '../../../utilities/assertion';
import { NormalizedSchema, ComponentGeneratorSchema } from '../schema';

export async function normalizeOptions(tree: Tree, options: ComponentGeneratorSchema): Promise<NormalizedSchema> {
  assertValidStyle(options.style);

  const {
    artifactName: name,
    directory,
    fileName,
    filePath,
    project: projectName,
  } = await determineArtifactNameAndDirectoryOptions(tree, {
    artifactType: 'component',
    callingGenerator: '@mithho/astro:component',
    name: options.name,
    directory: options.directory,
    derivedDirectory: options.derivedDirectory ?? options.directory,
    nameAndDirectoryFormat: options.nameAndDirectoryFormat,
    project: options.project,
    fileExtension: 'tsx',
    fileName: options.fileName,
  });

  const project = readProjectConfiguration(tree, projectName);

  const { className } = names(name);

  const { sourceRoot: projectSourceRoot, root: projectRoot, projectType } = project;

  const styledModule = /^(css|scss|less|none)$/.test(options.style) ? null : options.style;

  if (options.export && projectType === 'application') {
    logger.warn(`The "--export" option should not be used with applications and will do nothing.`);
  }

  options.globalCss = options.globalCss ?? false;
  // options.inSourceTests = options.inSourceTests ?? false;

  return {
    ...options,
    projectName,
    directory,
    styledModule,
    hasStyles: options.style !== 'none',
    className,
    fileName,
    filePath,
    projectSourceRoot: projectSourceRoot ?? projectRoot,
    integrations: options.integrations,
  };
}
