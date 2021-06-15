import qs from 'qs';
import config from 'config';
import Server from '../../app/server';

const options = {
  host: config.get('hapi.host'),
  port: config.get('hapi.port'),
  app: { namespace: 'api' },
  debug: { request: ['error '] },
  query: { parser: (query) => qs.parse(query) }
};

export default async (controllers) => {
  const mockServer = Server(options);
  await mockServer.create();
  await mockServer.route(controllers);
  await mockServer.hello();
  return mockServer;
};
