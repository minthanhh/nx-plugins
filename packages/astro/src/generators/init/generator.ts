import { Tree, runTasksInSerial, GeneratorCallback, addDependenciesToPackageJson, removeDependenciesFromPackageJson } from '@nx/devkit';
import * as versions from '../../utilities/versions';
import { InitSchema } from './schema';
import { addPlugin } from '../application/libraries/add-plugin';
import { updatePackageScripts } from '@nx/devkit/src/utils/update-package-scripts';

export function astroInitGenerator(tree: Tree, schema: InitSchema) {
  return astroInitGeneratorInternal(tree, { addPlugin: false, ...schema });
}

function updateDependencies(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];
  let integrationsDependencies = {};

  if (!Array.isArray(schema.integrations)) {
    integrationsDependencies = { ...integrations[schema.integrations] };
  } else {
    for (const integration of schema.integrations) {
      integrationsDependencies = { ...integrationsDependencies, ...integrations[integration] };
    }
  }

  const dependencies = {
    astro: versions.astroVersion,
    '@astrojs/check': versions.astroJsCheckVersion,
    typescript: versions.typescriptVersion,
    ...integrationsDependencies,
  };

  tasks.push(removeDependenciesFromPackageJson(host, ['@mithho/astro'], []));
  tasks.push(addDependenciesToPackageJson(host, dependencies, { '@mithho/astro': versions.nxVersion }, undefined, schema.keepExistingVersions));

  return runTasksInSerial(...tasks);
}

async function astroInitGeneratorInternal(host: Tree, schema: InitSchema) {
  addPlugin(host);

  // addGitIgnoreEntry(host);

  let installTask: GeneratorCallback = () => {};
  if (!schema.skipPackageJson) {
    installTask = updateDependencies(host, schema);
  }

  if (schema.updatePackageScripts) {
    const { createNodes } = await import('../../plugins/plugin');
    await updatePackageScripts(host, createNodes);
  }

  return installTask;
}

const integrations = {
  react: {
    react: versions.reactVersion,
    'react-dom': versions.reactDomVersion,
    '@astrojs/react': versions.astroJsReactVersion,
  },
  'solid-js': {
    'solid-js': versions.solidVersion,
    '@astrojs/solid-js': versions.astroJsSolidVersion,
  },
  vue: {
    vue: versions.vueVersion,
    '@astrojs/vue': versions.astroJsVueVersion,
  },
  svelte: {
    svelte: versions.svelteVersion,
    '@astrojs/svelte': versions.astroJsSvelteVersion,
  },
  preact: {
    preact: versions.preactVersion,
    '@astrojs/preact': versions.astroJsPreactVersion,
  },
};

// nx g @nx/react:application react-web
// nx g @nx/mithho:application astro-web --ig=react,solid-js
