import { Tree, generateFiles, offsetFromRoot, names } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createApplicationFiles(tree: Tree, options: NormalizedSchema) {
  const integrations = [...options.integrations].map((i) => capitalizeFirstLetter(i.split('-')[0]));

  const templateVariables = {
    ...names(options.name),
    ...options,
    integrations,
    dot: '.',
    tmpl: '',
    rootPath: 'src/',
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    projectRoot: options.appProjectRoot,
  };

  generateFiles(tree, join(__dirname, '../files/base-astro'), options.appProjectRoot, templateVariables);

  if (options.integrations.length) {
    for (const integration of options.integrations) {
      const [srcFolderComponent, directoryTargetComponent] = pathGenerator({
        projectRoot: options.appProjectRoot,
        generateName: 'components',
        integration,
      });

      const [srcFolderAsset, directoryTargetAsset] = pathGenerator({
        projectRoot: options.appProjectRoot,
        generateName: 'assets',
        integration,
      });

      generateFiles(tree, srcFolderComponent, directoryTargetComponent, templateVariables);
      generateFiles(tree, srcFolderAsset, directoryTargetAsset, templateVariables);
    }
  }
}

type PathGeneratorType = {
  generateName: 'components' | 'assets';
  projectRoot: string;
  integration: string;
};

function pathGenerator({ generateName, integration, projectRoot }: PathGeneratorType) {
  const pathBase = `../files/base-${generateName}/${integration.split('-')[0]}`;
  const directory = `${projectRoot}/src/${generateName}${generateName === 'assets' ? '' : `/${integration.split('-')[0]}`}`;
  return [join(__dirname, pathBase), directory];
}
