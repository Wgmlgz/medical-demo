import { sveltekit } from '@sveltejs/kit/vite';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import extractorSvelte from '@unocss/extractor-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    UnoCSS({
      extractors: [extractorSvelte]
    }),
    sveltekit(),
    tsconfigPaths(),
    crossOriginIsolation(),
    topLevelAwait(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
  server: { port: 3000, cors: true },
  resolve: {
    alias: {
      '@cornerstonejs/dicom-image-loader':
        '@cornerstonejs/dicom-image-loader/dist/cornerstoneDICOMImageLoader.bundle.min.js'
    }
  },
});
