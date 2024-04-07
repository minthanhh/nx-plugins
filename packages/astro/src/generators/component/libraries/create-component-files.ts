import { Tree, generateFiles } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { join } from 'path';

const integrationTypes = {
  react: '../files/react',
  astro: '../files/astro',
  'solid-js': '../files/solidjs',
  vue: '../files/vue',
  preact: '../files/preact',
  svelte: '../files/svelte',
};

export function createComponentFiles(tree: Tree, schema: NormalizedSchema) {
  console.log(`
    Integration ✨: "${schema.integrations} - is Array ${Array.isArray(schema.integrations)}"
    Directory ✨: "${schema.directory}"
  `);

  if (!Array.isArray(schema.integrations)) {
    generateFiles(tree, join(__dirname, integrationTypes[schema.integrations]), schema.directory, { ...schema, tmpl: '' });
    return;
  }

  for (const integration of schema.integrations) {
    generateFiles(tree, join(__dirname, integrationTypes[integration]), schema.directory, {
      ...schema,
      fileName: `${schema.fileName}${integration.replace(/[^a-zA-Z0-9]/g, '').replace(/^./, integration[0].toUpperCase())}`,
      tmpl: '',
    });
  }
}
