module.exports = {
  apps: [
    {
      name: 'api',
      script: './app/app.ts',
      args: '-T',
      watch: true,
      interpreter: './node_modules/.bin/ts-node',
      env: {
        TS_NODE_TRANSPILE_ONLY: 'true',
        TS_NODE_FILES: 'true'
      }
    }
  ]
};
