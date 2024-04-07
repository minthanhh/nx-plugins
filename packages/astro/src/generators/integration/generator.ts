import { GeneratorCallback, Tree, runTasksInSerial } from '@nx/devkit';
import { Schema } from './schema';
import { normalizeOptions } from './libraries/normalize-options';
import { astroConfigurationGenerator } from '../configuration/generator';

export async function integrationGenerator(tree: Tree, schema: Schema) {
  return integrationGeneratorInternal(tree, { ...schema });
}

async function integrationGeneratorInternal(tree: Tree, schema: Schema) {
  const normalizedOptions = await normalizeOptions(tree, schema);
  const tasks: GeneratorCallback[] = [];

  const astroConfigTask = await astroConfigurationGenerator(tree, { ...normalizedOptions });
  tasks.push(astroConfigTask);

  return runTasksInSerial(...tasks);
}
