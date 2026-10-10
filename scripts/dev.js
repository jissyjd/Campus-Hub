const { context } = require('esbuild');

async function start() {
  const ctx = await context({
    entryPoints: ['src/index.js'],
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: 'public/app',
    entryNames: 'index',
    assetNames: 'assets/[name]-[hash]',
    loader: { '.js': 'jsx' },
    jsx: 'automatic',
    sourcemap: true,
    define: { 'process.env.NODE_ENV': '"development"' },
    logLevel: 'info',
  });

  const server = await ctx.serve({ servedir: 'public', port: 3000 });
  console.log(`Campus Event Hub is running at http://localhost:${server.port}`);

  const stop = async () => {
    await ctx.dispose();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

start().catch((error) => {
  console.error('Could not start Campus Event Hub.', error);
  process.exitCode = 1;
});
