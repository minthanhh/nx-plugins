import { Tree, readJson } from '@nx/devkit';

export function filterUpdateDependencies(tree: Tree, packageJsonPath: string = 'package.json') {
  const currentPackageJson = readJson(tree, packageJsonPath);

  let filteredDependencies = filterAstroIntegrationDependencies(currentPackageJson.dependencies);

  if (Object.keys(filteredDependencies).length) return;
}

function filterAstroIntegrationDependencies(dependencies: Record<string, string>) {
  return Object.keys(dependencies ?? {})
    .filter((d) => d.includes('@astrojs'))
    .reduce((acc, d) => ({ ...acc, [d]: dependencies[d] }), {});
}

function filterExistingDependencies(dependencies: Record<string, string>, existingAltDependencies: Record<string, string>) {
  if (!existingAltDependencies) {
    return dependencies;
  }

  return Object.keys(dependencies ?? {})
    .filter((d) => !existingAltDependencies[d])
    .reduce((acc, d) => ({ ...acc, [d]: dependencies[d] }), {});
}
