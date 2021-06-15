import Hapi from '@hapi/hapi';
import monitoring from 'app/lib/monitoring';
import { version } from '../version.json';

const init = async (opts) => {
  monitoring.init(version);
  await monitoring.startServer(Hapi.server(opts));
  console.log(`🚀 metrics: ${opts.host}:${opts.port}`);
};

export default { init };
