import { ChangeType, GeneratorCallback, StringChange, Tree, formatFiles, logger, runTasksInSerial } from '@nx/devkit';
import { ComponentGeneratorSchema } from './schema';
import { normalizeOptions } from './libraries/normalize-options';
import { createComponentFiles } from './libraries/create-component-files';
import { ensureTypescript } from '@nx/js/src/utils/typescript/ensure-typescript';
import { findNodes } from '@nx/js';
import type * as ts from 'typescript';
import { astroConfigurationGenerator } from '../configuration/generator';
import { astroInitGenerator } from '../init/generator';

export async function componentGenerator(tree: Tree, schema: ComponentGeneratorSchema) {
  return componentGeneratorIternal(tree, { nameAndDirectoryFormat: 'derived', ...schema });
}

// Command format like: "nx g @mithho/astro:component --name=ReactComponent --ig=react,astro,solid-js"

export async function componentGeneratorIternal(tree: Tree, schema: ComponentGeneratorSchema) {
  if (!schema.integrations.length) {
    logger.info('If you would like to generate component you have to one or more integrations. ✨');
    return;
  }

  const normalizedOptions = await normalizeOptions(tree, schema);
  const tasks: GeneratorCallback[] = [];

  console.log('FileName and Name ✨::', normalizedOptions.name, normalizedOptions.fileName);

  createComponentFiles(tree, { ...normalizedOptions });

  const astroConfigurationTask = await astroConfigurationGenerator(tree, {
    integrations: normalizedOptions.integrations,
    projectName: normalizedOptions.projectName,
  });
  tasks.push(astroConfigurationTask);
  const astroInitTask = await astroInitGenerator(tree, { integrations: normalizedOptions.integrations });
  tasks.push(astroInitTask);

  // addExportsToBarrel(tree, normalizedOptions);

  if (!schema.skipFormat) await formatFiles(tree);

  return runTasksInSerial(...tasks);
}

let tsModule: typeof import('typescript');

// function addExportsToBarrel(host: Tree, options: NormalizedSchema) {
//   if (!tsModule) {
//     tsModule = ensureTypescript();
//   }
//   const workspace = getProjects(host);
//   const isApp = workspace.get(options.projectName).projectType === 'application';

//   if (options.export && !isApp) {
//     const indexFilePath = joinPathFragments(options.projectSourceRoot, options.js ? 'index.js' : 'index.ts');
//     const indexSource = host.read(indexFilePath, 'utf-8');
//     if (indexSource !== null) {
//       const indexSourceFile = tsModule.createSourceFile(indexFilePath, indexSource, tsModule.ScriptTarget.Latest, true);
//       const relativePathFromIndex = getRelativeImportToFile(indexFilePath, options.filePath);
//       const changes = applyChangesToString(indexSource, addImport(indexSourceFile, `export * from '${relativePathFromIndex}';`));
//       host.write(indexFilePath, changes);
//     }
//   }
// }

// function getRelativeImportToFile(indexPath: string, filePath: string) {
//   const { name, dir } = parse(filePath);
//   const relativeDirToTarget = relative(dirname(indexPath), dir);
//   return `./${joinPathFragments(relativeDirToTarget, name)}`;
// }

export function addImport(source: ts.SourceFile, statement: string): StringChange[] {
  if (!tsModule) {
    tsModule = ensureTypescript();
  }

  const allImports = findNodes(source, tsModule.SyntaxKind.ImportDeclaration);
  if (allImports.length > 0) {
    const lastImport = allImports[allImports.length - 1];
    return [
      {
        type: ChangeType.Insert,
        index: lastImport.end + 1,
        text: `\n${statement}\n`,
      },
    ];
  } else {
    return [
      {
        type: ChangeType.Insert,
        index: 0,
        text: `\n${statement}\n`,
      },
    ];
  }
}

// nx g mithho/astro:component --name NxWelcome --integrations react,astro,solidjs
