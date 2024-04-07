import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { astroConfigurationGenerator } from './generator';

describe('configurations generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await astroConfigurationGenerator(tree, {
      projectName: 'astro-web',
      integrations: [],
    });
    const { root } = readProjectConfiguration(tree, 'astro-web');
    expect(tree.exists(`${root}/astro.config.mjs`)).toBeTruthy();
  });
});
