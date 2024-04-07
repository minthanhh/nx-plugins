import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// https://astro.build/config
export default defineConfig({
  cacheDir: '../../node_modules/.astro',
  outDir: '../../dist/apps/nx-plugins-dev',
  build: {},
  integrations: [tailwind(), react()],
});
