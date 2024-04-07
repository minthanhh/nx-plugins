import { GeneratorCallback, Tree, logger, offsetFromRoot, readProjectConfiguration, runTasksInSerial, readJson, formatFiles } from '@nx/devkit';
import { ConfigurationsGeneratorSchema } from './schema';
import { SupportedIntegrations } from '../../../typings/style';
import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';
import { ensureAstroConfigIsCorrect } from '@/utilities/astro-config-edit';

export async function astroConfigurationGenerator(tree: Tree, options: ConfigurationsGeneratorSchema) {
  return astroConfigurationGeneratorInternal(tree, { ...options });
}

async function astroConfigurationGeneratorInternal(tree: Tree, options: ConfigurationsGeneratorSchema) {
  const tasks: GeneratorCallback[] = [];
  let astroConfigContent = '';
  const { root: projectRoot } = readProjectConfiguration(tree, options.projectName);

  const astroConfigPath = `${projectRoot}/astro.config.mjs`;
  const buildOutDir = projectRoot === '.' ? `./dist/${options.projectName}` : `${offsetFromRoot(projectRoot)}dist/${projectRoot}`;
  const buildOptions = `
    outDir: '${buildOutDir}',
    build: {},
  `;
  const cacheDir = `cacheDir: '${offsetFromRoot(projectRoot)}node_modules/.astro',`;
  const [imports, integrations] = generateImportsAndIntegrations(tree, astroConfigPath, options.integrations);

  if (tree.exists(astroConfigPath)) {
    handleAstroConfigFile(tree, options, astroConfigPath, {
      offsetFromRoot: offsetFromRoot(projectRoot),
      integrations,
      buildOptions,
      cacheDir,
      imports,
    });
  }

  astroConfigContent = `
    import { defineConfig } from 'astro/config';
    ${imports.join('\n')}

    export default defineConfig({
      ${cacheDir}
      integrations: [${integrations.join(', ')}],
      ${buildOptions}
    });
  `;

  tree.write(astroConfigPath, astroConfigContent);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return runTasksInSerial(...tasks);
}

type ConfigFileOptions = {
  buildOptions: string;
  imports: string[];
  integrations: string[];
  cacheDir: string;
  offsetFromRoot: string;
};

function handleAstroConfigFile(tree: Tree, options: ConfigurationsGeneratorSchema, astroConfigPath: string, configFileOptions: ConfigFileOptions) {
  if (process.env.NX_VERBOSE_LOGGING === 'true') logger.info(`astro.config.mjs already exists for project ${options.projectName}.`);

  const buildOptionObject = {};

  const changed = ensureAstroConfigIsCorrect(
    tree,
    astroConfigPath,
    configFileOptions.imports,
    configFileOptions.integrations,
    configFileOptions.cacheDir,
    configFileOptions.buildOptions,
    buildOptionObject
  );

  if (!changed) {
    logger.warn(
      `Make sure the following setting exists in your Astro configuration file (${astroConfigPath}):

        ${configFileOptions.buildOptions}

        `
    );
  }
}

// const configIntegration = {
//   react: {},
//   preact: {},
//   solid: {},
//   vue: {},
//   svelte: {},
// };

function generateImportsAndIntegrations(tree: Tree, astroConfigPath: string, integrationOptions: SupportedIntegrations[] | SupportedIntegrations) {
  const imports: string[] = [];
  const integrations: string[] = [];

  if (!tree.exists(astroConfigPath)) {
    const astroIntegrations = filterAstroIntegrationDependencies(tree);
    if (astroIntegrations.length) {
      for (const integration of astroIntegrations) {
        const library = removeSpecialCharacters(integration.split('@astrojs/')[1]);
        imports.push(`import ${library} from "${integration}";`);
        integrations.push(`${library}()`);
      }
    }
  } else {
    if (!Array.isArray(integrationOptions)) {
      imports.push(`import ${removeSpecialCharacters(integrationOptions)})} from "@astrojs/${integrationOptions}";\n`);
      integrations.push(`${removeSpecialCharacters(integrationOptions)})}()`);
    } else {
      for (const integration of integrationOptions) {
        imports.push(`import ${removeSpecialCharacters(integration)} from "@astrojs/${integration}";\n`);
        integrations.push(`${removeSpecialCharacters(integration)}({ include: ['**/${removeSpecialCharacters(integration)}/*'] })`);
      }
    }
  }

  return [imports, integrations];
}

function removeSpecialCharacters(inputString: string) {
  return inputString.split('-')[0];
}

function filterAstroIntegrationDependencies(tree: Tree, packageJsonPath: string = 'package.json') {
  const currentPackageJson = readJson(tree, packageJsonPath);
  return Object.keys(currentPackageJson.dependencies ?? {}).filter((d) => d.includes('@astrojs') && d !== '@astrojs/check');
}

async function filterExistingIntegrationFile(projectRoot: string) {
  const extensions = ['.tsx', '.svelte', '.vue', '.mdoc', '.mdx', '.ts', '.js'];

  console.time('Integration sync');
  const integrations = findIntegrationWithExtensions(projectRoot, extensions);
  console.timeEnd('Integration sync');

  return integrations;
}

const integrations = [];
function findIntegrationWithExtensions(directoryPath: string, extensions: string[]) {
  const items = readdirSync(directoryPath);

  for (const item of items) {
    const itemPath = join(directoryPath, item);
    const stats = statSync(itemPath);

    if (stats.isDirectory()) findIntegrationWithExtensions(itemPath, extensions);
    if (!stats.isFile()) continue;

    const extensionName = extname(item);
    if (!extensions.includes(extensionName)) continue;
    console.log('findIntegrationWithExtensions extensionName', extensionName);

    if (['.tsx', '.jsx', '.js', '.ts'].includes(extensionName)) {
      const data = readFileSync(itemPath, 'utf8');
      const regexImport = /@astrojs\/(react|preact|starlight|solid-js)/;
      const regexTsConfig = /\/\*\* @jsxImportSource (react|solid-js|preact) \*\//;

      if (regexTsConfig.test(data)) integrations.push(data.match(regexTsConfig)[1]);
      if (regexImport.test(data)) integrations.push(data.match(regexImport)[1]);
    }

    if (['.svelte', '.vue', '.mdoc'].includes(extensionName)) {
      integrations.push(extensionName !== '.mdoc' ? extensionName.split('.')[1] : 'markdoc');
    }
  }
  return [...new Set(integrations)];
}
