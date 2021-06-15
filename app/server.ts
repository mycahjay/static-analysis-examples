import Hapi from '@hapi/hapi';

export default (options) => {
  const server = Hapi.server(options);
  server.create = async (...plugins) => {
    await server.register(plugins);
    server.app.namespace = 'api/v1';
    await server.initialize();
    console.log('⚡️ server initialized');
    console.log(`⚡️ NODE_ENV: ${process.env.NODE_ENV}`);
  };
  server.hello = async () => {
    await server.start();
    console.log(`🚀 server: ${options.host}:${options.port}`);
  };
  server.bye = async () => {
    console.log('goodbye 👊');
    await server.stop();
  };
  process.on('unhandledRejection', (error) => {
    console.log(error);
    process.exit(1);
  });
  return server;
};
