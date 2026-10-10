const { cpSync, mkdirSync, rmSync } = require('node:fs');
const { build } = require('esbuild');

async function buildApp() {
  rmSync('build', { recursive: true, force: true });
  mkdirSync('build/app', { recursive: true });
  await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: 'build/app',
    entryNames: 'index',
    assetNames: 'assets/[name]-[hash]',
    loader: { '.js': 'jsx' },
    jsx: 'automatic',
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'info',
  });
  cpSync('public/index.html', 'build/index.html');
  console.log('Production site is ready in the build directory.');
}

buildApp().catch((error) => {
  console.error('Could not build Campus Event Hub.', error);
  process.exitCode = 1;
});
