import './lib/require-patch.ts';
import qs from 'qs';
import config from 'config';
import Server from './server';
import monitor from './monitor';
import controllers from './controllers';

// const url = 'https://s3.amazonaws.com/somebucket/tmp/hello.docx'; // testing shiftleft
const serverOptions = {
  host: config.get('hapi.host'),
  port: config.get('hapi.port'),
  app: { namespace: 'api' },
  debug: { request: ['error '] },
  query: { parser: (query) => qs.parse(query) }
};
const monitoringOptions = {
  host: config.get('hapi.metrics.host'),
  port: config.get('hapi.metrics.port')
};
const pinoPlugin = {
  plugin: require('hapi-pino'),
  options: {
    level: 'fatal',
    serializers: {
      user: (user) => user?.id,
      req: () => ({})
    }
  }
};
const init = async () => {
  await monitor.init(monitoringOptions);
  const server = Server(serverOptions);
  await server.create(pinoPlugin);
  await server.route(controllers);
  await server.hello();
};

init();
