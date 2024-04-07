import { Tree, readProjectConfiguration } from '@nx/devkit';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';
import { NormalizedSchema, Schema } from '../schema';

export async function normalizeOptions(tree: Tree, options: Schema, callingGenerator = '@mithho/astro:integration'): Promise<NormalizedSchema> {
  const artifact = await determineArtifactNameAndDirectoryOptions(tree, {
    name: options.name,
    artifactType: 'integration',
    callingGenerator,
    project: options.project,
    directory: options.directory,
    derivedDirectory: options.derivedDirectory ?? options.directory,
    nameAndDirectoryFormat: options.nameAndDirectoryFormat,
  });
  const { directory, filePath, project: projectName } = artifact;
  const { root: projectRoot, sourceRoot: projectSourceRoot, projectType } = readProjectConfiguration(tree, projectName);

  return {
    ...options,
    filePath,
    directory,
    projectName,
    projectType,
    projectSourceRoot: projectSourceRoot ?? projectRoot,
  };
}
