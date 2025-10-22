// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://the13thgeek.com',
  integrations: [react()],
  base: '/'
});